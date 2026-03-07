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
            console.error("Login error:", err);
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
            console.error("Google sign-in error:", err);
            if (err?.code !== 'auth/popup-closed-by-user') {
                setError(err.message?.includes('auth/operation-not-supported')
                    ? 'Google sign-in is not enabled. Please use email/password.'
                    : 'Google sign-in failed. Please verify your internet connection or try again.');
            }
        } finally { setGoogleLoading(false); }
    };

    return (
        <main className="h-screen w-screen overflow-hidden relative bg-gray-50 dark:bg-[#0A0A18] transition-colors duration-300">
            {/* Logo top-left */}
            <Link href="/" className="absolute top-5 left-5 z-20 flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
                    <Image src="/walia-logo.png" alt="Walia" width={28} height={28} className="object-contain" />
                </div>
                <span className="text-white font-black text-lg tracking-tighter">Walia</span>
            </Link>

            {/* Brand text — bottom left on desktop, top area on mobile */}
            <div className="absolute bottom-10 left-8 z-10 hidden md:block">
                <p className="text-black/40 dark:text-white/40 text-[10px] font-black uppercase tracking-[0.5em] mb-2">From the Mountains of Ethiopia</p>
                <h1 className="text-5xl font-black text-black dark:text-white tracking-tight leading-tight">
                    Climb Higher.<br />Think Smarter.
                </h1>
            </div>

            {/* ── LOGIN CARD ── */}
            <div className="absolute inset-0 z-10 flex items-end pb-8 justify-center md:items-center md:pb-0 md:justify-end md:pr-20">
                <div className="w-[85%] max-w-sm bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/30 p-5 sm:p-6 md:p-8 overflow-y-auto max-h-[80vh]">

                    <div className="mb-4 md:mb-6">
                        <h2 className="text-xl md:text-2xl font-black text-black tracking-tight mb-0.5">Welcome back</h2>
                        <p className="text-gray-400 font-medium text-xs">Log in to continue your journey.</p>
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
                        className="w-full flex items-center justify-center gap-2 py-3 md:py-3.5 rounded-xl bg-white border-2 border-gray-200 hover:border-black/30 hover:shadow-lg transition-all font-bold text-black text-sm disabled:opacity-50"
                    >
                        {googleLoading ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                                <input
                                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="name@example.com" required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-black outline-none text-sm font-medium text-black placeholder:text-gray-300 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                                <button type="button" className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors">Forgot?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••" required
                                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-black outline-none text-sm font-medium text-black placeholder:text-gray-300 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit" disabled={loading || googleLoading}
                            className="w-full py-3 rounded-xl bg-black text-white font-black flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg disabled:opacity-50 text-sm"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Log In <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        Don't have an account?{' '}
                        <Link href="/signup" className="font-bold text-black hover:underline">Create one free</Link>
                    </p>
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


