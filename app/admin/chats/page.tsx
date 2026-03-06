'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    Clock,
    Eye,
    Flag,
    MessageSquare,
    Shield,
    Sparkles,
    User
} from 'lucide-react';

interface ChatRoom {
    id: string;
    room: string;
    participants: number;
    lastMsg: string;
    type: string;
    status: string;
    time: string;
}

const mockChats: ChatRoom[] = [
    { id: 'C-001', room: 'Calculus Study Group', participants: 12, lastMsg: 'Walia: The derivative of sin(x) is cos(x)...', type: 'AI Active', status: 'Monitored', time: '10m ago' },
    { id: 'C-002', room: 'Organic Chemistry', participants: 5, lastMsg: 'User: How do I name this compound?', type: 'Q&A', status: 'Flagged', time: '1h ago' },
    { id: 'C-003', room: '1-on-1 with Mentor', participants: 2, lastMsg: 'Mentor: Great progress on the project!', type: 'Private', status: 'Secure', time: '2h ago' },
    { id: 'C-004', room: 'Community Showcase', participants: 45, lastMsg: 'User shared an AI study plan.', type: 'Public', status: 'Monitored', time: '5m ago' },
    { id: 'C-005', room: 'Ancient History', participants: 8, lastMsg: 'Walia: The Roman Empire collapsed in...', type: 'AI Active', status: 'Monitored', time: '15m ago' },
];

export default function AdminChats() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tight">Intercept & Monitor</h1>
                    <p className="text-white/30 text-sm font-medium">Oversee AI-assisted sessions and community interactions.</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="px-4 py-2 rounded-2xl bg-walia-success/10 text-walia-success border border-walia-success/20 flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-walia-success animate-ping" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">8 Active AI Nodes</span>
                    </div>
                </div>
            </div>

            {/* Chat List */}
            <div className="grid grid-cols-1 gap-4">
                {mockChats.map((chat, i) => (
                    <motion.div
                        key={chat.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-6 rounded-[32px] bg-[#141415] border border-white/5 group hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                        <div className="flex items-center space-x-5">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110",
                                chat.type === 'AI Active' ? "text-walia-success" : "text-white/20"
                            )}>
                                {chat.type === 'AI Active' ? <Sparkles className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center space-x-3">
                                    <h3 className="text-sm font-black text-white group-hover:text-walia-success transition-colors">{chat.room}</h3>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest whitespace-nowrap",
                                        chat.status === 'Flagged' ? "bg-red-500 text-white" : "bg-white/5 text-white/40"
                                    )}>
                                        {chat.status}
                                    </span>
                                </div>
                                <p className="text-xs text-white/40 font-medium italic line-clamp-1">"{chat.lastMsg}"</p>
                                <div className="flex items-center space-x-3 text-[10px] text-white/20 font-bold uppercase tracking-tighter">
                                    <span className="flex items-center">
                                        <User className="w-3 h-3 mr-1" /> {chat.participants} Members
                                    </span>
                                    <span>•</span>
                                    <span>{chat.type}</span>
                                    <span>•</span>
                                    <span className="flex items-center text-walia-success">
                                        <Clock className="w-3 h-3 mr-1" /> {chat.time}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest">
                                <Eye className="w-4 h-4" />
                                <span>Inspect Node</span>
                            </button>
                            <button className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all group-hover:scale-105">
                                <Flag className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* AI Control Center */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-[40px] bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 space-y-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-2xl bg-purple-500 text-white shadow-lg shadow-purple-500/20">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-black text-white tracking-tight">Global AI Privacy Lock</h4>
                    </div>
                    <p className="text-xs text-white/40 font-medium leading-relaxed">
                        Enforce end-to-end encryption across all AI study sessions. When enabled, admins can only see metadata and session health indicators.
                    </p>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                        <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Status: <span className="text-purple-400">Restricted</span></span>
                        <div className="w-12 h-6 bg-purple-500/20 rounded-full relative p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-purple-500 rounded-full ml-auto" />
                        </div>
                    </div>
                </div>

                <div className="p-8 rounded-[40px] bg-gradient-to-br from-walia-success/10 to-transparent border border-walia-success/20 space-y-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-2xl bg-walia-success text-black shadow-lg shadow-walia-success/20 text-black">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-black text-white tracking-tight">Real-time Stream Sync</h4>
                    </div>
                    <p className="text-xs text-white/40 font-medium leading-relaxed">
                        Broadcast system updates or maintenance notices directly into active chat streams.
                    </p>
                    <button className="w-full py-3.5 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                        Broadcast Message
                    </button>
                </div>
            </div>
        </div>
    );
}
