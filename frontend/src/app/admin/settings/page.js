"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

export default function SettingsPage() {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [shopProfile, setShopProfile] = useState({ name: '', address: '', phone: '', email: '', logo: '', description: '' });
    const [notifPrefs, setNotifPrefs] = useState({ adminEmails: '', adminWhatsapp: '' });

    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API}/api/settings`, { headers: headers() });
                const data = await res.json();
                setSettings(data);
                if (data.shopProfile) setShopProfile(data.shopProfile);
                if (data.notificationPreferences) {
                    setNotifPrefs({
                        adminEmails: (data.notificationPreferences.adminEmails || []).join(', '),
                        adminWhatsapp: (data.notificationPreferences.adminWhatsapp || []).join(', ')
                    });
                }
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const saveShopProfile = async () => {
        setSaving(true);
        await fetch(`${API}/api/settings/shopProfile`, {
            method: 'PUT', headers: headers(), body: JSON.stringify({ value: shopProfile })
        });
        setSaving(false);
        alert('Shop profile saved!');
    };

    const saveNotifPrefs = async () => {
        setSaving(true);
        await fetch(`${API}/api/settings/notificationPreferences`, {
            method: 'PUT', headers: headers(),
            body: JSON.stringify({
                value: {
                    adminEmails: notifPrefs.adminEmails.split(',').map(e => e.trim()).filter(Boolean),
                    adminWhatsapp: notifPrefs.adminWhatsapp.split(',').map(w => w.trim()).filter(Boolean)
                }
            })
        });
        setSaving(false);
        alert('Notification preferences saved!');
    };

    if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

    return (
        <div className="animate-in fade-in max-w-3xl">
            <header className="mb-8"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1><p className="text-sm text-gray-500">Shop configuration and preferences</p></header>

            {/* Shop Profile */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shop Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-xs font-medium text-gray-500 mb-1">Shop Name</label>
                        <input value={shopProfile.name} onChange={e => setShopProfile({ ...shopProfile, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                    <div><label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                        <input value={shopProfile.phone} onChange={e => setShopProfile({ ...shopProfile, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                    <div><label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                        <input value={shopProfile.email} onChange={e => setShopProfile({ ...shopProfile, email: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                    <div><label className="block text-xs font-medium text-gray-500 mb-1">Logo URL</label>
                        <input value={shopProfile.logo} onChange={e => setShopProfile({ ...shopProfile, logo: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                    <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                        <textarea rows={2} value={shopProfile.address} onChange={e => setShopProfile({ ...shopProfile, address: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                    <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                        <textarea rows={2} value={shopProfile.description} onChange={e => setShopProfile({ ...shopProfile, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                </div>
                <button onClick={saveShopProfile} disabled={saving} className="mt-4 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h2>
                <div className="space-y-4">
                    <div><label className="block text-xs font-medium text-gray-500 mb-1">Admin Email Recipients (comma-separated)</label>
                        <input value={notifPrefs.adminEmails} onChange={e => setNotifPrefs({ ...notifPrefs, adminEmails: e.target.value })}
                            placeholder="admin1@example.com, admin2@example.com"
                            className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                    <div><label className="block text-xs font-medium text-gray-500 mb-1">Admin WhatsApp Numbers (comma-separated)</label>
                        <input value={notifPrefs.adminWhatsapp} onChange={e => setNotifPrefs({ ...notifPrefs, adminWhatsapp: e.target.value })}
                            placeholder="+919876543210, +919876543211"
                            className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                </div>
                <button onClick={saveNotifPrefs} disabled={saving} className="mt-4 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Notification Settings'}
                </button>
            </div>

            {/* Environment Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">System Info</h2>
                <div className="text-sm text-gray-500 space-y-1">
                    <p>API URL: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">{API}</code></p>
                    <p>Environment: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">{process.env.NODE_ENV}</code></p>
                </div>
            </div>
        </div>
    );
}
