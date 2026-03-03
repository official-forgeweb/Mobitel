"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const STATUSES = ['Received', 'Diagnosing', 'Waiting for Parts', 'In Progress', 'Testing', 'Ready for Pickup', 'Completed'];

export default function JobDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState(null);
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noteText, setNoteText] = useState('');
    const [noteVisible, setNoteVisible] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('workerToken')}`, 'Content-Type': 'application/json' });

    const fetchJob = async () => {
        try {
            // Worker uses the admin booking detail endpoint with their token
            const res = await fetch(`${API}/api/bookings/${id}`, { headers: headers() });
            const data = await res.json();
            setBooking(data.booking);
            setUpdates(data.updates || []);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchJob(); }, [id]);

    const updateStatus = async (status) => {
        setSubmitting(true);
        try {
            await fetch(`${API}/api/workers/me/jobs/${id}/status`, {
                method: 'PUT', headers: headers(),
                body: JSON.stringify({ status, note: `Status updated to ${status}` })
            });
            fetchJob();
        } catch (err) { console.error(err); }
        setSubmitting(false);
    };

    const addNote = async () => {
        if (!noteText.trim()) return;
        setSubmitting(true);
        try {
            await fetch(`${API}/api/bookings/${id}/notes`, {
                method: 'POST', headers: headers(),
                body: JSON.stringify({ note: noteText, isVisibleToCustomer: noteVisible })
            });
            setNoteText('');
            fetchJob();
        } catch (err) { console.error(err); }
        setSubmitting(false);
    };

    if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    if (!booking) return <div className="text-center py-12 text-gray-500">Job not found</div>;

    const currentIdx = STATUSES.indexOf(booking.status);

    return (
        <div className="animate-in fade-in">
            <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
                ← Back
            </button>

            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-5 mb-4">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{booking.brand} {booking.model}</h1>
                        <p className="text-sm text-gray-500">{booking.serviceType}</p>
                    </div>
                    <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">{booking.trackingToken}</span>
                </div>

                {/* Status Stepper */}
                <div className="flex items-center gap-1 overflow-x-auto py-3">
                    {STATUSES.map((s, i) => {
                        const isDone = i <= currentIdx;
                        const isCurrent = i === currentIdx;
                        return (
                            <div key={s} className="flex items-center">
                                <div className={`flex flex-col items-center min-w-[60px]`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isDone ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-400'} ${isCurrent ? 'ring-2 ring-primary/30 ring-offset-2' : ''}`}>
                                        {isDone ? '✓' : i + 1}
                                    </div>
                                    <span className={`text-[10px] mt-1 text-center leading-tight ${isCurrent ? 'font-bold text-primary' : 'text-gray-400'}`}>{s}</span>
                                </div>
                                {i < STATUSES.length - 1 && (
                                    <div className={`w-6 h-0.5 ${isDone ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'} mt-[-12px]`}></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-5 mb-4">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Customer Details</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-xs text-gray-400 block">Name</span>{booking.customerName}</div>
                    <div><span className="text-xs text-gray-400 block">Phone</span>
                        <a href={`tel:${booking.phone}`} className="text-primary font-medium">{booking.phone}</a>
                    </div>
                    {booking.email && <div className="col-span-2"><span className="text-xs text-gray-400 block">Email</span>{booking.email}</div>}
                    {booking.issue && <div className="col-span-2"><span className="text-xs text-gray-400 block">Issues Reported</span>{booking.issue}</div>}
                    {booking.estimatedCost && <div><span className="text-xs text-gray-400 block">Estimated Cost</span>{booking.estimatedCost}</div>}
                    <div><span className="text-xs text-gray-400 block">Priority</span>
                        <span className={`font-medium ${booking.priority === 'Urgent' ? 'text-red-600' : booking.priority === 'High' ? 'text-orange-600' : ''}`}>{booking.priority}</span>
                    </div>
                </div>
            </div>

            {/* Status Update */}
            {booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-5 mb-4">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Update Status</h2>
                    <div className="flex flex-wrap gap-2">
                        {STATUSES.map(s => (
                            <button key={s} onClick={() => updateStatus(s)} disabled={submitting || s === booking.status}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${s === booking.status ? 'bg-primary text-white' : 'border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'} disabled:opacity-50`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Note */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-5 mb-4">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Add Note</h2>
                <textarea rows={3} value={noteText} onChange={e => setNoteText(e.target.value)}
                    placeholder="Write a note about this repair..."
                    className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 text-sm mb-2 dark:bg-gray-700 dark:text-white" />
                <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-sm text-gray-500">
                        <input type="checkbox" checked={noteVisible} onChange={e => setNoteVisible(e.target.checked)} className="rounded" />
                        Visible to customer
                    </label>
                    <button onClick={addNote} disabled={submitting || !noteText.trim()}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                        Add Note
                    </button>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-5">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Timeline</h2>
                <div className="space-y-3">
                    {updates.map((u, i) => (
                        <div key={i} className="flex gap-3 text-sm">
                            <div className="flex flex-col items-center">
                                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${u.status === 'Completed' ? 'bg-green-500' : u.status === 'Cancelled' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                {i < updates.length - 1 && <div className="w-px h-full bg-gray-200 dark:bg-gray-600 flex-1 mt-1"></div>}
                            </div>
                            <div className="pb-3">
                                <p className="font-medium text-gray-900 dark:text-white">{u.status || 'Note'}</p>
                                <p className="text-gray-500 text-xs">{u.note}</p>
                                <p className="text-gray-400 text-xs mt-0.5">
                                    {u.updatedBy?.name || 'System'} • {new Date(u.createdAt).toLocaleString()}
                                    {u.isVisibleToCustomer ? <span className="text-green-500 ml-1">👁</span> : <span className="text-gray-400 ml-1">🔒</span>}
                                </p>
                            </div>
                        </div>
                    ))}
                    {!updates.length && <p className="text-xs text-gray-400">No updates yet</p>}
                </div>
            </div>
        </div>
    );
}
