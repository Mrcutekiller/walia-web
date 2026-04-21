'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Mail, MapPin, MessageSquare, Phone, Send, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const contactInfo = [
    {
        icon: Mail,
        title: 'Email',
        value: 'support@walia.com',
        sub: 'We reply within 24 hours',
        href: 'mailto:support@walia.com',
        color: 'rose'
    },
    {
        icon: Phone,
        title: 'Phone',
        value: '+251 980 140 287',
        sub: 'Mon – Fri, 9am – 6pm EAT',
        href: 'tel:+251980140287',
        color: 'indigo'
    },
    {
        icon: MessageSquare,
        title: 'Telegram',
        value: '@Mrcute_killer',
        sub: 'Quick instant support',
        href: 'https://t.me/Mrcute_killer',
        color: 'sky'
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        await new Promise(r => setTimeout(r, 2000));
        setStatus('sent');
        setTimeout(() => {
            setStatus('idle');
            setForm({ name: '', email: '', subject: '', message: '' });
        }, 4000);
    };

    return (
        <main className="min-h-screen bg-white dark:bg-[#07070F] text-black dark:text-white overflow-hidden">
            <Navbar />

            {/* ── HERO ── */}
            <section className="relative bg-black pt-40 pb-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/3 w-[50%] h-[50%] rounded-full bg-rose-600/10 blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[100px]" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Connect with us
                        </div>
                        <h1 className="text-[clamp(3rem,9vw,6.5rem)] font-black leading-[0.9] tracking-tighter text-white mb-8">
                            Let's Start a<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-violet-400">
                                Conversation.
                            </span>
                        </h1>
                        <p className="text-white/40 text-xl font-medium leading-relaxed max-w-xl mx-auto">
                            Questions, collaboration, or just a virtual coffee? Our team is always ready to talk about the future.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── BODY ── */}
            <section className="py-32 bg-white dark:bg-[#07070F]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-16">

                        {/* LEFT: Cards */}
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="lg:col-span-4 space-y-6"
                        >
                            <h2 className="text-2xl font-black mb-8 tracking-tight">Contact Channels</h2>

                            {contactInfo.map((info, i) => (
                                <motion.a
                                    key={i}
                                    href={info.href}
                                    variants={itemVariants}
                                    className="flex items-center gap-6 p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 hover:shadow-2xl transition-all duration-500 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-black dark:bg-white flex items-center justify-center shrink-0 text-white dark:text-black shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                        <info.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{info.title}</div>
                                        <div className="text-base font-black truncate max-w-[200px]">{info.value}</div>
                                        <div className="text-xs text-gray-400 mt-1">{info.sub}</div>
                                    </div>
                                </motion.a>
                            ))}
                        </motion.div>

                        {/* RIGHT: Form */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-8"
                        >
                            <div className="relative rounded-[3rem] bg-black p-8 md:p-14 border border-white/10 overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[80px] pointer-events-none" />
                                
                                <h2 className="text-3xl font-black text-white mb-10 tracking-tight">Drop us a line</h2>

                                <AnimatePresence mode="wait">
                                    {status === 'sent' ? (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="h-[400px] flex flex-col items-center justify-center text-center space-y-6"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <CheckCircle className="w-10 h-10 text-emerald-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white mb-2">Message Received!</h3>
                                                <p className="text-white/40">We'll get back to you faster than a neural network.</p>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.form 
                                            key="form"
                                            initial={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onSubmit={handleSubmit} 
                                            className="space-y-6 relative z-10"
                                        >
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {['name', 'email'].map((f) => (
                                                    <div key={f} className="space-y-2">
                                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">{f}</label>
                                                        <input
                                                            required
                                                            name={f}
                                                            type={f === 'email' ? 'email' : 'text'}
                                                            placeholder={f === 'name' ? 'Biruk Fikru' : 'biruk@example.com'}
                                                            value={(form as any)[f]}
                                                            onChange={handleChange}
                                                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-white/40 outline-none text-white transition-all text-sm font-bold"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Subject</label>
                                                <select
                                                    name="subject"
                                                    value={form.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-white/40 outline-none text-white transition-all text-sm font-bold appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled className="bg-black">Select purpose…</option>
                                                    {['General Inquiry', 'Technical Support', 'Payment Issue', 'Partnership', 'Feedback'].map(s => (
                                                        <option key={s} value={s} className="bg-black">{s}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Message</label>
                                                <textarea
                                                    required
                                                    name="message"
                                                    rows={6}
                                                    placeholder="How can we help you?"
                                                    value={form.message}
                                                    onChange={handleChange}
                                                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-white/40 outline-none text-white transition-all text-sm font-bold resize-none"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={status === 'sending'}
                                                className="w-full py-5 rounded-2xl bg-white text-black font-black text-base flex items-center justify-center gap-3 hover:bg-white/90 active:scale-[0.99] transition-all disabled:opacity-50"
                                            >
                                                {status === 'sending' ? (
                                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        Send Message
                                                        <Send className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
