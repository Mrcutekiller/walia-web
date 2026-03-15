'use client';

import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all w-full group"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-black flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                {theme === 'light' ? (
                    <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                    <Moon className="w-4 h-4 text-indigo-400" />
                )}
            </div>
            <div className="text-left flex-1">
                <p className="text-xs font-bold text-black dark:text-white uppercase tracking-wider">
                    {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </p>
                <p className="text-[9px] text-black/30 dark:text-white/30 font-medium whitespace-nowrap">
                    Switch to {theme === 'light' ? 'dark' : 'light'}
                </p>
            </div>
        </button>
    );
}
