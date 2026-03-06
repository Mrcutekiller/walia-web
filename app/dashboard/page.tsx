'use client';

import { ArrowRight, ChevronRight, Clock, Sparkles, Star, Zap } from 'lucide-react';
import Link from 'next/link';

const stats = [
    { label: 'AI Messages', value: '124', change: '+12%', icon: Sparkles, color: 'text-walia-primary' },
    { label: 'Study Sessions', value: '18', change: '+5%', icon: Clock, color: 'text-walia-accent' },
    { label: 'Saved Notes', value: '42', change: '0%', icon: Star, color: 'text-yellow-500' },
];

const recentActivity = [
    { title: 'AI Study Plan Generated', time: '2 hours ago', type: 'AI' },
    { title: 'New Message from Walia Community', time: '4 hours ago', type: 'Social' },
    { title: 'Daily Quiz Completed', time: 'Yesterday', type: 'Tools' },
];

export default function DashboardHome() {
    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">Welcome back, User! 👋</h1>
                    <p className="text-white/40 text-sm font-medium">Here is what is happening in your Walia workspace today.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60">
                        Free Plan
                    </div>
                    <Link href="/dashboard/upgrade" className="px-4 py-2 rounded-xl bg-walia-primary text-white text-xs font-bold hover:bg-walia-secondary transition-all">
                        Go Pro
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">{stat.change}</span>
                        </div>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content: Features */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Continue Learning</h2>
                        <button className="text-xs font-bold text-walia-primary hover:underline">View All</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 rounded-[40px] bg-gradient-to-br from-walia-primary/20 to-transparent border border-walia-primary/20 space-y-6 group hover:scale-[1.02] transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-walia-primary flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Resume AI Chat</h3>
                                <p className="text-white/40 text-sm leading-relaxed">Continue your last session about "Quantum Physics Fundamentals".</p>
                            </div>
                            <Link href="/dashboard/ai" className="inline-flex items-center text-walia-primary font-bold text-sm group">
                                Continue Session <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6 group hover:scale-[1.02] transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-walia-accent/20 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-walia-accent" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Flashcard Master</h3>
                                <p className="text-white/40 text-sm leading-relaxed">Review 12 pending cards from your "Biology Midterm" set.</p>
                            </div>
                            <Link href="/dashboard/tools" className="inline-flex items-center text-walia-accent font-bold text-sm group">
                                Study Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Activity */}
                <div className="space-y-8">
                    <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                    <div className="space-y-4">
                        {recentActivity.map((activity, i) => (
                            <div key={i} className="flex items-center p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group">
                                <div className="w-2 h-2 rounded-full bg-walia-primary mr-4 shadow-lg shadow-walia-primary/40 group-hover:scale-150 transition-transform" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white mb-1">{activity.title}</p>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">{activity.time} • {activity.type}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white/20" />
                            </div>
                        ))}
                    </div>

                    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-walia-primary/10 rounded-full blur-3xl transition-transform group-hover:scale-150" />
                        <h3 className="text-lg font-bold text-white mb-4 relative z-10">Pro Tip</h3>
                        <p className="text-white/40 text-xs leading-relaxed relative z-10">
                            You can use the <strong>AI Summarizer</strong> tool to condense long PDFs into 5-minute study guides!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
