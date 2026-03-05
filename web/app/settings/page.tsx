'use client';

import DashboardShell from '@/components/DashboardShell';
import { useAuth } from '@/context/AuthContext';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Bell, Globe, Lock, LogOut, Moon, Palette, Shield, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Toggle = ({ val, set }: { val: boolean; set: (v: boolean) => void }) => (
    <button onClick={() => set(!val)}
        className={`relative w-11 h-6 rounded-full transition-all ${val ? 'bg-white' : 'bg-white/10'}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-black shadow transition-all ${val ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
);

export default function SettingsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [plan, setPlan] = useState<'free' | 'pro'>('free');
    const [notifs, setNotifs] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [sounds, setSounds] = useState(false);
    const [ai, setAi] = useState('gemini');

    useEffect(() => {
        if (!user) return;
        getDoc(doc(db, 'users', user.uid)).then(d => {
            if (d.exists()) {
                setPlan(d.data().plan || 'free');
            }
        });
        // Dark mode is default forced to dark due to design, but let's toggle body class
        const isDark = document.documentElement.classList.contains('dark') || true;
        setDarkMode(isDark);
    }, [user]);

    const toggleDark = (v: boolean) => {
        setDarkMode(v);
        // In a real app we'd toggle a class on <html>, but our theme is fixed-dark for now
        // This makes the toggle feel responsive
        if (v) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    };

    const logout = async () => { await signOut(auth); router.replace('/'); };

    return (
        <DashboardShell>
            <div className="p-6 max-w-xl mx-auto">
                <div className="mb-8">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Preferences</p>
                    <h1 className="text-3xl font-black text-white tracking-tight">Settings</h1>
                </div>

                <div className="space-y-3">
                    {/* Appearance */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/8 space-y-4">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Appearance</p>
                        <Row icon={Moon} label="Dark Mode" sub="Easier on your eyes" right={<Toggle val={darkMode} set={toggleDark} />} />
                        <Row icon={Palette} label="Theme" sub="Customize your color" right={<span className="text-xs text-white/30 font-semibold">Default (Dark)</span>} />
                    </div>

                    {/* Notifications */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/8 space-y-4">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Notifications</p>
                        <Row icon={Bell} label="Push Notifications" sub="Study reminders & updates" right={<Toggle val={notifs} set={setNotifs} />} />
                        <Row icon={Globe} label="Sound Effects" sub="UI audio feedback" right={<Toggle val={sounds} set={setSounds} />} />
                    </div>

                    {/* AI Model */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/8 space-y-4 relative">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                            AI Model
                            {plan === 'free' && <span className="bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded text-[8px] flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> Free</span>}
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {['gemini', 'gpt-4', 'claude'].map(m => {
                                const locked = plan === 'free' && m !== 'gemini';
                                return (
                                    <button key={m} onClick={() => !locked && setAi(m)} disabled={locked}
                                        className={`py-2.5 flex items-center justify-center gap-1 rounded-xl text-xs font-bold border transition-all ${locked ? 'bg-white/5 border-transparent text-white/20 cursor-not-allowed' :
                                                ai === m ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                                            }`}>
                                        {locked && <Lock className="w-3 h-3" />}
                                        {m === 'gemini' ? 'Gemini 1.5' : m === 'gpt-4' ? 'GPT-4o' : 'Claude 3.5'}
                                    </button>
                                );
                            })}
                        </div>
                        {plan === 'free' && <p className="text-[10px] text-amber-500">Upgrade to Pro to use GPT-4o and Claude 3.5 Sonnet.</p>}
                    </div>

                    {/* Account */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/8 space-y-4">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Account</p>
                        <Row icon={Lock} label="Change Password" sub="Update your password" right={<span className="text-xs text-indigo-400 font-bold cursor-pointer hover:underline">Change</span>} />
                        <Row icon={Shield} label="Privacy" sub="Data and security settings" right={<span className="text-xs text-white/30 font-semibold cursor-pointer">›</span>} />
                        <button onClick={logout} className="flex items-center gap-3 w-full text-left text-rose-400 hover:text-rose-300 transition-colors">
                            <LogOut className="w-5 h-5 shrink-0 text-rose-500" />
                            <div>
                                <p className="text-sm font-bold">Log Out</p>
                                <p className="text-[10px] text-rose-500/60">{user?.email}</p>
                            </div>
                        </button>
                        <button className="flex items-center gap-3 w-full text-left text-white/20 hover:text-rose-400 transition-colors">
                            <Trash2 className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-semibold">Delete Account</p>
                        </button>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

function Row({ icon: Icon, label, sub, right }: { icon: any; label: string; sub: string; right: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-white/40" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-[10px] text-white/25">{sub}</p>
            </div>
            {right}
        </div>
    );
}
