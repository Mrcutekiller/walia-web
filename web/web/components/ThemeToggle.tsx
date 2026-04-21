'use client';

import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const options = [
        { id: 'light', icon: Sun, label: 'Light' },
        { id: 'dark', icon: Moon, label: 'Dark' }
    ];

    return (
        <div className="flex p-1 bg-[var(--color-surface-container)] rounded-full border border-[var(--color-outline-variant)]/10 shadow-inner">
            {options.map((opt) => {
                const Icon = opt.icon;
                const isActive = theme === opt.id;

                return (
                    <button
                        key={opt.id}
                        onClick={() => setTheme(opt.id as 'light' | 'dark')}
                        className={`relative flex items-center justify-center p-2 rounded-full transition-all group`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-theme"
                                className="absolute inset-0 bg-[var(--color-surface-container-highest)] rounded-full shadow-lg border border-[var(--color-outline-variant)]/20"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <Icon 
                            className={`relative w-4 h-4 z-10 transition-colors ${
                                isActive 
                                ? 'text-[var(--color-primary)]' 
                                : 'text-[var(--color-outline)] group-hover:text-[var(--color-on-surface)]'
                            }`} 
                        />
                    </button>
                );
            })}
        </div>
    );
}
