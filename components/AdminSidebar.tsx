'use client';

import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
    BarChart3,
    Camera,
    CheckCircle2,
    ChevronRight,
    CreditCard,
    LayoutDashboard,
    MessageSquare,
    Search,
    Settings,
    Users,
    Zap
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Posts', href: '/admin/posts', icon: MessageSquare },
    { name: 'Images', href: '/admin/images', icon: Camera },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Upgrades', href: '/admin/upgrades', icon: Zap },
];

const secondaryLinks = [
    { name: 'Global Settings', href: '/admin/settings', icon: Settings },
    { name: 'Verification', href: '/admin/verify', icon: CheckCircle2 },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const pathname = usePathname();
    const { user } = useAuth();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden overflow-hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 bottom-0 w-[280px] bg-[#0A0A0B] border-r border-white/5 z-50 transition-all duration-500 ease-out transform lg:translate-x-0 outline-none",
                    isOpen ? "translate-x-0 shadow-2xl shadow-black" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header/Logo */}
                    <div className="p-8 pb-10 flex items-center">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative w-10 h-10 rounded-2xl bg-[#141415] border border-white/5 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-walia-success/30">
                                <Image src="/walia-logo.png" alt="Walia" width={28} height={28} unoptimized />
                                <div className="absolute inset-0 bg-walia-success/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-tight leading-none group-hover:text-walia-success transition-colors">Walia</h1>
                                <p className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em] mt-1.5">Admin Panel</p>
                            </div>
                        </Link>
                    </div>

                    {/* Search in Sidebar */}
                    <div className="px-6 mb-8">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-walia-success transition-colors" />
                            <input
                                type="text"
                                placeholder="Search control..."
                                className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:bg-white/10 focus:border-walia-success/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Main Navigation */}
                    <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                        <p className="px-4 text-[10px] font-semibold text-white/20 uppercase tracking-[0.2em] mb-4">Core Controls</p>
                        {adminLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative",
                                        isActive
                                            ? "bg-walia-success text-black shadow-[0_4px_20px_-4px_rgba(46,213,115,0.4)]"
                                            : "text-white/40 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <link.icon className={cn(
                                        "w-[18px] h-[18px] mr-3.5 transition-all duration-300",
                                        isActive ? "text-black scale-110" : "text-white/20 group-hover:text-walia-success group-hover:scale-110"
                                    )} />
                                    <span className="font-semibold text-sm">{link.name}</span>
                                    {isActive && (
                                        <ChevronRight className="ml-auto w-4 h-4 text-black/50" />
                                    )}
                                    {!isActive && (
                                        <div className="absolute right-4 w-1 h-1 rounded-full bg-walia-success opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </Link>
                            );
                        })}

                        <div className="my-8 h-px bg-white/5" />

                        <p className="px-4 text-[10px] font-semibold text-white/20 uppercase tracking-[0.2em] mb-4">Support & Tools</p>
                        {secondaryLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center px-4 py-3 rounded-xl transition-all group",
                                        isActive ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <link.icon className="w-[18px] h-[18px] mr-3.5 text-white/20 group-hover:text-white transition-colors" />
                                    <span className="font-semibold text-sm">{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile Card (Admin) */}
                    <div className="p-4 mt-auto">
                        <div className="flex items-center p-4 rounded-2xl bg-[#141415] border border-white/5">
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-walia-success to-emerald-400 p-[1px] mr-3.5">
                                <div className="w-full h-full rounded-[10px] bg-black flex items-center justify-center overflow-hidden">
                                    <BarChart3 className="w-5 h-5 text-walia-success" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-walia-success border-2 border-[#141415] rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <p className="text-xs font-bold text-white truncate">{user?.displayName || 'Administrator'}</p>
                                <p className="text-[10px] text-white/30 truncate mt-0.5 font-medium">{user?.email}</p>
                            </div>
                            <button className="p-1.5 text-white/20 hover:text-white transition-colors">
                                <Settings className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
