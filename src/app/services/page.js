"use client";

import { useState } from "react";

const allServices = [
    {
        id: "screen",
        title: "Screen Repair",
        desc: "Got a shattered or unresponsive screen? We use premium OEM-grade displays to restore your device to factory condition in less than an hour.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v14.25a2.25 2.25 0 002.25 2.25z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l2.25 2.25m0-4.5l-4.5 4.5M3 3l18 18" />
            </svg>
        )
    },
    {
        id: "battery",
        title: "Battery Replacement",
        desc: "Phone dying too quickly or shutting down randomly? Let us install a high-capacity, certified fresh battery to bring your phone's stamina back.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5h6.75V15H4.5v-4.5zm10.5-4.5h2.25M15 15h2.25" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h15a3 3 0 013 3v6a3 3 0 01-3 3H3a3 3 0 01-3-3V9a3 3 0 013-3z" />
            </svg>
        )
    },
    {
        id: "water",
        title: "Water Damage Repair",
        desc: "Dropped your phone in water? Don't turn it on! Bring it to us immediately for advanced ultrasonic cleaning and component-level motherboard diagnostics.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75v-9m0 0l-3.375 3.375M12 12.75l3.375 3.375" />
            </svg>
        )
    },
    {
        id: "charging",
        title: "Charging Port Fix",
        desc: "Have to hold your cable at a weird angle just to charge? We can clean, resolder, or outright replace busted charging ports so you can plug in stress-free.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        )
    },
    {
        id: "camera",
        title: "Camera Replacement",
        desc: "Blurry photos, broken lenses, or a camera app that won't launch? We can swap out the front or rear camera modules to get you snapping crisp pics again.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
        )
    },
    {
        id: "motherboard",
        title: "Motherboard Diagnostics",
        desc: "Is your phone completely dead? Boot-looping? Don't lose hope. Our micro-soldering experts specialize in complex motherboard logic repairs.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
            </svg>
        )
    }
];

export default function ServicesPage() {
    const [selectedService, setSelectedService] = useState(null);

    // Function to open the Quick Fix modal by clicking the hidden trigger button inside QuickActions,
    // or via a prop if QuickActions accepts one. Currently QuickActions uses its own state.
    // Instead, since QuickActions works globally via the sticky right panel / bottom panel,
    // we can simply use standard anchor links inside the page or rely on the user tapping the modal.
    // For the best UX, we'll render a specific "Book Now" CTA that opens the Modal visually by grabbing its internal mobileMenuOpen state,
    // but since that's deeply nested, the cleanest Next.js way is to just let the right panel handle it and use standard scroll links to `#book`.

    return (
        <div className="flex flex-col relative h-full bg-[#f8f9fa] selection:bg-primary/20">

            <main className="flex-1 pb-24">
                {/* Modern Immersive Header */}
                <div className="relative py-20 md:py-32 overflow-hidden bg-dark text-white isolate">
                    {/* Background Abstract Shapes */}
                    <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <span className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-xs md:text-sm mb-6 bg-primary/10 px-4 py-2 rounded-full ring-1 ring-primary/30">
                            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                            Expert Solutions
                        </span>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8">
                            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Repair</span> Services
                        </h1>
                        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                            We bring dead devices back to life. Experience lightning-fast, guaranteed repairs for all major smartphone and tablet brands.
                        </p>
                    </div>
                </div>

                {/* Ultra-Premium Bento Grid Section */}
                <section className="py-16 md:py-24 -mt-10 relative z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">

                            {/* Service 1: Screen Repair (Large Feature, spans 2 cols, 2 rows) */}
                            <div className="md:col-span-2 lg:col-span-2 row-span-2 relative group overflow-hidden rounded-[2rem] bg-white ring-1 ring-border/50 shadow-2xl shadow-dark/5 p-8 flex flex-col justify-end transition-transform duration-500 hover:-translate-y-2">
                                <div className="absolute top-0 right-0 p-8 text-primary/10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12 group-hover:text-primary/20">
                                    <svg className="w-48 h-48" fill="none" stroke="currentColor" strokeWidth={0.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v14.25a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </div>
                                <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex items-center justify-center text-white mb-auto shadow-lg shadow-primary/30">
                                    {allServices[0].icon}
                                </div>
                                <div className="relative z-10 mt-8">
                                    <h3 className="text-3xl font-black text-dark mb-4">{allServices[0].title}</h3>
                                    <p className="text-body text-lg leading-relaxed max-w-sm mb-8">{allServices[0].desc}</p>
                                    <a href="#book" className="inline-flex items-center gap-2 bg-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-primary transition-colors duration-300">
                                        Book Repair
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                    </a>
                                </div>
                            </div>

                            {/* Service 2: Battery (Tall, spans 2 rows) */}
                            <div className="md:col-span-1 lg:col-span-1 row-span-2 group overflow-hidden rounded-[2rem] bg-gradient-to-b from-dark to-[#1a1a1a] shadow-xl p-8 flex flex-col relative transition-transform duration-500 hover:-translate-y-2 ring-1 ring-white/10">
                                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-8 border border-white/20">
                                    {allServices[1].icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{allServices[1].title}</h3>
                                <p className="text-white/60 text-[15px] leading-relaxed mb-auto">{allServices[1].desc}</p>
                                <div className="mt-8 flex justify-between items-center border-t border-white/10 pt-6">
                                    <span className="text-primary font-bold text-sm">₹899</span>
                                    <a href="#book" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white transition-colors duration-300">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                    </a>
                                </div>
                            </div>

                            {/* Service 3: Water Damage (Wide, spans 2 cols on lg) */}
                            <div className="md:col-span-3 lg:col-span-1 row-span-1 group overflow-hidden rounded-[2rem] bg-white ring-1 ring-border/50 shadow-lg p-6 flex flex-col justify-between transition-colors duration-300 hover:bg-blue-50/50">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        {allServices[2].icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-dark">{allServices[2].title}</h3>
                                </div>
                                <p className="text-body text-sm leading-relaxed mb-4 line-clamp-2">{allServices[2].desc}</p>
                                <a href="#book" className="text-blue-600 font-bold text-sm hover:underline mt-auto flex items-center gap-1">Get Help Now &rarr;</a>
                            </div>

                            {/* Service 4: Charging Port (Standard square) */}
                            <div className="md:col-span-1 lg:col-span-1 row-span-1 group overflow-hidden rounded-[2rem] bg-white ring-1 ring-border/50 shadow-lg p-6 flex flex-col justify-between transition-colors duration-300 hover:border-primary/50">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                                        {allServices[3].icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-dark">{allServices[3].title}</h3>
                                </div>
                                <p className="text-body text-sm leading-relaxed mb-4 line-clamp-2">{allServices[3].desc}</p>
                                <a href="#book" className="text-green-600 font-bold text-sm hover:underline mt-auto flex items-center gap-1">Fix Port &rarr;</a>
                            </div>

                            {/* Service 5: Camera (Standard square) */}
                            <div className="md:col-span-1 lg:col-span-1 row-span-1 group overflow-hidden rounded-[2rem] bg-white ring-1 ring-border/50 shadow-lg p-6 flex flex-col justify-between transition-colors duration-300 hover:border-purple-500/50">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                                        {allServices[4].icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-dark">{allServices[4].title}</h3>
                                </div>
                                <p className="text-body text-sm leading-relaxed mb-4 line-clamp-2">{allServices[4].desc}</p>
                                <a href="#book" className="text-purple-600 font-bold text-sm hover:underline mt-auto flex items-center gap-1">Replace Lens &rarr;</a>
                            </div>

                            {/* Service 6: Motherboard (Wide, spans 2 cols) */}
                            <div className="md:col-span-2 lg:col-span-2 row-span-1 group overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-100 to-white ring-1 ring-border shadow-lg p-8 flex items-center gap-8 relative">
                                <div className="flex-1 z-10">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-12 h-12 bg-dark text-white rounded-xl flex items-center justify-center shadow-md">
                                            {allServices[5].icon}
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-dark">{allServices[5].title}</h3>
                                    </div>
                                    <p className="text-body text-sm md:text-base leading-relaxed mb-6">{allServices[5].desc}</p>
                                    <a href="#book" className="inline-flex items-center gap-2 text-dark font-bold hover:text-primary transition-colors">
                                        Advanced Diagnostics <span aria-hidden="true">&rarr;</span>
                                    </a>
                                </div>
                                {/* Decorative background pattern */}
                                <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                                    <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 18.5l-10-5V10l10 5 10-5v5.5l-10 5z" /></svg>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Stylish Value Proposition Strip */}
                <section className="py-12 border-t border-border bg-white mx-4 sm:mx-6 lg:mx-8 rounded-[2rem] shadow-sm mb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-around items-center gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-border">

                            <div className="flex items-center gap-5 pt-4 md:pt-0 pl-0 md:pl-4 first:pt-0 first:pl-0 w-full md:w-auto justify-center">
                                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <h4 className="font-extrabold text-dark text-lg mb-1">6 Months Warranty</h4>
                                    <p className="text-sm text-body font-medium">Guaranteed peace of mind.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5 pt-8 md:pt-0 pl-0 md:pl-12 w-full md:w-auto justify-center">
                                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <h4 className="font-extrabold text-dark text-lg mb-1">Same Day Repair</h4>
                                    <p className="text-sm text-body font-medium">Fast & reliable service.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5 pt-8 md:pt-0 pl-0 md:pl-12 w-full md:w-auto justify-center">
                                <div className="h-14 w-14 bg-dark rounded-2xl flex items-center justify-center text-white shrink-0">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <h4 className="font-extrabold text-dark text-lg mb-1">OEM Grade Parts</h4>
                                    <p className="text-sm text-body font-medium">Uncompromised quality.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
