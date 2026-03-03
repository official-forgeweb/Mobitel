"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', icon: '', displayOrder: 0 });

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

    const resetForm = () => { setForm({ name: '', description: '', icon: '', displayOrder: 0 }); setEditingId(null); setShowForm(false); };

    const editService = (s) => { setForm({ name: s.name, description: s.description || '', icon: s.icon || '', displayOrder: s.displayOrder || 0 }); setEditingId(s._id); setShowForm(true); };

    const deleteService = async (id) => { if (!confirm('Delete?')) return; await fetch(`${API}/api/services/${id}`, { method: 'DELETE', headers: headers() }); fetchServices(); };

    const toggleActive = async (s) => {
        await fetch(`${API}/api/services/${s._id}`, { method: 'PUT', headers: headers(), body: JSON.stringify({ isActive: !s.isActive }) });
        fetchServices();
    };

    return (
        <div className="animate-in fade-in">
            <header className="mb-6 flex justify-between items-center">
                <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h1><p className="text-sm text-gray-500">Manage repair services</p></div>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">+ Add Service</button>
            </header>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead><tr className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 tracking-wider">
                        <th className="p-3">Service</th><th className="p-3">Description</th><th className="p-3">Order</th><th className="p-3">Status</th><th className="p-3">Actions</th>
                    </tr></thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {services.map(s => (
                            <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-3 font-medium text-gray-900 dark:text-white">{s.name}</td>
                                <td className="p-3 text-gray-500 text-xs max-w-xs truncate">{s.description}</td>
                                <td className="p-3 text-gray-400">{s.displayOrder}</td>
                                <td className="p-3">
                                    <button onClick={() => toggleActive(s)} className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {s.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="p-3 flex gap-2">
                                    <button onClick={() => editService(s)} className="text-blue-500 hover:underline text-xs">Edit</button>
                                    <button onClick={() => deleteService(s._id)} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && !services.length && <p className="p-6 text-center text-gray-500">No services yet</p>}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={resetForm}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4 dark:text-white">{editingId ? 'Edit' : 'Add'} Service</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input required placeholder="Service name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <textarea placeholder="Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <input placeholder="Icon URL" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <input type="number" placeholder="Display order" value={form.displayOrder} onChange={e => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <div className="flex justify-end gap-3"><button type="button" onClick={resetForm} className="px-4 py-2 text-sm border rounded-lg dark:border-gray-600">Cancel</button><button type="submit" className="px-4 py-2 text-sm bg-primary text-white rounded-lg">Save</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
