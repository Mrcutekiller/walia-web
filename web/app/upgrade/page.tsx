'use client';

import DashboardShell from '@/components/DashboardShell';
import { Check, Crown, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const FREE_FEATURES = [
    { text: '5 AI messages per day', included: true },
    { text: 'Basic study tools', included: true },
    { text: 'Community access', included: true },
    { text: '5 image uploads per day', included: true },
    { text: 'Unlimited AI messages', included: false },
    { text: 'GPT-4 & Claude models', included: false },
    { text: 'All 11 Pro tools', included: false },
];

const PRO_FEATURES = [
    'Unlimited AI Chat Messages',
    'GPT-4, Gemini 2.0 & Claude',
    'Unlimited Image Uploads',
    'All 11 Professional Tools',
    'Study Analytics & Reports',
    'Ad-free Experience',
    'Priority Support',
    'Early Access to New Features',
];

export default function UpgradePage() {
    const [yearly, setYearly] = useState(false);
    const monthly = 12;
    const yearly_price = Math.round(monthly * 12 * 0.75); // $108 (25% off)

    return (
        <DashboardShell>
            <div className="p-6 max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center mx-auto mb-4">
                        <Crown className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Unlock Everything</p>
                    <h1 className="text-3xl font-black text-white tracking-tight">Upgrade to Pro</h1>
                    <p className="text-white/40 mt-2 text-sm">Get unlimited access to all Walia AI features.</p>
                </div>

                {/* Toggle */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <span className={`text-sm font-bold ${!yearly ? 'text-white' : 'text-white/30'}`}>Monthly</span>
                    <button onClick={() => setYearly(v => !v)}
                        className={`relative w-12 h-6 rounded-full transition-all ${yearly ? 'bg-indigo-500' : 'bg-white/10'}`}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${yearly ? 'left-[26px]' : 'left-0.5'}`} />
                    </button>
                    <span className={`text-sm font-bold ${yearly ? 'text-white' : 'text-white/30'}`}>
                        Yearly <span className="text-green-400 text-xs">Save 25%</span>
                    </span>
                </div>

                {/* Price Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Free */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/8">
                        <p className="text-xs font-black text-white/30 uppercase tracking-widest mb-3">Free</p>
                        <div className="flex items-end gap-1 mb-4">
                            <span className="text-4xl font-black text-white">$0</span>
                            <span className="text-white/30 text-sm mb-1">/forever</span>
                        </div>
                        <ul className="space-y-2 mb-6">
                            {FREE_FEATURES.map(f => (
                                <li key={f.text} className="flex items-center gap-2 text-xs">
                                    {f.included
                                        ? <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                                        : <X className="w-3.5 h-3.5 text-white/15 shrink-0" />}
                                    <span className={f.included ? 'text-white/70' : 'text-white/20'}>{f.text}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="w-full py-2.5 rounded-xl border border-white/10 text-xs font-bold text-white/30 text-center">
                            Current Plan
                        </div>
                    </div>

                    {/* Pro */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/60 to-violet-900/60 border border-indigo-500/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-3 py-1.5 bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest">
                            Most Popular
                        </div>
                        <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-3">Pro</p>
                        <div className="flex items-end gap-1 mb-1">
                            <span className="text-4xl font-black text-white">${yearly ? yearly_price : monthly}</span>
                            <span className="text-white/40 text-sm mb-1">/{yearly ? 'year' : 'month'}</span>
                        </div>
                        {yearly && <p className="text-xs text-white/30 line-through mb-3">${monthly * 12}/year</p>}
                        <ul className="space-y-2 mb-6 mt-4">
                            {PRO_FEATURES.map(f => (
                                <li key={f} className="flex items-center gap-2 text-xs">
                                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                    <span className="text-white/80">{f}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-xl bg-white text-black font-black text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                            <Zap className="w-4 h-4" /> Upgrade Now
                        </button>
                    </div>
                </div>

                <p className="text-center text-xs text-white/20">
                    Secure payment · Cancel anytime · <Link href="/legal/terms" className="underline">Terms</Link>
                </p>
            </div>
        </DashboardShell>
    );
}
