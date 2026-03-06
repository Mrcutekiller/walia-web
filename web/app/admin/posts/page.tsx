'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    Eye,
    MessageCircle,
    ThumbsUp,
    Trash2
} from 'lucide-react';
import { useState } from 'react';

const mockPosts = [
    { id: '1', author: 'Biruk A.', content: 'Just finished my first AI study session! This tool is incredible.', type: 'Success', status: 'Approved', likes: 24, comments: 5, time: '2h ago' },
    { id: '2', author: 'Anonymous', content: 'Anyone has notes for Advanced Calculus? I really need them for my finals.', type: 'Question', status: 'Pending', likes: 0, comments: 2, time: '4h ago' },
    { id: '3', author: 'Sarah M.', content: 'Check out this cool prompt I used to generate a study plan! [Link]', type: 'Sharing', status: 'Reported', likes: 12, comments: 8, time: '1d ago' },
    { id: '4', author: 'John Doe', content: 'SPAM SPAM SPAM buy this now!!!', type: 'Spam', status: 'Pending', likes: 0, comments: 0, time: '5m ago' },
    { id: '5', author: 'Emma W.', content: 'Walia AI really helped me understand quantum physics concepts better.', type: 'Feedback', status: 'Approved', likes: 45, comments: 12, time: '3h ago' },
];

export default function AdminPosts() {
    const [filter, setFilter] = useState('All');

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tight">Content Moderation</h1>
                    <p className="text-white/30 text-sm font-medium">Monitor community interactions and maintain platform standards.</p>
                </div>

                <div className="flex items-center space-x-2">
                    {['All', 'Pending', 'Reported', 'Approved'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === f ? "bg-white text-black" : "bg-white/5 text-white/40 hover:text-white"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPosts.filter(p => filter === 'All' || p.status === filter).map((post, i) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-6 rounded-[32px] bg-[#141415] border border-white/5 flex flex-col justify-between group hover:border-white/10 transition-all"
                    >
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-black text-[10px] group-hover:bg-walia-success group-hover:text-black transition-all">
                                        {post.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white group-hover:text-walia-success transition-all">{post.author}</p>
                                        <p className="text-[9px] text-white/30 font-medium">{post.time}</p>
                                    </div>
                                </div>

                                <div className={cn(
                                    "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest",
                                    post.status === 'Approved' ? "bg-walia-success/10 text-walia-success" :
                                        post.status === 'Reported' ? "bg-red-500/10 text-red-500" :
                                            "bg-orange-500/10 text-orange-500"
                                )}>
                                    {post.status}
                                </div>
                            </div>

                            <p className="text-sm text-white/70 leading-relaxed font-medium line-clamp-3 italic">
                                "{post.content}"
                            </p>

                            <div className="flex items-center space-x-4 pt-2 border-t border-white/5">
                                <div className="flex items-center space-x-1 text-white/20">
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold">{post.likes}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-white/20">
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold">{post.comments}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="flex-1 py-2.5 rounded-xl bg-walia-success text-black text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                                Approve
                            </button>
                            <button className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all">
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State Mockup */}
            {mockPosts.filter(p => filter === 'All' || p.status === filter).length === 0 && (
                <div className="h-64 rounded-[32px] border border-dashed border-white/10 flex flex-col items-center justify-center space-y-4">
                    <CheckCircle className="w-12 h-12 text-walia-success/20" />
                    <p className="text-xs font-bold text-white/20 uppercase tracking-widest">No pending items in queue</p>
                </div>
            )}
        </div>
    );
}
