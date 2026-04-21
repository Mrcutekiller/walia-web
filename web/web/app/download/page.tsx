'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CheckCircle, ChevronRight, Download, Shield, Smartphone, Star, Zap, Apple } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

const features = [
    { icon: Zap, title: 'AI-Powered', desc: 'Study with advanced AI at your fingertips', color: 'emerald' },
    { icon: Shield, title: 'Secure & Private', desc: 'End-to-end encrypted, your data stays yours', color: 'indigo' },
    { icon: Star, title: '4.9★ Rated', desc: 'Loved by 50K+ students worldwide', color: 'amber' },
];

const steps = [
    { step: '01', title: 'Download the APK', desc: 'Click the button below to download the latest Walia APK file directly to your Android device.' },
    { step: '02', title: 'Enable Unknown Sources', desc: 'Go to Settings → Security → enable "Install from Unknown Sources" on your device.' },
    { step: '03', title: 'Install & Launch', desc: 'Open the downloaded APK file, follow the installer, then launch Walia and sign in.' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function DownloadPage() {
    const [downloaded, setDownloaded] = useState(false);
    const phoneRef = useRef<HTMLDivElement>(null);

    return (
        <main className="min-h-screen bg-white dark:bg-[#07070F] overflow-hidden text-black dark:text-white">
            <Navbar />

            {/* ── HERO SECTION ── */}
            <section className="relative min-h-[95vh] bg-black flex items-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-[60%] h-[60%] rounded-full bg-emerald-600/10 blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[100px]" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-20 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 w-full">
                    
                    {/* LEFT: Copy */}
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                Available for Android
                            </div>

                            <h1 className="text-[clamp(3rem,8vw,6rem)] font-black leading-[0.9] tracking-tighter text-white">
                                Take Walia<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                                    Everywhere.
                                </span>
                            </h1>

                            <p className="text-white/40 text-xl font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 mt-8">
                                Experience the future of learning in your pocket. Analyze texts, generate quizzes, and manage your tasks on the go.
                            </p>
                        </motion.div>

                        {/* Feature Pills */}
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-wrap gap-3 justify-center lg:justify-start"
                        >
                            {features.map((f, i) => (
                                <motion.div key={i} variants={itemVariants} className="flex items-center gap-3 px-4 py-2.5 rounded-[1.25rem] bg-white/5 border border-white/10 text-xs font-bold text-white/70">
                                    <f.icon className="w-4 h-4 text-emerald-400" />
                                    {f.title}
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* CTA */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <a
                                href="/app-release.apk"
                                download="Walia-Release.apk"
                                onClick={() => setDownloaded(true)}
                                className="group relative px-8 py-5 rounded-2xl bg-white text-black font-black text-lg shadow-2xl hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 overflow-hidden"
                            >
                                {downloaded ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />}
                                {downloaded ? 'Downloading…' : 'Download APK'}
                            </a>
                            <div className="flex flex-col justify-center text-white/30 text-[10px] font-black uppercase tracking-widest">
                                Android 8.0+ · v1.0.4 · 42MB
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT: High-end Mockup */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50, rotateY: -20 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10"
                    >
                        <div className="relative w-[300px] h-[600px] rounded-[3.5rem] bg-gray-800 p-1.5 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/20 overflow-hidden">
                            <div className="absolute inset-0 bg-[#0A0A0F]" />
                            {/* Screen Content Mockup */}
                            <div className="relative h-full w-full rounded-[3rem] overflow-hidden flex flex-col p-6">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-full z-20" />
                                
                                <div className="mt-12 flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center">
                                        <Image src="/walia-logo.png" alt="" width={32} height={32} unoptimized className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <div className="text-white font-black text-lg">Walia AI</div>
                                        <div className="text-white/30 text-[10px] uppercase">Active Session</div>
                                    </div>
                                </div>

                                <div className="mt-10 space-y-4">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white/50 text-xs leading-relaxed">
                                        "Hey Biruk! I've analyzed your notes on 'Quantum Physics'. Ready for a quiz?"
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="bg-white rounded-2xl p-4 text-black text-xs font-bold w-[80%] shadow-lg">
                                            Yes, simplify the first chapter please!
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto mb-4 bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/10">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-white/20 text-[10px] font-bold uppercase">AI is analyzing…</span>
                                </div>
                            </div>
                        </div>
                        {/* iOS Disclaimer */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="absolute -bottom-10 left-10 right-10 flex items-center justify-center gap-2 text-white/20 text-[10px] uppercase font-black tracking-widest"
                        >
                            <Apple className="w-3.5 h-3.5" /> iOS Version Coming Soon
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── INSTALLATION STEPS SECTION ── */}
            <section className="py-32 bg-white dark:bg-[#07070F] relative">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <span className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em]">Quick Setup</span>
                        <h2 className="text-5xl font-black tracking-tighter mt-4">Simple Installation</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((s, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="group p-10 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-emerald-500/30 transition-all duration-500"
                            >
                                <div className="text-6xl font-black text-emerald-500/20 group-hover:text-emerald-500 transition-colors mb-6 tabular-nums">{s.step}</div>
                                <h3 className="text-2xl font-black mb-4">{s.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
