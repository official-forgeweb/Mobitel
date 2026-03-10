"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/admin/bookings', label: 'Bookings', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { href: '/admin/workers', label: 'Partners', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { href: '/admin/payments', label: 'Payments', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { href: '/admin/brands', label: 'Brands & Models', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { href: '/admin/services', label: 'Services', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { href: '/admin/pricing', label: 'Pricing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { href: '/admin/time-slots', label: 'Time Slots', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { href: '/admin/cms', label: 'CMS Editor', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { href: '/admin/reports', label: 'Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { href: '/admin/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];

const oldNavItems = [
    { href: '/admin/shops', label: 'Shops' },
    { href: '/admin/requests', label: 'Requests' },
    { href: '/admin/partners', label: 'Delivery Partners' },
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (pathname === '/admin/login') {
            setAuthorized(true);
            return;
        }

        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        fetch(`${API}/api/admin/verify`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAuthorized(true);
                } else {
                    localStorage.removeItem('adminToken');
                    router.push('/admin/login');
                }
            })
            .catch(() => {
                router.push('/admin/login');
            });
    }, [pathname, router]);

    if (!authorized) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>;
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans">
            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between bg-white px-5 py-4 shadow-md border-b sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">M</div>
                    <span className="text-xl font-black text-gray-900 tracking-tight">Admin<span className="text-primary">Panel</span></span>
                </div>
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                    className={`p-2 rounded-xl transition-all duration-300 ${mobileMenuOpen ? 'bg-primary/10 text-primary rotate-90' : 'bg-gray-100 text-gray-600'}`}
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {mobileMenuOpen
                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                        }
                    </svg>
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#3a0000] to-[#1a0000] text-white shadow-2xl flex flex-col 
                transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                md:translate-x-0 md:sticky md:top-0 md:h-screen
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
                
                {/* Sidebar Header */}
                <div className="p-8 text-2xl font-black tracking-tight border-b border-white/5 z-10 relative flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#F8D272] rounded-lg flex items-center justify-center text-[#3a0000] font-black text-lg">M</div>
                        <div>Mobi<span className="text-[#F8D272]">tel</span></div>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto z-10 relative custom-scrollbar">
                    <nav className="p-5 space-y-1.5">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-4 ml-4">Main Menu</p>
                        {navItems.map(item => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${isActive
                                        ? 'bg-[#F8D272] text-[#3a0000] shadow-[0_10px_20px_rgba(248,210,114,0.2)]'
                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <svg className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-[#3a0000]' : 'text-white/40 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? "2.5" : "1.5"}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                    {item.label}
                                </Link>
                            );
                        })}

                        <div className="pt-4 mt-4 border-t border-white/5">
                            <Link href="/" className="flex items-center gap-4 px-5 py-3 text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Client Website
                            </Link>
                        </div>
                    </nav>
                </div>

                {/* Sidebar Footer / Profile */}
                <div className="p-6 border-t border-white/5 z-10 relative bg-black/40 backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-11 h-11 rounded-full bg-white/10 p-0.5 border border-white/10">
                            <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#F8D272] to-[#fce4a4] flex items-center justify-center text-[#3a0000] font-black text-lg shadow-inner">
                                A
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Administrator</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">System Superuser</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-widest group">
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Secure Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden relative min-h-screen overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
