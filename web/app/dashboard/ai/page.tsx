'use client';

import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { cn, formatTimeAgo } from '@/lib/utils';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
    ArrowRight,
    Bot,
    CalendarDays,
    Clock,
    Loader2,
    MessageSquarePlus,
    Mic,
    Paperclip,
    Trash2
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface AISession {
    id: string;
    title: string;
    lastText: string;
    updatedAt: any;
}

interface Message {
    id: string;
    role: 'user' | 'ai';
    text: string;
    image?: string;
    createdAt: any;
}

export default function AIHubPage() {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<AISession[]>([]);
    const [activeSession, setActiveSession] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch sessions
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'users', user.uid, 'ai_sessions'),
            orderBy('updatedAt', 'desc')
        );
        const unsub = onSnapshot(q, (snap) => {
            setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() } as AISession)));
        });
        return () => unsub();
    }, [user]);

    // Fetch messages for active session
    useEffect(() => {
        if (!activeSession || !user) {
            setMessages([]);
            return;
        }
        const q = query(
            collection(db, 'users', user.uid, 'ai_sessions', activeSession, 'messages'),
            orderBy('createdAt', 'asc')
        );
        const unsub = onSnapshot(q, (snap) => {
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
            scrollToBottom();
        });
        return () => unsub();
    }, [activeSession, user]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const createNewChat = async () => {
        if (!user) return;
        const sessionRef = await addDoc(collection(db, 'users', user.uid, 'ai_sessions'), {
            title: 'New Conversation',
            lastText: 'Starting...',
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp()
        });
        setActiveSession(sessionRef.id);
        setMessages([]);
        setShowHistory(false);
    };

    const handleDeleteSession = async (sessionId: string) => {
        if (!user) return;
        try {
            const msgSnap = await getDocs(collection(db, 'users', user.uid, 'ai_sessions', sessionId, 'messages'));
            for (const d of msgSnap.docs) {
                await deleteDoc(d.ref);
            }
            await deleteDoc(doc(db, 'users', user.uid, 'ai_sessions', sessionId));
            if (activeSession === sessionId) setActiveSession(null);
        } catch (error) {
            console.error('Delete session error:', error);
        }
    };

    const handleSend = async (imageURL?: string) => {
        if ((!message.trim() && !imageURL) || !user) return;

        let sessionId = activeSession;
        if (!sessionId) {
            const sessionRef = await addDoc(collection(db, 'users', user.uid, 'ai_sessions'), {
                title: message.slice(0, 30) || 'Image Analysis',
                lastText: message || 'Image sent',
                updatedAt: serverTimestamp(),
                createdAt: serverTimestamp()
            });
            sessionId = sessionRef.id;
            setActiveSession(sessionId);
        }

        const text = message.trim();
        setMessage('');
        setLoading(true);

        try {
            await addDoc(collection(db, 'users', user.uid, 'ai_sessions', sessionId, 'messages'), {
                role: 'user',
                text: text,
                image: imageURL || null,
                createdAt: serverTimestamp()
            });

            await updateDoc(doc(db, 'users', user.uid, 'ai_sessions', sessionId), {
                title: text.slice(0, 30) || 'Conversation',
                lastText: text || 'Image shared',
                updatedAt: serverTimestamp()
            });

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: messages.slice(-10).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
                    attachments: imageURL ? [{ type: 'image/jpeg', base64: imageURL, name: 'image.jpg' }] : []
                })
            });

            const data = await res.json();

            await addDoc(collection(db, 'users', user.uid, 'ai_sessions', sessionId, 'messages'), {
                role: 'ai',
                text: data.reply || "I'm sorry, I couldn't process that.",
                createdAt: serverTimestamp()
            });

        } catch (error) {
            console.error('AI Error:', error);
        } finally {
            setLoading(false);
            scrollToBottom();
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `ai/${user.uid}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            await handleSend(url);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="h-full flex relative bg-[#0A101D] overflow-hidden text-white animate-in fade-in">

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative min-w-0">

                {/* Header (Top Right Tools) */}
                <header className="absolute top-6 right-6 z-10 flex items-center gap-3">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-bold shadow-xl shadow-black/20"
                    >
                        <Clock className="w-4 h-4" />
                        <span className="hidden sm:inline">History</span>
                    </button>
                    <button
                        onClick={createNewChat}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#4ade80] text-black hover:bg-[#22c55e] transition-colors text-sm font-bold shadow-xl shadow-[#4ade80]/20"
                    >
                        <MessageSquarePlus className="w-4 h-4" />
                        <span className="hidden sm:inline">New Chat</span>
                    </button>
                </header>

                {!activeSession ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in slide-in-from-bottom-4 relative z-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4ade80]/5 rounded-full blur-[100px] pointer-events-none" />
                        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-2xl relative z-10 backdrop-blur-sm">
                            <Bot className="w-8 h-8 text-[#4ade80]" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white relative z-10">
                            Good to see you,<br />
                            <span className="text-[#4ade80]">{user?.displayName?.split(' ')[0] || 'Voyager'}</span>
                        </h1>
                        <p className="text-[#94A3B8] font-medium max-w-sm relative z-10 text-lg">
                            I am Walia AI, your personal intelligence. Ask me anything.
                        </p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto w-full pt-28 pb-40 px-4 custom-scrollbar">
                        <div className="max-w-4xl mx-auto space-y-8">
                            {messages.map((msg, i) => (
                                <div
                                    key={msg.id || i}
                                    className={cn(
                                        "flex w-full animate-in slide-in-from-bottom-2",
                                        msg.role === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div className={cn(
                                        "flex max-w-[85%] items-end gap-3",
                                        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                    )}>
                                        {msg.role === 'ai' && (
                                            <div className="w-8 h-8 rounded-full bg-[#1E293B] border border-white/10 flex items-center justify-center shrink-0 shadow-sm flex-col">
                                                <Bot className="w-4 h-4 text-[#4ade80]" />
                                            </div>
                                        )}
                                        <div className={cn(
                                            "rounded-3xl text-sm leading-relaxed px-6 py-4 border shadow-sm",
                                            msg.role === 'user'
                                                ? "bg-white text-black border-white rounded-br-sm font-medium"
                                                : "bg-[#1E293B] text-white border-white/5 rounded-bl-sm font-medium"
                                        )}>
                                            {msg.image && (
                                                <div className="relative w-64 h-64 rounded-2xl overflow-hidden mb-3 border border-white/10">
                                                    <Image src={msg.image} alt="Upload" fill className="object-cover" unoptimized />
                                                </div>
                                            )}
                                            {msg.text && (
                                                <div className="whitespace-pre-wrap leading-7">{msg.text}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start animate-in fade-in">
                                    <div className="flex max-w-[85%] items-end gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#1E293B] border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                                            <Bot className="w-4 h-4 text-[#4ade80]" />
                                        </div>
                                        <div className="px-6 py-5 rounded-3xl rounded-bl-sm bg-[#1E293B] border border-white/5 shadow-sm">
                                            <div className="flex gap-1.5 items-center">
                                                <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    </div>
                )}

                {/* Bottom Input Area */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0A101D] via-[#0A101D] to-transparent pointer-events-none pb-8">
                    <div className="max-w-4xl mx-auto relative pointer-events-auto">
                        <div className="bg-[#182134] border-2 border-[#1E293B] rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] flex flex-col p-2 transition-all focus-within:ring-2 focus-within:ring-[#4ade80]/20 focus-within:border-white/20">

                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Message Walia AI..."
                                className="w-full bg-transparent py-4 px-4 text-white font-medium placeholder:text-[#64748B] outline-none resize-none max-h-40 min-h-[72px] custom-scrollbar text-base"
                                rows={1}
                            />

                            {/* Toolbar actions */}
                            <div className="flex items-center justify-between px-2 pb-2">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="p-2.5 rounded-xl hover:bg-white/5 text-[#64748B] hover:text-white transition-colors shrink-0 disabled:opacity-50 relative group"
                                        title="Attach File"
                                    >
                                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                                    </button>
                                    <button className="p-2.5 rounded-xl hover:bg-white/5 text-[#64748B] hover:text-white transition-colors shrink-0 tooltip-trigger" title="Voice Search">
                                        <Mic className="w-5 h-5" />
                                    </button>
                                    <button className="p-2.5 rounded-xl hover:bg-white/5 text-[#64748B] hover:text-white transition-colors shrink-0 tooltip-trigger" title="Add Event">
                                        <CalendarDays className="w-5 h-5" />
                                    </button>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>

                                <button
                                    onClick={() => handleSend()}
                                    disabled={(!message.trim() && !uploading) || loading}
                                    className="px-6 py-2.5 rounded-xl bg-white text-black hover:bg-gray-200 transition-all flex items-center gap-2 font-bold text-sm shrink-0 disabled:opacity-20 disabled:hover:bg-white group"
                                >
                                    <span>Send</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                        <p className="text-center mt-4 text-[11px] text-[#64748B] font-medium tracking-wide">
                            Walia AI is an experimental model. Please verify critical information.
                        </p>
                    </div>
                </div>

            </main>

            {/* Right Sidebar: History Panel */}
            {showHistory && (
                <aside className="w-80 border-l border-[#1E293B] bg-[#0A101D] flex flex-col absolute right-0 inset-y-0 z-20 animate-in slide-in-from-right shadow-2xl md:relative md:shadow-none">
                    <div className="p-6 border-b border-[#1E293B] flex items-center justify-between bg-[#0F172A]">
                        <h3 className="font-black text-lg text-white">Chat History</h3>
                        <button onClick={() => setShowHistory(false)} className="md:hidden p-2 hover:bg-white/10 rounded-full text-[#94A3B8]">
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                onClick={() => { setActiveSession(session.id); setShowHistory(false); }}
                                className={cn(
                                    "p-4 rounded-2xl cursor-pointer group transition-all relative overflow-hidden border",
                                    activeSession === session.id
                                        ? "bg-white/10 border-white/20 shadow-md"
                                        : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/10"
                                )}
                            >
                                <div className="flex items-start justify-between mb-1 pr-6">
                                    <h4 className="text-sm font-bold text-white truncate max-w-[160px]">{session.title}</h4>
                                </div>
                                <p className="text-xs text-[#94A3B8] font-medium truncate mb-2">{session.lastText}</p>
                                <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">{formatTimeAgo(session.updatedAt)}</p>

                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {sessions.length === 0 && (
                            <div className="text-center py-10 opacity-50">
                                <Bot className="w-8 h-8 text-[#94A3B8] mx-auto mb-3 opacity-50" />
                                <p className="text-sm font-bold text-[#94A3B8]">No history found</p>
                            </div>
                        )}
                    </div>
                </aside>
            )}

        </div>
    );
}
