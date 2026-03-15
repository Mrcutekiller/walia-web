'use client';

import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { ArrowRight, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
                scrolled
                    ? "bg-white/90 dark:bg-[#0A0A18]/90 backdrop-blur-2xl border-gray-200 dark:border-white/10 shadow-[0_1px_20px_rgba(0,0,0,0.06)]"
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-[#0A0A18]/90 border border-white/20 dark:border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:scale-110 group-hover:shadow-md">
                        <Image src="/walia-logo.png" alt="Walia" width={32} height={32} unoptimized className="object-contain" />
                    </div>
                    <span className={cn("text-2xl font-black tracking-tighter transition-colors", scrolled ? 'text-black dark:text-white' : 'text-white')}>Walia</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                                scrolled
                                    ? 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className={cn("h-5 w-px mx-3", scrolled ? 'bg-gray-200 dark:bg-white/20' : 'bg-white/20')} />

                    {user ? (
                        <Link
                            href="/dashboard"
                            className="px-6 py-2.5 rounded-xl bg-white dark:bg-black text-black dark:text-white text-sm font-bold hover:bg-white/90 dark:hover:bg-white/10 transition-all shadow-lg flex items-center"
                        >
                            Dashboard
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className={cn(
                                "px-4 py-2.5 text-sm font-bold transition-colors rounded-xl",
                                scrolled ? 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
                            )}>
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="px-6 py-2.5 rounded-xl bg-white dark:bg-black text-black dark:text-white text-sm font-bold hover:bg-white/90 dark:hover:bg-white/10 transition-all shadow-lg"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-walia-text p-2" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "fixed inset-0 top-[73px] bg-white/98 dark:bg-[#0A0A18]/98 backdrop-blur-2xl z-40 md:hidden transition-all duration-400",
                    isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                )}
            >
                <div className="flex flex-col items-center justify-center h-full space-y-6 p-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-2xl font-bold text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="w-20 h-px bg-gray-200 dark:bg-white/10" />
                    {user ? (
                        <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="w-full text-center py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold shadow-lg"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" onClick={() => setIsOpen(false)} className="text-xl font-bold text-black dark:text-white">Log In</Link>
                            <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full text-center py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold shadow-lg">
                                Get Started Free
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
