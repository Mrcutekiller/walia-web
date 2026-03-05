'use client';

import ReviewForm from '@/components/ReviewForm';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import {
    Briefcase,
    Calendar as CalendarIcon,
    Camera,
    CreditCard,
    Edit3,
    GraduationCap,
    Hash,
    LogOut,
    Mail,
    MapPin,
    Settings,
    ShieldCheck,
    User
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await auth.signOut();
        router.push('/login');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up">

            {/* Profile Header */}
            <header className="relative p-10 md:p-16 rounded-[48px] bg-white/5 border border-white/10 overflow-hidden group">
                <div className="absolute top-0 right-0 p-20 text-walia-primary/5 -rotate-12 transition-transform group-hover:scale-150">
                    <User className="w-80 h-80" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-10">
                    <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] bg-walia-primary flex items-center justify-center font-black text-white text-5xl md:text-6xl border-4 border-black shadow-[0_20px_40px_rgba(108,99,255,0.3)]">
                            {user?.displayName?.charAt(0) || 'U'}
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-black border border-white/20 text-white hover:border-walia-primary transition-all shadow-xl">
                            <Camera className="w-5 h-5 text-walia-primary" />
                        </button>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <h1 className="text-3xl md:text-4xl font-black text-white">{user?.displayName || 'Student User'}</h1>
                            <span className="px-3 py-1.5 rounded-xl bg-walia-primary/10 border border-walia-primary/20 text-[10px] font-black uppercase text-walia-primary tracking-widest self-center md:self-start md:mt-1">Pro Member</span>
                        </div>
                        <p className="text-white/40 text-sm font-medium mb-6">Mastering AI & Computer Science @ Walia Academy</p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/50 hover:text-white hover:border-white/20 transition-all flex items-center">
                                <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                            </button>
                            <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/50 hover:text-white hover:border-white/20 transition-all flex items-center">
                                <Settings className="w-4 h-4 mr-2" /> Manage Settings
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Sidebar: Details */}
                <div className="space-y-8">
                    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-8">
                        <h2 className="text-lg font-bold text-white mb-2">Personal Details</h2>

                        {[
                            { icon: Mail, label: 'Email', value: user?.email || 'user@waliaai.com' },
                            { icon: Hash, label: 'Username', value: '@walia_student' },
                            { icon: MapPin, label: 'Location', value: 'Addis Ababa, Ethiopia' },
                            { icon: Briefcase, label: 'Profession', value: 'Student' },
                            { icon: GraduationCap, label: 'Interests', value: 'AI, CS, Trading' },
                            { icon: CalendarIcon, label: 'Joined', value: 'March 2026' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 shrink-0">
                                    <item.icon className="w-4 h-4 text-white/30" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">{item.label}</p>
                                    <p className="text-sm font-bold text-white/80 truncate">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full py-5 rounded-[32px] bg-red-500/10 border border-red-500/20 text-red-500 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transition-all shadow-lg hover:shadow-red-500/20"
                    >
                        <LogOut className="w-5 h-5 mr-3" /> Logout
                    </button>
                </div>

                {/* Content: Account & Security */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="p-10 rounded-[40px] bg-white/5 border border-white/10 space-y-10">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2">Account & Security</h2>
                            <p className="text-white/40 text-sm font-medium leading-relaxed">Control your security and billing information.</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { icon: ShieldCheck, title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account.', active: true },
                                { icon: CreditCard, title: 'Billing & Payment', desc: 'Securely manage your subscriptions and invoices.', active: false },
                                { icon: Settings, title: 'Experimental Features', desc: 'Get early access to our newest AI models.', active: true },
                            ].map((setting, i) => (
                                <div key={i} className="p-6 rounded-3xl bg-black border border-white/5 hover:border-white/10 transition-all flex items-center justify-between group">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <setting.icon className="w-6 h-6 text-white/30 group-hover:text-walia-primary transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white group-hover:text-walia-primary transition-colors">{setting.title}</h4>
                                            <p className="text-xs text-white/30 font-medium">{setting.desc}</p>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "w-12 h-6 rounded-full relative transition-all cursor-pointer",
                                        setting.active ? "bg-walia-primary" : "bg-white/10"
                                    )}>
                                        <div className={cn(
                                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                                            setting.active ? "left-7" : "left-1"
                                        )} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-12 rounded-[48px] bg-gradient-to-br from-walia-primary to-walia-secondary shadow-xl shadow-walia-primary/20 space-y-6 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-150" />
                        <div className="flex items-center justify-between relative z-10">
                            <div className="p-4 rounded-2xl bg-white/20 border border-white/30 inline-flex items-center justify-center">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-[10px] font-black text-white/60 bg-white/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10">Active Protection</span>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-white mb-2">Verified Identity</h3>
                            <p className="text-white/80 text-sm font-medium leading-relaxed">
                                Your account is fully verified. Your AI sessions and study materials are protected by Walia Cloud's military-grade encryption.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ─── Review Section ─── */}
                <div className="p-10 rounded-[40px] bg-white/5 border border-white/10 space-y-8">
                    <div>
                        <h2 className="text-2xl font-black text-white mb-2">Rate Walia</h2>
                        <p className="text-white/40 text-sm font-medium leading-relaxed">
                            Your review appears live on the homepage for all visitors to see.
                        </p>
                    </div>
                    <ReviewForm />
                </div>

            </div>

        </div>
    );
}
