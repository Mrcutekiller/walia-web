'use client';

import { db } from '@/lib/firebase';
import {
    collection,
    onSnapshot
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

const mockGrowthData = [
    { month: 'Jan', value: 40 },
    { month: 'Feb', value: 35 },
    { month: 'Mar', value: 55 },
    { month: 'Apr', value: 45 },
    { month: 'May', value: 70 },
    { month: 'Jun', value: 65 },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        proUsers: 0
    });

    useEffect(() => {
        const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
            const total = snap.size;
            let proCount = 0;
            snap.forEach(doc => {
                if (doc.data().plan?.toLowerCase() === 'pro') proCount++;
            });
            setStats({ totalUsers: total, proUsers: proCount });
        });
        return () => unsubUsers();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <h1 className="text-2xl font-bold">Admin Dashboard UI Removed</h1>
            <p className="text-white/50">Backend systems remain active and connected.</p>
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                <p className="text-sm font-medium">Connectivity Proof (Live Stats):</p>
                <div className="flex justify-between space-x-8">
                    <div>
                        <p className="text-[10px] text-white/30 uppercase">Total Users</p>
                        <p className="text-xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-white/30 uppercase">Pro Users</p>
                        <p className="text-xl font-bold">{stats.proUsers}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
