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

const NAV = [
    { icon: Bot, label: 'AI Chat', href: '/chat' },
    { icon: Wrench, label: 'Tools', href: '/tools' },
    { icon: Users, label: 'Community', href: '/community' },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
    { icon: Calendar, label: 'Calendar', href: '/calendar' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Settings, label: 'Settings', href: '/settings' },
];

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
            <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                    <p className="text-white/30 text-sm font-medium">Loading Walia...</p>
                </div>
            </div>
        );
    }

    const handleLogout = async () => {
        await signOut(auth);
        router.replace('/');
    };

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/70 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── SIDEBAR ── */}
            <aside className={`
                fixed top-0 left-0 bottom-0 z-50 w-64 bg-black border-r border-white/5 flex flex-col
                transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:z-auto
            `}>
                {/* Logo */}
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors overflow-hidden">
                            <Image src="/walia-logo.png" alt="Walia" width={28} height={28} className="object-contain" />
                        </div>
                        <span className="text-xl font-black text-white tracking-tighter">Walia</span>
                    </Link>
                    <button className="lg:hidden p-1 text-white/40 hover:text-white" onClick={() => setSidebarOpen(false)}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    <p className="px-3 py-2 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Main Menu</p>
                    {NAV.map(({ icon: Icon, label, href }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${active
                                        ? 'bg-white text-black font-bold'
                                        : 'text-white/50 hover:text-white hover:bg-white/8'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-black' : 'text-white/30 group-hover:text-white'}`} />
                                <span className="text-sm font-semibold">{label}</span>
                                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black" />}
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
                <div className="p-3 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            {user.photoURL ? (
                                <Image src={user.photoURL} alt="Avatar" width={32} height={32} className="rounded-full object-cover" />
                            ) : (
                                <User className="w-4 h-4 text-white/50" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{user.displayName || user.email?.split('@')[0] || 'User'}</p>
                            <p className="text-[10px] text-white/30 truncate">{user.email}</p>
                        </div>
                        <button onClick={handleLogout} title="Log out" className="text-white/20 hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile top bar */}
                <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/50 shrink-0">
                    <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white p-1">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Image src="/walia-logo.png" alt="Walia" width={22} height={22} className="object-contain" />
                        <span className="text-white font-black tracking-tighter">Walia</span>
                    </div>
                    <Link href="/upgrade" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider">
                        <Zap className="w-3 h-3" /> Pro
                    </Link>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
