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
    Zap,
    ShieldCheck,
    LayoutList,
    Crown,
    LogOut,
    ChevronRight,
    Search
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { useTokens } from '@/context/TokenContext';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarLinks = [
    { name: 'AI Hub', href: '/dashboard/ai', icon: Sparkles, color: 'text-indigo-500' },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, color: 'text-blue-500' },
    { name: 'Notes', href: '/dashboard/notes', icon: BookOpen, color: 'text-emerald-500' },
    { name: 'Daily Plan', href: '/dashboard/plan', icon: LayoutList, color: 'text-rose-500' },
    { name: 'Tools', href: '/dashboard/tools', icon: Wrench, color: 'text-amber-500' },
    { name: 'Community', href: '/dashboard/community', icon: Users, color: 'text-cyan-500' },
    { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarIcon, color: 'text-purple-500' },
    { name: 'Profile', href: '/dashboard/profile', icon: User, color: 'text-slate-500' },
];

export default function Sidebar({ isOpen, onClose, isMinimized, onToggleMinimize }: { 
    isOpen: boolean, 
    onClose: () => void,
    isMinimized: boolean,
    onToggleMinimize: () => void
}) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const { tokenDisplay, isPro } = useTokens();

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 bottom-0 bg-white dark:bg-[#050505] border-r border-gray-100 dark:border-white/5 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 shadow-2xl lg:shadow-none",
                    isOpen ? "translate-x-0 w-[19rem]" : "-translate-x-full w-[19rem]",
                    isMinimized ? "lg:w-20" : "lg:w-[19rem]"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header/Branding */}
                    <div className="p-8 pb-4">
                        <div className="flex items-center justify-between mb-8">
                            <Link href="/" className="flex items-center space-x-3 group">
                                <div className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-black dark:bg-white shadow-xl shadow-black/10 transition-all duration-500 group-hover:rotate-6 group-hover:scale-105">
                                    <Image src="/logo.png" alt="Walia" width={32} height={32} className="object-contain invert dark:invert-0" unoptimized />
                                    <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className={`flex flex-col transition-opacity duration-300 ${isMinimized ? 'lg:opacity-0 lg:pointer-events-none' : 'opacity-100'}`}>
                                    <span className="text-xl font-black text-black dark:text-white tracking-tighter uppercase italic leading-none">Walia</span>
                                    <span className="text-[10px] font-black text-black/30 dark:text-white/20 uppercase tracking-[0.2em] mt-1">Intelligence</span>
                                </div>
                            </Link>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={onToggleMinimize}
                                    className="hidden lg:flex p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white transition-all hover:rotate-180 duration-300"
                                >
                                    <ChevronRight className={cn("w-4 h-4 transition-transform duration-300", isMinimized ? "rotate-180" : "")} />
                                </button>
                                <button className="lg:hidden p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white transition-all" onClick={onClose}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Search Bar Stub (Premium Touch) */}
                        <div className="relative group cursor-pointer">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                            </div>
                            <input 
                                type="text" 
                                readOnly 
                                placeholder="Search modules..."
                                className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-gray-500 outline-none transition-all group-hover:border-gray-200 dark:group-hover:border-white/10"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-gray-200 dark:bg-white/10 text-[9px] font-black text-gray-400">
                                ⌘ K
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                        <div className="px-4 flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-black/20 dark:text-white/10 uppercase tracking-[0.25em]">Dashboard</span>
                            <div className="h-px flex-1 ml-4 bg-gray-100 dark:bg-white/5" />
                        </div>
                        
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                    className={cn(
                                        "group flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 relative",
                                        isActive
                                            ? "bg-black dark:bg-white shadow-xl shadow-black/10 dark:shadow-white/5"
                                            : "hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                                    )}
                                >
                                    <link.icon className={cn(
                                        "w-[1.125rem] h-[1.125rem] transition-all duration-300 group-hover:scale-110 flex-shrink-0",
                                        isMinimized ? "lg:mx-auto" : "mr-4",
                                        isActive 
                                            ? "text-white dark:text-black" 
                                            : cn("text-gray-400 group-hover:text-black dark:group-hover:text-white", link.color.replace('text-', 'group-hover:text-'))
                                    )} />
                                    <span className={cn(
                                        "text-sm font-bold tracking-tight transition-all duration-300 whitespace-nowrap",
                                        isMinimized ? "lg:opacity-0 lg:w-0 lg:overflow-hidden" : "opacity-100 w-auto",
                                        isActive ? "text-white dark:text-black" : "text-gray-500 group-hover:text-black dark:text-white/50 dark:group-hover:text-white"
                                    )}>
                                        {link.name}
                                    </span>
                                    
                                    {!isActive && !isMinimized && (
                                        <ChevronRight className="ml-auto w-3.5 h-3.5 text-gray-200 dark:text-white/5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    )}
                                    
                                    {isActive && (
                                        <motion.div 
                                            layoutId="active-nav-glow"
                                            className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-6 bg-black dark:bg-white rounded-l-full blur-[2px] opacity-20" 
                                        />
                                    )}
                                </Link>
                            );
                        })}

                        {user?.isAdmin && (
                            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-white/5">
                                <Link
                                    href="/dashboard/admin"
                                    onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                    className="group flex items-center px-4 py-4 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 transition-all border border-transparent hover:border-amber-500/20"
                                >
                                    <ShieldCheck className="w-5 h-5 mr-4 text-amber-500 group-hover:scale-110 transition-transform" />
                                    <span className="font-black text-xs text-amber-600 uppercase tracking-widest">Admin Control</span>
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Bottom Section */}
                    <div className="p-6 space-y-4 border-t border-gray-100 dark:border-white/5">
                        
                        {/* Plan & Upgrade Card */}
                        <Link
                            href="/dashboard/upgrade"
                            className={cn(
                                "group relative block overflow-hidden shadow-xl transition-all duration-500 hover:scale-[1.02] active:scale-95 rounded-3xl",
                                isPro ? "bg-gradient-to-br from-indigo-500 to-purple-600" : "bg-black dark:bg-white",
                                isMinimized ? "lg:p-3" : "p-5"
                            )}
                        >
                            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full blur-[30px] -mr-8 -mt-8" />
                            </div>

                            <div className={cn("relative z-10", isMinimized ? "lg:hidden" : "")}>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 rounded-xl bg-white/20 dark:bg-black/10 flex items-center justify-center">
                                        <Crown className="w-4 h-4 text-white dark:text-black" />
                                    </div>
                                    <span className="text-[10px] font-black text-white/80 dark:text-black/70 uppercase tracking-[0.2em]">
                                        {isPro ? 'Pro Plan' : 'Free Plan'}
                                    </span>
                                </div>
                                <h4 className="text-base font-black text-white dark:text-black tracking-tight mb-1">
                                    {isPro ? 'You are on Pro' : 'Upgrade to Pro'}
                                </h4>
                                <p className="text-[11px] text-white/60 dark:text-black/50 font-medium mb-3">
                                    {isPro ? 'Enjoy unlimited AI access.' : 'Unlock unlimited AI & tools.'}
                                </p>
                                {!isPro && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-black text-white dark:text-black uppercase tracking-widest underline decoration-white/30 dark:decoration-black/20 underline-offset-4">Upgrade</span>
                                        <ChevronRight className="w-3 h-3 text-white dark:text-black group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </div>
                            {isMinimized && (
                                <div className="lg:flex hidden items-center justify-center p-2">
                                    <Crown className="w-5 h-5 text-white dark:text-black" />
                                </div>
                            )}
                        </Link>

                        {/* Theme & Settings Row */}
                        {!isMinimized && (
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex-1 flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                                    <span className="text-xs font-bold text-gray-500 dark:text-white/50">Theme</span>
                                    <ThemeToggle />
                                </div>
                                <Link 
                                    href="/dashboard/settings"
                                    className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 text-gray-400 hover:text-black dark:hover:text-white transition-all hover:rotate-90 hover:bg-gray-100 dark:hover:bg-white/10"
                                >
                                    <Settings className="w-4 h-4" />
                                </Link>
                            </div>
                        )}

                        {/* User Profile Card */}
                        <div className={cn(
                            "rounded-3xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 flex items-center gap-3 group relative transition-all duration-300 overflow-hidden",
                            isMinimized ? "lg:p-2 lg:justify-center" : "p-2.5"
                        )}>
                            <div className="relative shrink-0">
                                <div className="w-10 h-10 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-sm">
                                    {user?.photoURL ? (
                                        <Image src={user.photoURL} alt={user.name || ''} width={40} height={40} className="rounded-2xl object-cover" />
                                    ) : (
                                        <span className="font-black text-base">{user?.name?.charAt(0) || 'U'}</span>
                                    )}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#050505]" />
                            </div>
                            
                            <div className={cn("flex-1 min-w-0 transition-opacity duration-300", isMinimized ? "lg:hidden" : "")}>
                                <p className="text-sm font-bold text-black dark:text-white truncate">{user?.name || 'User'}</p>
                                <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">Level {user?.level || 1} Explorer</p>
                            </div>

                            {/* Logout button */}
                            <button 
                                onClick={() => logout?.()}
                                className={cn(
                                    "flex items-center justify-center rounded-xl transition-all duration-300 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10",
                                    isMinimized ? "lg:hidden" : "w-10 h-10"
                                )}
                                title="Log out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
