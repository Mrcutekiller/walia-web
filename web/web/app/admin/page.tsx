'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    useAuth(); // assuming we can just use signInWithEmailAndPassword

    // Wait, the AuthContext in web does not export login. Let's just use Firebase Auth directly.
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // Strict client-side check just in case, though backend rules should enforce things strictly later.
        if (email.toLowerCase() !== 'admin@walia.com') {
            setError('Unauthorized email address.');
            return;
        }

        setIsLoading(true);
        try {
            const { signInWithEmailAndPassword } = await import('firebase/auth');
            const { auth } = await import('@/lib/firebase');
            
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard/admin');
        } catch (err: any) {
            setError(err.message || 'Failed to login');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#111] p-8 rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                        <ShieldAlert className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h1 className="text-2xl font-black text-white text-center mb-2 uppercase tracking-widest">Admin Portal</h1>
                <p className="text-gray-500 text-center text-sm mb-8 font-medium">Restricted access.</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-bold text-center mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-white transition-colors"
                            placeholder="admin@walia.com"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-white transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading || !email || !password}
                        className="w-full bg-white text-black font-black uppercase tracking-widest py-3.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 flex justify-center items-center"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate'}
                    </button>
                </form>
            </div>
        </div>
    );
}
