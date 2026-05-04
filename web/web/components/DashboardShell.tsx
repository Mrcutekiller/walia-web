'use client';

import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const { loading } = useAuth();

    // Close sidebar when clicking content on mobile
    const handleContentClick = () => {
        if (isSidebarOpen) setIsSidebarOpen(false);
    };

    if (loading) {
        return (
            <div className="h-screen w-screen bg-white dark:bg-[#07070F] flex items-center justify-center">
                <div className="flex flex-col items-center gap-5">
                    <div className="w-16 h-16 rounded-[2rem] bg-black dark:bg-white flex items-center justify-center shadow-2xl">
                        <div className="w-7 h-7 border-[3px] border-white/20 dark:border-black/20 border-t-white dark:border-t-black rounded-full animate-spin" />
                    </div>
                    <p className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.35em]">Loading Walia...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-gray-50 dark:bg-[#07070F] overflow-hidden relative">

            {/* ── Sidebar ── */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isMinimized={isMinimized}
                onToggleMinimize={() => setIsMinimized(p => !p)}
            />

            {/* ── Main ── */}
            <div
                className={[
                    'flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-500',
                    // On desktop, push content right when sidebar is visible
                    isMinimized ? 'lg:ml-20' : 'lg:ml-72',
                ].join(' ')}
                onClick={handleContentClick}
            >
                <TopBar
                    onOpenSidebar={() => setIsSidebarOpen(true)}
                    isSidebarOpen={isSidebarOpen}
                    isMinimized={isMinimized}
                />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
