'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MapPin, Phone } from 'lucide-react';
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
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 text-black">Get in Touch</h1>
                        <p className="text-gray-500 font-medium text-lg">We'd love to hear from you. Please fill out the form below.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-black">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-black shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Email</p>
                                        <p className="font-medium text-black">support@walia.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-black shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                                        <p className="font-medium text-black">+251 900 000 000</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-black shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Address</p>
                                        <p className="font-medium text-black">Addis Ababa, Ethiopia</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Name</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-black outline-none font-medium mt-1 text-black placeholder:text-gray-400 transition-colors" placeholder="Your Name" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-black outline-none font-medium mt-1 text-black placeholder:text-gray-400 transition-colors" placeholder="you@example.com" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Message</label>
                                    <textarea required rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-black outline-none font-medium mt-1 text-black placeholder:text-gray-400 transition-colors" placeholder="How can we help?" />
                                </div>
                                <button type="submit" className="w-full py-4 rounded-2xl bg-black text-white font-bold text-sm hover:-translate-y-1 transition-transform shadow-lg active:scale-95">
                                    {sent ? 'Message Sent!' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
