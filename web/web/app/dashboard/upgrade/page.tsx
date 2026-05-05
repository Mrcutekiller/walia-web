'use client';

import { Sparkles, Check, Zap, Rocket, Star, Crown, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function UpgradePage() {
    const router = useRouter();

    const plans = [
        {
            name: 'Free',
            price: '$0',
            desc: 'Basic AI assistance for daily tasks',
            features: [
                '10 messages per day',
                'Standard response speed',
                'Basic AI models',
                'Web & Mobile access'
            ],
            button: 'Current Plan',
            current: true
        },
        {
            name: 'Pro',
            price: '$19',
            desc: 'Powerful tools for power users',
            features: [
                'Unlimited messages',
                'Priority response speed',
                'All premium models (GPT-4, Claude 3)',
                'Image generation (20/day)',
                'Early access to new features'
            ],
            button: 'Upgrade to Pro',
            popular: true
        },
        {
            name: 'Team',
            price: '$49',
            desc: 'For groups and organizations',
            features: [
                'Everything in Pro',
                'Shared workspaces',
                'Admin dashboard',
                'Team collaboration tools',
                'Custom AI training'
            ],
            button: 'Contact Sales'
        }
    ];

    return (
        <div className="h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#07070F] dark:via-[#0D0D1A] dark:to-[#07070F] overflow-y-auto p-6 md:p-12 custom-scrollbar">
            <div className="max-w-6xl mx-auto">
                
                {/* Back button */}
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[10px] font-black uppercase tracking-widest mb-12 hover:border-black dark:hover:border-white transition-all group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/10"
                    >
                        <Crown className="w-3.5 h-3.5" />
                        Go Beyond Limits
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-black dark:text-white tracking-tighter uppercase leading-[0.9]"
                    >
                        Elevate your<br />Intelligence.
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-xl mx-auto"
                    >
                        Choose the plan that fits your ambition. Unlock the full potential of Walia AI.
                    </motion.p>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className={`relative flex flex-col p-8 rounded-[3rem] border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                                plan.popular 
                                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-xl shadow-black/20' 
                                    : 'bg-white/70 dark:bg-white/5 border-gray-200/60 dark:border-white/10 backdrop-blur-sm'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                                    Most Popular
                                </div>
                            )}
                            
                            <div className="mb-8">
                                <h3 className={`text-sm font-black uppercase tracking-widest mb-2 ${plan.popular ? 'text-white/60 dark:text-black/60' : 'text-gray-400'}`}>
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black">{plan.price}</span>
                                    <span className={`text-xs font-bold ${plan.popular ? 'text-white/40 dark:text-black/40' : 'text-gray-400'}`}>/month</span>
                                </div>
                                <p className={`text-[10px] font-bold mt-2 uppercase tracking-tight ${plan.popular ? 'text-white/50 dark:text-black/50' : 'text-gray-500'}`}>
                                    {plan.desc}
                                </p>
                            </div>

                            <div className="flex-1 space-y-4 mb-10">
                                {plan.features.map((feature, j) => (
                                    <div key={j} className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-white/10 dark:bg-black/10' : 'bg-black/5 dark:bg-white/5'}`}>
                                            <Check className={`w-3 h-3 ${plan.popular ? 'text-white dark:text-black' : 'text-black dark:text-white'}`} />
                                        </div>
                                        <span className={`text-[11px] font-medium ${plan.popular ? 'text-white/80 dark:text-black/80' : 'text-gray-600 dark:text-white/60'}`}>
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button 
                                className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg ${
                                    plan.popular
                                        ? 'bg-white text-black dark:bg-black dark:text-white hover:opacity-90'
                                        : plan.current
                                            ? 'bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-white/30 cursor-default'
                                            : 'bg-black text-white dark:bg-white dark:text-black hover:opacity-90'
                                }`}
                            >
                                {plan.button}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ / Info */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-24 p-12 rounded-[4rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05] text-center"
                >
                    <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tight mb-4">Enterprise Solutions</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto mb-8">
                        Need a custom plan for your university or company? We offer tailored solutions with advanced security, dedicated support, and unlimited scalability.
                    </p>
                    <button className="px-10 py-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:border-black dark:hover:border-white transition-all">
                        Talk to an Expert
                    </button>
                </motion.div>

            </div>
        </div>
    );
}
