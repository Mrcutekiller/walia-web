'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TiltCard from '@/components/TiltCard';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import React, { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSent(false), 3000);
    };

    return (
        <main className="min-h-screen bg-white dark:bg-[#0A0A18] text-black dark:text-white overflow-hidden">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-6 md:px-12 relative z-10">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Header */}
                    <div className="text-center mb-20">
                        <motion.h1 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter mb-4"
                        >
                            Get in Touch
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-500 font-medium text-lg md:text-2xl"
                        >
                            Have a question or feedback? We're here to help.
                        </motion.p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        
                        {/* 3D Contact Cards */}
                        <div className="space-y-6">
                            {[
                                { title: 'Email', val: 'support@walia.com', icon: Mail, delay: 0 },
                                { title: 'Phone', val: '+251 900 000 000', icon: Phone, delay: 0.1 },
                                { title: 'Headquarters', val: 'Addis Ababa, Ethiopia', icon: MapPin, delay: 0.2 },
                            ].map((info, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 + info.delay }}
                                >
                                    <TiltCard>
                                        <div className="flex items-center gap-6 p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all cursor-pointer group backdrop-blur-sm">
                                            <div className="w-16 h-16 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shrink-0 shadow-lg transform group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                                                <info.icon className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{info.title}</p>
                                                <p className="text-xl font-bold">{info.val}</p>
                                            </div>
                                        </div>
                                    </TiltCard>
                                </motion.div>
                            ))}
                        </div>

                        {/* Interactive Form */}
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <div className="p-10 rounded-[40px] bg-black dark:bg-white/5 border border-black dark:border-white/10 shadow-2xl relative overflow-hidden text-white dark:text-white">
                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 dark:bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32 opacity-50" />
                                
                                <h2 className="text-3xl font-black mb-8 relative z-10">Send a message</h2>
                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-white transition-colors">Name</label>
                                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                                            className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:border-white outline-none font-medium text-white placeholder:text-gray-500 transition-all focus:bg-white/20" 
                                            placeholder="Your Name" />
                                    </div>
                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-white transition-colors">Email</label>
                                        <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                                            className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:border-white outline-none font-medium text-white placeholder:text-gray-500 transition-all focus:bg-white/20" 
                                            placeholder="you@example.com" />
                                    </div>
                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-white transition-colors">Message</label>
                                        <textarea required rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} 
                                            className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:border-white outline-none font-medium text-white placeholder:text-gray-500 transition-all focus:bg-white/20 resize-none" 
                                            placeholder="How can we help you climb higher?" />
                                    </div>
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit" 
                                        className={`w-full py-5 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2 ${sent ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
                                    >
                                        {sent ? 'Message Transmitted!' : <>Send Message <Send className="w-4 h-4 ml-1" /></>}
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
