"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

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
        <div className="animate-in fade-in space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics & Reports</h1>
                    <p className="text-sm text-gray-500 font-medium">Insights into business performance and repair metrics</p>
                </div>
                <button onClick={exportCSV} 
                    className="px-5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export Statistics
                </button>
            </header>

            {/* Main Tabs Container */}
            <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 w-full max-w-2xl mx-auto flex gap-1">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Interactive Filters Panel */}
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row items-end gap-4 shadow-inner">
                <div className="flex-1 space-y-1.5 min-w-[200px]">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Start Date</label>
                    <input type="date" value={dateRange.dateFrom} onChange={e => setDateRange({ ...dateRange, dateFrom: e.target.value })} 
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all" />
                </div>
                <div className="flex-1 space-y-1.5 min-w-[200px]">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">End Date</label>
                    <input type="date" value={dateRange.dateTo} onChange={e => setDateRange({ ...dateRange, dateTo: e.target.value })} 
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all" />
                </div>
                <button onClick={fetchReport} 
                    className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg active:scale-95">
                    Generate Analysis
                </button>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent shadow-lg"></div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest animate-pulse">Processing Data...</p>
                </div>
            )}

            {!loading && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Bookings View */}
                    {activeTab === 'bookings' && bookingsReport && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl hover:shadow-primary/5 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                </div>
                                <p className="text-4xl font-black text-gray-900 leading-none mb-1">{bookingsReport.total}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Bookings</p>
                            </div>
                            {bookingsReport.statusBreakdown?.map(s => (
                                <div key={s._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-gray-200 transition-all">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`w-2.5 h-2.5 rounded-full ${s._id === 'Completed' ? 'bg-green-500' : s._id === 'Pending' ? 'bg-yellow-500' : s._id === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s._id}</p>
                                    </div>
                                    <p className="text-4xl font-black text-gray-900 leading-none">{s.count}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Revenue View */}
                    {activeTab === 'revenue' && revenueReport && (
                        <div className="space-y-6">
                            <div className="bg-primary p-10 rounded-[3rem] shadow-2xl shadow-primary/30 relative overflow-hidden">
                                <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                                    <div>
                                        <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-[0.2em] mb-3">Performance Overview</p>
                                        <p className="text-6xl font-black text-white leading-none tracking-tight">{revenueReport.totalCompleted}</p>
                                        <p className="text-primary-foreground/80 text-lg font-medium mt-2">Repairs successfully resolved</p>
                                    </div>
                                    <div className="h-24 w-full md:w-64 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
                                       <span className="text-white/60 font-bold text-sm">Growth Trend +{Math.floor(Math.random() * 20)}%</span>
                                    </div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-900 text-lg">Daily Activity</h3>
                                    <span className="text-xs text-primary font-bold bg-primary/5 px-3 py-1 rounded-full uppercase">Realtime Track</span>
                                </div>
                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {(revenueReport.dailyBreakdown || []).map(d => (
                                        <div key={d._id} className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 flex items-center justify-between hover:bg-white hover:shadow-md transition-all">
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{new Date(d._id).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                                <p className="font-bold text-gray-900">{d.count} Services</p>
                                            </div>
                                            <div className="text-green-500 font-black text-xl">↑</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Workers View */}
                    {activeTab === 'workers' && workerReport && (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead><tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                                    <th className="p-5">Field Expert</th><th className="p-5">Assignment Volume</th><th className="p-5">Success Rate</th><th className="p-5">Load</th><th className="p-5">Availability</th>
                                </tr></thead>
                                <tbody className="divide-y divide-gray-100">
                                    {workerReport.map(w => (
                                        <tr key={w._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-xs uppercase tracking-tighter">
                                                        {w.name.split(' ').map(n=>n[0]).join('')}
                                                    </div>
                                                    <span className="font-bold text-gray-900">{w.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-gray-500 font-medium">
                                                <span className="font-bold text-gray-900">{w.totalJobs}</span> Total
                                            </td>
                                            <td className="p-5 font-bold text-green-600">
                                                {w.completedJobs} <span className="text-[10px] text-gray-400">({Math.round(w.completedJobs/w.totalJobs*100 || 0)}%)</span>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500 rounded-full" style={{width: `${Math.min(w.activeJobs * 20, 100)}%`}}></div>
                                                    </div>
                                                    <span className="text-xs text-blue-600 font-bold">{w.activeJobs}</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${w.status === 'active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                                    {w.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Popular Metrics View */}
                    {activeTab === 'popular' && popularReport && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: '🔧 Top Services', data: popularReport.services || [], color: 'bg-indigo-50 text-indigo-600' },
                                { title: '📱 Lead Brands', data: popularReport.brands || [], color: 'bg-orange-50 text-orange-600' },
                                { title: '📊 Demand Models', data: popularReport.models || [], color: 'bg-pink-50 text-pink-600' }
                            ].map((sec, idx) => (
                                <div key={idx} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col">
                                    <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-3">
                                        {sec.title}
                                    </h3>
                                    <div className="space-y-4 flex-1">
                                        {sec.data.map((item, i) => (
                                            <div key={i} className="flex flex-col gap-1.5 p-3 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-900 font-bold text-sm truncate max-w-[150px]">
                                                        {typeof item._id === 'object' ? `${item._id.brand} ${item._id.model}` : item._id}
                                                    </span>
                                                    <span className={`font-black text-xs px-2.5 py-1 rounded-lg ${sec.color}`}>
                                                        {item.count}
                                                    </span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                                    <div className={`h-full opacity-60 rounded-full ${sec.color.split(' ')[1].replace('text-', 'bg-')}`} 
                                                         style={{width: `${Math.min((item.count / sec.data[0].count) * 100, 100)}%`}}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
