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
    const { user, loading } = useAuth();
    const { unreadCount } = useNotifications();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="h-screen flex items-center justify-center bg-[var(--color-surface)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-[var(--color-surface-container-highest)] border-t-[var(--color-primary)] rounded-full animate-spin" />
                    <p className="text-[var(--color-on-surface-variant)] text-sm font-medium">Loading Walia...</p>
                </div>
            </div>
        );
    }

    const handleLogout = async () => {
        await signOut(auth);
        router.replace('/');
    };

    return (
        <div className="flex h-screen bg-[var(--color-surface)] text-[var(--color-on-background)] overflow-hidden font-[family-name:var(--font-inter)]">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/70 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── SIDEBAR ── */}
            <aside className={`
                fixed top-0 left-0 bottom-0 z-50 w-64 bg-[var(--color-surface-container-low)] flex flex-col
                transition-transform duration-300 py-8 px-6 space-y-8
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:z-auto overflow-hidden
            `}>
                <div className="relative z-10 flex flex-col h-full gap-1">
                    {/* Logo Header */}
                    <Link href="/dashboard" className="text-2xl font-semibold text-[var(--color-on-surface)] tracking-tight font-[family-name:var(--font-manrope)] mb-4">
                        Walia AI
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar pt-4">
                        {SIDEBAR_NAV.map(({ icon: Icon, label, href }) => {
                            const active = pathname === href || (pathname.startsWith(href) && href !== '/dashboard');
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-none transition-all group relative font-[family-name:var(--font-manrope)] font-medium text-sm tracking-tight ${active
                                        ? 'text-[var(--color-on-surface)] border-r-2 border-[var(--color-primary)] bg-[var(--color-surface-container)] font-semibold'
                                        : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)]'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 shrink-0 transition-colors" />
                                    <span>{label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile Summary */}
                    <div className="pt-6 space-y-4 shrink-0 mt-auto">
                        <div className="flex items-center gap-3 px-2">
                             <div className="relative">
                                 {user?.photoURL ? (
                                    <Image src={user.photoURL} alt="Avatar" width={40} height={40} className="rounded-full object-cover grayscale opacity-80" />
                                 ) : (
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container-highest)] flex items-center justify-center">
                                        <User className="w-5 h-5 text-[var(--color-outline-variant)]" />
                                    </div>
                                 )}
                                 <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[8px] flex items-center justify-center font-bold rounded-full border-2 border-[var(--color-surface-container-low)]">
                                     {Math.floor((user?.xp || 0) / 500) + 1}
                                 </div>
                             </div>
                             <div>
                                 <p className="text-sm font-semibold text-[var(--color-on-surface)]">{user?.name || user?.email?.split('@')[0] || 'Walia User'}</p>
                                 <p className="text-[10px] text-[var(--color-outline-variant)] font-medium tracking-tight">{(user?.xp || 0)} XP</p>
                             </div>
                        </div>
                        <button onClick={() => router.push('/dashboard/upgrade')} className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dim)] transition-all active:scale-[0.98] font-[family-name:var(--font-manrope)]">
                            Go Pro
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top bar */}
                <header className="flex justify-between items-center w-full h-20 px-10 bg-[var(--color-surface)]/80 backdrop-blur-xl sticky top-0 z-40 transition-all">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] p-1 transition-colors">
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-[family-name:var(--font-manrope)] font-bold text-[var(--color-on-surface)] tracking-tight hidden lg:block uppercase">
                             {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
                        </h1>
                        <div className="hidden sm:flex items-center px-4 py-1.5 bg-[var(--color-surface-container-low)] rounded-full gap-2.5">
                            <span className="w-1.5 h-1.5 bg-[var(--color-primary)]/40 rounded-full"></span>
                            <span className="text-[11px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider font-[family-name:var(--font-inter)]">Model: Walia 4.0</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] rounded-full transition-all">
                            <Bell className="w-5 h-5" />
                        </button>
                        <button onClick={handleLogout} className="p-2.5 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] rounded-full transition-all" title="Logout">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </header>
                
                <main className="flex-1 overflow-y-auto bg-transparent">
                    <div className="max-w-[1600px] mx-auto min-h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
