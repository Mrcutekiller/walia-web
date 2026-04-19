'use client';

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React from "react";

export default function TiltCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileTap={{ scale: 0.98 }}
            className={`relative group ${className}`}
        >
            <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }} className="w-full h-full relative z-10 transition-shadow duration-500 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-3xl">
                {children}
            </div>
            
            {/* Glow effect matching the tilt */}
            <div 
                style={{ transform: "translateZ(-20px)" }} 
                className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-white/10 dark:to-white/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
            />
        </motion.div>
    );
}
