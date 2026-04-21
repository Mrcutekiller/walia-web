'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { AlertCircle, CheckCircle, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import { useState } from 'react';

const contactInfo = [
    {
        icon: Mail,
        title: 'Email',
        value: 'support@walia.com',
        sub: 'We reply within 24 hours',
        href: 'mailto:support@walia.com',
    },
    {
        icon: Phone,
        title: 'Phone',
        value: '+251 900 000 000',
        sub: 'Mon – Fri, 9am – 6pm EAT',
        href: 'tel:+251900000000',
    },
    {
        icon: MapPin,
        title: 'Headquarters',
        value: 'Addis Ababa, Ethiopia',
        sub: 'East Africa Hub',
        href: 'https://maps.google.com/?q=Addis+Ababa',
    },
];

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate sending
        await new Promise(r => setTimeout(r, 1500));
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
            <section className="relative bg-[#07070F] pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-600/15 to-pink-900/10 blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-violet-600/10 to-indigo-900/5 blur-[100px]" />
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/55 text-xs font-black uppercase tracking-widest mb-8">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Get in Touch
                    </div>
                    <h1 className="text-[clamp(3rem,9vw,7rem)] font-black leading-[0.9] tracking-tighter text-white mb-6">
                        Let's Start a{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-violet-400">
                            Conversation
                        </span>
                    </h1>
                    <p className="text-white/40 text-xl font-medium leading-relaxed max-w-xl mx-auto">
                        Have a question, feedback, or just want to say hello? We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* ── CONTACT BODY ── */}
            <section className="py-24 bg-white dark:bg-[#07070F]">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">

                        {/* LEFT: Contact cards */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-2xl font-black text-black dark:text-white mb-6">Contact Info</h2>

                            {contactInfo.map((info, i) => (
                                <a
                                    key={i}
                                    href={info.href}
                                    target={info.href.startsWith('http') ? '_blank' : undefined}
                                    rel="noreferrer"
                                    className="flex items-center gap-5 p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/25 hover:shadow-lg dark:hover:shadow-white/5 transition-all duration-300 group hover:-translate-y-0.5 block"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-black dark:bg-white flex items-center justify-center shrink-0 text-white dark:text-black shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                                        <info.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">{info.title}</p>
                                        <p className="text-base font-bold text-black dark:text-white">{info.value}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{info.sub}</p>
                                    </div>
                                </a>
                            ))}

                            {/* Response time badge */}
                            <div className="p-5 rounded-3xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/8">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">We're Active</span>
                                </div>
                                <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed">
                                    Average response time: <strong>under 4 hours</strong> during business hours.
                                </p>
                            </div>
                        </div>

                        {/* RIGHT: Form */}
                        <div className="lg:col-span-3">
                            <div className="relative rounded-[32px] bg-[#0A0A1A] dark:bg-[#0D0D20] border border-white/10 p-8 md:p-10 overflow-hidden shadow-2xl">
                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-rose-500/15 to-transparent rounded-full blur-[60px] pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-violet-500/10 to-transparent rounded-full blur-[50px] pointer-events-none" />

                                <h2 className="text-2xl font-black text-white mb-8 relative z-10">Send a Message</h2>

                                {status === 'sent' && (
                                    <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center gap-3 text-emerald-400 text-sm font-bold relative z-10">
                                        <CheckCircle className="w-5 h-5 shrink-0" />
                                        Message sent! We'll get back to you shortly.
                                    </div>
                                )}

                                {status === 'error' && (
                                    <div className="mb-6 p-4 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center gap-3 text-red-400 text-sm font-bold relative z-10">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        Something went wrong. Please try again.
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {[
                                            { label: 'Name', name: 'name', type: 'text', ph: 'Your full name' },
                                            { label: 'Email', name: 'email', type: 'email', ph: 'you@example.com' },
                                        ].map(f => (
                                            <div key={f.name} className="space-y-1.5 group">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-focus-within:text-white transition-colors">{f.label}</label>
                                                <input
                                                    required
                                                    type={f.type}
                                                    name={f.name}
                                                    value={(form as any)[f.name]}
                                                    onChange={handleChange}
                                                    placeholder={f.ph}
                                                    className="w-full px-5 py-3.5 rounded-2xl bg-white/8 border border-white/12 focus:border-white/40 focus:bg-white/12 outline-none text-sm font-medium text-white placeholder:text-gray-600 transition-all"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-focus-within:text-white transition-colors">Subject</label>
                                        <select
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-3.5 rounded-2xl bg-white/8 border border-white/12 focus:border-white/40 outline-none text-sm font-medium text-white transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled className="bg-[#0A0A1A]">Choose a topic…</option>
                                            {['General Question', 'Bug Report', 'Feature Request', 'Partnership', 'Billing', 'Other'].map(s => (
                                                <option key={s} value={s} className="bg-[#0A0A1A]">{s}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-focus-within:text-white transition-colors">Message</label>
                                        <textarea
                                            required
                                            name="message"
                                            rows={5}
                                            value={form.message}
                                            onChange={handleChange}
                                            placeholder="Tell us how we can help…"
                                            className="w-full px-5 py-3.5 rounded-2xl bg-white/8 border border-white/12 focus:border-white/40 focus:bg-white/12 outline-none text-sm font-medium text-white placeholder:text-gray-600 transition-all resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'sending' || status === 'sent'}
                                        className="w-full py-4 rounded-2xl bg-white text-black font-black text-sm flex items-center justify-center gap-2.5 hover:bg-white/92 active:scale-[0.98] disabled:opacity-60 transition-all duration-200 shadow-lg"
                                    >
                                        {status === 'sending' ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                Sending…
                                            </>
                                        ) : status === 'sent' ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                Sent!
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
