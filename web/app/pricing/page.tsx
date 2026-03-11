'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Check, Rocket, Star, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const FREE_FEATURES = [
    '5 AI Chat Messages / day',
    'Basic Study Tools',
    'Community Access',
    '5 Image Uploads / day',
];
const FREE_MISSING = [
    'Premium AI Models',
    'Unlimited Uploads',
    'Ad-free Experience',
    'Advanced Study Analytics',
];

const PRO_FEATURES = [
    'Unlimited AI Chat Messages',
    'GPT-4, Gemini 2.0 & Claude',
    'Unlimited Image Uploads',
    'All 12+ Professional Tools',
    'Smart Study Analytics & Reports',
    'Ad-free Experience',
    'Priority Support',
    'Early Access to New Features',
];

export default function PricingPage() {
    const [yearly, setYearly] = useState(false);

    const proMonthly = 12;
    const proYearly = (proMonthly * 12 * 0.75).toFixed(0); // 25% off yearly

    return (
        <>
            <Navbar />
            <main className="pt-32 pb-20 bg-white min-h-screen">
                <div className="container mx-auto px-6 md:px-12">

                    {/* Header */}
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4">Transparent Pricing</p>
                        <h1 className="text-6xl md:text-8xl font-black text-black mb-4 tracking-tight">Simple Pricing</h1>
                        <p className="text-xl text-gray-500">No hidden fees. Start free. Upgrade when ready.</p>
                    </div>

                    {/* Monthly / Yearly toggle */}
                    <div className="flex items-center justify-center gap-4 mb-16">
                        <span className={`text-sm font-bold transition-colors ${!yearly ? 'text-black' : 'text-gray-400'}`}>Monthly</span>
                        <button
                            onClick={() => setYearly(v => !v)}
                            className={`relative w-14 h-7 rounded-full transition-all ${yearly ? 'bg-black' : 'bg-gray-200'}`}
                        >
                            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${yearly ? 'left-8' : 'left-1'}`} />
                        </button>
                        <span className={`text-sm font-bold transition-colors flex items-center gap-2 ${yearly ? 'text-black' : 'text-gray-400'}`}>
                            Yearly
                            <span className="text-[10px] font-black uppercase tracking-widest text-white bg-black px-2.5 py-1 rounded-full">
                                Save 25%
                            </span>
                        </span>
                    </div>

                    {/* Two cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20">

                        {/* Free */}
                        <div className="p-8 md:p-10 rounded-[36px] bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center mb-6">
                                <Rocket className="w-7 h-7 text-gray-500" />
                            </div>
                            <h3 className="text-2xl font-black text-black mb-1">Free</h3>
                            <p className="text-gray-400 text-sm mb-6">Perfect for casual learners.</p>
                            <div className="mb-8 flex items-end gap-1">
                                <span className="text-5xl font-black text-black">$0</span>
                                <span className="text-gray-400 text-sm mb-1.5">/ forever</span>
                            </div>
                            <ul className="space-y-3 mb-10">
                                {FREE_FEATURES.map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm">
                                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                                        <span className="text-gray-600 font-medium">{f}</span>
                                    </li>
                                ))}
                                {FREE_MISSING.map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm opacity-40">
                                        <X className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span className="text-gray-500 line-through font-medium">{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/signup" className="block w-full py-4 rounded-2xl bg-gray-200 text-gray-700 font-black text-center hover:bg-gray-300 transition-all">
                                Get Started Free
                            </Link>
                        </div>

                        {/* Pro */}
                        <div className="relative p-8 md:p-10 rounded-[36px] bg-black border border-black shadow-2xl shadow-black/20 hover:-translate-y-1 transition-all">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest shadow-lg">
                                Most Popular
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                                <Star className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-1">Pro</h3>
                            <p className="text-white/40 text-sm mb-6">For power users & researchers.</p>

                            <div className="mb-8">
                                {yearly ? (
                                    <div className="flex items-end gap-1">
                                        <span className="text-5xl font-black text-white">${proYearly}</span>
                                        <span className="text-white/40 text-sm mb-1.5">/ year</span>
                                    </div>
                                ) : (
                                    <div className="flex items-end gap-1">
                                        <span className="text-5xl font-black text-white">${proMonthly}</span>
                                        <span className="text-white/40 text-sm mb-1.5">/ month</span>
                                    </div>
                                )}
                                {yearly && (
                                    <p className="text-white/30 text-xs mt-1 font-bold line-through">
                                        ${(proMonthly * 12).toFixed(0)} / year (billed monthly)
                                    </p>
                                )}
                            </div>

                            <ul className="space-y-3 mb-10">
                                {PRO_FEATURES.map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm">
                                        <Check className="w-4 h-4 text-green-400 shrink-0" />
                                        <span className="text-white/80 font-medium">{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/signup" className="block w-full py-4 rounded-2xl bg-white text-black font-black text-center hover:bg-white/90 transition-all hover:-translate-y-0.5 shadow-xl">
                                Upgrade to Pro
                            </Link>
                        </div>
                    </div>

                    <p className="text-center text-gray-400 text-sm">
                        All plans include a 14-day money-back guarantee. No questions asked.
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}
