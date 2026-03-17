import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
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
    const { user, profile, loading } = useAuth();
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
        <div className="flex h-screen bg-gray-50 text-black overflow-hidden font-sans">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/70 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── SIDEBAR ── */}
            <aside className={`
                fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col
                transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:z-auto overflow-hidden
            `}>
                {/* Background Decoration */}
                <div className="absolute -left-16 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] grayscale">
                    <Image src="/walia-logo.png" alt="" width={300} height={300} unoptimized className="object-contain" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* Logo Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-[10px] bg-white border border-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden shadow-lg shadow-black/5 font-black text-xl leading-none">
                                <Image src="/walia-logo.png" alt="Walia" width={28} height={28} unoptimized className="object-contain" />
                            </div>
                            <span className="text-xl font-black text-black tracking-widest uppercase">Walia</span>
                        </Link>
                        <button className="lg:hidden p-1 text-gray-400 hover:text-black" onClick={() => setSidebarOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
                        {SIDEBAR_NAV.map(({ icon: Icon, label, href }) => {
                            const active = pathname === href || (pathname.startsWith(href) && href !== '/dashboard');
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-[20px] transition-all group relative ${active
                                        ? 'bg-black text-white font-bold shadow-md'
                                        : 'text-gray-500 hover:text-black hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 shrink-0 transition-colors ${active ? 'text-white' : 'text-gray-400 group-hover:text-black'}`} />
                                    <span className={`text-[15px] ${active ? 'font-bold' : 'font-semibold'}`}>{label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Pro Upgrade Preview */}
                    <div className="px-4 py-6">
                        <Link href="/dashboard/upgrade" className="block relative p-6 rounded-[28px] bg-gradient-to-br from-indigo-600 to-purple-600 overflow-hidden group shadow-xl shadow-indigo-500/20 hover:scale-[1.02] transition-transform">
                            <div className="relative z-10">
                                <Zap className="w-8 h-8 text-white mb-3" />
                                <p className="text-white font-black text-xs uppercase tracking-widest mb-1">Go Pro</p>
                                <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Unlock all tools</p>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-10 blur-sm group-hover:scale-110 transition-transform">
                                <Zap className="w-24 h-24 text-white" />
                            </div>
                        </Link>
                    </div>

                    {/* User Profile Summary & XP Indicator */}
                    <div className="p-4 border-t border-gray-100 shrink-0 space-y-4">
                        {/* XP Progress Bar */}
                        {profile && (
                            <div className="px-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center">
                                            <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Level {Math.floor((profile.xp || 0) / 500) + 1}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400">{(profile.xp || 0) % 500} / 500 XP</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-amber-400 rounded-full transition-all duration-1000" 
                                        style={{ width: `${((profile.xp || 0) % 500) / 500 * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                            <div className="w-10 h-10 rounded-[12px] bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden shadow-inner border border-gray-100">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-black truncate">{profile?.name || user.displayName || user.email?.split('@')[0] || 'User'}</p>
                                <p className="text-[10px] font-medium text-gray-400 truncate mt-0.5">{user.email}</p>
                            </div>
                            <button onClick={handleLogout} title="Log out" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shrink-0">
                                <LogOut className="w-3.5 h-3.5 ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top bar */}
                <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-black p-1 transition-colors">
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden lg:block">
                            <h2 className="text-sm font-black text-gray-300 uppercase tracking-[0.2em]">{pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}</h2>
                        </div>
                        <div className="lg:hidden flex items-center gap-2">
                            <Image src="/walia-logo.png" alt="Walia" width={22} height={22} className="object-contain" />
                            <span className="text-black font-black tracking-tighter">Walia</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/notifications"
                            className="relative w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black transition-all hover:scale-105 active:scale-95"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
                            )}
                        </Link>

                        <Link href="/dashboard/upgrade" className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-black/10">
                            <Zap className="w-3 h-3 text-yellow-400" /> <span className="hidden sm:inline italic">Go Pro</span>
                        </Link>
                    </div>
                </header>
                
                <main className="flex-1 overflow-y-auto bg-white">
                    <div className="max-w-[1600px] mx-auto min-h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
