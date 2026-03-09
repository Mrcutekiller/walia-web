'use client';

import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Bell, Menu, Search, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, loading } = useAuth();
    const router = useRouter();

    // Redirect if not authenticated — only after loading is truly complete
    React.useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect via useEffect above
    }


    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Workspace */}
            <div className="flex-1 flex flex-col lg:pl-72 relative min-h-screen">

                {/* Header */}
                <header className="h-20 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
                    <div className="flex items-center lg:hidden mr-4">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 text-white/50 hover:text-white transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center flex-1 max-w-xl">
                        <div className="relative w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-walia-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search AI, Tools, Community..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-sm focus:border-walia-primary/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4 ml-auto">
                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all relative">
                            <Bell className="w-5 h-5" />
                            <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-black" />
                        </button>

                        <div className="h-10 w-px bg-white/10 mx-2" />

                        <div className="flex items-center space-x-3 group cursor-pointer p-1.5 pr-4 rounded-xl hover:bg-white/5 transition-all">
                            <div className="w-8 h-8 rounded-lg bg-walia-primary flex items-center justify-center font-black text-xs">
                                {user?.displayName?.charAt(0) || 'U'}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-xs font-bold text-white group-hover:text-walia-primary transition-colors">{user?.displayName || 'User'}</p>
                                <p className="text-[10px] text-white/30">Admin Workspace</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-6 md:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
