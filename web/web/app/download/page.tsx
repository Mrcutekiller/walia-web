'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Download, Smartphone } from 'lucide-react';
import React from 'react';

export default function DownloadPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-6 md:px-12 flex flex-col justify-center min-h-[80vh]">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <div className="w-24 h-24 mx-auto rounded-3xl bg-black text-white flex items-center justify-center shadow-2xl mb-8 border border-gray-200">
                        <Smartphone className="w-10 h-10" />
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-black">Download Walia</h1>
                    <p className="text-gray-500 font-medium text-lg max-w-lg mx-auto">
                        Take your smartest AI study companion everywhere you go. Start learning efficiently from your Android device.
                    </p>
                    
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="/app-release.apk" download="Walia-Release.apk" className="px-10 py-5 rounded-2xl bg-black text-white font-bold text-lg hover:bg-zinc-800 transition-all flex items-center shadow-xl hover:-translate-y-1">
                            <Download className="w-6 h-6 mr-3" /> Get it for Android (APK)
                        </a>
                    </div>
                    
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-12">
                        Requires Android 8.0 or later
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
