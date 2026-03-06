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
    MoreVertical,
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

    // 1. Fetch user's chats
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

    // 2. Fetch messages for active chat
    useEffect(() => {
        if (!activeChat) return;
        const q = query(
            collection(db, 'chats', activeChat, 'messages'),
            orderBy('createdAt', 'asc')
        );

        const unsub = onSnapshot(q, (snap) => {
            const msgList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setMessages(msgList);
            scrollToBottom();
        });

        return () => unsub();
    }, [activeChat]);

    // 3. Fetch participant info when activeChat changes
    useEffect(() => {
        const fetchParticipant = async () => {
            if (!activeChat || !user) return;
            const chat = chats.find(c => c.id === activeChat);
            if (chat) {
                // In DM, find the other participant
                if (chat.type === 'dm') {
                    const otherId = chat.participants.find((p: string) => p !== user.uid);
                    if (otherId) {
                        const docSnap = await getDoc(doc(db, 'users', otherId));
                        if (docSnap.exists()) {
                            setSelectedParticipant({ id: otherId, ...docSnap.data() });
                        }
                    }
                } else {
                    // For group chats, we might want to show group info or members
                    setSelectedParticipant(null);
                }
            }
        };
        fetchParticipant();
    }, [activeChat, chats, user]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

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
                image: url,
                senderId: user.uid,
                senderName: user.displayName || user.email?.split('@')[0],
                createdAt: serverTimestamp()
            });

            await updateDoc(chatRef, {
                lastMessage: '📷 Image',
                lastMessageAt: serverTimestamp()
            });
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
                text,
                senderId: user.uid,
                senderName: user.displayName || user.email?.split('@')[0],
                createdAt: serverTimestamp()
            });

            await updateDoc(chatRef, {
                lastMessage: text,
                lastMessageAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const activeChatData = chats.find(c => c.id === activeChat);

    return (
        <div className="h-[calc(100vh-140px)] overflow-hidden flex bg-white/5 border border-white/10 rounded-[40px] animate-fade-in-up relative">

            {/* Sidebar: Chats List */}
            <aside className={cn(
                "w-full md:w-96 border-r border-white/5 flex flex-col transition-all",
                activeChat ? "hidden md:flex" : "flex"
            )}>
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-white px-2">Messages</h2>
                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        className="p-3 rounded-2xl bg-walia-primary/10 text-walia-primary hover:bg-walia-primary hover:text-white transition-all"
                    >
                        {showSearch ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                </div>

                <div className="p-6">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-walia-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Find students..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => setShowSearch(true)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-walia-primary/50 outline-none transition-all text-white"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
                    {showSearch ? (
                        <div className="space-y-2">
                            <p className="px-4 text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Search Results</p>
                            {searchResults.map(u => (
                                <div
                                    key={u.id}
                                    onClick={() => startChat(u)}
                                    className="p-4 rounded-3xl cursor-pointer flex items-center bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mr-4 border border-indigo-500/10 overflow-hidden relative">
                                        {u.photoURL ? (
                                            <Image src={u.photoURL} alt={u.name} fill className="object-cover" />
                                        ) : (
                                            <User className="w-6 h-6 text-indigo-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="text-sm font-bold text-white truncate">{u.displayName || u.name || 'User'}</h4>
                                        <p className="text-[10px] text-white/30 truncate">@{u.username || 'student'}</p>
                                    </div>
                                </div>
                            ))}
                            {searchQuery.length > 2 && searchResults.length === 0 && (
                                <p className="text-center py-10 text-white/20 text-xs italic">No students found matching "{searchQuery}"</p>
                            )}
                        </div>
                    ) : (
                        chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setActiveChat(chat.id)}
                                className={cn(
                                    "p-4 rounded-3xl cursor-pointer flex items-center transition-all group",
                                    activeChat === chat.id ? "bg-white/10 border border-white/10" : "hover:bg-white/5 border border-transparent"
                                )}
                            >
                                <div className="w-14 h-14 rounded-2xl bg-walia-primary/20 flex items-center justify-center font-bold text-walia-primary text-xl border border-walia-primary/20 group-hover:scale-105 transition-transform overflow-hidden relative">
                                    {chat.photoURL ? (
                                        <Image src={chat.photoURL} alt="Chat" fill className="object-cover" />
                                    ) : (
                                        chat.type === 'dm' ? <User className="w-6 h-6" /> : chat.name?.charAt(0)
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden ml-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-bold text-white truncate pr-2">
                                            {chat.type === 'dm' ? (chat.otherName || 'Direct Message') : chat.name}
                                        </h4>
                                        <span className="text-[10px] text-white/30 font-medium whitespace-nowrap">
                                            {formatTimeAgo(chat.lastMessageAt)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/40 truncate">{chat.lastMessage || 'Start a conversation...'}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            {/* Chat Workspace */}
            <main className={cn(
                "flex-1 flex flex-col relative bg-black/20",
                !activeChat ? "hidden md:flex items-center justify-center" : "flex"
            )}>
                {!activeChat ? (
                    <div className="text-center space-y-4 max-w-sm">
                        <div className="w-20 h-20 rounded-[32px] bg-white/5 flex items-center justify-center mx-auto mb-6">
                            <Send className="w-10 h-10 text-white/10" />
                        </div>
                        <h3 className="text-xl font-black text-white">Select a chat</h3>
                        <p className="text-sm text-white/30 leading-relaxed font-medium">Choose a connection to start messaging or search for new students to collaborate with.</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <header className="h-24 px-8 border-b border-white/5 flex items-center justify-between shrink-0">
                            <div className="flex items-center cursor-pointer group" onClick={() => setShowProfile(true)}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveChat(null); }}
                                    className="md:hidden p-2 mr-2 text-white/40 hover:text-white"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="w-12 h-12 rounded-2xl bg-walia-primary/20 flex items-center justify-center font-bold text-walia-primary border border-walia-primary/30 mr-4 overflow-hidden relative group-hover:scale-105 transition-transform">
                                    {selectedParticipant?.photoURL ? (
                                        <Image src={selectedParticipant.photoURL} alt="Profile" fill className="object-cover" />
                                    ) : (
                                        <User className="w-5 h-5" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white group-hover:text-walia-primary transition-colors">
                                        {selectedParticipant?.name || (activeChatData?.type === 'dm' ? 'Direct Message' : activeChatData?.name)}
                                    </h3>
                                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-1">Active Now</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button className="p-3 rounded-xl hover:bg-white/5 transition-all text-white/20 hover:text-white" onClick={() => setShowProfile(true)}>
                                    <Info className="w-5 h-5" />
                                </button>
                                <button className="p-3 rounded-xl hover:bg-white/5 transition-all text-white/20 hover:text-white">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </header>

                        {/* Message Thread */}
                        <div className="flex-1 overflow-y-auto p-10 flex flex-col space-y-6 custom-scrollbar">
                            {messages.map((msg, i) => {
                                const isMe = msg.senderId === user?.uid;
                                return (
                                    <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                        <div className={cn(
                                            "rounded-[28px] text-sm max-w-[75%] leading-relaxed shadow-xl overflow-hidden",
                                            isMe
                                                ? "bg-indigo-600 text-white rounded-tr-none"
                                                : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none",
                                            msg.image ? "p-2" : "p-5"
                                        )}>
                                            {msg.image ? (
                                                <div className="relative w-64 h-64 rounded-2xl overflow-hidden bg-black/50">
                                                    <Image src={msg.image} alt="Sent" fill className="object-cover" unoptimized />
                                                </div>
                                            ) : (
                                                msg.text
                                            )}
                                            <div className={cn(
                                                "text-[9px] mt-2 font-bold uppercase tracking-tighter opacity-40 px-3",
                                                isMe ? "text-right" : "text-left"
                                            )}>
                                                {formatTimeAgo(msg.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Action Bar */}
                        <div className="p-8 shrink-0">
                            <div className="flex items-center space-x-4 bg-white/5 border border-white/10 rounded-[32px] p-2 focus-within:border-indigo-500/50 transition-all">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="p-4 rounded-2xl text-white/20 hover:text-white transition-all disabled:opacity-50"
                                >
                                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                                </button>

                                <input
                                    type="text"
                                    placeholder={`Message ${selectedParticipant?.name?.split(' ')[0] || 'student'}...`}
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                    className="flex-1 bg-transparent border-none py-4 text-sm text-white outline-none placeholder:text-white/10"
                                />

                                <button
                                    onClick={sendMessage}
                                    disabled={!messageInput.trim()}
                                    className="p-4 rounded-2xl bg-indigo-600 text-white disabled:opacity-20 hover:bg-indigo-700 transition-all shadow-lg"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* User Profile Modal */}
            <AnimatePresence>
                {showProfile && selectedParticipant && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowProfile(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[40px] overflow-hidden relative z-10 shadow-2xl"
                        >
                            {/* Profile Header Background */}
                            <div className="h-32 bg-gradient-to-br from-indigo-600 to-purple-600 relative">
                                <button
                                    onClick={() => setShowProfile(false)}
                                    className="absolute top-6 right-6 p-2 rounded-full bg-black/20 text-white/80 hover:bg-black/40 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Profile Info */}
                            <div className="px-8 pb-8 -mt-16 text-center">
                                <div className="w-32 h-32 rounded-[40px] bg-zinc-800 border-4 border-zinc-900 mx-auto overflow-hidden relative mb-6 shadow-xl">
                                    {selectedParticipant.photoURL ? (
                                        <Image src={selectedParticipant.photoURL} alt={selectedParticipant.name} fill className="object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    )}
                                </div>

                                <h2 className="text-2xl font-black text-white mb-1">{selectedParticipant.name}</h2>
                                <p className="text-indigo-400 font-bold text-sm mb-6">@{selectedParticipant.username || 'student'}</p>

                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center">
                                        <MapPin className="w-5 h-5 text-white/20 mb-2" />
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Location</span>
                                        <span className="text-xs font-bold text-white mt-1">{selectedParticipant.location || 'Ethiopia'}</span>
                                    </div>
                                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center">
                                        <Briefcase className="w-5 h-5 text-white/20 mb-2" />
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Level</span>
                                        <span className="text-xs font-bold text-white mt-1">{selectedParticipant.schoolLevel || 'Student'}</span>
                                    </div>
                                </div>

                                {selectedParticipant.bio && (
                                    <div className="mb-8 text-left">
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2 px-2">About</p>
                                        <div className="p-5 rounded-3xl bg-white/5 border border-white/5 text-sm text-white/60 leading-relaxed font-medium italic">
                                            "{selectedParticipant.bio}"
                                        </div>
                                    </div>
                                )}

                                {selectedParticipant.useCases && selectedParticipant.useCases.length > 0 && (
                                    <div className="text-left mb-8">
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3 px-2">Focus Areas</p>
                                        <div className="flex flex-wrap gap-2 px-1">
                                            {selectedParticipant.useCases.map((useCase: string) => (
                                                <div key={useCase} className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                                    {useCase}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowProfile(false)}
                                        className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                                    >
                                        Message
                                    </button>
                                    <button className="p-4 rounded-2xl bg-white/5 text-white/40 hover:text-white transition-colors border border-white/5">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
