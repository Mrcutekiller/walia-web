'use client';

import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { 
    Send, Sparkles, User, Bot, Plus, History, Trash2, 
    MoreHorizontal, Share2, Copy, CheckCircle2, MessageSquare, 
    Rocket, Star, ShieldCheck, Zap, X, Users, ChevronDown
} from 'lucide-react';
import { useEffect, useRef, useState, Suspense } from 'react';
import { 
    addDoc, collection, deleteDoc, doc, 
    onSnapshot, orderBy, query, serverTimestamp, 
    where, getDoc, limit, updateDoc
} from 'firebase/firestore';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: any;
}

interface Chat {
    id: string;
    title: string;
    updatedAt: any;
}

const AVAILABLE_MODELS = [
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
    { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
    { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', provider: 'Google' },
    { id: 'meta-llama/llama-3.1-405b-instruct', name: 'Llama 3.1 405B', provider: 'Meta' },
    { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', provider: 'Meta' },
    { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B', provider: 'Mistral' },
];

function AIChatContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet');
    const [showModelSelector, setShowModelSelector] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Check for welcome query
    useEffect(() => {
        if (searchParams.get('welcome') === 'true') {
            setShowWelcome(true);
            // Remove the query param without refreshing
            const newUrl = window.location.pathname;
            window.history.replaceState({ path: newUrl }, '', newUrl);
        }
    }, [searchParams]);

    // Fetch user chats
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'chats'),
            where('uid', '==', user.uid),
            orderBy('updatedAt', 'desc'),
            limit(20)
        );
        return onSnapshot(q, snap => {
            setChats(snap.docs.map(d => ({ id: d.id, ...d.data() } as Chat)));
        });
    }, [user]);

    // Fetch messages for active chat
    useEffect(() => {
        if (!activeChat) {
            setMessages([]);
            return;
        }
        const q = query(
            collection(db, 'chats', activeChat, 'messages'),
            orderBy('createdAt', 'asc')
        );
        return onSnapshot(q, snap => {
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
        });
    }, [activeChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startNewChat = async () => {
        if (!user) return;
        const ref = await addDoc(collection(db, 'chats'), {
            uid: user.uid,
            title: 'New Conversation',
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp()
        });
        setActiveChat(ref.id);
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || !user || loading) return;

        let chatId = activeChat;
        if (!chatId) {
            const ref = await addDoc(collection(db, 'chats'), {
                uid: user.uid,
                title: input.slice(0, 30) + '...',
                updatedAt: serverTimestamp(),
                createdAt: serverTimestamp()
            });
            chatId = ref.id;
            setActiveChat(chatId);
        }

        const userMsg = input.trim();
        setInput('');
        setLoading(true);
        setApiError(null);

        try {
            // 1. Save user message
            await addDoc(collection(db, 'chats', chatId, 'messages'), {
                role: 'user',
                content: userMsg,
                createdAt: serverTimestamp()
            });

            // 2. Get AI Response (Personalized)
            const userId = user.uid || user.id;
            const userProfile = (await getDoc(doc(db, 'users', userId))).data();
            const personalization = `You are Walia AI, a premium assistant for ${userProfile?.displayName || user?.username || 'a user'}.
            User About: ${userProfile?.about || 'Not specified'}. 
            User Interests: ${userProfile?.interests?.join(', ') || 'Not specified'}.
            Use this info to personalize your tone and advice. Be professional, high-end, and helpful.`;

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({  
                    message: userMsg, 
                    history: messages.map(m => ({ role: m.role, content: m.content })),
                    systemPrompt: personalization,
                    model: selectedModel
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || data.reply || 'Chat request failed.');
            }

            if (!data.reply) {
                throw new Error('AI service did not return a response.');
            }

            const aiReply = data.reply;
                role: 'assistant',
                content: aiReply,
                createdAt: serverTimestamp()
            });

            // 4. Update chat title if it's the first message
            if (messages.length === 0) {
                await updateDoc(doc(db, 'chats', chatId), {
                    title: userMsg.slice(0, 30) + (userMsg.length > 30 ? '...' : ''),
                    updatedAt: serverTimestamp()
                });
            } else {
                await updateDoc(doc(db, 'chats', chatId), {
                    updatedAt: serverTimestamp()
                });
            }

        } catch (err: any) {
            console.error(err);
            setApiError(err?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const deleteChat = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (id === activeChat) setActiveChat(null);
        await deleteDoc(doc(db, 'chats', id));
    };

    return (
        <div className="flex h-full bg-white dark:bg-[#0A0A18] overflow-hidden">
            {/* ── Left Panel: Chat History ── */}
            <div className="w-80 border-r border-gray-100 dark:border-white/5 flex flex-col bg-gray-50/50 dark:bg-black/20">
                <div className="p-6">
                    <button 
                        onClick={startNewChat}
                        className="w-full py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
                    >
                        <Plus className="w-4 h-4" /> New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
                    <p className="px-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Recent Conversations</p>
                    {chats.length === 0 ? (
                        <div className="text-center py-10 opacity-20">
                            <History className="w-10 h-10 mx-auto mb-2" />
                            <p className="text-xs font-bold">No history</p>
                        </div>
                    ) : chats.map(chat => (
                        <div 
                            key={chat.id}
                            onClick={() => setActiveChat(chat.id)}
                            className={`group flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border ${
                                activeChat === chat.id 
                                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-lg' 
                                : 'bg-white dark:bg-white/5 border-transparent hover:border-gray-200 dark:hover:border-white/10'
                            }`}
                        >
                            <MessageSquare className={`w-4 h-4 shrink-0 ${activeChat === chat.id ? 'text-white dark:text-black' : 'text-gray-400'}`} />
                            <span className="flex-1 text-xs font-bold truncate">{chat.title}</span>
                            <button 
                                onClick={(e) => deleteChat(chat.id, e)}
                                className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all ${
                                    activeChat === chat.id ? 'hover:bg-white/20 text-white dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400'
                                }`}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Profile Peek */}
                <div className="p-6 border-t border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-xs uppercase">
                            {user?.username?.slice(0, 2) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black truncate text-black dark:text-white uppercase tracking-tight">{user?.username || 'User'}</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{user?.isPro ? 'Pro Member' : 'Free Plan'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Chat Area ── */}
            <div className="flex-1 flex flex-col relative">
                {!activeChat && messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-24 h-24 rounded-[2rem] bg-black dark:bg-white flex items-center justify-center mb-8 shadow-2xl shadow-black/20">
                            <Sparkles className="w-12 h-12 text-white dark:text-black" />
                        </div>
                        <h2 className="text-4xl font-black text-black dark:text-white tracking-tighter mb-4 uppercase">How can I help you, {user?.username?.split(' ')[0]}?</h2>
                        <p className="text-gray-400 dark:text-gray-500 max-w-md text-sm font-medium leading-relaxed">
                            I'm personalized based on your profile. Ask me about trading, school, or anything else you're interested in.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-2xl">
                            {[
                                { title: 'XAUUSD Analysis', desc: 'Get latest market insights', icon: Zap },
                                { title: 'Study Aid', desc: 'Summarize your complex notes', icon: BookOpen },
                                { title: 'Business Ideas', desc: 'Brainstorm your next venture', icon: Rocket },
                                { title: 'Code Assistant', desc: 'Debug or write clean code', icon: Code2 },
                            ].map((s, i) => (
                                <button key={i} onClick={() => setInput(s.title)} className="p-6 rounded-3xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 text-left hover:border-black dark:hover:border-white transition-all group">
                                    <s.icon className="w-6 h-6 mb-3 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                                    <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-tight">{s.title}</h3>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{s.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        <div className="max-w-4xl mx-auto space-y-8">
                            {messages.map((m, i) => (
                                <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                                        m.role === 'user' ? 'bg-black text-white' : 'bg-gray-100 dark:bg-white/10 text-black dark:text-white'
                                    }`}>
                                        {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={`flex flex-col gap-2 max-w-[80%] ${m.role === 'user' ? 'items-end' : ''}`}>
                                        <div className={`p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
                                            m.role === 'user' 
                                            ? 'bg-black text-white rounded-tr-none' 
                                            : 'bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-black dark:text-white rounded-tl-none'
                                        }`}>
                                            {m.content}
                                        </div>
                                        <div className="flex items-center gap-3 px-2">
                                            <span className="text-[10px] text-gray-300 font-bold uppercase">{m.role === 'user' ? 'You' : 'Walia AI'}</span>
                                            {m.role === 'assistant' && (
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1 hover:text-black dark:hover:text-white text-gray-300 transition-colors"><Copy className="w-3 h-3" /></button>
                                                    <button className="p-1 hover:text-black dark:hover:text-white text-gray-300 transition-colors"><Share2 className="w-3 h-3" /></button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-black dark:text-white" />
                                    </div>
                                    <div className="p-5 rounded-[2rem] rounded-tl-none bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                )}

                {/* ── Input Area ── */}
                <div className="p-6 border-t border-gray-100 dark:border-white/5">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
                        {/* Model Selector */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowModelSelector(!showModelSelector)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-black dark:hover:border-white transition-all text-sm font-medium text-black dark:text-white"
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest">
                                        {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || 'Select Model'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showModelSelector ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {showModelSelector && (
                                    <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-[#0A0A18] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl z-50">
                                        {AVAILABLE_MODELS.map(model => (
                                            <button
                                                key={model.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedModel(model.id);
                                                    setShowModelSelector(false);
                                                }}
                                                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                                                    selectedModel === model.id ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-black dark:text-white'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-sm font-bold">{model.name}</div>
                                                        <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">{model.provider}</div>
                                                    </div>
                                                    {selectedModel === model.id && (
                                                        <CheckCircle2 className="w-4 h-4 text-white dark:text-black" />
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1" />
                        </div>

                        <input 
                            type="text" value={input} onChange={e => setInput(e.target.value)}
                            placeholder="Message Walia AI..."
                            className="w-full pl-6 pr-16 py-5 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-sm text-black dark:text-white shadow-inner"
                        />
                        <button 
                            type="submit" disabled={!input.trim() || loading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 disabled:opacity-30 disabled:scale-100"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    {apiError && (
                        <p className="text-center text-sm text-rose-500 font-bold mt-3">{apiError}</p>
                    )}
                    <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">Walia can make mistakes. Verify important info.</p>
                </div>
            </div>

            {/* ── Welcome Modal ── */}
            <AnimatePresence>
                {showWelcome && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setShowWelcome(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-[#0A0A18] rounded-[3rem] p-10 border border-gray-100 dark:border-white/10 shadow-2xl text-center overflow-hidden"
                        >
                            {/* Decorative Background */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-black dark:bg-white overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-white/20 dark:bg-black/20 rounded-full blur-3xl" />
                            </div>

                            <div className="relative mt-12 mb-8">
                                <div className="w-24 h-24 rounded-[2rem] bg-white dark:bg-black border-4 border-black dark:border-white flex items-center justify-center mx-auto shadow-2xl animate-float">
                                    <Image src="/logo.png" alt="Walia" width={64} height={64} unoptimized />
                                </div>
                            </div>

                            <h2 className="text-4xl font-black text-black dark:text-white tracking-tighter uppercase mb-4">Welcome to Walia</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 leading-relaxed">
                                Your account is ready. Explore your personalized dashboard with AI chat, real-time messaging, community posts, and more.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 text-left border border-gray-100 dark:border-white/5">
                                    <MessageSquare className="w-5 h-5 text-black dark:text-white mb-2" />
                                    <h4 className="text-[10px] font-black uppercase text-black dark:text-white mb-1">AI Chat</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Smart companion</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 text-left border border-gray-100 dark:border-white/5">
                                    <Users className="w-5 h-5 text-black dark:text-white mb-2" />
                                    <h4 className="text-[10px] font-black uppercase text-black dark:text-white mb-1">Community</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Connect & learn</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowWelcome(false)}
                                className="w-full py-5 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10"
                            >
                                Start Using Walia
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Reusable icons
function BookOpen(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>; }
function Code2(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>; }

export default function AIChatPage() {
    return (
        <Suspense fallback={<div className="h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-black dark:border-t-white rounded-full animate-spin" /></div>}>
            <AIChatContent />
        </Suspense>
    );
}
