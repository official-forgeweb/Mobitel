"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function PartnerHistoryPage() {
    const [jobs, setJobs] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('workerToken')}` });

    const fetchHistory = async (p = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/workers/me/history?page=${p}&limit=15`, { headers: headers() });
            const data = await res.json();
            setJobs(data.jobs || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
            setPage(p);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchHistory(); }, []);

    return (
        <div className="animate-in fade-in">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 ">Job History</h1>
                <p className="text-sm text-gray-500">{total} completed/cancelled jobs</p>
            </header>

            <div className="space-y-3">
                {jobs.map(job => (
                    <div key={job._id} className={`bg-white rounded-xl shadow-sm border p-4 border-l-4 ${job.status === 'Completed' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-semibold text-gray-900 ">{job.brand} {job.model}</p>
                                <p className="text-sm text-gray-500">{job.serviceType}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${job.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{job.status}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>{job.customerName} • {job.phone}</span>
                            <span>{new Date(job.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs font-mono text-gray-400 mt-1">{job.trackingToken}</p>
                    </div>
                ))}
            </div>

            {!loading && !jobs.length && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium">No history yet</p>
                    <p className="text-sm">Completed and cancelled jobs will appear here</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 text-sm">
                    <span className="text-gray-500">Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button disabled={page <= 1} onClick={() => fetchHistory(page - 1)} className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 ">Prev</button>
                        <button disabled={page >= totalPages} onClick={() => fetchHistory(page + 1)} className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 ">Next</button>
                    </div>
                </div>
            )}

            {loading && <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}
        </div>
    );
}
