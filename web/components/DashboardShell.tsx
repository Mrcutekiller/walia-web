import { cn } from '@/lib/utils';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { auth } from '@/lib/firebase';
import { motion } from 'framer-motion';
import {
    Bot,
    Calendar,
    ChevronRight,
    MessagesSquare as MessagesSquareEmoji,
    Moon,
    User,
    Wrench,
    Zap
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import NotificationPanel from './NotificationPanel';

const NAV = [
    { icon: Bot, label: 'AI', href: '/dashboard/ai' },
    { icon: MessagesSquareEmoji, label: 'Chat', href: '/dashboard/chat' },
    { icon: Wrench, label: 'Tools', href: '/dashboard/tools' },
    { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const { user, profile, loading } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-black/10 dark:border-white/10 border-t-indigo-600 rounded-full animate-spin" />
                    <p className="text-black/30 dark:text-white/30 text-sm font-medium">Loading Walia...</p>
                </div>
            </div>
        );
    }

    const handleLogout = async () => {
        await auth.signOut();
        router.push('/');
    };

    // Define navItems for the new structure
    const navItems = [
        { icon: Bot, label: 'AI', path: '/dashboard/ai' },
        { icon: MessagesSquareEmoji, label: 'Chat', path: '/dashboard/chat' },
        { icon: Wrench, label: 'Tools', path: '/dashboard/tools' },
        { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar' },
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex transition-colors duration-300">
            {/* ── DESKTOP SIDEBAR ── */}
            <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 h-screen sticky top-0 z-30 select-none">
                <div className="p-8">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 transition-all group-hover:border-indigo-500 group-hover:shadow-lg group-hover:shadow-indigo-500/10">
                            <Image src="/walia-logo.png" alt="Logo" width={24} height={24} className="object-contain" />
                        </div>
                        <span className="text-xl font-extrabold text-slate-900 tracking-tight">Walia</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Main Menu</p>
                    {NAV.map((item) => {
                        const active = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                                    active
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", active ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                                <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                                {active && (
                                    <motion.div layoutId="sidebarActive" className="ml-auto w-1.5 h-1.5 rounded-full bg-white/40" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-4">
                    <Link href="/dashboard/upgrade" className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 group hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 fill-current" />
                            <span className="font-bold text-[11px] uppercase tracking-wider">Upgrade to Pro</span>
                        </div>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <div className="flex items-center gap-3 p-2 rounded-2xl">
                        <Link href="/dashboard/profile" className="flex items-center gap-3 flex-1 min-w-0 group">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 group-hover:border-indigo-500 transition-colors">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-xs">
                                        {(profile?.displayName || user.displayName || 'U').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{profile?.displayName || user.displayName || 'User'}</p>
                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Free Plan</p>
                            </div>
                        </Link>
                        <button onClick={toggleTheme} className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all">
                            <Moon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── CONTENT AREA ── */}
            <div className="flex-1 flex flex-col min-w-0 relative h-screen">
                {/* ── MOBILE HEADER ── */}
                <header className="md:hidden h-16 flex items-center justify-between px-5 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200">
                            <Image src="/walia-logo.png" alt="Walia" width={18} height={18} className="object-contain" />
                        </div>
                        <span className="text-slate-900 font-extrabold tracking-tight text-lg">Walia</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <NotificationPanel />
                        <Link href="/dashboard/profile" className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
                            <img src={user?.photoURL || '/avatars/avatar1.jpg'} alt="Avatar" className="w-full h-full object-cover" />
                        </Link>
                    </div>
                </header>

                {/* ── MAIN CONTENT ── */}
                <main className="flex-1 overflow-y-auto pb-24 md:pb-0 relative custom-scrollbar">
                    {children}
                </main>

                {/* ── MOBILE TAB BAR ── */}
                <div className="md:hidden fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none z-50 px-6">
                    <nav className="flex items-center bg-white rounded-full px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] pointer-events-auto border border-slate-100 w-full max-w-sm gap-1">
                        {NAV.map((item) => {
                            const active = pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-center transition-all duration-500 rounded-full h-11 shrink-0",
                                        active
                                            ? "flex-[2] bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                            : "flex-1 text-slate-400 hover:text-indigo-600"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <item.icon className={cn("w-5 h-5", active ? "text-white" : "")} />
                                        {active && (
                                            <span className="text-[11px] font-bold tracking-tight whitespace-nowrap overflow-hidden transition-all duration-500">
                                                {item.label}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}

