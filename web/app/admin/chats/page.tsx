'use client';

import { db } from '@/lib/firebase';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface ChatRoom {
    id: string;
    room: string;
    participants: number;
    lastMsg: string;
    lastMsgType?: 'text' | 'voice' | 'image';
    type: string;
    status: string;
    time: string;
}

export default function AdminChats() {
    const [chats, setChats] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'chats'), orderBy('lastMessageAt', 'desc'), limit(50));
        const unsub = onSnapshot(q, (snap) => {
            setChats(snap.docs.map(d => ({
                id: d.id,
                ...d.data()
            } as ChatRoom)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <h1 className="text-2xl font-bold">Admin Chats UI Removed</h1>
            <p className="text-white/50">Chat monitoring backend logic remains available.</p>
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-sm font-medium">Connectivity Proof:</p>
                <p className="text-xl font-bold">{chats.length} Active Chat Nodes Found</p>
            </div>
        </div>
    );
}
