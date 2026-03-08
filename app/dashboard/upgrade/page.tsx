'use client';

import {
    User,
    BrainCircuit,
    Check,
    Crown,
    Flame,
    Lock,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Zap
} from 'lucide-react';

export default function UpgradePage() {
    const features = [
        { icon: Sparkles, title: 'Unlimited AI Chat', desc: 'No daily limits or message caps.' },
        { icon: BrainCircuit, title: 'GPT-4 & Gemini 2.0', desc: 'Priority access to the world\'s best AI models.' },
        { icon: Lock, title: 'Unlimited Files', desc: 'Upload, scan, and summarize unlimited PDFs & photos.' },
        { icon: Flame, title: 'Custom Tools', desc: 'Early access to all new study micro-apps.' },
        { icon: TrendingUp, title: 'Advanced Market AI', desc: 'Real-time chart scanning with precise SL/TP targets.' },
        { icon: ShieldCheck, title: 'Ad-Free Space', desc: 'Focus entirely on your studies with zero distractions.' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-16 animate-fade-in-up">

            {/* Header */}
            <div className="text-center space-y-6">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-walia-primary/10 border border-walia-primary/20 text-[10px] font-black uppercase text-walia-primary tracking-widest mb-4">
                    Next Generation Learning
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">Unlock Your Potential</h1>
                <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
                    Upgrade to Walia Pro and join thousands of students who have already
                    transformed their productivity with our advanced AI tools.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                {/* Feature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {features.map((F, i) => (
                        <div key={i} className="p-8 rounded-[40px] bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col group h-full">
                            <div className="w-12 h-12 rounded-2xl bg-walia-primary/10 border border-walia-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <F.icon className="w-5 h-5 text-walia-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-walia-primary transition-colors">{F.title}</h3>
                            <p className="text-xs text-white/40 font-medium leading-relaxed">{F.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Plan Selection Card */}
                <div className="p-12 md:p-16 rounded-[48px] bg-gradient-to-br from-walia-primary to-walia-secondary relative overflow-hidden flex flex-col justify-between group shadow-2xl shadow-walia-primary/30">
                    {/* Background Animations */}
                    <div className="absolute top-0 right-0 p-12 text-white/10 transition-transform group-hover:scale-125">
                        <Crown className="w-64 h-64 rotate-12" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-12">
                            <div className="p-5 rounded-3xl bg-white/20 border border-white/20 inline-flex items-center justify-center">
                                <Zap className="w-10 h-10 text-white fill-white" />
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-xs font-black uppercase text-white tracking-widest">Yearly Billing</div>
                        </div>

                        <div className="space-y-4 mb-20">
                            <div className="flex items-end space-x-2">
                                <span className="text-7xl font-black text-white tracking-tighter">$4.99</span>
                                <span className="text-white/60 font-black uppercase text-xs mb-4 tracking-widest">/ Month</span>
                            </div>
                            <p className="text-white/80 font-medium text-lg italic">The most popular choice for dedicated students.</p>
                        </div>

                        <div className="space-y-6">
                            {['Cancel anytime', '14-Day Money-back', 'Pay with PayPal or Crypto'].map((lbl, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                                        <Check className="w-4 h-4 text-walia-primary" />
                                    </div>
                                    <span className="text-sm font-black text-white/90">{lbl}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 mt-20 space-y-6">
                        <button className="w-full py-6 rounded-[32px] bg-white text-walia-primary text-xl font-black hover:bg-white/90 transition-all shadow-xl hover:-translate-y-1">
                            Start Pro Membership
                        </button>
                        <p className="text-center text-[10px] text-white/50 font-black uppercase tracking-widest underline cursor-pointer hover:text-white">Or Upgrade to Lifetime for $49</p>
                    </div>
                </div>
            </div>

            {/* Trust Banner */}
            <div className="p-12 text-center rounded-[48px] bg-white/5 border border-white/10 space-y-10">
                <div className="flex items-center justify-center -space-x-4 mb-4">
                    {[1, 2, 3, 4, 5].map((it) => (
                        <div key={it} className="w-14 h-14 rounded-2xl bg-black border-4 border-[#070712] flex items-center justify-center font-black text-white/20 text-xl overflow-hidden relative">
                            <User className="w-6 h-6" />
                        </div>
                    ))}
                    <div className="w-14 h-14 rounded-2xl bg-walia-primary border-4 border-[#070712] flex items-center justify-center font-black text-white text-xs">
                        +10k
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white max-w-xl mx-auto leading-relaxed">
                    "Walia Pro literally changed how I study for my finals. The AI Summarizer is a game changer."
                </h2>
                <p className="text-xs font-black text-walia-primary uppercase tracking-[0.2em]">Daniel W. - CS Student</p>
            </div>

        </div>
    );
}

