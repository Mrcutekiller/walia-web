'use client';

import { useAuth } from '@/context/AuthContext';
import { QrCode, ScanLine, Sparkles } from 'lucide-react';

export default function IDCenterPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-6">
                <p className="text-gray-500 font-medium animate-pulse">Loading ID Center...</p>
            </div>
        );
    }

    const memberSinceYear = user?.metadata?.creationTime
        ? new Date(user.metadata.creationTime).getFullYear()
        : new Date().getFullYear();

    // Create a mock ID based on the user's UID (e.g., first 6 chars)
    const shortUid = user?.uid ? user.uid.substring(0, 6).toUpperCase() : '000000';
    const memberId = `ID-${memberSinceYear}-${shortUid}`;

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-black p-6 md:p-10 relative overflow-hidden">
            <div className="max-w-4xl mx-auto w-full relative z-10">

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tighter mb-4">ID Center</h1>
                    <p className="text-gray-500 font-medium text-lg">Your official Walia digital membership card.</p>
                </div>

                {/* ID Cards Container */}
                <div className="flex flex-col items-center justify-center py-10 perspective-[1000px]">
                    <div className="relative w-full max-w-[400px] h-[600px] group transform-style-3d md:-rotate-y-12 md:rotate-x-12 hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out">

                        {/* Bottom Card (Lavender/Purple Outline Accent) */}
                        <div className="absolute inset-0 top-6 left-6 -right-6 -bottom-6 bg-[#E9D5FF] dark:bg-[#4C1D95] rounded-[2.5rem] shadow-[-10px_-10px_30px_rgba(0,0,0,0.05)] transform translate-z-[-50px] transition-transform duration-500 overflow-hidden">
                            {/* Decorative background elements for back card */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 dark:bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                        </div>

                        {/* Top Card (Navy Blue) */}
                        <div className="absolute inset-0 bg-[#0F172A] rounded-[2.5rem] shadow-[20px_20px_60px_rgba(0,0,0,0.15),-20px_-20px_60px_rgba(255,255,255,0.8)] dark:shadow-[20px_20px_60px_rgba(0,0,0,0.5),-10px_-10px_30px_rgba(255,255,255,0.02)] border border-[#1E293B] overflow-hidden flex flex-col transform translate-z-0 transition-all duration-500 z-10">

                            {/* Textured "W" Background */}
                            <div className="absolute -left-16 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-5">
                                <span className="text-[500px] font-black leading-none text-white tracking-tighter mix-blend-overlay">W</span>
                            </div>

                            {/* Card Header: Walia Logo */}
                            <div className="p-8 flex justify-between items-start relative z-10 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/20">
                                        <Sparkles className="w-6 h-6 text-black" />
                                    </div>
                                    <span className="text-2xl font-black text-white tracking-widest uppercase">Walia</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[10px] uppercase tracking-widest text-[#94A3B8] font-bold mb-1">Status</span>
                                    <span className="px-3 py-1 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] text-[10px] font-black uppercase tracking-wider border border-[#38BDF8]/20 shadow-[0_0_10px_rgba(56,189,248,0.2)]">Premium</span>
                                </div>
                            </div>

                            {/* Card Body: User Info */}
                            <div className="flex-1 px-8 flex flex-col justify-center relative z-10">
                                <div className="flex items-end gap-6 mb-8">
                                    <div className="w-24 h-24 rounded-2xl bg-[#1E293B] border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-xl shrink-0 relative">
                                        {user?.photoURL ? (
                                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-3xl font-black text-white/50">{user?.displayName?.[0] || 'W'}</span>
                                        )}
                                        {/* Scanline effect over photo */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent w-full h-1/2 animate-[scan_2s_ease-in-out_infinite]" />
                                    </div>
                                    <div className="pb-1">
                                        <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none mb-2 break-all">{user?.displayName || 'Walia User'}</h2>
                                        <p className="text-[#94A3B8] text-sm font-medium tracking-wide">Member Since {memberSinceYear}</p>
                                    </div>
                                </div>

                                {/* ID Numbers Container */}
                                <div className="bg-black/20 rounded-2xl p-5 border border-white/5 backdrop-blur-md">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Walia ID Number</span>
                                        <QrCode className="w-4 h-4 text-[#94A3B8]" />
                                    </div>
                                    <p className="text-xl font-mono text-white tracking-[0.2em] font-bold">{memberId}</p>
                                </div>
                            </div>

                            {/* Card Footer: Barcode & URL */}
                            <div className="p-8 relative z-10 shrink-0 mt-auto">
                                <div className="h-12 w-full flex gap-1 items-center opacity-40 mb-4 mix-blend-screen">
                                    {/* Procedural Mock Barcode */}
                                    {[...Array(40)].map((_, i) => (
                                        <div key={i} className={`h-full bg-white rounded-full ${i % 3 === 0 ? 'w-2' : i % 5 === 0 ? 'w-[1px]' : 'w-1'}`} />
                                    ))}
                                </div>
                                <div className="flex justify-between items-center border-t border-white/10 pt-4">
                                    <div className="flex items-center gap-2">
                                        <ScanLine className="w-4 h-4 text-[#94A3B8]" />
                                        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Scan to verify</span>
                                    </div>
                                    <span className="text-xs font-bold text-white tracking-widest">WALIA.COM</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Print/Download Actions */}
                <div className="flex justify-center gap-4 mt-8">
                    <button className="px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl shadow-black/10 dark:shadow-white/10">
                        Download ID
                    </button>
                    <button className="px-8 py-4 rounded-full bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-gray-800 text-black dark:text-white font-black uppercase tracking-widest text-xs hover:border-black dark:hover:border-white transition-colors">
                        Add to Wallet
                    </button>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        </div>
    );
}
