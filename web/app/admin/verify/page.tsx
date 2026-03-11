'use client';

import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface VerificationRequest {
    id: string;
    name: string;
    type: string;
    status: string;
    submitted: string;
    email: string;
    proofUrl?: string;
}

export default function AdminVerify() {
    const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'verifications'), orderBy('submitted', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setVerifications(snap.docs.map(d => ({
                id: d.id,
                ...d.data()
            } as VerificationRequest)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <h1 className="text-2xl font-bold">Admin Verify UI Removed</h1>
            <p className="text-white/50">User verification backend logic remains available.</p>
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-sm font-medium">Connectivity Proof:</p>
                <p className="text-xl font-bold">{verifications.length} Verification Requests Found</p>
            </div>
        </div>
    );
}
