"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

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

    const SafeImage = ({ src, alt, fallback, className }) => {
        const [error, setError] = useState(false);
        if (error || !src) return fallback;
        return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
    };

    return (
        <div className="animate-in fade-in">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Brands & Models</h1>
                <p className="text-sm text-gray-500">Manage device brands and their models</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Brands */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                             <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                             Brands ({brands.length})
                        </h2>
                        <button onClick={() => { setBrandForm({ name: '', logo: '', displayOrder: 0 }); setEditingBrand(null); setShowBrandForm(true); }}
                            className="px-4 py-2 text-xs bg-primary text-white rounded-lg font-bold hover:bg-primary/90 shadow-sm transition-all">+ Add Brand</button>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
                        {brands.map(b => (
                            <div key={b._id} onClick={() => setSelectedBrand(b)}
                                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${selectedBrand?._id === b._id ? 'bg-blue-50/50 border-l-4 border-primary' : 'border-l-4 border-transparent'}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1 shadow-sm overflow-hidden">
                                        <SafeImage 
                                            src={b.logo} 
                                            alt={b.name} 
                                            className="w-full h-full object-contain"
                                            fallback={<span className="text-lg font-bold text-primary">{b.name.charAt(0)}</span>}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">{b.name}</p>
                                        {!b.isActive && <span className="inline-block px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded border border-red-100">Hidden</span>}
                                    </div>
                                </div>
                                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                    <button onClick={() => toggleBrandActive(b)} title={b.isActive ? 'Deactivate' : 'Activate'} 
                                        className={`p-1.5 rounded-lg transition-colors ${b.isActive ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </button>
                                    <button onClick={() => { setBrandForm({ name: b.name, logo: b.logo || '', displayOrder: b.displayOrder || 0 }); setEditingBrand(b._id); setShowBrandForm(true); }}
                                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button onClick={() => deleteBrand(b._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {!loading && !brands.length && (
                            <div className="p-12 text-center text-gray-500">
                                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                <p className="text-sm font-medium">No brands found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Models */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            {selectedBrand ? `${selectedBrand.name} Models (${models.length})` : 'Models List'}
                        </h2>
                        {selectedBrand && (
                            <button onClick={() => { setModelForm({ name: '', image: '', displayOrder: 0 }); setEditingModel(null); setShowModelForm(true); }}
                                className="px-4 py-2 text-xs bg-primary text-white rounded-lg font-bold hover:bg-primary/90 shadow-sm transition-all">+ Add Model</button>
                        )}
                    </div>
                    <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
                        {models.map(m => (
                            <div key={m._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1 shadow-sm overflow-hidden">
                                        <SafeImage 
                                            src={m.image} 
                                            alt={m.name} 
                                            className="w-full h-full object-contain"
                                            fallback={<span className="text-sm font-bold text-gray-400">📱</span>}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">{m.name}</p>
                                        {!m.isActive && <span className="inline-block px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded border border-red-100">Inactive</span>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setModelForm({ name: m.name, image: m.image || '', displayOrder: m.displayOrder || 0 }); setEditingModel(m._id); setShowModelForm(true); }}
                                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button onClick={() => deleteModel(m._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {selectedBrand && !models.length && (
                            <div className="p-12 text-center text-gray-500 italic">
                                <p className="text-sm">No models added for {selectedBrand.name}</p>
                            </div>
                        )}
                        {!selectedBrand && (
                            <div className="p-12 text-center text-gray-400">
                                <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                                <p className="text-sm font-medium">Select a brand from the list to manage its models</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* Brand Form Modal */}
            {showBrandForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBrandForm(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4 text-gray-900">{editingBrand ? 'Edit' : 'Add'} Brand</h3>
                        <form onSubmit={saveBrand} className="space-y-3">
                            <input required placeholder="Brand name *" value={brandForm.name} onChange={e => setBrandForm({ ...brandForm, name: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm" />
                            <input placeholder="Logo URL" value={brandForm.logo} onChange={e => setBrandForm({ ...brandForm, logo: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm" />
                            <input type="number" placeholder="Display order" value={brandForm.displayOrder}
                                onChange={e => setBrandForm({ ...brandForm, displayOrder: parseInt(e.target.value) || 0 })}
                                className="w-full border rounded-lg px-3 py-2 text-sm" />
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowBrandForm(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm bg-primary text-white rounded-lg">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Model Form Modal */}
            {showModelForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModelForm(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4 text-gray-900">{editingModel ? 'Edit' : 'Add'} Model for {selectedBrand?.name}</h3>
                        <form onSubmit={saveModel} className="space-y-3">
                            <input required placeholder="Model name *" value={modelForm.name} onChange={e => setModelForm({ ...modelForm, name: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm" />
                            <input placeholder="Image URL" value={modelForm.image} onChange={e => setModelForm({ ...modelForm, image: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm" />
                            <input type="number" placeholder="Display order" value={modelForm.displayOrder}
                                onChange={e => setModelForm({ ...modelForm, displayOrder: parseInt(e.target.value) || 0 })}
                                className="w-full border rounded-lg px-3 py-2 text-sm" />
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowModelForm(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm bg-primary text-white rounded-lg">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
