'use client';

import AvatarSelector from '@/components/AvatarSelector';
import { auth, db, googleProvider } from '@/lib/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    updateProfile
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
    AlertCircle, ArrowLeft,
    BookOpen, Brain, ChevronRight, Loader2,
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
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [schoolLevel, setSchoolLevel] = useState('');
    const [school, setSchool] = useState('');
    const [useCases, setUseCases] = useState<string[]>([]);
    const [whyWalia, setWhyWalia] = useState('');
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
                gender, age, schoolLevel, school, useCases, whyWalia,
                plan: 'free',
                createdAt: serverTimestamp(),
            });
            // Small delay to ensure Firestore sync before redirect
            await new Promise(r => setTimeout(r, 500));
            router.replace('/dashboard');
        } catch (err: any) {
            console.error("Firestore save error:", err);
            setError("Account created, but failed to save profile. You can update it later in settings.");
            // Still redirect so they aren't stuck
            router.replace('/dashboard');
        }
    };

    const handleGoogle = async () => {
        setError(''); setGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await saveProfileAndRedirect(result.user.uid, result.user.displayName || result.user.email?.split('@')[0] || 'User', result.user.photoURL || undefined);
        } catch (err: any) {
            console.error("Google sign-in error:", err);
            if (err?.code !== 'auth/popup-closed-by-user') {
                setError(err.message?.includes('auth/operation-not-supported')
                    ? 'Google sign-in is not enabled. Please use email/password.'
                    : 'Google sign-in failed. Please try again.');
            }
        } finally { setGoogleLoading(false); }
    };

    const handleFinalSubmit = async () => {
        setError(''); setLoading(true);
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);

            // Try updating profile, but don't block everything if it fails
            try {
                await updateProfile(cred.user, {
                    displayName: name,
                    photoURL: avatar
                });
            } catch (pErr) {
                console.warn("Profile update failed:", pErr);
            }

            await saveProfileAndRedirect(cred.user.uid, name, avatar);
        } catch (err: any) {
            console.error("Signup error:", err);
            setError(err.message?.replace('Firebase: ', '') || 'Failed to create account.');
            setLoading(false);
        }
    };

    const next = () => {
        setError('');
        if (step === 0) {
            if (!name.trim()) { setError('Enter your full name.'); return; }
            if (!email.trim()) { setError('Enter your email.'); return; }
            if (password.length < 6) { setError('Password must be 6+ characters.'); return; }
        }
        if (step === STEPS.length - 1) { handleFinalSubmit(); return; }
        setStep(s => s + 1);
    };

    const isLastStep = step === STEPS.length - 1;

    return (
        <main className="h-screen w-screen overflow-hidden relative">

            {/* ── FULLSCREEN VIDEO BACKGROUND ── */}
            <video
                autoPlay muted loop playsInline
                className="absolute inset-0 w-full h-full object-cover"
                src="/3d-logo.mp4"
            />
            <div className="absolute inset-0 bg-black/50" />

            {/* Logo top-left */}
            <Link href="/" className="absolute top-5 left-5 z-20 flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
                    <Image src="/walia-logo.png" alt="Walia" width={28} height={28} className="object-contain" />
                </div>
                <span className="text-white font-black text-lg tracking-tighter">Walia</span>
            </Link>

            {/* Brand text — bottom right on desktop */}
            <div className="absolute bottom-10 right-8 z-10 text-right hidden md:block">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] mb-2">Walia AI</p>
                <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
                    Your AI study<br />companion.
                </h1>
            </div>

            {/* ── SIGNUP CARD ── */}
            {/* Desktop: left side, vertically centered */}
            {/* Mobile: centered on screen, floating over video */}
            <div className="absolute inset-0 z-10 flex items-end pb-6 justify-center md:items-center md:pb-0 md:justify-start md:pl-20">
                <div className="w-[85%] max-w-sm bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/30 p-5 sm:p-6 md:p-8 overflow-y-auto max-h-[78vh]">

                    {/* Header + back */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {step > 0 && (
                                <button onClick={() => setStep(s => s - 1)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <ArrowLeft className="w-3.5 h-3.5 text-gray-500" />
                                </button>
                            )}
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step {step + 1}/{STEPS.length}</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="flex gap-1.5 mb-4">
                        {STEPS.map((_, i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-black' : 'bg-gray-200'}`} />
                        ))}
                    </div>

                    {/* Step title */}
                    <h2 className="text-xl md:text-2xl font-black text-black tracking-tight mb-1">
                        {step === 0 && 'Create your account'}
                        {step === 1 && 'Tell us about yourself'}
                        {step === 2 && 'Your education'}
                        {step === 3 && 'Your goals with Walia'}
                    </h2>
                    <p className="text-gray-400 text-xs mb-4">
                        {step === 0 && 'Set up your login credentials.'}
                        {step === 1 && 'Help us personalise your experience.'}
                        {step === 2 && "We'll tailor tools to your level."}
                        {step === 3 && 'What will you use Walia for?'}
                    </p>

                    {error && (
                        <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-red-600 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> <span>{error}</span>
                        </div>
                    )}

                    {/* ══ STEP 0: Account ══ */}
                    {step === 0 && (
                        <div className="space-y-2.5">
                            <button
                                onClick={handleGoogle} disabled={googleLoading}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border-2 border-gray-200 hover:border-black/30 hover:shadow-lg transition-all font-bold text-black text-sm disabled:opacity-50"
                            >
                                {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                )}
                                Sign up with Google
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-[10px] font-black text-gray-300 uppercase">or</span>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>
                            {[
                                { label: 'Full Name', val: name, set: setName, type: 'text', ph: 'John Doe', Icon: User },
                                { label: 'Username', val: username, set: setUsername, type: 'text', ph: '@yourname (optional)', Icon: User },
                                { label: 'Email', val: email, set: setEmail, type: 'email', ph: 'john@example.com', Icon: Mail },
                                { label: 'Password', val: password, set: setPassword, type: 'password', ph: '6+ characters', Icon: Lock },
                            ].map(({ label, val, set, type, ph, Icon }) => (
                                <div key={label} className="space-y-0.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
                                    <div className="relative group">
                                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                                        <input
                                            type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph}
                                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50/80 border border-gray-200 focus:border-black outline-none text-sm font-medium text-black placeholder:text-gray-300 transition-colors"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ══ STEP 1: Profile ══ */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <AvatarSelector selectedAvatar={avatar} onSelect={setAvatar} />

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gender</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Male', 'Female', 'Other'].map(g => (
                                        <button key={g} type="button" onClick={() => setGender(g)}
                                            className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${gender === g ? 'bg-black text-white border-black' : 'bg-gray-50/80 border-gray-200 text-gray-500 hover:border-gray-400'}`}
                                        >{g}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Age</label>
                                <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 21" min={10} max={80}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50/80 border border-gray-200 focus:border-black outline-none text-sm font-medium text-black transition-colors" />
                            </div>
                        </div>
                    )}

                    {/* ══ STEP 2: Education ══ */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Education Level</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SCHOOL_LEVELS.map(lvl => (
                                        <button key={lvl} type="button" onClick={() => setSchoolLevel(lvl)}
                                            className={`py-2.5 px-3 rounded-xl text-xs font-bold border-2 text-left transition-all ${schoolLevel === lvl ? 'bg-black text-white border-black' : 'bg-gray-50/80 border-gray-200 text-gray-500 hover:border-gray-400'}`}
                                        >{lvl}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">School / University</label>
                                <input type="text" value={school} onChange={e => setSchool(e.target.value)} placeholder="e.g. Addis Ababa University"
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50/80 border border-gray-200 focus:border-black outline-none text-sm font-medium text-black transition-colors" />
                            </div>
                        </div>
                    )}

                    {/* ══ STEP 3: Goals ══ */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">What will you use Walia for?</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {USE_CASES.map(({ label, emoji }) => (
                                        <button key={label} type="button" onClick={() => toggleUseCase(label)}
                                            className={`py-2 px-3 rounded-xl text-xs font-bold border-2 text-left flex items-center gap-1.5 transition-all ${useCases.includes(label) ? 'bg-black text-white border-black' : 'bg-gray-50/80 border-gray-200 text-gray-500 hover:border-gray-400'}`}
                                        ><span>{emoji}</span> {label}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Why Walia?</label>
                                <textarea value={whyWalia} onChange={e => setWhyWalia(e.target.value)} placeholder="I need an AI study assistant because..." rows={2}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-200 focus:border-black outline-none text-sm font-medium text-black resize-none transition-colors" />
                            </div>
                        </div>
                    )}

                    {/* Next / Finish */}
                    <button onClick={next} disabled={loading || googleLoading}
                        className="mt-4 w-full py-3 rounded-xl bg-black text-white font-black flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg disabled:opacity-50 text-sm"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> :
                            isLastStep ? <>Finish & Start <Sparkles className="w-4 h-4" /></> :
                                <>Continue <ChevronRight className="w-4 h-4" /></>}
                    </button>

                    {step === 0 && (
                        <p className="text-center text-xs text-gray-400 mt-3">
                            Have an account? <Link href="/login" className="font-bold text-black hover:underline">Log in</Link>
                        </p>
                    )}
                    <p className="text-center text-[10px] text-gray-300 mt-2">
                        By signing up you agree to our <Link href="/legal/terms" className="underline">Terms</Link> & <Link href="/legal/privacy" className="underline">Privacy</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}


