'use client';

import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
    Calendar as CalendarIcon,
    MessageSquare,
    Settings,
    Sparkles,
    User,
    Users,
    Wrench,
    X,
    Zap
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarLinks = [
    { name: 'AI Hub', href: '/dashboard/ai', icon: Sparkles },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Tools', href: '/dashboard/tools', icon: Wrench },
    { name: 'Community', href: '/dashboard/community', icon: Users },
    { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const pathname = usePathname();
    const { user, profile } = useAuth();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 bottom-0 w-72 bg-black border-r border-white/5 z-50 transition-all duration-300 transform lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-8 flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden transition-all group-hover:scale-110 p-1.5 shadow-lg shadow-white/5">
                                <Image src="/walia-logo.png" alt="Walia" width={28} height={28} unoptimized />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter">Walia</span>
                        </Link>
                        <button className="lg:hidden p-2 text-white/40 hover:text-white" onClick={onClose}>
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
                        <p className="px-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Main Menu</p>
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                    className={cn(
                                        "flex items-center px-4 py-4 rounded-2xl transition-all group",
                                        isActive
                                            ? "bg-walia-primary/10 text-walia-primary shadow-sm"
                                            : "text-white/40 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <link.icon className={cn(
                                        "w-5 h-5 mr-4 transition-transform group-hover:scale-110",
                                        isActive ? "text-walia-primary" : "text-white/30 group-hover:text-white"
                                    )} />
                                    <span className="font-bold text-sm">{link.name}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-walia-primary shadow-[0_0_10px_rgba(108,99,255,0.6)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Card */}
                    <div className="p-4 border-t border-white/5">
                        <Link
                            href="/dashboard/upgrade"
                            className="block p-6 rounded-3xl bg-gradient-to-br from-walia-primary to-walia-secondary group relative overflow-hidden transition-all hover:scale-[1.02]"
                        >
                            {/* Glow effect */}
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/20 rounded-full blur-2xl transition-transform group-hover:scale-150" />

                            <div className="relative z-10 flex flex-col space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Zap className="w-5 h-5 text-white" />
                                    <span className="text-white font-black text-sm uppercase tracking-widest">Walia Pro</span>
                                </div>
                                <p className="text-white/80 text-xs leading-relaxed">
                                    Unlock unlimited AI-powered study sessions and features.
                                </p>
                                <div className="w-full py-2 bg-white text-walia-primary rounded-xl text-[10px] font-black uppercase text-center tracking-widest transition-colors group-hover:bg-white/90">
                                    Upgrade Now
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* User Section */}
                    <div className="p-4 pb-8 space-y-4">
                        <div className="flex items-center p-4 rounded-2xl bg-white/5 border border-white/5 border-transparent hover:border-white/10 transition-all">
                            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mr-4 overflow-hidden relative shrink-0">
                                {profile?.photoURL ? (
                                    <Image src={profile.photoURL} alt={profile.name || 'User'} fill className="object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-white/40" />
                                )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{profile?.name || user?.displayName || 'User'}</p>
                                <p className="text-[10px] text-white/30 truncate font-black uppercase tracking-widest">
                                    @{profile?.username || 'walia_user'}
                                </p>
                            </div>
                            <Link href="/dashboard/settings">
                                <Settings className="w-5 h-5 text-white/20 hover:text-white transition-colors" />
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
