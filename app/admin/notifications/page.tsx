'use client';

import { db } from '@/lib/firebase';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface NotificationHistory {
    id: string;
    title: string;
    message: string;
    target: string;
    createdAt: any;
}

export default function AdminNotifications() {
    const [history, setHistory] = useState<NotificationHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(20));
        const unsub = onSnapshot(q, (snap) => {
            setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() } as NotificationHistory)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <h1 className="text-2xl font-bold">Admin Notifications UI Removed</h1>
            <p className="text-white/50">Notification broadcast backend logic remains available.</p>
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-sm font-medium">Connectivity Proof:</p>
                <p className="text-xl font-bold">{history.length} Broadcast History Logs Found</p>
            </div>
        </div>
    );
}
