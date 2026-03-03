"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function PricingPage() {
    const [pricing, setPricing] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ brandId: '', modelId: '', serviceId: '' });
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ brandId: '', modelId: '', serviceId: '', price: '', priceMax: '', estimatedTime: '', isAvailable: true });
    const [filteredModels, setFilteredModels] = useState([]);

    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

    const fetchAll = async () => {
        try {
            const [b, s] = await Promise.all([
                fetch(`${API}/api/brands`).then(r => r.json()),
                fetch(`${API}/api/services`).then(r => r.json()),
            ]);
            setBrands(b); setServices(s);
        } catch (err) { console.error(err); }
    };

    const fetchPricing = async () => {
        const params = new URLSearchParams();
        if (filters.brandId) params.set('brandId', filters.brandId);
        if (filters.modelId) params.set('modelId', filters.modelId);
        if (filters.serviceId) params.set('serviceId', filters.serviceId);
        try {
            const res = await fetch(`${API}/api/pricing?${params}`, { headers: headers() });
            setPricing(await res.json());
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const fetchModelsForBrand = async (brandId) => {
        if (!brandId) { setFilteredModels([]); setModels([]); return; }
        try {
            const res = await fetch(`${API}/api/device-models?brandId=${brandId}`);
            const data = await res.json();
            setFilteredModels(data); setModels(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchAll(); }, []);
    useEffect(() => { fetchPricing(); }, [filters]);
    useEffect(() => { fetchModelsForBrand(filters.brandId); }, [filters.brandId]);
    useEffect(() => { if (form.brandId) fetchModelsForBrand(form.brandId); }, [form.brandId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, price: parseFloat(form.price), priceMax: form.priceMax ? parseFloat(form.priceMax) : null };
        const url = editingId ? `${API}/api/pricing/${editingId}` : `${API}/api/pricing`;
        const method = editingId ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(payload) });
        const data = await res.json();
        if (data.success || data.data) { setShowForm(false); setEditingId(null); fetchPricing(); } else alert(data.error || 'Failed');
    };

    const deletePricing = async (id) => {
        if (!confirm('Delete?')) return;
        await fetch(`${API}/api/pricing/${id}`, { method: 'DELETE', headers: headers() });
        fetchPricing();
    };

    return (
        <div className="animate-in fade-in">
            <header className="mb-6 flex justify-between items-center">
                <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pricing Matrix</h1><p className="text-sm text-gray-500">Brand × Model × Service pricing</p></div>
                <button onClick={() => { setForm({ brandId: '', modelId: '', serviceId: '', price: '', priceMax: '', estimatedTime: '', isAvailable: true }); setEditingId(null); setShowForm(true); }}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">+ Add Pricing</button>
            </header>

            <div className="flex flex-wrap gap-3 mb-5">
                <select value={filters.brandId} onChange={e => setFilters({ ...filters, brandId: e.target.value, modelId: '' })} className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                    <option value="">All Brands</option>{brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
                <select value={filters.modelId} onChange={e => setFilters({ ...filters, modelId: e.target.value })} className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                    <option value="">All Models</option>{filteredModels.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
                <select value={filters.serviceId} onChange={e => setFilters({ ...filters, serviceId: e.target.value })} className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                    <option value="">All Services</option>{services.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 tracking-wider">
                            <th className="p-3">Brand</th><th className="p-3">Model</th><th className="p-3">Service</th><th className="p-3">Price</th><th className="p-3">Est. Time</th><th className="p-3">Status</th><th className="p-3">Actions</th>
                        </tr></thead>
                        <tbody className="divide-y dark:divide-gray-700">
                            {pricing.map(p => (
                                <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3 text-gray-900 dark:text-white">{p.brandId?.name || '-'}</td>
                                    <td className="p-3">{p.modelId?.name || '-'}</td>
                                    <td className="p-3">{p.serviceId?.name || '-'}</td>
                                    <td className="p-3 font-semibold text-gray-900 dark:text-white">₹{p.price}{p.priceMax ? ` - ₹${p.priceMax}` : ''}</td>
                                    <td className="p-3 text-gray-500">{p.estimatedTime || '-'}</td>
                                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.isAvailable ? 'Available' : 'Unavailable'}</span></td>
                                    <td className="p-3 flex gap-2">
                                        <button onClick={() => { setForm({ brandId: p.brandId?._id, modelId: p.modelId?._id, serviceId: p.serviceId?._id, price: p.price, priceMax: p.priceMax || '', estimatedTime: p.estimatedTime || '', isAvailable: p.isAvailable }); setEditingId(p._id); setShowForm(true); }} className="text-blue-500 text-xs hover:underline">Edit</button>
                                        <button onClick={() => deletePricing(p._id)} className="text-red-500 text-xs hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && !pricing.length && <p className="p-6 text-center text-gray-500">No pricing entries. Add brand, models, and services first.</p>}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4 dark:text-white">{editingId ? 'Edit' : 'Add'} Pricing</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <select required value={form.brandId} onChange={e => setForm({ ...form, brandId: e.target.value, modelId: '' })} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="">Select Brand *</option>{brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                            </select>
                            <select required value={form.modelId} onChange={e => setForm({ ...form, modelId: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="">Select Model *</option>{models.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                            </select>
                            <select required value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="">Select Service *</option>{services.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                            </select>
                            <div className="grid grid-cols-2 gap-3">
                                <input required type="number" placeholder="Price *" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                <input type="number" placeholder="Max price (optional)" value={form.priceMax} onChange={e => setForm({ ...form, priceMax: e.target.value })} className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <input placeholder="Estimated time (e.g., 1-2 hours)" value={form.estimatedTime} onChange={e => setForm({ ...form, estimatedTime: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} /> Available</label>
                            <div className="flex justify-end gap-3"><button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border rounded-lg dark:border-gray-600">Cancel</button><button type="submit" className="px-4 py-2 text-sm bg-primary text-white rounded-lg">Save</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
