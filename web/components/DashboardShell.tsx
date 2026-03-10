import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import {
    Bot,
    Calendar,
    IdCard,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    StickyNote,
    User,
    Users,
    X,
    Zap
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const MAIN_NAV = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
    { icon: Bot, label: 'Walia Chat (AI)', href: '/dashboard/ai' },
    { icon: Users, label: 'Community', href: '/dashboard/community', badge: 15 },
    { icon: IdCard, label: 'ID Center', href: '/dashboard/id-center' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

const TOOLS_NAV = [
    { icon: StickyNote, label: 'Notes', href: '/dashboard/tools' },
    { icon: Calendar, label: 'Calendar', href: '/dashboard/events' },
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
        <div className="flex h-screen bg-gray-50 dark:bg-[#0a0a0a] text-black dark:text-white overflow-hidden">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/70 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── SIDEBAR ── */}
            <aside className={`
                fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0A101D] border-r border-[#1E293B] flex flex-col
                transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:z-auto relative overflow-hidden
            `}>
                {/* Large Background W Element */}
                <div className="absolute -left-16 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03]">
                    <span className="text-[400px] font-black leading-none text-white tracking-tighter">W</span>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-[10px] bg-white text-black flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden shadow-lg shadow-black/20 font-black text-xl leading-none">
                                W
                            </div>
                            <span className="text-xl font-black text-white tracking-widest uppercase">Walia</span>
                        </Link>
                        <button className="lg:hidden p-1 text-white/40 hover:text-white" onClick={() => setSidebarOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav links */}
                    <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto custom-scrollbar">

                        {/* Main Group */}
                        <div className="space-y-1">
                            <p className="px-3 py-2 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2">General</p>
                            {MAIN_NAV.map(({ icon: Icon, label, href, badge }) => {
                                const active = pathname === href || pathname.startsWith(href) && href !== '/dashboard';
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all group relative ${active
                                            ? 'bg-white/5 text-white shadow-sm font-bold'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {active && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#4ade80] rounded-r-full shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                                        )}
                                        <Icon className={`w-5 h-5 shrink-0 transition-colors ${active ? 'text-[#4ade80]' : 'text-gray-500 group-hover:text-gray-300'}`} />
                                        <span className={`text-[13px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
                                        {badge && (
                                            <div className="ml-auto w-5 h-5 rounded-full bg-red-500 text-[10px] font-black flex items-center justify-center text-white shadow-sm shadow-red-500/50">
                                                {badge}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Tools Group */}
                        <div className="space-y-1">
                            <p className="px-3 py-2 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Tools</p>
                            {TOOLS_NAV.map(({ icon: Icon, label, href }) => {
                                const active = pathname === href || pathname.startsWith(href) && href !== '/dashboard';
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all group relative ${active
                                            ? 'bg-white/5 text-white shadow-sm font-bold'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {active && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#4ade80] rounded-r-full shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                                        )}
                                        <Icon className={`w-5 h-5 shrink-0 transition-colors ${active ? 'text-[#4ade80]' : 'text-gray-500 group-hover:text-gray-300'}`} />
                                        <span className={`text-[13px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Theme Toggle (Mockup representation) */}
                    <div className="px-6 py-4">
                        <div className="w-full bg-[#182134] rounded-2xl p-1 flex">
                            <button className="flex-1 py-2 rounded-xl bg-transparent text-gray-500 hover:text-white transition-colors text-xs font-bold shadow-none flex items-center justify-center gap-2">
                                <span>Light</span>
                            </button>
                            <button className="flex-1 py-2 rounded-xl bg-[#2E3C56] text-white transition-colors text-xs font-bold shadow-sm flex items-center justify-center gap-2">
                                <span>Dark</span>
                            </button>
                        </div>
                    </div>

                    {/* User + logout Profile Summary */}
                    <div className="p-4 border-t border-white/5 shrink-0">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="w-10 h-10 rounded-[12px] bg-[#182134] flex items-center justify-center shrink-0 overflow-hidden shadow-inner border border-white/10">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-white truncate group-hover:text-[#4ade80] transition-colors">{user.displayName || user.email?.split('@')[0] || 'User'}</p>
                                <p className="text-[10px] font-medium text-gray-500 truncate mt-0.5">{user.email}</p>
                            </div>
                            <button onClick={handleLogout} title="Log out" className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shrink-0">
                                <LogOut className="w-3.5 h-3.5 ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile top bar */}
                <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-black/50 shrink-0">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-black dark:text-white/60 dark:hover:text-white p-1">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Image src="/walia-logo.png" alt="Walia" width={22} height={22} className="object-contain" />
                        <span className="text-black dark:text-white font-black tracking-tighter">Walia</span>
                    </div>
                    <Link href="/dashboard/upgrade" className="flex items-center gap-1 px-3 py-1.5 rounded-[10px] bg-black dark:bg-[#4ade80] text-white dark:text-black text-[10px] font-black uppercase tracking-wider">
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
