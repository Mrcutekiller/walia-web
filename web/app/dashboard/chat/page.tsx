'use client';

import UserBadge from '@/components/UserBadge';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { getOrCreateChat, searchUsers } from '@/lib/user';
import { cn, formatTimeAgo } from '@/lib/utils';
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    limit,
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
    FileText,
    Heart,
    HelpCircle,
    Image as ImageIcon,
    Info,
    Loader2,
    MapPin,
    MessageCircle,
    Plus,
    Search,
    Send,
    Share2,
    Trash2,
    User,
    X
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type TabType = 'messages' | 'groups' | 'community';

interface Post {
    id: string;
    authorId: string;
    title: string;
    content: string;
    type: 'ai_share' | 'quiz' | 'note' | 'general';
    likes: string[];
    commentCount: number;
    createdAt: any;
}

export default function ChatPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('messages');

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

    // --- Community State ---
    const [posts, setPosts] = useState<Post[]>([]);
    const [postInput, setPostInput] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postType, setPostType] = useState<'ai_share' | 'quiz' | 'note' | 'general'>('general');
    const [isPosting, setIsPosting] = useState(false);
    const [showNewPost, setShowNewPost] = useState(false);

    // --- Effects for Messages ---
    useEffect(() => {
        if (!user || activeTab !== 'messages') return;
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
    }, [user, activeTab]);

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

    // --- Effects for Community ---
    useEffect(() => {
        if (activeTab !== 'community') return;
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
        const unsub = onSnapshot(q, (snap) => {
            setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
        });
        return () => unsub();
    }, [activeTab]);

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

    // --- Community Handlers ---
    const handleCreatePost = async () => {
        if (!postInput.trim() || !user) return;
        setIsPosting(true);
        try {
            await addDoc(collection(db, 'posts'), {
                authorId: user.uid,
                title: postTitle || 'Community Update',
                content: postInput,
                type: postType,
                likes: [],
                commentCount: 0,
                createdAt: serverTimestamp()
            });
            setPostInput('');
            setPostTitle('');
            setPostType('general');
            setShowNewPost(false);
        } catch (error) {
            console.error('Post error:', error);
        } finally {
            setIsPosting(false);
        }
    };

    const handleLike = async (post: Post) => {
        if (!user) return;
        const postRef = doc(db, 'posts', post.id);
        const isLiked = post.likes?.includes(user.uid);
        try {
            await updateDoc(postRef, { likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid) });
        } catch (error) {
            console.error('Like error:', error);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, 'posts', postId));
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    // Main render returns full active chat OR the tabbed view
    if (activeChat) {
        const activeChatData = chats.find(c => c.id === activeChat);
        return (
            <div className="flex flex-col h-full bg-white dark:bg-[#0a0a0a] md:max-w-5xl md:mx-auto md:border-x md:border-black/5 md:dark:border-white/5 relative">
                {/* Chat Header */}
                <header className="h-16 px-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between shrink-0 bg-white/80 dark:bg-black/50 backdrop-blur-md">
                    <div className="flex items-center cursor-pointer group" onClick={() => setShowProfile(true)}>
                        <button onClick={(e) => { e.stopPropagation(); setActiveChat(null); }} className="p-2 mr-2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-indigo-600/10 dark:bg-walia-primary/20 flex items-center justify-center font-bold text-indigo-600 dark:text-walia-primary mr-3 overflow-hidden relative group-hover:scale-105 transition-transform">
                            {selectedParticipant?.photoURL ? (
                                <Image src={selectedParticipant.photoURL} alt="Profile" fill className="object-cover" />
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-walia-primary transition-colors">
                                {selectedParticipant?.name || (activeChatData?.type === 'dm' ? 'Direct Message' : activeChatData?.name)}
                            </h3>
                            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-0.5">Active Now</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all text-black/40 dark:text-white/40" onClick={() => setShowProfile(true)}><Info className="w-5 h-5" /></button>
                    </div>
                </header>

                {/* Message Thread */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
                    {messages.map((msg) => {
                        const isMe = msg.senderId === user?.uid;
                        return (
                            <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                <div className={cn(
                                    "rounded-2xl text-sm max-w-[85%] leading-relaxed shadow-sm overflow-hidden",
                                    isMe ? "bg-indigo-600 text-white rounded-tr-[4px]" : "bg-black/5 dark:bg-white/10 text-black dark:text-white/90 rounded-tl-[4px]",
                                    msg.image ? "p-1" : "px-4 py-2.5"
                                )}>
                                    {msg.image ? (
                                        <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-black/10 dark:bg-black/50">
                                            <Image src={msg.image} alt="Sent" fill className="object-cover" unoptimized />
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                    <div className={cn("text-[9px] mt-1 font-bold uppercase tracking-tighter opacity-50", isMe ? "text-right" : "text-left")}>
                                        {formatTimeAgo(msg.createdAt)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Action Bar */}
                <div className="p-3 bg-white dark:bg-[#0a0a0a] border-t border-black/5 dark:border-white/5 pb-6 md:pb-3">
                    <div className="flex items-center space-x-2 bg-black/5 dark:bg-white/5 rounded-full p-1.5 focus-within:ring-2 ring-indigo-500/50 transition-all">
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="p-2.5 rounded-full text-black/40 dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/10 transition-all disabled:opacity-50">
                            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                        </button>
                        <input
                            type="text"
                            placeholder={`Message...`}
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            className="flex-1 bg-transparent border-none py-2 text-sm text-black dark:text-white outline-none placeholder:text-black/30 dark:placeholder:text-white/30"
                        />
                        <button onClick={sendMessage} disabled={!messageInput.trim()} className="p-2.5 rounded-full bg-indigo-600 text-white disabled:opacity-20 hover:bg-indigo-700 transition-all">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Profile Modal Overlay */}
                <AnimatePresence>
                    {showProfile && selectedParticipant && (
                        <div className="absolute inset-0 z-50 flex items-end justify-center">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProfile(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="w-full bg-white dark:bg-zinc-900 rounded-t-[32px] overflow-hidden relative z-10 shadow-2xl p-6 pb-12">
                                <div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full mx-auto mb-6" />
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 overflow-hidden relative mb-4 shadow-lg">
                                        {selectedParticipant.photoURL ? <Image src={selectedParticipant.photoURL} alt={selectedParticipant.name} fill className="object-cover" /> : <User className="w-10 h-10 text-indigo-300 dark:text-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                                    </div>
                                    <h2 className="text-xl font-black text-black dark:text-white">{selectedParticipant.name}</h2>
                                    <p className="text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-6">@{selectedParticipant.username || 'student'}</p>
                                    <div className="grid grid-cols-2 gap-3 w-full mb-6">
                                        <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 flex flex-col items-center">
                                            <MapPin className="w-4 h-4 text-black/40 dark:text-white/40 mb-1" />
                                            <span className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">Location</span>
                                            <span className="text-xs font-bold text-black dark:text-white mt-0.5">{selectedParticipant.location || 'Ethiopia'}</span>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 flex flex-col items-center">
                                            <Briefcase className="w-4 h-4 text-black/40 dark:text-white/40 mb-1" />
                                            <span className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">Level</span>
                                            <span className="text-xs font-bold text-black dark:text-white mt-0.5">{selectedParticipant.schoolLevel || 'Student'}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowProfile(false)} className="w-full py-3.5 rounded-full bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg">
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

    // Default Chat Dashboard View
    return (
        <div className="animate-fade-in flex flex-col h-full max-w-4xl mx-auto px-4 md:px-0 md:pt-6">
            <div className="mb-6 mt-2">
                <p className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-widest mb-1">Connect & Learn</p>
                <h1 className="text-2xl font-black text-black dark:text-white tracking-tight">Walia Social</h1>
            </div>

            {/* 3-way Tab Segment */}
            <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-full mb-6">
                {(['messages', 'groups', 'community'] as TabType[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all",
                            activeTab === tab ? "bg-white dark:bg-black text-black dark:text-white shadow-sm" : "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Based on Tab */}
            <div className="flex-1">
                {activeTab === 'messages' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-bold text-black dark:text-white">Private Messages</h2>
                            <button onClick={() => setShowSearch(!showSearch)} className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-indigo-600 transition-colors">
                                {showSearch ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </button>
                        </div>

                        {showSearch && (
                            <div className="mb-4 animate-fade-in-up">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30" />
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full bg-black/5 dark:bg-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none text-black dark:text-white"
                                    />
                                </div>
                                <div className="mt-2 space-y-1">
                                    {searchResults.map(u => (
                                        <div key={u.id} onClick={() => startChat(u)} className="p-3 rounded-2xl cursor-pointer flex items-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 overflow-hidden relative mr-3">
                                                {u.photoURL ? <Image src={u.photoURL} alt="" fill className="object-cover" /> : <User className="w-5 h-5 text-indigo-500 absolute top-2.5 left-2.5" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-black dark:text-white">{u.displayName || u.name}</p>
                                                <p className="text-xs text-black/40 dark:text-white/40">@{u.username}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {chats.length === 0 && !showSearch ? (
                            <div className="text-center py-10 opacity-50">
                                <p className="text-xs">No private messages yet.</p>
                            </div>
                        ) : (
                            chats.map((chat) => (
                                <div key={chat.id} onClick={() => setActiveChat(chat.id)} className="p-3 -mx-3 rounded-2xl cursor-pointer flex items-center hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                                    <div className="w-12 h-12 rounded-full overflow-hidden relative bg-black/10 dark:bg-white/10 mr-4">
                                        {chat.photoURL ? <Image src={chat.photoURL} alt="" fill className="object-cover" /> : <User className="w-6 h-6 text-black/40 dark:text-white/40 absolute top-3 left-3" />}
                                    </div>
                                    <div className="flex-1 overflow-hidden border-b border-black/5 dark:border-white/5 pb-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="text-sm font-bold text-black dark:text-white truncate pr-2">{chat.type === 'dm' ? (chat.otherName || 'Direct Message') : chat.name}</h4>
                                            <span className="text-[10px] text-black/40 dark:text-white/40">{formatTimeAgo(chat.lastMessageAt)}</span>
                                        </div>
                                        <p className="text-xs text-black/50 dark:text-white/50 truncate">{chat.lastMessage || 'Start a conversation...'}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'groups' && (
                    <div className="text-center py-20 opacity-50">
                        <p className="text-sm font-bold">Groups functionality</p>
                        <p className="text-xs">Coming soon to the web interface.</p>
                    </div>
                )}

                {activeTab === 'community' && (
                    <div className="space-y-6">
                        {/* Compose Post (Inline) */}
                        {!showNewPost ? (
                            <button onClick={() => setShowNewPost(true)} className="w-full flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                                <span className="text-sm text-black/40 dark:text-white/40">Share something with the community...</span>
                                <div className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold">Post</div>
                            </button>
                        ) : (
                            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-3 animate-fade-in-up">
                                <input
                                    type="text"
                                    placeholder="Title (optional)"
                                    value={postTitle}
                                    onChange={(e) => setPostTitle(e.target.value)}
                                    className="w-full bg-transparent text-sm font-bold text-black dark:text-white outline-none placeholder:text-black/30 dark:placeholder:text-white/30"
                                />
                                <textarea
                                    placeholder="What's on your mind?..."
                                    value={postInput}
                                    onChange={(e) => setPostInput(e.target.value)}
                                    className="w-full bg-transparent text-sm text-black dark:text-white/80 outline-none resize-none min-h-[60px] placeholder:text-black/30 dark:placeholder:text-white/30"
                                />
                                <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                                    <div className="flex gap-2">
                                        {[
                                            { id: 'general', icon: Share2 },
                                            { id: 'quiz', icon: HelpCircle },
                                            { id: 'note', icon: FileText }
                                        ].map(t => (
                                            <button key={t.id} onClick={() => setPostType(t.id as any)} className={cn("p-2 rounded-full", postType === t.id ? "bg-indigo-600/20 text-indigo-600" : "text-black/40 dark:text-white/40")}>
                                                <t.icon className="w-4 h-4" />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setShowNewPost(false)} className="px-4 py-1.5 rounded-full text-xs font-bold text-black/50 dark:text-white/50">Cancel</button>
                                        <button onClick={handleCreatePost} disabled={!postInput.trim() || isPosting} className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold disabled:opacity-50">Post</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Posts List */}
                        <div className="space-y-4">
                            {posts.map(post => (
                                <div key={post.id} className="p-5 rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <UserBadge uid={post.authorId} size="sm" />
                                        {post.authorId === user?.uid && (
                                            <button onClick={() => handleDeletePost(post.id)} className="p-2 text-red-500/50 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        {post.type !== 'general' && (
                                            <span className="inline-block px-2 py-1 bg-black/5 dark:bg-white/10 rounded uppercase text-[9px] font-black text-indigo-600 dark:text-indigo-400 mb-2 tracking-widest">{post.type}</span>
                                        )}
                                        {post.title && <h3 className="text-base font-bold text-black dark:text-white mb-1">{post.title}</h3>}
                                        <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed font-medium">{post.content}</p>
                                    </div>
                                    <div className="flex items-center space-x-4 border-t border-black/5 dark:border-white/5 pt-3">
                                        <button onClick={() => handleLike(post)} className={cn("flex items-center space-x-1.5 text-xs font-bold", post.likes?.includes(user?.uid || '') ? "text-red-500" : "text-black/40 dark:text-white/40")}>
                                            <Heart className={cn("w-4 h-4", post.likes?.includes(user?.uid || '') && "fill-current")} />
                                            <span>{post.likes?.length || 0}</span>
                                        </button>
                                        <button className="flex items-center space-x-1.5 text-xs font-bold text-black/40 dark:text-white/40">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{post.commentCount || 0}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
