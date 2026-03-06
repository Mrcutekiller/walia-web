'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    Cpu,
    Globe,
    Key,
    MonitorOff,
    RotateCcw,
    Save
} from 'lucide-react';
import { useState } from 'react';

export default function AdminSettings() {
    const [maintenance, setMaintenance] = useState(false);

    return (
        <div className="space-y-10 py-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tight">Global System</h1>
                    <p className="text-white/30 text-sm font-medium">Fine-tune platform parameters and security protocols.</p>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                        <RotateCcw className="w-4 h-4" />
                        <span>Discard Changes</span>
                    </button>
                    <button className="flex items-center space-x-2 px-8 py-3 rounded-2xl bg-walia-success text-black text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-walia-success/20">
                        <Save className="w-4 h-4" />
                        <span>Sync System</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Core Config */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Maintenance Card */}
                    <div className={cn(
                        "p-8 rounded-[40px] border transition-all duration-500",
                        maintenance ? "bg-red-500/10 border-red-500/20" : "bg-[#141415] border-white/5"
                    )}>
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center space-x-4">
                                <div className={cn(
                                    "p-3 rounded-2xl transition-all",
                                    maintenance ? "bg-red-500 text-white" : "bg-white/5 text-white/40"
                                )}>
                                    <MonitorOff className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-white tracking-tight">System Maintenance</h3>
                                    <p className="text-xs text-white/30 font-medium">Temporarily disable public access during updates.</p>
                                </div>
                            </div>
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

                        {maintenance && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="pt-6 border-t border-red-500/10 space-y-4"
                            >
                                <textarea
                                    placeholder="Maintenance message for users..."
                                    className="w-full bg-black/40 border border-red-500/20 rounded-2xl p-4 text-xs text-white outline-none placeholder:text-red-500/20"
                                    rows={3}
                                />
                                <div className="flex items-center space-x-2 text-red-500">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">WARNING: THIS AFFECTS ALL REGIONS</span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* AI & Infrastructure */}
                    <div className="p-8 rounded-[40px] bg-[#141415] border border-white/5 space-y-8">
                        <div className="flex items-center space-x-3">
                            <Cpu className="w-5 h-5 text-walia-success" />
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Engine Parameters</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { label: 'Daily AI Limit (Free)', value: '15 requests', type: 'Range', percent: 60 },
                                { label: 'Max Context Window', value: '128k Tokens', type: 'Range', percent: 85 },
                                { label: 'Concurrent Users', value: '5,000 Nodes', type: 'Range', percent: 40 },
                                { label: 'Security Handshake', value: 'Strict Phase', type: 'Toggle', active: true },
                            ].map((param) => (
                                <div key={param.label} className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{param.label}</p>
                                        <span className="text-[10px] font-black text-white">{param.value}</span>
                                    </div>
                                    {param.type === 'Range' ? (
                                        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                            <div className="h-full bg-walia-success" style={{ width: `${param.percent}%` }} />
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-10 h-5 bg-walia-success/20 rounded-full p-1">
                                                <div className="w-3 h-3 bg-walia-success rounded-full ml-auto" />
                                            </div>
                                            <span className="text-[9px] font-black text-walia-success">VERIFIED</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column - API & Nodes */}
                <div className="space-y-8">

                    <div className="p-8 rounded-[40px] bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/10 space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2.5 rounded-xl bg-blue-500 text-white">
                                <Key className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Endpoint Security</h3>
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: 'Gemini Master', status: 'Active', key: '••••••••••••••••' },
                                { name: 'Firebase Admin', status: 'Active', key: '••••••••••••••••' },
                                { name: 'Stripe Secret', status: 'Restricted', key: '••••••••••••••••' },
                            ].map((api) => (
                                <div key={api.name} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-blue-500/30 transition-all">
                                    <div>
                                        <p className="text-[10px] font-bold text-white/60 mb-1">{api.name}</p>
                                        <p className="text-[11px] font-mono text-white/20">{api.key}</p>
                                    </div>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        api.status === 'Active' ? "bg-walia-success shadow-[0_0_8px_rgba(46,213,115,0.4)]" : "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                                    )} />
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-3 rounded-xl bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 hover:text-white transition-all">
                            Regenerate Tokens
                        </button>
                    </div>

                    <div className="p-8 rounded-[40px] bg-gradient-to-br from-walia-success/10 to-transparent border border-walia-success/10 space-y-4">
                        <div className="flex items-center space-x-3">
                            <Globe className="w-4 h-4 text-walia-success" />
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Global CDN Propagation</h3>
                        </div>
                        <p className="text-[10px] text-white/30 font-medium">All edge nodes are synced with the latest build (v2.4.1).</p>
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-7 h-7 rounded-full border-2 border-[#141415] bg-white/5 flex items-center justify-center">
                                    <Globe className="w-3 h-3 text-white/20" />
                                </div>
                            ))}
                            <div className="w-7 h-7 rounded-full border-2 border-[#141415] bg-walia-success flex items-center justify-center text-[10px] font-black text-black">
                                +12
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
