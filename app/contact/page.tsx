'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
    const [sent, setSent] = useState(false);

    return (
        <>
            <Navbar />
            <main className="pt-32 pb-20 bg-white min-h-screen">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

                        {/* Info */}
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4">We're Here to Help</p>
                            <h1 className="text-6xl md:text-8xl font-black text-black mb-10 tracking-tight leading-tight">
                                Get in Touch
                            </h1>
                            <p className="text-xl text-gray-500 mb-16 leading-relaxed max-w-md">
                                Have questions about the app? Encountered a bug? Just want to say hello?
                                Our support team is here 24/7.
                            </p>
                            <div className="space-y-10">
                                {[
                                    { icon: Mail, label: 'Email', value: 'support@waliaai.com' },
                                    { icon: MessageCircle, label: 'Live Chat', value: 'Available in our app' },
                                    { icon: MapPin, label: 'Headquarters', value: 'Addis Ababa, Ethiopia' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-6 group">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center transition-all group-hover:bg-black group-hover:border-black shadow-sm">
                                            <item.icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                                            <p className="text-lg font-bold text-black">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form */}
                        <div>
                            {sent ? (
                                <div className="p-14 rounded-[40px] bg-black text-center space-y-4">
                                    <div className="text-5xl">🎉</div>
                                    <h3 className="text-2xl font-black text-white">Message Sent!</h3>
                                    <p className="text-white/50">We'll get back to you within 24 hours.</p>
                                </div>
                            ) : (
                                <form
                                    onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                                    className="p-10 md:p-12 rounded-[40px] bg-gray-50 border border-gray-200 space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {['Full Name', 'Email Address'].map((label) => (
                                            <div key={label} className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
                                                <input
                                                    type={label.includes('Email') ? 'email' : 'text'}
                                                    placeholder={label.includes('Email') ? 'john@example.com' : 'John Doe'}
                                                    required
                                                    className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 text-black placeholder:text-gray-300 focus:border-black outline-none transition-colors text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                                        <input
                                            type="text"
                                            placeholder="I have a question about..."
                                            required
                                            className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 text-black placeholder:text-gray-300 focus:border-black outline-none transition-colors text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                                        <textarea
                                            rows={5}
                                            placeholder="Tell us more about it..."
                                            required
                                            className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 text-black placeholder:text-gray-300 focus:border-black outline-none transition-colors text-sm resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-4 rounded-2xl bg-black text-white font-black text-base flex items-center justify-center hover:bg-zinc-800 transition-all hover:-translate-y-0.5 shadow-lg"
                                    >
                                        <Send className="w-5 h-5 mr-3" />
                                        Send Message
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
