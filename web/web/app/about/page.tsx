'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import React from 'react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-6 md:px-12 flex flex-col justify-center min-h-[80vh]">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-black mb-6">About Walia</h1>
                    <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
                        Walia is an advanced AI-powered platform designed to provide students and researchers from the Mountains of Ethiopia with tools that scale understanding, spark curiosity, and build community. 
                        Inspired by the agility and resilience of the Walia Ibex, our platform is built for navigating the challenging terrains of academic success.
                    </p>
                    <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
                        Climb Higher. Think Smarter. Let's conquer the peak of knowledge together.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
