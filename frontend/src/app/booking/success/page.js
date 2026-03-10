"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function BookingSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [token, setToken] = useState("");

    useEffect(() => {
        const t = searchParams.get("token");
        if (t) {
            setToken(t);
        } else {
            router.push("/");
        }
    }, [searchParams, router]);

    if (!token) return null;

    return (
        <div className="bg-surface min-h-[90vh] flex flex-col justify-center items-center font-sans selection:bg-primary/20 py-20 px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10 text-center relative overflow-hidden border border-border">
                {/* Visual Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[40px] -z-10 mix-blend-multiply"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -z-10 mix-blend-multiply"></div>

                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 shadow-inner">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="text-3xl font-extrabold text-dark tracking-tight mb-2">Booking Confirmed!</h2>
                <p className="text-muted text-sm mb-8 font-medium">
                    Your repair request has been successfully placed. We've sent a confirmation to your email and phone.
                </p>

                <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Tracking Token</span>
                    <div className="text-2xl font-black text-dark tracking-wider pb-1 flex items-center justify-center gap-2">
                        {token}
                        <button 
                            onClick={() => { navigator.clipboard.writeText(token); alert("Token copied!"); }}
                            className="p-1.5 hover:bg-white rounded-full transition-colors text-primary"
                            title="Copy Token"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Link
                        href={`/track-repair?id=${token}`}
                        className="w-full bg-primary text-white font-bold rounded-xl py-3.5 hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2"
                    >
                        Track Repair Status
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                    <Link
                        href="/"
                        className="w-full bg-white text-dark font-bold rounded-xl py-3.5 border border-border hover:bg-gray-50 transition-all flex items-center justify-center"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function BookingSuccessPage() {
    return (
         <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-primary font-bold">Loading...</div>}>
             <BookingSuccessContent />
         </Suspense>
    );
}
