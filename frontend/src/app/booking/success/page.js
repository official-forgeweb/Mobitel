"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || 'https://www.mobitel.in';

function BookingSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [token, setToken] = useState("");
    const [bookingData, setBookingData] = useState(null);
    const [loadingBooking, setLoadingBooking] = useState(false);

    useEffect(() => {
        const t = searchParams.get("token");
        if (t) {
            setToken(t);
            // Fetch booking details to get shop info
            fetchBookingDetails(t);
        } else {
            router.push("/");
        }
    }, [searchParams, router]);

    const fetchBookingDetails = async (trackingToken) => {
        setLoadingBooking(true);
        try {
            const res = await fetch(`${API}/api/bookings/track/${trackingToken}`);
            if (res.ok) {
                const data = await res.json();
                setBookingData(data);
            }
        } catch (err) {
            console.error("Failed to fetch booking details:", err);
        } finally {
            setLoadingBooking(false);
        }
    };

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

                <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
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

                {/* Shop Address Card (for Shop Visit bookings) */}
                {bookingData?.shopDetails && (
                    <div className="bg-orange-50 rounded-2xl p-5 mb-6 border border-orange-100 text-left">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-500 shrink-0">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <span className="text-sm font-bold text-dark">Visit Our Shop</span>
                        </div>
                        <p className="font-bold text-dark text-sm">{bookingData.shopDetails.name}</p>
                        <p className="text-muted text-xs mt-1 leading-relaxed">{bookingData.shopDetails.address}</p>
                        {bookingData.shopDetails.contact && (
                            <a href={`tel:${bookingData.shopDetails.contact}`} className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {bookingData.shopDetails.contact}
                            </a>
                        )}
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bookingData.shopDetails.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full mt-3 bg-white hover:bg-orange-100 text-dark font-bold py-2.5 px-4 rounded-xl transition-colors text-xs border border-orange-200"
                        >
                            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Get Directions on Google Maps
                        </a>
                    </div>
                )}

                {loadingBooking && !bookingData && (
                    <div className="mb-6 flex items-center justify-center gap-2 text-muted text-xs">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        Loading booking details...
                    </div>
                )}

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
