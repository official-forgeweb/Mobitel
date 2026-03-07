"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const navItems = [
    { href: '/worker', label: 'My Jobs', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { href: '/worker/history', label: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { href: '/worker/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

export default function PartnerLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [partnerName, setPartnerName] = useState('');

    useEffect(() => {
        if (pathname === '/worker/login') {
            setAuthorized(true);
            return;
        }

        const token = localStorage.getItem('workerToken');
        if (!token) {
            router.push('/worker/login');
            return;
        }

        // Decode JWT to get worker info (simple base64 decode)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.role !== 'worker') {
                localStorage.removeItem('workerToken');
                router.push('/worker/login');
                return;
            }
            // Check expiry
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                localStorage.removeItem('workerToken');
                router.push('/worker/login');
                return;
            }
            setPartnerName(payload.name || 'Partner');
            setAuthorized(true);
        } catch {
            localStorage.removeItem('workerToken');
            router.push('/worker/login');
        }
    }, [pathname, router]);

    if (!authorized) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>;
    }

    if (pathname === '/worker/login') {
        return <>{children}</>;
    }

    const handleLogout = () => {
        localStorage.removeItem('workerToken');
        router.push('/worker/login');
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between bg-gradient-to-r from-[#4a0000] to-[#2a0000] text-white px-5 py-4 shadow-md sticky top-0 z-50">
                <div className="text-xl font-black tracking-tight">Mobi<span className="text-[#F8D272]">tel</span> <span className="text-[10px] uppercase tracking-widest bg-white/20 px-2 py-1 rounded-full ml-1">Partner</span></div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-white/80">👋 {partnerName}</span>
                </div>
            </div>

            {/* Sidebar (Desktop & Tablet) */}
            <aside className="hidden md:flex w-72 bg-gradient-to-b from-[#4a0000] to-[#2a0000] text-white shadow-2xl flex-col sticky top-0 h-screen overflow-y-auto z-40 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                <div className="p-8 text-2xl font-black tracking-tight border-b border-white/10 z-10 relative flex items-center justify-between">
                    <div>Mobi<span className="text-[#F8D272]">tel</span></div>
                    <span className="text-[10px] uppercase tracking-widest bg-white/10 px-2 py-1 rounded-full font-bold">Partner</span>
                </div>
                
                <div className="px-6 py-4 border-b border-white/10 z-10 relative bg-black/10">
                    <p className="text-xs text-white/60 uppercase tracking-widest font-bold mb-1">Welcome Back,</p>
                    <p className="font-semibold text-lg text-[#F8D272] truncate">👋 {partnerName}</p>
                </div>

                <nav className="p-5 space-y-2 flex-1 z-10 relative mt-2">
                    {navItems.map(item => {
                        const isActive = pathname === item.href || (item.href !== '/worker' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${isActive
                                    ? 'bg-white/10 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md border border-white/20 translate-x-1'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white hover:translate-x-1 border border-transparent'
                                }`}
                            >
                                <svg className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-[#F8D272]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? "2" : "1.5"}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                                {item.label}
                            </Link>
                        );
                    })}

                    <div className="pt-6 mt-6 border-t border-white/10">
                        <Link href="/" className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-transparent">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Client Website
                        </Link>
                    </div>
                </nav>
                <div className="p-5 border-t border-white/10 mt-auto z-10 relative bg-black/20 backdrop-blur-sm">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-red-200 hover:bg-red-500/20 hover:text-white hover:border-red-500/30 border border-transparent transition-all font-bold text-sm">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Secure Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden relative min-h-screen overflow-y-auto pb-24 md:pb-8">
                {children}
            </main>

            {/* Bottom Navigation (Mobile) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a0000]/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 z-50 flex justify-around safe-area-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
                {navItems.map(item => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}
                            className={`flex flex-col items-center py-2 px-6 rounded-2xl transition-all duration-300 ${isActive ? 'text-primary' : 'text-white/40 hover:text-white/60'}`}>
                            <div className={`relative ${isActive ? 'scale-110' : ''}`}>
                                <svg className={`w-6 h-6 mb-1 transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_8px_rgba(248,210,114,0.6)]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                                {isActive && <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#F8D272] rounded-full shadow-[0_0_10px_#F8D272]"></span>}
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-[#F8D272]' : 'text-inherit'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
                <button onClick={handleLogout} className="flex flex-col items-center py-2 px-6 text-white/40 hover:text-red-400 transition-all duration-300">
                    <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-[9px] font-bold uppercase tracking-widest">Logout</span>
                </button>
            </nav>
        </div>
    );
}
