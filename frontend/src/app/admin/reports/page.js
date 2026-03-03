"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookingsReport, setBookingsReport] = useState(null);
    const [workerReport, setWorkerReport] = useState(null);
    const [popularReport, setPopularReport] = useState(null);
    const [revenueReport, setRevenueReport] = useState(null);
    const [dateRange, setDateRange] = useState({ dateFrom: '', dateTo: '' });
    const [loading, setLoading] = useState(false);

    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}` });

    const fetchReport = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (dateRange.dateFrom) params.set('dateFrom', dateRange.dateFrom);
        if (dateRange.dateTo) params.set('dateTo', dateRange.dateTo);

        try {
            if (activeTab === 'bookings') {
                const res = await fetch(`${API}/api/reports/bookings?${params}`, { headers: headers() });
                setBookingsReport(await res.json());
            } else if (activeTab === 'workers') {
                const res = await fetch(`${API}/api/reports/workers`, { headers: headers() });
                setWorkerReport(await res.json());
            } else if (activeTab === 'popular') {
                const res = await fetch(`${API}/api/reports/popular`, { headers: headers() });
                setPopularReport(await res.json());
            } else if (activeTab === 'revenue') {
                const res = await fetch(`${API}/api/reports/revenue?${params}`, { headers: headers() });
                setRevenueReport(await res.json());
            }
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchReport(); }, [activeTab]);

    const exportCSV = () => {
        const params = new URLSearchParams();
        if (dateRange.dateFrom) params.set('dateFrom', dateRange.dateFrom);
        if (dateRange.dateTo) params.set('dateTo', dateRange.dateTo);
        window.open(`${API}/api/reports/export/csv?${params}&token=${localStorage.getItem('adminToken')}`, '_blank');
    };

    const tabs = [
        { id: 'bookings', label: 'Bookings' },
        { id: 'revenue', label: 'Revenue' },
        { id: 'workers', label: 'Workers' },
        { id: 'popular', label: 'Popular' },
    ];

    return (
        <div className="animate-in fade-in">
            <header className="mb-6 flex justify-between items-center">
                <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1><p className="text-sm text-gray-500">Analytics and insights</p></div>
                <button onClick={exportCSV} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300">📥 Export CSV</button>
            </header>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6 w-fit">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Date Filters */}
            <div className="flex gap-3 mb-5">
                <input type="date" value={dateRange.dateFrom} onChange={e => setDateRange({ ...dateRange, dateFrom: e.target.value })} className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                <input type="date" value={dateRange.dateTo} onChange={e => setDateRange({ ...dateRange, dateTo: e.target.value })} className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                <button onClick={fetchReport} className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90">Apply</button>
            </div>

            {/* Bookings Report */}
            {activeTab === 'bookings' && bookingsReport && (
                <div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border dark:border-gray-700">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookingsReport.total}</p>
                            <p className="text-xs text-gray-500">Total Bookings</p>
                        </div>
                        {bookingsReport.statusBreakdown?.map(s => (
                            <div key={s._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border dark:border-gray-700">
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.count}</p>
                                <p className="text-xs text-gray-500">{s._id}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Revenue Report */}
            {activeTab === 'revenue' && revenueReport && (
                <div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 mb-6">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{revenueReport.totalCompleted}</p>
                        <p className="text-sm text-gray-500">Completed Repairs</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4">
                        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Daily Breakdown</h3>
                        <div className="space-y-2">
                            {(revenueReport.dailyBreakdown || []).map(d => (
                                <div key={d._id} className="flex justify-between items-center text-sm py-1 border-b dark:border-gray-700 last:border-0">
                                    <span className="text-gray-600 dark:text-gray-400">{d._id}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{d.count} repairs</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Workers Report */}
            {activeTab === 'workers' && workerReport && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 tracking-wider">
                            <th className="p-3">Worker</th><th className="p-3">Total</th><th className="p-3">Completed</th><th className="p-3">Active</th><th className="p-3">Status</th>
                        </tr></thead>
                        <tbody className="divide-y dark:divide-gray-700">
                            {workerReport.map(w => (
                                <tr key={w._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3 font-medium text-gray-900 dark:text-white">{w.name}</td>
                                    <td className="p-3">{w.totalJobs}</td>
                                    <td className="p-3 text-green-600 font-semibold">{w.completedJobs}</td>
                                    <td className="p-3 text-blue-600">{w.activeJobs}</td>
                                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${w.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{w.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Popular Report */}
            {activeTab === 'popular' && popularReport && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4">
                        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">🔧 Top Services</h3>
                        {(popularReport.services || []).map((s, i) => (
                            <div key={i} className="flex justify-between py-1.5 text-sm border-b dark:border-gray-700 last:border-0">
                                <span className="text-gray-600 dark:text-gray-300">{s._id}</span>
                                <span className="font-medium">{s.count}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4">
                        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">📱 Top Brands</h3>
                        {(popularReport.brands || []).map((b, i) => (
                            <div key={i} className="flex justify-between py-1.5 text-sm border-b dark:border-gray-700 last:border-0">
                                <span className="text-gray-600 dark:text-gray-300">{b._id}</span>
                                <span className="font-medium">{b.count}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4">
                        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">📊 Top Models</h3>
                        {(popularReport.models || []).map((m, i) => (
                            <div key={i} className="flex justify-between py-1.5 text-sm border-b dark:border-gray-700 last:border-0">
                                <span className="text-gray-600 dark:text-gray-300">{m._id?.brand} {m._id?.model}</span>
                                <span className="font-medium">{m.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {loading && <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}
        </div>
    );
}
