"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const STATUSES = ['Received', 'Diagnosing', 'Waiting for Parts', 'In Progress', 'Testing', 'Ready for Pickup', 'Completed'];

export default function WorkerDashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('workerToken')}`, 'Content-Type': 'application/json' });

    const fetchJobs = async () => {
        try {
            const res = await fetch(`${API}/api/workers/me/jobs`, { headers: headers() });
            setJobs(await res.json());
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchJobs(); }, []);

    const updateStatus = async (bookingId, status) => {
        try {
            await fetch(`${API}/api/workers/me/jobs/${bookingId}/status`, {
                method: 'PUT', headers: headers(),
                body: JSON.stringify({ status, note: `Status updated to ${status}` })
            });
            fetchJobs();
        } catch (err) { console.error(err); }
    };

    const priorityBadge = (p) => ({
        'Low': 'bg-gray-100 text-gray-600', 'Medium': 'bg-blue-100 text-blue-700',
        'High': 'bg-orange-100 text-orange-700', 'Urgent': 'bg-red-100 text-red-700 animate-pulse'
    }[p] || 'bg-gray-100 text-gray-600');

    const statusColor = (s) => ({
        'Received': 'border-l-blue-500', 'Diagnosing': 'border-l-indigo-500',
        'Waiting for Parts': 'border-l-yellow-500', 'In Progress': 'border-l-orange-500',
        'Testing': 'border-l-purple-500', 'Ready for Pickup': 'border-l-teal-500',
    }[s] || 'border-l-gray-300');

    const urgentJobs = jobs.filter(j => j.priority === 'Urgent' || j.priority === 'High');
    const regularJobs = jobs.filter(j => j.priority !== 'Urgent' && j.priority !== 'High');

    return (
        <div className="animate-in fade-in">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 ">My Jobs</h1>
                <p className="text-sm text-gray-500">{jobs.length} active assignment{jobs.length !== 1 ? 's' : ''}</p>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                    { label: 'Pending', count: jobs.filter(j => j.status === 'Received').length, color: 'text-blue-600' },
                    { label: 'In Progress', count: jobs.filter(j => ['Diagnosing', 'In Progress', 'Testing', 'Waiting for Parts'].includes(j.status)).length, color: 'text-orange-600' },
                    { label: 'Ready', count: jobs.filter(j => j.status === 'Ready for Pickup').length, color: 'text-green-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 shadow-sm border text-center">
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Urgent Jobs */}
            {urgentJobs.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1">🔥 Priority Jobs</h2>
                    <div className="space-y-3">
                        {urgentJobs.map(job => (
                            <JobCard key={job._id} job={job} statusColor={statusColor} priorityBadge={priorityBadge}
                                onStatusChange={updateStatus} statuses={STATUSES} />
                        ))}
                    </div>
                </div>
            )}

            {/* Regular Jobs */}
            <div className="space-y-3">
                {regularJobs.map(job => (
                    <JobCard key={job._id} job={job} statusColor={statusColor} priorityBadge={priorityBadge}
                        onStatusChange={updateStatus} statuses={STATUSES} />
                ))}
            </div>

            {!loading && !jobs.length && (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-lg font-medium text-gray-900 ">All clear!</p>
                    <p className="text-sm text-gray-500">No active jobs assigned to you</p>
                </div>
            )}

            {loading && (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}
        </div>
    );
}

function JobCard({ job, statusColor, priorityBadge, onStatusChange, statuses }) {
    const [expanded, setExpanded] = useState(false);

    const nextStatus = () => {
        const idx = statuses.indexOf(job.status);
        if (idx < statuses.length - 1) return statuses[idx + 1];
        return null;
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-l-4 ${statusColor(job.status)} overflow-hidden transition-all`}>
            <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="font-semibold text-gray-900 ">{job.brand} {job.model}</p>
                        <p className="text-sm text-gray-500">{job.serviceType}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityBadge(job.priority)}`}>{job.priority}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-mono">{job.trackingToken}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">{job.status}</span>
                </div>
            </div>

            {expanded && (
                <div className="px-4 pb-4 border-t pt-3 space-y-3 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-xs text-gray-400 block">Customer</span>{job.customerName}</div>
                        <div><span className="text-xs text-gray-400 block">Phone</span>
                            <a href={`tel:${job.phone}`} className="text-primary">{job.phone}</a>
                        </div>
                        {job.issue && <div className="col-span-2"><span className="text-xs text-gray-400 block">Issue</span>{job.issue}</div>}
                        {job.estimatedCompletion && <div className="col-span-2"><span className="text-xs text-gray-400 block">Due</span>{new Date(job.estimatedCompletion).toLocaleDateString()}</div>}
                    </div>

                    <div className="flex gap-2">
                        {nextStatus() && (
                            <button onClick={(e) => { e.stopPropagation(); onStatusChange(job._id, nextStatus()); }}
                                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                                → {nextStatus()}
                            </button>
                        )}
                        <select value={job.status} onChange={e => onStatusChange(job._id, e.target.value)}
                            onClick={e => e.stopPropagation()}
                            className="border rounded-xl px-3 py-2 text-sm ">
                            {statuses.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>

                    <Link href={`/worker/jobs/${job._id}`}
                        className="block text-center text-sm text-primary font-medium hover:underline">
                        View Full Details →
                    </Link>
                </div>
            )}
        </div>
    );
}
