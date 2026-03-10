"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

const PREDEFINED_ICONS = [
    { name: 'Screen', url: '/services/screen.png' },
    { name: 'Battery', url: '/services/battery.png' },
    { name: 'Motherboard', url: '/services/motherboard.png' },
    { name: 'Charging Port', url: '/services/port.png' },
    { name: 'Camera', url: '/services/camera.png' },
    { name: 'Water Damage', url: '/services/water.png' },
];

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', icon: '', displayOrder: 0, isDefault: false, defaultPrice: 0 });

    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

    const fetchServices = async () => {
        try {
            const res = await fetch(`${API}/api/services`, { headers: headers() });
            const data = await res.json();
            setServices(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchServices(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingId ? `${API}/api/services/${editingId}` : `${API}/api/services`;
        const method = editingId ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(form) });
        const data = await res.json();
        if (data.success || data.data || !data.error) { resetForm(); fetchServices(); } else alert(data.error || 'Failed');
    };

    const resetForm = () => { setForm({ name: '', description: '', icon: '', displayOrder: 0, isDefault: false, defaultPrice: 0 }); setEditingId(null); setShowForm(false); };

    const editService = (s) => { setForm({ name: s.name, description: s.description || '', icon: s.icon || '', displayOrder: s.displayOrder || 0, isDefault: s.isDefault || false, defaultPrice: s.defaultPrice || 0 }); setEditingId(s._id); setShowForm(true); };

    const deleteService = async (id) => { if (!confirm('Delete?')) return; await fetch(`${API}/api/services/${id}`, { method: 'DELETE', headers: headers() }); fetchServices(); };

    const toggleActive = async (s) => {
        await fetch(`${API}/api/services/${s._id}`, { method: 'PUT', headers: headers(), body: JSON.stringify({ isActive: !s.isActive }) });
        fetchServices();
    };

    const toggleDefault = async (s) => {
        await fetch(`${API}/api/services/${s._id}`, { method: 'PUT', headers: headers(), body: JSON.stringify({ isDefault: !s.isDefault }) });
        fetchServices();
    };

    const seedData = async () => {
        if (!confirm('This will add Mobitel official services. Continue?')) return;
        const officialServices = [
            { name: "Screen Replacement", description: "Premium grade display replacement restoring perfect touch and vivid colors.", icon: "/services/screen.png", defaultPrice: 999, displayOrder: 1, isDefault: true },
            { name: "Battery Replacement", description: "Original batteries with true capacity and a 6-month solid warranty.", icon: "/services/battery.png", defaultPrice: 499, displayOrder: 2 },
            { name: "Charging Port Issue", description: "Fast, solid charging port replacement restoring full speed.", icon: "/services/port.png", defaultPrice: 699, displayOrder: 3 },
            { name: "Camera Repair", description: "Crystal clear focus restored with original camera modules.", icon: "/services/camera.png", defaultPrice: 799, displayOrder: 4 },
            { name: "Speaker Not Working", description: "High-quality speaker replacement for crystal clear audio.", icon: "/services/motherboard.png", defaultPrice: 899, displayOrder: 5 }
        ];

        for (const s of officialServices) {
            await fetch(`${API}/api/services`, { method: 'POST', headers: headers(), body: JSON.stringify(s) });
        }
        fetchServices();
    };

    return (
        <div className="animate-in fade-in max-w-7xl mx-auto">
            <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-dark tracking-tight">Services Catalog</h1>
                    <p className="text-sm text-muted font-medium mt-1">Configure repair offerings and baseline pricing for the frontend</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={seedData} className="px-4 py-3 bg-gray-50 text-muted rounded-2xl font-bold text-xs hover:bg-gray-100 transition-all border border-gray-100">
                        Seed Defaults
                    </button>
                    <button onClick={() => { resetForm(); setShowForm(true); }} 
                        className="group px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-dark shadow-xl shadow-primary/20 transition-all flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                        </div>
                        New Service
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                                <th className="px-6 py-5">Service Overview</th>
                                <th className="px-6 py-5">Baseline Price</th>
                                <th className="px-6 py-5">Status & Priority</th>
                                <th className="px-6 py-5">Order</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {services.map(s => (
                                <tr key={s._id} className="group hover:bg-gray-50/50 transition-all">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                                                {s.icon ? (
                                                    <img 
                                                        src={s.icon} 
                                                        className="w-full h-full object-cover" 
                                                        alt="" 
                                                        onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'; }}
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-0.5 opacity-30">
                                                        <span className="text-xl">🛠️</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-dark text-base mb-1">{s.name}</p>
                                                <p className="text-muted text-[11px] leading-relaxed max-w-xs line-clamp-2">{s.description || 'No specialized description'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted font-bold uppercase tracking-wider mb-0.5">Starting From</span>
                                            <span className="font-black text-dark text-lg">₹{s.defaultPrice || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-2">
                                            <button onClick={() => toggleActive(s)} 
                                                className={`w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${s.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-50 text-red-500 border-red-100 opacity-50'}`}>
                                                {s.isActive ? 'Active' : 'Hidden'}
                                            </button>
                                            <button onClick={() => toggleDefault(s)} 
                                                className={`w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${s.isDefault ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' : 'bg-white text-gray-400 border-gray-200 hover:border-blue-400 hover:text-blue-500'}`}>
                                                {s.isDefault ? 'Featured ★' : 'Standard'}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-mono text-xs font-bold text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            #{s.displayOrder || 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => editService(s)} className="p-2.5 bg-white text-dark hover:text-white hover:bg-dark border border-gray-200 rounded-xl transition-all shadow-sm" title="Edit Properties">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                            <button onClick={() => deleteService(s._id)} className="p-2.5 bg-white text-red-500 hover:text-white hover:bg-red-500 border border-gray-200 rounded-xl transition-all shadow-sm" title="Remove Service">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && !services.length && (
                    <div className="py-24 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                             <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-dark mb-2">The catalog is empty</h3>
                        <p className="text-muted text-sm max-w-xs mx-auto">Start adding repair services to show them on your website's booking system.</p>
                    </div>
                )}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-dark/60 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={resetForm}>
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-2xl shadow-3xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-3xl font-black text-dark tracking-tight">{editingId ? 'Update' : 'Register'} Service</h3>
                                <p className="text-muted text-sm font-medium mt-1">Configure how this repair appears to your customers.</p>
                            </div>
                            <button onClick={resetForm} className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary-light flex items-center justify-center transition-all">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Label</label>
                                    <input required placeholder="e.g., Ultra-Glass Replacement" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} 
                                        className="w-full border border-gray-100 rounded-2xl px-5 py-4 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Baseline Price (₹)</label>
                                    <input type="number" value={form.defaultPrice} onChange={e => setForm({ ...form, defaultPrice: parseInt(e.target.value) || 0 })} 
                                        className="w-full border border-gray-100 rounded-2xl px-5 py-4 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-black text-primary" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Branded Icon</label>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                    {PREDEFINED_ICONS.map((icon) => (
                                        <button
                                            key={icon.url}
                                            type="button"
                                            onClick={() => setForm({ ...form, icon: icon.url })}
                                            className={`relative aspect-square rounded-2xl border-2 transition-all overflow-hidden flex flex-col items-center justify-center p-1 ${form.icon === icon.url ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-gray-100 hover:border-primary/40'}`}
                                        >
                                            <div className="relative w-full h-full">
                                                <Image src={icon.url} alt={icon.name} fill className="object-cover" sizes="60px" />
                                            </div>
                                            {form.icon === icon.url && (
                                                <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-white">
                                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <div className="pt-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Custom Icon URL</label>
                                    <input placeholder="Or paste a custom image URL..." value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} 
                                        className="w-full mt-2 border border-gray-100 rounded-2xl px-5 py-3 text-[11px] bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-muted font-mono" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Description</label>
                                <textarea placeholder="Provide detailed coverage info (e.g., Using OEM-grade panels with 6 months warranty...)" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} 
                                    className="w-full border border-gray-100 rounded-[1.5rem] px-5 py-4 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none font-medium text-body" />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">List Priority (Order)</label>
                                    <input type="number" value={form.displayOrder} onChange={e => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })} 
                                        className="w-full border border-gray-100 rounded-2xl px-5 py-4 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold" />
                                </div>
                                <div className="flex-1 flex items-end">
                                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer w-full hover:bg-gray-100 transition-colors">
                                        <input type="checkbox" checked={form.isDefault} onChange={e => setForm({...form, isDefault: e.target.checked})} className="w-5 h-5 rounded-lg text-primary focus:ring-primary" />
                                        <span className="text-xs font-black text-dark uppercase tracking-wider">Mark as Featured</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={resetForm} 
                                    className="flex-1 px-8 py-4 text-sm font-bold text-gray-500 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest">Discard</button>
                                <button type="submit" 
                                    className="flex-[2] px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-2xl shadow-primary/30 hover:bg-dark transition-all uppercase tracking-[0.2em]">
                                    {editingId ? 'Save Changes' : 'Launch Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
