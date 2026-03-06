'use client';

import AdminStatCard from '@/components/AdminStatCard';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    BarChart3,
    CreditCard,
    Globe,
    Image as ImageIcon,
    LucideIcon,
    MessageSquare,
    UserCheck,
    UserPlus,
    Users,
    Zap
} from 'lucide-react';

interface StatItem {
    title: string;
    value: string;
    change: number;
    icon: LucideIcon;
    color: 'success' | 'blue' | 'purple' | 'orange';
}

const stats: StatItem[] = [
    { title: 'Total Profiles', value: '12,456', change: 12.5, icon: Users, color: 'success' },
    { title: 'Active Users', value: '8,230', change: 4.2, icon: UserCheck, color: 'blue' },
    { title: 'New This Week', value: '+450', change: 18.2, icon: UserPlus, color: 'purple' },
    { title: 'Total Revenue', value: '$45,200', change: 22.1, icon: CreditCard, color: 'orange' },
];

const mockGrowthData = [
    { month: 'Jan', value: 40 },
    { month: 'Feb', value: 35 },
    { month: 'Mar', value: 55 },
    { month: 'Apr', value: 45 },
    { month: 'May', value: 70 },
    { month: 'Jun', value: 65 },
];

const mockCategories = [
    { name: 'Free Users', value: '65%', color: 'bg-walia-success' },
    { name: 'Pro Users', value: '25%', color: 'bg-blue-500' },
    { name: 'Enterprise', value: '10%', color: 'bg-purple-500' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-10 py-6">
            {/* Greeting & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-1"
                >
                    <h1 className="text-3xl font-black text-white tracking-tight">System Overview</h1>
                    <p className="text-white/30 text-sm font-medium">Monitoring application health and growth.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-3"
                >
                    <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5 flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-walia-success animate-pulse" />
                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Live System</span>
                    </div>
                </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <AdminStatCard key={stat.title} {...stat} index={i} />
                ))}
            </div>

            {/* Charts & Detailed Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Growth Chart (Mockup) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 p-8 rounded-[32px] bg-[#141415] border border-white/5 relative overflow-hidden group"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-sm font-bold text-white tracking-tight">User Acquisition</h3>
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.1em] mt-1 font-semibold">Weekly Growth Rate</p>
                        </div>
                        <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white">
                            <BarChart3 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Simple Bar Chart Visualization */}
                    <div className="flex items-end justify-between h-48 gap-3 md:gap-6 px-2">
                        {mockGrowthData.map((d, i) => (
                            <div key={d.month} className="flex-1 flex flex-col items-center group/bar">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${d.value}%` }}
                                    transition={{ duration: 1, delay: 0.6 + (i * 0.1), ease: "easeOut" }}
                                    className={cn(
                                        "w-full max-w-[40px] rounded-2xl relative transition-all duration-300",
                                        i === mockGrowthData.length - 1 ? "bg-walia-success" : "bg-white/5 group-hover/bar:bg-white/10"
                                    )}
                                >
                                    {i === mockGrowthData.length - 1 && (
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-2 py-1 rounded-lg">
                                            {d.value}%
                                        </div>
                                    )}
                                </motion.div>
                                <span className="mt-4 text-[10px] font-bold text-white/20 group-hover/bar:text-white/40 transition-colors uppercase tracking-widest">{d.month}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Distribution / Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-8 rounded-[32px] bg-[#141415] border border-white/5 flex flex-col justify-between"
                >
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white tracking-tight">Plan Distribution</h3>
                        <p className="text-[10px] text-white/30 uppercase font-semibold tracking-widest">Segments</p>
                    </div>

                    {/* Circular Mockup (CSS only) */}
                    <div className="relative w-40 h-40 mx-auto my-8">
                        <div className="absolute inset-0 rounded-full border-[10px] border-white/5" />
                        <div className="absolute inset-0 rounded-full border-[10px] border-walia-success border-t-transparent border-l-transparent -rotate-45" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-white">82%</span>
                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">Retention</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {mockCategories.map((cat) => (
                            <div key={cat.name} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={cn("w-2 h-2 rounded-full", cat.color)} />
                                    <span className="text-xs font-semibold text-white/60">{cat.name}</span>
                                </div>
                                <span className="text-xs font-black text-white">{cat.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>

            {/* Quick Actions / Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Pending Actions */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="p-6 rounded-[28px] bg-white/5 border border-white/5 space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Recent Alerts</h4>
                        <span className="px-2 py-0.5 rounded-lg bg-red-500/10 text-red-500 text-[10px] font-black">4 NEW</span>
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: 'Image Approval', count: 12, icon: ImageIcon, color: 'text-orange-400' },
                            { label: 'Reported Posts', count: 2, icon: MessageSquare, color: 'text-red-400' },
                            { label: 'New Pro Subs', count: 45, icon: Zap, color: 'text-walia-success' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between p-3 rounded-2xl bg-black/20 border border-white/5 group hover:border-white/10 transition-all cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <item.icon className={cn("w-4 h-4", item.color)} />
                                    <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">{item.label}</span>
                                </div>
                                <span className="text-xs font-black text-white">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* System Health */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="p-6 rounded-[28px] bg-walia-success/5 border border-walia-success/10 space-y-6 lg:col-span-2"
                >
                    <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-walia-success" />
                        <h4 className="text-xs font-black uppercase tracking-widest text-walia-success/60">Server Global Nodes</h4>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: 'US-East', status: 'Optimal', ping: '24ms' },
                            { name: 'EU-West', status: 'Optimal', ping: '18ms' },
                            { name: 'Asia-South', status: 'Stable', ping: '84ms' },
                            { name: 'Backup-Node', status: 'Standby', ping: '-' },
                        ].map((node) => (
                            <div key={node.name} className="space-y-2">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{node.name}</p>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-sm font-black text-white">{node.status}</span>
                                    <span className="text-[9px] text-walia-success/40">{node.ping}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-4 rounded-2xl bg-walia-success text-black text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-walia-success/20 flex items-center justify-center space-x-2">
                        <span>Execute Full System Sync</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </motion.div>

            </div>
        </div>
    );
}
