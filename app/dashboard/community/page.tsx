'use client';

import { cn } from '@/lib/utils';
import {
    FileText,
    Flame,
    Heart,
    HelpCircle,
    MessageCircle,
    MoreVertical,
    Share2,
    Sparkles,
    TrendingUp,
    User
} from 'lucide-react';

const mockPosts = [
    {
        id: '1',
        user: 'Abebe Kebe',
        username: '@abebe_k',
        time: '2 hours ago',
        type: 'ai_share',
        title: 'Solved: Physics Quantum Theory',
        content: 'Just finished a 2-hour AI session on Quantum Physics. Here is the summary of the Bohr model and wave-particle duality. Hope this helps anyone preparing for the final!',
        likes: 242,
        comments: 18,
        liked: true,
    },
    {
        id: '2',
        user: 'Sarah Solomon',
        username: '@sarah_s',
        time: '5 hours ago',
        type: 'quiz',
        title: 'Biology Prep Quiz: Cell Structure',
        content: 'Hey guys! I created a 10-question mock quiz on cell biology using the Walia Quiz Tool. Give it a try and share your score!',
        likes: 156,
        comments: 42,
        liked: false,
    },
    {
        id: '3',
        user: 'James Wilson',
        username: '@j_wilson',
        time: 'Yesterday',
        type: 'note',
        title: 'Computer Science: Algorithms',
        content: 'My notes on Big O notation and sorting algorithms. Clear and concise explanations with code snippets.',
        likes: 89,
        comments: 5,
        liked: false,
    },
];

export default function CommunityPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 animate-fade-in-up">

            {/* Feed Column */}
            <div className="lg:col-span-3 space-y-8">
                {/* Create Post */}
                <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-walia-primary/20 flex items-center justify-center font-bold text-walia-primary border border-walia-primary/30">
                            U
                        </div>
                        <input
                            type="text"
                            placeholder="Share a study session, quiz, or note with the community..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-walia-primary outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center space-x-2">
                            <button className="flex items-center px-4 py-2 rounded-xl bg-white/5 text-xs font-bold text-white/50 hover:text-white transition-all">
                                <Sparkles className="w-4 h-4 mr-2" /> AI Share
                            </button>
                            <button className="flex items-center px-4 py-2 rounded-xl bg-white/5 text-xs font-bold text-white/50 hover:text-white transition-all">
                                <HelpCircle className="w-4 h-4 mr-2" /> Quiz
                            </button>
                            <button className="flex items-center px-4 py-2 rounded-xl bg-white/5 text-xs font-bold text-white/50 hover:text-white transition-all">
                                <FileText className="w-4 h-4 mr-2" /> Note
                            </button>
                        </div>
                        <button className="px-10 py-3 rounded-2xl bg-walia-primary text-white text-sm font-black hover:bg-walia-secondary transition-all shadow-lg shadow-walia-primary/20">
                            Post
                        </button>
                    </div>
                </div>

                {/* Posts */}
                <div className="space-y-8">
                    {mockPosts.map((post) => (
                        <div key={post.id} className="p-10 rounded-[48px] bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 rounded-2xl bg-walia-primary/20 flex items-center justify-center font-bold text-walia-primary text-xl border border-walia-primary/20 group-hover:scale-110 transition-transform">
                                        {post.user.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white">{post.user}</h4>
                                        <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{post.username} • {post.time}</p>
                                    </div>
                                </div>
                                <button className="p-3 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 text-white/20 hover:text-white transition-all">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6 mb-10">
                                {post.type === 'ai_share' && (
                                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-walia-primary/10 border border-walia-primary/20 text-[10px] font-black uppercase text-walia-primary tracking-widest">
                                        <Sparkles className="w-3 h-3 mr-2" /> AI Generated Session
                                    </div>
                                )}
                                {post.type === 'quiz' && (
                                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-walia-accent/10 border border-walia-accent/20 text-[10px] font-black uppercase text-walia-accent tracking-widest">
                                        <HelpCircle className="w-3 h-3 mr-2" /> New Community Quiz
                                    </div>
                                )}
                                <h3 className="text-2xl font-black text-white group-hover:text-walia-primary transition-colors">{post.title}</h3>
                                <p className="text-white/50 text-base leading-relaxed font-medium">
                                    {post.content}
                                </p>
                            </div>

                            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <button className={cn(
                                        "flex items-center space-x-2 text-sm font-bold transition-all",
                                        post.liked ? "text-red-500" : "text-white/20 hover:text-white"
                                    )}>
                                        <Heart className={cn("w-5 h-5", post.liked && "fill-current animate-bounce-sm")} />
                                        <span>{post.likes}</span>
                                    </button>
                                    <button className="flex items-center space-x-2 text-sm font-bold text-white/20 hover:text-white transition-all">
                                        <MessageCircle className="w-5 h-5" />
                                        <span>{post.comments}</span>
                                    </button>
                                </div>
                                <button className="p-3 rounded-xl bg-white/5 text-white/30 hover:text-white transition-all">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar: Trends */}
            <div className="space-y-10">
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <TrendingUp className="w-5 h-5 mr-3 text-walia-primary" /> Trending Subjects
                    </h2>
                    <div className="space-y-3">
                        {['#Physics_Bohr', '#Cell_Biology', '#Macro_Theory', '#Algorithmic_Design'].map((tag, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 cursor-pointer transition-all group">
                                <p className="text-sm font-bold text-white/70 group-hover:text-walia-primary transition-colors">{tag}</p>
                                <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">1.2k+ shares this week</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 rounded-[40px] bg-gradient-to-br from-walia-accent/20 to-transparent border border-walia-accent/20 relative group overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 text-walia-accent/10 transition-transform group-hover:scale-150">
                        <Flame className="w-40 h-40" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-4 relative z-10">Walia Pro Community</h3>
                    <p className="text-white/40 text-xs leading-relaxed mb-8 relative z-10">
                        Join exclusive study circles and get mentorship from top-performing students worldwide.
                    </p>
                    <button className="relative z-10 w-full py-4 rounded-2xl bg-walia-accent text-white font-black text-xs uppercase tracking-widest hover:bg-opacity-90 shadow-lg shadow-walia-accent/20 transition-all">
                        View Groups
                    </button>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white">Top Contributors</h2>
                    <div className="flex flex-wrap gap-3">
                        {[1, 2, 3, 4, 5, 6].map((it) => (
                            <div key={it} className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center font-bold text-white/30 hover:border-walia-primary cursor-pointer transition-all">
                                <User className="w-5 h-5" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
