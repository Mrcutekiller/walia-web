'use client';

import DashboardShell from '@/components/DashboardShell';
import WaliaAIOrb from '@/components/WaliaAIOrb';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from 'firebase/firestore';
import { ChevronLeft, MessageSquare, Plus, Search, Send, Sparkles, User, Users, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface ChatRoom {
    id: string;
    name: string;
    type: 'private' | 'group';
    lastMessage: string;
    updatedAt: any;
    aiSession?: {
        mode: string;
        level: string;
        expiresAt: number;
        isActive: boolean;
    };
}

interface Message {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    isAI?: boolean;
    createdAt: any;
}

export default function MessagesPage() {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [plan, setPlan] = useState<'free' | 'pro'>('free');
    const [weeklyAiCount, setWeeklyAiCount] = useState(0);

    const bottomRef = useRef<HTMLDivElement>(null);

    // Load Plan & Usage
    useEffect(() => {
        if (!user) return;
        getDoc(doc(db, 'users', user.uid)).then(d => {
            if (d.exists()) setPlan(d.data().plan || 'free');
        });
        const currentWeek = getWeekNumber(new Date());
        getDoc(doc(db, 'usage', `${user.uid}_companion_w${currentWeek}`)).then(d => {
            if (d.exists()) setWeeklyAiCount(d.data().count || 0);
        });
    }, [user]);

    // Load Rooms (Just showing all rooms for this demo since we don't have a complex participant relation yet)
    useEffect(() => {
        const q = query(collection(db, 'chats'), orderBy('updatedAt', 'desc'));
        return onSnapshot(q, snap => {
            setRooms(snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatRoom)));
        });
    }, []);

    // Load active room messages
    useEffect(() => {
        if (!activeRoomId) return;
        const q = query(collection(db, 'chats', activeRoomId, 'messages'), orderBy('createdAt', 'asc'));
        return onSnapshot(q, snap => {
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });
    }, [activeRoomId]);

    const activeRoom = rooms.find(r => r.id === activeRoomId);

    // Check if AI limit reached
    const isPro = plan === 'pro';
    const hasFreeWeeklyUsed = !isPro && weeklyAiCount >= 1;

    // AI logic flags
    const isAIAvtive = activeRoom?.aiSession?.isActive && activeRoom.aiSession.expiresAt > Date.now();

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = inputText.trim();
        if (!text || !user || !activeRoomId) return;
        setInputText('');

        const msgData = {
            text,
            senderId: user.uid,
            senderName: user.displayName || 'Anonymous',
            createdAt: serverTimestamp(),
            isAI: false,
        };

        // Write user message
        await addDoc(collection(db, 'chats', activeRoomId, 'messages'), msgData);
        await updateDoc(doc(db, 'chats', activeRoomId), { lastMessage: text, updatedAt: serverTimestamp() });

        // If AI is active in the room, trigger background response immediately
        if (isAIAvtive && activeRoom?.aiSession) {
            triggerAI(text, activeRoomId, activeRoom.aiSession);
        }
    };

    const triggerAI = async (userText: string, roomId: string, aiSession: any) => {
        // Collect real recent history from local state
        const history = messages.slice(-5).map(m => ({
            role: m.isAI ? 'assistant' : 'user',
            content: `${m.senderName}: ${m.text}`
        }));

        try {
            // We do NOT await this request blockingly on the UI to allow offline/background processing.
            // Vercel serverless functions will finish processing even if client disconnects quickly.
            fetch('/api/chat/companion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `${user?.displayName || 'User'}: ${userText}`,
                    history,
                    mode: aiSession.mode,
                    level: aiSession.level
                }),
            }).then(res => res.json()).then(async data => {
                if (data.reply) {
                    await addDoc(collection(db, 'chats', roomId, 'messages'), {
                        text: data.reply,
                        senderId: 'walia-ai',
                        senderName: 'Walia',
                        isAI: true,
                        createdAt: serverTimestamp(),
                    });
                    await updateDoc(doc(db, 'chats', roomId), { lastMessage: data.reply.substring(0, 50) + '...', updatedAt: serverTimestamp() });
                }
            });
        } catch (e) { console.error('AI error', e); }
    };

    const startSession = async (mode: string, level: string, durationMin: number) => {
        if (!activeRoomId || !user) return;

        // Track usage if free
        if (!isPro) {
            const currentWeek = getWeekNumber(new Date());
            await setDoc(doc(db, 'usage', `${user.uid}_companion_w${currentWeek}`), { count: weeklyAiCount + 1 });
            setWeeklyAiCount(c => c + 1);
        }

        const expiresAt = durationMin === 9999 ? Date.now() + 1000 * 60 * 60 * 24 * 365 : Date.now() + durationMin * 60000;

        await updateDoc(doc(db, 'chats', activeRoomId), {
            aiSession: { mode, level, expiresAt, isActive: true }
        });

        // Intro message
        await addDoc(collection(db, 'chats', activeRoomId, 'messages'), {
            text: `Hello everyone. I am here to assist for the next ${durationMin === 9999 ? 'while' : durationMin + ' minutes'}. I am acting as a ${level} ${mode} persona.`,
            senderId: 'walia-ai',
            senderName: 'Walia',
            isAI: true,
            createdAt: serverTimestamp(),
        });
    };

    const stopSession = async () => {
        if (!activeRoomId) return;
        await updateDoc(doc(db, 'chats', activeRoomId), { 'aiSession.isActive': false });
        await addDoc(collection(db, 'chats', activeRoomId, 'messages'), {
            text: 'The session has ended. You can activate me again anytime.',
            senderId: 'walia-ai', senderName: 'Walia', isAI: true, createdAt: serverTimestamp(),
        });
    };

    const [showGroupModal, setShowGroupModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    const [userSearchResults, setUserSearchResults] = useState<any[]>([]);

    const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);

    const createGroup = async () => {
        if (!newGroupName.trim() || !user) return;
        const participantIds = [user.uid, ...selectedParticipants.map(p => p.uid)];
        const ref = await addDoc(collection(db, 'chats'), {
            name: newGroupName,
            type: 'group',
            participants: participantIds,
            lastMessage: 'Group created',
            updatedAt: serverTimestamp()
        });
        setActiveRoomId(ref.id);
        setShowGroupModal(false);
        setNewGroupName('');
        setSelectedParticipants([]);
    };

    const searchUsers = async (val: string) => {
        setSearch(val);
        if (val.startsWith('@') && val.length > 2) {
            const q = query(
                collection(db, 'users'),
                where('username', '>=', val),
                where('username', '<=', val + '\uf8ff'),
                limit(5)
            );
            const snap = await getDocs(q);
            setUserSearchResults(snap.docs.map(d => ({ uid: d.id, ...d.data() })).filter(u => u.uid !== user?.uid));
        } else {
            setUserSearchResults([]);
        }
    };

    const startPrivateChat = async (targetUser: any) => {
        if (!user) return;
        const roomId = user.uid < targetUser.uid ? `${user.uid}_${targetUser.uid}` : `${targetUser.uid}_${user.uid}`;
        const roomRef = doc(db, 'chats', roomId);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
            await setDoc(roomRef, {
                name: targetUser.name || targetUser.username,
                type: 'private',
                participants: [user.uid, targetUser.uid],
                lastMessage: 'Chat started',
                updatedAt: serverTimestamp(),
                photoURL: targetUser.photoURL || ''
            });
        }
        setActiveRoomId(roomId);
        setSearch('');
        setUserSearchResults([]);
    };

    const filtered = rooms.filter(r => r.name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <DashboardShell>
            <div className="h-full flex flex-col md:flex-row max-w-6xl mx-auto w-full relative overflow-hidden">
                {/* ── LEFT PANE: List ── */}
                <div className={`w-full md:w-80 lg:w-96 flex flex-col h-full border-r border-white/5 transition-transform duration-300 absolute md:static bg-[#0a0a0a] z-10 ${activeRoomId ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
                    }`}>
                    <div className="p-6 shrink-0">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Inbox</p>
                                <h1 className="text-3xl font-black text-white tracking-tight">Messages</h1>
                            </div>
                            <button onClick={() => setShowGroupModal(true)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white transition-all border border-black/5 dark:border-white/5">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/25 dark:text-white/25 group-focus-within:text-indigo-600 transition-colors" />
                            <input value={search} onChange={e => searchUsers(e.target.value)} placeholder="Search chats or @username..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8 text-black dark:text-white text-sm placeholder:text-black/20 dark:placeholder:text-white/10 outline-none focus:border-indigo-600 transition-all shadow-sm dark:shadow-none" />

                            {/* Search Results Dropdown */}
                            {userSearchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl p-2 z-[60] animate-in slide-in-from-top-2 duration-200">
                                    <p className="text-[9px] font-black text-black/30 dark:text-white/30 uppercase tracking-widest px-3 py-2">Users</p>
                                    {userSearchResults.map(u => (
                                        <button key={u.uid} onClick={() => startPrivateChat(u)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all text-left group">
                                            <div className="w-9 h-9 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                                {u.photoURL ? <Image src={u.photoURL} alt="" width={36} height={36} className="object-cover" /> : <User className="w-4 h-4 text-black/30 dark:text-white/30" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-black dark:text-white truncate group-hover:text-indigo-600 transition-colors">{u.name || u.username}</p>
                                                <p className="text-[10px] text-black/40 dark:text-white/40 truncate">{u.username}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 custom-scrollbar">
                        {filtered.length === 0 && <p className="text-center text-xs text-black/30 dark:text-white/20 mt-10">No chats found.</p>}
                        {filtered.map(r => (
                            <button key={r.id} onClick={() => setActiveRoomId(r.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer text-left ${activeRoomId === r.id ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                                    }`}>
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-black shrink-0 ${r.type === 'group' ? 'bg-indigo-600/30 text-indigo-500' : 'bg-black/10 dark:bg-white/10 text-black dark:text-white'}`}>
                                    {r.type === 'group' ? <Users className="w-5 h-5" /> : r.name?.charAt(0) || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-black dark:text-white truncate">{r.name || 'Unknown'}</p>
                                    </div>
                                    <p className="text-xs truncate mt-0.5 text-black/40 dark:text-white/40">{r.lastMessage}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT PANE: Chat Details ── */}
                <div className={`flex-1 flex flex-col h-full bg-white dark:bg-[#0a0a0a] transition-transform duration-300 absolute md:static w-full z-20 ${activeRoomId ? 'translate-x-0' : 'translate-x-full md:translate-x-0 hidden md:flex'
                    }`}>
                    {activeRoom ? (
                        <>
                            {/* Chat Header */}
                            <div className="px-5 py-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between shrink-0 bg-white dark:bg-[#0a0a0a]">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setActiveRoomId(null)} className="md:hidden p-2 -ml-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white">
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${activeRoom.type === 'group' ? 'bg-indigo-600/30 text-indigo-500' : 'bg-black/10 dark:bg-white/10 text-black dark:text-white'}`}>
                                        {activeRoom.type === 'group' ? <Users className="w-4 h-4" /> : activeRoom.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-black text-black dark:text-white">{activeRoom.name || 'Chat'}</h2>
                                        {isAIAvtive && (
                                            <p className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" /> Walia AI Active
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {isAIAvtive && (
                                    <button onClick={stopSession} className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 font-bold hover:bg-rose-500/20 transition-all">
                                        Stop AI
                                    </button>
                                )}
                            </div>

                            {/* Chat History */}
                            <div className="flex-1 overflow-y-auto p-6 flex flex-col space-y-4 custom-scrollbar bg-black/2 dark:bg-transparent">
                                {messages.length === 0 && (
                                    <div className="text-center my-6 text-black/30 dark:text-white/20 text-xs">Beginning of conversation.</div>
                                )}
                                {messages.map(m => {
                                    const isMe = m.senderId === user?.uid;
                                    return (
                                        <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <span className="text-[10px] text-black/30 dark:text-white/20 mb-1 ml-1 font-bold uppercase tracking-tighter">{m.senderName}</span>
                                            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-black dark:bg-white text-white dark:text-black font-medium rounded-br-sm shadow-md' :
                                                m.isAI ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-100 rounded-bl-sm' :
                                                    'bg-black/5 dark:bg-white/8 text-black/80 dark:text-white/80 rounded-bl-sm border border-black/5 dark:border-white/10'
                                                }`}>
                                                {m.text}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={bottomRef} />
                            </div>

                            {/* Chat Input & Orb */}
                            <div className="p-4 border-t border-black/5 dark:border-white/5 bg-white dark:bg-[#0a0a0a] shrink-0 relative">
                                <form onSubmit={handleSend} className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={e => setInputText(e.target.value)}
                                        placeholder="Write a message..."
                                        className="flex-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 outline-none focus:border-black/10 dark:focus:border-white/25 transition-all"
                                    />
                                    <button disabled={!inputText.trim()} type="submit" className="w-12 h-12 shrink-0 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-30">
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>

                                {!isAIAvtive && (
                                    <WaliaAIOrb
                                        onStartSession={startSession}
                                        isPro={isPro}
                                        hasFreeWeeklyUsed={hasFreeWeeklyUsed}
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 hidden md:flex">
                            <div className="w-20 h-20 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center mb-4">
                                <MessageSquare className="w-8 h-8 text-black/20 dark:text-white/20" />
                            </div>
                            <h2 className="text-lg font-black text-black dark:text-white">Your Messages</h2>
                            <p className="text-sm text-black/40 dark:text-white/40 mt-1 max-w-xs">Select a conversation or start a new group chat via the (+) button.</p>
                        </div>
                    )}
                </div>

                {/* Group Creation Modal */}
                {showGroupModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                        <div className="bg-[#111] w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
                            <div className="p-8 pb-0">
                                <h2 className="text-2xl font-black text-white mb-2">New Group</h2>
                                <p className="text-xs text-white/40 mb-6 uppercase tracking-widest font-black">Step 1: Group Identity</p>

                                <input
                                    autoFocus
                                    value={newGroupName}
                                    onChange={e => setNewGroupName(e.target.value)}
                                    placeholder="Group Name..."
                                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-indigo-500/50 transition-all mb-6 text-sm"
                                />

                                <p className="text-xs text-white/40 mb-3 uppercase tracking-widest font-black">Step 2: Add Members (@username)</p>
                                <div className="relative mb-4">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        placeholder="Search people..."
                                        onChange={(e) => searchUsers(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/8 text-white text-xs outline-none focus:border-indigo-500/30"
                                    />
                                </div>

                                {selectedParticipants.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4 max-h-24 overflow-y-auto p-1">
                                        {selectedParticipants.map(p => (
                                            <div key={p.uid} className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30">
                                                <span className="text-[10px] font-bold text-indigo-300">{p.username}</span>
                                                <button onClick={() => setSelectedParticipants(prev => prev.filter(x => x.uid !== p.uid))} className="w-4 h-4 rounded-full bg-indigo-500/40 flex items-center justify-center hover:bg-indigo-500">
                                                    <X className="w-2.5 h-2.5 text-white" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto px-8 space-y-2 pb-4">
                                {userSearchResults.map(u => (
                                    <button key={u.uid}
                                        onClick={() => {
                                            if (!selectedParticipants.find(p => p.uid === u.uid)) {
                                                setSelectedParticipants(prev => [...prev, u]);
                                            }
                                        }}
                                        className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all text-left">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                            {u.photoURL ? <Image src={u.photoURL} alt="" width={32} height={32} /> : <User className="w-3.5 h-3.5 text-white/20" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-white truncate">{u.name || u.username}</p>
                                            <p className="text-[10px] text-white/30 truncate">{u.username}</p>
                                        </div>
                                        <Plus className="w-4 h-4 text-indigo-500" />
                                    </button>
                                ))}
                            </div>

                            <div className="p-8 pt-4 bg-white/5 border-t border-white/5 flex flex-col gap-2">
                                <button
                                    onClick={createGroup}
                                    disabled={!newGroupName.trim() || selectedParticipants.length === 0}
                                    className="w-full bg-white text-black font-black py-4 rounded-2xl hover:opacity-90 transition-all disabled:opacity-30 shadow-xl text-sm"
                                >
                                    Launch Group
                                </button>
                                <button
                                    onClick={() => {
                                        setShowGroupModal(false);
                                        setSelectedParticipants([]);
                                    }}
                                    className="w-full py-2 text-white/30 font-bold text-[10px] uppercase tracking-widest"
                                >
                                    Discard
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardShell>
    );
}

// Utility to get current week number for the free plan tracking
function getWeekNumber(d: Date) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
