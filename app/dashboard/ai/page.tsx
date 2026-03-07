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
    ArrowLeft,
    Bot,
    Clock,
    Image as ImageIcon,
    Loader2,
    Plus,
    Send,
    Sparkles,
    Trash2,
    User
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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Fetch sessions
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

    // 2. Fetch messages for active session
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
    };

    const handleDeleteSession = async (sessionId: string) => {
        if (!user) return;
        try {
            // Delete messages first
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
            // Create a new session if none is active
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
            // 1. Save user message
            await addDoc(collection(db, 'users', user.uid, 'ai_sessions', sessionId, 'messages'), {
                role: 'user',
                text: text,
                image: imageURL || null,
                createdAt: serverTimestamp()
            });

            // 2. Update session
            await updateDoc(doc(db, 'users', user.uid, 'ai_sessions', sessionId), {
                title: text.slice(0, 30) || 'Conversation',
                lastText: text || 'Image shared',
                updatedAt: serverTimestamp()
            });

            // 3. Call AI API
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

            // 4. Save AI response
            await addDoc(collection(db, 'users', user.uid, 'ai_sessions', sessionId, 'messages'), {
                role: 'ai',
                text: data.reply || "I'm sorry, I couldn't process that.",
                createdAt: serverTimestamp()
            });

        } catch (error) {
            console.error('AI Error:', error);
        } finally {
            setLoading(false);
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
        <div className="h-[calc(100vh-180px)] overflow-hidden flex flex-col md:flex-row bg-white/5 border border-white/10 rounded-[40px] animate-fade-in-up">

            {/* Sidebar: Chat History */}
            <aside className={cn(
                "w-full md:w-80 border-r border-white/5 flex flex-col transition-all",
                activeSession ? "hidden md:flex" : "flex"
            )}>
                <div className="p-6 border-b border-white/5">
                    <button
                        onClick={createNewChat}
                        className="w-full py-4 rounded-2xl bg-walia-primary text-white font-bold flex items-center justify-center hover:bg-walia-secondary transition-all shadow-lg shadow-walia-primary/20"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    <div className="flex items-center justify-between px-4 mb-4">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">History</p>
                        <Clock className="w-3 h-3 text-white/10" />
                    </div>
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            onClick={() => setActiveSession(session.id)}
                            className={cn(
                                "p-4 rounded-2xl cursor-pointer group transition-all relative overflow-hidden",
                                activeSession === session.id ? "bg-white/10" : "hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center justify-between mb-1 pr-6">
                                <h4 className="text-sm font-bold text-white truncate max-w-[140px]">{session.title}</h4>
                                <span className="text-[10px] text-white/30 font-medium">{formatTimeAgo(session.updatedAt)}</span>
                            </div>
                            <p className="text-xs text-white/40 truncate">{session.lastText}</p>

                            <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                    {sessions.length === 0 && (
                        <div className="text-center py-10">
                            <Bot className="w-10 h-10 text-white/5 mx-auto mb-4" />
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">No chats yet</p>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className={cn(
                "flex-1 flex flex-col transition-all relative",
                !activeSession && "hidden md:flex justify-center items-center"
            )}>
                {!activeSession ? (
                    <div className="text-center max-w-sm space-y-8 animate-fade-in">
                        <div className="w-24 h-24 rounded-[40px] bg-walia-primary/10 border border-walia-primary/20 flex items-center justify-center mx-auto relative group">
                            <Sparkles className="w-10 h-10 text-walia-primary group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 rounded-[40px] bg-walia-primary/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-white">Walia AI Hub</h2>
                            <p className="text-sm text-white/30 leading-relaxed font-medium px-8">
                                Select a previous session or start a new academic interaction with Walia AI.
                            </p>
                        </div>
                        <button
                            onClick={createNewChat}
                            className="px-10 py-4 rounded-3xl bg-white text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                        >
                            Start Chatting
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <header className="px-8 h-20 border-b border-white/5 flex items-center justify-between bg-black/20">
                            <div className="flex items-center">
                                <button className="md:hidden mr-4 text-white/40" onClick={() => setActiveSession(null)}>
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-walia-primary/20 flex items-center justify-center mr-4 border border-walia-primary/30">
                                    <Bot className="w-5 h-5 text-walia-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Walia AI</h3>
                                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active · Gemini 2.0</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleDeleteSession(activeSession)}
                                    className="p-3 rounded-xl hover:bg-white/5 transition-all text-white/20 hover:text-red-500"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </header>

                        {/* Message Container */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <div
                                    key={msg.id || i}
                                    className={cn(
                                        "flex w-full mb-4 animate-fade-in-up",
                                        msg.role === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div className={cn(
                                        "flex max-w-[85%] items-start space-x-4",
                                        msg.role === 'user' ? "flex-row-reverse space-x-reverse" : "flex-row"
                                    )}>
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                                            msg.role === 'user' ? "bg-white/5 border-white/10" : "bg-walia-primary/10 border-walia-primary/20"
                                        )}>
                                            {msg.role === 'user' ? <User className="w-5 h-5 text-white/40" /> : <Bot className="w-5 h-5 text-walia-primary" />}
                                        </div>
                                        <div className={cn(
                                            "rounded-3xl text-sm leading-relaxed shadow-sm overflow-hidden",
                                            msg.role === 'user'
                                                ? "bg-walia-primary text-white rounded-tr-none"
                                                : "bg-white/5 text-white/80 border border-white/10 rounded-tl-none",
                                            msg.image ? "p-2" : "p-6"
                                        )}>
                                            {msg.image && (
                                                <div className="relative w-72 h-72 rounded-2xl overflow-hidden mb-4 bg-black/50">
                                                    <Image src={msg.image} alt="AI Attachment" fill className="object-cover" unoptimized />
                                                </div>
                                            )}
                                            {msg.text && (
                                                <div className={cn(msg.image ? "px-4 pb-4 pt-2" : "")}>
                                                    {msg.text}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start animate-fade-in">
                                    <div className="flex max-w-[80%] items-start space-x-4">
                                        <div className="w-10 h-10 rounded-xl bg-walia-primary/10 border border-walia-primary/20 flex items-center justify-center shrink-0">
                                            <Bot className="w-5 h-5 text-walia-primary" />
                                        </div>
                                        <div className="p-6 rounded-3xl bg-white/5 text-white/80 border border-white/10 rounded-tl-none">
                                            <div className="flex gap-1.5 items-center">
                                                <div className="w-2 h-2 rounded-full bg-walia-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-2 h-2 rounded-full bg-walia-primary animate-bounce" style={{ animationDelay: '200ms' }} />
                                                <div className="w-2 h-2 rounded-full bg-walia-primary animate-bounce" style={{ animationDelay: '400ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Bar */}
                        <div className="p-6">
                            <div className="relative group max-w-4xl mx-auto flex items-center space-x-4">
                                <div className="flex-1 bg-white/5 border border-white/10 rounded-[32px] overflow-hidden flex items-center focus-within:border-walia-primary transition-all shadow-lg">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="p-6 hover:bg-white/5 text-white/20 hover:text-walia-primary transition-colors disabled:opacity-50"
                                    >
                                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Ask Walia AI about your studies..."
                                        className="flex-1 bg-transparent py-6 text-white placeholder:text-white/20 outline-none"
                                    />
                                    <button
                                        onClick={() => handleSend()}
                                        disabled={(!message.trim() && !uploading) || loading}
                                        className="m-2 p-4 rounded-2xl bg-walia-primary text-white hover:bg-walia-secondary transition-all flex items-center justify-center shadow-lg disabled:opacity-20"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-center mt-4 text-[10px] text-white/20 font-medium">
                                Walia AI can make mistakes. Persistent history enabled.
                            </p>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
