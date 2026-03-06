"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';
const STATUSES = ['Received', 'Diagnosing', 'Waiting for Parts', 'In Progress', 'Testing', 'Ready for Pickup', 'Completed', 'Cancelled'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
    const [workers, setWorkers] = useState([]);
    const [selected, setSelected] = useState(null); // booking detail view
    const [updates, setUpdates] = useState([]);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteData, setNoteData] = useState({ bookingId: '', note: '', isVisibleToCustomer: true });

    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

    const fetchBookings = async (p = page) => {
        setLoading(true);
        const params = new URLSearchParams({ page: p, limit: 15 });
        if (filters.status) params.set('status', filters.status);
        if (filters.priority) params.set('priority', filters.priority);
        if (filters.search) params.set('search', filters.search);

        try {
            const res = await fetch(`${API}/api/bookings?${params}`, { headers: headers() });
            const data = await res.json();
            setBookings(data.bookings || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const fetchWorkers = async () => {
        try {
            const res = await fetch(`${API}/api/workers`, { headers: headers() });
            setWorkers(await res.json());
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchBookings(1); fetchWorkers(); }, []);
    useEffect(() => { const t = setTimeout(() => fetchBookings(1), 300); return () => clearTimeout(t); }, [filters]);

    const viewBooking = async (id) => {
        try {
            const res = await fetch(`${API}/api/bookings/${id}`, { headers: headers() });
            const data = await res.json();
            setSelected(data.booking);
            setUpdates(data.updates || []);
        } catch (err) { console.error(err); }
    };

    const updateStatus = async (id, status) => {
        await fetch(`${API}/api/bookings/${id}/status`, {
            method: 'PUT', headers: headers(), body: JSON.stringify({ status })
        });
        fetchBookings(); if (selected?._id === id) viewBooking(id);
    };

    const assignWorker = async (id, workerId) => {
        await fetch(`${API}/api/bookings/${id}/assign`, {
            method: 'PUT', headers: headers(), body: JSON.stringify({ workerId })
        });
        fetchBookings(); if (selected?._id === id) viewBooking(id);
    };

    const cancelBooking = async (id) => {
        const reason = prompt('Cancellation reason (optional):') || '';
        await fetch(`${API}/api/bookings/${id}/cancel`, {
            method: 'PUT', headers: headers(), body: JSON.stringify({ reason })
        });
        fetchBookings(); if (selected?._id === id) viewBooking(id);
    };

    const addNote = async () => {
        await fetch(`${API}/api/bookings/${noteData.bookingId}/notes`, {
            method: 'POST', headers: headers(), body: JSON.stringify(noteData)
        });
        setShowNoteModal(false);
        setNoteData({ bookingId: '', note: '', isVisibleToCustomer: true });
        if (selected?._id === noteData.bookingId) viewBooking(noteData.bookingId);
    };

    const updatePriority = async (id, priority) => {
        await fetch(`${API}/api/bookings/${id}`, {
            method: 'PUT', headers: headers(), body: JSON.stringify({ priority })
        });
        fetchBookings();
    };

    const statusColor = (s) => ({
        'Received': 'bg-blue-100 text-blue-700', 'Diagnosing': 'bg-indigo-100 text-indigo-700',
        'Waiting for Parts': 'bg-yellow-100 text-yellow-700', 'In Progress': 'bg-orange-100 text-orange-700',
        'Testing': 'bg-purple-100 text-purple-700', 'Ready for Pickup': 'bg-teal-100 text-teal-700',
        'Completed': 'bg-green-100 text-green-700', 'Cancelled': 'bg-red-100 text-red-700'
    }[s] || 'bg-gray-100 text-gray-700');

    const priorityColor = (p) => ({
        'Low': 'text-gray-500', 'Medium': 'text-blue-500', 'High': 'text-orange-500', 'Urgent': 'text-red-600 font-bold'
    }[p] || '');

    return (
        <div className="animate-in fade-in">
            <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                    <p className="text-sm text-gray-500">{total} total bookings</p>
                </div>
            </header>

            {/* Filters */}
            <div className="flex flex-col md:flex-row flex-wrap gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1 min-w-[240px]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search by name, phone, token..." 
                        value={filters.search}
                        onChange={e => setFilters({ ...filters, search: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>
                <div className="flex flex-wrap gap-3">
                    <select 
                        value={filters.status} 
                        onChange={e => setFilters({ ...filters, status: e.target.value })}
                        className="flex-1 sm:flex-none min-w-[140px] border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select 
                        value={filters.priority} 
                        onChange={e => setFilters({ ...filters, priority: e.target.value })}
                        className="flex-1 sm:flex-none min-w-[140px] border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                    >
                        <option value="">All Priorities</option>
                        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {(filters.status || filters.priority || filters.search) && (
                        <button 
                            onClick={() => setFilters({ status: '', priority: '', search: '' })}
                            className="px-4 py-2 text-sm text-gray-500 hover:text-primary font-medium transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            <div className="flex gap-6">
                {/* Bookings Table */}
                <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${selected ? 'w-1/2 hidden lg:block' : 'w-full'}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wider">
                                    <th className="p-3">Token</th>
                                    <th className="p-3">Customer</th>
                                    <th className="p-3 hidden sm:table-cell">Device</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 hidden lg:table-cell">Priority</th>
                                    <th className="p-3 hidden xl:table-cell">Worker</th>
                                    <th className="p-3 hidden md:table-cell text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bookings.map(b => (
                                    <tr key={b._id} className={`hover:bg-gray-50 cursor-pointer transition-colors ${selected?._id === b._id ? 'bg-blue-50' : ''}`}
                                        onClick={() => viewBooking(b._id)}>
                                        <td className="p-3 font-mono text-xs font-bold text-primary">{b.trackingToken}</td>
                                        <td className="p-3">
                                            <div className="text-gray-900 font-medium truncate max-w-[120px] sm:max-w-none">{b.customerName}</div>
                                            <div className="text-[11px] text-gray-400">{b.phone}</div>
                                        </td>
                                        <td className="p-3 text-gray-600 hidden sm:table-cell">{b.brand} {b.model}</td>
                                        <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusColor(b.status)}`}>{b.status}</span></td>
                                        <td className={`p-3 text-xs font-medium hidden lg:table-cell ${priorityColor(b.priority)}`}>{b.priority}</td>
                                        <td className="p-3 text-xs text-gray-500 hidden xl:table-cell">{b.assignedWorker?.name || <span className="italic text-gray-400">Unassigned</span>}</td>
                                        <td className="p-3 text-right hidden md:table-cell" onClick={e => e.stopPropagation()}>
                                            <select className="text-xs border rounded px-1 py-1 bg-white border-gray-300 text-gray-900 focus:ring-1 focus:ring-primary outline-none"
                                                value={b.status} onChange={e => updateStatus(b._id, e.target.value)}>
                                                {STATUSES.map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && !bookings.length && (
                                    <tr><td colSpan="7" className="p-8 text-center text-gray-500">No bookings found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="p-3 border-t border-gray-100 flex justify-between items-center text-sm">
                            <span className="text-gray-500">Page {page} of {totalPages}</span>
                            <div className="flex gap-2">
                                <button disabled={page <= 1} onClick={() => { setPage(page - 1); fetchBookings(page - 1); }}
                                    className="px-3 py-1 rounded border border-gray-300 text-xs disabled:opacity-50 hover:bg-gray-50">Prev</button>
                                <button disabled={page >= totalPages} onClick={() => { setPage(page + 1); fetchBookings(page + 1); }}
                                    className="px-3 py-1 rounded border border-gray-300 text-xs disabled:opacity-50 hover:bg-gray-50">Next</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Detail Panel */}
                {selected && (
                    <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-y-auto max-h-[80vh] sticky top-20">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                            <div>
                                <p className="text-lg font-bold text-primary font-mono">{selected.trackingToken}</p>
                                <p className="text-sm text-gray-500">{selected.customerName} • {selected.phone}</p>
                            </div>
                            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div><span className="text-gray-500 block text-xs">Brand/Model</span>{selected.brand} {selected.model}</div>
                                <div><span className="text-gray-500 block text-xs">Service</span>{selected.serviceType}</div>
                                <div><span className="text-gray-500 block text-xs">Email</span>{selected.email || 'N/A'}</div>
                                <div><span className="text-gray-500 block text-xs">Issue</span>{selected.issue || 'N/A'}</div>
                                <div><span className="text-gray-500 block text-xs">Preferred Date</span>{selected.preferredDate || 'N/A'}</div>
                                <div><span className="text-gray-500 block text-xs">Preferred Time</span>{selected.preferredTime || 'N/A'}</div>
                            </div>

                            {/* Status and Worker */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                                    <select value={selected.status} className="w-full border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900"
                                        onChange={e => updateStatus(selected._id, e.target.value)}>
                                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Assign Worker</label>
                                    <select value={selected.assignedWorker?._id || ''} className="w-full border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900"
                                        onChange={e => assignWorker(selected._id, e.target.value)}>
                                        <option value="">Unassigned</option>
                                        {workers.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
                                    <select value={selected.priority} className="w-full border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900"
                                        onChange={e => updatePriority(selected._id, e.target.value)}>
                                        {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-end gap-2">
                                    <button onClick={() => { setNoteData({ bookingId: selected._id, note: '', isVisibleToCustomer: true }); setShowNoteModal(true); }}
                                        className="px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90">Add Note</button>
                                    {selected.status !== 'Cancelled' && (
                                        <button onClick={() => cancelBooking(selected._id)}
                                            className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">Cancel</button>
                                    )}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Timeline</h3>
                                <div className="space-y-3">
                                    {updates.map((u, i) => (
                                        <div key={i} className="flex gap-3 text-sm">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${u.status === 'Completed' ? 'bg-green-500' : u.status === 'Cancelled' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                                {i < updates.length - 1 && <div className="w-px h-full bg-gray-200 flex-1 mt-1"></div>}
                                            </div>
                                            <div className="pb-4">
                                                <p className="font-medium text-gray-900">{u.status || 'Note'}</p>
                                                <p className="text-gray-500 text-xs">{u.note}</p>
                                                <p className="text-gray-400 text-xs mt-1">
                                                    {u.updatedBy?.name || 'System'} • {new Date(u.createdAt).toLocaleString()}
                                                    {u.isVisibleToCustomer && <span className="ml-1 text-green-500">👁 visible</span>}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Note Modal */}
            {showNoteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNoteModal(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Add Note</h3>
                        <textarea rows={4} value={noteData.note} onChange={e => setNoteData({ ...noteData, note: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-3 bg-white text-gray-900" placeholder="Enter note..." />
                        <label className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <input type="checkbox" checked={noteData.isVisibleToCustomer}
                                onChange={e => setNoteData({ ...noteData, isVisibleToCustomer: e.target.checked })} className="rounded" />
                            Visible to customer
                        </label>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowNoteModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                            <button onClick={addNote} disabled={!noteData.note} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">Add Note</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
