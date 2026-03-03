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

export default function WorkerLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [workerName, setWorkerName] = useState('');

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
            setWorkerName(payload.name || 'Worker');
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans flex flex-col">
            {/* Top Header (Desktop) */}
            <header className="hidden md:flex bg-white dark:bg-gray-800 shadow-sm px-6 py-3 items-center justify-between sticky top-0 z-40 border-b dark:border-gray-700">
                <div className="flex items-center gap-6">
                    <span className="text-lg font-bold text-primary">Mobitel Worker</span>
                    <nav className="flex gap-1">
                        {navItems.map(item => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300">👋 {workerName}</span>
                    <button onClick={handleLogout} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">Logout</button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 max-w-4xl mx-auto w-full">
                {children}
            </main>

            {/* Bottom Navigation (Mobile) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 px-2 py-1 z-50 flex justify-around safe-area-bottom">
                {navItems.map(item => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}
                            className={`flex flex-col items-center py-2 px-4 text-xs font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                            </svg>
                            {item.label}
                        </Link>
                    );
                })}
                <button onClick={handleLogout} className="flex flex-col items-center py-2 px-4 text-xs font-medium text-gray-400">
                    <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </nav>
        </div>
    );
}
