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
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenRouter', category: 'general' },
    { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B Instruct', provider: 'OpenRouter', category: 'general' },
    { id: 'google/gemma-7b-it:free', name: 'Gemma 7B IT', provider: 'OpenRouter', category: 'coding' },
    { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Llama 3.2 3B Instruct', provider: 'OpenRouter', category: 'general' },
    { id: 'microsoft/wizardlm-2-8x22b:free', name: 'WizardLM 2 8x22B', provider: 'OpenRouter', category: 'general' },
    { id: 'anthropic/claude-3-haiku:free', name: 'Claude 3 Haiku', provider: 'OpenRouter', category: 'coding' },
    { id: 'nvidia/llama-3.1-nemotron-70b-instruct:free', name: 'Llama 3.1 Nemotron 70B', provider: 'OpenRouter', category: 'coding' },
    { id: 'qwen/qwen-2.5-7b-instruct:free', name: 'Qwen 2.5 7B Instruct', provider: 'OpenRouter', category: 'general' },
    { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B Instruct', provider: 'OpenRouter', category: 'coding' },
    { id: 'google/gemma-2-9b-it:free', name: 'Gemma 2 9B IT', provider: 'OpenRouter', category: 'general' },
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
    const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
    const [showModelSelector, setShowModelSelector] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [modelFilter, setModelFilter] = useState<'all' | 'coding' | 'general'>('all');
    const [showFilterSelector, setShowFilterSelector] = useState(false);
    const [showReplyTone, setShowReplyTone] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [replyToneData, setReplyToneData] = useState({
        message: '', type: 'Work', rizzTarget: 'Girl', rizzStyle: 'Smooth'
    });

    const filteredModels = AVAILABLE_MODELS.filter(m => modelFilter === 'all' || m.category === modelFilter).sort((a, b) => {
        if (modelFilter === 'coding') {
            // Prioritize certain models for coding
            const priority = ['anthropic/claude-3-haiku:free', 'nvidia/llama-3.1-nemotron-70b-instruct:free', 'meta-llama/llama-3.1-8b-instruct:free', 'google/gemma-7b-it:free'];
            const aIndex = priority.indexOf(a.id);
            const bIndex = priority.indexOf(b.id);
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            return 0;
        }
        return 0;
    });
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

    const handleReplyToneSubmit = () => {
        if (!replyToneData.message.trim()) return;
        let prompt = `I received this message: "${replyToneData.message}".\nPlease generate a reply. `;
        if (replyToneData.type === 'Rizz') {
            prompt += `Tone: Rizz (Flirting). Target: ${replyToneData.rizzTarget}. Style: ${replyToneData.rizzStyle}.`;
        } else {
            prompt += `Tone: ${replyToneData.type}.`;
        }
        setInput(prompt);
        setShowReplyTone(false);
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

            const aiMessage = {
                role: 'assistant',
                content: data.reply,
                createdAt: serverTimestamp()
            };
            await addDoc(collection(db, 'chats', chatId, 'messages'), aiMessage);

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
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0A0A18] dark:via-[#0D0D1A] dark:to-[#0A0A18] overflow-hidden">
            {/* ── Top Header ── */}
            <div className="px-8 py-4 border-b border-gray-200/60 dark:border-white/5 bg-white/70 dark:bg-black/30 backdrop-blur-xl flex items-center justify-between z-30">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black dark:bg-white flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white dark:text-black" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">Walia AI</h1>
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Advanced Intelligence</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={startNewChat}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                    >
                        <Plus className="w-3.5 h-3.5" /> New Chat
                    </button>
                    <button 
                        onClick={() => setShowHistory(true)}
                        className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-black dark:hover:border-white text-black dark:text-white transition-all"
                    >
                        <History className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* ── Slide-over: Chat History ── */}
                <AnimatePresence>
                    {showHistory && (
                        <>
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
                                onClick={() => setShowHistory(false)}
                            />
                            <motion.div 
                                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-[#0A0A18] border-r border-gray-200/60 dark:border-white/10 z-50 flex flex-col shadow-2xl"
                            >
                                <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-black dark:text-white">Chat History</h3>
                                    <button onClick={() => setShowHistory(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400"><X className="w-5 h-5" /></button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                                    {chats.length === 0 ? (
                                        <div className="text-center py-20 opacity-30">
                                            <History className="w-12 h-12 mx-auto mb-3" />
                                            <p className="text-xs font-bold uppercase">No history found</p>
                                        </div>
                                    ) : chats.map((chat, index) => (
                                        <div 
                                            key={chat.id}
                                            onClick={() => { setActiveChat(chat.id); setShowHistory(false); }}
                                            className={`group flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                                                activeChat === chat.id 
                                                ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-xl' 
                                                : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-black dark:hover:border-white hover:shadow-lg'
                                            }`}
                                        >
                                            <MessageSquare className={`w-4 h-4 shrink-0 ${activeChat === chat.id ? 'text-white dark:text-black' : 'text-gray-400 dark:text-gray-500'}`} />
                                            <span className="flex-1 text-[11px] font-bold truncate uppercase tracking-tight">{chat.title}</span>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); deleteChat(chat.id, e); }}
                                                className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all ${
                                                    activeChat === chat.id ? 'hover:bg-white/20 text-white dark:text-black' : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400'
                                                }`}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* ── Main Chat Content ── */}
                <div className="flex-1 flex flex-col relative h-full">
                {!activeChat && messages.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto custom-scrollbar"
                    >
                        <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-black to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center mb-8 shadow-2xl shadow-black/20 hover:scale-105 transition-transform duration-500 shrink-0">
                            <Sparkles className="w-16 h-16 text-white dark:text-black" />
                        </div>
                        <h2 className="text-5xl font-black text-black dark:text-white tracking-tighter mb-6 uppercase">How can I help you, {user?.username?.split(' ')[0]}?</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md text-base font-medium leading-relaxed">
                            I'm personalized based on your profile. Ask me about trading, school, or anything else you're interested in.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-16 w-full max-w-2xl">
                            {[
                                { title: 'XAUUSD Analysis', desc: 'Get latest market insights', icon: Zap },
                                { title: 'Study Aid', desc: 'Summarize your complex notes', icon: BookOpen },
                                { title: 'Business Ideas', desc: 'Brainstorm your next venture', icon: Rocket },
                                { title: 'Code Assistant', desc: 'Debug or write clean code', icon: Code2 },
                            ].map((s, i) => (
                                <motion.button 
                                    key={i} 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setInput(s.title)} 
                                    className="p-8 rounded-[2rem] border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 text-left hover:border-black dark:hover:border-white transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl backdrop-blur-sm"
                                >
                                    <s.icon className="w-7 h-7 mb-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                                    <h3 className="text-base font-black text-black dark:text-white uppercase tracking-tight">{s.title}</h3>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">{s.desc}</p>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        <div className="max-w-4xl mx-auto space-y-8">
                            {messages.map((m, i) => (
                                <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ring-2 ring-indigo-200 ${
                                        m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200'
                                    }`}>
                                        {m.role === 'user' ? (
                                            <Image src={user?.photoURL || '/avatars/avatar1.jpg'} alt={user?.username || 'User'} width={24} height={24} className="rounded-full" />
                                        ) : (
                                            <Bot className="w-5 h-5 text-indigo-600" />
                                        )}
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
                <div className="p-8 pb-12 border-t border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-black/30 backdrop-blur-xl shrink-0 z-10">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
                        {/* Model Selector */}
                        <div className="flex items-center gap-3 mb-5">
                            {/* Filter Selector */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowFilterSelector(!showFilterSelector)}
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/10 hover:border-black dark:hover:border-white transition-all duration-300 text-sm font-medium text-black dark:text-white hover:shadow-lg"
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest">
                                        {modelFilter === 'all' ? 'All Models' : modelFilter === 'coding' ? 'Coding' : 'General'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilterSelector ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {showFilterSelector && (
                                    <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-[#0A0A18] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl z-50">
                                        {[
                                            { value: 'all', label: 'All Models' },
                                            { value: 'coding', label: 'Coding' },
                                            { value: 'general', label: 'General' }
                                        ].map(filter => (
                                            <button
                                                key={filter.value}
                                                type="button"
                                                onClick={() => {
                                                    setModelFilter(filter.value as 'all' | 'coding' | 'general');
                                                    setShowFilterSelector(false);
                                                    // If current selected model is not in the new filter, select the first available
                                                    const newFiltered = AVAILABLE_MODELS.filter(m => filter.value === 'all' || m.category === filter.value);
                                                    if (!newFiltered.find(m => m.id === selectedModel)) {
                                                        setSelectedModel(newFiltered[0]?.id || 'gpt-4o-mini');
                                                    }
                                                }}
                                                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                                                    modelFilter === filter.value ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-black dark:text-white'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-bold">{filter.label}</div>
                                                    {modelFilter === filter.value && (
                                                        <CheckCircle2 className="w-4 h-4 text-white dark:text-black" />
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
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
                                        {filteredModels.map(model => (
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
                            <button
                                type="button"
                                onClick={() => setShowReplyTone(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black hover:scale-105 transition-all duration-300 text-sm font-black uppercase tracking-widest shadow-md"
                            >
                                <Sparkles className="w-4 h-4" />
                                Reply Tone
                            </button>
                            <div className="flex-1" />
                        </div>

                        <input 
                            type="text" value={input} onChange={e => setInput(e.target.value)}
                            placeholder="Message Walia AI..."
                            className="w-full pl-6 pr-16 py-5 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/10 focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 outline-none transition-all duration-300 font-medium text-base text-black dark:text-white shadow-inner hover:shadow-xl"
                        />
                        <button 
                            type="submit" disabled={!input.trim() || loading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-black/10 disabled:opacity-30 disabled:scale-100 hover:shadow-2xl"
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

                {showReplyTone && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setShowReplyTone(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-xl bg-white dark:bg-[#0A0A18] rounded-[3rem] p-10 border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-black text-black dark:text-white tracking-tighter uppercase">Reply Tone</h2>
                                <button onClick={() => setShowReplyTone(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400"><X className="w-6 h-6" /></button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 block">Step 1: Paste Message</label>
                                    <textarea 
                                        value={replyToneData.message}
                                        onChange={(e) => setReplyToneData({...replyToneData, message: e.target.value})}
                                        placeholder="Paste the message you want to reply to..."
                                        className="w-full p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 outline-none text-sm font-medium h-32 focus:border-black dark:focus:border-white transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 block">Step 2: Choose Tone</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {['Work', 'Friend Chat', 'Mentor Chat', 'Rizz'].map(t => (
                                            <button 
                                                key={t}
                                                onClick={() => setReplyToneData({...replyToneData, type: t})}
                                                className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    replyToneData.type === t 
                                                    ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-lg' 
                                                    : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 hover:border-black dark:hover:border-white'
                                                }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {replyToneData.type === 'Rizz' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 block">Target</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Girl', 'Boy'].map(t => (
                                                    <button 
                                                        key={t}
                                                        onClick={() => setReplyToneData({...replyToneData, rizzTarget: t})}
                                                        className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                                            replyToneData.rizzTarget === t 
                                                            ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-lg' 
                                                            : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 hover:border-black dark:hover:border-white'
                                                        }`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 block">Style</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {['Smooth', 'Funny', 'Confident', 'Flirty'].map(s => (
                                                    <button 
                                                        key={s}
                                                        onClick={() => setReplyToneData({...replyToneData, rizzStyle: s})}
                                                        className={`py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                                                            replyToneData.rizzStyle === s 
                                                            ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-lg' 
                                                            : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 hover:border-black dark:hover:border-white'
                                                        }`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <button 
                                    onClick={handleReplyToneSubmit}
                                    disabled={!replyToneData.message.trim()}
                                    className="w-full py-5 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10 disabled:opacity-20 mt-4"
                                >
                                    Generate Reply
                                </button>
                            </div>
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
