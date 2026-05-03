'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Download, Smartphone, Apple, Globe, ShieldCheck, Zap, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DownloadPage() {
    return (
        <div className="bg-white dark:bg-[#07070F] min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-1 flex flex-col">
                {/* ── Hero ── */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute inset-0 bg-black dark:bg-white/[0.02] -z-10" />
                    <div className="container mx-auto px-6 text-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl mx-auto"
                        >
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8">
                                <span className="w-2 h-2 rounded-full bg-green-400 mr-3 animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">v1.0.4 - Latest Release</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-8 uppercase">
                                Walia in your<br /><span className="text-white/30">pocket.</span>
                            </h1>
                            <p className="text-lg text-white/50 mb-12 max-w-xl mx-auto font-medium">
                                Take the power of Walia AI, Community, and Trading tools wherever you go. Experience the world's most premium AI platform on mobile.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ── Download Options ── */}
                <section className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Android */}
                            <motion.div 
                                whileHover={{ y: -10 }}
                                className="p-10 rounded-[3rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex flex-col items-center text-center group"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-all">
                                    <Smartphone className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter mb-4">Android</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-10">Optimized for speed</p>
                                <a 
                                    href="/app-release.apk" 
                                    download 
                                    className="w-full py-5 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
                                >
                                    <Download className="w-5 h-5" /> Download APK
                                </a>
                                <p className="mt-6 text-[10px] text-gray-400 font-bold uppercase">Requires Android 8.0+</p>
                            </motion.div>

                            {/* iOS (Coming Soon) */}
                            <motion.div 
                                whileHover={{ y: -10 }}
                                className="p-10 rounded-[3rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex flex-col items-center text-center relative overflow-hidden"
                            >
                                <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-[8px] font-black uppercase tracking-widest">
                                    Coming Soon
                                </div>
                                <div className="w-20 h-20 rounded-3xl bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-600 flex items-center justify-center mb-8">
                                    <Apple className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-400 dark:text-gray-600 uppercase tracking-tighter mb-4">iOS</h3>
                                <p className="text-xs text-gray-400 dark:text-gray-600 font-bold uppercase tracking-widest mb-10">TestFlight Invite Only</p>
                                <button disabled className="w-full py-5 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 font-black text-sm uppercase tracking-widest cursor-not-allowed">
                                    Join Waitlist
                                </button>
                                <p className="mt-6 text-[10px] text-gray-400 font-bold uppercase">App Store release Q3 2026</p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ── Features ── */}
                <section className="py-32 bg-black">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Why mobile?</h2>
                            <p className="text-white/30 text-xs font-black uppercase tracking-[0.3em]">Built for the move</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                            {[
                                { title: 'Real-time Alerts', desc: 'Get notified of market shifts and community posts instantly.', icon: Zap },
                                { title: 'Secure Access', desc: 'Biometric login and end-to-end encryption for your data.', icon: ShieldCheck },
                                { title: 'Offline Mode', desc: 'Access your notes and calendar even without internet.', icon: Globe },
                            ].map((f, i) => (
                                <div key={i} className="text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                                        <f.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-tight mb-3">{f.title}</h4>
                                    <p className="text-xs text-white/40 leading-relaxed font-medium">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Stats ── */}
                <section className="py-32 bg-white dark:bg-[#07070F]">
                    <div className="container mx-auto px-6 text-center">
                        <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[4rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 relative overflow-hidden">
                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-black/5 dark:bg-white/5 rounded-full blur-3xl" />
                            <div className="relative z-10">
                                <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white tracking-tighter mb-8 uppercase">10,000+</h2>
                                <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500 mb-12">Active mobile users already onboard</p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <div className="flex -space-x-3">
                                        {[1,2,3,4,5].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full bg-black dark:bg-white border-4 border-gray-50 dark:border-[#0D0D1A] flex items-center justify-center text-white dark:text-black text-[10px] font-black uppercase shadow-xl">
                                                {String.fromCharCode(64 + i)}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-black dark:fill-white text-black dark:text-white" />)}
                                        <span className="ml-2 text-xs font-black text-black dark:text-white">4.9/5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
