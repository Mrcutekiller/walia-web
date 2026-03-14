import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { useTheme } from '@/context/ThemeContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import {
    Bell,
    Bot,
    Calendar,
    LogOut,
    Menu,
    MessageSquare,
    Settings,
    User,
    Users,
    Wrench,
    X,
    Zap
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const SIDEBAR_NAV = [
    { icon: Bot, label: 'AI Chat', href: '/dashboard/ai' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
    { icon: Users, label: 'Community', href: '/dashboard/community' },
    { icon: Wrench, label: 'Tools', href: '/dashboard/tools' },
    { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { unreadCount } = useNotifications();
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
                fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-[#0A101D] border-r border-gray-200 dark:border-[#1E293B] flex flex-col
                transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:z-auto overflow-hidden
            `}>
                {/* Large Background Logo */}
                <div className="absolute -left-16 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] dark:opacity-[0.05] grayscale">
                    <Image src="/walia-logo.png" alt="" width={300} height={300} unoptimized className="object-contain" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 shrink-0">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-[10px] bg-white border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden shadow-lg shadow-black/5 font-black text-xl leading-none">
                                <Image src="/walia-logo.png" alt="Walia" width={28} height={28} unoptimized className="object-contain" />
                            </div>
                            <span className="text-xl font-black text-black dark:text-white tracking-widest uppercase">Walia</span>
                        </Link>
                        <button className="lg:hidden p-1 text-gray-400 hover:text-black dark:text-white/40 dark:hover:text-white" onClick={() => setSidebarOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav links */}
                    <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">

                        {SIDEBAR_NAV.map(({ icon: Icon, label, href }) => {
                            const active = pathname === href || pathname.startsWith(href) && href !== '/dashboard';
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-[20px] transition-all group relative ${active
                                        ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-md'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 shrink-0 transition-colors ${active ? 'text-white dark:text-black' : 'text-gray-400 dark:text-gray-500 group-hover:text-black dark:group-hover:text-gray-300'}`} />
                                    <span className={`text-[15px] ${active ? 'font-bold' : 'font-semibold'}`}>{label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Theme Toggle */}
                    <div className="px-6 py-4">
                        <div className="w-full bg-gray-100 dark:bg-[#182134] rounded-2xl p-1 flex">
                            <button
                                onClick={() => theme !== 'light' && toggleTheme()}
                                className={`flex-1 py-2 rounded-xl transition-all text-xs font-bold flex items-center justify-center gap-2 ${theme === 'light' ? 'bg-white dark:bg-[#2E3C56] text-black dark:text-white shadow-sm' : 'bg-transparent text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white'}`}
                            >
                                <span>☀️ Light</span>
                            </button>
                            <button
                                onClick={() => theme !== 'dark' && toggleTheme()}
                                className={`flex-1 py-2 rounded-xl transition-all text-xs font-bold flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-white dark:bg-[#2E3C56] text-black dark:text-white shadow-sm' : 'bg-transparent text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white'}`}
                            >
                                <span>🌙 Dark</span>
                            </button>
                        </div>
                    </div>

                    {/* User + logout Profile Summary */}
                    <div className="p-4 border-t border-gray-100 dark:border-white/5 shrink-0">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="w-10 h-10 rounded-[12px] bg-gray-200 dark:bg-[#182134] flex items-center justify-center shrink-0 overflow-hidden shadow-inner border border-gray-200 dark:border-white/10">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-gray-400 dark:group-hover:text-white transition-colors" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-black dark:text-white truncate group-hover:text-gray-600 dark:group-hover:text-[#4ade80] transition-colors">{user.displayName || user.email?.split('@')[0] || 'User'}</p>
                                <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 truncate mt-0.5">{user.email}</p>
                            </div>
                            <button onClick={handleLogout} title="Log out" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shrink-0">
                                <LogOut className="w-3.5 h-3.5 ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Desktop/Common Header with Bell */}
                <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-black/50 border-b border-gray-200 dark:border-white/5 shrink-0 z-20">
                    <div className="lg:hidden flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-black dark:text-white/60 dark:hover:text-white p-1">
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Image src="/walia-logo.png" alt="Walia" width={22} height={22} className="object-contain" />
                            <span className="text-black dark:text-white font-black tracking-tighter">Walia</span>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/notifications"
                            className="relative w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-all hover:scale-105 active:scale-95"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-[#0a0a0a] rounded-full" />
                            )}
                        </Link>

                        <Link href="/dashboard/upgrade" className="flex items-center gap-2 px-4 py-2 rounded-full bg-black dark:bg-[#4ade80] text-white dark:text-black text-xs font-black uppercase tracking-wider hover:scale-105 transition-all shadow-lg shadow-black/10">
                            <Zap className="w-3 h-3" /> <span className="hidden sm:inline">Get Pro</span>
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
