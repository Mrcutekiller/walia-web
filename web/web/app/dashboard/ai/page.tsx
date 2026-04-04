'use client';

import { useAuth } from '@/context/AuthContext';
import { 
    ArrowUp, Sparkles, User, Brain, Paperclip, 
    Loader2, History, MessageSquare, 
    Plus, Trash2, Share2, PlusCircle, Image as ImageIcon, Mic, Globe
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTokens } from '@/context/TokenContext';
import { useRouter } from 'next/navigation';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    attachments?: any[];
}

const MODES = [
    { id: 'Study', label: 'Study Helper', icon: Brain, desc: 'Academic & tutoring' },
    { id: 'Work', label: 'Work Assistant', icon: Sparkles, desc: 'Productive workflows' },
    { id: 'Debate', label: 'Debate AI', icon: MessageSquare, desc: 'Critical logic' },
    { id: 'Fun', label: 'Fun Mode', icon: Sparkles, desc: 'Entertaining chats' },
];

export default function AIChatPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Welcome back. How can I assist you with your professional creative workflow today? I can help you draft editorial copy, analyze market trends, or manage your digital atelier.",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState(MODES[0]);
    const [isSidebarOpen] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { tokenDisplay, isPro, consumeTokens } = useTokens();
    const router = useRouter();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        if (!consumeTokens('ai_chat')) {
            alert("🪙 Out of Tokens! Upgrade to Pro for unlimited AI chats.");
            return;
        }

        const userMsg: Message = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    history: messages.map(m => ({ role: m.role, content: m.content })),
                    systemPrompt: `You are in ${mode.id} mode. ${mode.desc}.`
                })
            });

            const data = await res.json();
            
            const aiMsg: Message = {
                role: 'assistant',
                content: data.reply || "I'm having trouble thinking right now. Please try again.",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I lost my connection. Please check your internet or try again.",
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full bg-[var(--color-surface)] overflow-hidden font-[family-name:var(--font-inter)] relative">
            
            {/* ── LEFT INNER SIDEBAR (History/Modes) ── */}
            <AnimatePresence initial={false}>
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="h-full bg-[var(--color-surface-container-low)] flex flex-col z-10 shrink-0"
                    >
                        <div className="p-6">
                            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-on-primary)] font-black text-xs uppercase tracking-widest hover:bg-[var(--color-surface-container-highest)] hover:text-white transition-all active:scale-95 font-[family-name:var(--font-manrope)]">
                                <Plus className="w-4 h-4" /> New Session
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                            {/* AI Modes */}
                            <div>
                                <p className="text-[10px] font-bold text-[var(--color-outline-variant)] uppercase tracking-[0.2em] mb-3 px-2 font-[family-name:var(--font-manrope)]">AI Personas</p>
                                <div className="space-y-1">
                                    {MODES.map((m) => {
                                        const Icon = m.icon;
                                        const active = mode.id === m.id;
                                        return (
                                            <button
                                                key={m.id}
                                                onClick={() => setMode(m)}
                                                className={cn(
                                                    "w-full flex items-center gap-4 p-3 rounded-none transition-all group",
                                                    active ? "bg-[var(--color-surface-container-lowest)] border-l-2 border-[var(--color-on-background)]" : "hover:bg-[var(--color-surface-container)]"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm",
                                                    active ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]" : "bg-[var(--color-surface-container-high)] text-[var(--color-outline-variant)] group-hover:text-white"
                                                )}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div className="text-left">
                                                    <p className={cn("text-sm font-semibold font-[family-name:var(--font-manrope)] tracking-tight", active ? "text-white" : "text-[var(--color-outline-variant)] group-hover:text-white")}>{m.label}</p>
                                                    <p className="text-[10px] text-[var(--color-outline-variant)] font-medium truncate w-32">{m.desc}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Mock History */}
                            <div>
                                <p className="text-[10px] font-bold text-[var(--color-outline-variant)] uppercase tracking-[0.2em] mb-3 px-2 font-[family-name:var(--font-manrope)]">Recent History</p>
                                <div className="space-y-1">
                                    {[
                                        "Tonal Architecture Design", 
                                        "Quantum Physics Primer", 
                                        "Amharic Market Trends"
                                    ].map((h, i) => (
                                        <button key={i} className="w-full flex items-center justify-between p-3 rounded-none hover:bg-[var(--color-surface-container)] transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <History className="w-4 h-4 text-[var(--color-outline-variant)]" />
                                                <p className="text-xs font-semibold text-[var(--color-outline-variant)] group-hover:text-white truncate w-36 text-left font-[family-name:var(--font-manrope)] tracking-tight">{h}</p>
                                            </div>
                                            <Trash2 className="w-3.5 h-3.5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Credits / Plan */}
                        <div className="p-6">
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-[var(--color-on-primary)] relative overflow-hidden group shadow-lg">
                                <Sparkles className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1 font-[family-name:var(--font-manrope)]">Daily Tokens</p>
                                <p className="text-2xl font-black font-[family-name:var(--font-manrope)]">{tokenDisplay}</p>
                                <p className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-wider">{isPro ? 'Pro Active' : 'Resets in 24h'}</p>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ── MAIN CHAT CANVAS ── */}
            <main className="flex-1 flex flex-col min-w-0 bg-[var(--color-surface)] relative">
                
                {/* Messages Body */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-6 md:px-20 py-10 space-y-16 custom-scrollbar pb-64"
                >
                    <AnimatePresence initial={false}>
                        {messages.map((m, i) => {
                            const isUser = m.role === 'user';
                            return (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "max-w-4xl mx-auto flex gap-6 md:gap-8",
                                        isUser ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    <div className={cn(
                                        "flex-shrink-0 flex items-center justify-center overflow-hidden",
                                        isUser ? "w-11 h-11 rounded-full bg-[var(--color-surface-container)]" : "w-11 h-11 rounded-xl bg-[var(--color-surface-container)] text-[var(--color-outline-variant)]"
                                    )}>
                                        {isUser ? (
                                            user?.photoURL ? (
                                                <img src={user.photoURL} alt="" className="w-full h-full object-cover grayscale contrast-125" />
                                            ) : <User className="w-5 h-5 text-[var(--color-on-background)]" />
                                        ) : (
                                            <Sparkles className="w-5 h-5 text-[var(--color-primary-dim)]" />
                                        )}
                                    </div>

                                    <div className={cn(
                                        "flex-1 space-y-3 md:space-y-5",
                                        isUser ? "text-right" : "text-left"
                                    )}>
                                        <div className="text-[11px] font-bold text-[var(--color-outline-variant)] uppercase tracking-[0.2em] font-[family-name:var(--font-manrope)]">
                                            {isUser ? "Editorial Request" : "Walia AI System"}
                                        </div>
                                        <div className={cn(
                                            "inline-block px-6 md:px-8 py-6 rounded-[1.5rem] leading-relaxed text-[15px] font-medium tracking-tight whitespace-pre-wrap max-w-[90%]",
                                            isUser 
                                                ? "bg-[var(--color-surface-container-low)]/80 text-[var(--color-on-background)]/90 text-left" 
                                                : "bg-[var(--color-surface-container-lowest)] text-[var(--color-on-background)]/90 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
                                        )}>
                                            {m.content}
                                        </div>
                                        
                                        {!isUser && (
                                            <div className="flex gap-4 pt-2">
                                                <button 
                                                    onClick={() => router.push(`/dashboard/community?initialText=${encodeURIComponent(`Check out this AI Insight:\n\n${m.content}`)}`)}
                                                    className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[var(--color-surface-container-low)] text-xs font-bold uppercase tracking-widest text-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-high)] hover:text-white transition-all font-[family-name:var(--font-manrope)]"
                                                >
                                                    <Share2 className="w-4 h-4" /> Share Insight
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                        {loading && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-8 max-w-4xl mx-auto"
                            >
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[var(--color-surface-container)] shadow-sm">
                                    <Loader2 className="w-5 h-5 text-[var(--color-outline-variant)] animate-spin" />
                                </div>
                                <div className="flex-1">
                                    <div className="inline-flex gap-2 px-6 py-5 rounded-3xl bg-[var(--color-surface-container-lowest)] shadow-lg">
                                        <span className="w-2 h-2 bg-[var(--color-outline-variant)] rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-[var(--color-outline-variant)] rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-2 h-2 bg-[var(--color-outline-variant)] rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* INPUT AREA (Fixed Floating) */}
                <div className="absolute bottom-0 left-0 right-0 px-6 md:px-20 pb-10 pt-16 bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)] to-transparent pointer-events-none">
                    <div className="max-w-4xl mx-auto relative group pointer-events-auto">
                        <div className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] transition-all duration-500 border-2 border-transparent focus-within:border-[var(--color-surface-container-highest)]">
                            <textarea 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Message Walia AI..."
                                className="w-full bg-transparent border-none focus:ring-0 p-5 min-h-[64px] max-h-56 resize-none text-[var(--color-on-background)] font-[family-name:var(--font-manrope)] text-lg placeholder:text-[var(--color-outline-variant)]/60 leading-relaxed outline-none custom-scrollbar"
                            />
                            
                            <div className="flex items-center justify-between px-3 pb-3">
                                <div className="flex items-center gap-1.5">
                                    <button className="p-3 rounded-2xl text-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-white transition-all">
                                        <PlusCircle className="w-6 h-6" />
                                    </button>
                                    <button className="p-3 rounded-2xl text-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-white transition-all">
                                        <ImageIcon className="w-6 h-6" />
                                    </button>
                                    <button className="p-3 rounded-2xl text-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-white transition-all">
                                        <Mic className="w-6 h-6" />
                                    </button>
                                    <div className="w-px h-6 bg-[var(--color-outline-variant)]/20 mx-2"></div>
                                    <button className="p-3 rounded-2xl text-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-white transition-all">
                                        <Globe className="w-5 h-5" />
                                    </button>
                                </div>
                                <button 
                                    onClick={handleSend}
                                    disabled={!input.trim() || loading}
                                    className={cn(
                                        "flex items-center justify-center w-12 h-12 rounded-2xl transition-all shadow-lg active:scale-95",
                                        input.trim() && !loading
                                            ? "bg-[var(--color-surface-container-highest)] text-white hover:bg-black"
                                            : "bg-[var(--color-surface-container-high)] text-[var(--color-outline-variant)] opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <ArrowUp className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="text-center mt-5">
                            <span className="text-[9px] text-[var(--color-outline-variant)]/60 uppercase tracking-[0.3em] font-bold">Walia Monolith • Editorial Creative Engine • 2024</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
