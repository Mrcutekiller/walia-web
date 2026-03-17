'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard/profile');
    }, [router]);

    return (
        <div className="flex h-full items-center justify-center p-8 bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Entering Dashboard...</p>
            </div>
        </div>
    );
}
