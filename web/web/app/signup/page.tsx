'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowRight, ArrowLeft, Mail, Lock, User, Hash, Phone, Globe, 
    Sparkles, CheckCircle2, ChevronRight, X, Heart, Info, Users, Instagram, Send, Megaphone, HelpCircle
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
    "Ethiopia", "United States", "United Kingdom", "Canada", "Germany", "France", "UAE", "Kenya", "Nigeria", "South Africa", "Other"
];

const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
};

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const { signup } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        source: ''
    });

    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleNext = () => {
        setError('');
        if (step === 1) {
            if (!formData.email || !formData.password) return setError('Please fill all fields');
            if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
            if (formData.password.length < 6) return setError('Password must be at least 6 characters');
        }
        if (step === 2) {
            if (!formData.username) return setError('Username is required');
            const ageValue = Number(formData.age);
            if (!formData.age || Number.isNaN(ageValue) || ageValue < 13 || ageValue > 120) {
                return setError('Please enter a valid age between 13 and 120.');
            }
        }
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

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
            setError(err.message || 'Failed to create account');
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white dark:bg-[#07070F] flex overflow-hidden">
            {/* Left: Decorative (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 bg-slate-50 relative items-center justify-center p-20 overflow-hidden">
                <div className="absolute inset-0 opacity-80">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.18)_0%,_transparent_55%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(241,245,249,0.95))]" />
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="relative z-10 text-center"
                >
                    <Image src="/logo.png" alt="Walia" width={120} height={120} className="mx-auto mb-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" unoptimized />
                    <h2 className="text-5xl font-black text-white tracking-tighter mb-6 uppercase">Join the Herd.</h2>
                    <p className="text-white/40 text-lg max-w-md mx-auto leading-relaxed font-medium">
                        Walia is more than an AI. It&apos;s your companion for trading, learning, and building a better future.
                    </p>
                    
                    <div className="mt-12 space-y-4 text-left inline-block">
                        {[
                            'Advanced AI Assistance',
                            'XAUUSD Market Insights',
                            'Powerful Learning Tools',
                            'Global Community'
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-3 text-white/60 text-sm font-bold">
                                <CheckCircle2 className="w-5 h-5 text-white" /> {text}
                            </div>
                        ))}
                    </div>
                </motion.div>
                
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse" />
                <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white/50 rounded-full animate-ping" />
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 relative bg-[#F7F9FB]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 dark:bg-white/5">
                    <motion.div 
                        className="h-full bg-black dark:bg-white"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>

                <div className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-black uppercase tracking-widest mb-4">
                            Step {step} of 4
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-black dark:text-white mb-2">
                            {step === 1 && "Create account"}
                            {step === 2 && "Identity"}
                            {step === 3 && "Profile"}
                            {step === 4 && "Discovery"}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                            {step === 1 && "Start your journey with Walia today."}
                            {step === 2 && "Tell us who you are in the community."}
                            {step === 3 && "This helps our AI personalize your experience."}
                            {step === 4 && "Final step! How did you hear about us?"}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-3">
                            <X className="w-4 h-4 shrink-0" /> {error}
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-200 ml-1">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                                        <input 
                                            type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                            placeholder="name@example.com"
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-sm text-black dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-200 ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                                        <input 
                                            type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                                            placeholder="Min 6 characters"
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-sm text-black dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                                        <input 
                                            type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                            placeholder="Repeat password"
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-sm text-black dark:text-white"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Profile Identity</p>
                                            <p className="text-sm font-medium text-gray-600">Choose your avatar and identity details to personalize Walia.</p>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Professional & polished</span>
                                    </div>

                                    <AvatarSelector
                                        selectedAvatar={formData.avatar}
                                        onSelect={(path) => setFormData(prev => ({ ...prev, avatar: path }))}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Username</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 transition-colors" />
                                        <input 
                                            type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                                            placeholder="Unique username"
                                            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-black focus:bg-white outline-none transition-all font-medium text-sm text-black"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Age</label>
                                        <div className="relative group">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 transition-colors" />
                                            <input 
                                                type="number" min={13} max={120} value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})}
                                                placeholder="Your age"
                                                inputMode="numeric"
                                                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-black focus:bg-white outline-none transition-all font-medium text-sm text-black"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Country</label>
                                        <div className="relative group">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 transition-colors" />
                                            <select 
                                                value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})}
                                                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white outline-none transition-all font-medium text-sm text-black dark:text-white appearance-none"
                                            >
                                                {COUNTRIES.map(c => <option key={c} value={c} className="bg-white dark:bg-[#0A0A18]">{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Phone (Optional)</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 transition-colors" />
                                        <input 
                                            type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                                            placeholder="+251..."
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white outline-none transition-all font-medium text-sm text-black dark:text-white"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">About You</label>
                                    <textarea 
                                        value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})}
                                        placeholder="What should Walia know about you?"
                                        rows={3}
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white outline-none transition-all font-medium text-sm text-black dark:text-white resize-none"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Interests</label>
                                    <div className="flex flex-wrap gap-2">
                                        {INTERESTS.map(interest => (
                                            <button
                                                key={interest}
                                                onClick={() => toggleInterest(interest)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                                                    formData.interests.includes(interest)
                                                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                                                    : 'bg-gray-50 dark:bg-white/5 text-gray-500 border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20'
                                                }`}
                                            >
                                                {interest}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="step4" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                                <div className="space-y-4">
                                    <label className="text-center block text-sm font-black text-black dark:text-white mb-6">How did you hear about us?</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {SOURCES.map(source => (
                                            <button
                                                key={source.label}
                                                onClick={() => setFormData({...formData, source: source.label})}
                                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all ${
                                                    formData.source === source.label
                                                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xl shadow-black/10'
                                                    : 'bg-gray-50 dark:bg-white/5 text-gray-500 border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                                                }`}
                                            >
                                                <source.icon className={`w-5 h-5 ${formData.source === source.label ? 'text-white dark:text-black' : 'text-gray-400'}`} />
                                                <span className="font-bold text-sm">{source.label}</span>
                                                {formData.source === source.label && <CheckCircle2 className="ml-auto w-5 h-5 text-emerald-500" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-10 flex gap-4">
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                className="flex-1 py-4 rounded-2xl border border-gray-200 dark:border-white/10 font-black text-sm text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                        )}
                        <button
                            onClick={step === 4 ? handleSubmit : handleNext}
                            disabled={loading}
                            className="flex-[2] py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    {step === 4 ? "Create Account" : "Next Step"} 
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>

                    {step === 1 && (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 font-medium">
                            Already have an account?{' '}
                            <Link href="/login" className="font-black text-black dark:text-white hover:underline transition-colors">Log in</Link>
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}