'use client';

import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    Clock,
    Eye,
    Image as ImageIcon,
    MessageSquare,
    Mic,
    Shield,
    Sparkles,
    User
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChatRoom {
    id: string;
    room: string;
    participants: number;
    lastMsg: string;
    lastMsgType?: 'text' | 'voice' | 'image';
    type: string;
    status: string;
    time: string;
}

export default function AdminChats() {
    const [chats, setChats] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Listen to all chat collection (example path: 'chats')
        const q = query(collection(db, 'chats'), orderBy('lastActivity', 'desc'), limit(50));
        const unsub = onSnapshot(q, (snap) => {
            setChats(snap.docs.map(d => ({
                id: d.id,
                ...d.data(),
                time: d.data().lastActivity?.toDate().toLocaleTimeString() || 'Just now'
            } as ChatRoom)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const filteredChats = chats.filter(chat =>
        chat.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMsg?.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
                {loading ? (
                    <div className="py-20 text-center text-white/20 text-xs font-black uppercase tracking-[0.3em]">Interacting with neural streams...</div>
                ) : filteredChats.length === 0 ? (
                    <div className="py-20 text-center text-white/20 text-xs font-black uppercase tracking-[0.3em]">No active nodes found</div>
                ) : (
                    filteredChats.map((chat, i) => (
                        <motion.div
                            key={chat.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-6 rounded-[32px] bg-[#141415] border border-white/5 group hover:border-walia-primary/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                            <div className="flex items-center space-x-5">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110",
                                    chat.type === 'AI Active' ? "text-walia-primary" : "text-white/20"
                                )}>
                                    {chat.type === 'AI Active' ? <Sparkles className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="text-sm font-black text-white group-hover:text-walia-primary transition-colors">{chat.room}</h3>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest whitespace-nowrap",
                                            chat.status === 'Flagged' ? "bg-red-500 text-white" : "bg-white/5 text-white/40"
                                        )}>
                                            {chat.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {chat.lastMsgType === 'voice' && <Mic className="w-3 h-3 text-walia-primary" />}
                                        {chat.lastMsgType === 'image' && <ImageIcon className="w-3 h-3 text-walia-primary" />}
                                        <p className="text-xs text-white/40 font-medium italic line-clamp-1">"{chat.lastMsg}"</p>
                                    </div>
                                    <div className="flex items-center space-x-3 text-[10px] text-white/20 font-bold uppercase tracking-tighter">
                                        <span className="flex items-center">
                                            <User className="w-3 h-3 mr-1" /> {chat.participants} Members
                                        </span>
                                        <span>•</span>
                                        <span>{chat.type}</span>
                                        <span>•</span>
                                        <span className="flex items-center text-walia-primary">
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
                            </div>
                        </motion.div>
                    ))
                )}
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
