'use client';

import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { ArrowRight, LayoutDashboard, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Download', href: '/download' },
    { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user } = useAuth();
    const pathname = usePathname();

    // Determine if we're on a page with a dark hero (home, about, download, contact)
    const isDarkHeroPage = ['/', '/about', '/download', '/contact', '/pricing', '/features'].includes(pathname);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setIsOpen(false); }, [pathname]);

    const isActive = (href: string) => pathname === href;

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                    scrolled || !isDarkHeroPage
                        ? "bg-white/95 dark:bg-[#07070F]/95 backdrop-blur-2xl border-b border-gray-200/80 dark:border-white/8 shadow-[0_2px_30px_rgba(0,0,0,0.08)]"
                        : "bg-transparent border-b border-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">

                    {/* ── Logo ── */}
                    <Link href="/" className="flex items-center gap-3 group shrink-0">
                        {/* Enlarged container to prevent logo clipping */}
                        <div className="w-11 h-11 rounded-2xl bg-white/5 dark:bg-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110">
                            <Image
                                src="/walia-logo.png"
                                alt="Walia"
                                width={32}
                                height={32}
                                unoptimized
                                className="object-contain w-[26px] h-[26px]"
                            />
                        </div>
                        <span className={cn(
                            "text-2xl font-black tracking-tight transition-colors duration-300",
                            scrolled || !isDarkHeroPage ? 'text-black dark:text-white' : 'text-white'
                        )}>
                            Walia
                        </span>
                    </Link>

                    {/* ── Desktop Nav ── */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200",
                                    isActive(link.href)
                                        ? scrolled || !isDarkHeroPage
                                            ? 'text-black dark:text-white bg-black/6 dark:bg-white/10'
                                            : 'text-white bg-white/15'
                                        : scrolled || !isDarkHeroPage
                                            ? 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                                            : 'text-white/65 hover:text-white hover:bg-white/12'
                                )}
                            >
                                {link.name}
                                {isActive(link.href) && (
                                    <span className={cn(
                                        "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                                        scrolled || !isDarkHeroPage ? 'bg-black dark:bg-white' : 'bg-white'
                                    )} />
                                )}
                            </Link>
                        ))}

                        <div className={cn("h-5 w-px mx-2", scrolled || !isDarkHeroPage ? 'bg-gray-200 dark:bg-white/15' : 'bg-white/20')} />

                        {user ? (
                            <Link
                                href="/dashboard/ai"
                                className={cn(
                                    "px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-200",
                                    scrolled || !isDarkHeroPage
                                        ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/85 dark:hover:bg-gray-100 shadow-lg shadow-black/20'
                                        : 'bg-white text-black hover:bg-white/90 shadow-lg'
                                )}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={cn(
                                        "px-4 py-2 text-sm font-bold transition-colors rounded-xl",
                                        scrolled || !isDarkHeroPage
                                            ? 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                                            : 'text-white/75 hover:text-white hover:bg-white/12'
                                    )}
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/signup"
                                    className={cn(
                                        "px-5 py-2 rounded-xl text-sm font-black flex items-center gap-2 transition-all duration-200 shadow-lg",
                                        scrolled || !isDarkHeroPage
                                            ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/85 dark:hover:bg-gray-100 shadow-black/20'
                                            : 'bg-white text-black hover:bg-white/90'
                                    )}
                                >
                                    Get Started
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* ── Mobile Toggle ── */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                            scrolled || !isDarkHeroPage
                                ? 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                                : 'text-white hover:bg-white/15'
                        )}
                        aria-label="Toggle menu"
                    >
                        <div className="relative w-5 h-5">
                            <Menu className={cn("absolute inset-0 transition-all duration-200", isOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100')} />
                            <X className={cn("absolute inset-0 transition-all duration-200", isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50')} />
                        </div>
                    </button>
                </div>
            </nav>

            {/* ── Mobile Menu Overlay ── */}
            <div
                className={cn(
                    "fixed inset-0 z-40 md:hidden transition-all duration-400",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />

                {/* Slide-in panel */}
                <div className={cn(
                    "absolute top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white dark:bg-[#0D0D1A] shadow-2xl transition-transform duration-400",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}>
                    {/* Panel header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/10">
                        <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-[8px] bg-white border border-black/10 flex items-center justify-center overflow-hidden shadow-sm">
                                <Image src="/walia-logo.png" alt="Walia" width={20} height={20} unoptimized className="object-contain w-5 h-5" />
                            </div>
                            <span className="font-black text-lg text-black dark:text-white tracking-widest uppercase">Walia</span>
                        </Link>
                        <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Nav links */}
                    <div className="flex flex-col p-5 gap-1">
                        {navLinks.map((link, i) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                style={{ transitionDelay: isOpen ? `${i * 60}ms` : '0ms' }}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-base transition-all",
                                    isActive(link.href)
                                        ? 'bg-black dark:bg-white text-white dark:text-black'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'
                                )}
                            >
                                {link.name}
                                {isActive(link.href) && <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Current</span>}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile CTA */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100 dark:border-white/10 space-y-3">
                        {user ? (
                            <Link
                                href="/dashboard/ai"
                                onClick={() => setIsOpen(false)}
                                className="w-full py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black flex items-center justify-center gap-2 text-sm shadow-lg"
                            >
                                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black flex items-center justify-center gap-2 text-sm shadow-lg">
                                    Get Started Free <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 text-black dark:text-white font-bold text-sm text-center block hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    Log In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
