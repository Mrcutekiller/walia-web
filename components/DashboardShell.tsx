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
    { icon: Calendar, label: 'Events', href: '/dashboard/events' },
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
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm font-medium">Loading Walia...</p>
                </div>
            </div>
        );
    }

    const handleLogout = async () => {
        await signOut(auth);
        router.replace('/');
    };

    return (
        <div className="flex h-screen bg-gray-50 text-black overflow-hidden">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/70 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── SIDEBAR ── */}
            <aside className={`
                fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col
                transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:z-auto overflow-hidden shadow-sm
            `}>
                {/* Large Background W Element */}
                <div className="absolute -left-16 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] dark:opacity-[0.05] grayscale">
                    <Image src="/walia-logo.png" alt="" width={300} height={300} unoptimized className="object-contain" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className="w-9 h-9 rounded-[10px] bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden shadow-sm">
                                <Image src="/walia-logo.png" alt="Walia" width={24} height={24} unoptimized className="object-contain" />
                            </div>
                            <span className="text-lg font-black text-slate-900 tracking-tight">Walia</span>
                        </Link>
                        <button className="lg:hidden p-1 text-slate-400 hover:text-slate-900" onClick={() => setSidebarOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav links */}
                    <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                        {SIDEBAR_NAV.map(({ icon: Icon, label, href }) => {
                            const active = pathname === href || (pathname.startsWith(href) && href !== '/dashboard');
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all group relative ${
                                        active
                                            ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200'
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                >
                                    <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                                        active ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                                    }`} />
                                    <span className={`text-[14px] ${
                                        active ? 'font-bold' : 'font-semibold'
                                    }`}>{label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile Summary */}
                    <div className="p-4 border-t border-slate-100 shrink-0">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group">
                            <div className="w-9 h-9 rounded-[11px] bg-indigo-100 flex items-center justify-center shrink-0 overflow-hidden">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover rounded-[11px]" />
                                ) : (
                                    <User className="w-4 h-4 text-indigo-500" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-slate-900 truncate">{user.displayName || user.email?.split('@')[0] || 'User'}</p>
                                <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{user.email}</p>
                            </div>
                            <button onClick={handleLogout} title="Log out" className="w-8 h-8 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shrink-0">
                                <LogOut className="w-3.5 h-3.5 ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-slate-50">
                {/* Mobile top bar */}
                <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white shrink-0 shadow-sm">
                    <button onClick={() => setSidebarOpen(true)} className="text-slate-500 hover:text-slate-900 p-1">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Image src="/walia-logo.png" alt="Walia" width={22} height={22} className="object-contain" />
                        <span className="text-slate-900 font-black tracking-tighter">Walia</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard/notifications" className="relative p-1.5 text-slate-500 hover:text-slate-900">
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                            )}
                        </Link>
                        <Link href="/dashboard/upgrade" className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-wider">
                            <Zap className="w-3 h-3" /> Pro
                        </Link>
                    </div>
                </header>

                {/* Desktop floating top-right actions */}
                <div className="hidden lg:flex absolute top-5 right-6 z-10 items-center gap-3">
                    <Link href="/dashboard/notifications" className="relative p-2 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm hover:shadow-md transition-all">
                        <Bell className="w-4.5 h-4.5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                        )}
                    </Link>
                    <Link href="/dashboard/upgrade" className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-indigo-200 hover:scale-105 transition-transform">
                        <Zap className="w-3.5 h-3.5 text-yellow-300" /> Upgrade Pro
                    </Link>
                </div>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
