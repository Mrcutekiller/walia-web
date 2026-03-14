'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function AdminSettings() {
    const [maintenance, setMaintenance] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <h1 className="text-2xl font-bold">Admin Settings UI Removed</h1>
            <p className="text-white/50">System configuration backend logic remains available.</p>
            <div className="mt-8 p-6 bg-[#141415] border border-white/5 rounded-2xl flex items-center space-x-4">
                <span className="text-sm font-medium">Test Toggle Logic:</span>
                <div
                    onClick={() => setMaintenance(!maintenance)}
                    className={cn(
                        "w-14 h-7 rounded-full relative p-1 transition-all cursor-pointer",
                        maintenance ? "bg-red-500" : "bg-white/10"
                    )}
                >
                    <motion.div
                        animate={{ x: maintenance ? 28 : 0 }}
                        className="w-5 h-5 bg-white rounded-full shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
}
