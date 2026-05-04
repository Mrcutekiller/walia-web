'use client';

import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
    ArrowRight, ArrowLeft, Mail, Lock, User, Hash, Phone, Globe,
    Sparkles, CheckCircle2, X, Users, Instagram, Send, Megaphone, HelpCircle, Eye, EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AvatarSelector from '@/components/AvatarSelector';
import Image from 'next/image';

const INTERESTS = [
    'Trading', 'AI Development', 'School', 'Business', 'Technology',
    'Design', 'Marketing', 'Finance', 'Crypto', 'Self Improvement'
];

const SOURCES = [
    { label: 'Friend', icon: Users },
    { label: 'Instagram', icon: Instagram },
    { label: 'Telegram', icon: Send },
    { label: 'Ads', icon: Megaphone },
    { label: 'Other', icon: HelpCircle },
];

const COUNTRIES = [
    "Ethiopia", "United States", "United Kingdom", "Canada", "Germany",
    "France", "UAE", "Kenya", "Nigeria", "South Africa", "Other"
];

const STEPS = [
    { title: "Create account", subtitle: "Start your journey with Walia today." },
    { title: "Your identity", subtitle: "Tell us who you are in the community." },
    { title: "Your profile", subtitle: "Help our AI personalize your experience." },
    { title: "Almost done!", subtitle: "How did you hear about us?" },
];

const stepVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } as any },
    exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

/* ─── Reusable input component ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-0.5">
                {label}
            </label>
            {children}
        </div>
    );
}

const inputCls = "w-full py-3.5 rounded-2xl bg-gray-100 dark:bg-white/5 border-2 border-transparent focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/8 outline-none transition-all text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25";

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const { signup } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        avatar: '/avatars/avatar1.jpg',
        age: '',
        phone: '',
        country: 'Ethiopia',
        about: '',
        interests: [] as string[],
        source: '',
    });

    const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest],
        }));
    };

    const handleNext = () => {
        setError('');
        if (step === 1) {
            if (!formData.email || !formData.password) return setError('Please fill all required fields.');
            if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.');
            if (formData.password.length < 6) return setError('Password must be at least 6 characters.');
        }
        if (step === 2) {
            if (!formData.username.trim()) return setError('Username is required.');
            const ageNum = Number(formData.age);
            if (!formData.age || isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
                return setError('Please enter a valid age between 13 and 120.');
            }
        }
        setStep(prev => prev + 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            await signup(formData.email, formData.password, {
                name: formData.username,
                username: formData.username,
                photoURL: formData.avatar,
                age: formData.age,
                phone: formData.phone,
                country: formData.country,
                about: formData.about,
                interests: formData.interests,
                referralSource: formData.source,
                theme: 'light',
            });
            router.push('/dashboard/ai');
        } catch (err: any) {
            setError(err.message || 'Failed to create account. Please try again.');
            setLoading(false);
        }
    };

    const progress = ((step - 1) / 4) * 100;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#07070F] flex overflow-hidden">

            {/* ── Left Panel ── */}
            <div className="hidden lg:flex w-[45%] bg-black relative flex-col items-center justify-center p-16 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.25)_0%,transparent_60%)]" />
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.15)_0%,transparent_55%)]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center max-w-md"
                >
                    <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        <Image src="/logo.png" alt="Walia" width={48} height={48} className="object-contain" unoptimized />
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tight mb-4 uppercase">Join Walia.</h2>
                    <p className="text-white/50 text-base font-medium max-w-xs mx-auto leading-relaxed mb-10">
                        Your AI-powered study companion awaits. Let&apos;s build your future together.
                    </p>
                    <div className="space-y-3 text-left">
                        {[
                            'Advanced AI Assistance',
                            'Powerful Learning Tools',
                            'Global Community',
                            'Smart Study Plans',
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                <span className="text-white/60 text-sm font-medium">{text}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <div className="absolute top-1/4 left-10 w-2 h-2 bg-indigo-400 rounded-full animate-pulse opacity-60" />
                <div className="absolute bottom-1/3 right-12 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-40" />
            </div>

            {/* ── Right: Form ── */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-white dark:bg-[#07070F] relative overflow-y-auto">

                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 dark:bg-white/5">
                    <motion.div
                        className="h-full bg-black dark:bg-white rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>

                {/* Back link */}
                <div className="absolute top-8 left-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-black dark:text-white/40 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </Link>
                </div>

                <div className="w-full max-w-md pt-12">

                    {/* Step header */}
                    <motion.div
                        key={`header-${step}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        {/* Step indicator */}
                        <div className="flex items-center gap-1.5 mb-4">
                            {[1, 2, 3, 4].map(s => (
                                <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-black dark:bg-white' : s < step ? 'w-4 bg-black/30 dark:bg-white/30' : 'w-4 bg-gray-200 dark:bg-white/10'}`} />
                            ))}
                            <span className="ml-2 text-[11px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-widest">Step {step} of 4</span>
                        </div>
                        <h1 className="text-3xl font-black text-black dark:text-white tracking-tight mb-1.5">
                            {STEPS[step - 1].title}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                            {STEPS[step - 1].subtitle}
                        </p>
                    </motion.div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-5 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-3"
                        >
                            <X className="w-4 h-4 flex-shrink-0" /> {error}
                        </motion.div>
                    )}

                    {/* Steps */}
                    <AnimatePresence mode="wait">

                        {/* ── Step 1: Account ── */}
                        {step === 1 && (
                            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                                <Field label="Email address">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30 pointer-events-none" />
                                        <input type="email" value={formData.email} onChange={e => set('email', e.target.value)} placeholder="name@example.com" className={inputCls + " pl-11 pr-4"} />
                                    </div>
                                </Field>
                                <Field label="Password">
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30 pointer-events-none" />
                                        <input type={showPassword ? "text" : "password"} value={formData.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters" className={inputCls + " pl-11 pr-12"} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors">
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </Field>
                                <Field label="Confirm password">
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30 pointer-events-none" />
                                        <input type={showConfirm ? "text" : "password"} value={formData.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Repeat your password" className={inputCls + " pl-11 pr-12"} />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors">
                                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </Field>
                            </motion.div>
                        )}

                        {/* ── Step 2: Identity ── */}
                        {step === 2 && (
                            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                                <div>
                                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-3 ml-0.5">Avatar</p>
                                    <AvatarSelector
                                        selectedAvatar={formData.avatar}
                                        onSelect={(path) => set('avatar', path)}
                                    />
                                </div>
                                <Field label="Username">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30 pointer-events-none" />
                                        <input type="text" value={formData.username} onChange={e => set('username', e.target.value)} placeholder="Choose a unique username" className={inputCls + " pl-11 pr-4"} />
                                    </div>
                                </Field>
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Age">
                                        <div className="relative">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30 pointer-events-none" />
                                            <input type="number" min={13} max={120} value={formData.age} onChange={e => set('age', e.target.value)} placeholder="Your age" inputMode="numeric" className={inputCls + " pl-11 pr-4"} />
                                        </div>
                                    </Field>
                                    <Field label="Country">
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30 pointer-events-none" />
                                            <select value={formData.country} onChange={e => set('country', e.target.value)} className={inputCls + " pl-11 pr-4 appearance-none cursor-pointer"}>
                                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </Field>
                                </div>
                                <Field label="Phone (Optional)">
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30 pointer-events-none" />
                                        <input type="tel" value={formData.phone} onChange={e => set('phone', e.target.value)} placeholder="+251..." className={inputCls + " pl-11 pr-4"} />
                                    </div>
                                </Field>
                            </motion.div>
                        )}

                        {/* ── Step 3: Profile ── */}
                        {step === 3 && (
                            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                                <Field label="About you">
                                    <textarea
                                        value={formData.about}
                                        onChange={e => set('about', e.target.value)}
                                        placeholder="What should Walia know about you? (optional)"
                                        rows={3}
                                        className={inputCls + " px-4 resize-none"}
                                    />
                                </Field>
                                <div className="space-y-2.5">
                                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-0.5">Interests</p>
                                    <p className="text-xs text-gray-400 dark:text-white/30 font-medium ml-0.5">Select all that apply</p>
                                    <div className="flex flex-wrap gap-2">
                                        {INTERESTS.map(interest => (
                                            <button
                                                key={interest}
                                                type="button"
                                                onClick={() => toggleInterest(interest)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all duration-200 ${formData.interests.includes(interest)
                                                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm'
                                                    : 'bg-gray-50 dark:bg-white/[0.04] text-gray-600 dark:text-white/50 border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30 hover:text-black dark:hover:text-white'
                                                    }`}
                                            >
                                                {interest}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ── Step 4: Discovery ── */}
                        {step === 4 && (
                            <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-3">
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-0.5 mb-4">How did you find us?</p>
                                {SOURCES.map(source => (
                                    <button
                                        key={source.label}
                                        type="button"
                                        onClick={() => set('source', source.label)}
                                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-200 ${formData.source === source.label
                                            ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xl shadow-black/10'
                                            : 'bg-gray-50 dark:bg-white/[0.03] text-gray-600 dark:text-white/60 border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30 hover:bg-gray-100 dark:hover:bg-white/8'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${formData.source === source.label ? 'bg-white/20 dark:bg-black/20' : 'bg-gray-200 dark:bg-white/10'}`}>
                                            <source.icon className={`w-5 h-5 ${formData.source === source.label ? 'text-white dark:text-black' : 'text-gray-500 dark:text-white/50'}`} />
                                        </div>
                                        <span className="font-bold text-sm">{source.label}</span>
                                        {formData.source === source.label && (
                                            <CheckCircle2 className="ml-auto w-5 h-5 text-emerald-400 dark:text-emerald-500" />
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Navigation Buttons ── */}
                    <div className="mt-8 flex gap-3">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={() => { setError(''); setStep(prev => prev - 1); }}
                                className="flex-1 py-4 rounded-2xl border-2 border-gray-200 dark:border-white/10 font-black text-sm text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={step === 4 ? handleSubmit : handleNext}
                            disabled={loading}
                            className="flex-[2] py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm flex items-center justify-center gap-2.5 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-black/15 dark:shadow-white/5 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    {step === 4 ? (
                                        <><Sparkles className="w-4 h-4" /> Create Account</>
                                    ) : (
                                        <>Next Step <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </>
                            )}
                        </button>
                    </div>

                    {step === 1 && (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6 font-medium">
                            Already have an account?{' '}
                            <Link href="/login" className="font-black text-black dark:text-white hover:underline underline-offset-2">
                                Sign in
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}