"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

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
                <div><h1 className="text-2xl font-bold text-gray-900">Pricing Matrix</h1><p className="text-sm text-gray-500 font-medium">Manage Brand × Model × Service pricing rates</p></div>
                <button onClick={() => { setForm({ brandId: '', modelId: '', serviceId: '', price: '', priceMax: '', estimatedTime: '', isAvailable: true }); setEditingId(null); setShowForm(true); }}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    Add Pricing
                </button>
            </header>

            <div className="flex flex-wrap gap-3 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Brand Filter</label>
                    <select value={filters.brandId} onChange={e => setFilters({ ...filters, brandId: e.target.value, modelId: '' })} 
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                        <option value="">All Brands</option>{brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Model Filter</label>
                    <select value={filters.modelId} onChange={e => setFilters({ ...filters, modelId: e.target.value })} 
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                        <option value="">All Models</option>{filteredModels.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Service Filter</label>
                    <select value={filters.serviceId} onChange={e => setFilters({ ...filters, serviceId: e.target.value })} 
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                        <option value="">All Services</option>{services.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                            <th className="p-4">Brand / Model</th><th className="p-4">Service</th><th className="p-4">Rate (₹)</th><th className="p-4">Estimates</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th>
                        </tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {pricing.map(p => (
                                <tr key={p._id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">{p.brandId?.name || '-'}</div>
                                        <div className="text-[11px] text-gray-500 font-medium">{p.modelId?.name || 'All Models'}</div>
                                    </td>
                                    <td className="p-4 text-gray-700 font-medium">{p.serviceId?.name || 'Standard Service'}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-primary">₹{p.price}{p.priceMax ? ` - ₹${p.priceMax}` : ''}</div>
                                    </td>
                                    <td className="p-4 text-gray-500 font-medium italic text-xs">{p.estimatedTime || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.isAvailable ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                            {p.isAvailable ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => { setForm({ brandId: p.brandId?._id, modelId: p.modelId?._id, serviceId: p.serviceId?._id, price: p.price, priceMax: p.priceMax || '', estimatedTime: p.estimatedTime || '', isAvailable: p.isAvailable }); setEditingId(p._id); setShowForm(true); }} 
                                                className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                            <button onClick={() => deletePricing(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && !pricing.length && (
                    <div className="p-20 text-center text-gray-400">
                         <svg className="w-20 h-20 mx-auto mb-4 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                         <p className="font-bold text-sm">No pricing entries found</p>
                    </div>
                )}
            </div>


            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">{editingId ? 'Edit' : 'Add'} Rate</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 p-1">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Brand</label>
                                    <select required value={form.brandId} onChange={e => setForm({ ...form, brandId: e.target.value, modelId: '' })} 
                                        className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none">
                                        <option value="">Select Brand *</option>{brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Model</label>
                                    <select required value={form.modelId} onChange={e => setForm({ ...form, modelId: e.target.value })} 
                                        className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none">
                                        <option value="">Select Model *</option>{models.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Service Type</label>
                                <select required value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value })} 
                                    className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none">
                                    <option value="">Select Service *</option>{services.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Min Price (₹)</label>
                                    <input required type="number" placeholder="0.00" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} 
                                        className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Max Price (₹)</label>
                                    <input type="number" placeholder="Optional" value={form.priceMax} onChange={e => setForm({ ...form, priceMax: e.target.value })} 
                                        className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Estimated Time</label>
                                <input placeholder="e.g., 30-45 Mins, 1 Day" value={form.estimatedTime} onChange={e => setForm({ ...form, estimatedTime: e.target.value })} 
                                    className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <input type="checkbox" id="avail" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} /> 
                                <label htmlFor="avail" className="text-sm font-bold text-gray-700 cursor-pointer">Service Available for Online Booking</label>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowForm(false)} 
                                    className="flex-1 px-4 py-3.5 text-sm font-bold border border-gray-100 rounded-2xl bg-white hover:bg-gray-50 text-gray-500 transition-all">Cancel</button>
                                <button type="submit" 
                                    className="flex-2 px-8 py-3.5 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all">
                                    Confirm Rate
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
