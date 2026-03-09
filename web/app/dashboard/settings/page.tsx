'use client';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import {
    Bell,
    ChevronRight,
    CreditCard,
    Globe,
    Key,
    Laptop,
    Moon,
    Palette,
    Shield,
    Sun,
    User
} from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
    const { user } = useAuth();
    const { theme, toggleTheme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('Account');

    const tabs = ['Account', 'Preferences', 'Notifications', 'Billing', 'Security'];

    return (
        <div className="min-h-full bg-white dark:bg-[#0A0A18] text-black dark:text-white animate-in fade-in pb-20 selection:bg-black selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#0A0A18]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 md:px-12 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your account settings and preferences.</p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 md:px-12 pt-8">
                <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
                    {/* Settings Navigation */}
                    <aside className="w-full md:w-64 shrink-0">
                        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 custom-scrollbar sticky top-32">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "flex items-center px-4 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap",
                                        activeTab === tab
                                            ? "bg-black dark:bg-white text-white dark:text-black shadow-md shadow-black/10"
                                            : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Settings Content */}
                    <div className="flex-1 w-full space-y-12 pb-12">
                        {activeTab === 'Account' && (
                            <section className="space-y-8 animate-in slide-in-from-right-4 fade-in">
                                <div>
                                    <h2 className="text-xl font-black mb-1">Account Summary</h2>
                                    <p className="text-sm text-gray-500 font-medium">Basic information regarding your account.</p>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center shrink-0">
                                            {user?.photoURL ? (
                                                <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <User className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-lg font-black">{user?.displayName || 'User'}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800">
                                            <div>
                                                <p className="text-sm font-bold">Email Address</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
                                            </div>
                                            <button className="text-xs font-bold text-black dark:text-white border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                                Change
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800">
                                            <div>
                                                <p className="text-sm font-bold">Phone Number</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Not provided</p>
                                            </div>
                                            <button className="text-xs font-bold text-black dark:text-white border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'Preferences' && (
                            <section className="space-y-8 animate-in slide-in-from-right-4 fade-in">
                                <div>
                                    <h2 className="text-xl font-black mb-1">App Preferences</h2>
                                    <p className="text-sm text-gray-500 font-medium">Customize your interface and experience.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-8 rounded-[2rem] border border-gray-200 dark:border-gray-800 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-black dark:text-white">
                                                <Palette className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">Theme</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select your preferred color scheme</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { id: 'light', icon: Sun, label: 'Light' },
                                                { id: 'dark', icon: Moon, label: 'Dark' },
                                            ].map(t => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setTheme(t.id as 'light' | 'dark')}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all",
                                                        theme === t.id
                                                            ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-xl shadow-black/10"
                                                            : "border-gray-200 dark:border-gray-800 text-gray-500 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white"
                                                    )}
                                                >
                                                    <t.icon className="w-6 h-6" />
                                                    <span className="text-xs font-black uppercase tracking-widest">{t.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-[2rem] border border-gray-200 dark:border-gray-800">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-black dark:text-white">
                                                <Globe className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">Language & Region</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Configure your local settings</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800">
                                            <p className="text-sm font-bold">Language</p>
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                                                English (US) <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'Notifications' && (
                            <section className="space-y-8 animate-in slide-in-from-right-4 fade-in">
                                <div>
                                    <h2 className="text-xl font-black mb-1">Notifications</h2>
                                    <p className="text-sm text-gray-500 font-medium">Choose what you want to be notified about.</p>
                                </div>
                                <div className="p-8 rounded-[2rem] border border-gray-200 dark:border-gray-800 space-y-6">
                                    <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-black dark:text-white">
                                            <Bell className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-black dark:text-white">Email Notifications</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Updates sent directly to your inbox</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-2">
                                        {[
                                            { label: 'Weekly Reports', desc: 'Summary of your learning progress', active: true },
                                            { label: 'New Features', desc: 'Updates about Walia features', active: true },
                                            { label: 'Community Mentions', desc: 'When someone replies to your post', active: false },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-2">
                                                <div>
                                                    <p className="text-sm font-bold text-black dark:text-white">{item.label}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                                                </div>
                                                <button className={cn(
                                                    "w-12 h-6 rounded-full transition-colors relative flex items-center px-1",
                                                    item.active ? "bg-black dark:bg-white" : "bg-gray-200 dark:bg-gray-800"
                                                )}>
                                                    <div className={cn(
                                                        "w-4 h-4 rounded-full bg-white dark:bg-black transition-transform",
                                                        item.active ? "translate-x-6 shadow-sm" : "translate-x-0 outline outline-1 outline-black/10 dark:outline-white/10"
                                                    )} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'Billing' && (
                            <section className="space-y-8 animate-in slide-in-from-right-4 fade-in">
                                <div>
                                    <h2 className="text-xl font-black mb-1">Plan & Billing</h2>
                                    <p className="text-sm text-gray-500 font-medium">Manage your subscription and payment methods.</p>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 transition-colors">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                        <div>
                                            <span className="inline-block px-3 py-1 rounded-full bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-3">
                                                Current Plan
                                            </span>
                                            <h3 className="text-2xl font-black text-black dark:text-white">Free Tier</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                                                You are currently on the free plan with limits on AI generation and advanced tools.
                                            </p>
                                        </div>
                                        <button className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20 dark:shadow-white/5">
                                            Upgrade to Pro
                                        </button>
                                    </div>
                                </div>
                                <div className="p-8 rounded-[2rem] border border-gray-200 dark:border-gray-800">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-black dark:text-white">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Payment Methods</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cards connected to your account</p>
                                        </div>
                                    </div>
                                    <div className="text-center py-8">
                                        <p className="text-sm font-bold text-gray-400 dark:text-gray-600">No payment methods added</p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'Security' && (
                            <section className="space-y-8 animate-in slide-in-from-right-4 fade-in">
                                <div>
                                    <h2 className="text-xl font-black mb-1">Security</h2>
                                    <p className="text-sm text-gray-500 font-medium">Keep your account safe and manage sessions.</p>
                                </div>
                                <div className="p-8 rounded-[2rem] border border-gray-200 dark:border-gray-800 space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-black dark:text-white">
                                                <Key className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">Password</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last changed never</p>
                                            </div>
                                        </div>
                                        <button className="text-xs font-bold px-4 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/20 transition-colors shadow-sm">
                                            Update
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-black dark:text-white">
                                                <Shield className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">Two-Factor Authentication</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add an extra layer of security</p>
                                            </div>
                                        </div>
                                        <button className="text-xs font-bold px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-zinc-800 dark:hover:bg-gray-200 transition-colors shadow-sm shadow-black/20 dark:shadow-white/5">
                                            Enable
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2rem] border border-gray-200 dark:border-gray-800 mt-8 transition-colors">
                                    <h3 className="text-sm font-bold mb-6">Active Sessions</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-2xl">
                                            <div className="flex items-center gap-4">
                                                <Laptop className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                                                <div>
                                                    <p className="text-sm font-bold flex items-center gap-2">
                                                        Windows Chrome <span className="text-[10px] bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Current</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Addis Ababa, Ethiopia · Active now</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
