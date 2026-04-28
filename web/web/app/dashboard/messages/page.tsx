'use client';

import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { 
    Search, Plus, MoreVertical, Send, Image as ImageIcon, 
    Mic, Phone, Video, Info, Check, CheckCheck, Smile, Paperclip
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { 
    collection, onSnapshot, query, where, addDoc, 
    serverTimestamp, orderBy, doc, getDoc, limit, setDoc 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: any;
    type: 'text' | 'image' | 'voice';
}

interface Conversation {
    id: string;
    participants: string[];
    lastMessage: string;
    updatedAt: any;
    otherUser?: {
        username: string;
        displayName: string;
        photoURL?: string;
    };
}

export default function MessagesPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConv, setActiveConv] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [search, setSearch] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch conversations
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'conversations'),
            where('participants', 'array-contains', user.uid),
            orderBy('updatedAt', 'desc')
        );

        return onSnapshot(q, async snap => {
            const convs = await Promise.all(snap.docs.map(async d => {
                const data = d.data() as Conversation;
                const otherUid = data.participants.find(p => p !== user.uid);
                let otherUser = { username: 'Unknown', displayName: 'User' };
                if (otherUid) {
                    const uSnap = await getDoc(doc(db, 'users', otherUid));
                    if (uSnap.exists()) {
                        const uData = uSnap.data();
                        otherUser = { 
                            username: uData.username || 'unknown', 
                            displayName: uData.displayName || uData.username || 'User'
                        };
                    }
                }
                return { ...data, id: d.id, otherUser };
            }));
            setConversations(convs);
        });
    }, [user]);

    // Fetch messages
    useEffect(() => {
        if (!activeConv) return;
        const q = query(
            collection(db, 'conversations', activeConv, 'messages'),
            orderBy('createdAt', 'asc'),
            limit(50)
        );
        return onSnapshot(q, snap => {
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
        });
    }, [activeConv]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user || !activeConv) return;

        const msgText = input.trim();
        setInput('');

        try {
            await addDoc(collection(db, 'conversations', activeConv, 'messages'), {
                senderId: user.uid,
                text: msgText,
                type: 'text',
                createdAt: serverTimestamp()
            });

            await setDoc(doc(db, 'conversations', activeConv), {
                lastMessage: msgText,
                updatedAt: serverTimestamp()
            }, { merge: true });

        } catch (err) {
            console.error(err);
        }
    };

    const selectedConv = conversations.find(c => c.id === activeConv);

    return (
        <div className="flex h-full bg-white dark:bg-[#0A0A18] overflow-hidden">
            
            {/* ── Left Panel: Conversations ── */}
            <div className="w-80 md:w-96 border-r border-gray-100 dark:border-white/5 flex flex-col bg-gray-50/50 dark:bg-black/20">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-black text-black dark:text-white tracking-tighter uppercase">Messages</h1>
                        <button className="p-2 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition-all">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" placeholder="Search conversations..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-xs font-medium outline-none focus:border-black dark:focus:border-white transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
                    {conversations.map(conv => (
                        <div 
                            key={conv.id}
                            onClick={() => setActiveConv(conv.id)}
                            className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
                                activeConv === conv.id 
                                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xl' 
                                : 'bg-transparent border-transparent hover:bg-white dark:hover:bg-white/5'
                            }`}
                        >
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs uppercase shadow-sm ${
                                    activeConv === conv.id ? 'bg-white/20' : 'bg-black dark:bg-white text-white dark:text-black'
                                }`}>
                                    {conv.otherUser?.username.slice(0, 2)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0A0A18]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <h3 className="text-xs font-black uppercase tracking-tight truncate">{conv.otherUser?.displayName}</h3>
                                    <span className={`text-[9px] font-bold uppercase ${activeConv === conv.id ? 'text-white/50' : 'text-gray-400'}`}>
                                        {conv.updatedAt?.toDate ? new Date(conv.updatedAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                </div>
                                <p className={`text-[10px] font-medium truncate ${activeConv === conv.id ? 'text-white/40' : 'text-gray-400'}`}>
                                    {conv.lastMessage}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Main Chat Window ── */}
            <div className="flex-1 flex flex-col relative bg-white dark:bg-black/20">
                {activeConv ? (
                    <>
                        {/* Header */}
                        <div className="px-8 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-[#0A0A18]/80 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-xs uppercase">
                                    {selectedConv?.otherUser?.username.slice(0, 2)}
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-black dark:text-white uppercase tracking-tight">{selectedConv?.otherUser?.displayName}</h2>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Now</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white transition-all"><Phone className="w-4 h-4" /></button>
                                <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white transition-all"><Video className="w-4 h-4" /></button>
                                <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white transition-all"><Info className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {/* Messages Feed */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            <div className="max-w-4xl mx-auto flex flex-col gap-4">
                                {messages.map((m, i) => {
                                    const isMe = m.senderId === user?.uid;
                                    return (
                                        <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`group relative max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-5 py-3.5 rounded-[1.75rem] text-sm font-medium leading-relaxed shadow-sm ${
                                                    isMe 
                                                    ? 'bg-black dark:bg-white text-white dark:text-black rounded-tr-none' 
                                                    : 'bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-black dark:text-white rounded-tl-none'
                                                }`}>
                                                    {m.text}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 px-1">
                                                    <span className="text-[9px] text-gray-300 font-bold uppercase">
                                                        {m.createdAt?.toDate ? new Date(m.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                    {isMe && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-6">
                            <div className="max-w-4xl mx-auto">
                                <form onSubmit={handleSend} className="relative flex items-center gap-3">
                                    <div className="flex gap-2">
                                        <button type="button" className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-gray-400 transition-all"><Paperclip className="w-4 h-4" /></button>
                                        <button type="button" className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-gray-400 transition-all"><ImageIcon className="w-4 h-4" /></button>
                                    </div>
                                    <div className="flex-1 relative">
                                        <input 
                                            type="text" value={input} onChange={e => setInput(e.target.value)}
                                            placeholder="Type a message..."
                                            className="w-full pl-6 pr-12 py-4 rounded-[1.75rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-sm text-black dark:text-white"
                                        />
                                        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black dark:hover:text-white transition-all">
                                            <Smile className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button 
                                        type="submit" disabled={!input.trim()}
                                        className="w-14 h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 disabled:opacity-30"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                    <button type="button" className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white transition-all">
                                        <Mic className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-20 h-20 rounded-[1.75rem] bg-black dark:bg-white/10 flex items-center justify-center mb-8 border border-white/5">
                            <Send className="w-8 h-8 text-white dark:text-white/20" />
                        </div>
                        <h2 className="text-3xl font-black text-black dark:text-white tracking-tighter uppercase mb-2">Select a Conversation</h2>
                        <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Send a message to start connecting with the Walia community.</p>
                        <button className="mt-8 px-8 py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-black/10">
                            Start New Chat
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
