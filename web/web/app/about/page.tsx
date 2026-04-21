'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Globe, Rocket, Shield, Target, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const stats = [
    { label: 'Active Learners', value: '50K+', icon: Users, color: 'from-violet-500 to-purple-600' },
    { label: 'Study Sessions', value: '2M+', icon: Zap, color: 'from-amber-400 to-orange-500' },
    { label: 'Countries', value: '45+', icon: Globe, color: 'from-emerald-400 to-teal-500' },
    { label: 'Uptime', value: '99.9%', icon: Shield, color: 'from-sky-400 to-blue-500' },
];

const values = [
    {
        icon: Rocket,
        title: 'Empower Learners',
        desc: 'Breaking down complex subjects into digestible, AI-powered study sessions — structured beautifully and accessible from everywhere in the world.',
        dark: false,
    },
    {
        icon: Target,
        title: 'Future of Education',
        desc: 'Creating a unified ecosystem where artificial intelligence seamlessly connects with human curiosity, paving the best paths for ultimate understanding.',
        dark: true,
    },
];

function useCountUp(target: string, duration = 2000) {
    const [count, setCount] = useState('0');
    const ref = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const num = parseFloat(target.replace(/[^0-9.]/g, ''));
                const suffix = target.replace(/[0-9.]/g, '');
                const frames = Math.round(duration / 16);
                let frame = 0;
                const timer = setInterval(() => {
                    frame++;
                    const progress = frame / frames;
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.round(eased * num) + suffix);
                    if (frame >= frames) clearInterval(timer);
                }, 16);
            }
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return { count, ref };
}

function StatCard({ stat, i }: { stat: typeof stats[0], i: number }) {
    const { count, ref } = useCountUp(stat.value);
    return (
        <div
            ref={ref}
            className="relative group p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
            style={{ animationDelay: `${i * 120}ms` }}
        >
            <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
            <div className={`w-12 h-12 mb-6 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-4xl font-black tracking-tighter text-black dark:text-white mb-1">{count}</div>
            <div className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</div>
        </div>
    );
}

export default function AboutPage() {
    const heroRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Intersection observer for scroll reveals
    useEffect(() => {
        const els = document.querySelectorAll('.reveal-el');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).style.opacity = '1'; (e.target as HTMLElement).style.transform = 'translateY(0)'; } });
        }, { threshold: 0.15 });
        els.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <main className="min-h-screen bg-white dark:bg-[#07070F] overflow-hidden text-black dark:text-white">
            <Navbar />

            {/* ── HERO ── */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center bg-[#07070F] overflow-hidden">
                {/* Animated gradient orbs */}
                <div
                    className="absolute w-[700px] h-[700px] rounded-full bg-gradient-to-br from-violet-600/20 to-purple-900/20 blur-[120px] pointer-events-none transition-transform duration-700"
                    style={{ transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)`, top: '5%', left: '10%' }}
                />
                <div
                    className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-600/15 to-cyan-900/15 blur-[100px] pointer-events-none transition-transform duration-1000"
                    style={{ transform: `translate(${-mousePos.x * 30}px, ${-mousePos.y * 30}px)`, bottom: '10%', right: '15%' }}
                />

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                <div className="relative z-10 text-center max-w-5xl mx-auto px-6 pt-24 pb-20">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/8 border border-white/15 text-white/60 text-xs font-bold uppercase tracking-widest mb-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Our Story
                    </div>

                    <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-black leading-[0.9] tracking-tighter text-white mb-8">
                        Built to{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">
                            Elevate
                        </span>
                        <br />Every Mind.
                    </h1>

                    <p className="text-white/45 text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-12">
                        Walia is an advanced AI-powered platform designed to provide students and researchers with tools that scale understanding, spark curiosity, and build community across 45+ countries.
                    </p>

                    {/* Scroll indicator */}
                    <div className="flex flex-col items-center gap-2 text-white/25 text-xs font-bold uppercase tracking-widest">
                        <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/20" />
                        Scroll to explore
                    </div>
                </div>
            </section>

            {/* ── STATS ── */}
            <section className="py-28 bg-gray-50 dark:bg-[#0A0A18] border-y border-gray-100 dark:border-white/8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">By the numbers</span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-3 text-black dark:text-white">Impact at Scale</h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, i) => <StatCard key={i} stat={stat} i={i} />)}
                    </div>
                </div>
            </section>

            {/* ── MISSION & VISION ── */}
            <section className="py-28 bg-white dark:bg-[#07070F]">
                <div className="max-w-6xl mx-auto px-6">
                    <div
                        className="reveal-el"
                        style={{ opacity: 0, transform: 'translateY(40px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}
                    >
                        <span className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">What drives us</span>
                        <h2 className="text-5xl md:text-6xl font-black tracking-tight mt-3 mb-16 text-black dark:text-white">Mission &amp; Vision</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {values.map((v, i) => (
                            <div
                                key={i}
                                className="reveal-el group relative rounded-[32px] p-10 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                                style={{
                                    opacity: 0,
                                    transform: 'translateY(40px)',
                                    transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 150}ms`,
                                    background: v.dark ? '#000' : undefined,
                                    border: v.dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                                    backgroundColor: !v.dark ? 'rgb(249,249,252)' : undefined,
                                }}
                            >
                                {v.dark && (
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-violet-500/20 to-transparent rounded-full blur-[60px]" />
                                )}
                                <div className={`w-14 h-14 rounded-2xl mb-8 flex items-center justify-center ${v.dark ? 'bg-white/10 text-white' : 'bg-black text-white'}`}>
                                    <v.icon className="w-6 h-6" />
                                </div>
                                <h3 className={`text-3xl font-black mb-4 ${v.dark ? 'text-white' : 'text-black'}`}>{v.title}</h3>
                                <p className={`text-lg leading-relaxed ${v.dark ? 'text-white/45' : 'text-gray-500'}`}>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOUNDER ── */}
            <section className="py-28 bg-gray-50 dark:bg-[#0A0A18] border-t border-gray-100 dark:border-white/8">
                <div className="max-w-6xl mx-auto px-6">
                    <div
                        className="reveal-el flex flex-col md:flex-row items-center gap-16"
                        style={{ opacity: 0, transform: 'translateY(40px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)' }}
                    >
                        {/* Photo */}
                        <div className="relative shrink-0">
                            <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden bg-gray-200 dark:bg-white/10 shadow-2xl">
                                <Image
                                    src="/biruk-founder.png"
                                    alt="Biruk Fikru – Founder"
                                    width={320}
                                    height={320}
                                    className="object-cover w-full h-full"
                                    unoptimized
                                />
                            </div>
                            {/* Badge */}
                            <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-xs font-black shadow-xl">
                                Founder & CEO
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-6">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">The person behind Walia</span>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white">Biruk Fikru</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-lg">
                                A 2nd-year Computer Science student from Ethiopia with a passion for AI and education. Biruk built Walia to bridge the gap between cutting-edge technology and students who need it most — starting from Addis Ababa, reaching 45+ countries.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {['AI Developer', 'CS Student', 'Entrepreneur', 'From Ethiopia 🇪🇹'].map(tag => (
                                    <span key={tag} className="px-4 py-2 rounded-full bg-black/7 dark:bg-white/8 border border-black/8 dark:border-white/12 text-xs font-bold text-gray-700 dark:text-gray-300">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
