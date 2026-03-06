'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';

interface AdminStatCardProps {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon: LucideIcon;
    color?: 'success' | 'blue' | 'purple' | 'orange';
    index?: number;
}

export default function AdminStatCard({
    title,
    value,
    change,
    changeLabel,
    icon: Icon,
    color = 'success',
    index = 0
}: AdminStatCardProps) {
    const isPositive = change && change > 0;

    const colorVariants = {
        success: 'bg-walia-success/10 text-walia-success border-walia-success/20 shadow-[0_4px_20px_-4px_rgba(46,213,115,0.1)]',
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.1)]',
        purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.1)]',
        orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_4px_20px_-4px_rgba(249,115,22,0.1)]',
    };

    const iconColorVariants = {
        success: 'bg-walia-success text-black',
        blue: 'bg-blue-500 text-white',
        purple: 'bg-purple-500 text-white',
        orange: 'bg-orange-500 text-white',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative p-6 rounded-3xl bg-[#141415] border border-white/5 hover:border-white/10 transition-all duration-300"
        >
            <div className="flex items-start justify-between mb-6">
                <div className={cn("p-2.5 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg", iconColorVariants[color])}>
                    <Icon className="w-5 h-5" />
                </div>

                {change !== undefined && (
                    <div className={cn(
                        "flex items-center px-2 py-1 rounded-lg text-[10px] font-bold tracking-tight",
                        isPositive ? "bg-walia-success/10 text-walia-success" : "bg-red-500/10 text-red-500"
                    )}>
                        {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {isPositive ? '+' : ''}{change}%
                    </div>
                )}
            </div>

            <div className="space-y-1.5">
                <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.15em]">{title}</h3>
                <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-white tracking-tight">{value}</span>
                    {changeLabel && <span className="text-[10px] font-medium text-white/20 whitespace-nowrap">{changeLabel}</span>}
                </div>
            </div>

            {/* Subtle background glow */}
            <div className={cn(
                "absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 -z-10",
                color === 'success' ? 'bg-walia-success' :
                    color === 'blue' ? 'bg-blue-500' :
                        color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'
            )} />
        </motion.div>
    );
}
