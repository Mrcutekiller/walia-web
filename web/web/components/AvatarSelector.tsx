import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface AvatarSelectorProps {
    selectedAvatar: string;
    onSelect: (path: string) => void;
}

const AVATARS = Array.from({ length: 21 }, (_, i) => `/avatars/avatar${i + 1}.jpg`);

export default function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Smooth scroll to selected on mount
    useEffect(() => {
        if (selectedAvatar && scrollRef.current) {
            const index = AVATARS.indexOf(selectedAvatar);
            if (index !== -1) {
                const itemWidth = 96 + 16; // w-24 + gap-4
                scrollRef.current.scrollTo({
                    left: index * itemWidth - (scrollRef.current.offsetWidth / 2) + 48,
                    behavior: 'smooth'
                });
            }
        }
    }, []);

    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.2em]">Select Identity</label>
                <span className="text-[9px] font-bold text-walia-primary uppercase tracking-wider bg-walia-primary/10 px-2 py-0.5 rounded-full">21 Avatars Available</span>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-6 pt-2 px-1 no-scrollbar cursor-grab active:cursor-grabbing snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {AVATARS.map((path, i) => (
                    <motion.div
                        key={path}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="shrink-0 snap-center"
                        onClick={() => onSelect(path)}
                    >
                        <div className={cn(
                            "relative w-24 h-24 rounded-[32px] overflow-hidden cursor-pointer transition-all duration-500 border-4",
                            selectedAvatar === path
                                ? "border-black dark:border-white shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-110 rotate-3 z-10"
                                : "border-transparent grayscale-[0.3] hover:grayscale-0 opacity-60 hover:opacity-100"
                        )}>
                            <Image
                                src={path}
                                alt={`Avatar ${i + 1}`}
                                fill
                                className="object-cover"
                            />
                            {selectedAvatar === path && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-black/10 dark:bg-white/5 flex items-center justify-center"
                                >
                                    <div className="bg-white dark:bg-black p-1.5 rounded-full shadow-lg">
                                        <svg className="w-4 h-4 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <p className="text-center text-[10px] text-black/20 dark:text-white/20 font-medium italic">Smoothly scroll to browse all options</p>
        </div>
    );
}
