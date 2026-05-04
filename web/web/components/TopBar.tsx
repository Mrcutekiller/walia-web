'use client';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Bell, Menu, Sparkles, ChevronDown, Sun, Moon, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TopBarProps {
    onOpenSidebar: () => void;
    isSidebarOpen?: boolean;
    isMinimized?: boolean;
}

export default function TopBar({ onOpenSidebar, isSidebarOpen, isMinimized }: TopBarProps) {
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (
        <header className="h-16 border-b border-gray-100 dark:border-white/[0.05] bg-white/90 dark:bg-[#07070F]/90 backdrop-blur-xl sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between gap-4 shrink-0">

            {/* Left */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Hamburger — always visible to toggle sidebar */}
                <button
                    id="sidebar-toggle-btn"
                    onClick={onOpenSidebar}
                    className="flex-shrink-0 p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-500 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-95"
                    aria-label="Toggle sidebar"
                >
                    {isSidebarOpen
                        ? <X className="w-4 h-4" />
                        : <Menu className="w-4 h-4" />
                    }
                </button>

                {/* Brand logo — visible only on mobile (desktop has sidebar) */}
                <Link href="/" className="flex lg:hidden items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-black dark:bg-white flex items-center justify-center flex-shrink-0">
                        <Image src="/logo.png" alt="Walia" width={16} height={16} className="object-contain invert dark:invert-0" unoptimized />
                    </div>
                    <span className="text-sm font-black text-black dark:text-white tracking-tight">Walia AI</span>
                </Link>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">

                {/* Upgrade pill — hidden on very small screens */}
                {!user?.isPro && (
                    <Link
                        href="/dashboard/upgrade"
                        className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.15em] hover:opacity-80 transition-all shadow-md shadow-black/10"
                    >
                        <Sparkles className="w-3 h-3" />
                        <span>Pro</span>
                    </Link>
                )}

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                    title={isDark ? 'Light mode' : 'Dark mode'}
                >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Bell */}
                <button className="relative p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
                </button>

                {/* Profile */}
                <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-white/10 transition-all group"
                >
                    <div className="w-8 h-8 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-xs shadow-sm overflow-hidden">
                        {user?.photoURL ? (
                            <Image src={user.photoURL} alt={user.name || 'User'} width={32} height={32} className="object-cover w-full h-full" />
                        ) : (
                            <span>{(user?.username?.slice(0, 2) || user?.name?.charAt(0) || 'U').toUpperCase()}</span>
                        )}
                    </div>
                    <div className="hidden lg:block text-left">
                        <p className="text-[11px] font-black text-black dark:text-white tracking-tight leading-tight">
                            {user?.username || user?.name || 'User'}
                        </p>
                        <p className="text-[9px] text-gray-400 dark:text-white/30 font-bold uppercase tracking-widest">
                            {user?.isPro ? '✦ Pro' : `Lv. ${user?.level || 1}`}
                        </p>
                    </div>
                </Link>
            </div>
        </header>
    );
}
