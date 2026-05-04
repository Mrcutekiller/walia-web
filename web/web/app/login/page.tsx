'use client';

import { motion } from 'framer-motion';
import {
    Mail, Lock, ArrowRight, X, Eye, EyeOff,
    ArrowLeft, Chrome, CheckCircle2
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
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(identifier, password);
            router.push('/dashboard/ai');
        } catch (err: any) {
            setError(err.message || 'Invalid credentials. Please try again.');
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
            setError(err.message || 'Google sign-in failed. Please try again.');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#07070F] flex overflow-hidden">

            {/* ── Left: Dark Brand Panel ── */}
            <div className="hidden lg:flex w-[45%] bg-black relative flex-col items-center justify-center p-16 overflow-hidden">
                {/* Background gradients */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.25)_0%,transparent_60%)]" />
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.15)_0%,transparent_55%)]" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAtMzR2NmgzNHYtNmgtMzR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
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
                    <h2 className="text-4xl font-black text-white tracking-tight mb-4 uppercase">
                        Welcome back.
                    </h2>
                    <p className="text-white/50 text-base font-medium max-w-xs mx-auto leading-relaxed mb-10">
                        Sign in to continue your AI-powered journey with Walia.
                    </p>

                    <div className="space-y-3 text-left">
                        {[
                            'Access all AI models instantly',
                            'Continue your study plans',
                            'Stay connected with your community',
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                <span className="text-white/60 text-sm font-medium">{text}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Decorative floating dots */}
                <div className="absolute top-1/4 left-10 w-2 h-2 bg-indigo-400 rounded-full animate-pulse opacity-60" />
                <div className="absolute bottom-1/3 right-12 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-40" />
                <div className="absolute top-2/3 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse opacity-30" />
            </div>

            {/* ── Right: Login Form ── */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-white dark:bg-[#07070F] relative">

                {/* Back link */}
                <div className="absolute top-8 left-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-black dark:text-white/40 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    {/* Header */}
                    <div className="mb-10">
                        <div className="lg:hidden w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-6">
                            <Image src="/logo.png" alt="Walia" width={32} height={32} className="object-contain invert" unoptimized />
                        </div>
                        <h1 className="text-3xl font-black text-black dark:text-white tracking-tight mb-2">
                            Sign in to Walia
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                            Enter your details below to continue.
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-3"
                        >
                            <X className="w-4 h-4 flex-shrink-0" /> {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-0.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30 pointer-events-none" />
                                <input
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={e => setIdentifier(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-100 dark:bg-white/5 border-2 border-transparent focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/8 outline-none transition-all text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-0.5">
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-[11px] font-bold text-gray-400 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors uppercase tracking-wider">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30 pointer-events-none" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Your password"
                                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-gray-100 dark:bg-white/5 border-2 border-transparent focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/8 outline-none transition-all text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:text-white/30 dark:hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || googleLoading}
                            className="w-full mt-2 py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-black/15 dark:shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                            ) : (
                                <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-7 flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-white/8" />
                        <span className="text-[11px] font-bold text-gray-400 dark:text-white/25 uppercase tracking-[0.2em]">or</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-white/8" />
                    </div>

                    {/* Google */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading || googleLoading}
                        className="w-full py-3.5 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70 font-bold text-sm flex items-center justify-center gap-3 hover:bg-gray-200 dark:hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                        {googleLoading
                            ? <div className="w-5 h-5 border-2 border-gray-400 border-t-black dark:border-white/30 dark:border-t-white rounded-full animate-spin" />
                            : <><Chrome className="w-4 h-4" /><span>Continue with Google</span></>
                        }
                    </button>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 font-medium">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="font-black text-black dark:text-white hover:underline underline-offset-2 transition-colors">
                            Sign up
                        </Link>
                    </p>
                </motion.div>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-screen bg-gray-50 dark:bg-[#07070F] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-gray-200 dark:border-white/10 border-t-black dark:border-t-white rounded-full animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}