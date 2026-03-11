'use client';

import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface UpgradeRequest {
    id: string;
    userId: string;
    name: string;
    username: string;
    email: string;
    screenshotURL: string;
    status: string;
    planRequest: string;
    createdAt: any;
}

export default function AdminUpgrades() {
    const [requests, setRequests] = useState<UpgradeRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'upgrades'), where('status', '==', 'Pending'), orderBy('createdAt', 'asc'));
        const unsub = onSnapshot(q, (snap) => {
            setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() } as UpgradeRequest)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <h1 className="text-2xl font-bold">Admin Upgrades UI Removed</h1>
            <p className="text-white/50">Payment approval backend logic remains available.</p>
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-sm font-medium">Connectivity Proof:</p>
                <p className="text-xl font-bold">{requests.length} Pending Upgrade Requests Found</p>
            </div>
        </div>
    );
}
