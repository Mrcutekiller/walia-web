'use client';

import { Check, ChevronRight, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

interface OrbProps {
    onStartSession: (mode: string, level: string, durationMin: number) => void;
    isPro: boolean;
    hasFreeWeeklyUsed: boolean;
}

const MODES = ['Study', 'Work', 'Debate', 'Rizz', 'Advice', 'Language Practice', 'Teacher', 'Fun'];

const LEVELS: Record<string, string[]> = {
    Study: ['Beginner', 'High School', 'College', 'Expert'],
    Work: ['Intern', 'Professional', 'Manager', 'Executive'],
    Debate: ['Friendly', 'Serious', 'Aggressive'],
    Rizz: ['Beginner', 'Smooth', 'Elite', 'Legendary'],
    Advice: ['Gentle', 'Direct', 'Brutally Honest'],
    'Language Practice': ['Beginner', 'Intermediate', 'Advanced', 'Native'],
    Teacher: ['Kindergarten', 'High School', 'University Professor'],
    Fun: ['Jester', 'Sarcastic', 'Energetic'],
};

const TIMES = [
    { label: '5 minutes', min: 5 },
    { label: '15 minutes', min: 15 },
    { label: '30 minutes', min: 30 },
    { label: '1 hour', min: 60 },
    { label: 'Unlimited (Pro+)', min: 9999, proRequired: true },
];

export default function WaliaAIOrb({ onStartSession, isPro, hasFreeWeeklyUsed }: OrbProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);

    // Selections
    const [mode, setMode] = useState('');
    const [level, setLevel] = useState('');
    const [time, setTime] = useState<number>(0);

    const reset = () => {
        setStep(1); setMode(''); setLevel(''); setTime(0); setOpen(false);
    };

    const handleStart = () => {
        onStartSession(mode, level, time);
        reset();
    };

    return (
        <>
            {/* The Floating Orb */}
            <button
                onClick={() => setOpen(true)}
                className="absolute bottom-20 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all shadow-indigo-500/25 z-40 group"
            >
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                <Sparkles className="w-6 h-6 text-white" />
            </button>

            {/* Modal Overlay */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-sm rounded-[28px] bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white">Walia AI Companion</h3>
                                    <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase">
                                        Step {step} of 3
                                    </p>
                                </div>
                            </div>
                            <button onClick={reset} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-white/60 hover:text-white transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 h-[320px] overflow-y-auto custom-scrollbar">
                            {!isPro && hasFreeWeeklyUsed ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4 border border-rose-500/20">
                                        <X className="w-8 h-8 text-rose-500" />
                                    </div>
                                    <h4 className="text-base font-bold text-white mb-2">Free Limit Reached</h4>
                                    <p className="text-xs text-white/50 mb-6">
                                        You've used your 1 free AI Companion session this week.<br />
                                        Upgrade to Pro for unlimited sessions.
                                    </p>
                                    <a href="/upgrade" className="w-full py-3 rounded-xl bg-white text-black font-black text-sm transition-all hover:bg-white/90">
                                        Upgrade to Pro
                                    </a>
                                </div>
                            ) : (
                                <>
                                    {/* Step 1: Mode */}
                                    {step === 1 && (
                                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                            <p className="text-xs font-bold text-white/60 mb-2">Select AI Persona Mode</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {MODES.map(m => (
                                                    <button key={m} onClick={() => { setMode(m); setStep(2); }}
                                                        className="p-3 text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group">
                                                        <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{m}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Level */}
                                    {step === 2 && (
                                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                            <button onClick={() => setStep(1)} className="text-[10px] font-bold text-white/40 uppercase tracking-wider hover:text-white flex items-center gap-1 mb-2">
                                                ← Back
                                            </button>
                                            <p className="text-xs font-bold text-white/60 mb-2">Select {mode} Level</p>
                                            <div className="space-y-2">
                                                {(LEVELS[mode] || LEVELS['Study']).map(l => (
                                                    <button key={l} onClick={() => { setLevel(l); setStep(3); }}
                                                        className="w-full p-4 flex items-center justify-between rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all">
                                                        <span className="text-sm font-bold text-white">{l}</span>
                                                        <ChevronRight className="w-4 h-4 text-white/30" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Time Limit */}
                                    {step === 3 && (
                                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                            <button onClick={() => setStep(2)} className="text-[10px] font-bold text-white/40 uppercase tracking-wider hover:text-white flex items-center gap-1 mb-2">
                                                ← Back
                                            </button>
                                            <p className="text-xs font-bold text-white/60 mb-2">Select Session Duration</p>
                                            <div className="space-y-2">
                                                {TIMES.map(t => {
                                                    const locked = t.proRequired && !isPro;
                                                    return (
                                                        <button key={t.label} onClick={() => { if (!locked) setTime(t.min); }} disabled={locked}
                                                            className={`w-full p-4 flex items-center justify-between rounded-xl transition-all border ${locked ? 'bg-white/5 opacity-50 border-transparent cursor-not-allowed' :
                                                                    time === t.min ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/20 text-white'
                                                                }`}>
                                                            <span className="text-sm font-bold">{t.label}</span>
                                                            {locked ? (
                                                                <span className="text-[9px] uppercase tracking-widest font-black bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded">Pro</span>
                                                            ) : time === t.min ? (
                                                                <Check className="w-4 h-4" />
                                                            ) : <span className="w-4 h-4 rounded-full border border-white/20" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer CTA */}
                        {step === 3 && time > 0 && (
                            <div className="p-4 border-t border-white/5 bg-white/5 animate-in slide-in-from-bottom-4">
                                <button onClick={handleStart} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-sm hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Summon Walia AI
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
