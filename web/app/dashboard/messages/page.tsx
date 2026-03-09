'use client';

import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { getOrCreateChat, searchUsers } from '@/lib/user';
import { cn, formatTimeAgo } from '@/lib/utils';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    Briefcase,
    Image as ImageIcon,
    Info,
    Loader2,
    MapPin,
    MessageSquare,
    Plus,
    Search,
    Send,
    User,
    X
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function MessagesPage() {
    const { user } = useAuth();

    // --- Messages State ---
    const [chats, setChats] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showSearch, setShowSearch] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const [showProfile, setShowProfile] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Effects for Messages ---
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', user.uid),
            orderBy('lastMessageAt', 'desc')
        );
        const unsub = onSnapshot(q, (snap) => {
            const chatList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setChats(chatList);
        });
        return () => unsub();
    }, [user]);

    useEffect(() => {
        if (!activeChat) return;
        const q = query(
            collection(db, 'chats', activeChat, 'messages'),
            orderBy('createdAt', 'asc')
        );
        const unsub = onSnapshot(q, (snap) => {
            const msgList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setMessages(msgList);
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });
        return () => unsub();
    }, [activeChat]);

    useEffect(() => {
        const fetchParticipant = async () => {
            if (!activeChat || !user) return;
            const chat = chats.find(c => c.id === activeChat);
            if (chat && chat.type === 'dm') {
                const otherId = chat.participants.find((p: string) => p !== user.uid);
                if (otherId) {
                    const docSnap = await getDoc(doc(db, 'users', otherId));
                    if (docSnap.exists()) setSelectedParticipant({ id: otherId, ...docSnap.data() });
                }
            } else {
                setSelectedParticipant(null);
            }
        };
        fetchParticipant();
    }, [activeChat, chats, user]);

    // --- Messages Handlers ---
    const handleSearch = async (val: string) => {
        setSearchQuery(val);
        if (val.length > 2) {
            const results = await searchUsers(val);
            setSearchResults(results.filter(r => r.id !== user?.uid));
        } else {
            setSearchResults([]);
        }
    };

    const startChat = async (targetUser: any) => {
        if (!user) return;
        const chatId = await getOrCreateChat(user.uid, targetUser.id);
        setActiveChat(chatId);
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user || !activeChat) return;
        setUploading(true);
        try {
            const storageRef = ref(storage, `chats/${activeChat}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            const chatRef = doc(db, 'chats', activeChat);
            await addDoc(collection(chatRef, 'messages'), {
                image: url, senderId: user.uid, senderName: user.displayName || user.email?.split('@')[0], createdAt: serverTimestamp()
            });
            await updateDoc(chatRef, { lastMessage: '📷 Image', lastMessageAt: serverTimestamp() });
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const sendMessage = async () => {
        if (!messageInput.trim() || !activeChat || !user) return;
        const text = messageInput.trim();
        setMessageInput('');
        try {
            const chatRef = doc(db, 'chats', activeChat);
            await addDoc(collection(chatRef, 'messages'), {
                text, senderId: user.uid, senderName: user.displayName || user.email?.split('@')[0], createdAt: serverTimestamp()
            });
            await updateDoc(chatRef, { lastMessage: text, lastMessageAt: serverTimestamp() });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="h-full flex bg-white dark:bg-[#0A0A18] text-black dark:text-white animate-in fade-in transition-colors">
            {/* Sidebar: Chat List */}
            <aside className={cn(
                "w-full md:w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all bg-gray-50 dark:bg-[#0A0A18]",
                activeChat ? "hidden md:flex" : "flex"
            )}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0A18]">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-black tracking-tight text-black dark:text-white">Messages</h1>
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-gray-200 transition-colors shadow-sm"
                        >
                            {showSearch ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {showSearch && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="relative group max-w-full">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 focus-within:text-black dark:focus-within:text-white transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search friends..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 focus:border-black dark:focus:border-white rounded-full pl-11 pr-4 py-3 text-sm outline-none text-black dark:text-white transition-all font-medium shadow-sm focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                    />
                                </div>
                                <div className="mt-3 space-y-2">
                                    {searchResults.map(u => (
                                        <div key={u.id} onClick={() => startChat(u)} className="p-3 rounded-2xl cursor-pointer flex items-center bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800 hover:border-black dark:hover:border-white hover:shadow-md transition-all group">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800 relative mr-3 shrink-0">
                                                {u.photoURL ? <Image src={u.photoURL} alt="" fill className="object-cover" /> : <User className="w-5 h-5 text-gray-400 dark:text-gray-600 absolute top-2.5 left-2.5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-black dark:text-white truncate">{u.displayName || u.name}</p>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest truncate">@{u.username || 'student'}</p>
                                            </div>
                                            <MessageSquare className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white transition-colors shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {chats.length === 0 && !showSearch ? (
                        <div className="text-center py-10 opacity-50 flex flex-col items-center">
                            <MessageSquare className="w-8 h-8 text-black dark:text-white mb-3" />
                            <p className="text-sm font-bold text-black dark:text-white">No messages</p>
                            <p className="text-xs text-black dark:text-white">Start a conversation using the + button.</p>
                        </div>
                    ) : (
                        chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setActiveChat(chat.id)}
                                className={cn(
                                    "p-4 rounded-2xl cursor-pointer flex items-center transition-all group border",
                                    activeChat === chat.id
                                        ? "bg-white dark:bg-white/10 border-black dark:border-white shadow-md"
                                        : "bg-transparent border-transparent hover:bg-white dark:hover:bg-white/5 hover:border-gray-200 dark:hover:border-gray-800 hover:shadow-sm"
                                )}
                            >
                                <div className="w-12 h-12 rounded-full overflow-hidden relative bg-gray-100 dark:bg-zinc-800 mr-4 shrink-0 shadow-inner">
                                    {chat.photoURL ? <Image src={chat.photoURL} alt="" fill className="object-cover" /> : <User className="w-6 h-6 text-gray-400 dark:text-gray-600 absolute top-3 left-3" />}
                                </div>
                                <div className="flex-1 min-w-0 overflow-hidden">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="text-sm font-bold text-black dark:text-white truncate pr-2">{chat.type === 'dm' ? (chat.otherName || 'Direct Message') : chat.name}</h4>
                                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">{formatTimeAgo(chat.lastMessageAt)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium">{chat.lastMessage || 'Start a conversation...'}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className={cn(
                "flex-1 flex flex-col relative min-w-0",
                !activeChat && "hidden md:flex justify-center items-center bg-white dark:bg-[#111122]"
            )}>
                {!activeChat ? (
                    <div className="text-center max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="w-24 h-24 rounded-full bg-gray-50 dark:bg-white/5 border whitespace-pre border-gray-100 dark:border-gray-800 flex items-center justify-center mx-auto relative group transition-colors">
                            <MessageSquare className="w-10 h-10 text-black dark:text-white group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-black dark:text-white tracking-tight">Your Messages</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium px-8">
                                Select a conversation or start a new one to connect with peers.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <header className="h-20 px-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#0A0A18] z-10 shrink-0 shadow-sm transition-colors">
                            <div className="flex items-center cursor-pointer group" onClick={() => setShowProfile(true)}>
                                <button onClick={(e) => { e.stopPropagation(); setActiveChat(null); }} className="md:hidden p-2 mr-2 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-colors">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-gray-800 flex items-center justify-center font-bold text-black dark:text-white mr-4 overflow-hidden relative group-hover:scale-105 transition-transform shadow-inner">
                                    {selectedParticipant?.photoURL ? (
                                        <Image src={selectedParticipant.photoURL} alt="Profile" fill className="object-cover" />
                                    ) : (
                                        <User className="w-6 h-6 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-black dark:text-white group-hover:underline">
                                        {selectedParticipant?.name || (chats.find(c => c.id === activeChat)?.type === 'dm' ? 'Direct Message' : chats.find(c => c.id === activeChat)?.name)}
                                    </h3>
                                    <p className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-widest mt-0.5">Active Now</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1">
                                <button className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white" onClick={() => setShowProfile(true)}>
                                    <Info className="w-5 h-5" />
                                </button>
                            </div>
                        </header>

                        {/* Message Thread */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col space-y-6 bg-white dark:bg-[#111122] custom-scrollbar transition-colors">
                            {messages.map((msg, i) => {
                                const isMe = msg.senderId === user?.uid;
                                return (
                                    <div key={msg.id || i} className={cn("flex w-full animate-in slide-in-from-bottom-2", isMe ? "justify-end" : "justify-start")}>
                                        <div className={cn(
                                            "rounded-3xl text-sm max-w-[75%] leading-relaxed shadow-sm overflow-hidden border",
                                            isMe ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white rounded-tr-sm" : "bg-white dark:bg-white/5 border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-tl-sm shadow-sm",
                                            msg.image ? "p-2" : "px-6 py-4"
                                        )}>
                                            {msg.image ? (
                                                <div className="relative w-64 h-64 rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 border border-black/10 dark:border-white/10">
                                                    <Image src={msg.image} alt="Sent" fill className="object-cover" unoptimized />
                                                </div>
                                            ) : (
                                                <div className="whitespace-pre-wrap">{msg.text}</div>
                                            )}
                                            <div className={cn("text-[9px] mt-2 font-bold uppercase tracking-widest opacity-50", isMe ? "text-right" : "text-left")}>
                                                {formatTimeAgo(msg.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>

                        {/* Action Bar */}
                        <div className="p-6 bg-gradient-to-t from-white dark:from-[#111122] via-white dark:via-[#111122] to-transparent">
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-white dark:bg-[#111122] border-2 border-black dark:border-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-end p-2 transition-all focus-within:ring-4 focus-within:ring-black/5 dark:focus-within:ring-white/5">
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="p-4 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors shrink-0 disabled:opacity-50">
                                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                                    </button>

                                    <textarea
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                sendMessage();
                                            }
                                        }}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-transparent py-4 px-2 text-black dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none resize-none max-h-32 min-h-[56px] custom-scrollbar"
                                        rows={1}
                                    />

                                    <button onClick={sendMessage} disabled={!messageInput.trim()} className="m-1 p-3.5 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-gray-200 transition-all flex items-center justify-center shrink-0 disabled:opacity-20 disabled:hover:bg-black">
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Profile Modal Overlay */}
                        <AnimatePresence>
                            {showProfile && selectedParticipant && (
                                <div className="absolute inset-0 z-50 flex items-end justify-center">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProfile(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                                    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="w-full bg-white dark:bg-[#0A0A18] rounded-t-[40px] overflow-hidden relative z-10 shadow-2xl p-8 pb-12 max-w-lg mx-auto md:mb-8 md:rounded-[40px] md:top-1/2 md:-translate-y-1/2 md:absolute md:inset-x-auto border border-gray-100 dark:border-gray-800">
                                        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-8 md:hidden" />
                                        <div className="flex flex-col items-center">
                                            <div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-zinc-800 border-4 border-white dark:border-gray-900 overflow-hidden relative mb-6 shadow-xl">
                                                {selectedParticipant.photoURL ? <Image src={selectedParticipant.photoURL} alt={selectedParticipant.name} fill className="object-cover" /> : <User className="w-12 h-12 text-gray-300 dark:text-gray-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                                            </div>
                                            <h2 className="text-2xl font-black text-black dark:text-white tracking-tight mb-1">{selectedParticipant.name}</h2>
                                            <p className="text-gray-500 dark:text-gray-400 font-bold text-sm mb-8">@{selectedParticipant.username || 'student'}</p>

                                            <div className="grid grid-cols-2 gap-4 w-full mb-8">
                                                <div className="p-4 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 flex flex-col items-center">
                                                    <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-600 mb-2" />
                                                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Location</span>
                                                    <span className="text-sm font-bold text-black dark:text-white mt-1">{selectedParticipant.location || 'Ethiopia'}</span>
                                                </div>
                                                <div className="p-4 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 flex flex-col items-center">
                                                    <Briefcase className="w-5 h-5 text-gray-400 dark:text-gray-600 mb-2" />
                                                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Level</span>
                                                    <span className="text-sm font-bold text-black dark:text-white mt-1">{selectedParticipant.schoolLevel || 'Student'}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => setShowProfile(false)} className="w-full py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-gray-200 transition-all shadow-lg hover:shadow-black/20">
                                                Close Profile
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </main>
        </div>
    );
}
