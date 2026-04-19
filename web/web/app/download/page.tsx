'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TiltCard from '@/components/TiltCard';
import { motion } from 'framer-motion';
import { Download, Smartphone, Star, Orbit, ChevronRight } from 'lucide-react';
import React from 'react';

export default function DownloadPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-[#0A0A18] overflow-hidden text-black dark:text-white">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-center min-h-[90vh] gap-16 relative">
                
                {/* Left Side: Copy */}
                <div className="flex-1 space-y-10 relative z-10 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-xs font-black uppercase tracking-widest mb-8">
                            <Star className="w-4 h-4 text-[#FFD700] mr-2 fill-[#FFD700]" /> Version 1.0 Live
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                            Take <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-black dark:from-gray-400 dark:to-white">Walia</span><br/> Everywhere.
                        </h1>
                    </motion.div>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-gray-500 dark:text-gray-400 font-medium text-xl leading-relaxed max-w-lg mx-auto md:mx-0"
                    >
                        Your smartest AI study companion is now available for mobile. Analyze texts, generate tools, and track calendars efficiently from your Android device.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
                    >
                        <motion.a 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="/app-release.apk" 
                            download="Walia-Release.apk" 
                            className="px-10 py-5 rounded-[20px] bg-black dark:bg-white text-white dark:text-black font-black text-lg shadow-2xl flex items-center w-full sm:w-auto justify-center group"
                        >
                            <Download className="w-6 h-6 mr-3 transform group-hover:-translate-y-1 transition-transform" /> 
                            Download APK
                            <ChevronRight className="w-5 h-5 ml-2 opacity-50 group-hover:translate-x-1 transition-transform" />
                        </motion.a>
                    </motion.div>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]"
                    >
                        Requires Android 8.0+ · ~45MB
                    </motion.p>
                </div>

                {/* Right Side: 3D Phone Interactive Demo */}
                <div className="flex-1 w-full flex justify-center items-center relative perspective-[2000px]">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 1.2, type: 'spring', bounce: 0.4 }}
                    >
                        <TiltCard className="w-[300px] h-[600px] rounded-[40px] drop-shadow-2xl">
                            {/* Realistic Phone Bezel */}
                            <div className="w-full h-full rounded-[40px] bg-black p-2 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)] border-4 border-gray-800 relative z-10 overflow-hidden flex flex-col">
                                {/* Dynamic Island / Notch */}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30" />
                                
                                {/* Phone Screen Content */}
                                <div className="flex-1 bg-white dark:bg-[#0A0A18] rounded-[32px] overflow-hidden relative p-6 pt-16 flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-2xl bg-black dark:bg-white flex items-center justify-center mb-10 shadow-lg">
                                        <Smartphone className="w-8 h-8 text-white dark:text-black" />
                                    </div>
                                    <h3 className="text-2xl font-black text-center mb-4 text-black dark:text-white">Walia Mobile</h3>
                                    <div className="space-y-4 w-full">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-16 w-full rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse flex items-center px-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10" />
                                                <div className="ml-4 space-y-2 flex-1">
                                                    <div className="h-3 w-1/2 bg-gray-200 dark:bg-white/10 rounded-full" />
                                                    <div className="h-2 w-3/4 bg-gray-200 dark:bg-white/10 rounded-full" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-auto pb-4 pt-10">
                                        <div className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-sm w-full text-center">
                                            Scanning...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>

                    {/* Floating Orbits behind the phone */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40"
                    >
                        <div className="w-[400px] h-[400px] border border-dashed border-gray-300 dark:border-white/20 rounded-full" />
                    </motion.div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
