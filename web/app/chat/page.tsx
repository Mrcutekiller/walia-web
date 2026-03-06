'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ChatRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard/ai');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="animate-pulse text-white/20 font-black tracking-widest text-xs uppercase">
                Redirecting to AI Hub...
            </div>
        </div>
    );
}
