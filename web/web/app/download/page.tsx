'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { CheckCircle, ChevronRight, Download, Shield, Smartphone, Star, Zap } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const features = [
    { icon: Zap, title: 'AI-Powered', desc: 'Study with advanced AI at your fingertips' },
    { icon: Shield, title: 'Secure & Private', desc: 'End-to-end encrypted, your data stays yours' },
    { icon: Star, title: '4.9★ Rated', desc: 'Loved by 50K+ students worldwide' },
];

const steps = [
    { step: '01', title: 'Download the APK', desc: 'Click the button below to download the latest Walia APK file directly to your Android device.' },
    { step: '02', title: 'Enable Unknown Sources', desc: 'Go to Settings → Security → enable "Install from Unknown Sources" on your device.' },
    { step: '03', title: 'Install & Launch', desc: 'Open the downloaded APK file, follow the installer, then launch Walia and sign in.' },
];

export default function DownloadPage() {
    const [downloaded, setDownloaded] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const phoneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!phoneRef.current) return;
            const rect = phoneRef.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            setMousePos({
                x: ((e.clientX - cx) / rect.width) * 15,
                y: ((e.clientY - cy) / rect.height) * -15,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Reveal on scroll
    useEffect(() => {
        const els = document.querySelectorAll('.reveal-dl');
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    (e.target as HTMLElement).style.opacity = '1';
                    (e.target as HTMLElement).style.transform = 'translateY(0) scale(1)';
                }
            });
        }, { threshold: 0.15 });
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return (
        <main className="min-h-screen bg-white dark:bg-[#07070F] overflow-hidden text-black dark:text-white">
            <Navbar />

            {/* ── HERO ── */}
            <section className="relative min-h-screen bg-[#07070F] flex items-center overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/20 to-violet-900/10 blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-emerald-600/15 to-teal-900/10 blur-[100px]" />
                    {/* Grid */}
                    <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-20 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 w-full">

                    {/* LEFT: Copy */}
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/60 text-xs font-black uppercase tracking-widest">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            Version 1.0 — Now Available
                        </div>

                        <h1 className="text-[clamp(3rem,8vw,6.5rem)] font-black leading-[0.9] tracking-tighter text-white">
                            Take Walia<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                                Everywhere.
                            </span>
                        </h1>

                        <p className="text-white/45 text-xl font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                            Your smartest AI study companion is now available on Android. Analyze texts, generate study tools, and track your calendar — all in your pocket.
                        </p>

                        {/* Feature pills */}
                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                            {features.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/6 border border-white/10 text-sm">
                                    <f.icon className="w-4 h-4 text-emerald-400" />
                                    <span className="text-white/70 font-bold">{f.title}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                            <a
                                href="/app-release.apk"
                                download="Walia-Release.apk"
                                onClick={() => setDownloaded(true)}
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-black text-base shadow-2xl hover:bg-white/92 active:scale-[0.98] transition-all duration-200 overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                {downloaded ? (
                                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                ) : (
                                    <Download className="w-5 h-5 shrink-0 group-hover:-translate-y-0.5 transition-transform" />
                                )}
                                {downloaded ? 'Downloading…' : 'Download APK'}
                                <ChevronRight className="w-4 h-4 opacity-40 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                            <div className="flex flex-col justify-center text-center lg:text-left">
                                <span className="text-white/25 text-[10px] font-black uppercase tracking-[0.2em]">Android 8.0+ · ~45 MB · Free</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: 3D Phone */}
                    <div className="flex-shrink-0 flex justify-center items-center">
                        <div
                            ref={phoneRef}
                            className="transition-transform duration-300 ease-out"
                            style={{ transform: `perspective(1200px) rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)` }}
                        >
                            {/* Phone bezel */}
                            <div className="relative w-[280px] h-[580px] rounded-[44px] bg-gradient-to-b from-gray-700 to-gray-900 p-[3px] shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
                                <div className="w-full h-full rounded-[42px] bg-gradient-to-b from-[#111] to-[#1a1a1a] overflow-hidden relative border border-white/8">
                                    {/* Dynamic island */}
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-gray-700" />
                                    </div>

                                    {/* Screen content */}
                                    <div className="absolute inset-0 flex flex-col pt-16 p-5">
                                        {/* App header */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                                                <Image src="/walia-logo.png" alt="" width={24} height={24} unoptimized className="object-contain w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-white text-sm font-black">Walia AI</div>
                                                <div className="text-white/40 text-[10px]">Study Companion</div>
                                            </div>
                                            <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        </div>

                                        {/* Chat mockup */}
                                        <div className="space-y-3 flex-1">
                                            {/* AI bubble */}
                                            <div className="flex gap-2">
                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">W</div>
                                                <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                                                    <div className="text-white/80 text-xs leading-relaxed">Hey! How can I help you study today? 📚</div>
                                                </div>
                                            </div>
                                            {/* User bubble */}
                                            <div className="flex justify-end">
                                                <div className="bg-white text-black rounded-2xl rounded-tr-none p-3 max-w-[80%]">
                                                    <div className="text-black text-xs leading-relaxed">Explain photosynthesis simply</div>
                                                </div>
                                            </div>
                                            {/* AI response */}
                                            <div className="flex gap-2">
                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">W</div>
                                                <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 max-w-[80%] space-y-1">
                                                    <div className="text-white/80 text-xs leading-relaxed">Photosynthesis is how plants make food using sunlight ☀️</div>
                                                    <div className="flex gap-1 mt-1">
                                                        {['Formula', 'Quiz me', 'Diagram'].map(t => (
                                                            <span key={t} className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-[9px] font-bold">{t}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Typing indicator */}
                                            <div className="flex gap-2 items-end">
                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">W</div>
                                                <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center">
                                                    {[0, 1, 2].map(i => (
                                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Input bar */}
                                        <div className="mt-4 flex items-center gap-2 bg-white/8 rounded-2xl px-4 py-3 border border-white/10">
                                            <span className="text-white/25 text-xs font-medium flex-1">Ask anything…</span>
                                            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
                                                <ChevronRight className="w-4 h-4 text-black" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Side buttons */}
                                <div className="absolute right-[-4px] top-24 w-1 h-12 bg-gray-600 rounded-r-full" />
                                <div className="absolute left-[-4px] top-24 w-1 h-8 bg-gray-600 rounded-l-full" />
                                <div className="absolute left-[-4px] top-36 w-1 h-8 bg-gray-600 rounded-l-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HOW TO INSTALL ── */}
            <section className="py-28 bg-white dark:bg-[#0A0A18]">
                <div className="max-w-6xl mx-auto px-6">
                    <div
                        className="reveal-dl text-center mb-16"
                        style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}
                    >
                        <span className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">Installation guide</span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-3 text-black dark:text-white">3 Steps to Get Started</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {steps.map((s, i) => (
                            <div
                                key={i}
                                className="reveal-dl relative p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-400 hover:-translate-y-1 group"
                                style={{ opacity: 0, transform: 'translateY(30px) scale(0.97)', transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms` }}
                            >
                                <div className="text-[5rem] font-black leading-none text-gray-100 dark:text-white/5 absolute top-6 right-6 select-none">{s.step}</div>
                                <div className="relative z-10">
                                    <div className="text-5xl font-black text-black dark:text-white mb-4 tabular-nums">{s.step}</div>
                                    <h3 className="text-xl font-black text-black dark:text-white mb-3">{s.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-16 text-center">
                        <a
                            href="/app-release.apk"
                            download="Walia-Release.apk"
                            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-lg shadow-2xl hover:bg-black/85 dark:hover:bg-gray-100 active:scale-[0.98] transition-all duration-200"
                        >
                            <Download className="w-6 h-6" />
                            Download Walia APK
                        </a>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-4">Free · No subscriptions · Android 8.0+</p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
