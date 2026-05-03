'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Check, Download, Rocket, Star, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    desc: 'Perfect for getting started.',
    icon: Rocket,
    features: [
      { label: '5 AI Messages / day', included: true },
      { label: 'Community Access', included: true },
      { label: 'Basic Notes & Tools', included: true },
      { label: '5 Image Uploads / day', included: true },
      { label: 'Premium AI Models', included: false },
      { label: 'Unlimited Messages', included: false },
      { label: 'Ad-free Experience', included: false },
    ],
    cta: 'Get Started Free',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: { monthly: 12, yearly: 108 },
    desc: 'For serious learners & power users.',
    icon: Star,
    features: [
      { label: 'Unlimited AI Messages', included: true },
      { label: 'GPT-4, Gemini & Claude', included: true },
      { label: 'Unlimited Image Uploads', included: true },
      { label: 'All 12+ Professional Tools', included: true },
      { label: 'Smart Analytics & Reports', included: true },
      { label: 'Ad-free Experience', included: true },
      { label: 'Priority Support', included: true },
    ],
    cta: 'Upgrade to Pro',
    href: '/signup',
    highlight: true,
  },
  {
    name: 'Team',
    price: { monthly: 29, yearly: 261 },
    desc: 'For study groups & organizations.',
    icon: Zap,
    features: [
      { label: 'Everything in Pro', included: true },
      { label: 'Up to 10 members', included: true },
      { label: 'Shared workspace & notes', included: true },
      { label: 'Team analytics dashboard', included: true },
      { label: 'Custom AI personas', included: true },
      { label: 'Dedicated account manager', included: true },
      { label: 'SLA & guaranteed uptime', included: true },
    ],
    cta: 'Start Team Trial',
    href: '/signup',
    highlight: false,
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-4 block">Transparent Pricing</span>
            <h1 className="text-6xl md:text-8xl font-black text-black tracking-tight mb-6">Simple Pricing</h1>
            <p className="text-gray-500 text-xl">No hidden fees. Start free. Upgrade when ready.</p>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <span className={`text-sm font-bold transition-colors ${!yearly ? 'text-black' : 'text-gray-400'}`}>Monthly</span>
              <button onClick={() => setYearly(v => !v)}
                className={`relative w-14 h-7 rounded-full transition-all ${yearly ? 'bg-black' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${yearly ? 'left-8' : 'left-1'}`} />
              </button>
              <span className={`text-sm font-bold transition-colors flex items-center gap-2 ${yearly ? 'text-black' : 'text-gray-400'}`}>
                Yearly
                <span className="text-[10px] font-black bg-black text-white px-2.5 py-1 rounded-full">Save 25%</span>
              </span>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {plans.map((plan, i) => {
              const Icon = plan.icon;
              const price = yearly ? plan.price.yearly : plan.price.monthly;
              const period = yearly ? 'year' : 'month';
              return (
                <div key={i} className={`relative flex flex-col p-8 md:p-10 rounded-[36px] border transition-all duration-500 hover:-translate-y-2 ${plan.highlight ? 'bg-black border-black shadow-2xl shadow-black/20' : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-xl'}`}>
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest shadow-lg">
                      Most Popular
                    </div>
                  )}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.highlight ? 'bg-white/10' : 'bg-gray-200'}`}>
                    <Icon className={`w-7 h-7 ${plan.highlight ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <h3 className={`text-2xl font-black mb-1 ${plan.highlight ? 'text-white' : 'text-black'}`}>{plan.name}</h3>
                  <p className={`text-sm mb-6 ${plan.highlight ? 'text-white/40' : 'text-gray-400'}`}>{plan.desc}</p>
                  <div className="mb-8">
                    <div className="flex items-end gap-1">
                      <span className={`text-5xl font-black ${plan.highlight ? 'text-white' : 'text-black'}`}>${price}</span>
                      {price > 0 && <span className={`text-sm mb-1.5 ${plan.highlight ? 'text-white/40' : 'text-gray-400'}`}>/ {period}</span>}
                      {price === 0 && <span className={`text-sm mb-1.5 ${plan.highlight ? 'text-white/40' : 'text-gray-400'}`}>/ forever</span>}
                    </div>
                    {yearly && price > 0 && (
                      <p className={`text-xs mt-1 font-bold line-through ${plan.highlight ? 'text-white/20' : 'text-gray-300'}`}>
                        ${plan.price.monthly * 12} / year (monthly)
                      </p>
                    )}
                  </div>
                  <ul className="space-y-3 mb-10 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className={`flex items-center gap-3 text-sm ${!f.included ? 'opacity-40' : ''}`}>
                        {f.included
                          ? <Check className={`w-4 h-4 shrink-0 ${plan.highlight ? 'text-white' : 'text-black'}`} />
                          : <X className="w-4 h-4 shrink-0 text-gray-400" />}
                        <span className={`font-medium ${f.included ? (plan.highlight ? 'text-white/80' : 'text-gray-700') : (plan.highlight ? 'text-white/30 line-through' : 'text-gray-400 line-through')}`}>{f.label}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href}
                    className={`block w-full py-4 rounded-2xl font-black text-center text-sm transition-all hover:-translate-y-0.5 ${plan.highlight ? 'bg-white text-black hover:bg-white/90 shadow-xl' : 'bg-black text-white hover:bg-zinc-800'}`}>
                    {plan.cta}
                  </Link>
                </div>
              );
            })}
          </div>

          <p className="text-center text-gray-400 text-sm">All plans include a 14-day money-back guarantee. No questions asked.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
