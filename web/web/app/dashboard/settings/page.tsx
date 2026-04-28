'use client';

import { useAuth } from '@/context/AuthContext';
import { 
    User, Lock, Bell, Shield, LogOut, ChevronRight, 
    Smartphone, Moon, Globe, Trash2, Mail, AlertCircle, Sparkles, Check
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        community: true,
        trading: true
    });

    const sections: { title: string; items: { icon: any; label: string; desc: string; href?: string; toggle?: boolean }[] }[] = [
        {
            title: 'Account',
            items: [
                { icon: User, label: 'Profile Information', desc: 'Edit your name, bio, and location', href: '/dashboard/profile' },
                { icon: Mail, label: 'Email Address', desc: user?.email || 'name@example.com' },
                { icon: Lock, label: 'Password', desc: 'Change your login password' },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { icon: Moon, label: 'Dark Mode', desc: 'Manage your visual appearance', toggle: true },
                { icon: Globe, label: 'Language', desc: 'English (US)' },
                { icon: Bell, label: 'Notifications', desc: 'Customize your alerts' },
            ]
        },
        {
            title: 'Security',
            items: [
                { icon: Shield, label: 'Privacy & Data', desc: 'Manage your data and privacy settings' },
                { icon: Smartphone, label: 'Linked Devices', desc: 'Manage where you are logged in' },
            ]
        }
    ];

    return (
        <div className="h-full bg-white dark:bg-[#0A0A18] overflow-y-auto custom-scrollbar p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-3xl font-black text-black dark:text-white tracking-tighter uppercase">Settings</h1>
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Manage your experience</p>
                </div>

                <div className="space-y-12">
                    {sections.map((section, i) => (
                        <div key={i}>
                            <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6 px-4">{section.title}</h2>
                            <div className="space-y-2">
                                {section.items.map((item, j) => (
                                    <div 
                                        key={j} 
                                        className="group flex items-center gap-5 p-5 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-black dark:hover:border-white transition-all cursor-pointer shadow-sm hover:shadow-xl"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0 shadow-lg shadow-black/5">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-tight">{item.label}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.desc}</p>
                                        </div>
                                        {item.toggle ? (
                                            <div className="w-12 h-6 rounded-full bg-black dark:bg-white p-1 flex items-center justify-end">
                                                <div className="w-4 h-4 rounded-full bg-white dark:bg-black" />
                                            </div>
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Danger Zone */}
                    <div>
                        <h2 className="text-[10px] font-black text-red-500/50 uppercase tracking-[0.2em] mb-6 px-4">Danger Zone</h2>
                        <div className="space-y-2">
                            <button 
                                onClick={() => logout()}
                                className="w-full flex items-center gap-5 p-5 rounded-[2rem] bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 hover:bg-red-500 hover:text-white group transition-all text-left"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black text-red-500 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-black uppercase tracking-tight">Log Out</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">End your current session</p>
                                </div>
                            </button>
                            <button 
                                className="w-full flex items-center gap-5 p-5 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-500/50 group transition-all text-left"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black text-gray-400 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-red-50 group-hover:text-red-500 transition-all">
                                    <Trash2 className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">Delete Account</h3>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Permanently remove all data</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="mt-16 p-8 rounded-[3rem] bg-black dark:bg-white text-white dark:text-black relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles className="w-24 h-24" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 dark:bg-black/10 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Walia Pro Status</h3>
                            <p className="text-xs font-medium text-white/60 dark:text-black/60 leading-relaxed max-w-md">
                                You are currently on the <span className="font-black text-white dark:text-black">Free Plan</span>. Upgrade to unlock unlimited AI chats, real-time trading signals, and professional tools.
                            </p>
                        </div>
                        <button className="ml-auto px-8 py-4 rounded-2xl bg-white dark:bg-black text-black dark:text-white font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-black/10">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
