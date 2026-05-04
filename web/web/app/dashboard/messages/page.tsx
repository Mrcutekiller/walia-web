'use client';

import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { 
    Search, Plus, MoreVertical, Send, Image as ImageIcon, 
    Mic, Phone, Video, Info, Check, CheckCheck, Smile, Paperclip, X, Sparkles
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { 
    collection, onSnapshot, query, where, addDoc, 
    serverTimestamp, orderBy, doc, getDoc, limit, setDoc 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

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
    isGroup?: boolean;
    groupName?: string;
    groupIcon?: string;
    otherUser?: {
        username: string;
        displayName: string;
        photoURL?: string;
    };
}

interface Note {
    id: string;
    uid: string;
    username: string;
    image: string;
    note: string;
    createdAt: any;
}

export default function MessagesPage() {
    const { user } = useAuth();
    const { isDark } = useTheme();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConv, setActiveConv] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [search, setSearch] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // AI Reply Tone State
    const [replyToneModalOpen, setReplyToneModalOpen] = useState(false);
    const [selectedMessageForReply, setSelectedMessageForReply] = useState<string | null>(null);
    const [chatType, setChatType] = useState<string>('Work');
    const [rizzTarget, setRizzTarget] = useState<string>('Girl');
    const [rizzRelation, setRizzRelation] = useState<string>('Crush');
    const [replyStyle, setReplyStyle] = useState<string>('Smooth');
    const [isGeneratingReply, setIsGeneratingReply] = useState(false);

    // Fetch notes
    useEffect(() => {
        const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
        return onSnapshot(q, snap => {
            setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Note)));
        });
    }, []);

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

    const handleCreateGroup = async () => {
        if (!user || !groupName.trim() || selectedUsers.length === 0) return;
        try {
            const groupData = {
                participants: [user.uid, ...selectedUsers],
                isGroup: true,
                groupName: groupName.trim(),
                groupIcon: groupName.charAt(0).toUpperCase(),
                lastMessage: 'Group created',
                updatedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
                adminId: user.uid
            };
            const docRef = await addDoc(collection(db, 'conversations'), groupData);
            setActiveConv(docRef.id);
            setShowGroupModal(false);
            setGroupName('');
            setSelectedUsers([]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddNote = async () => {
        if (!user) return;
        const text = window.prompt("Share a thought...");
        if (!text) return;
        try {
            await addDoc(collection(db, 'notes'), {
                uid: user.uid,
                username: user.username || 'User',
                image: (user.username || 'U').charAt(0).toUpperCase(),
                note: text.slice(0, 50), // limit note length
                createdAt: serverTimestamp()
            });
        } catch (err) {
            console.error(err);
        }
    };

    const generateAIReply = async () => {
        if (!selectedMessageForReply) return;
        setIsGeneratingReply(true);
        // Simulate AI generation based on prompt
        setTimeout(() => {
            let promptContext = `Type: ${chatType}`;
            if (chatType === 'Rizz') {
                promptContext += ` | Target: ${rizzTarget} | Relation: ${rizzRelation} | Style: ${replyStyle}`;
            }
            
            // Mock AI Response
            let generatedReply = "";
            if (chatType === 'Rizz') {
                if (replyStyle === 'Funny') generatedReply = "Haha that's actually hilarious 😂 You always know what to say.";
                else if (replyStyle === 'Smooth') generatedReply = "I was just thinking about that... great minds think alike 😉";
                else if (replyStyle === 'Flirty') generatedReply = "Stop it, you're making me blush 😳";
                else generatedReply = "I love that confidence. Tell me more.";
            } else if (chatType === 'Work') {
                generatedReply = "Noted. I'll get back to you on this shortly. Thanks!";
            } else if (chatType === 'Mentor Chat') {
                generatedReply = "Thank you for the guidance, I truly appreciate the insight!";
            } else {
                generatedReply = "That sounds awesome! Catch up soon?";
            }
            
            setInput(generatedReply);
            setReplyToneModalOpen(false);
            setIsGeneratingReply(false);
            setSelectedMessageForReply(null);
        }, 1500);
    };

    const selectedConv = conversations.find(c => c.id === activeConv);

    return (
        <div className="flex h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0A0A18] dark:via-[#0D0D1A] dark:to-[#0A0A18] overflow-hidden">
            
            {/* ── Left Panel: Conversations ── */}
            <div className="w-80 md:w-96 border-r border-gray-200/60 dark:border-white/5 flex flex-col bg-white/70 dark:bg-black/30 backdrop-blur-xl">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-black text-black dark:text-white tracking-tighter uppercase">Messages</h1>
                        <button 
                            onClick={() => setShowGroupModal(true)}
                            className="p-2 rounded-xl bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" placeholder="Search conversations..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/10 text-xs font-medium outline-none focus:border-black dark:focus:border-white transition-all duration-300 shadow-sm hover:shadow-md"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
                    {/* Notes */}
                    <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4 pt-4 px-1 mb-4 border-b border-gray-200/60 dark:border-white/5">
                        {/* Add Note */}
                        <div onClick={handleAddNote} className="flex flex-col items-center gap-1 cursor-pointer group shrink-0 relative mt-6">
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-2xl rounded-bl-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400">Share a thought...</span>
                            </div>
                            <div className="relative">
                                <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center border border-dashed border-gray-300 dark:border-white/20 group-hover:border-black dark:group-hover:border-white transition-all">
                                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1">Note</span>
                        </div>
                        {/* Real Notes */}
                        {notes.map(note => (
                            <div key={note.id} className="flex flex-col items-center gap-1 cursor-pointer group shrink-0 relative mt-6" onClick={() => setSelectedNote(note)}>
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-2xl rounded-bl-sm shadow-sm whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-bold text-black dark:text-white">{note.note}</span>
                                </div>
                                <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black uppercase bg-gradient-to-br from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black ring-1 ring-offset-1 ring-gray-200 dark:ring-white/10 dark:ring-offset-[#0A0A18]">
                                    {note.image}
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1">{note.username}</span>
                            </div>
                        ))}
                    </div>

                    {conversations.map((conv, index) => (
                        <motion.div 
                            key={conv.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setActiveConv(conv.id)}
                            className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                                activeConv === conv.id 
                                ? 'bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-200 text-white dark:text-black border-transparent shadow-xl' 
                                : 'bg-white/50 dark:bg-white/5 border-gray-200/60 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 hover:shadow-lg'
                            }`}
                        >
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs uppercase shadow-sm ${
                                    activeConv === conv.id ? 'bg-white/20' : 'bg-gradient-to-br from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black'
                                }`}>
                                    {conv.isGroup ? conv.groupIcon : conv.otherUser?.username.slice(0, 2)}
                                </div>
                                {!conv.isGroup && <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0A0A18]" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <h3 className={`text-xs font-black uppercase tracking-tight truncate ${activeConv === conv.id ? 'text-white dark:text-black' : 'text-black dark:text-white'}`}>
                                        {conv.isGroup ? conv.groupName : (conv.otherUser?.displayName || conv.otherUser?.username)}
                                    </h3>
                                    <span className={`text-[9px] font-bold uppercase ${activeConv === conv.id ? 'text-white/50' : 'text-gray-400'}`}>
                                        {conv.updatedAt?.toDate ? new Date(conv.updatedAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                </div>
                                <p className={`text-[10px] font-medium truncate ${activeConv === conv.id ? 'text-white/40' : 'text-gray-400'}`}>
                                    {conv.lastMessage}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ── Main Chat Window ── */}
            <div className="flex-1 flex flex-col relative bg-white/50 dark:bg-black/20 backdrop-blur-xl">
                {activeConv ? (
                    <>
                        {/* Header */}
                        <div className="px-8 py-4 border-b border-gray-200/60 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-[#0A0A18]/80 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black flex items-center justify-center font-black text-xs uppercase shadow-lg">
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
                                <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300 hover:shadow-md"><Phone className="w-4 h-4" /></button>
                                <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300 hover:shadow-md"><Video className="w-4 h-4" /></button>
                                <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300 hover:shadow-md"><Info className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {/* Messages Feed */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            <div className="max-w-4xl mx-auto flex flex-col gap-4">
                                {messages.map((m, i) => {
                                    const isMe = m.senderId === user?.uid;
                                    return (
                                        <motion.div 
                                            key={m.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`group relative max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-5 py-3.5 rounded-[1.75rem] text-sm font-medium leading-relaxed shadow-md ${
                                                    isMe 
                                                    ? 'bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black rounded-tr-none' 
                                                    : 'bg-white/70 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 text-black dark:text-white rounded-tl-none backdrop-blur-sm'
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
                                            {!isMe && (
                                                <button 
                                                    onClick={() => {
                                                        setSelectedMessageForReply(m.text);
                                                        setReplyToneModalOpen(true);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg ml-2 self-center mt-2"
                                                    title="Generate Reply Tone"
                                                >
                                                    <Sparkles className="w-3 h-3" />
                                                </button>
                                            )}
                                        </motion.div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-black/30 backdrop-blur-xl">
                            <div className="max-w-4xl mx-auto">
                                <form onSubmit={handleSend} className="relative flex items-center gap-3">
                                    <div className="flex gap-2">
                                        <button type="button" className="p-3 rounded-2xl bg-white dark:bg-white/5 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-gray-400 transition-all duration-300 hover:shadow-md"><Paperclip className="w-4 h-4" /></button>
                                        <button type="button" className="p-3 rounded-2xl bg-white dark:bg-white/5 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-gray-400 transition-all duration-300 hover:shadow-md"><ImageIcon className="w-4 h-4" /></button>
                                    </div>
                                    <div className="flex-1 relative">
                                        <input 
                                            type="text" value={input} onChange={e => setInput(e.target.value)}
                                            placeholder="Type a message..."
                                            className="w-full pl-6 pr-12 py-4 rounded-[1.75rem] bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/10 focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 outline-none transition-all duration-300 font-medium text-sm text-black dark:text-white shadow-sm hover:shadow-md"
                                        />
                                        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black dark:hover:text-white transition-all">
                                            <Smile className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button 
                                        type="submit" disabled={!input.trim()}
                                        className="w-14 h-14 rounded-2xl bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-black/10 disabled:opacity-30"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                    <button type="button" className="p-4 rounded-2xl bg-white dark:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300 hover:shadow-md">
                                        <Mic className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex-1 flex flex-col items-center justify-center p-6 text-center"
                    >
                        <div className="w-24 h-24 rounded-[1.75rem] bg-gradient-to-br from-black to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
                            <Send className="w-10 h-10 text-white dark:text-black" />
                        </div>
                        <h2 className="text-3xl font-black text-black dark:text-white tracking-tighter uppercase mb-2">Select a Conversation</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Send a message to start connecting with the Walia community.</p>
                        <button className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all duration-300 shadow-xl shadow-black/10 hover:-translate-y-0.5">
                            Start New Chat
                        </button>
                    </motion.div>
                )}
            </div>

            {/* AI Reply Tone Modal */}
            <AnimatePresence>
                {replyToneModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setReplyToneModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white/90 dark:bg-[#0A0A18]/90 backdrop-blur-xl rounded-[2.5rem] p-8 border border-gray-200/60 dark:border-white/10 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-indigo-500" /> AI Reply Tone
                                </h3>
                                <button onClick={() => setReplyToneModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-6 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Replying to:</p>
                                <p className="text-sm text-black dark:text-white font-medium italic">"{selectedMessageForReply}"</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 block">Step 1: Choose Chat Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Work', 'Friend Chat', 'Mentor Chat', 'Rizz'].map(type => (
                                            <button 
                                                key={type}
                                                onClick={() => setChatType(type)}
                                                className={`py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                                                    chatType === type 
                                                    ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-md' 
                                                    : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-black/30 dark:hover:border-white/30'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {chatType === 'Rizz' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-4 border-t border-gray-200/60 dark:border-white/5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 block">Target</label>
                                                <div className="flex gap-2">
                                                    {['Girl', 'Boy'].map(t => (
                                                        <button 
                                                            key={t} onClick={() => setRizzTarget(t)}
                                                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${rizzTarget === t ? 'bg-indigo-500 text-white border-transparent' : 'border-gray-200 dark:border-white/10 text-gray-500'}`}
                                                        >{t}</button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 block">Relation</label>
                                                <div className="flex gap-2">
                                                    {['Girlfriend', 'Crush', 'New girl'].map(r => (
                                                        <button 
                                                            key={r} onClick={() => setRizzRelation(r)}
                                                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${rizzRelation === r ? 'bg-indigo-500 text-white border-transparent' : 'border-gray-200 dark:border-white/10 text-gray-500'}`}
                                                        >{r}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 block">Style</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {['Smooth', 'Funny', 'Confident', 'Flirty'].map(style => (
                                                    <button 
                                                        key={style} onClick={() => setReplyStyle(style)}
                                                        className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${replyStyle === style ? 'bg-pink-500 text-white border-transparent' : 'border-gray-200 dark:border-white/10 text-gray-500'}`}
                                                    >{style}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <button 
                                    onClick={generateAIReply} disabled={isGeneratingReply}
                                    className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black font-black text-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all duration-300 shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                                >
                                    {isGeneratingReply ? 'Generating...' : <><Sparkles className="w-4 h-4" /> Generate Reply</>}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Group Modal */}
            <AnimatePresence>
                {showGroupModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-white dark:bg-[#0F0F1A] rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                                <div>
                                    <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">Create Group</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Start a new herd</p>
                                </div>
                                <button onClick={() => setShowGroupModal(false)} className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Group Name</label>
                                    <input 
                                        type="text" value={groupName} onChange={e => setGroupName(e.target.value)}
                                        placeholder="Enter group name..."
                                        className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium outline-none focus:border-black dark:focus:border-white transition-all shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Add Members</label>
                                    <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                                        {/* Mock users for now or fetch from DB */}
                                        {['Alex', 'Sarah', 'Yared', 'Beza', 'Abel'].map(u => (
                                            <div 
                                                key={u} onClick={() => setSelectedUsers(prev => prev.includes(u) ? prev.filter(x => x !== u) : [...prev, u])}
                                                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${selectedUsers.includes(u) ? 'bg-black dark:bg-white border-transparent' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20'}`}
                                            >
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs uppercase ${selectedUsers.includes(u) ? (isDark ? 'bg-black text-white' : 'bg-white text-black') : 'bg-gray-200 dark:bg-white/10 text-gray-500'}`}>
                                                    {u.slice(0, 2)}
                                                </div>
                                                <span className={`text-xs font-bold uppercase tracking-tight ${selectedUsers.includes(u) ? (isDark ? 'text-black' : 'text-white') : 'text-gray-600 dark:text-white/60'}`}>{u}</span>
                                                {selectedUsers.includes(u) && <Check className={`w-4 h-4 ml-auto ${isDark ? 'text-black' : 'text-white'}`} />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button 
                                    onClick={handleCreateGroup}
                                    disabled={!groupName.trim() || selectedUsers.length === 0}
                                    className="w-full py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-30 disabled:pointer-events-none mt-4"
                                >
                                    Launch Group
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Note Viewer Modal */}
            <AnimatePresence>
                {selectedNote && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={() => setSelectedNote(null)}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-sm bg-white dark:bg-[#0F0F1A] rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8 text-center space-y-6">
                                <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-black uppercase bg-gradient-to-br from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black shadow-xl ring-4 ring-white/10">
                                    {selectedNote?.image}
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-black dark:text-white uppercase tracking-widest">{selectedNote?.username}</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Shared a thought</p>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-inner">
                                    <p className="text-base font-medium text-black dark:text-white leading-relaxed italic">
                                        "{selectedNote?.note}"
                                    </p>
                                </div>
                                <button onClick={() => setSelectedNote(null)} className="w-full py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest shadow-lg hover:opacity-90 transition-all">
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
