'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Globe, Rocket, Shield, Target, Users, Zap, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';

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
        color: 'rose',
    },
    {
        icon: Target,
        title: 'Future of Education',
        desc: 'Creating a unified ecosystem where artificial intelligence seamlessly connects with human curiosity, paving the best paths for ultimate understanding.',
        color: 'indigo',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
};

export default function AboutPage() {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <main className="min-h-screen bg-white dark:bg-[#07070F] overflow-hidden text-black dark:text-white">
            <Navbar />

            {/* ── HERO SECTION ── */}
            <section ref={targetRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
                {/* Background Video or Animated Orbs */}
                <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[100px]" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                </motion.div>

                <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Our Journey & Vision
                        </div>

                        <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-[ -0.05em] text-white mb-8">
                            Empowering Minds<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400">
                                Beyond Borders
                            </span>
                        </h1>

                        <p className="text-white/40 text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-12">
                            Walia is an advanced AI ecosystem built to bridge the gap between complex knowledge and student success. Based in Addis Ababa, scaling globally.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">Discover More</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
                </motion.div>
            </section>

            {/* ── STATS SECTION ── */}
            <section className="relative py-32 bg-white dark:bg-[#07070F] z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className="group relative p-8 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-violet-500/30 transition-all duration-500 overflow-hidden"
                            >
                                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${stat.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`} />
                                <div className={`w-12 h-12 mb-6 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-4xl font-black tracking-tighter text-black dark:text-white mb-2">{stat.value}</div>
                                <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── MISSION & VISION ── */}
            <section className="py-32 border-y border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-xs font-black text-violet-500 uppercase tracking-[0.3em]">Core Principles</span>
                            <h2 className="text-5xl font-black tracking-tighter mt-4 mb-6 leading-none">The Future of <br/>Integrated Learning</h2>
                            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg mb-10">
                                We believe education should be accessible, intelligent, and deeply personal. Walia uses cutting-edge AI to adapt to your unique learning style, ensuring you master every subject with confidence.
                            </p>
                            <div className="space-y-4">
                                {values.map((v, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10 group">
                                        <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shrink-0">
                                            <v.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg mb-1">{v.title}</h4>
                                            <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative aspect-square rounded-[3rem] bg-gradient-to-br from-violet-600 to-indigo-700 overflow-hidden shadow-2xl group"
                        >
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40 group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-10 left-10 right-10">
                                <div className="text-white text-2xl font-black leading-tight italic">
                                    "Technology without empathy is just code. We build with heart."
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── FOUNDER SECTION ── */}
            <section className="py-32">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-black text-white rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-600/10 via-transparent to-emerald-500/5 pointer-events-none" />

                        <div className="relative shrink-0">
                            <div className="w-48 h-48 md:w-64 md:h-64 rounded-[2rem] overflow-hidden border-2 border-white/10 group">
                                <Image
                                    src="/biruk-founder.png"
                                    alt="Biruk Fikru - Founder"
                                    width={256}
                                    height={256}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                    unoptimized
                                />
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                                Founder & CEO
                            </div>
                        </div>

                        <div className="relative z-10 flex-1 space-y-6">
                            <div>
                                <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.4em]">Visionary</span>
                                <h3 className="text-4xl font-black mt-2">Biruk Fikru</h3>
                            </div>
                            <p className="text-white/50 text-base leading-relaxed">
                                A computer science visionary from Ethiopia, Biruk founded Walia with a simple goal: making high-level academic intelligence accessible to everyone. Today, Walia is a growing ecosystem that empowers thousands of students daily.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <a href="https://t.me/Mrcute_killer" className="flex items-center gap-2 text-xs font-bold text-white hover:text-violet-400 transition-colors">
                                    <ExternalLink className="w-3.5 h-3.5" /> Follow the Journey
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
