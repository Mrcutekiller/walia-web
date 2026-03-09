'use client';

import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface Transaction {
    id: string;
    user: string;
    plan: string;
    amount: string;
    status: string;
    date: string;
    method: string;
}

export default function AdminPayments() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'payments'), orderBy('date', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setTransactions(snap.docs.map(d => ({
                id: d.id,
                ...d.data()
            } as Transaction)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <h1 className="text-2xl font-bold">Admin Payments UI Removed</h1>
            <p className="text-white/50">Financial records backend logic remains available.</p>
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-sm font-medium">Connectivity Proof:</p>
                <p className="text-xl font-bold">{transactions.length} Transactions Found in Database</p>
            </div>
        </div>
    );
}
