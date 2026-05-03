'use client';

import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-screen bg-white dark:bg-[#07070F] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-[2rem] bg-black dark:bg-white flex items-center justify-center animate-pulse shadow-2xl">
                        <div className="w-8 h-8 border-4 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                    </div>
                    <p className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.3em] animate-pulse">Walia is Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-white dark:bg-[#07070F] overflow-hidden">
            {/* Sidebar */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)}
                isMinimized={isSidebarMinimized}
                onToggleMinimize={() => setIsSidebarMinimized(!isSidebarMinimized)}
            />

            {/* Main Wrapper */}
            <div className={`flex-1 flex flex-col min-w-0 relative transition-all duration-300 ${isSidebarMinimized ? 'lg:ml-20' : 'lg:ml-[19rem]'}`}>
                {/* TopBar */}
                <TopBar onOpenSidebar={() => setIsSidebarOpen(true)} />

                {/* Main Content Area */}
                <main className="flex-1 overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
