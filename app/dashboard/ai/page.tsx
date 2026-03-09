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
    Clock,
    Loader2,
    MessageSquarePlus,
    Plus,
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
        <div className="h-full flex relative bg-white overflow-hidden text-black animate-in fade-in">

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative min-w-0">

                {/* Header (Top Right Tools) */}
                <header className="absolute top-6 right-6 z-10 flex items-center gap-3">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors text-sm font-bold"
                    >
                        <Clock className="w-4 h-4" />
                        <span className="hidden sm:inline">History</span>
                    </button>
                    <button
                        onClick={createNewChat}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black text-white shadow-md hover:bg-zinc-800 transition-colors text-sm font-bold"
                    >
                        <MessageSquarePlus className="w-4 h-4" />
                        <span className="hidden sm:inline">New Chat</span>
                    </button>
                </header>

                {!activeSession ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in slide-in-from-bottom-4">
                        <div className="w-20 h-20 rounded-3xl bg-black border-[6px] border-gray-100 flex items-center justify-center mb-8 shadow-2xl">
                            <Bot className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                            Good to see you,<br />
                            {user?.displayName?.split(' ')[0] || 'Voyager'}
                        </h1>
                        <p className="text-gray-500 font-medium max-w-sm">
                            I am Walia AI, your personal study assistant. Ask me anything, generate notes, or summarize PDFs.
                        </p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto w-full pt-24 pb-32 px-4 custom-scrollbar">
                        <div className="max-w-3xl mx-auto space-y-8">
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
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shrink-0 shadow-sm",
                                            msg.role === 'user' ? "bg-black" : "bg-white border border-gray-200"
                                        )}>
                                            {msg.role === 'user' ? (
                                                <User className="w-4 h-4 text-white" />
                                            ) : (
                                                <Bot className="w-4 h-4 text-black" />
                                            )}
                                        </div>
                                        <div className={cn(
                                            "rounded-[28px] text-sm leading-relaxed px-6 py-4 border shadow-sm",
                                            msg.role === 'user'
                                                ? "bg-black text-white border-black rounded-br-sm"
                                                : "bg-white text-black border-gray-100 rounded-bl-sm"
                                        )}>
                                            {msg.image && (
                                                <div className="relative w-64 h-64 rounded-2xl overflow-hidden mb-3 border border-gray-100">
                                                    <Image src={msg.image} alt="Upload" fill className="object-cover" unoptimized />
                                                </div>
                                            )}
                                            {msg.text && (
                                                <div className="whitespace-pre-wrap">{msg.text}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start animate-in fade-in">
                                    <div className="flex max-w-[85%] items-end gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                                            <Bot className="w-4 h-4 text-black" />
                                        </div>
                                        <div className="px-6 py-5 rounded-[28px] rounded-bl-sm bg-white border border-gray-100 shadow-sm">
                                            <div className="flex gap-1.5 items-center">
                                                <div className="w-2 h-2 rounded-full bg-black animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-2 h-2 rounded-full bg-black animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-2 h-2 rounded-full bg-black animate-bounce" style={{ animationDelay: '300ms' }} />
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
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
                    <div className="max-w-3xl mx-auto relative pointer-events-auto">
                        <div className="bg-white border-2 border-black rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-end p-2 transition-all focus-within:ring-4 focus-within:ring-black/5">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="p-4 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors shrink-0 disabled:opacity-50"
                            >
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />

                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Ask anything..."
                                className="flex-1 bg-transparent py-4 px-2 text-black font-medium placeholder:text-gray-400 outline-none resize-none max-h-32 min-h-[56px] custom-scrollbar"
                                rows={1}
                            />

                            <button
                                onClick={() => handleSend()}
                                disabled={(!message.trim() && !uploading) || loading}
                                className="m-1 p-3.5 rounded-full bg-black text-white hover:bg-zinc-800 transition-all flex items-center justify-center shrink-0 disabled:opacity-20 disabled:hover:bg-black"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-center mt-3 text-xs text-gray-400 font-medium">
                            AI can make mistakes. Always verify important information.
                        </p>
                    </div>
                </div>

            </main>

            {/* Right Sidebar: History Panel */}
            {showHistory && (
                <aside className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col absolute right-0 inset-y-0 z-20 animate-in slide-in-from-right shadow-2xl md:relative md:shadow-none">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white">
                        <h3 className="font-black text-lg">History</h3>
                        <button onClick={() => setShowHistory(false)} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
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
                                        ? "bg-white border-black shadow-md"
                                        : "bg-transparent border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm"
                                )}
                            >
                                <div className="flex items-start justify-between mb-1 pr-6">
                                    <h4 className="text-sm font-bold text-black truncate max-w-[160px]">{session.title}</h4>
                                </div>
                                <p className="text-xs text-gray-500 font-medium truncate mb-2">{session.lastText}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{formatTimeAgo(session.updatedAt)}</p>

                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-red-50 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {sessions.length === 0 && (
                            <div className="text-center py-10 opacity-50">
                                <Bot className="w-8 h-8 text-black mx-auto mb-3" />
                                <p className="text-sm font-bold">No sessions yet</p>
                            </div>
                        )}
                    </div>
                </aside>
            )}

        </div>
    );
}
