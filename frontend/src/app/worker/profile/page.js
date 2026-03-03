"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function WorkerProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('workerToken')}`, 'Content-Type': 'application/json' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API}/api/workers/me/profile`, { headers: headers() });
                const data = await res.json();
                setProfile(data);
                setForm({ name: data.name || '', email: data.email || '', password: '' });
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const saveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        const payload = { name: form.name, email: form.email };
        if (form.password) payload.password = form.password;

        try {
            const res = await fetch(`${API}/api/workers/me/profile`, {
                method: 'PUT', headers: headers(), body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                setProfile(data.data);
                setMessage('Profile updated successfully!');
                setEditing(false);
                setForm({ ...form, password: '' });
            } else {
                setMessage(data.error || 'Update failed');
            }
        } catch (err) { setMessage('Error updating profile'); }
        setSaving(false);
    };

    if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

    return (
        <div className="animate-in fade-in max-w-lg mx-auto">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
            </header>

            {message && (
                <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('success') ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
                    {message}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
                {/* Profile Header */}
                <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-b dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                            {profile?.name?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{profile?.name}</h2>
                            <p className="text-sm text-gray-500">{profile?.phone}</p>
                            {profile?.specialization?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {profile.specialization.map((s, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-white/80 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">{s}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                {editing ? (
                    <form onSubmit={saveProfile} className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">New Password (leave blank to keep current)</label>
                            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full border rounded-lg px-3 py-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setEditing(false)} className="flex-1 py-2.5 border rounded-lg text-sm dark:border-gray-600 dark:text-gray-300">Cancel</button>
                            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
                        </div>
                    </form>
                ) : (
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 gap-3 text-sm">
                            <div className="flex justify-between py-2 border-b dark:border-gray-700">
                                <span className="text-gray-500">Phone</span>
                                <span className="text-gray-900 dark:text-white font-medium">{profile?.phone}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b dark:border-gray-700">
                                <span className="text-gray-500">Email</span>
                                <span className="text-gray-900 dark:text-white">{profile?.email || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b dark:border-gray-700">
                                <span className="text-gray-500">Status</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${profile?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{profile?.status}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-500">Joined</span>
                                <span className="text-gray-900 dark:text-white">{new Date(profile?.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <button onClick={() => setEditing(true)} className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors mt-4">
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
