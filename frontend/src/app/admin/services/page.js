"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

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
            setServices(await res.json());
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
        if (data.success || data.data) { resetForm(); fetchServices(); } else alert(data.error || 'Failed');
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

    return (
        <div className="animate-in fade-in">
            <header className="mb-6 flex justify-between items-center">
                <div><h1 className="text-2xl font-bold text-gray-900">Services</h1><p className="text-sm text-gray-500 font-medium">Manage repair services offered to customers</p></div>
                <button onClick={() => { resetForm(); setShowForm(true); }} 
                    className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    New Service
                </button>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead><tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                        <th className="p-4">Service Details</th><th className="p-4">Default Price</th><th className="p-4">Status</th><th className="p-4">Rank</th><th className="p-4 text-right">Actions</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {services.map(s => (
                            <tr key={s._id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 p-1">
                                            {s.icon ? <img src={s.icon} className="w-full h-full object-contain" alt="" /> : <span className="text-primary font-bold">🛠️</span>}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 leading-none mb-1">{s.name}</p>
                                            <p className="text-gray-500 text-[11px] max-w-xs truncate">{s.description || 'No description provided'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="font-bold text-gray-900">₹{s.defaultPrice || 0}</span>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1.5">
                                        <button onClick={() => toggleActive(s)} 
                                            className={`w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${s.isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                            {s.isActive ? '• Active' : '• Hidden'}
                                        </button>
                                        <button onClick={() => toggleDefault(s)} 
                                            className={`w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${s.isDefault ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                            {s.isDefault ? '★ Default' : '☆ Standard'}
                                        </button>
                                    </div>
                                </td>
                                <td className="p-4 font-mono text-gray-400 font-bold">#{s.displayOrder || 0}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => editService(s)} className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors" title="Edit">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button onClick={() => deleteService(s._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && !services.length && (
                    <div className="p-20 text-center text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <p className="font-medium text-sm">No services configured yet</p>
                    </div>
                )}
            </div>


            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={resetForm}>
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">{editingId ? 'Edit' : 'Create'} Service</h3>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-1">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Service Name</label>
                                <input required placeholder="e.g., Screen Replacement" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} 
                                    className="w-full border border-gray-100 rounded-2xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Icon URL (optional)</label>
                                <input placeholder="https://..." value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} 
                                    className="w-full border border-gray-100 rounded-2xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea placeholder="Describe what this service covers..." rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} 
                                    className="w-full border border-gray-100 rounded-2xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Display Order</label>
                                <input type="number" value={form.displayOrder} onChange={e => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })} 
                                    className="w-full border border-gray-100 rounded-2xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Default Price (₹)</label>
                                <input type="number" value={form.defaultPrice} onChange={e => setForm({ ...form, defaultPrice: parseInt(e.target.value) || 0 })} 
                                    className="w-full border border-gray-100 rounded-2xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" />
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                <input type="checkbox" id="def_svc" checked={form.isDefault} onChange={e => setForm({...form, isDefault: e.target.checked})} className="w-4 h-4 rounded text-primary" />
                                <label htmlFor="def_svc" className="text-sm font-bold text-gray-700 cursor-pointer">Default service for all models</label>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={resetForm} 
                                    className="flex-1 px-6 py-3.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all">Cancel</button>
                                <button type="submit" 
                                    className="flex-[2] px-6 py-3.5 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all">
                                    {editingId ? 'Update Service' : 'Confirm & Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
