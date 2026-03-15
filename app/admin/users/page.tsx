'use client';

import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    plan: string;
    status: string;
    joined: string;
    photoURL?: string;
    displayName?: string;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setUsers(snap.docs.map(d => ({
                id: d.id,
                ...d.data(),
                name: d.data().displayName || d.data().name || 'Unknown User'
            } as User)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <h1 className="text-2xl font-bold">Admin Users UI Removed</h1>
            <p className="text-white/50">User management backend logic remains available.</p>
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-sm font-medium">Connectivity Proof:</p>
                <p className="text-xl font-bold">{users.length} Users Found in Database</p>
            </div>
        </div>
    );
}
