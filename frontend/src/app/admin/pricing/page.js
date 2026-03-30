"use client"
import { useState, useEffect, useMemo } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://www.mobitel.in';

export default function PricingPage() {
    const [pricing, setPricing] = useState([]);
    const [brands, setBrands] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ brandId: '', modelId: '', serviceId: '' });
    const [filteredModels, setFilteredModels] = useState([]);

    // Edit single pricing
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ brandId: '', modelId: '', serviceId: '', price: '', priceMax: '', estimatedTime: '', isAvailable: true });
    const [editModels, setEditModels] = useState([]);

    // Bulk add pricing
    const [showBulkForm, setShowBulkForm] = useState(false);
    const [queueBrandId, setQueueBrandId] = useState('');
    const [queueModelId, setQueueModelId] = useState('');
    const [queueModels, setQueueModels] = useState([]);
    const [selectedQueue, setSelectedQueue] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    // Service queue for bulk add
    const [serviceQueue, setServiceQueue] = useState([]);
    const [svcForm, setSvcForm] = useState({ serviceId: '', price: '', priceMax: '', estimatedTime: '', isAvailable: true });

    // View
    const [viewMode, setViewMode] = useState('grouped');
    const [expandedBrands, setExpandedBrands] = useState(new Set());

    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

    // ── DATA FETCHING ──
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

    const fetchModelsForBrand = async (brandId, setter) => {
        if (!brandId) { setter([]); return; }
        try {
            const res = await fetch(`${API}/api/device-models?brandId=${brandId}`);
            setter(await res.json());
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchAll(); }, []);
    useEffect(() => { fetchPricing(); }, [filters]);
    useEffect(() => { fetchModelsForBrand(filters.brandId, setFilteredModels); }, [filters.brandId]);
    useEffect(() => { fetchModelsForBrand(queueBrandId, setQueueModels); }, [queueBrandId]);
    useEffect(() => { if (editForm.brandId) fetchModelsForBrand(editForm.brandId, setEditModels); }, [editForm.brandId]);

    // ── QUEUE MANAGEMENT ──
    const addToQueue = () => {
        if (!queueBrandId || !queueModelId) return;
        if (selectedQueue.some(q => q.modelId === queueModelId)) return;
        const brand = brands.find(b => b._id === queueBrandId);
        const model = queueModels.find(m => m._id === queueModelId);
        setSelectedQueue(prev => [...prev, { brandId: queueBrandId, brandName: brand?.name || '', modelId: queueModelId, modelName: model?.name || '' }]);
        setQueueModelId('');
    };

    const addAllModels = () => {
        if (!queueBrandId || !queueModels.length) return;
        const brand = brands.find(b => b._id === queueBrandId);
        const newItems = queueModels
            .filter(m => !selectedQueue.some(q => q.modelId === m._id))
            .map(m => ({ brandId: queueBrandId, brandName: brand?.name || '', modelId: m._id, modelName: m.name }));
        setSelectedQueue(prev => [...prev, ...newItems]);
    };

    const removeFromQueue = (modelId) => setSelectedQueue(prev => prev.filter(q => q.modelId !== modelId));

    const queueGrouped = useMemo(() => {
        const groups = {};
        selectedQueue.forEach(item => {
            if (!groups[item.brandId]) groups[item.brandId] = { brandName: item.brandName, items: [] };
            groups[item.brandId].items.push(item);
        });
        return Object.values(groups);
    }, [selectedQueue]);

    // ── SERVICE QUEUE MANAGEMENT ──
    const addServiceToQueue = () => {
        if (!svcForm.serviceId || !svcForm.price) return;
        if (serviceQueue.some(s => s.serviceId === svcForm.serviceId)) return alert('This service is already in the queue');
        const svc = services.find(s => s._id === svcForm.serviceId);
        setServiceQueue(prev => [...prev, { ...svcForm, serviceName: svc?.name || '', price: svcForm.price, priceMax: svcForm.priceMax }]);
        setSvcForm({ serviceId: '', price: '', priceMax: '', estimatedTime: '', isAvailable: true });
    };

    const removeServiceFromQueue = (serviceId) => setServiceQueue(prev => prev.filter(s => s.serviceId !== serviceId));

    // ── SUBMIT HANDLERS ──
    const handleBulkSubmit = async (e) => {
        e.preventDefault();
        if (!selectedQueue.length) return alert('Please add at least one model to the queue');
        if (!serviceQueue.length) return alert('Please add at least one service with pricing');
        setSubmitting(true);
        // Create items for every model × service combination
        const items = [];
        for (const model of selectedQueue) {
            for (const svc of serviceQueue) {
                items.push({
                    brandId: model.brandId, modelId: model.modelId, serviceId: svc.serviceId,
                    price: parseFloat(svc.price), priceMax: svc.priceMax ? parseFloat(svc.priceMax) : null,
                    estimatedTime: svc.estimatedTime, isAvailable: svc.isAvailable
                });
            }
        }
        try {
            const res = await fetch(`${API}/api/pricing/bulk`, { method: 'POST', headers: headers(), body: JSON.stringify({ items }) });
            const data = await res.json();
            if (data.success) {
                setShowBulkForm(false); setSelectedQueue([]); setServiceQueue([]); setQueueBrandId(''); setQueueModelId('');
                setSvcForm({ serviceId: '', price: '', priceMax: '', estimatedTime: '', isAvailable: true });
                fetchPricing();
            } else alert(data.error || 'Failed');
        } catch (err) { console.error(err); alert('Error applying bulk pricing'); }
        setSubmitting(false);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...editForm, price: parseFloat(editForm.price), priceMax: editForm.priceMax ? parseFloat(editForm.priceMax) : null };
        const res = await fetch(`${API}/api/pricing/${editingId}`, { method: 'PUT', headers: headers(), body: JSON.stringify(payload) });
        const data = await res.json();
        if (data.success || data.data) { setShowEditForm(false); setEditingId(null); fetchPricing(); } else alert(data.error || 'Failed');
    };

    const deletePricing = async (id) => {
        if (!confirm('Delete this pricing entry?')) return;
        await fetch(`${API}/api/pricing/${id}`, { method: 'DELETE', headers: headers() });
        fetchPricing();
    };

    // ── GROUPED DATA ──
    const groupedPricing = useMemo(() => {
        const groups = {};
        pricing.forEach(p => {
            const bId = p.brandId?._id || 'unknown';
            if (!groups[bId]) groups[bId] = { name: p.brandId?.name || '?', id: bId, models: {} };
            const mId = p.modelId?._id || 'unknown';
            if (!groups[bId].models[mId]) groups[bId].models[mId] = { name: p.modelId?.name || '?', id: mId, services: [] };
            groups[bId].models[mId].services.push(p);
        });
        return Object.values(groups).map(b => ({ ...b, models: Object.values(b.models) }));
    }, [pricing]);

    const toggleBrand = (id) => {
        setExpandedBrands(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    };

    useEffect(() => { setExpandedBrands(new Set(groupedPricing.map(b => b.id))); }, [groupedPricing]);

    // ── ICONS ──
    const EditIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
    const DeleteIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
    const CloseIcon = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>;
    const ChevronIcon = ({ open }) => <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;

    return (
        <div className="animate-in fade-in">
            {/* ── HEADER ── */}
            <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pricing Matrix</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage Brand × Model × Service pricing rates</p>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
                        <button onClick={() => setViewMode('grouped')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'grouped' ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>Grouped</button>
                        <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>Table</button>
                    </div>
                    <button onClick={async () => {
                        if (!filters.brandId || !filters.modelId) return alert('Select a Brand and Model from filters first.');
                        if (!confirm(`Initialize defaults for ${filteredModels.find(m => m._id === filters.modelId)?.name}?`)) return;
                        const res = await fetch(`${API}/api/pricing/initialize`, { method: 'POST', headers: headers(), body: JSON.stringify({ brandId: filters.brandId, modelId: filters.modelId }) });
                        const data = await res.json();
                        alert(`Initialized ${data.initialized} services.`); fetchPricing();
                    }} className="px-4 py-2.5 bg-indigo-500 text-white rounded-xl font-bold text-xs hover:bg-indigo-600 shadow-lg shadow-indigo-200 transition-all">
                        Init Defaults
                    </button>
                    <button onClick={() => { setShowBulkForm(true); setSelectedQueue([]); setServiceQueue([]); setSvcForm({ serviceId: '', price: '', priceMax: '', estimatedTime: '', isAvailable: true }); setQueueBrandId(''); setQueueModelId(''); }}
                        className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        Add Pricing
                    </button>
                </div>
            </header>

            {/* ── FILTERS ── */}
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

            {/* ── GROUPED VIEW ── */}
            {viewMode === 'grouped' && (
                <div className="space-y-4">
                    {groupedPricing.map(brand => (
                        <div key={brand.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <button onClick={() => toggleBrand(brand.id)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg">{brand.name.charAt(0)}</div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-bold text-gray-900">{brand.name}</h3>
                                        <p className="text-xs text-gray-400 font-medium">{brand.models.length} model{brand.models.length !== 1 ? 's' : ''} · {brand.models.reduce((a, m) => a + m.services.length, 0)} entries</p>
                                    </div>
                                </div>
                                <ChevronIcon open={expandedBrands.has(brand.id)} />
                            </button>
                            {expandedBrands.has(brand.id) && (
                                <div className="border-t border-gray-100">
                                    {brand.models.map((model, mIdx) => (
                                        <div key={model.id} className={mIdx > 0 ? 'border-t border-gray-100' : ''}>
                                            <div className="px-6 py-3 bg-gray-50/70 flex items-center gap-2">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                                <h4 className="text-sm font-bold text-gray-700">{model.name}</h4>
                                                <span className="text-[10px] text-gray-400 font-medium">({model.services.length} services)</span>
                                            </div>
                                            <div className="divide-y divide-gray-50">
                                                {model.services.map(p => (
                                                    <div key={p._id} className="flex items-center justify-between px-6 py-3 hover:bg-blue-50/30 transition-colors group">
                                                        <div className="flex items-center gap-4 flex-1 min-w-0 flex-wrap">
                                                            <span className="text-sm text-gray-700 font-medium min-w-[140px]">{p.serviceId?.name || 'Service'}</span>
                                                            <span className="font-bold text-primary text-sm whitespace-nowrap">₹{p.price}{p.priceMax ? ` – ₹${p.priceMax}` : ''}</span>
                                                            {p.estimatedTime && <span className="text-xs text-gray-400 italic">{p.estimatedTime}</span>}
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.isAvailable ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                                                {p.isAvailable ? 'Active' : 'Off'}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                            <button onClick={() => { setEditForm({ brandId: p.brandId?._id, modelId: p.modelId?._id, serviceId: p.serviceId?._id, price: p.price, priceMax: p.priceMax || '', estimatedTime: p.estimatedTime || '', isAvailable: p.isAvailable }); setEditingId(p._id); setShowEditForm(true); }}
                                                                className="p-2 text-primary hover:bg-primary/5 rounded-lg"><EditIcon /></button>
                                                            <button onClick={() => deletePricing(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><DeleteIcon /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {!loading && !pricing.length && (
                        <div className="p-20 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
                            <svg className="w-20 h-20 mx-auto mb-4 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <p className="font-bold text-sm">No pricing entries found</p>
                        </div>
                    )}
                </div>
            )}

            {/* ── TABLE VIEW ── */}
            {viewMode === 'table' && (
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
                                        <td className="p-4"><div className="font-bold text-primary">₹{p.price}{p.priceMax ? ` - ₹${p.priceMax}` : ''}</div></td>
                                        <td className="p-4 text-gray-500 font-medium italic text-xs">{p.estimatedTime || 'N/A'}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.isAvailable ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                                {p.isAvailable ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => { setEditForm({ brandId: p.brandId?._id, modelId: p.modelId?._id, serviceId: p.serviceId?._id, price: p.price, priceMax: p.priceMax || '', estimatedTime: p.estimatedTime || '', isAvailable: p.isAvailable }); setEditingId(p._id); setShowEditForm(true); }}
                                                    className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"><EditIcon /></button>
                                                <button onClick={() => deletePricing(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><DeleteIcon /></button>
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
            )}

            {/* ══════════════════════════════════════════════ */}
            {/* ── BULK ADD PRICING MODAL ── */}
            {/* ══════════════════════════════════════════════ */}
            {showBulkForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowBulkForm(false)}>
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100 shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Add Pricing</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Apply multiple services to multiple models at once</p>
                            </div>
                            <button onClick={() => setShowBulkForm(false)} className="text-gray-400 hover:text-gray-600 p-1">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto p-6 space-y-6 flex-1">
                            {/* STEP 1 — SELECT MODELS */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">1</div>
                                    <h4 className="text-sm font-bold text-gray-900">Select Models</h4>
                                </div>
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1 space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Brand</label>
                                        <select value={queueBrandId} onChange={e => { setQueueBrandId(e.target.value); setQueueModelId(''); }}
                                            className="w-full border border-gray-100 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none">
                                            <option value="">Select Brand</option>{brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Model</label>
                                        <select value={queueModelId} onChange={e => setQueueModelId(e.target.value)}
                                            className="w-full border border-gray-100 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none">
                                            <option value="">Select Model</option>{queueModels.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                                        </select>
                                    </div>
                                    <button type="button" onClick={addToQueue} disabled={!queueBrandId || !queueModelId}
                                        className="px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed">
                                        + Add
                                    </button>
                                </div>
                                {queueBrandId && queueModels.length > 0 && (
                                    <button type="button" onClick={addAllModels}
                                        className="mt-2 text-xs font-bold text-primary hover:text-primary/70 transition-colors flex items-center gap-1 ml-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                        Add all {queueModels.length} models of {brands.find(b => b._id === queueBrandId)?.name}
                                    </button>
                                )}
                            </div>

                            {/* QUEUE DISPLAY */}
                            {selectedQueue.length > 0 && (
                                <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border border-gray-100">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold text-gray-600">
                                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold mr-1.5">{selectedQueue.length}</span>
                                            Models Selected
                                        </span>
                                        <button type="button" onClick={() => setSelectedQueue([])} className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors">Clear All</button>
                                    </div>
                                    <div className="space-y-3">
                                        {queueGrouped.map(group => (
                                            <div key={group.brandName}>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-0.5">{group.brandName}</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {group.items.map(item => (
                                                        <span key={item.modelId} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm hover:border-red-200 hover:bg-red-50/50 transition-all group/chip">
                                                            {item.modelName}
                                                            <button type="button" onClick={() => removeFromQueue(item.modelId)} className="text-gray-300 group-hover/chip:text-red-500 transition-colors">
                                                                <CloseIcon />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* STEP 2 — ADD SERVICES & PRICES */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">2</div>
                                    <h4 className="text-sm font-bold text-gray-900">Add Services & Prices</h4>
                                </div>

                                {/* Service input form */}
                                <div className="space-y-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1 col-span-2 sm:col-span-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Service</label>
                                            <select value={svcForm.serviceId} onChange={e => setSvcForm({ ...svcForm, serviceId: e.target.value })}
                                                className="w-full border border-gray-100 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none">
                                                <option value="">Select Service</option>
                                                {services.filter(s => !serviceQueue.some(sq => sq.serviceId === s._id)).map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1 col-span-2 sm:col-span-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Estimated Time</label>
                                            <input placeholder="e.g., 30-45 Mins" value={svcForm.estimatedTime} onChange={e => setSvcForm({ ...svcForm, estimatedTime: e.target.value })}
                                                className="w-full border border-gray-100 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Min Price (₹)</label>
                                            <input type="number" placeholder="0" value={svcForm.price} onChange={e => setSvcForm({ ...svcForm, price: e.target.value })}
                                                className="w-full border border-gray-100 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Max Price (₹)</label>
                                            <input type="number" placeholder="Optional" value={svcForm.priceMax} onChange={e => setSvcForm({ ...svcForm, priceMax: e.target.value })}
                                                className="w-full border border-gray-100 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                                        </div>
                                        <div className="flex items-end">
                                            <button type="button" onClick={addServiceToQueue} disabled={!svcForm.serviceId || !svcForm.price}
                                                className="w-full px-4 py-2.5 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                                                + Add Service
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="svcAvail" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" checked={svcForm.isAvailable} onChange={e => setSvcForm({ ...svcForm, isAvailable: e.target.checked })} />
                                        <label htmlFor="svcAvail" className="text-xs font-medium text-gray-500 cursor-pointer">Available for Online Booking</label>
                                    </div>
                                </div>

                                {/* Service queue display */}
                                {serviceQueue.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-600">
                                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold mr-1.5">{serviceQueue.length}</span>
                                                Services Added
                                            </span>
                                            <button type="button" onClick={() => setServiceQueue([])} className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors">Clear All</button>
                                        </div>
                                        <div className="space-y-1.5">
                                            {serviceQueue.map((svc, idx) => (
                                                <div key={svc.serviceId} className="flex items-center justify-between px-4 py-2.5 bg-white border border-gray-100 rounded-xl group hover:border-gray-200 transition-all">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <span className="text-sm font-semibold text-gray-800 truncate">{svc.serviceName}</span>
                                                        <span className="text-xs font-bold text-primary whitespace-nowrap">₹{svc.price}{svc.priceMax ? ` – ₹${svc.priceMax}` : ''}</span>
                                                        {svc.estimatedTime && <span className="text-[10px] text-gray-400 italic whitespace-nowrap">{svc.estimatedTime}</span>}
                                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${svc.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                                            {svc.isAvailable ? 'On' : 'Off'}
                                                        </span>
                                                    </div>
                                                    <button type="button" onClick={() => removeServiceFromQueue(svc.serviceId)} className="p-1 text-gray-300 hover:text-red-500 transition-colors shrink-0 ml-2">
                                                        <CloseIcon />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 p-6 pt-4 border-t border-gray-100 shrink-0">
                            <button type="button" onClick={() => setShowBulkForm(false)}
                                className="flex-1 px-4 py-3 text-sm font-bold border border-gray-100 rounded-2xl bg-white hover:bg-gray-50 text-gray-500 transition-all">Cancel</button>
                            <button type="button" onClick={handleBulkSubmit} disabled={submitting || !selectedQueue.length || !serviceQueue.length}
                                className="flex-[2] px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {submitting ? (
                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Applying...</>
                                ) : (
                                    <>Apply {serviceQueue.length} Service{serviceQueue.length !== 1 ? 's' : ''} × {selectedQueue.length} Model{selectedQueue.length !== 1 ? 's' : ''} ({selectedQueue.length * serviceQueue.length} entries) →</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════ */}
            {/* ── EDIT SINGLE PRICING MODAL ── */}
            {/* ══════════════════════════════════════════════ */}
            {showEditForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowEditForm(false)}>
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Edit Rate</h3>
                            <button onClick={() => setShowEditForm(false)} className="text-gray-400 hover:text-gray-600 p-1">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Brand</label>
                                    <select required value={editForm.brandId} onChange={e => setEditForm({ ...editForm, brandId: e.target.value, modelId: '' })}
                                        className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none">
                                        <option value="">Select Brand *</option>{brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Model</label>
                                    <select required value={editForm.modelId} onChange={e => setEditForm({ ...editForm, modelId: e.target.value })}
                                        className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none">
                                        <option value="">Select Model *</option>{editModels.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Service Type</label>
                                <select required value={editForm.serviceId} onChange={e => setEditForm({ ...editForm, serviceId: e.target.value })}
                                    className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none">
                                    <option value="">Select Service *</option>{services.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Min Price (₹)</label>
                                    <input required type="number" placeholder="0.00" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                                        className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Max Price (₹)</label>
                                    <input type="number" placeholder="Optional" value={editForm.priceMax} onChange={e => setEditForm({ ...editForm, priceMax: e.target.value })}
                                        className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Estimated Time</label>
                                <input placeholder="e.g., 30-45 Mins, 1 Day" value={editForm.estimatedTime} onChange={e => setEditForm({ ...editForm, estimatedTime: e.target.value })}
                                    className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <input type="checkbox" id="editAvail" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" checked={editForm.isAvailable} onChange={e => setEditForm({ ...editForm, isAvailable: e.target.checked })} />
                                <label htmlFor="editAvail" className="text-sm font-bold text-gray-700 cursor-pointer">Service Available for Online Booking</label>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowEditForm(false)}
                                    className="flex-1 px-4 py-3.5 text-sm font-bold border border-gray-100 rounded-2xl bg-white hover:bg-gray-50 text-gray-500 transition-all">Cancel</button>
                                <button type="submit"
                                    className="flex-[2] px-8 py-3.5 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all">
                                    Update Rate
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
