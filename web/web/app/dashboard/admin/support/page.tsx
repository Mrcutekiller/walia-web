'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, addDoc, serverTimestamp, updateDoc, setDoc } from 'firebase/firestore';
import { Send, Loader2, MessageSquare, Check, CheckCheck, HeartHandshake } from 'lucide-react';
import UserBadge from '@/components/UserBadge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface SupportChat {
    id: string;
    userId: string;
    lastMessage: string;
    updatedAt: any;
    unreadAdminCount: number;
}

interface SupportMessage {
    id: string;
    text: string;
    sender: 'user' | 'admin';
    createdAt: any;
}

export default function AdminSupport() {
    const [chats, setChats] = useState<SupportChat[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<SupportMessage[]>([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Load all chats
    useEffect(() => {
        const q = query(collection(db, 'support_chats'), orderBy('updatedAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as SupportChat));
            setChats(data);
            setLoadingChats(false);
        });
        return () => unsub();
    }, []);

    // Load active chat messages
    useEffect(() => {
        if (!activeChatId) {
            setMessages([]);
            return;
        }

        // Mark as read immediately
        updateDoc(doc(db, 'support_chats', activeChatId), { unreadAdminCount: 0 }).catch(() => {});

        const q = query(collection(db, `support_chats/${activeChatId}/messages`), orderBy('createdAt', 'asc'));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as SupportMessage));
            setMessages(data);
            setTimeout(() => {
                scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
            }, 100);
        });
        return () => unsub();
    }, [activeChatId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !activeChatId || sending) return;
        setSending(true);
        const textToSend = inputText.trim();
        setInputText('');

        try {
            await addDoc(collection(db, `support_chats/${activeChatId}/messages`), {
                text: textToSend,
                sender: 'admin',
                createdAt: serverTimestamp(),
            });
            await updateDoc(doc(db, 'support_chats', activeChatId), {
                lastMessage: textToSend,
                updatedAt: serverTimestamp(),
                unreadUserCount: 1, // trigger user badge
            });
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex h-full min-h-screen bg-white dark:bg-[#0A101D] animate-in fade-in duration-700">
            {/* Sidebar List */}
            <div className="w-80 border-r border-gray-100 dark:border-white/5 flex flex-col bg-[#FAFAFA] dark:bg-[#162032]">
                <div className="p-6 border-b border-gray-100 dark:border-white/5 shrink-0">
                    <h1 className="text-xl font-black uppercase tracking-widest text-black dark:text-white">Support Inbox</h1>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">Real-time user inquiries</p>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loadingChats ? (
                        <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
                    ) : chats.length === 0 ? (
                        <div className="p-8 text-center text-sm font-bold text-gray-400">No active support tickets.</div>
                    ) : (
                        chats.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => setActiveChatId(chat.id)}
                                className={cn(
                                    "w-full text-left p-4 border-b border-gray-100 dark:border-white/5 transition-colors flex items-start gap-4 hover:bg-white dark:hover:bg-white/5",
                                    activeChatId === chat.id && "bg-white dark:bg-white/10 shadow-sm"
                                )}
                            >
                                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-black/20 shrink-0 overflow-hidden relative">
                                    <UserBadge uid={chat.userId} size="sm" hideName className="absolute inset-0" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-black text-black dark:text-white truncate">User {chat.userId.substring(0, 5)}</p>
                                        {chat.unreadAdminCount > 0 && (
                                            <div className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                                                {chat.unreadAdminCount}
                                            </div>
                                        )}
                                    </div>
                                    <p className={cn("text-xs truncate", chat.unreadAdminCount > 0 ? "text-black dark:text-white font-bold" : "text-gray-500")}>
                                        {chat.lastMessage}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col relative">
                {activeChatId ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 px-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-[#0A101D]/50 backdrop-blur-md absolute top-0 w-full z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center border border-gray-200 dark:border-white/10">
                                    <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-black dark:text-white uppercase tracking-widest">Active Ticket</p>
                                    <p className="text-[10px] text-gray-400 font-mono">{activeChatId}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-6 pt-24 pb-6 custom-scrollbar space-y-4" ref={scrollRef}>
                            {messages.map((msg, idx) => {
                                const isAdmin = msg.sender === 'admin';
                                const showTime = idx === 0 || msg.createdAt?.toMillis() - messages[idx-1].createdAt?.toMillis() > 300000;
                                
                                return (
                                    <div key={msg.id} className={cn("flex flex-col max-w-[70%]", isAdmin ? "self-end items-end" : "self-start items-start")}>
                                        {showTime && msg.createdAt && (
                                            <span className="text-[10px] font-bold text-gray-400 mb-2 px-2">
                                                {format(msg.createdAt.toDate(), 'h:mm a')}
                                            </span>
                                        )}
                                        <div className={cn(
                                            "px-5 py-3 text-sm font-medium",
                                            isAdmin 
                                                ? "bg-black text-white dark:bg-white dark:text-black rounded-2xl rounded-tr-sm" 
                                                : "bg-[#FAFAFA] dark:bg-[#162032] border border-gray-200 dark:border-white/5 text-black dark:text-white rounded-2xl rounded-tl-sm"
                                        )}>
                                            {msg.text}
                                        </div>
                                    </div>
                                );
                            })}
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <MessageSquare className="w-12 h-12 opacity-20 mb-4" />
                                    <p className="font-bold text-sm">No messages yet.</p>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0A101D]">
                            <form onSubmit={handleSend} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 bg-gray-50 dark:bg-[#162032] border border-gray-200 dark:border-white/5 text-black dark:text-white px-5 py-3.5 rounded-2xl outline-none focus:border-black dark:focus:border-white transition-colors text-sm font-medium"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || sending}
                                    className="w-12 h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shrink-0"
                                >
                                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                        <HeartHandshake className="w-16 h-16 opacity-20 mb-6" />
                        <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-widest mb-2">Select a Ticket</h2>
                        <p className="text-sm font-bold text-gray-500 max-w-xs">Choose a conversation from the sidebar to provide real-time support.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
