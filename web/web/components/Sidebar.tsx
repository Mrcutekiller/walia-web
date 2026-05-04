'use client';

import { cn } from '@/lib/utils';
import {
    BookOpen,
    Calendar as CalendarIcon,
    MessageSquare,
    Settings,
    Sparkles,
    User,
    Users,
    Wrench,
    X,
    ShieldCheck,
    LayoutList,
    Crown,
    LogOut,
    ChevronRight,
    Search,
    Sun,
    Moon,
    TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { useTokens } from '@/context/TokenContext';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const sidebarLinks = [
    { name: 'AI Hub', href: '/dashboard/ai', icon: Sparkles, color: 'indigo' },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, color: 'blue' },
    { name: 'Notes', href: '/dashboard/notes', icon: BookOpen, color: 'emerald' },
    { name: 'Daily Plan', href: '/dashboard/plan', icon: LayoutList, color: 'rose' },
    { name: 'Tools', href: '/dashboard/tools', icon: Wrench, color: 'amber' },
    { name: 'Community', href: '/dashboard/community', icon: Users, color: 'cyan' },
    { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarIcon, color: 'purple' },
    { name: 'Profile', href: '/dashboard/profile', icon: User, color: 'slate' },
];

const colorMap: Record<string, string> = {
    indigo: 'group-hover:text-indigo-500',
    blue: 'group-hover:text-blue-500',
    emerald: 'group-hover:text-emerald-500',
    rose: 'group-hover:text-rose-500',
    amber: 'group-hover:text-amber-500',
    cyan: 'group-hover:text-cyan-500',
    purple: 'group-hover:text-purple-500',
    slate: 'group-hover:text-slate-500',
};

const bgColorMap: Record<string, string> = {
    indigo: 'bg-indigo-500/10 text-indigo-500',
    blue: 'bg-blue-500/10 text-blue-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    rose: 'bg-rose-500/10 text-rose-500',
    amber: 'bg-amber-500/10 text-amber-500',
    cyan: 'bg-cyan-500/10 text-cyan-500',
    purple: 'bg-purple-500/10 text-purple-500',
    slate: 'bg-slate-500/10 text-slate-500',
};

export default function Sidebar({ isOpen, onClose, isMinimized, onToggleMinimize }: {
    isOpen: boolean,
    onClose: () => void,
    isMinimized: boolean,
    onToggleMinimize: () => void
}) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const { tokenDisplay, isPro } = useTokens();
    const { theme, toggleTheme, isDark } = useTheme();
    const [searchFocused, setSearchFocused] = useState(false);

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 bottom-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0",
                    "bg-white dark:bg-[#080810] border-r border-gray-100/80 dark:border-white/[0.05]",
                    "shadow-[4px_0_24px_rgba(0,0,0,0.06)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.4)]",
                    isOpen ? "translate-x-0 w-72" : "-translate-x-full w-72",
                    isMinimized ? "lg:w-20" : "lg:w-72"
                )}
            >
                <div className="flex flex-col h-full">

                    {/* ── Header / Branding ── */}
                    <div className="px-5 pt-6 pb-4">
                        <div className="flex items-center justify-between mb-6">
                            <Link href="/" className="flex items-center gap-3 group min-w-0">
                                <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-2xl bg-black dark:bg-white shadow-lg shadow-black/20 dark:shadow-white/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    <Image src="/logo.png" alt="Walia" width={26} height={26} className="object-contain invert dark:invert-0" unoptimized />
                                    <div className="absolute inset-0 rounded-2xl ring-2 ring-black/0 group-hover:ring-black/10 dark:group-hover:ring-white/20 transition-all" />
                                </div>
                                <div className={cn("flex flex-col min-w-0 transition-all duration-300", isMinimized ? "lg:hidden" : "")}>
                                    <span className="text-[17px] font-black text-black dark:text-white tracking-tight leading-none">Walia AI</span>
                                    <span className="text-[10px] font-bold text-black/30 dark:text-white/25 tracking-[0.18em] uppercase mt-0.5">Intelligence</span>
                                </div>
                            </Link>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                {/* Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-xl text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200"
                                    title={isDark ? 'Light mode' : 'Dark mode'}
                                >
                                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                </button>
                                {/* Collapse toggle */}
                                <button
                                    onClick={onToggleMinimize}
                                    className="hidden lg:flex p-2 rounded-xl text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200"
                                >
                                    <ChevronRight className={cn("w-4 h-4 transition-transform duration-300", isMinimized ? "rotate-180" : "")} />
                                </button>
                                {/* Mobile close */}
                                <button
                                    className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                                    onClick={onClose}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Search */}
                        {!isMinimized && (
                            <div className={cn("relative group transition-all duration-200", searchFocused ? "ring-1 ring-black dark:ring-white rounded-2xl" : "")}>
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 transition-colors group-focus-within:text-black dark:group-focus-within:text-white" />
                                <input
                                    type="text"
                                    readOnly
                                    placeholder="Search modules..."
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl py-2.5 pl-9 pr-10 text-[12px] font-semibold text-gray-500 dark:text-white/40 outline-none placeholder:text-gray-400 dark:placeholder:text-white/25 transition-all cursor-pointer"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-gray-200 dark:bg-white/10 text-[9px] font-black text-gray-400 dark:text-white/30">
                                    ⌘ K
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Navigation ── */}
                    <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto custom-scrollbar">
                        <div className={cn("px-3 flex items-center gap-3 mb-3 mt-1", isMinimized ? "lg:justify-center lg:px-0" : "")}>
                            {!isMinimized && (
                                <span className="text-[10px] font-black text-black/20 dark:text-white/15 uppercase tracking-[0.25em]">
                                    Menu
                                </span>
                            )}
                            <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.05]" />
                        </div>

                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href;
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                    className={cn(
                                        "group flex items-center rounded-2xl transition-all duration-200 relative overflow-hidden",
                                        isMinimized ? "lg:justify-center lg:px-0 lg:py-3" : "px-3 py-3 gap-3",
                                        isActive
                                            ? "bg-black dark:bg-white shadow-lg shadow-black/10 dark:shadow-white/5"
                                            : "hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                                    )}
                                    title={isMinimized ? link.name : undefined}
                                >
                                    {/* Active bg glow */}
                                    {isActive && (
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white dark:bg-black rounded-2xl" />
                                    )}

                                    <div className={cn(
                                        "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200",
                                        isMinimized ? "lg:w-10 lg:h-10 lg:rounded-2xl" : "",
                                        isActive
                                            ? "bg-white/20 dark:bg-black/20"
                                            : bgColorMap[link.color] + " group-hover:scale-110"
                                    )}>
                                        <Icon className={cn(
                                            "w-4 h-4 transition-all duration-200",
                                            isMinimized ? "lg:w-5 lg:h-5" : "",
                                            isActive ? "text-white dark:text-black" : ""
                                        )} />
                                    </div>

                                    {!isMinimized && (
                                        <span className={cn(
                                            "text-[13.5px] font-semibold tracking-tight whitespace-nowrap transition-colors",
                                            isActive ? "text-white dark:text-black" : "text-gray-600 dark:text-white/50 group-hover:text-black dark:group-hover:text-white"
                                        )}>
                                            {link.name}
                                        </span>
                                    )}

                                    {isActive && !isMinimized && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60 dark:bg-black/40" />
                                    )}
                                </Link>
                            );
                        })}

                        {/* Admin */}
                        {(user as any)?.isAdmin && (
                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5">
                                <Link
                                    href="/dashboard/admin"
                                    onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                    className="group flex items-center gap-3 px-3 py-3 rounded-2xl bg-amber-500/8 hover:bg-amber-500/15 transition-all border border-transparent hover:border-amber-500/20"
                                >
                                    <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-amber-500/15">
                                        <ShieldCheck className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                                    </div>
                                    {!isMinimized && (
                                        <span className="font-black text-[11px] text-amber-600 dark:text-amber-400 uppercase tracking-widest">Admin</span>
                                    )}
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* ── Bottom Section ── */}
                    <div className={cn("p-4 space-y-3 border-t border-gray-100 dark:border-white/[0.05]")}>

                        {/* Plan Upgrade Card */}
                        {!isMinimized && (
                            <Link
                                href="/dashboard/upgrade"
                                className={cn(
                                    "group relative block overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                                    isPro
                                        ? "bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-4"
                                        : "bg-black dark:bg-white p-4"
                                )}
                            >
                                {/* Glow overlay */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-white rounded-2xl" />
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:scale-125 transition-transform duration-500" />

                                <div className="relative z-10 flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                                                <Crown className="w-3.5 h-3.5 text-white dark:text-black" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70 dark:text-black/60">
                                                {isPro ? 'Pro Plan' : 'Free Plan'}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-black text-white dark:text-black tracking-tight mb-0.5">
                                            {isPro ? 'You are on Pro 🎉' : 'Upgrade to Pro'}
                                        </h4>
                                        <p className="text-[11px] text-white/55 dark:text-black/45 font-medium leading-relaxed">
                                            {isPro ? 'Unlimited AI access active.' : 'Unlock all AI models & tools.'}
                                        </p>
                                    </div>
                                    {!isPro && (
                                        <div className="flex-shrink-0 ml-3 mt-1">
                                            <ChevronRight className="w-4 h-4 text-white/50 dark:text-black/50 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    )}
                                </div>
                                {!isPro && (
                                    <div className="mt-3 flex items-center gap-1.5">
                                        <TrendingUp className="w-3 h-3 text-white/50 dark:text-black/40" />
                                        <span className="text-[10px] font-bold text-white/50 dark:text-black/40">Unlimited AI · All Models · Priority</span>
                                    </div>
                                )}
                            </Link>
                        )}

                        {/* Minimized: just crown icon */}
                        {isMinimized && (
                            <Link href="/dashboard/upgrade" className="flex items-center justify-center p-3 rounded-2xl bg-black dark:bg-white transition-all hover:scale-105" title="Upgrade to Pro">
                                <Crown className="w-5 h-5 text-white dark:text-black" />
                            </Link>
                        )}

                        {/* Settings & Theme row */}
                        {!isMinimized && (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/dashboard/settings"
                                    className="flex-1 flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 text-gray-500 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all"
                                >
                                    <span className="text-[11px] font-bold">Settings</span>
                                    <Settings className="w-3.5 h-3.5 hover:rotate-90 transition-transform duration-300" />
                                </Link>
                            </div>
                        )}

                        {/* User Profile */}
                        <div className={cn(
                            "flex items-center gap-3 rounded-2xl transition-all duration-200 overflow-hidden",
                            isMinimized
                                ? "lg:justify-center lg:p-2 lg:bg-transparent"
                                : "p-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                        )}>
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className={cn(
                                    "rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black overflow-hidden shadow-sm",
                                    isMinimized ? "w-10 h-10" : "w-9 h-9"
                                )}>
                                    {user?.photoURL ? (
                                        <Image src={user.photoURL} alt={user.name || ''} width={40} height={40} className="rounded-2xl object-cover w-full h-full" />
                                    ) : (
                                        <span className="text-sm">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                                    )}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#080810]" />
                            </div>

                            {!isMinimized && (
                                <>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold text-black dark:text-white truncate leading-tight">{user?.name || 'User'}</p>
                                        <p className="text-[10px] text-gray-400 dark:text-white/30 font-medium truncate mt-0.5">
                                            {isPro ? '✦ Pro Member' : `Level ${(user as any)?.level || 1} Explorer`}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => logout?.()}
                                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                                        title="Log out"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
