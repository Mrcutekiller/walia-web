'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, LayoutDashboard, Users, CreditCard, MessageSquare, Bell, Settings, LogOut, HeartHandshake } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const ADMIN_NAV = [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Payments', href: '/dashboard/admin/payments', icon: CreditCard },
    { label: 'Content', href: '/dashboard/admin/content', icon: MessageSquare },
    { label: 'Notifications', href: '/dashboard/admin/notifications', icon: Bell },
    { label: 'Support Chat', href: '/dashboard/admin/support', icon: HeartHandshake },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!user || user.email?.toLowerCase() !== 'admin@walia.com' || !profile?.isAdmin) {
                router.replace('/dashboard');
            }
        }
    }, [user, profile, loading, router]);

    if (loading || !user || !profile?.isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A101D]">
                <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#FAFAFA] dark:bg-[#0A101D] text-black dark:text-white overflow-hidden">
            {/* Admin Sidebar */}
            <aside className="w-64 border-r border-gray-200 dark:border-white/5 bg-white dark:bg-[#162032] flex flex-col pt-6 z-20 shadow-sm relative shrink-0">
                <div className="px-6 mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h1 className="font-black text-sm uppercase tracking-widest text-black dark:text-white">Admin Panel</h1>
                        <p className="text-[9px] font-bold text-gray-400">Superuser Access</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {ADMIN_NAV.map((nav) => {
                        const Icon = nav.icon;
                        const active = pathname === nav.href;
                        return (
                            <Link 
                                key={nav.href} 
                                href={nav.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm",
                                    active 
                                        ? "bg-black dark:bg-white text-white dark:text-black shadow-lg" 
                                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {nav.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-white/5">
                    <Link 
                        href="/dashboard"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm text-gray-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500"
                    >
                        <LogOut className="w-4 h-4" />
                        Exit Admin
                    </Link>
                </div>
            </aside>

            {/* Main Admin Content */}
            <main className="flex-1 min-w-0 overflow-y-auto custom-scrollbar relative">
                {children}
            </main>
        </div>
    );
}
