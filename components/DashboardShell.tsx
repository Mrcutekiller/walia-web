'use client';

import { useAuth } from '@/context/AuthContext';
import {
    Bot,
    Calendar,
    MessagesSquare as MessagesSquareEmoji,
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
    const { user, loading } = useAuth();
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

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-300 flex justify-center">
            {/* Mobile App Container */}
            <div className="w-full max-w-lg bg-white dark:bg-[#1A1A2E] relative flex flex-col min-h-screen shadow-2xl border-x border-black/5 dark:border-white/5 overflow-hidden">

                {/* ── TOP HEADER ── */}
                <header className="h-16 flex items-center justify-between px-5 bg-white/80 dark:bg-[#1A1A2E]/80 backdrop-blur-md shrink-0 sticky top-0 z-30 border-b border-black/5 dark:border-white/5">
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
                <main className="flex-1 overflow-y-auto pb-[90px] relative">
                    <div className="h-full">
                        {children}
                    </div>
                </main>

                {/* ── BOTTOM TAB BAR ── */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-50 px-4">
                    <nav className="flex items-center bg-white dark:bg-[#1A1A2E] rounded-full px-3 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] pointer-events-auto border border-black/5 dark:border-white/5 w-full max-w-[90%] gap-1">
                        {NAV.map(({ icon: Icon, label, href }) => {
                            // Check if current path starts with href (so sub-paths keep tab active)
                            // 'Chat' handles /chat, /messages, /community internally, but the base href is /dashboard/chat
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
