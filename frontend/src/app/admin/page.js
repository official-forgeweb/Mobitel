"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [bookingStats, setBookingStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const headers = { Authorization: `Bearer ${token}` };

        Promise.all([
            fetch(`${API}/api/admin/stats`).then(r => r.json()),
            fetch(`${API}/api/bookings/stats/overview`, { headers }).then(r => r.json()).catch(() => null)
        ]).then(([adminStats, bStats]) => {
            setStats(adminStats);
            setBookingStats(bStats);
        }).catch(err => console.error('Failed to fetch stats:', err))
        .finally(() => setLoading(false));
    }, []);

    const statCards = [
        { label: 'Total Bookings', value: bookingStats?.total || stats?.totalUsers || 0, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'blue' },
        { label: 'Today', value: bookingStats?.today || 0, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'indigo' },
        { label: 'This Week', value: bookingStats?.week || 0, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'purple' },
        { label: 'Pending', value: bookingStats?.pending || 0, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'yellow' },
        { label: 'In Progress', value: bookingStats?.inProgress || stats?.activeRepairs || 0, icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', color: 'orange' },
        { label: 'Completed', value: bookingStats?.completed || 0, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'green' },
    ];

    const colorMap = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200' },
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-200' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-200' },
        yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', ring: 'ring-yellow-200' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-600', ring: 'ring-orange-200' },
        green: { bg: 'bg-green-50', text: 'text-green-600', ring: 'ring-green-200' },
    };

    return (
        <div className="animate-in fade-in duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back. Here's what's happening.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {statCards.map((card, i) => {
                    const c = colorMap[card.color];
                    const bgClass = c.bg.split(' ')[0];
                    const textClass = c.text.split(' ')[0];
                    return (
                        <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className={`w-10 h-10 ${bgClass} rounded-lg flex items-center justify-center mb-3`}>
                                <svg className={`w-5 h-5 ${textClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                                </svg>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {loading ? <span className="animate-pulse bg-gray-200 rounded h-8 w-12 block"></span> : card.value}
                            </p>
                            <p className="text-xs font-medium text-gray-500 mt-1">{card.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Bookings */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                        <a href="/admin/bookings" className="text-sm text-primary hover:underline font-medium">View All →</a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider font-bold">
                                    <th className="p-3 hidden sm:table-cell">Token</th>
                                    <th className="p-3">Customer</th>
                                    <th className="p-3 hidden md:table-cell">Device</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 hidden sm:table-cell text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {(bookingStats?.recentBookings || stats?.recentActivity || []).slice(0, 8).map((item, i) => {
                                    const isBooking = item.trackingToken;
                                    return (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors text-xs border-l-2 border-transparent hover:border-primary">
                                            <td className="p-3 font-mono text-primary font-bold hidden sm:table-cell">{isBooking ? item.trackingToken : '-'}</td>
                                            <td className="p-3">
                                                <div className="font-semibold text-gray-900 truncate max-w-[100px] sm:max-w-none">{isBooking ? item.customerName : item.user}</div>
                                                <div className="sm:hidden text-[10px] text-gray-400 font-mono mt-0.5">{isBooking ? item.trackingToken : ''}</div>
                                            </td>
                                            <td className="p-3 text-gray-600 hidden md:table-cell">{isBooking ? `${item.brand} ${item.model}` : item.action?.substring(0, 30)}</td>
                                            <td className="p-3">
                                                <StatusBadge status={isBooking ? item.status : item.status} />
                                            </td>
                                            <td className="p-3 text-gray-400 text-right hidden sm:table-cell">{isBooking ? new Date(item.createdAt).toLocaleDateString() : item.time}</td>
                                        </tr>
                                    );
                                })}
                                {!loading && !(bookingStats?.recentBookings?.length || stats?.recentActivity?.length) && (
                                    <tr><td colSpan="5" className="p-6 text-center text-gray-500">No recent bookings</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Worker Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Workers</h2>
                        <a href="/admin/workers" className="text-sm text-primary hover:underline font-medium">Manage →</a>
                    </div>
                    <div className="p-4 space-y-3">
                        {(bookingStats?.workers || []).map((w, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                    {w.name?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{w.name}</p>
                                    <p className="text-xs text-gray-500">{w.activeJobCount} active job{w.activeJobCount !== 1 ? 's' : ''}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${w.activeJobCount > 3 ? 'bg-red-100 text-red-700' : w.activeJobCount > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                    {w.activeJobCount > 3 ? 'Busy' : w.activeJobCount > 0 ? 'Working' : 'Available'}
                                </span>
                            </div>
                        ))}
                        {!loading && !bookingStats?.workers?.length && (
                            <p className="text-sm text-gray-500 text-center py-4">No workers added yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const colors = {
        'Received': 'bg-blue-100 text-blue-700', 'Diagnosing': 'bg-indigo-100 text-indigo-700',
        'Waiting for Parts': 'bg-yellow-100 text-yellow-700', 'In Progress': 'bg-orange-100 text-orange-700',
        'Testing': 'bg-purple-100 text-purple-700', 'Ready for Pickup': 'bg-teal-100 text-teal-700',
        'Completed': 'bg-green-100 text-green-700', 'Cancelled': 'bg-red-100 text-red-700',
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
}
