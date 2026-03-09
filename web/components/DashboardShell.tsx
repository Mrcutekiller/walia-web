'use client';

<<<<<<< HEAD
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
    Bell,
    Calendar,
    Cpu,
=======
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import {
    Bot,
    Calendar,
    Crown,
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
    LogOut,
    Menu,
    MessageSquare,
    Settings,
<<<<<<< HEAD
    Sparkles,
    UserCircle,
    Users,
    Wrench,
    X
} from 'lucide-react';
=======
    User,
    Users,
    Wrench,
    X,
    Zap,
} from 'lucide-react';
import Image from 'next/image';
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

<<<<<<< HEAD
const MENU_ITEMS = [
    { label: 'AI Chat', icon: Cpu, href: '/dashboard/ai' },
    { label: 'Messages', icon: MessageSquare, href: '/dashboard/messages' },
    { label: 'Community', icon: Users, href: '/dashboard/community' },
    { label: 'Tools', icon: Wrench, href: '/dashboard/tools' },
    { label: 'Events', icon: Calendar, href: '/dashboard/events' },
    { label: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
    { label: 'Profile', icon: UserCircle, href: '/dashboard/profile' },
    { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
=======
const NAV = [
    { icon: Bot, label: 'AI Chat', href: '/chat' },
    { icon: Wrench, label: 'Tools', href: '/tools' },
    { icon: Users, label: 'Community', href: '/community' },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
    { icon: Calendar, label: 'Calendar', href: '/calendar' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Settings, label: 'Settings', href: '/settings' },
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
<<<<<<< HEAD
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
=======
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
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
            </div>
        );
    }

<<<<<<< HEAD
    const unreadNotifications = 2; // Mock

    return (
        <div className="flex h-screen bg-white text-black font-sans overflow-hidden selection:bg-black selection:text-white">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-black tracking-tight text-lg">Walia</span>
                </div>
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Sidebar Structure */}
            <aside
                className={cn(
                    "fixed md:static inset-y-0 left-0 z-50 w-72 bg-gray-50 border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Close Button Mobile */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="md:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-200"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Logo */}
                <div className="h-24 flex items-center px-8 shrink-0">
                    <Link href="/dashboard" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-black text-2xl tracking-tighter">Walia</span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1 custom-scrollbar">
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 font-bold text-sm group",
                                    isActive
                                        ? "bg-black text-white shadow-lg shadow-black/10"
                                        : "text-gray-500 hover:bg-gray-100/80 hover:text-black"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-black")} />
                                <span>{item.label}</span>
                                {item.label === 'Notifications' && unreadNotifications > 0 && (
                                    <span className={cn(
                                        "ml-auto text-[10px] font-black px-2 py-0.5 rounded-full",
                                        isActive ? "bg-white text-black" : "bg-black text-white"
                                    )}>
                                        {unreadNotifications}
                                    </span>
                                )}
=======
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
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
                            </Link>
                        );
                    })}
                </nav>

<<<<<<< HEAD
                {/* Upgrade Button */}
                <div className="p-6 shrink-0 border-t border-gray-200">
                    <Link
                        href="/dashboard/upgrade"
                        className="w-full flex items-center justify-center py-4 rounded-2xl bg-white border-2 border-black text-black font-black text-sm transition-all hover:-translate-y-1 hover:shadow-[0_8px_0_0_#000]"
                    >
                        UPGRADE TO PRO
                    </Link>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-white md:rounded-l-[40px] md:shadow-[-20px_0_40px_rgba(0,0,0,0.02)] md:-ml-6 z-10 relative overflow-hidden">
                {/* Content inner area */}
                <div className="flex-1 overflow-y-auto mt-16 md:mt-0 relative">
                    {children}
                </div>

                {/* Profile Bubble - Bottom Right (Fixed) */}
                <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="w-14 h-14 rounded-full bg-black border-4 border-white shadow-xl flex items-center justify-center overflow-hidden hover:scale-105 transition-transform active:scale-95"
                        >
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserCircle className="w-8 h-8 text-white" />
                            )}
                        </button>

                        {/* Profile Context Menu */}
                        {showProfileMenu && (
                            <div className="absolute bottom-full right-0 mb-4 w-56 rounded-3xl bg-white border border-gray-200 shadow-2xl p-2 animate-in slide-in-from-bottom-2 fade-in">
                                <div className="px-4 py-3 border-b border-gray-100 mb-2">
                                    <p className="text-sm font-black truncate">{user.displayName || 'Walia Voyager'}</p>
                                    <p className="text-xs text-gray-500 font-medium truncate">{user.email}</p>
                                </div>
                                <Link onClick={() => setShowProfileMenu(false)} href="/dashboard/profile" className="w-full flex items-center px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold text-gray-700">
                                    <UserCircle className="w-4 h-4 mr-3 text-gray-400" />
                                    My Profile
                                </Link>
                                <Link onClick={() => setShowProfileMenu(false)} href="/dashboard/settings" className="w-full flex items-center px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold text-gray-700">
                                    <Settings className="w-4 h-4 mr-3 text-gray-400" />
                                    Preferences
                                </Link>
                                <button
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        signOut(auth);
                                    }}
                                    className="w-full flex items-center px-4 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-sm font-bold mt-1"
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                        {/* Click away listener for menu */}
                        {showProfileMenu && (
                            <div className="fixed inset-0 z-[-1]" onClick={() => setShowProfileMenu(false)} />
                        )}
                    </div>
                </div>
            </main>
=======
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
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
        </div>
    );
}
