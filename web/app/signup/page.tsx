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
            const user = result.user;

            // Check if user already exists
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (userDoc.exists()) {
                // They already have an account, just redirect them
                router.replace('/dashboard');
                return;
            }

            // New user, create profile
            await saveProfileAndRedirect(
                user.uid,
                user.displayName || user.email?.split('@')[0] || 'User',
                user.photoURL || undefined
            );
        } catch (err: any) {
            console.error("Google sign-in error:", err);
            if (err?.code !== 'auth/popup-closed-by-user') {
                setError(err.message?.includes('auth/operation-not-supported')
                    ? 'Google sign-in is not enabled. Please use email/password.'
                    : 'Google sign-in failed. Please verify your internet connection or try again.');
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

    const next = async () => {
        setError('');
        if (step === 0) {
            if (!name.trim()) { setError('Enter your full name.'); return; }
            if (username.trim()) {
                const { checkUsernameUnique } = await import('@/lib/user');
                setLoading(true);
                try {
                    const isUnique = await checkUsernameUnique(username);
                    if (!isUnique) { setError('Username is already taken.'); return; }
                } catch (err) {
                    console.error("Username check error:", err);
                } finally {
                    setLoading(true); // Keep loading state if we are moving to next step? No.
                    setLoading(false);
                }
            }
            if (!email.trim()) { setError('Enter your email.'); return; }
            if (password.length < 6) { setError('Password must be 6+ characters.'); return; }
        }
        if (step === STEPS.length - 1) { handleFinalSubmit(); return; }
        setStep(s => s + 1);
    };

    const isLastStep = step === STEPS.length - 1;

    return (
        <main className="h-screen w-screen overflow-hidden relative bg-[#F8FAFC] flex items-center justify-center p-6 transition-colors duration-300">
            {/* Professional Background Gradient */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Logo top-left */}
            <Link href="/" className="absolute top-8 left-8 z-20 flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center transition-all group-hover:border-indigo-500 group-hover:shadow-indigo-500/10">
                    <Image src="/walia-logo.png" alt="Walia" width={24} height={24} className="object-contain" />
                </div>
                <span className="text-slate-900 font-extrabold text-xl tracking-tight">Walia</span>
            </Link>

            {/* ── SIGNUP CARD ── */}
            <div className="w-full max-w-[440px] relative z-10 flex flex-col items-center">
                <div className="w-full bg-white border border-slate-200 rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 md:p-10 overflow-y-auto max-h-[85vh] custom-scrollbar">

                    {/* Header + back */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            {step > 0 && (
                                <button onClick={() => setStep(s => s - 1)} className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
                                    <ArrowLeft className="w-4 h-4 text-slate-500" />
                                </button>
                            )}
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Step {step + 1} of {STEPS.length}</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="flex gap-2 mb-8">
                        {STEPS.map((_, i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-indigo-600' : 'bg-slate-100'}`} />
                        ))}
                    </div>

                    {/* Step title */}
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">
                        {step === 0 && 'Create your account'}
                        {step === 1 && 'Personalize profile'}
                        {step === 2 && 'Academic background'}
                        {step === 3 && 'Define your goals'}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium mb-8">
                        {step === 0 && 'Basic details to get you started.'}
                        {step === 1 && 'Tell us a bit about yourself.'}
                        {step === 2 && "Tailoring experience to your level."}
                        {step === 3 && 'What are you aiming to achieve?'}
                    </p>

                    {error && (
                        <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-red-600 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> <span>{error}</span>
                        </div>
                    )}

                    {/* ══ STEP 0: Account ══ */}
                    {step === 0 && (
                        <div className="space-y-3">
                            <button
                                onClick={handleGoogle} disabled={googleLoading}
                                className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm disabled:opacity-50 shadow-sm"
                            >
                                {googleLoading ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                )}
                                <span className="tracking-tight">Sign up with Google</span>
                            </button>
                            <div className="flex items-center gap-4 py-2">
                                <div className="flex-1 h-px bg-slate-100" />
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">or email</span>
                                <div className="flex-1 h-px bg-slate-100" />
                            </div>
                            {[
                                { label: 'Full Name', val: name, set: setName, type: 'text', ph: 'Professional Name', Icon: User },
                                { label: 'Username', val: username, set: setUsername, type: 'text', ph: '@unique_handle', Icon: User },
                                { label: 'Email', val: email, set: setEmail, type: 'email', ph: 'name@work.com', Icon: Mail },
                                { label: 'Password', val: password, set: setPassword, type: 'password', ph: '••••••••', Icon: Lock },
                            ].map(({ label, val, set, type, ph, Icon }) => (
                                <div key={label} className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
                                    <div className="relative group">
                                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph}
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ══ STEP 1: Profile ══ */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <AvatarSelector selectedAvatar={avatar} onSelect={setAvatar} />

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Male', 'Female', 'Other'].map(g => (
                                        <button key={g} type="button" onClick={() => setGender(g)}
                                            className={`py-3 rounded-2xl text-xs font-bold border transition-all ${gender === g ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-white'}`}
                                        >{g}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Current Age</label>
                                <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 24" min={10} max={80}
                                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all" />
                            </div>
                        </div>
                    )}

                    {/* ══ STEP 2: Education ══ */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Education Level</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SCHOOL_LEVELS.map(lvl => (
                                        <button key={lvl} type="button" onClick={() => setSchoolLevel(lvl)}
                                            className={`py-3 px-4 rounded-2xl text-[11px] font-bold border text-left transition-all ${schoolLevel === lvl ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-white'}`}
                                        >{lvl}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Institution Name</label>
                                <input type="text" value={school} onChange={e => setSchool(e.target.value)} placeholder="e.g. Oxford University"
                                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all" />
                            </div>
                        </div>
                    )}

                    {/* ══ STEP 3: Goals ══ */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Primary usage objective</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {USE_CASES.map(({ label, emoji }) => (
                                        <button key={label} type="button" onClick={() => toggleUseCase(label)}
                                            className={`py-2.5 px-3 rounded-2xl text-[10px] font-bold border text-left flex items-center gap-2 transition-all ${useCases.includes(label) ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-white'}`}
                                        ><span>{emoji}</span> {label}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Why Walia?</label>
                                <textarea value={whyWalia} onChange={e => setWhyWalia(e.target.value)} placeholder="Briefly describe your goals..." rows={2}
                                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none text-sm font-medium text-slate-900 resize-none transition-all" />
                            </div>
                        </div>
                    )}

                    {/* Next / Finish */}
                    <button onClick={next} disabled={loading || googleLoading}
                        className="mt-8 w-full py-4 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 text-sm"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> :
                            isLastStep ? <>Get Started <Sparkles className="w-4 h-4" /></> :
                                <>Continue <ChevronRight className="w-4 h-4" /></>}
                    </button>

                    {step === 0 && (
                        <p className="text-center text-sm text-slate-500 mt-6">
                            Already have an account? <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Sign in</Link>
                        </p>
                    )}
                    <div className="mt-6 flex flex-col items-center gap-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">© 2026 Walia AI</p>
                        <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                            Agree to our <Link href="/legal/terms" className="text-slate-500 underline hover:text-indigo-600">Terms</Link> & <Link href="/legal/privacy" className="text-slate-500 underline hover:text-indigo-600">Privacy Policy</Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}


