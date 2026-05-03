'use client';

import { useAuth } from '@/context/AuthContext';
import { Search, Bell, Menu, Sparkles, User, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function TopBar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
    const { user } = useAuth();

    return (
        <header className="h-20 border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-[#0A0A18]/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
            {/* Left: Search & Mobile Menu */}
            <div className="flex items-center gap-6 flex-1">
                <button 
                    onClick={onOpenSidebar}
                    className="lg:hidden p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-500 hover:text-black dark:hover:text-white transition-all"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="hidden md:flex items-center relative w-full max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                    <input 
                        type="text" placeholder="Search for tools, chats, or community posts..."
                        className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-xs font-medium text-black dark:text-white"
                    />
                </div>
            </div>

            {/* Right: Notifications & Profile */}
            <div className="flex items-center gap-4">
                {/* Upgrade Button */}
                {!user?.isPro && (
                    <Link href="/dashboard/upgrade" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-black/10">
                        <Sparkles className="w-3.5 h-3.5" /> Upgrade
                    </Link>
                )}

                <button className="relative p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 hover:text-black dark:hover:text-white transition-all">
                    <Bell className="w-5 h-5" />
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-[#0A0A18]" />
                </button>

                <Link href="/dashboard/profile" className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                    <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-xs uppercase shadow-sm">
                        {user?.username?.slice(0, 2) || 'U'}
                    </div>
                    <div className="hidden lg:block text-left">
                        <p className="text-[10px] font-black text-black dark:text-white uppercase tracking-tight">{user?.username || 'User'}</p>
                        <div className="flex items-center gap-1">
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Level {user?.level || 1}</span>
                            <ChevronDown className="w-2.5 h-2.5 text-gray-300" />
                        </div>
                    </div>
                </Link>
            </div>
        </header>
    );
}
