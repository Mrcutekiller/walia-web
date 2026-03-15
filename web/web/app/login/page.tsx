'use client';

import { auth, db, googleProvider } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { AlertCircle, ArrowRight, Brain, Eye, EyeOff, Lock, Mail, Sparkles, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

const FEATURES = [
    { icon: Brain, title: 'AI Study Assistant', desc: 'Instant answers powered by advanced AI.' },
    { icon: Sparkles, title: 'Smart Tools', desc: 'Summarize, quiz, translate & more.' },
    { icon: Users, title: 'Community', desc: 'Study with peers globally.' },
];

function GoogleIcon() {
    return (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            const redirect = searchParams.get('redirect');
            if (cred.user.email === 'admin@walia.com') router.replace('/admin');
            else if (redirect === 'review') router.replace('/dashboard/ai');
            else router.replace('/dashboard');
        } catch {
            setError('Invalid email or password. Please try again.');
        } finally { setLoading(false); }
    };

    const handleGoogle = async () => {
        setError(''); setGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName || user.email?.split('@')[0] || 'User',
                    username: user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') || `user${Math.floor(Math.random() * 10000)}`,
                    email: user.email,
                    photoURL: user.photoURL || '/avatars/avatar1.jpg',
                    plan: 'free',
                    createdAt: serverTimestamp(),
                });
            }
            await new Promise(r => setTimeout(r, 500));
            const redirect = searchParams.get('redirect');
            router.replace(redirect === 'review' ? '/dashboard/ai' : '/dashboard');
        } catch (err: any) {
            if (err?.code !== 'auth/popup-closed-by-user') {
                setError('Google sign-in failed. Please try again.');
            }
        } finally { setGoogleLoading(false); }
    };

    return (
        <main className="min-h-screen w-full flex bg-white dark:bg-[#0A0A18] transition-colors duration-300">

            {/* ── LEFT PANEL (desktop only) ── */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#0A101D] p-14 relative overflow-hidden">
                {/* Background Logo */}
                <div className="absolute -left-20 bottom-10 select-none pointer-events-none opacity-[0.03] grayscale">
                    <Image src="/walia-logo.png" alt="" width={400} height={400} unoptimized className="object-contain" />
                </div>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group relative z-10">
                    <div className="w-10 h-10 rounded-[10px] bg-white border border-white/10 flex items-center justify-center shadow-lg font-black text-xl leading-none overflow-hidden group-hover:scale-105 transition-transform">
                        <Image src="/walia-logo.png" alt="Walia" width={28} height={28} unoptimized className="object-contain" />
                    </div>
                    <span className="text-white font-black text-xl tracking-widest uppercase">Walia</span>
                </Link>

                {/* Feature highlights */}
                <div className="relative z-10 space-y-8">
                    <div>
                        <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-3">
                            Your AI Study<br />Companion
                        </h2>
                        <p className="text-white/50 font-medium text-sm leading-relaxed max-w-xs">
                            Built for students who want to learn smarter, not harder.
                        </p>
                    </div>
                    <div className="space-y-4">
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">{title}</p>
                                    <p className="text-white/40 text-xs font-medium mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-white/20 text-xs font-bold relative z-10">© 2026 Walia AI · Privacy Policy</p>
            </div>

            {/* ── RIGHT PANEL: Form ── */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-16 relative">
                {/* Mobile logo */}
                <Link href="/" className="lg:hidden absolute top-7 left-6 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-[10px] bg-white border border-gray-100 dark:border-white/10 flex items-center justify-center shadow-md font-black text-base overflow-hidden">
                        <Image src="/walia-logo.png" alt="Walia" width={24} height={24} unoptimized className="object-contain" />
                    </div>
                    <span className="text-black dark:text-white font-black text-lg tracking-widest uppercase">Walia</span>
                </Link>

                <div className="w-full max-w-[400px]">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-black dark:text-white tracking-tight mb-2">Welcome back</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Sign in to continue to Walia.</p>
                    </div>

                    {error && (
                        <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-2 text-red-600 dark:text-red-400 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    {/* Google */}
                    <button
                        onClick={handleGoogle}
                        disabled={googleLoading || loading}
                        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10 transition-all font-bold text-gray-700 dark:text-white text-sm disabled:opacity-50 shadow-sm"
                    >
                        {googleLoading ? <div className="w-5 h-5 border-2 border-gray-300 border-t-black dark:border-t-white rounded-full animate-spin" /> : <GoogleIcon />}
                        <span>Continue with Google</span>
                    </button>

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">or email</span>
                        <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                                <input
                                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="name@example.com" required
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 outline-none text-sm font-medium text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between ml-1">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Password</label>
                                <button type="button" className="text-[10px] font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">Forgot password?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••" required
                                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 outline-none text-sm font-medium text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit" disabled={loading || googleLoading}
                            className="w-full mt-2 py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-gray-100 active:scale-[0.98] transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" /> : <><span>Sign in to Walia</span> <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-7">
                        New to Walia?{' '}
                        <Link href="/signup" className="font-black text-black dark:text-white hover:underline transition-colors">Create account</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen bg-white dark:bg-[#0A0A18] flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-black dark:border-t-white rounded-full animate-spin" /></div>}>
            <LoginContent />
        </Suspense>
    );
}
