'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TiltCard from '@/components/TiltCard';
import { motion } from 'framer-motion';
import { Rocket, Target, Users, Globe, Shield, Zap } from 'lucide-react';
import React from 'react';

const stats = [
  { label: 'Active Learners', value: '50K+', icon: Users },
  { label: 'Study Sessions', value: '2M+', icon: Zap },
  { label: 'Global Reach', value: '45+', icon: Globe },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-[#0A0A18] overflow-hidden text-black dark:text-white">
            <Navbar />
            
            {/* Hero Section with 3D Text Reveal & Particles */}
            <div className="relative pt-40 pb-20 container mx-auto px-6 md:px-12 flex flex-col items-center justify-center min-h-[85vh]">
                <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center mask-image">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="w-[600px] h-[600px] bg-gradient-to-tr from-gray-200/60 to-transparent dark:from-white/10 rounded-full blur-[100px] absolute -top-[10%] -left-[5%]"
                    />
                </div>

                <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9]">
                            Beyond<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-black dark:from-gray-400 dark:to-white">
                                Boundaries.
                            </span>
                        </h1>
                    </motion.div>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                        className="text-gray-500 dark:text-gray-400 font-medium text-xl leading-relaxed max-w-2xl mx-auto"
                    >
                        Walia is an advanced AI-powered platform designed to provide students and researchers with tools that scale understanding, spark curiosity, and build community. Let's conquer the peak of knowledge together.
                    </motion.p>
                </div>
            </div>

            {/* 3D Floating Cards Section */}
            <div className="container mx-auto px-6 md:px-12 py-32 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <h2 className="text-5xl font-black tracking-tight">Our Mission</h2>
                        <TiltCard>
                            <div className="p-10 rounded-[32px] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-col h-full backdrop-blur-sm">
                                <Rocket className="w-12 h-12 mb-8 text-black dark:text-white transform transition-transform group-hover:-translate-y-2 group-hover:rotate-12" />
                                <h3 className="text-3xl font-bold mb-4">Empower Learners</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">Breaking down complex subjects into digestible, AI-powered study sessions structured beautifully and accessible from entirely anywhere in the world.</p>
                            </div>
                        </TiltCard>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8 md:mt-32"
                    >
                        <h2 className="text-5xl font-black tracking-tight">Our Vision</h2>
                        <TiltCard>
                            <div className="p-10 rounded-[32px] bg-black dark:bg-white text-white dark:text-black border border-gray-800 flex flex-col h-full shadow-2xl">
                                <Target className="w-12 h-12 mb-8 transform transition-transform group-hover:scale-110" />
                                <h3 className="text-3xl font-bold mb-4">Future of Education</h3>
                                <p className="text-white/60 dark:text-black/60 text-lg leading-relaxed">Creating a unified ecosystem where artificial intelligence seamlessly connects with human curiosity, paving the best paths for ultimate understanding.</p>
                            </div>
                        </TiltCard>
                    </motion.div>
                </div>
            </div>

            {/* Stats Section with Pop Animation */}
            <div className="container mx-auto px-6 md:px-12 py-32 border-t border-gray-100 dark:border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15, type: 'spring' }}
                            className="text-center p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10"
                        >
                            <div className="w-14 h-14 mx-auto bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <h4 className="text-5xl font-black tracking-tight mb-2">{stat.value}</h4>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}
