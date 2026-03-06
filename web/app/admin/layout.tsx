'use client';

import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, LogOut, Menu, Sparkles, User } from 'lucide-react';
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
            {/* Admin Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:pl-[280px] relative min-h-screen">

                {/* Global Header */}
                <header className={cn(
                    "h-20 sticky top-0 z-30 px-6 md:px-10 flex items-center justify-between transition-all duration-300",
                    scrolled ? "bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
                )}>
                    {/* Mobile Menu Toggle & Title */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl bg-white/5 text-white/50 hover:text-white transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden sm:block">
                            <h2 className="text-lg font-bold tracking-tight text-white/90 capitalize">
                                {pathname.split('/').pop() === 'admin' ? 'Overview' : pathname.split('/').pop()}
                            </h2>
                            <p className="text-[10px] text-white/30 font-medium uppercase tracking-widest mt-0.5">Control Center</p>
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-3 md:space-x-4">
                        {/* Notifications */}
                        <button className="relative p-2.5 rounded-2xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95 group">
                            <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
                            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-walia-success border-2 border-[#0A0A0B] shadow-[0_0_10px_rgba(46,213,115,0.5)]" />
                        </button>

                        <div className="h-8 w-px bg-white/5 mx-1" />

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-3 p-1.5 pr-3 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all group"
                            >
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-walia-success to-emerald-400 p-[1px]">
                                    <div className="w-full h-full rounded-[11px] bg-[#0A0A0B] flex items-center justify-center font-black text-xs text-walia-success">
                                        {user?.displayName?.charAt(0) || 'A'}
                                    </div>
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-xs font-bold text-white group-hover:text-walia-success transition-all truncate max-w-[100px]">{user?.displayName || 'Admin'}</p>
                                    <p className="text-[10px] text-white/30 font-medium truncate">Administrator</p>
                                </div>
                                <ChevronDown className={cn("w-3.5 h-3.5 text-white/20 transition-transform", showUserMenu && "rotate-180")} />
                            </button>

                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-56 rounded-2xl bg-[#141415] border border-white/10 shadow-2xl p-2 z-50 overflow-hidden"
                                    >
                                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                                            <p className="text-xs font-bold text-white truncate">{user?.email}</p>
                                        </div>
                                        <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
                                            <User className="w-4 h-4" />
                                            <span>Staff Profile</span>
                                        </button>
                                        <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-colors text-sm font-medium">
                                            <LogOut className="w-4 h-4" />
                                            <span>Terminate Session</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 px-6 md:px-10 pb-10">
                    {children}
                </main>

                {/* Subtle Background Elements */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-walia-success/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
                <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
            </div>
        </div>
    );
}
