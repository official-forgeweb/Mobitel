"use client";

import Link from "next/link";

const services = [
    {
        id: "screen",
        title: "Screen Repair",
        short: "Cracked or unresponsive? Back to perfect.",
        desc: "We use premium OEM-grade displays to restore your device to factory condition — fast. Most screen repairs are done in under an hour, so you don't have to stay disconnected for long.",
        price: "599",
        iconBg: "bg-red-50 text-red-500",
        blob: "bg-red-500/5",
        icon: (
            <svg className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v14.25a2.25 2.25 0 002.25 2.25z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l2.25 2.25m0-4.5l-4.5 4.5M3 3l18 18" />
            </svg>
        )
    },
    {
        id: "battery",
        title: "Battery Replacement",
        short: "Dying too fast? Get full-day stamina back.",
        desc: "We install high-capacity, certified batteries to bring your phone's endurance back to day-one levels. Stop carrying a power bank constantly; restore your battery health in minutes.",
        price: "899",
        iconBg: "bg-green-50 text-green-500",
        blob: "bg-green-500/5",
        icon: (
            <svg className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5h6.75V15H4.5v-4.5zm10.5-4.5h2.25M15 15h2.25" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h15a3 3 0 013 3v6a3 3 0 01-3 3H3a3 3 0 01-3-3V9a3 3 0 013-3z" />
            </svg>
        )
    },
    {
        id: "water",
        title: "Water Damage Repair",
        short: "Dropped it in water? Act fast.",
        desc: "Advanced ultrasonic cleaning and component-level motherboard diagnostics. Don't turn it on — bring it to us immediately for the best chance of complete data and device recovery.",
        price: "1,299",
        iconBg: "bg-blue-50 text-blue-500",
        blob: "bg-blue-500/5",
        icon: (
            <svg className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                <path d="M12 21.75v-9m0 0l-3.375 3.375M12 12.75l3.375 3.375" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        id: "charging",
        title: "Charging Port Fix",
        short: "Can't plug in without a struggle?",
        desc: "We clean, resolder, or fully replace faulty charging ports so you can plug in effortlessly every single time. Supports USB-C, Lightning, and older Micro-USB interfaces.",
        price: "499",
        iconBg: "bg-yellow-50 text-yellow-600",
        blob: "bg-yellow-500/5",
        icon: (
            <svg className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        )
    },
    {
        id: "camera",
        title: "Camera Replacement",
        short: "Blurry shots or a broken lens?",
        desc: "We swap out front or rear camera modules to restore crisp, clear photos. Original components for Apple, Samsung, OnePlus, and other major smartphone brands.",
        price: "799",
        iconBg: "bg-purple-50 text-purple-500",
        blob: "bg-purple-500/5",
        icon: (
            <svg className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
        )
    },
    {
        id: "motherboard",
        title: "Motherboard Diagnostics",
        short: "Phone dead or boot-looping?",
        desc: "Our micro-soldering experts perform advanced logic board diagnosis and repair. We address complex issues like no power, random restarts, or localized overheating.",
        price: "1,999",
        iconBg: "bg-gray-100 text-gray-500",
        blob: "bg-gray-400/5",
        icon: (
            <svg className="w-16 h-16 sm:w-20 sm:h-20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
            </svg>
        )
    },
];

export default function ServicesPage() {
    return (
        <div className="flex flex-col bg-white min-h-screen relative overflow-hidden selection:bg-primary/20">

            {/* Subtle Abstract Background Grid */}
            <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.4 }} />

            {/* ─── Hero Section ─── */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 text-center z-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-semibold text-dark mb-6 tracking-tight leading-tight">
                        Expert <span className="text-primary">Mobile Repairs</span> You Can Trust.
                    </h1>
                    <p className="text-body text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10">
                        Fast turnaround, genuine parts, and an honest warranty. Premium care for the devices you rely on every day. Get back to what matters.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <a
                            href="#book"
                            className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full font-medium text-sm transition-colors w-full sm:w-auto shadow-md"
                        >
                            Book a Repair Online
                        </a>
                        <a
                            href="tel:+919876543210"
                            className="bg-white border border-border text-dark hover:bg-gray-50 px-8 py-3.5 rounded-full font-medium text-sm transition-colors w-full sm:w-auto shadow-sm"
                        >
                            Call Us Directly
                        </a>
                    </div>
                </div>
            </section>

            {/* ─── Alternating Services Layout ─── */}
            <section className="pb-32 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
                    {services.map((svc, index) => {
                        const isEven = index % 2 === 0;

                        return (
                            <div key={svc.id} className="relative group">
                                {/* Decorative Background Blob behind each section */}
                                <div className={`absolute top-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] ${svc.blob} blur-[100px] rounded-full pointer-events-none transition-opacity duration-700 opacity-40 group-hover:opacity-100 ${isEven ? '-left-20' : '-right-20'}`} />

                                <div className={`relative flex flex-col md:flex-row items-center gap-12 lg:gap-24 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>

                                    {/* Media / Icon Side */}
                                    <div className="w-full md:w-1/2 flex justify-center relative">
                                        {/* Subtle styling ring around icon */}
                                        <div className="absolute inset-0 border border-gray-100 rounded-full scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 ease-out" />

                                        <div className={`w-64 h-64 md:w-[22rem] md:h-[22rem] rounded-[2.5rem] flex items-center justify-center ${svc.iconBg} transition-all duration-500 group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] group-hover:-translate-y-2 relative overflow-hidden backdrop-blur-sm border border-black/5`}>
                                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, black 1px, transparent 0)", backgroundSize: "16px 16px" }} />
                                            <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-sm">
                                                {svc.icon}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Side */}
                                    <div className={`w-full md:w-1/2 text-center md:text-left space-y-6 lg:px-8 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                                                <h2 className="text-3xl lg:text-4xl font-semibold text-dark tracking-tight">
                                                    {svc.title}
                                                </h2>
                                                <span className="text-sm font-medium tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
                                                    {svc.short}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-lg text-body font-light leading-relaxed mx-auto md:mx-0">
                                            {svc.desc}
                                        </p>

                                        <div className="pt-6 border-t border-border mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                                            <div className="text-center md:text-left">
                                                <p className="text-[11px] text-muted uppercase tracking-widest mb-1.5 font-medium">
                                                    Starting at
                                                </p>
                                                <p className="text-3xl font-medium text-dark flex items-baseline gap-1 justify-center md:justify-start">
                                                    <span className="text-lg text-gray-400 font-normal">₹</span>{svc.price}
                                                </p>
                                            </div>

                                            <a
                                                href="#book"
                                                className="group/btn relative inline-flex items-center justify-center bg-white hover:bg-dark text-dark hover:text-white border border-border hover:border-dark px-8 py-4 rounded-full transition-all duration-300 font-medium text-sm w-full sm:w-auto shadow-sm hover:shadow-lg overflow-hidden"
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    Get {svc.title}
                                                    <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                                    </svg>
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ─── Track Repair Feature Section (AppDownload-inspired) ─── */}
            <section className="bg-surface py-20 md:py-32 relative z-10 border-y border-border overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
                        {/* Device Graphic Side */}
                        <div className="w-full md:w-1/2 relative flex justify-center">
                            {/* Crayon Doodle Arrow (Right) - AppDownload style */}
                            <div className="absolute -right-8 md:-right-20 top-[0%] w-32 md:w-48 h-32 md:h-48 pointer-events-none opacity-80 rotate-12 hidden sm:block">
                                <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-primary drop-shadow-sm">
                                    <defs>
                                        <filter id="crayonEffectRight" x="-20%" y="-20%" width="140%" height="140%">
                                            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
                                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
                                        </filter>
                                    </defs>
                                    <path d="M 170 150 Q 80 160 40 60" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" filter="url(#crayonEffectRight)" />
                                    <path d="M 80 55 L 30 50 L 45 100" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#crayonEffectRight)" />
                                </svg>
                                <div className="absolute -bottom-2 left-0 w-full text-center text-primary font-medium text-xs md:text-sm tracking-widest uppercase -rotate-6 filter brightness-90 saturate-150" style={{ fontFamily: "cursive" }}>
                                    Stay Updated!
                                </div>
                            </div>

                            <div className="relative w-full max-w-[320px] bg-dark rounded-[2.5rem] shadow-2xl overflow-hidden border-[10px] border-dark aspect-[9/19] flex justify-center shrink-[0]">
                                {/* Fake Screen Content */}
                                <div className="w-full h-full bg-white relative flex flex-col">
                                    <div className="h-14 bg-gradient-to-r from-primary to-orange-500 flex items-center justify-center text-white px-4 shrink-0 shadow-md z-10">
                                        <span className="font-semibold text-sm">RepairTracker</span>
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col gap-5 overflow-hidden">
                                        {/* Fake Tracking Steps */}
                                        <div className="space-y-6 relative">
                                            {/* Progress Line */}
                                            <div className="absolute left-3.5 top-2 bottom-6 w-0.5 bg-gray-200 z-0"></div>

                                            <div className="flex gap-4 relative z-10">
                                                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-dark text-sm">Device Received</p>
                                                    <p className="text-xs text-muted">10:30 AM</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 relative z-10 opacity-60">
                                                <div className="w-7 h-7 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center shrink-0">
                                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-dark text-sm">Diagnosing Issue</p>
                                                    <p className="text-xs text-muted">In Progress</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 relative z-10 opacity-30">
                                                <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white shrink-0"></div>
                                                <div>
                                                    <p className="font-medium text-dark text-sm">Repair Started</p>
                                                    <p className="text-xs text-muted">Pending</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 relative z-10 opacity-30">
                                                <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white shrink-0"></div>
                                                <div>
                                                    <p className="font-medium text-dark text-sm">Ready for Pickup</p>
                                                    <p className="text-xs text-muted">Pending</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-auto bg-primary/10 rounded-xl p-4 text-center border border-primary/20">
                                            <p className="text-primary font-semibold text-sm mb-1">Estimated Time</p>
                                            <p className="text-dark font-bold text-xl">45 Mins</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
                            <div className="inline-flex items-center gap-3 text-[10px] md:text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">
                                <span className="w-6 h-px bg-primary/40"></span>
                                Live Tracking
                                <span className="w-6 h-px bg-primary/40"></span>
                            </div>
                            <h2 className="text-3xl lg:text-5xl font-semibold text-dark tracking-tight leading-tight">
                                Know exactly what's happening.
                            </h2>
                            <p className="text-base text-body font-light leading-relaxed max-w-md mx-auto md:mx-0">
                                No more guessing when your phone will be ready. From diagnosis to final testing, track your repair status in real-time right from your desktop or phone.
                            </p>

                            <ul className="space-y-4 text-left max-w-sm mx-auto md:mx-0 pt-4">
                                {[
                                    "Instant SMS and email notifications.",
                                    "Live status updates for every step.",
                                    "Direct chat with your assigned technician."
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-dark text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-6">
                                <a
                                    href="/track"
                                    className="inline-flex items-center justify-center bg-dark text-white px-8 py-3.5 rounded-full hover:bg-black transition-colors duration-300 font-medium text-sm w-full sm:w-auto shadow-md"
                                >
                                    Track Your Repair
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Final Call to Action ─── */}
            <section className="bg-white py-24 px-4 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-semibold text-dark mb-6">
                        Ready to fix your device?
                    </h2>
                    <p className="text-body text-lg font-light mb-10 leading-relaxed">
                        Call us directly or book time with an expert online. We are available and ready to help you get back online.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <a
                            href="#book"
                            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium text-sm transition-colors w-full sm:w-auto shadow-md"
                        >
                            Book Appointment
                        </a>
                        <a
                            href="tel:+919876543210"
                            className="bg-white border border-border text-dark hover:bg-surface px-8 py-4 rounded-full font-medium text-sm transition-colors w-full sm:w-auto"
                        >
                            Call Us Now
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
