"use client";

import { useState } from "react";

// Demo repair data for simulation
const demoRepairs = {
    "MOB-2024-7821": {
        id: "MOB-2024-7821",
        brand: "Apple",
        model: "iPhone 15 Pro Max",
        issue: "Screen Replacement",
        serviceType: "Home Service",
        status: "in-progress",
        estimatedCost: "₹8,499",
        date: "Feb 24, 2026",
        estimatedDelivery: "Feb 27, 2026",
        technician: "Rahul Sharma",
        timeline: [
            { step: "Booking Confirmed", time: "Feb 24, 10:30 AM", done: true, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            { step: "Technician Assigned", time: "Feb 24, 11:00 AM", done: true, icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
            { step: "Device Picked Up", time: "Feb 24, 2:00 PM", done: true, icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
            { step: "Repair In Progress", time: "Feb 25, 10:00 AM", done: true, icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
            { step: "Quality Check", time: "Pending", done: false, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
            { step: "Delivered", time: "Pending", done: false, icon: "M5 13l4 4L19 7" },
        ],
    },
    "MOB-2024-5493": {
        id: "MOB-2024-5493",
        brand: "Samsung",
        model: "Galaxy S24 Ultra",
        issue: "Battery Replacement",
        serviceType: "Visit Shop",
        status: "completed",
        estimatedCost: "₹2,199",
        date: "Feb 20, 2026",
        estimatedDelivery: "Feb 21, 2026",
        technician: "Priya Verma",
        timeline: [
            { step: "Booking Confirmed", time: "Feb 20, 9:00 AM", done: true, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            { step: "Device Received at Shop", time: "Feb 20, 10:30 AM", done: true, icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
            { step: "Repair In Progress", time: "Feb 20, 11:00 AM", done: true, icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
            { step: "Quality Check", time: "Feb 20, 12:30 PM", done: true, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
            { step: "Ready for Pickup", time: "Feb 20, 1:00 PM", done: true, icon: "M5 13l4 4L19 7" },
            { step: "Delivered", time: "Feb 21, 10:00 AM", done: true, icon: "M5 13l4 4L19 7" },
        ],
    },
};

const statusConfig = {
    "in-progress": { label: "In Progress", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-400" },
    "completed": { label: "Completed", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", dot: "bg-green-500" },
    "pending": { label: "Pending", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-400" },
    "cancelled": { label: "Cancelled", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-400" },
};

export default function TrackRepairPage() {
    const [trackingId, setTrackingId] = useState("");
    const [repair, setRepair] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setError("");
        setRepair(null);

        if (!trackingId.trim()) {
            setError("Please enter a tracking ID");
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const found = demoRepairs[trackingId.trim().toUpperCase()];
            if (found) {
                setRepair(found);
            } else {
                setError("No repair found with this tracking ID. Please check and try again.");
            }
            setLoading(false);
        }, 1200);
    };

    const st = repair ? statusConfig[repair.status] : null;

    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-dark via-primary to-primary-dark overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white/90 text-xs font-medium">Live Tracking Available</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        Track Your Repair
                    </h1>
                    <p className="text-white/70 text-base sm:text-lg mb-10 max-w-xl mx-auto">
                        Enter your repair tracking ID to get real-time updates on the status of your device repair
                    </p>

                    {/* Search Box */}
                    <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                        <div className="relative flex items-center">
                            <div className="absolute left-4 text-white/40">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={trackingId}
                                onChange={(e) => { setTrackingId(e.target.value); setError(""); }}
                                placeholder="e.g. MOB-2024-7821"
                                className="w-full pl-12 pr-36 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all text-base"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-2 px-6 py-2.5 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 active:scale-[0.97] transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Searching
                                    </span>
                                ) : "Track Now"}
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 flex items-center justify-center gap-2 text-red-300 text-sm bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3">
                                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Demo hint */}
                        <p className="mt-4 text-white/40 text-xs">
                            Try: <button type="button" onClick={() => setTrackingId("MOB-2024-7821")} className="text-white/70 underline underline-offset-2 hover:text-white transition-colors">MOB-2024-7821</button> or <button type="button" onClick={() => setTrackingId("MOB-2024-5493")} className="text-white/70 underline underline-offset-2 hover:text-white transition-colors">MOB-2024-5493</button>
                        </p>
                    </form>
                </div>
            </section>

            {/* Results Section */}
            <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {!repair && !loading && !error && (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-surface rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border">
                            <svg className="w-10 h-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-dark mb-2">Enter Your Tracking ID</h3>
                        <p className="text-muted text-sm max-w-md mx-auto">Your tracking ID was shared with you via SMS and email when you booked a repair</p>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto">
                            <div className="p-5 rounded-2xl bg-white border border-border text-center">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-dark text-sm mb-1">Real-Time Updates</h4>
                                <p className="text-xs text-muted">Get live status updates on every step of the repair</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white border border-border text-center">
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-dark text-sm mb-1">Secure Tracking</h4>
                                <p className="text-xs text-muted">Your data is encrypted and protected at all times</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white border border-border text-center">
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-dark text-sm mb-1">SMS & Email Alerts</h4>
                                <p className="text-xs text-muted">Receive notifications at every milestone</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="text-muted text-sm">Searching for your repair...</p>
                    </div>
                )}

                {/* Repair Details */}
                {repair && (
                    <div className="space-y-6">
                        {/* Status Banner */}
                        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border ${st.border} ${st.bg}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${st.dot} ${repair.status === 'in-progress' ? 'animate-pulse' : ''}`}></div>
                                <div>
                                    <span className={`font-bold text-lg ${st.color}`}>{st.label}</span>
                                    <p className="text-sm text-muted mt-0.5">Tracking ID: <span className="font-mono font-semibold text-dark">{repair.id}</span></p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted">Estimated Delivery</p>
                                <p className="font-semibold text-dark">{repair.estimatedDelivery}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column: Device & Repair Info */}
                            <div className="lg:col-span-1 space-y-5">
                                {/* Device Info Card */}
                                <div className="bg-white rounded-2xl border border-border p-5">
                                    <h3 className="font-semibold text-dark text-base mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        Device Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Brand</span>
                                            <span className="font-medium text-dark">{repair.brand}</span>
                                        </div>
                                        <div className="w-full h-px bg-border"></div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Model</span>
                                            <span className="font-medium text-dark">{repair.model}</span>
                                        </div>
                                        <div className="w-full h-px bg-border"></div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Issue</span>
                                            <span className="font-medium text-dark">{repair.issue}</span>
                                        </div>
                                        <div className="w-full h-px bg-border"></div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Service</span>
                                            <span className="font-medium text-dark">{repair.serviceType}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cost & Date Card */}
                                <div className="bg-white rounded-2xl border border-border p-5">
                                    <h3 className="font-semibold text-dark text-base mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Billing Info
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Repair Cost</span>
                                            <span className="font-bold text-dark text-lg">{repair.estimatedCost}</span>
                                        </div>
                                        <div className="w-full h-px bg-border"></div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Booked On</span>
                                            <span className="font-medium text-dark">{repair.date}</span>
                                        </div>
                                        <div className="w-full h-px bg-border"></div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Technician</span>
                                            <span className="font-medium text-dark">{repair.technician}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Need Help */}
                                <div className="bg-primary/5 rounded-2xl border border-primary/10 p-5 text-center">
                                    <p className="text-sm font-medium text-dark mb-2">Need Help?</p>
                                    <p className="text-xs text-muted mb-4">Our support team is available 24/7</p>
                                    <a href="tel:+919876543210" className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Call +91 98765 43210
                                    </a>
                                </div>
                            </div>

                            {/* Right Column: Timeline */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
                                    <h3 className="font-semibold text-dark text-base mb-8 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Repair Timeline
                                    </h3>

                                    <div className="relative">
                                        {repair.timeline.map((item, idx) => {
                                            const isLast = idx === repair.timeline.length - 1;
                                            const isActive = item.done && (isLast || !repair.timeline[idx + 1]?.done);

                                            return (
                                                <div key={idx} className="flex gap-4 sm:gap-6 pb-8 last:pb-0 relative">
                                                    {/* Vertical Line */}
                                                    {!isLast && (
                                                        <div className={`absolute left-[19px] sm:left-[23px] top-10 bottom-0 w-0.5 ${item.done ? 'bg-primary' : 'bg-border'}`}></div>
                                                    )}

                                                    {/* Circle Icon */}
                                                    <div className={`relative shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all ${item.done
                                                            ? (isActive ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-110' : 'bg-primary border-primary text-white')
                                                            : 'bg-surface border-border text-muted'
                                                        }`}>
                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                                        </svg>
                                                        {isActive && (
                                                            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full animate-pulse"></span>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className={`flex-1 pt-1.5 ${!item.done ? 'opacity-50' : ''}`}>
                                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                                            <h4 className={`font-semibold text-sm sm:text-base ${item.done ? 'text-dark' : 'text-muted'}`}>
                                                                {item.step}
                                                            </h4>
                                                            {isActive && (
                                                                <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">Current</span>
                                                            )}
                                                        </div>
                                                        <p className={`text-xs sm:text-sm mt-1 ${item.done ? 'text-body' : 'text-muted'}`}>
                                                            {item.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Back to search */}
                        <div className="text-center pt-4">
                            <button
                                onClick={() => { setRepair(null); setTrackingId(""); }}
                                className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
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
