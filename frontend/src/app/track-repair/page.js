"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const statusConfig = {
    "Received": { label: "Received", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-400" },
    "Diagnosing": { label: "Diagnosing", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200", dot: "bg-indigo-400" },
    "Waiting for Parts": { label: "Waiting for Parts", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", dot: "bg-yellow-400" },
    "In Progress": { label: "In Progress", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-400" },
    "Testing": { label: "Testing", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", dot: "bg-purple-500" },
    "Ready for Pickup": { label: "Ready for Pickup", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200", dot: "bg-teal-500" },
    "Completed": { label: "Completed", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", dot: "bg-green-500" },
    "Cancelled": { label: "Cancelled", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-400" },
};

const TIMELINE_STEPS = [
    { key: "Received", label: "Booking Confirmed", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { key: "Diagnosing", label: "Diagnosing Device", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { key: "Waiting for Parts", label: "Waiting for Parts", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { key: "In Progress", label: "Repair In Progress", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
    { key: "Testing", label: "Quality Check", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
    { key: "Ready for Pickup", label: "Ready for Pickup", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
    { key: "Completed", label: "Delivered", icon: "M5 13l4 4L19 7" },
];

function TrackRepairContent() {
    const searchParams = useSearchParams();
    const [trackingId, setTrackingId] = useState("");
    const [repair, setRepair] = useState(null);
    const [updates, setUpdates] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [cmsData, setCmsData] = useState(null);

    useEffect(() => {
        fetch(`${API}/api/cms/track-repair`)
            .then(res => res.json())
            .then(data => setCmsData(data))
            .catch(err => console.error("Failed to fetch CMS", err));

        // Auto-track if ID provided in query
        const id = searchParams.get('id');
        if (id) {
            setTrackingId(id.toUpperCase());
            performTracking(id.toUpperCase());
        }
    }, [searchParams]);

    const performTracking = async (tid) => {
        setLoading(true);
        setError("");
        setRepair(null);
        setUpdates([]);
        try {
            const res = await fetch(`${API}/api/bookings/track/${tid.trim().toUpperCase()}`);
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setRepair(data);
                setUpdates(data.timeline || []);
            }
        } catch (err) {
            setError("No repair found with this tracking ID. Please check and try again.");
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!trackingId.trim()) {
            setError("Please enter a tracking ID");
            return;
        }
        performTracking(trackingId);
    };

    // Build timeline from booking status and updates
    const buildTimeline = () => {
        if (!repair) return [];
        const statusIdx = TIMELINE_STEPS.findIndex(s => s.key === repair.status);
        
        return TIMELINE_STEPS.filter(s => s.key !== "Waiting for Parts" || repair.status === "Waiting for Parts" || updates.some(u => u.status === "Waiting for Parts")).map((step, idx) => {
            const stepIdx = TIMELINE_STEPS.findIndex(s => s.key === step.key);
            const isDone = stepIdx <= statusIdx;
            const update = updates.find(u => u.status === step.key);
            const time = update ? new Date(update.time).toLocaleString() : (isDone ? '' : 'Pending');
            return { ...step, done: isDone, time, note: update?.note };
        });
    };

    const st = repair ? statusConfig[repair.status] || statusConfig["Received"] : null;
    const timeline = buildTimeline();

    return (
        <div className="bg-surface min-h-screen font-sans selection:bg-primary/20">
            {/* Elegant Light Hero Section */}
            <section className="relative bg-white overflow-hidden pt-20 pb-32 border-b border-gray-100">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[80px]"></div>
                    <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse duration-[8000ms]"></div>
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface to-transparent"></div>
                </div>

                <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 mt-12">
                    <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-5 py-2 mb-8 shadow-sm">
                        <div className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                        </div>
                        <span className="text-primary text-xs font-bold tracking-widest uppercase">Live Tracking</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark mb-6 tracking-tight">
                        {cmsData?.hero?.title || "Track Your Repair"}
                    </h1>
                    <p className="text-muted text-lg sm:text-xl mb-12 max-w-2xl mx-auto font-medium">
                        {cmsData?.hero?.subtitle || "Enter your tracking ID below to get real-time, step-by-step updates on your device's journey."}
                    </p>

                    {/* Search Box */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-[20px] scale-105 opacity-50 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative flex items-center bg-white border border-gray-200 rounded-3xl p-2.5 shadow-xl shadow-gray-200/50 transition-all duration-300 hover:shadow-2xl hover:border-primary/20 hover:shadow-primary/10">
                            <div className="pl-5 pr-3 text-muted">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={trackingId}
                                onChange={(e) => { setTrackingId(e.target.value); setError(""); }}
                                placeholder="Tracking ID (e.g. MOB-2026-XXXX)"
                                className="w-full py-4 bg-transparent text-dark placeholder-muted focus:outline-none text-lg font-semibold tracking-wide"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="shrink-0 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark hover:scale-[0.98] active:scale-95 transition-all text-sm disabled:opacity-70 disabled:hover:scale-100 shadow-md shadow-primary/20"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Locating...
                                    </span>
                                ) : "Track Device"}
                            </button>
                        </div>

                        {error && (
                            <div className="absolute top-full left-0 right-0 mt-4 flex items-center justify-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-2xl px-5 py-3 animate-in slide-in-from-top-2 shadow-sm">
                                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            </section>

            {/* Results Section */}
            <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-10 relative z-20">
                {!repair && !loading && !error && (
                    <div className="text-center pb-16 pt-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {(cmsData?.features?.length > 0 ? cmsData.features : [
                                { title: "Real-Time Updates", desc: "Watch your device move through our repair stages with live, to-the-minute updates." },
                                { title: "Complete Transparency", desc: "No hidden steps. You see exactly what our technicians are working on." },
                                { title: "Instant Notifications", desc: "Get pinged via SMS and Email the moment a repair milestone is reached." }
                            ]).map((feat, idx) => {
                                const colors = [
                                    { bg: "bg-blue-50", text: "text-blue-500", path: "M13 10V3L4 14h7v7l9-11h-7z" },
                                    { bg: "bg-green-50", text: "text-green-500", path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                                    { bg: "bg-purple-50", text: "text-purple-500", path: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }
                                ];
                                const c = colors[idx % colors.length];
                                return (
                                    <div key={idx} className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
                                        <div className={`w-16 h-16 ${c.bg} rounded-2xl flex items-center justify-center mx-auto mb-5 ${c.text}`}>
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={c.path} />
                                            </svg>
                                        </div>
                                        <h4 className="font-bold text-dark text-lg mb-2">{feat.title}</h4>
                                        <p className="text-sm text-muted leading-relaxed">{feat.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-xl font-bold text-dark mb-2">Locating Your Device</h3>
                        <p className="text-muted text-sm">Securely fetching your repair details...</p>
                    </div>
                )}

                {repair && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        {/* Status Banner */}
                        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border-2 shadow-lg ${st.border} ${st.bg} bg-opacity-50 backdrop-blur-sm`}>
                            <div className="flex items-center gap-5">
                                <div className="relative flex items-center justify-center">
                                    <div className={`absolute w-full h-full rounded-full opacity-30 ${st.dot} ${['In Progress', 'Diagnosing', 'Testing'].includes(repair.status) ? 'animate-ping' : ''}`}></div>
                                    <div className={`w-5 h-5 rounded-full ${st.dot} shadow-md`}></div>
                                </div>
                                <div>
                                    <span className={`font-black tracking-tight text-2xl ${st.color}`}>{st.label}</span>
                                    <p className="text-sm text-muted mt-1 font-medium">Tracking ID: <span className="font-mono font-bold text-dark px-2 py-0.5 bg-white rounded-md shadow-sm ml-1">{repair.trackingToken}</span></p>
                                </div>
                            </div>
                            <div className="text-right bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 w-full sm:w-auto">
                                <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-1">Booked On</p>
                                <p className="font-bold text-dark text-lg">{new Date(repair.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Column: Device & Repair Info */}
                            <div className="lg:col-span-5 space-y-6">
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                                    <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-dark text-lg">Device Details</h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl">
                                            <span className="text-sm font-medium text-muted">Brand</span>
                                            <span className="font-bold text-dark">{repair.brand}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl">
                                            <span className="text-sm font-medium text-muted">Model</span>
                                            <span className="font-bold text-dark">{repair.model}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl">
                                            <span className="text-sm font-medium text-muted">Service</span>
                                            <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg text-sm">{repair.serviceType}</span>
                                        </div>
                                        {repair.issue && (
                                            <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl">
                                                <span className="text-sm font-medium text-muted">Issue</span>
                                                <span className="font-bold text-dark text-right max-w-[60%]">{repair.issue}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Assignment & Cost */}
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                                    <div className="p-6 space-y-5">
                                        <div className="flex justify-between items-end border-b border-gray-100 pb-5">
                                            <div>
                                                <p className="text-sm font-semibold text-muted mb-1 uppercase tracking-wider">Total Est. Cost</p>
                                                <p className="text-3xl font-black text-dark">₹{repair.total_amount || repair.estimatedCost || 'N/A'}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Payment Summary */}
                                        {repair.payment_mode && (
                                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-muted">Payment Mode</span>
                                                    <span className="font-bold text-dark text-sm uppercase">
                                                        {repair.payment_mode.replace('online_', '').replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-muted">Status</span>
                                                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                                        repair.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                                                        repair.payment_status === 'partially_paid' ? 'bg-indigo-100 text-indigo-700' :
                                                        repair.payment_status === 'failed' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {repair.payment_status?.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-muted">Paid Amount</span>
                                                    <span className="font-bold text-green-600">₹{(repair.amount_paid_online || 0) + (repair.amount_paid_at_store || 0)}</span>
                                                </div>
                                                {repair.amount_due > 0 && (
                                                    <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
                                                        <span className="text-sm font-bold text-dark">Amount Due</span>
                                                        <span className="font-bold text-red-500">₹{repair.amount_due}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {repair.assignedWorker && (
                                            <div className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                                    {repair.assignedWorker.name?.charAt(0) || 'T'}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-0.5">Assigned Expert</p>
                                                    <p className="font-bold text-dark text-lg">{repair.assignedWorker.name}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Need Help */}
                                <div className="relative overflow-hidden bg-gradient-to-br from-dark to-[#1a1d24] rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full blur-[40px] mix-blend-screen"></div>
                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <h4 className="text-xl font-bold mb-2">Need Assistance?</h4>
                                        <p className="text-white/70 text-sm mb-6">Our support heroes are available 24/7 to answer your queries.</p>
                                        <a href="tel:+919876543210" className="inline-flex items-center justify-center gap-2 w-full bg-white text-dark font-bold py-3.5 px-6 rounded-xl hover:bg-gray-100 active:scale-95 transition-all shadow-lg hover:shadow-white/20">
                                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            Call Support
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Timeline */}
                            <div className="lg:col-span-7">
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 p-6 sm:p-10 h-full">
                                    <h3 className="font-bold text-dark text-xl mb-10 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        Live Repair Timeline
                                    </h3>

                                    <div className="relative pl-4 sm:pl-8">
                                        {timeline.map((item, idx) => {
                                            const isLast = idx === timeline.length - 1;
                                            const isActive = item.done && (!timeline[idx + 1]?.done);
                                            const isFuture = !item.done;

                                            return (
                                                <div key={idx} className="flex gap-6 sm:gap-8 pb-10 last:pb-0 relative group">
                                                    {!isLast && (
                                                        <div className={`absolute left-[19px] sm:left-[27px] top-12 bottom-0 w-1 rounded-full ${isFuture ? 'bg-gray-100' : 'bg-gradient-to-b from-primary to-primary/50 opacity-50'}`}></div>
                                                    )}
                                                    {!isLast && item.done && timeline[idx + 1]?.done && (
                                                        <div className="absolute left-[19px] sm:left-[27px] top-12 bottom-0 w-1 rounded-full bg-primary shadow-[0_0_10px_rgba(128,0,0,0.5)]"></div>
                                                    )}
                                                    {!isLast && isActive && (
                                                        <div className="absolute left-[19px] sm:left-[27px] top-12 bottom-[50%] w-1 rounded-full bg-gradient-to-b from-primary to-transparent"></div>
                                                    )}

                                                    <div className="relative shrink-0 z-10 w-10 h-10 sm:w-14 sm:h-14 mt-1">
                                                        {isActive && (
                                                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150"></div>
                                                        )}
                                                        <div className={`relative w-full h-full rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-md ${isFuture
                                                            ? 'bg-white border-gray-100 text-gray-400'
                                                            : isActive
                                                                ? 'bg-primary border-primary min-w-[3.5rem] min-h-[3.5rem] text-white shadow-xl shadow-primary/40 -translate-x-1 sm:-translate-x-0 sm:scale-110'
                                                                : 'bg-primary border-white ring-4 ring-primary/20 text-white'
                                                            }`}>
                                                            <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'animate-bounce' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    <div className={`flex-1 pt-1 sm:pt-2 transition-all duration-300 ${isFuture ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                                                        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${isActive
                                                            ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5'
                                                            : 'bg-white border-transparent hover:border-gray-100'
                                                            }`}>
                                                            <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                                                                <h4 className={`font-bold text-base sm:text-lg ${isFuture ? 'text-gray-500' : 'text-dark'}`}>
                                                                    {item.label}
                                                                </h4>
                                                                {isActive && (
                                                                    <span className="text-xs font-bold text-white bg-primary px-3 py-1 rounded-full shadow-sm">
                                                                        Current Stage
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className={`text-sm ${isActive ? 'text-primary/70 font-medium' : 'text-muted'}`}>
                                                                {item.time}
                                                            </p>
                                                            {item.note && (
                                                                <p className="text-xs text-gray-500 mt-1 italic">{item.note}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Customer-visible notes from updates */}
                                    {updates.filter(u => u.isVisibleToCustomer && u.note).length > 0 && (
                                        <div className="mt-8 pt-6 border-t border-gray-100">
                                            <h4 className="font-semibold text-dark mb-3 text-sm">Updates from Technician</h4>
                                            <div className="space-y-2">
                                                {updates.filter(u => u.isVisibleToCustomer && u.note).map((u, i) => (
                                                    <div key={i} className="bg-gray-50 rounded-xl p-3 text-sm">
                                                        <p className="text-dark">{u.note}</p>
                                                        <p className="text-xs text-muted mt-1">{new Date(u.createdAt).toLocaleString()}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Back to search */}
                        <div className="text-center pt-8 pb-4">
                            <button
                                onClick={() => { setRepair(null); setTrackingId(""); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="inline-flex items-center gap-2 text-sm text-dark font-bold bg-white px-6 py-3 rounded-xl border border-gray-200 hover:border-primary hover:text-primary hover:shadow-lg transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Track Another Repair
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

export default function TrackRepairPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center font-bold text-primary">Loading Tracking...</div>}>
            <TrackRepairContent />
        </Suspense>
    );
}
