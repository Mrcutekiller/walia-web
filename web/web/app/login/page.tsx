'use client';

import { motion } from 'framer-motion';
import { 
    Mail, Lock, ArrowRight, X, Eye, EyeOff, Sparkles, User, 
    ArrowLeft, Github, Chrome
} from 'lucide-react';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

function LoginContent() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { login, loginWithGoogle } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(identifier, password);
            router.push('/dashboard/ai');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            await loginWithGoogle();
            router.push('/dashboard/ai');
        } catch (err: any) {
            setError(err.message || 'Google sign-in failed');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white dark:bg-[#07070F] flex items-center justify-center p-6 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-black dark:bg-white rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-12">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="p-8 md:p-12 rounded-[2.5rem] bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-gray-100 dark:border-white/10 shadow-2xl shadow-black/5">
                    <div className="text-center mb-10">
                        <Image src="/logo.png" alt="Walia" width={64} height={64} className="mx-auto mb-6" unoptimized />
                        <h1 className="text-3xl font-black tracking-tighter text-black dark:text-white mb-2 uppercase">Welcome Back</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Continue your journey with Walia.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-3 animate-shake">
                            <X className="w-4 h-4 shrink-0" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Email</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                                <input 
                                    type="text" required value={identifier} onChange={e => setIdentifier(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-sm text-black dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Password</label>
                                <Link href="/forgot-password" title="Feature coming soon" className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                                <input 
                                    type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-sm text-black dark:text-white"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit" disabled={loading || googleLoading}
                            className="w-full mt-2 py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                            ) : (
                                <><span>Sign in to Walia</span> <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <div className="my-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">or continue with</span>
                        <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
                    </div>

                    <button 
                        onClick={handleGoogleLogin} disabled={loading || googleLoading}
                        className="w-full py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-black dark:text-white font-bold text-sm flex items-center justify-center gap-3 hover:bg-gray-100 dark:hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                        {googleLoading ? <div className="w-5 h-5 border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin" /> : <><Chrome className="w-4 h-4" /> Google</>}
                    </button>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-10 font-medium">
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