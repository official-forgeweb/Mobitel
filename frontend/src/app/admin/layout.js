"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

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

        // Verify token against backend
        fetch("http://localhost:5000/api/admin/verify", {
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
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
            <aside className="w-full md:w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
                <div className="p-6 text-2xl font-bold border-b dark:border-gray-700 text-gray-800 dark:text-white flex items-center justify-between">
                    Mobitel Admin
                    <div className="md:hidden">
                        {/* Mobile menu toggle button placeholder */}
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                <nav className="p-4 space-y-2 hidden md:block flex-1">
                    <Link href="/admin" className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">Dashboard</Link>
                    <Link href="/admin/cms" className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">CMS Editor</Link>
                    <Link href="/admin/shops" className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">Shops</Link>
                    <Link href="/admin/requests" className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">Requests</Link>
                    <Link href="/admin/partners" className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">Delivery Partners</Link>
                    <div className="pt-8 pl-4 mb-4">
                        <Link href="/" className="text-sm text-gray-500 hover:text-blue-500 hover:underline dark:text-gray-400 dark:hover:text-blue-400 transition-colors">← Back to Main Site</Link>
                    </div>
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 hidden md:block mt-auto">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden relative h-screen overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
