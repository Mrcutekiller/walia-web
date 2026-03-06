'use client';

import DashboardShell from '@/components/DashboardShell';
import ReviewBanner from '@/components/ReviewBanner';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';
import { ImagePlus, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: any;
}

const SUGGESTIONS = [
    'Explain photosynthesis simply',
    'Help me write an essay outline',
    'Create 5 flashcards on World War II',
    'Solve this math problem step by step',
    'Give me a study plan for finals',
    'Summarise a chapter on Newton\'s laws',
];

const FREE_DAILY_LIMIT = 1000;

export default function ChatPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [usageCount, setUsageCount] = useState(0);
    const [plan, setPlan] = useState<'free' | 'pro'>('free');
    const [attachments, setAttachments] = useState<{ type: string; base64: string; name: string; text?: string }[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // Load messages from Firestore
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'users', user.uid, 'messages'),
            orderBy('createdAt', 'asc'),
            limit(100)
        );
        const unsub = onSnapshot(q, snap => {
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
        });
        return () => unsub();
    }, [user]);

    // Load user plan and daily usage
    useEffect(() => {
        if (!user) return;
        getDoc(doc(db, 'users', user.uid)).then(d => {
            if (d.exists()) {
                const data = d.data();
                setPlan(data.plan || 'free');
            }
        });
        const today = new Date().toISOString().split('T')[0];
        getDoc(doc(db, 'usage', `${user.uid}_${today}`)).then(d => {
            setUsageCount(d.exists() ? d.data()?.count || 0 : 0);
        });
    }, [user]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (ev) => {
            const base64 = ev.target?.result as string;
            let text = '';

            if (file.type === 'application/pdf') {
                // In a real app, we'd use pdf.js here. 
                // For now, we'll label it as PDF and let the AI know.
                text = `[PDF: ${file.name}]`;
            }

            setAttachments(prev => [...prev, {
                type: file.type,
                base64,
                name: file.name,
                text
            }]);
        };
        reader.readAsDataURL(file);
    };

    const limitReached = plan === 'free' && usageCount >= FREE_DAILY_LIMIT;

    const sendMessage = async (text?: string) => {
        const content = (text || input).trim();
        if ((!content && attachments.length === 0) || !user) return;
        if (limitReached) return;

        setSending(true);
        setInput('');
        const currentAttachments = [...attachments];
        setAttachments([]);

        const userContent = currentAttachments.length > 0
            ? `${content}\n${currentAttachments.map(a => `[Attached ${a.name}]`).join('\n')}`
            : content;

        try {
            // Save user message
            await addDoc(collection(db, 'users', user.uid, 'messages'), {
                role: 'user', content: userContent, createdAt: serverTimestamp(),
            });

            // Update usage count for free plan
            if (plan === 'free') {
                const today = new Date().toISOString().split('T')[0];
                const usageRef = doc(db, 'usage', `${user.uid}_${today}`);
                const newCount = usageCount + 1;
                await setDoc(usageRef, { count: newCount, userId: user.uid, date: today }, { merge: true });
                setUsageCount(newCount);
            }

            // Call API
            const recentHistory = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 40000); // 40s timeout
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: content,
                    history: recentHistory,
                    attachments: currentAttachments
                }),
                signal: controller.signal,
            });
            clearTimeout(timeout);

            const data = await res.json();

            if (!res.ok) throw new Error(data.reply || 'API Error');

            await addDoc(collection(db, 'users', user.uid, 'messages'), {
                role: 'assistant',
                content: data.reply || "I'm here to help! Try rephrasing your question.",
                createdAt: serverTimestamp(),
            });
        } catch (error: any) {
            console.error('Chat error:', error);
            await addDoc(collection(db, 'users', user.uid, 'messages'), {
                role: 'assistant',
                content: error.name === 'AbortError'
                    ? 'The AI is taking too long to respond. Please try again.'
                    : `Error: ${error.message || 'I had trouble connecting.'}`,
                createdAt: serverTimestamp(),
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <DashboardShell>
            <div className="flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-white/5 shrink-0 flex flex-col gap-0 p-0 overflow-visible">
                    <div className="flex items-center justify-between pb-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white">Walia AI</p>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <p className="text-[10px] text-white/30">Online · Gemini 1.5 Flash</p>
                                </div>
                            </div>
                        </div>
                        {plan === 'free' && (
                            <div className="text-right">
                                <p className="text-[10px] text-white/30">
                                    {usageCount}/{FREE_DAILY_LIMIT} free messages today
                                </p>
                                <div className="w-24 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                                    <div className="h-full bg-white/40 rounded-full transition-all" style={{ width: `${(usageCount / FREE_DAILY_LIMIT) * 100}%` }} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <ReviewBanner />

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10">
                            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-5">
                                <Sparkles className="w-8 h-8 text-white/20" />
                            </div>
                            <h2 className="text-xl font-black text-white mb-2">
                                Hi {user?.displayName?.split(' ')[0] || 'there'}! 👋
                            </h2>
                            <p className="text-white/30 text-sm mb-8 max-w-sm">
                                I'm Walia AI — your personal study companion. Ask me anything!
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                                {SUGGESTIONS.map(s => (
                                    <button key={s} onClick={() => sendMessage(s)}
                                        className="text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-xs text-white/50 hover:text-white font-medium">
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map(msg => (
                            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Sparkles className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}
                                <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                    ? 'bg-white text-black font-medium rounded-br-sm'
                                    : 'bg-white/8 text-white/85 rounded-bl-sm border border-white/10'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))
                    )}
                    {sending && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                <Sparkles className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="px-4 py-3 rounded-2xl bg-white/8 border border-white/10">
                                <div className="flex gap-1">
                                    {[0, 150, 300].map(d => (
                                        <div key={d} className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Limit banner */}
                {limitReached && (
                    <div className="mx-4 mb-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                        <p className="text-xs text-amber-400 font-bold">Free daily limit reached ({usageCount}/{FREE_DAILY_LIMIT}).</p>
                        <a href="/upgrade" className="text-xs text-amber-300 underline">Upgrade to Pro for unlimited messages →</a>
                    </div>
                )}

                {/* Attachment previews */}
                {attachments.length > 0 && (
                    <div className="mx-4 mb-2 flex flex-wrap gap-2">
                        {attachments.map((at, i) => (
                            <div key={i} className="relative group">
                                {at.type.startsWith('image/') ? (
                                    <img src={at.base64} className="h-20 w-20 rounded-xl object-cover border border-white/20" alt="Preview" />
                                ) : (
                                    <div className="h-20 w-20 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-2 text-center">
                                        <div className="text-xs font-black text-white/40 uppercase">PDF</div>
                                        <div className="text-[8px] text-white/20 truncate w-full mt-1">{at.name}</div>
                                    </div>
                                )}
                                <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-3 h-3 text-white" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className="px-4 pb-5 pt-3 border-t border-white/5 shrink-0">
                    <div className="flex items-end gap-2 max-w-3xl mx-auto">
                        <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFile} />
                        <button onClick={() => fileRef.current?.click()} disabled={limitReached}
                            className="w-11 h-11 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/15 transition-all disabled:opacity-20 shrink-0">
                            <ImagePlus className="w-4 h-4" />
                        </button>
                        <div className="flex-1 bg-white/8 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-white/30 transition-colors">
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                placeholder={limitReached ? 'Daily limit reached. Upgrade to Pro.' : 'Ask Walia anything...'}
                                disabled={limitReached}
                                rows={1}
                                className="w-full bg-transparent text-white text-sm placeholder:text-white/25 outline-none resize-none leading-relaxed disabled:opacity-40"
                                style={{ maxHeight: '120px' }}
                            />
                        </div>
                        <button onClick={() => sendMessage()} disabled={(!input.trim() && attachments.length === 0) || sending || limitReached}
                            className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center hover:bg-white/90 transition-all disabled:opacity-25 shrink-0">
                            <Send className="w-4 h-4 text-black" />
                        </button>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
