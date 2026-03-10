'use client';

import { PartyPopper } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// A simple lightweight CSS confetti component for the background
const Confetti = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Simple CSS animation for a few confetti pieces */}
            {[...Array(24)].map((_, i) => (
                <div
                    key={i}
                    className="absolute animate-confetti flex items-center justify-center opacity-80"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `-10%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2.5 + Math.random() * 3}s`,
                    }}
                >
                    <div
                        className={`w-3 h-3 rounded-sm ${['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400'][i % 5]}`}
                        style={{ transform: `rotate(${Math.random() * 360}deg)` }}
                    />
                </div>
            ))}
        </div>
    );
};

export default function BirthdayModal({ isOpen, onClose, userName = "Student" }: { isOpen: boolean; onClose: () => void; userName?: string }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#0A101D]/60 backdrop-blur-sm animate-in fade-in duration-300">
            <Confetti />

            <div className="relative w-full max-w-[420px] bg-white rounded-3xl p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 z-10 text-center flex flex-col items-center border border-white/20">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors focus:outline-none"
                    aria-label="Close modal"
                >
                    ✕
                </button>

                {/* 3D Mascot Image */}
                <div className="relative w-44 h-44 mb-2 mt-4 drop-shadow-xl select-none mix-blend-multiply">
                    <Image
                        src="/assets/walia_birthday_mascot.png"
                        alt="Walia Mascot Birthday"
                        fill
                        className="object-contain"
                        unoptimized
                    />
                </div>

                {/* Header Subtext */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full mb-4">
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Surprise Unlock</span>
                </div>

                {/* Header & Confetti Icon */}
                <h2 className="text-3xl font-black text-black tracking-tight mb-3">
                    Happy Birthday,<br />{userName}!
                </h2>

                <p className="text-sm font-medium text-gray-500 leading-relaxed mb-8 px-2">
                    We're so glad to have you in the Walia family. Here is a small gift for your special day.
                </p>

                {/* Claim Button */}
                <button
                    onClick={onClose}
                    className="w-full py-4 rounded-full bg-black text-white font-bold text-sm tracking-widest uppercase shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-zinc-800 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition-all flex items-center justify-center gap-2"
                >
                    <PartyPopper className="w-5 h-5 text-amber-300" />
                    Claim My Reward
                </button>

            </div>

            {/* Tailwind Keyframes injected locally for simplicity */}
            <style jsx global>{`
                @keyframes confetti {
                    0% { transform: translateY(0vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                .animate-confetti {
                    animation-name: confetti;
                    animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    animation-iteration-count: infinite;
                }
            `}</style>
        </div>
    );
}
