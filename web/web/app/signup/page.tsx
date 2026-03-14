'use client';

import AvatarSelector from '@/components/AvatarSelector';
import { auth, db, googleProvider } from '@/lib/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
    AlertCircle, ArrowLeft,
    BookOpen, Brain, ChevronRight, Eye, EyeOff,
    Lock, Mail, Sparkles, User
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const STEPS = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'profile', label: 'Profile', icon: Brain },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'goals', label: 'Goals', icon: Sparkles },
];

const SCHOOL_LEVELS = [
    'High School', 'Undergraduate', 'Graduate / Masters', 'PhD', 'Self-taught', 'Professional', 'Other',
];
const USE_CASES = [
    { label: 'Study & Homework Help', emoji: '📚' },
    { label: 'AI Research Assistant', emoji: '🔬' },
    { label: 'Programming & Code Help', emoji: '💻' },
    { label: 'Language Learning', emoji: '🌍' },
    { label: 'Exam Preparation', emoji: '🎯' },
    { label: 'Note Taking & Summaries', emoji: '📝' },
    { label: 'Creative Writing', emoji: '✍️' },
    { label: 'Group Study & Collaboration', emoji: '🤝' },
];

function GoogleIcon({ size = 5 }: { size?: number }) {
    return (
        <svg className={`w-${size} h-${size} shrink-0`} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

const INPUT_BASE = "w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 outline-none text-sm font-medium text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 transition-all";
const SELECT_BASE = "w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white outline-none text-sm font-medium text-black dark:text-white transition-all appearance-none cursor-pointer";

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');

    const [schoolLevel, setSchoolLevel] = useState('');
    const [school, setSchool] = useState('');
    const [useCases, setUseCases] = useState<string[]>([]);
    const [avatar, setAvatar] = useState('/avatars/avatar1.jpg');

    const toggleUseCase = (label: string) => {
        setUseCases(prev => prev.includes(label) ? prev.filter(u => u !== label) : [...prev, label]);
    };

    const saveProfileAndRedirect = async (uid: string, displayName: string, photoURL?: string) => {
        try {
            await setDoc(doc(db, 'users', uid), {
                name: displayName,
                username: username || displayName.toLowerCase().replace(/\s+/g, ''),
                email: auth.currentUser?.email || email,
                photoURL: photoURL || avatar,
                gender, age, phone, country, schoolLevel, school, useCases,
                plan: 'free',
                createdAt: serverTimestamp(),
            });
            window.location.href = '/dashboard';
        } catch {
            window.location.href = '/dashboard';
        }
    };

    const handleGoogle = async () => {
        setError(''); setGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) { router.replace('/dashboard'); return; }
            await saveProfileAndRedirect(user.uid, user.displayName || user.email?.split('@')[0] || 'User', user.photoURL || undefined);
        } catch (err: any) {
            if (err?.code !== 'auth/popup-closed-by-user') setError('Google sign-in failed. Please try again.');
        } finally { setGoogleLoading(false); }
    };

    const handleFinalSubmit = async () => {
        setError(''); setLoading(true);
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            try { await updateProfile(cred.user, { displayName: name, photoURL: avatar }); } catch { /* ignore */ }
            await saveProfileAndRedirect(cred.user.uid, name, avatar);
        } catch (err: any) {
            setError(err.message?.replace('Firebase: ', '') || 'Failed to create account.');
            setLoading(false);
        }
    };

    const next = async () => {
        setError('');
        if (step === 0) {
            if (!name.trim()) { setError('Enter your full name.'); return; }
            if (username.trim()) {
                const { checkUsernameUnique } = await import('@/lib/user');
                setLoading(true);
                try {
                    const isUnique = await checkUsernameUnique(username);
                    if (!isUnique) { setError('Username is already taken.'); setLoading(false); return; }
                } finally { setLoading(false); }
            }
            if (!email.trim()) { setError('Enter your email.'); return; }
            if (password.length < 6) { setError('Password must be 6+ characters.'); return; }
        }
        if (step === STEPS.length - 1) { handleFinalSubmit(); return; }
        setStep(s => s + 1);
    };

    const isLastStep = step === STEPS.length - 1;

    const optionBtnClass = (active: boolean) =>
        `py-2.5 px-3 rounded-2xl text-[10px] font-bold border text-left transition-all ${active
            ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-md'
            : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20'}`;

    return (
        <main className="min-h-screen w-full flex bg-white dark:bg-[#0A0A18] transition-colors duration-300">

            {/* ── LEFT PANEL (desktop) ── */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#0A101D] p-14 relative overflow-hidden">
                <div className="absolute -left-20 bottom-10 text-[500px] font-black leading-none text-white/[0.03] tracking-tighter pointer-events-none select-none">W</div>

                <Link href="/" className="flex items-center gap-3 group relative z-10">
                    <div className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center font-black text-xl shadow-lg">W</div>
                    <span className="text-white font-black text-xl tracking-widest uppercase">Walia</span>
                </Link>

                <div className="relative z-10 space-y-6">
                    <div>
                        <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-3">
                            Start Your<br />AI Journey
                        </h2>
                        <p className="text-white/50 font-medium text-sm leading-relaxed max-w-xs">
                            Join thousands of students already studying smarter with Walia.
                        </p>
                    </div>

                    {/* Step indicators */}
                    <div className="space-y-3">
                        {STEPS.map((s, i) => {
                            const Icon = s.icon;
                            const done = i < step;
                            const active = i === step;
                            return (
                                <div key={s.id} className={`flex items-center gap-3 transition-all ${active ? 'opacity-100' : done ? 'opacity-60' : 'opacity-20'}`}>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-white' : 'bg-white/10'}`}>
                                        <Icon className={`w-4 h-4 ${active ? 'text-black' : 'text-white'}`} />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold ${active ? 'text-white' : 'text-white/70'}`}>{s.label}</p>
                                        <p className="text-[10px] text-white/30 font-medium">Step {i + 1}</p>
                                    </div>
                                    {done && <span className="ml-auto text-[10px] font-black text-emerald-400 uppercase tracking-widest">✓ Done</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <p className="text-white/20 text-xs font-bold relative z-10">© 2026 Walia AI · Privacy Policy</p>
            </div>

            {/* ── RIGHT PANEL: Form ── */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-12 relative">
                {/* Mobile logo */}
                <Link href="/" className="lg:hidden absolute top-7 left-6 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-[10px] bg-black dark:bg-white flex items-center justify-center font-black text-white dark:text-black text-base shadow-md">W</div>
                    <span className="text-black dark:text-white font-black text-lg tracking-widest uppercase">Walia</span>
                </Link>

                <div className="w-full max-w-[420px] bg-white dark:bg-transparent rounded-[32px] p-6 md:p-8 overflow-y-auto max-h-[90vh] custom-scrollbar">

                    {/* Step header + back */}
                    <div className="flex items-center gap-3 mb-4">
                        {step > 0 && (
                            <button onClick={() => setStep(s => s - 1)} className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                                <ArrowLeft className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                            </button>
                        )}
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Step {step + 1} of {STEPS.length}</p>
                    </div>

                    {/* Progress */}
                    <div className="flex gap-1.5 mb-6">
                        {STEPS.map((_, i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-black dark:bg-white' : 'bg-gray-100 dark:bg-white/10'}`} />
                        ))}
                    </div>

                    <h2 className="text-2xl font-black text-black dark:text-white tracking-tight mb-1">
                        {['Create your account', 'Personalize profile', 'Academic background', 'Define your goals'][step]}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-6">
                        {['Basic details to get started.', 'Tell us about yourself.', "Tailoring to your level.", 'What are you aiming to achieve?'][step]}
                    </p>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-2 text-red-600 dark:text-red-400 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> <span className="font-medium">{error}</span>
                        </div>
                    )}

                    {/* ── STEP 0 ── */}
                    {step === 0 && (
                        <div className="space-y-3">
                            <button onClick={handleGoogle} disabled={googleLoading}
                                className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10 transition-all font-bold text-gray-700 dark:text-white text-sm disabled:opacity-50 shadow-sm"
                            >
                                {googleLoading ? <div className="w-4 h-4 border-2 border-gray-300 border-t-black dark:border-t-white rounded-full animate-spin" /> : <GoogleIcon size={4} />}
                                <span>Sign up with Google</span>
                            </button>
                            <div className="flex items-center gap-3 py-1">
                                <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
                                <span className="text-[10px] font-bold text-gray-300 dark:text-white/20 uppercase tracking-widest">or email</span>
                                <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
                            </div>
                            {[
                                { label: 'Full Name', val: name, set: setName, type: 'text', ph: 'Your full name', Icon: User },
                                { label: 'Username', val: username, set: setUsername, type: 'text', ph: '@unique_handle', Icon: User },
                                { label: 'Email', val: email, set: setEmail, type: 'email', ph: 'name@example.com', Icon: Mail },
                            ].map(({ label, val, set, type, ph, Icon }) => (
                                <div key={label} className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">{label}</label>
                                    <div className="relative group">
                                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                                        <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph} className={INPUT_BASE} />
                                    </div>
                                </div>
                            ))}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={INPUT_BASE + ' pr-12'} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 1 ── */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <AvatarSelector selectedAvatar={avatar} onSelect={setAvatar} />
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Gender</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Male', 'Female', 'Other'].map(g => (
                                        <button key={g} type="button" onClick={() => setGender(g)} className={optionBtnClass(gender === g) + ' justify-center text-center'}>{g}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Age</label>
                                <select value={age} onChange={e => setAge(e.target.value)} className={SELECT_BASE}>
                                    <option value="" disabled>Select your age</option>
                                    {Array.from({ length: 69 }, (_, i) => i + 12).map(num => <option key={num} value={num}>{num}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Country</label>
                                <input type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. Ethiopia" className="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white outline-none text-sm font-medium text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white outline-none text-sm font-medium text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 transition-all" />
                            </div>
                        </div>
                    )}

                    {/* ── STEP 2 ── */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Education Level</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SCHOOL_LEVELS.map(lvl => (
                                        <button key={lvl} type="button" onClick={() => setSchoolLevel(lvl)} className={optionBtnClass(schoolLevel === lvl)}>{lvl}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Institution</label>
                                <input type="text" value={school} onChange={e => setSchool(e.target.value)} placeholder="e.g. Oxford University" className="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white outline-none text-sm font-medium text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 transition-all" />
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3 ── */}
                    {step === 3 && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Primary usage goals</label>
                            <div className="grid grid-cols-2 gap-2">
                                {USE_CASES.map(({ label, emoji }) => (
                                    <button key={label} type="button" onClick={() => toggleUseCase(label)} className={optionBtnClass(useCases.includes(label)) + ' flex items-center gap-2'}>
                                        <span>{emoji}</span> {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <button onClick={next} disabled={loading || googleLoading}
                        className="mt-8 w-full py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-gray-100 active:scale-[0.98] transition-all shadow-lg shadow-black/10 disabled:opacity-50 text-sm"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" /> :
                            isLastStep ? <><span>Get Started</span> <Sparkles className="w-4 h-4" /></> :
                                <><span>Continue</span> <ChevronRight className="w-4 h-4" /></>}
                    </button>

                    {step === 0 && (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
                            Already have an account?{' '}
                            <Link href="/login" className="font-black text-black dark:text-white hover:underline">Sign in</Link>
                        </p>
                    )}
                    <p className="text-center text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-4 leading-relaxed">
                        Agree to our <Link href="/legal/terms" className="underline">Terms</Link> & <Link href="/legal/privacy" className="underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
