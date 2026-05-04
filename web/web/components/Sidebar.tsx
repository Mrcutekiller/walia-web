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
    ChevronLeft,
    ChevronRight,
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

// ── Navigation items — same as app TAB_CONFIG ──
const NAV_LINKS = [
    { name: 'AI Hub',     href: '/dashboard/ai',        icon: Sparkles,     color: '#6366F1' },
    { name: 'Messages',   href: '/dashboard/messages',  icon: MessageSquare,color: '#3B82F6' },
    { name: 'Notes',      href: '/dashboard/notes',     icon: BookOpen,     color: '#10B981' },
    { name: 'Daily Plan', href: '/dashboard/plan',      icon: LayoutList,   color: '#F43F5E' },
    { name: 'Tools',      href: '/dashboard/tools',     icon: Wrench,       color: '#F59E0B' },
    { name: 'Community',  href: '/dashboard/community', icon: Users,        color: '#06B6D4' },
    { name: 'Calendar',   href: '/dashboard/calendar',  icon: CalendarIcon, color: '#8B5CF6' },
    { name: 'Profile',    href: '/dashboard/profile',   icon: User,         color: '#EC4899' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isMinimized: boolean;
    onToggleMinimize: () => void;
}

export default function Sidebar({ isOpen, onClose, isMinimized, onToggleMinimize }: SidebarProps) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const { isPro } = useTokens();
    const { isDark, toggleTheme } = useTheme();

    const sidebarW = isMinimized ? 'lg:w-20' : 'lg:w-72';

    return (
        <>
            {/* ── Backdrop (mobile only) ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* ── Sidebar panel ── */}
            <aside
                className={cn(
                    // Base
                    'fixed top-0 left-0 bottom-0 z-50 flex flex-col',
                    'bg-white dark:bg-[#09090F]',
                    'border-r border-gray-100 dark:border-white/[0.05]',
                    'shadow-[4px_0_32px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_32px_rgba(0,0,0,0.5)]',
                    'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    // Width
                    'w-72',
                    sidebarW,
                    // Slide: mobile hides off-screen when closed
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                )}
            >
                {/* ═══════════════════ HEADER ═══════════════════ */}
                <div className="flex items-center justify-between px-4 pt-5 pb-3 flex-shrink-0">
                    {/* Logo */}
                    <Link
                        href="/"
                        className={cn('flex items-center gap-3 group min-w-0', isMinimized ? 'lg:justify-center lg:w-full' : '')}
                        onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                    >
                        <div className="flex-shrink-0 w-9 h-9 rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-105">
                            <Image src="/logo.png" alt="Walia" width={22} height={22} className="object-contain invert dark:invert-0" unoptimized />
                        </div>
                        {!isMinimized && (
                            <div className="flex flex-col min-w-0">
                                <span className="text-[16px] font-black text-black dark:text-white tracking-tight leading-tight">Walia AI</span>
                                <span className="text-[9px] font-bold text-black/25 dark:text-white/20 tracking-[0.2em] uppercase">Intelligence</span>
                            </div>
                        )}
                    </Link>

                    {/* Controls */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Theme */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl text-gray-400 dark:text-white/30 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all"
                            title={isDark ? 'Light mode' : 'Dark mode'}
                        >
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        {/* Collapse (desktop) */}
                        <button
                            onClick={onToggleMinimize}
                            className="hidden lg:flex p-2 rounded-xl text-gray-400 dark:text-white/30 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all"
                            title={isMinimized ? 'Expand' : 'Collapse'}
                        >
                            {isMinimized
                                ? <ChevronRight className="w-4 h-4" />
                                : <ChevronLeft className="w-4 h-4" />
                            }
                        </button>
                        {/* Close (mobile) */}
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 rounded-xl text-gray-400 dark:text-white/30 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ═══════════════════ NAV ITEMS ═══════════════════ */}
                <nav className="flex-1 px-3 overflow-y-auto py-2 space-y-0.5">
                    {/* Section label */}
                    {!isMinimized && (
                        <div className="flex items-center gap-2 px-3 mb-2">
                            <span className="text-[9px] font-black text-black/20 dark:text-white/15 uppercase tracking-[0.3em]">Menu</span>
                            <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.05]" />
                        </div>
                    )}

                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                title={isMinimized ? link.name : undefined}
                                className={cn(
                                    'group flex items-center rounded-2xl transition-all duration-200 overflow-hidden',
                                    isMinimized
                                        ? 'lg:justify-center lg:py-3 lg:px-0 px-3 py-3 gap-3'
                                        : 'px-3 py-3 gap-3',
                                    isActive
                                        ? 'bg-black dark:bg-white shadow-md'
                                        : 'hover:bg-gray-50 dark:hover:bg-white/[0.04]'
                                )}
                            >
                                {/* Icon box */}
                                <div
                                    className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
                                    style={{
                                        backgroundColor: isActive
                                            ? 'rgba(255,255,255,0.18)'
                                            : link.color + '1A', // 10% opacity
                                    }}
                                >
                                    <Icon
                                        className="w-4 h-4 transition-all"
                                        style={{ color: isActive ? (isDark ? '#000' : '#FFF') : link.color }}
                                    />
                                </div>

                                {/* Label */}
                                {!isMinimized && (
                                    <span className={cn(
                                        'text-[13px] font-semibold tracking-tight whitespace-nowrap transition-colors',
                                        isActive
                                            ? 'text-white dark:text-black'
                                            : 'text-gray-600 dark:text-white/50 group-hover:text-black dark:group-hover:text-white'
                                    )}>
                                        {link.name}
                                    </span>
                                )}

                                {/* Active dot */}
                                {isActive && !isMinimized && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50 dark:bg-black/30 flex-shrink-0" />
                                )}
                            </Link>
                        );
                    })}

                    {/* Admin link */}
                    {(user as any)?.isAdmin && (
                        <div className="pt-3 mt-3 border-t border-gray-100 dark:border-white/[0.05]">
                            <Link
                                href="/dashboard/admin"
                                onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                className="group flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all"
                            >
                                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center">
                                    <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                {!isMinimized && (
                                    <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Admin</span>
                                )}
                            </Link>
                        </div>
                    )}
                </nav>

                {/* ═══════════════════ BOTTOM ═══════════════════ */}
                <div className="flex-shrink-0 p-3 border-t border-gray-100 dark:border-white/[0.05] space-y-3">

                    {/* Upgrade card */}
                    {!isMinimized ? (
                        <Link
                            href="/dashboard/upgrade"
                            className={cn(
                                'group relative flex flex-col overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]',
                                isPro
                                    ? 'bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700'
                                    : 'bg-black dark:bg-white'
                            )}
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl -mr-6 -mt-6 group-hover:scale-125 transition-transform duration-500" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Crown className="w-3.5 h-3.5 text-white dark:text-black" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 dark:text-black/50">
                                        {isPro ? 'Pro Plan' : 'Free Plan'}
                                    </span>
                                </div>
                                <p className="text-sm font-black text-white dark:text-black tracking-tight">
                                    {isPro ? 'You\'re on Pro 🎉' : 'Upgrade to Pro'}
                                </p>
                                <p className="text-[10px] text-white/50 dark:text-black/40 font-medium mt-0.5">
                                    {isPro ? 'Unlimited AI access active.' : 'Unlock all models & tools.'}
                                </p>
                                {!isPro && (
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <TrendingUp className="w-3 h-3 text-white/40 dark:text-black/30" />
                                        <span className="text-[9px] font-bold text-white/40 dark:text-black/30">Unlimited · All Models · Priority</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ) : (
                        <Link href="/dashboard/upgrade"
                            className="flex items-center justify-center p-3 rounded-2xl bg-black dark:bg-white hover:opacity-80 transition-all"
                            title="Upgrade to Pro"
                        >
                            <Crown className="w-5 h-5 text-white dark:text-black" />
                        </Link>
                    )}

                    {/* Settings link */}
                    {!isMinimized && (
                        <Link
                            href="/dashboard/settings"
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] text-gray-500 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.07] transition-all group"
                        >
                            <span className="text-[11px] font-bold">Settings</span>
                            <Settings className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
                        </Link>
                    )}

                    {/* User card */}
                    <div className={cn(
                        'flex items-center gap-3 rounded-2xl transition-all duration-200',
                        isMinimized
                            ? 'lg:justify-center'
                            : 'p-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]'
                    )}>
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-9 h-9 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-sm overflow-hidden shadow-sm">
                                {user?.photoURL ? (
                                    <Image src={user.photoURL} alt={user.name || ''} width={36} height={36} className="object-cover w-full h-full" />
                                ) : (
                                    <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                                )}
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#09090F]" />
                        </div>

                        {!isMinimized && (
                            <>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-bold text-black dark:text-white truncate leading-tight">{user?.name || 'User'}</p>
                                    <p className="text-[9px] text-gray-400 dark:text-white/25 font-medium truncate mt-0.5">
                                        {isPro ? '✦ Pro Member' : `Level ${(user as any)?.level || 1} Explorer`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => logout?.()}
                                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 dark:text-white/25 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                                    title="Sign out"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
