"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

export default function PartnersPage() {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', specialization: '', photo: '' });

    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

    const fetchPartners = async () => {
        try {
            const res = await fetch(`${API}/api/workers`, { headers: headers() });
            setPartners(await res.json());
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchPartners(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            specialization: form.specialization ? form.specialization.split(',').map(s => s.trim()) : []
        };
        if (editingId && !payload.password) delete payload.password;

        const url = editingId ? `${API}/api/workers/${editingId}` : `${API}/api/workers`;
        const method = editingId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(payload) });
            const data = await res.json();
            if (data.success || data.data) {
                resetForm();
                fetchPartners();
            } else {
                alert(data.error || 'Failed to save partner');
            }
        } catch (err) { console.error(err); alert('Error saving partner'); }
    };

    const resetForm = () => {
        setForm({ name: '', phone: '', email: '', password: '', specialization: '', photo: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const editPartner = (w) => {
        setForm({
            name: w.name, phone: w.phone, email: w.email || '',
            password: '', specialization: (w.specialization || []).join(', '), photo: w.photo || ''
        });
        setEditingId(w._id);
        setShowForm(true);
    };

    const deletePartner = async (id) => {
        if (!confirm('Are you sure you want to delete this partner?')) return;
        await fetch(`${API}/api/workers/${id}`, { method: 'DELETE', headers: headers() });
        fetchPartners();
    };

    const toggleStatus = async (w) => {
        const newStatus = w.status === 'active' ? 'inactive' : 'active';
        await fetch(`${API}/api/workers/${w._id}`, {
            method: 'PUT', headers: headers(),
            body: JSON.stringify({ status: newStatus })
        });
        fetchPartners();
    };

    return (
        <div className="animate-in fade-in">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
                    <p className="text-sm text-gray-500">{partners.length} service specialists</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Partner
                </button>
            </header>

            {/* Worker Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={resetForm}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{editingId ? 'Edit' : 'Add'} Partner</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <input required placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="col-span-2 border rounded-lg px-3 py-2 text-sm" />
                                <input required placeholder="Phone *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                    className="border rounded-lg px-3 py-2 text-sm" />
                                <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="border rounded-lg px-3 py-2 text-sm" />
                                <input type="password" placeholder={editingId ? 'New password (leave blank to keep)' : 'Password *'} required={!editingId}
                                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="col-span-2 border rounded-lg px-3 py-2 text-sm" />
                                <input placeholder="Specializations (comma-separated)" value={form.specialization}
                                    onChange={e => setForm({ ...form, specialization: e.target.value })}
                                    className="col-span-2 border rounded-lg px-3 py-2 text-sm" />
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={resetForm} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">{editingId ? 'Update' : 'Add'} Partner</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {partners.map(w => (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-bold">
                                    {w.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{w.name}</h3>
                                    <p className="text-xs text-gray-500">{w.phone}</p>
                                </div>
                            </div>
                            <button onClick={() => toggleStatus(w)}
                                className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer ${w.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                                {w.status}
                            </button>
                        </div>
                        {w.email && <p className="text-xs text-gray-500 mb-2">📧 {w.email}</p>}
                        {w.specialization?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                                {w.specialization.map((s, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600 font-medium">{s}</span>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                            <button onClick={() => editPartner(w)} className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium">Edit</button>
                            <button onClick={() => deletePartner(w._id)} className="px-3 py-1.5 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium">Delete</button>
                        </div>
                    </div>
                ))}
                {!loading && !partners.length && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        <p className="text-lg">No partners yet</p>
                        <p className="text-sm">Add your first service specialist to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}
