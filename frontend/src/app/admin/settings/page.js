"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

export default function SettingsPage() {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [shopProfile, setShopProfile] = useState({ name: '', address: '', phone: '', email: '', logo: '', description: '' });
    const [notifPrefs, setNotifPrefs] = useState({ adminEmails: '', adminWhatsapp: '' });
    const [paymentSettings, setPaymentSettings] = useState({
        full_payment_enabled: true,
        advance_payment_enabled: true,
        pay_at_store_enabled: true,
        advance_type: 'fixed',
        advance_fixed_amount: 500,
        advance_percentage: 20,
    });

    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API}/api/settings`, { headers: headers() });
                const data = await res.json();
                setSettings(data);
                if (data.shopProfile) setShopProfile(data.shopProfile);
                if (data.paymentSettings) setPaymentSettings(data.paymentSettings);
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

    const savePaymentSettings = async () => {
        setSaving(true);
        await fetch(`${API}/api/settings/paymentSettings`, {
            method: 'PUT', headers: headers(), body: JSON.stringify({ value: paymentSettings })
        });
        setSaving(false);
        alert('Payment settings saved!');
    };

    if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

    return (
        <div className="animate-in fade-in max-w-3xl">
            <header className="mb-8"><h1 className="text-2xl font-bold text-gray-900">Settings</h1><p className="text-sm text-gray-500">Shop configuration and preferences</p></header>

            {/* Shop Profile */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shop Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-xs font-medium text-gray-500 mb-1">Shop Name</label>
                        <input value={shopProfile.name} onChange={e => setShopProfile({ ...shopProfile, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                    <div><label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                        <input value={shopProfile.phone} onChange={e => setShopProfile({ ...shopProfile, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                    <div><label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                        <input value={shopProfile.email} onChange={e => setShopProfile({ ...shopProfile, email: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                    <div><label className="block text-xs font-medium text-gray-500 mb-1">Logo URL</label>
                        <input value={shopProfile.logo} onChange={e => setShopProfile({ ...shopProfile, logo: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                    <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                        <textarea rows={2} value={shopProfile.address} onChange={e => setShopProfile({ ...shopProfile, address: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                    <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                        <textarea rows={2} value={shopProfile.description} onChange={e => setShopProfile({ ...shopProfile, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                </div>
                <button onClick={saveShopProfile} disabled={saving} className="mt-4 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
                <div className="space-y-4">
                    <div><label className="block text-xs font-medium text-gray-500 mb-1">Admin Email Recipients (comma-separated)</label>
                        <input value={notifPrefs.adminEmails} onChange={e => setNotifPrefs({ ...notifPrefs, adminEmails: e.target.value })}
                            placeholder="admin1@example.com, admin2@example.com"
                            className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                    <div><label className="block text-xs font-medium text-gray-500 mb-1">Admin WhatsApp Numbers (comma-separated)</label>
                        <input value={notifPrefs.adminWhatsapp} onChange={e => setNotifPrefs({ ...notifPrefs, adminWhatsapp: e.target.value })}
                            placeholder="+919876543210, +919876543211"
                            className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                </div>
                <button onClick={saveNotifPrefs} disabled={saving} className="mt-4 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Notification Settings'}
                </button>
            </div>

            {/* Payment Configuration */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Payment Gateway Integration
                </h2>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3 border-b pb-2">Enabled Payment Modes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                <input type="checkbox" checked={paymentSettings.full_payment_enabled} onChange={e => setPaymentSettings({...paymentSettings, full_payment_enabled: e.target.checked})} className="w-4 h-4 text-primary rounded border-gray-300" />
                                <span className="text-sm font-medium text-gray-700">Full Payment Online</span>
                            </label>
                            <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                <input type="checkbox" checked={paymentSettings.advance_payment_enabled} onChange={e => setPaymentSettings({...paymentSettings, advance_payment_enabled: e.target.checked})} className="w-4 h-4 text-primary rounded border-gray-300" />
                                <span className="text-sm font-medium text-gray-700">Advance Online</span>
                            </label>
                            <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                <input type="checkbox" checked={paymentSettings.pay_at_store_enabled} onChange={e => setPaymentSettings({...paymentSettings, pay_at_store_enabled: e.target.checked})} className="w-4 h-4 text-primary rounded border-gray-300" />
                                <span className="text-sm font-medium text-gray-700">Pay at Store (Cash/POS)</span>
                            </label>
                        </div>
                    </div>

                    {paymentSettings.advance_payment_enabled && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 animate-in fade-in">
                            <h3 className="text-sm font-bold text-gray-800 mb-3">Advance Payment Rules</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Calculation Type</label>
                                    <select value={paymentSettings.advance_type} onChange={e => setPaymentSettings({...paymentSettings, advance_type: e.target.value})} className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm outline-none">
                                        <option value="fixed">Fixed Amount (₹)</option>
                                        <option value="percentage">Percentage (%)</option>
                                    </select>
                                </div>
                                {paymentSettings.advance_type === 'fixed' ? (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Fixed Amount (₹)</label>
                                        <input type="number" min="1" value={paymentSettings.advance_fixed_amount} onChange={e => setPaymentSettings({...paymentSettings, advance_fixed_amount: parseInt(e.target.value) || 0})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold" />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Percentage (%)</label>
                                        <input type="number" min="1" max="100" value={paymentSettings.advance_percentage} onChange={e => setPaymentSettings({...paymentSettings, advance_percentage: parseInt(e.target.value) || 0})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={savePaymentSettings} disabled={saving} className="mt-4 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                    {saving ? 'Saving...' : 'Save Payment Configuration'}
                </button>
            </div>

            {/* Environment Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">System Info</h2>
                <div className="text-sm text-gray-500 space-y-1">
                    <p>API URL: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{API}</code></p>
                    <p>Environment: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{process.env.NODE_ENV}</code></p>
                </div>
            </div>
        </div>
    );
}
