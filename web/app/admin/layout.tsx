'use client';

import { useAuth } from '@/context/AuthContext';
import { Sparkles } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // Strict Admin check - Only admin@walia.com can access
    const isAdmin = user?.email === 'admin@walia.com';

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        } else if (!loading && user && !isAdmin) {
            // Redirect non-admins to main dashboard
            router.replace('/dashboard');
        }
    }, [user, loading, router, isAdmin]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-walia-success/20 border-t-walia-success rounded-full animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-walia-success animate-pulse" />
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-walia-success selection:text-black">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative min-h-screen">
                {/* Page Content */}
                <main className="flex-1 p-6 md:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
