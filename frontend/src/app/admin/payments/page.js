"use client";
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

export default function AdminPaymentsPage() {
    const [stats, setStats] = useState({ revenue: 0, dues: 0, refunds: 0, processing: 0 });
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // all, dues, refunds
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({ search: '', mode: '', dateFrom: '', dateTo: '' });
    const [debouncedSearch, setDebouncedSearch] = useState('');
    
    // Action Modals
    const [collectModal, setCollectModal] = useState({ show: false, payment: null, amount: 0 });
    const [refundModal, setRefundModal] = useState({ show: false, payment: null, amount: 0, type: 'full', reason: '' });

    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API}/api/admin/payments/stats`, { headers: headers() });
            const data = await res.json();
            if (data.online_collected !== undefined) {
                setStats({
                    revenue: (data.online_collected || 0) + (data.store_collected || 0),
                    dues: data.pending_dues || 0,
                    refunds: data.refunds_total || 0,
                    processing: (data.full_payments || 0) + (data.advance_payments || 0) + (data.store_payments || 0)
                });
            }
        } catch (err) { console.error('Failed to fetch stats', err); }
    };

    const fetchPayments = async () => {
        setLoading(true);
        try {
            let url = `${API}/api/admin/payments?page=${page}&limit=20`;
            if (activeTab === 'dues') url += '&tab=pending_dues';
            if (activeTab === 'refunds') url += '&tab=refunds';
            if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;
            if (filters.mode) url += `&payment_mode=${filters.mode}`;
            if (filters.dateFrom) url += `&dateFrom=${filters.dateFrom}`;
            if (filters.dateTo) url += `&dateTo=${filters.dateTo}`;
            
            const res = await fetch(url, { headers: headers() });
            const data = await res.json();
            
            if (data.payments) {
                setPayments(data.payments);
                setTotalPages(data.totalPages);
            }
        } catch (err) {
            console.error('Failed to fetch payments', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search);
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    useEffect(() => {
        fetchPayments();
    }, [page, activeTab, debouncedSearch, filters.mode, filters.dateFrom, filters.dateTo]);

    const handleMarkCollected = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/api/admin/payments/mark-collected`, {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify({ bookingId: collectModal.payment._id, amount_collected: Number(collectModal.amount) })
            });
            const data = await res.json();
            if (data.success) {
                setCollectModal({ show: false, payment: null, amount: 0 });
                fetchStats();
                fetchPayments();
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) { alert('Failed processing request'); }
    };

    const handleInitiateRefund = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/api/admin/payments/refund`, {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify({ 
                    bookingId: refundModal.payment._id, 
                    refund_amount: Number(refundModal.amount),
                    refund_reason: refundModal.reason,
                    refund_type: refundModal.type
                })
            });
            const data = await res.json();
            if (data.success) {
                setRefundModal({ show: false, payment: null, amount: 0, type: 'full', reason: '' });
                fetchStats();
                fetchPayments();
                alert('Refund initiated successfully!');
            } else {
                alert('Refund Failed: ' + data.error);
            }
        } catch (err) { alert('Failed to initiate refund'); }
    };

    // Helper functions for UI
    const getStatusColor = (status) => {
        const smap = {
            'paid': 'bg-green-100 text-green-700 border-green-200',
            'partially_paid': 'bg-blue-100 text-blue-700 border-blue-200',
            'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'failed': 'bg-red-100 text-red-700 border-red-200',
            'refunded': 'bg-purple-100 text-purple-700 border-purple-200',
            'partially_refunded': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
        };
        return smap[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getModeLabel = (mode) => {
        if (!mode) return 'N/A';
        return mode.replace('online_', '').replace('_', ' ').toUpperCase();
    };

    return (
        <div className="animate-in fade-in space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Payments Overview</h1>
                <p className="text-sm text-gray-500 font-medium mt-1">Manage all store transactions, dues, and Razorpay refunds.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[40px] -z-10 group-hover:bg-green-500/20 transition-all duration-500"></div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-black text-gray-900">₹{stats.revenue.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[40px] -z-10 group-hover:bg-orange-500/20 transition-all duration-500"></div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Dues</p>
                        <h3 className="text-3xl font-black text-gray-900">₹{stats.dues.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] -z-10 group-hover:bg-purple-500/20 transition-all duration-500"></div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Refunded</p>
                        <h3 className="text-3xl font-black text-gray-900">₹{stats.refunds.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] -z-10 group-hover:bg-blue-500/20 transition-all duration-500"></div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Transactions</p>
                        <h3 className="text-3xl font-black text-gray-900">{stats.processing}</h3>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-6">
                        {['all', 'dues', 'refunds'].map(t => (
                            <button key={t} onClick={() => { setActiveTab(t); setPage(1); }} className={`pb-4 -mb-4 px-2 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === t ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>
                                {t === 'all' ? 'All Transactions' : t === 'dues' ? 'Pending Store' : 'Refunds'}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <input 
                                type="text" 
                                placeholder="Search tracking ID, name..." 
                                value={filters.search}
                                onChange={(e) => setFilters({...filters, search: e.target.value})}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                            />
                            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        
                        <select 
                            value={filters.mode}
                            onChange={(e) => setFilters({...filters, mode: e.target.value})}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none"
                        >
                            <option value="">All Modes</option>
                            <option value="online_full">Full Online</option>
                            <option value="online_advance">Advance Online</option>
                            <option value="pay_at_store">Pay At Store</option>
                        </select>
                        
                        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-2 py-1 bg-gray-50">
                            <input 
                                type="date" 
                                value={filters.dateFrom}
                                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                                className="bg-transparent text-xs text-gray-600 outline-none"
                            />
                            <span className="text-gray-300 text-xs">to</span>
                            <input 
                                type="date" 
                                value={filters.dateTo}
                                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                                className="bg-transparent text-xs text-gray-600 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                                <th className="p-5">Booking / Date</th>
                                <th className="p-5">Customer</th>
                                <th className="p-5">Amount Breakup</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center text-gray-400">
                                        <p className="font-bold text-sm">No payments found in this category.</p>
                                    </td>
                                </tr>
                            ) : payments.map(p => (
                                <tr key={p._id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="p-5">
                                        <div className="font-bold text-gray-900">{p.trackingToken}</div>
                                        <div className="text-[11px] text-gray-500 font-medium">{new Date(p.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-5">
                                        <div className="font-bold text-gray-700">{p.customerName}</div>
                                        <div className="text-[11px] text-gray-500">{p.phone}</div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="text-xs text-gray-500 mb-0.5">Total: <span className="font-bold text-gray-900">₹{p.total_amount}</span></div>
                                                <div className="text-[10px] font-semibold text-primary uppercase tracking-wider">{getModeLabel(p.payment_mode)}</div>
                                            </div>
                                            {p.amount_due > 0 && (
                                                <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-orange-100">
                                                    Due: ₹{p.amount_due}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(p.payment_status)}`}>
                                            {p.payment_status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            {p.amount_due > 0 && (p.payment_status === 'pending' || p.payment_status === 'partially_paid') && (
                                                <button onClick={() => setCollectModal({ show: true, payment: p, amount: p.amount_due })} className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors border border-green-200">
                                                    Mark Collected
                                                </button>
                                            )}
                                            {p.payment_status === 'paid' && p.payment_mode !== 'pay_at_store' && !p.refund_type && (
                                                <button onClick={() => setRefundModal({ show: true, payment: p, amount: p.amount_paid_online, type: 'full', reason: '' })} className="px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors border border-transparent hover:border-red-100">
                                                    Refund
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                 <div className="border-t border-gray-100 p-4 flex items-center justify-between bg-gray-50/50">
                    <span className="text-sm font-medium text-gray-500">Page {page} of {totalPages || 1}</span>
                    <div className="flex gap-2">
                        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-gray-700 font-medium text-sm transition-all shadow-sm">Previous</button>
                        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-gray-700 font-medium text-sm transition-all shadow-sm">Next</button>
                    </div>
                </div>
            </div>

            {/* Collect Due Modal */}
            {collectModal.show && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95">
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Collect Store Payment</h3>
                        <p className="text-sm font-medium text-gray-500 mb-6">Marking dues collected from {collectModal.payment.customerName}.</p>
                        
                        <form onSubmit={handleMarkCollected}>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1 mb-1">Total Due (₹)</label>
                                    <input type="number" readOnly value={collectModal.payment.amount_due} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-500 font-bold" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1 mb-1">Amount Collected (₹) *</label>
                                    <input type="number" required max={collectModal.payment.amount_due} min="1" value={collectModal.amount} onChange={e => setCollectModal({...collectModal, amount: e.target.value})} className="w-full bg-white border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none rounded-xl px-4 py-3 font-bold text-gray-900 transition-all" />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button type="button" onClick={() => setCollectModal({ show: false, payment: null, amount: 0 })} className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all">Mark Received</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Refund Modal */}
            {refundModal.show && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 border-t-8 border-red-500">
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Initiate Refund</h3>
                        <p className="text-sm font-medium text-gray-500 mb-6">Refund online payment for {refundModal.payment.customerName}. Note: Refunds usually take 5-7 days to reflect.</p>
                        
                        <form onSubmit={handleInitiateRefund}>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <label className="flex-1 cursor-pointer border-2 rounded-xl p-3 flex gap-2 items-center transition-all has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
                                        <input type="radio" value="full" checked={refundModal.type === 'full'} onChange={() => setRefundModal({...refundModal, type: 'full', amount: refundModal.payment.amount_paid_online})} className="accent-red-500" />
                                        <span className="font-bold text-sm text-gray-900">Full</span>
                                    </label>
                                    <label className="flex-1 cursor-pointer border-2 rounded-xl p-3 flex gap-2 items-center transition-all has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
                                        <input type="radio" value="partial" checked={refundModal.type === 'partial'} onChange={() => setRefundModal({...refundModal, type: 'partial'})} className="accent-red-500" />
                                        <span className="font-bold text-sm text-gray-900">Partial</span>
                                    </label>
                                </div>
                                
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1 mb-1">Refund Amount (₹)</label>
                                    <input type="number" required readOnly={refundModal.type === 'full'} max={refundModal.payment.amount_paid_online} min="1" value={refundModal.amount} onChange={e => setRefundModal({...refundModal, amount: e.target.value})} className={`w-full rounded-xl px-4 py-3 font-bold transition-all ${refundModal.type === 'full' ? 'bg-gray-50 border-transparent text-gray-500' : 'bg-white border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-gray-900'}`} />
                                    <p className="text-[10px] text-gray-400 ml-1 mt-1 font-medium">Max allocatable: ₹{refundModal.payment.amount_paid_online}</p>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1 mb-1">Reason for Refund</label>
                                    <select required value={refundModal.reason} onChange={e => setRefundModal({...refundModal, reason: e.target.value})} className="w-full bg-white border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none rounded-xl px-4 py-3 font-medium text-sm text-gray-700 transition-all">
                                        <option value="">Select Reason</option>
                                        <option value="Customer requested cancellation">Customer requested cancellation</option>
                                        <option value="Device unrepairable">Device unrepairable</option>
                                        <option value="Service unavailable">Service unavailable</option>
                                        <option value="Double payment">Double payment</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button type="button" onClick={() => setRefundModal({ show: false, payment: null, amount: 0, type: 'full', reason: '' })} className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-xl transition-colors">Abort</button>
                                <button type="submit" className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all flex justify-center items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                    Confirm Refund
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
