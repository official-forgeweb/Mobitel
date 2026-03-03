"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function BrandsPage() {
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [showBrandForm, setShowBrandForm] = useState(false);
    const [showModelForm, setShowModelForm] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [editingModel, setEditingModel] = useState(null);
    const [brandForm, setBrandForm] = useState({ name: '', logo: '', displayOrder: 0 });
    const [modelForm, setModelForm] = useState({ name: '', image: '', displayOrder: 0 });

    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

    const fetchBrands = async () => {
        try {
            const res = await fetch(`${API}/api/brands`, { headers: headers() });
            setBrands(await res.json());
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const fetchModels = async (brandId) => {
        try {
            const res = await fetch(`${API}/api/device-models?brandId=${brandId}`, { headers: headers() });
            setModels(await res.json());
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchBrands(); }, []);
    useEffect(() => { if (selectedBrand) fetchModels(selectedBrand._id); }, [selectedBrand]);

    const saveBrand = async (e) => {
        e.preventDefault();
        const url = editingBrand ? `${API}/api/brands/${editingBrand}` : `${API}/api/brands`;
        const method = editingBrand ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(brandForm) });
        const data = await res.json();
        if (data.success || data.data) {
            setShowBrandForm(false); setEditingBrand(null);
            setBrandForm({ name: '', logo: '', displayOrder: 0 });
            fetchBrands();
        } else alert(data.error || 'Failed');
    };

    const saveModel = async (e) => {
        e.preventDefault();
        const url = editingModel ? `${API}/api/device-models/${editingModel}` : `${API}/api/device-models`;
        const method = editingModel ? 'PUT' : 'POST';
        const payload = { ...modelForm, brandId: selectedBrand._id };
        const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(payload) });
        const data = await res.json();
        if (data.success || data.data) {
            setShowModelForm(false); setEditingModel(null);
            setModelForm({ name: '', image: '', displayOrder: 0 });
            fetchModels(selectedBrand._id);
        } else alert(data.error || 'Failed');
    };

    const deleteBrand = async (id) => {
        if (!confirm('Delete this brand?')) return;
        await fetch(`${API}/api/brands/${id}`, { method: 'DELETE', headers: headers() });
        if (selectedBrand?._id === id) { setSelectedBrand(null); setModels([]); }
        fetchBrands();
    };

    const deleteModel = async (id) => {
        if (!confirm('Delete this model?')) return;
        await fetch(`${API}/api/device-models/${id}`, { method: 'DELETE', headers: headers() });
        fetchModels(selectedBrand._id);
    };

    const toggleBrandActive = async (brand) => {
        await fetch(`${API}/api/brands/${brand._id}`, {
            method: 'PUT', headers: headers(), body: JSON.stringify({ isActive: !brand.isActive })
        });
        fetchBrands();
    };

    return (
        <div className="animate-in fade-in">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Brands & Models</h1>
                <p className="text-sm text-gray-500">Manage device brands and their models</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Brands */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-900 dark:text-white">Brands ({brands.length})</h2>
                        <button onClick={() => { setBrandForm({ name: '', logo: '', displayOrder: 0 }); setEditingBrand(null); setShowBrandForm(true); }}
                            className="px-3 py-1.5 text-xs bg-primary text-white rounded-lg hover:bg-primary/90">+ Add Brand</button>
                    </div>
                    <div className="divide-y dark:divide-gray-700 max-h-[60vh] overflow-y-auto">
                        {brands.map(b => (
                            <div key={b._id} onClick={() => setSelectedBrand(b)}
                                className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedBrand?._id === b._id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-primary' : ''}`}>
                                <div className="flex items-center gap-3">
                                    {b.logo ? <img src={b.logo} alt={b.name} className="w-8 h-8 object-contain rounded" /> :
                                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-bold">{b.name.charAt(0)}</div>}
                                    <span className="font-medium text-sm text-gray-900 dark:text-white">{b.name}</span>
                                    {!b.isActive && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded">Inactive</span>}
                                </div>
                                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                    <button onClick={() => toggleBrandActive(b)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-xs">
                                        {b.isActive ? '🟢' : '🔴'}
                                    </button>
                                    <button onClick={() => { setBrandForm({ name: b.name, logo: b.logo || '', displayOrder: b.displayOrder || 0 }); setEditingBrand(b._id); setShowBrandForm(true); }}
                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-xs">✏️</button>
                                    <button onClick={() => deleteBrand(b._id)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-xs">🗑️</button>
                                </div>
                            </div>
                        ))}
                        {!loading && !brands.length && <p className="p-6 text-center text-gray-500 text-sm">No brands yet</p>}
                    </div>
                </div>

                {/* Models */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            {selectedBrand ? `${selectedBrand.name} Models (${models.length})` : 'Select a brand'}
                        </h2>
                        {selectedBrand && (
                            <button onClick={() => { setModelForm({ name: '', image: '', displayOrder: 0 }); setEditingModel(null); setShowModelForm(true); }}
                                className="px-3 py-1.5 text-xs bg-primary text-white rounded-lg hover:bg-primary/90">+ Add Model</button>
                        )}
                    </div>
                    <div className="divide-y dark:divide-gray-700 max-h-[60vh] overflow-y-auto">
                        {models.map(m => (
                            <div key={m._id} className="p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <div className="flex items-center gap-3">
                                    {m.image ? <img src={m.image} alt={m.name} className="w-8 h-8 object-contain rounded" /> :
                                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-xs">📱</div>}
                                    <span className="font-medium text-sm text-gray-900 dark:text-white">{m.name}</span>
                                    {!m.isActive && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded">Inactive</span>}
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => { setModelForm({ name: m.name, image: m.image || '', displayOrder: m.displayOrder || 0 }); setEditingModel(m._id); setShowModelForm(true); }}
                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-xs">✏️</button>
                                    <button onClick={() => deleteModel(m._id)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-xs">🗑️</button>
                                </div>
                            </div>
                        ))}
                        {selectedBrand && !models.length && <p className="p-6 text-center text-gray-500 text-sm">No models for this brand</p>}
                        {!selectedBrand && <p className="p-6 text-center text-gray-400 text-sm">← Select a brand to see its models</p>}
                    </div>
                </div>
            </div>

            {/* Brand Form Modal */}
            {showBrandForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBrandForm(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{editingBrand ? 'Edit' : 'Add'} Brand</h3>
                        <form onSubmit={saveBrand} className="space-y-3">
                            <input required placeholder="Brand name *" value={brandForm.name} onChange={e => setBrandForm({ ...brandForm, name: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <input placeholder="Logo URL" value={brandForm.logo} onChange={e => setBrandForm({ ...brandForm, logo: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <input type="number" placeholder="Display order" value={brandForm.displayOrder}
                                onChange={e => setBrandForm({ ...brandForm, displayOrder: parseInt(e.target.value) || 0 })}
                                className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowBrandForm(false)} className="px-4 py-2 text-sm border rounded-lg dark:border-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm bg-primary text-white rounded-lg">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Model Form Modal */}
            {showModelForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModelForm(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{editingModel ? 'Edit' : 'Add'} Model for {selectedBrand?.name}</h3>
                        <form onSubmit={saveModel} className="space-y-3">
                            <input required placeholder="Model name *" value={modelForm.name} onChange={e => setModelForm({ ...modelForm, name: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <input placeholder="Image URL" value={modelForm.image} onChange={e => setModelForm({ ...modelForm, image: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <input type="number" placeholder="Display order" value={modelForm.displayOrder}
                                onChange={e => setModelForm({ ...modelForm, displayOrder: parseInt(e.target.value) || 0 })}
                                className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowModelForm(false)} className="px-4 py-2 text-sm border rounded-lg dark:border-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm bg-primary text-white rounded-lg">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
