'use client';

import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import {
    Bot,
    Calendar,
    Crown,
    LogOut,
    Menu,
    MessageSquare,
    Settings,
    User,
    Users,
    Wrench,
    X,
    Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NotificationPanel from './NotificationPanel';

const NAV = [
    { icon: Bot, label: 'AI Hub', href: '/dashboard/ai' },
    { icon: MessageSquare, label: 'AI Chat', href: '/chat' },
    { icon: Wrench, label: 'Tools', href: '/dashboard/tools' },
    { icon: Users, label: 'Community', href: '/dashboard/community' },
    { icon: MessagesSquareEmoji, label: 'Messages', href: '/dashboard/messages' },
    { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

import { MessagesSquare as MessagesSquareEmoji } from 'lucide-react';


export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
        await signOut(auth);
        router.replace('/');
    };

    return (
        <div className="flex h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-black dark:text-white overflow-hidden transition-colors duration-300">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/70 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── SIDEBAR ── */}
            <aside className={`
                fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-black border-r border-black/5 dark:border-white/5 flex flex-col
                transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:z-auto
            `}>
                {/* Logo */}
                <div className="flex items-center justify-between p-5 border-b border-black/5 dark:border-white/5">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-full bg-indigo-600/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-indigo-600/20 dark:group-hover:bg-white/20 transition-colors overflow-hidden">
                            <Image src="/walia-logo.png" alt="Walia" width={28} height={28} className="object-contain" />
                        </div>
                        <span className="text-xl font-black text-black dark:text-white tracking-tighter">Walia</span>
                    </Link>
                    <button className="lg:hidden p-1 text-black/40 dark:text-white/40 hover:text-indigo-600 dark:hover:text-white" onClick={() => setSidebarOpen(false)}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    <p className="px-3 py-2 text-[9px] font-black text-black/20 dark:text-white/20 uppercase tracking-[0.3em]">Main Menu</p>
                    {NAV.map(({ icon: Icon, label, href }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${active
                                    ? 'bg-black dark:bg-white text-white dark:text-black font-bold'
                                    : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-white dark:text-black' : 'text-black/30 dark:text-white/30 group-hover:text-black dark:group-hover:text-white'}`} />
                                <span className="text-sm font-semibold">{label}</span>
                                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Upgrade card */}
                <div className="p-3">
                    <Link href="/upgrade" className="block p-4 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 hover:opacity-90 transition-opacity group">
                        <div className="flex items-center gap-2 mb-1">
                            <Crown className="w-4 h-4 text-white/80" />
                            <span className="text-white font-black text-xs uppercase tracking-widest">Walia Pro</span>
                        </div>
                        <p className="text-white/60 text-[11px] mb-3">Unlock unlimited AI + all tools</p>
                        <div className="w-full py-1.5 rounded-lg bg-white text-indigo-700 text-[10px] font-black uppercase tracking-widest text-center">
                            Upgrade · $12/mo
                        </div>
                    </Link>
                </div>

                {/* User + logout */}
                <div className="p-3 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5">
                        <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                            {user.photoURL ? (
                                <Image src={user.photoURL} alt="Avatar" width={32} height={32} className="rounded-full object-cover" />
                            ) : (
                                <User className="w-4 h-4 text-black/50 dark:text-white/50" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-black dark:text-white truncate">{user.displayName || user.email?.split('@')[0] || 'User'}</p>
                            <p className="text-[10px] text-black/30 dark:text-white/30 truncate">{user.email}</p>
                        </div>
                        <NotificationPanel />
                        <button onClick={handleLogout} title="Log out" className="text-black/20 dark:text-white/20 hover:text-rose-600 dark:hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile top bar */}
                <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-black/50 backdrop-blur-md shrink-0">
                    <button onClick={() => setSidebarOpen(true)} className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white p-1">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Image src="/walia-logo.png" alt="Walia" width={22} height={22} className="object-contain" />
                        <span className="text-black dark:text-white font-black tracking-tighter">Walia</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <NotificationPanel />
                        <Link href="/upgrade" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider">
                            <Zap className="w-3 h-3" /> Pro
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
