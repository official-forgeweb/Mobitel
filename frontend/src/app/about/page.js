"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const staticStats = [
    { label: "Devices Repaired", value: "25,000+" },
    { label: "Years Experience", value: "10+" },
    { label: "Happy Customers", value: "98%" },
    { label: "Same-Day Repairs", value: "85%" },
];

export default function AboutPage() {
    const [cmsData, setCmsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cms/about`)
            .then(res => res.json())
            .then(data => {
                setCmsData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch about cms", err);
                setLoading(false);
            });
    }, []);

    const hero = cmsData?.hero || {};
    const story = cmsData?.story || {};
    const promises = cmsData?.promises || {};
    const stats = cmsData?.stats?.length > 0 ? cmsData.stats : staticStats;

    if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <div className="flex flex-col bg-white min-h-screen relative overflow-hidden selection:bg-primary/20">

            {/* Subtle Abstract Background Grid */}
            <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.4 }} />

            {/* ─── Hero Section ─── */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 text-center z-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-semibold text-dark mb-6 tracking-tight leading-tight">
                        {hero.title ? hero.title : <><span className="text-primary">Devices Back to Life</span>.</>}
                    </h1>
                    <p className="text-body text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10">
                        {hero.subtitle || "Since 2014, Mobitel has been the trusted name in mobile device repair. We believe in transparent pricing, genuine parts, and treating every device like our own."}
                    </p>
                </div>
            </section>

            {/* ─── The Mobitel Story / Image Grid ─── */}
            <section className="py-16 md:py-24 relative z-10 border-y border-border bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">

                        {/* Text Content */}
                        <div className="w-full lg:w-1/2 space-y-6">
                            <div className="inline-flex items-center gap-3 text-[10px] md:text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">
                                <span className="w-6 h-px bg-primary/40"></span>
                                {story.title || "Our Story"}
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-semibold text-dark tracking-tight leading-tight">
                                {story.p1 ? "Quality Repairs, No Compromises." : "Quality Repairs, No Compromises."}
                            </h2>
                            <div className="space-y-4 text-body font-light leading-relaxed text-lg">
                                <p>{story.p1 || "What started as a small workbench in a garage has grown into a state-of-the-art repair facility. We founded Mobitel because we were tired of seeing overpriced, low-quality repairs flooding the market."}</p>
                                <p>{story.p2 || "Our technicians are certified micro-soldering experts. Whether it's a simple screen swap or a complex motherboard data recovery, we approach every repair with military precision and a commitment to perfection. We don't just fix phones; we revive your connection to the world."}</p>
                            </div>

                            <div className="pt-6 flex flex-wrap gap-4">
                                <Link
                                    href="/services"
                                    className="inline-flex items-center justify-center bg-dark text-white px-8 py-3.5 rounded-full hover:bg-black transition-colors duration-300 font-medium text-sm shadow-md"
                                >
                                    Explore Our Services
                                </Link>
                            </div>
                        </div>

                        {/* Image Grid */}
                        <div className="w-full lg:w-1/2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4 pt-12">
                                    <div className="bg-gray-200 aspect-square rounded-[2rem] overflow-hidden relative shadow-sm group">
                                        <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop" alt="State of the art repair facility" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-dark/20 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white font-bold text-xs uppercase tracking-widest">Our Facility</span>
                                        </div>
                                    </div>
                                    <div className="bg-primary/10 aspect-[4/3] rounded-[2rem] overflow-hidden relative shadow-sm flex items-center justify-center border border-primary/20 group">
                                        <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=600&auto=format&fit=crop" alt="Precision Equipment" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-40"></div>
                                        <span className="absolute z-10 text-white font-bold text-xs uppercase tracking-widest drop-shadow-md">Precision Tools</span>
                                    </div>
                                </div>
                                <div className="space-y-4 pb-12">
                                    <div className="bg-gray-100 aspect-[4/3] rounded-[2rem] overflow-hidden relative shadow-sm flex items-center justify-center border border-gray-200 group">
                                        <img src="/why-choose.png" alt="Certified Micro-Soldering" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent"></div>
                                        <span className="absolute bottom-4 left-6 text-white font-bold text-xs uppercase tracking-widest">Certified Experts</span>
                                    </div>
                                    <div className="bg-gray-200 aspect-square rounded-[2rem] overflow-hidden relative shadow-sm group">
                                        <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=600&auto=format&fit=crop" alt="Customer Service" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-dark/20 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white font-bold text-xs uppercase tracking-widest">Happy Customers</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ─── The Mobitel Promise (Core Values) ─── */}
            <section className="py-24 relative z-10 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-semibold text-dark mb-4 tracking-tight">{promises.title || "The Mobitel Promise"}</h2>
                        <p className="text-body text-lg font-light">{promises.subtitle || "Why thousands of customers trust us with their most essential daily devices."}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Value 1 */}
                        <div className="p-8 rounded-[2.5rem] border border-border bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
                            </div>
                            <h3 className="text-xl font-semibold text-dark mb-3">Genuine OEM Parts</h3>
                            <p className="text-body font-light leading-relaxed">We refuse to use cheap, aftermarket components. We source original parts directly from manufacturers to ensure perfect performance.</p>
                        </div>

                        {/* Value 2 */}
                        <div className="p-8 rounded-[2.5rem] border border-border bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-semibold text-dark mb-3">Transparent Pricing</h3>
                            <p className="text-body font-light leading-relaxed">No hidden fees or surprise diagnostic charges. We provide an exact quote before any work begins, so you know exactly what you're paying.</p>
                        </div>

                        {/* Value 3 */}
                        <div className="p-8 rounded-[2.5rem] border border-border bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                            </div>
                            <h3 className="text-xl font-semibold text-dark mb-3">6-Month Warranty</h3>
                            <p className="text-body font-light leading-relaxed">We stand behind our work. Every repair is backed by an ironclad 6-month warranty covering any defects in the parts we install.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Global Stats Section ─── */}
            <section className="bg-dark text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <p className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">
                                    {stat.value}
                                </p>
                                <p className="text-gray-400 font-medium text-sm md:text-base tracking-wide uppercase">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Final Call to Action ─── */}
            <section className="bg-white py-24 px-4 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-semibold text-dark mb-6">
                        Ready to experience the Mobitel difference?
                    </h2>
                    <p className="text-body text-lg font-light mb-10 leading-relaxed">
                        Stop dealing with cracked screens and dead batteries. Let our experts restore your device today.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link
                            href="/services"
                            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium text-sm transition-colors w-full sm:w-auto shadow-md"
                        >
                            View Repair Services
                        </Link>
                        <a
                            href="tel:+919876543210"
                            className="bg-white border border-border text-dark hover:bg-surface px-8 py-4 rounded-full font-medium text-sm transition-colors w-full sm:w-auto"
                        >
                            Call For A Quote
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
