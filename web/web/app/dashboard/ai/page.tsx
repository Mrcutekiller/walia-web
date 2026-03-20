'use client';

import { useAuth } from '@/context/AuthContext';
import { 
    Send, Sparkles, User, Brain, Paperclip, 
    Loader2, ArrowLeft, History, MessageSquare, 
    Plus, MoreVertical, Trash2, Share2 
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
    { id: 'Study', label: 'Study Helper', icon: Brain, desc: 'Academic & tutoring mode' },
    { id: 'Work', label: 'Work Assistant', icon: Sparkles, desc: 'Professional & productive' },
    { id: 'Debate', label: 'Debate AI', icon: MessageSquare, desc: 'Critical thinking & logic' },
    { id: 'Fun', label: 'Fun Mode', icon: Sparkles, desc: 'Witty & entertaining' },
];

export default function AIChatPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hello! I'm your Walia AI companion. How can I help you with your studies today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState(MODES[0]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
        <div className="flex h-full bg-white dark:bg-[#0A101D] overflow-hidden">
            
            {/* ── LEFT SIDEBAR (History/Modes) ── */}
            <AnimatePresence initial={false}>
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="h-full border-r border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-white/5">
                            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg active:scale-95">
                                <Plus className="w-4 h-4" /> New Session
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                            {/* AI Modes */}
                            <div>
                                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-2">AI Personas</p>
                                <div className="space-y-1">
                                    {MODES.map((m) => {
                                        const Icon = m.icon;
                                        const active = mode.id === m.id;
                                        return (
                                            <button
                                                key={m.id}
                                                onClick={() => setMode(m)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
                                                    active ? "bg-white dark:bg-[#162032] shadow-sm border border-gray-100 dark:border-white/5" : "hover:bg-gray-100 dark:hover:bg-white/5"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                    active ? "bg-black dark:bg-white text-white dark:text-black" : "bg-gray-200 dark:bg-white/5 text-gray-400 group-hover:text-black dark:group-hover:text-white"
                                                )}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div className="text-left">
                                                    <p className={cn("text-xs font-black", active ? "text-black dark:text-white" : "text-gray-500")}>{m.label}</p>
                                                    <p className="text-[9px] text-gray-400 font-medium truncate w-32">{m.desc}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Mock History */}
                            <div>
                                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-2">Message History</p>
                                <div className="space-y-1">
                                    {[
                                        "Quantum Physics Quiz", 
                                        "Amharic Literature Summary", 
                                        "Algebra Help - Ch 4",
                                        "Law Exam Prep",
                                        "French Practice"
                                    ].map((h, i) => (
                                        <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <History className="w-3.5 h-3.5 text-gray-300" />
                                                <p className="text-[11px] font-bold text-gray-500 group-hover:text-black dark:group-hover:text-white truncate w-36 text-left">{h}</p>
                                            </div>
                                            <Trash2 className="w-3 h-3 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Credits / Plan */}
                        <div className="p-4 border-t border-gray-100 dark:border-white/5">
                            <div className="p-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black relative overflow-hidden group">
                                <Sparkles className="absolute -right-2 -bottom-2 w-16 h-16 opacity-10 group-hover:scale-110 transition-transform" />
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1">Daily Tokens</p>
                                <p className="text-xl font-black">{tokenDisplay}</p>
                                <p className="text-[9px] font-bold opacity-60 mt-1 uppercase">{isPro ? 'Pro Active' : 'Resets in 24h'}</p>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ── MAIN CHAT AREA ── */}
            <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0A101D]">
                
                {/* Chat Header */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-white/5 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-400 hover:text-black dark:hover:text-white transition-all"
                        >
                            <ArrowLeft className={cn("w-4 h-4 transition-transform", !isSidebarOpen && "rotate-180")} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-black text-black dark:text-white tracking-widest uppercase">Walia AI</h2>
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 uppercase tracking-widest">Active</span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{mode.label} Mode</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white transition-all">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {/* Messages Body */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar"
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
                                        "flex gap-4 max-w-4xl mx-auto",
                                        isUser ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    <div className={cn(
                                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm border",
                                        isUser 
                                            ? "bg-black dark:bg-white border-black dark:border-white" 
                                            : "bg-white dark:bg-[#162032] border-gray-100 dark:border-white/10"
                                    )}>
                                        {isUser ? (
                                            user?.photoURL ? (
                                                <img src={user.photoURL} alt="" className="w-full h-full object-cover rounded-xl" />
                                            ) : <User className="w-4 h-4 text-white dark:text-black" />
                                        ) : (
                                            <div className="w-5 h-5 flex items-center justify-center text-black dark:text-white">
                                                <Image src="/walia-logo.png" alt="" width={20} height={20} unoptimized className="object-contain" />
                                            </div>
                                        )}
                                    </div>

                                    <div className={cn(
                                        "flex-1 space-y-2",
                                        isUser ? "text-right" : "text-left"
                                    )}>
                                        <div className={cn(
                                            "inline-block px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed font-medium shadow-sm transition-colors",
                                            isUser 
                                                ? "bg-black text-white rounded-tr-none" 
                                                : "bg-[#FAFAFA] dark:bg-[#162032] border border-gray-100 dark:border-white/5 text-black dark:text-white rounded-tl-none"
                                        )}>
                                            {m.content}
                                        </div>
                                        <div className="flex items-center gap-4 px-1">
                                            <p className="text-[10px] font-bold text-gray-300 dark:text-gray-500 uppercase tracking-widest">
                                                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            {!isUser && (
                                                <button 
                                                    onClick={() => router.push(`/dashboard/community?initialText=${encodeURIComponent(`Check out this AI Insight:\n\n${m.content}`)}`)}
                                                    className="flex items-center gap-1.5 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                                                    title="Share to Community"
                                                >
                                                    <Share2 className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] uppercase font-bold tracking-widest">Share</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                        {loading && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-4 max-w-4xl mx-auto"
                            >
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-[#162032] border border-gray-100 dark:border-white/10 shadow-sm">
                                    <Loader2 className="w-4 h-4 text-black dark:text-white animate-spin" />
                                </div>
                                <div className="flex-1">
                                    <div className="inline-flex gap-1.5 px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                        <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Chat Input */}
                <div className="p-6 md:p-10 border-t border-gray-100 dark:border-white/5 shrink-0 bg-white/50 dark:bg-[#0A101D]/50 backdrop-blur-xl">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative group">
                            <textarea 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Ask Walia anything academic..."
                                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[28px] pl-6 pr-14 py-5 text-sm font-medium text-black dark:text-white outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-[#162032] transition-all resize-none shadow-inner custom-scrollbar h-[62px]"
                            />
                            
                            <div className="absolute right-3 bottom-2.5 flex items-center gap-1.5">
                                <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                                    <Paperclip className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={handleSend}
                                    disabled={!input.trim() || loading}
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95",
                                        input.trim() && !loading 
                                            ? "bg-black dark:bg-white text-white dark:text-black scale-100" 
                                            : "bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-gray-600 scale-90"
                                    )}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="text-center text-[9px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest mt-4">
                            Walia AI can make mistakes. Check important information.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
