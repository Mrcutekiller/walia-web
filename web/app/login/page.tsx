'use client';

import { auth, db, googleProvider } from '@/lib/firebase';
import {
    signInWithEmailAndPassword,
    signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

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
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const redirect = searchParams.get('redirect');

            if (userCredential.user.email === 'admin@walia.com') {
                router.replace('/admin');
            } else if (redirect === 'review') {
                router.replace('/dashboard/ai');
            } else {
                router.replace('/dashboard');
            }
        } catch (err: any) {
            console.warn("Login error:", err.message);
            setError('Invalid email or password. Please try again.');
        } finally { setLoading(false); }
    };

    const handleGoogle = async () => {
        setError(''); setGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (!userDoc.exists()) {
                // Auto-create basic profile for new Google users gracefully
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName || user.email?.split('@')[0] || 'User',
                    username: user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') || `user${Math.floor(Math.random() * 10000)}`,
                    email: user.email,
                    photoURL: user.photoURL || '/avatars/avatar1.jpg',
                    plan: 'free',
                    theme: 'light',
                    createdAt: serverTimestamp(),
                });
            }

            // Small delay to ensure auth state and firestore syncs
            await new Promise(r => setTimeout(r, 500));

            const redirect = searchParams.get('redirect');
            if (redirect === 'review') {
                router.replace('/dashboard/ai');
            } else {
                router.replace('/dashboard');
            }
        } catch (err: any) {
            if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
                if (err?.code !== 'unavailable') {
                    console.error("Google sign-in error:", err);
                }
                setError(err.message?.includes('auth/operation-not-supported')
                    ? 'Google sign-in is not enabled. Please use email/password.'
                    : 'Google sign-in failed. Please verify your internet connection or try again.');
            }
        } finally { setGoogleLoading(false); }
    };

    return (
        <main className="h-screen w-screen overflow-hidden relative bg-[#F8FAFC] flex items-center justify-center p-6 selection:bg-indigo-100 selection:text-indigo-900">
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

            {/* ── LOGIN CARD ── */}
            <div className="w-full max-w-[420px] relative z-10 flex flex-col items-center">
                <div className="w-full bg-white border border-slate-200 rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 md:p-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome back</h2>
                        <p className="text-slate-500 font-medium text-sm">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-red-600 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Google Button */}
                    <button
                        onClick={handleGoogle}
                        disabled={googleLoading || loading}
                        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm disabled:opacity-50 shadow-sm"
                    >
                        {googleLoading ? (
                            <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        <span className="tracking-tight">Sign in with Google</span>
                    </button>

                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or sign in with email</span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="name@example.com" required
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between ml-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                                <button type="button" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••" required
                                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit" disabled={loading || googleLoading}
                            className="w-full mt-4 py-4 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 text-sm"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign in to Walia <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-8">
                        New to Walia?{' '}
                        <Link href="/signup" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Create account</Link>
                    </p>
                </div>

                <div className="mt-8 flex items-center gap-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Walia AI</p>
                    <div className="h-4 w-px bg-slate-200" />
                    <Link href="/legal/privacy" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">Privacy Policy</Link>
                </div>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}


