import { cn } from '@/lib/utils';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { auth } from '@/lib/firebase';
import {
    Bot,
    Calendar,
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

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-300 flex">
            {/* ── DESKTOP SIDEBAR (Hidden on Mobile) ── */}
            <aside className="hidden md:flex flex-col w-72 shrink-0 border-r border-black/5 dark:border-white/5 bg-white dark:bg-[#1A1A2E] sticky top-0 h-screen select-none">
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-black/5 dark:border-white/5 shrink-0">
                    <Link href="/dashboard/chat" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-white/10 flex items-center justify-center">
                            <Image src="/walia-logo.png" alt="Walia" width={24} height={24} className="object-contain" />
                        </div>
                        <span className="text-black dark:text-white font-black tracking-tighter text-xl">Walia</span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
                    <p className="px-4 text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-4">Main Menu</p>
                    {NAV.map(({ icon: Icon, label, href }) => {
                        const active = pathname === href || pathname.startsWith(href + '/');
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                                    active
                                        ? "bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/10"
                                        : "hover:bg-black/5 dark:hover:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", active ? "text-white dark:text-black" : "text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white")} />
                                <span className={cn("font-bold text-sm", active ? "" : "")}>{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Profile Area & Theme Toggle */}
                <div className="p-4 border-t border-black/5 dark:border-white/5 shrink-0 space-y-2">
                    <Link href="/dashboard/upgrade" className="flex items-center justify-between p-4 rounded-2xl bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-600/20 group hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            <span className="font-black text-xs uppercase tracking-wider">Upgrade to Pro</span>
                        </div>
                    </Link>

                    <div className="flex items-center justify-between px-2 pt-2 pb-1">
                        <div className="flex items-center gap-3 w-full">
                            <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden shrink-0 border border-black/10 dark:border-white/10">
                                {user?.photoURL ? (
                                    <Image src={user.photoURL} alt="Avatar" width={40} height={40} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-xs">
                                        {(profile?.displayName || user.displayName || 'U').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-black dark:text-white truncate">{profile?.displayName || user.displayName}</p>
                                <p className="text-[10px] text-black/50 dark:text-white/50 truncate font-medium">{user.email}</p>
                            </div>
                            <button onClick={toggleTheme} className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                                <Moon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── MOBILE / DESKTOP CONTENT AREA ── */}
            <div className="flex-1 flex flex-col min-w-0 relative">

                {/* ── MOBILE TOP HEADER ── */}
                <header className="md:hidden h-16 flex items-center justify-between px-5 bg-white/80 dark:bg-[#1A1A2E]/80 backdrop-blur-md shrink-0 sticky top-0 z-30 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-600/10 dark:bg-white/10 flex items-center justify-center">
                            <Image src="/walia-logo.png" alt="Walia" width={20} height={20} className="object-contain" />
                        </div>
                        <span className="text-black dark:text-white font-black tracking-tighter text-lg">Walia</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <NotificationPanel />
                        <Link href="/dashboard/upgrade" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-indigo-600/20">
                            <Zap className="w-3 h-3" /> <span>Pro</span>
                        </Link>
                    </div>
                </header>

                {/* ── MAIN CONTENT ── */}
                <main className="flex-1 overflow-y-auto pb-[90px] md:pb-0 relative custom-scrollbar bg-[#f8f9fa] dark:bg-[#0a0a0a]">
                    <div className="h-full">
                        {children}
                    </div>
                </main>

                {/* ── MOBILE BOTTOM TAB BAR ── */}
                <div className="md:hidden absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-50 px-4">
                    <nav className="flex items-center bg-white dark:bg-[#1A1A2E] rounded-full px-3 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] pointer-events-auto border border-black/5 dark:border-white/5 w-full max-w-[90%] gap-1">
                        {NAV.map(({ icon: Icon, label, href }) => {
                            const active = pathname === href || pathname.startsWith(href + '/');
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center justify-center transition-all duration-300 rounded-full py-2.5 ${active
                                        ? 'flex-[1.8] bg-black dark:bg-white text-white dark:text-black'
                                        : 'flex-1 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className={`w-5 h-5 ${active ? 'text-white dark:text-black' : ''}`} />
                                        {active && (
                                            <span className="text-xs font-bold whitespace-nowrap overflow-hidden">
                                                {label}
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
