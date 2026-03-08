'use client';

import { db } from '@/lib/firebase';
import { cn, formatTimeAgo } from '@/lib/utils';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowUpRight,
    Clock,
    Eye,
    Image as ImageIcon,
    MessageSquare,
    Mic,
    Shield,
    Sparkles,
    User,
    X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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

    // Inspect Modal State
    const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Listen to all chat collection
        const q = query(collection(db, 'chats'), orderBy('lastMessageAt', 'desc'), limit(50));
        const unsub = onSnapshot(q, (snap) => {
            setChats(snap.docs.map(d => ({
                id: d.id,
                ...d.data(),
                room: d.data().name || d.data().type,
                type: d.data().type === 'dm' ? 'Direct Message' : 'Group/AI',
                status: 'Active',
                participants: d.data().participants?.length || 2,
                lastMsg: d.data().lastMessage || 'No recent messages',
                time: d.data().lastMessageAt?.toDate() ? formatTimeAgo(d.data().lastMessageAt) : 'Just now'
            } as ChatRoom)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (!selectedChat) {
            setMessages([]);
            return;
        }
        const q = query(collection(db, 'chats', selectedChat.id, 'messages'), orderBy('createdAt', 'asc'), limit(100));
        const unsub = onSnapshot(q, (snap) => {
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });
        return () => unsub();
    }, [selectedChat]);

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
                                <button
                                    onClick={() => setSelectedChat(chat)}
                                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
                                >
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
                        <div className="p-3 rounded-2xl bg-walia-success shadow-lg shadow-walia-success/20 text-black">
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

            {/* Inspect Modal */}
            <AnimatePresence>
                {selectedChat && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-10 lg:pl-[300px]">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedChat(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl h-[80vh] flex flex-col rounded-[32px] bg-[#141415] border border-white/10 shadow-2xl overflow-hidden z-10"
                        >
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-black/20 shrink-0">
                                <div>
                                    <h3 className="text-lg font-black text-white tracking-tight">{selectedChat.room}</h3>
                                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Interception Mode Active</p>
                                </div>
                                <button onClick={() => setSelectedChat(null)} className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                {messages.length === 0 && (
                                    <div className="h-full flex items-center justify-center text-white/20 text-xs font-black uppercase tracking-widest">
                                        No messages found
                                    </div>
                                )}
                                {messages.map((msg: any) => (
                                    <div key={msg.id} className="flex flex-col items-start bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="flex items-baseline space-x-2 mb-2">
                                            <span className="text-xs font-black text-walia-primary">{msg.senderName || 'User'}</span>
                                            <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{msg.createdAt?.toDate() ? formatTimeAgo(msg.createdAt) : 'Just now'}</span>
                                        </div>
                                        {msg.image ? (
                                            <img src={msg.image} alt="content" className="max-w-[200px] rounded-lg border border-white/10" />
                                        ) : (
                                            <p className="text-sm text-white/80 leading-relaxed font-medium">{msg.text}</p>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
