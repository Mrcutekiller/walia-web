'use client';

import BirthdayModal from '@/components/BirthdayModal';
import { useAuth } from '@/context/AuthContext';
import { Gift } from 'lucide-react';
import { useState } from 'react';

export default function BirthdayTestPage() {
    const { user } = useAuth();
    const [isBirthdayOpen, setIsBirthdayOpen] = useState(true);
    const firstName = user?.displayName?.split(' ')[0] || 'Lianna';

    return (
        <div className="min-h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">

            <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-6 shadow-sm border border-gray-200">
                <Gift className="w-10 h-10 text-black" />
            </div>

            <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Birthday Modal</h1>
            <p className="text-gray-500 font-medium mb-8 max-w-sm leading-relaxed">
                This is a dedicated preview page for the <b>Walia Birthday Surprise Modal</b>. If you closed it, you can trigger it again below.
            </p>

            <button
                onClick={() => setIsBirthdayOpen(true)}
                className="px-8 py-4 rounded-full bg-black text-white font-bold text-sm uppercase tracking-widest hover:bg-zinc-800 transition-all hover:-translate-y-1 shadow-xl flex items-center gap-2"
            >
                Preview Surprise Modal
            </button>

            {/* The actual modal component */}
            <BirthdayModal
                isOpen={isBirthdayOpen}
                onClose={() => setIsBirthdayOpen(false)}
                userName={firstName}
            />

        </div>
    );
}
