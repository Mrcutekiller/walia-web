'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    Check,
    Download,
    Filter,
    Grid,
    Image as ImageIcon,
    List,
    MoreVertical,
    Search,
    Upload,
    X
} from 'lucide-react';
import { useState } from 'react';

const mockImages = [
    { id: '1', title: 'Study Hub Banner', type: 'System', status: 'Approved', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&h=300&auto=format&fit=crop', size: '1.2 MB', date: '2024-03-01' },
    { id: '2', title: 'AI Avatar Concept', type: 'System', status: 'Approved', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400&h=300&auto=format&fit=crop', size: '2.4 MB', date: '2024-03-02' },
    { id: '3', title: 'User Upload #452', type: 'User', status: 'Pending', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400&h=300&auto=format&fit=crop', size: '0.8 MB', date: '2024-03-06' },
    { id: '4', title: 'Walia Logo Dark', type: 'System', status: 'Approved', url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400&h=300&auto=format&fit=crop', size: '0.5 MB', date: '2024-02-15' },
    { id: '5', title: 'User Upload #453', type: 'User', status: 'Rejected', url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=400&h=300&auto=format&fit=crop', size: '1.5 MB', date: '2024-03-05' },
    { id: '6', title: 'Study Tips Infographic', type: 'Asset', status: 'Pending', url: 'https://images.unsplash.com/photo-1454165833267-0303837cfba4?q=80&w=400&h=300&auto=format&fit=crop', size: '3.1 MB', date: '2024-03-06' },
];

export default function AdminImages() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tight">Visual Assets</h1>
                    <p className="text-white/30 text-sm font-medium">Control the imagery and branding across all platforms.</p>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-walia-success text-black text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-walia-success/20">
                        <Upload className="w-4 h-4" />
                        <span>Upload New</span>
                    </button>
                </div>
            </div>

            {/* toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-[28px] bg-white/5 border border-white/5">
                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-walia-success transition-colors" />
                        <input
                            type="text"
                            placeholder="Tag search..."
                            className="bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-[11px] text-white placeholder:text-white/20 outline-none focus:border-walia-success/20 transition-all w-full md:w-48 font-bold"
                        />
                    </div>
                    <button className="p-2 rounded-xl bg-black/20 text-white/40 hover:text-white transition-all">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/5">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white/10 text-white" : "text-white/20 hover:text-white")}
                    >
                        <Grid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white/10 text-white" : "text-white/20 hover:text-white")}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockImages.map((img, i) => (
                    <motion.div
                        key={img.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group relative overflow-hidden rounded-[32px] bg-[#141415] border border-white/5 hover:border-walia-success/30 transition-all duration-500"
                    >
                        {/* Status Badge */}
                        <div className={cn(
                            "absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-md border",
                            img.status === 'Approved' ? "bg-walia-success/20 text-walia-success border-walia-success/20" :
                                img.status === 'Rejected' ? "bg-red-500/20 text-red-500 border-red-500/20" :
                                    "bg-orange-500/20 text-orange-500 border-orange-500/20"
                        )}>
                            {img.status}
                        </div>

                        {/* Image Thumb */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <img
                                src={img.url}
                                alt={img.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                                <button className="p-3 rounded-full bg-walia-success text-black hover:scale-110 active:scale-95 transition-all">
                                    <Check className="w-5 h-5" />
                                </button>
                                <button className="p-3 rounded-full bg-red-500 text-white hover:scale-110 active:scale-95 transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-5 space-y-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xs font-bold text-white tracking-tight truncate max-w-[140px]">{img.title}</h3>
                                    <p className="text-[9px] text-white/30 font-medium uppercase tracking-widest mt-1">{img.type} Item</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-white/60">{img.size}</p>
                                    <p className="text-[8px] text-white/20 mt-1">{img.date}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <button className="text-[10px] font-black text-white/20 hover:text-walia-success transition-colors uppercase tracking-[0.1em] flex items-center space-x-1.5">
                                    <Download className="w-3 h-3" />
                                    <span>Download</span>
                                </button>
                                <button className="text-white/20 hover:text-white transition-colors">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Storage Metric */}
            <div className="p-8 rounded-[40px] bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white/20" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-white tracking-tight leading-none mb-2">Cloud Infrastructure</h4>
                        <p className="text-xs text-white/30 font-medium">84.2 GB of 1 TB storage utilized across all nodes.</p>
                    </div>
                </div>

                <div className="w-full md:w-64 space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        <span>Efficiency</span>
                        <span>8.4%</span>
                    </div>
                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '8.4%' }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-full bg-walia-success shadow-[0_0_15px_rgba(46,213,115,0.4)]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
