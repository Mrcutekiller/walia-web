'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import UserBadge from '@/components/UserBadge';
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    limit,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    addDoc,
    serverTimestamp,
    getDoc
} from 'firebase/firestore';
import {
    Heart,
    MessageCircle,
    Share2,
    TrendingUp,
    Send,
    Plus,
    Image as ImageIcon,
    Sparkles,
    CheckCircle2,
    Search,
    PartyPopper
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Post {
    id: string;
    authorId: string;
    content: string;
    createdAt: any;
    likes: string[];
    commentCount: number;
    type: 'general' | 'ai_share' | 'quiz' | 'note' | 'text';
    title?: string;
}

export default function CommunityPage() {
    const { user, profile } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
        const unsub = onSnapshot(q, (snap) => {
            const fetchedPosts = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
            setPosts(fetchedPosts);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleLike = async (post: Post) => {
        if (!user) return;
        const postRef = doc(db, 'posts', post.id);
        const isLiked = post.likes?.includes(user.uid);
        await updateDoc(postRef, {
            likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
        });
    };

    const handleCreatePost = async () => {
        if (!user || !newPost.trim()) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'posts'), {
                authorId: user.uid,
                content: newPost.trim(),
                createdAt: serverTimestamp(),
                likes: [],
                commentCount: 0,
                type: 'general',
            });
            setNewPost('');
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTimeAgo = (timestamp : any) => {
        if (!timestamp) return 'Just now';
        const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m";
        return Math.floor(seconds) + "s";
    };

    return (
        <div className="min-h-full bg-[#FAFAFA] dark:bg-[#0A101D] text-black dark:text-white pb-24">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 pt-8 md:pt-12">
                
                {/* ── LEFT SIDEBAR: User Info & Tags ── */}
                <aside className="lg:col-span-3 hidden lg:flex flex-col gap-6 sticky top-8 h-fit">
                    {/* User Mini Card */}
                    <div className="bg-white dark:bg-[#162032] rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 shadow-sm">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/10 mb-4 overflow-hidden shadow-inner border border-gray-100 dark:border-white/5">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl font-black text-gray-300">
                                        {profile?.name?.charAt(0) || 'W'}
                                    </div>
                                )}
                            </div>
                            <h3 className="font-black text-black dark:text-white truncate w-full">{profile?.name || 'Walia Student'}</h3>
                            <p className="text-xs font-bold text-gray-400 mt-0.5">@{profile?.username || 'user'}</p>
                            
                            <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                                <div>
                                    <p className="text-sm font-black text-black dark:text-white">{profile?.followersCount || 0}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Followers</p>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-black dark:text-white">{profile?.xp || 0}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">XP</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Mini */}
                    <div className="bg-white dark:bg-[#162032] rounded-[2rem] p-4 border border-gray-200 dark:border-white/5 shadow-sm space-y-1">
                        {[
                            { icon: TrendingUp, label: 'Trending', href: '#' },
                            { icon: Sparkles, label: 'For You', href: '#' },
                            { icon: MessageCircle, label: 'Groups', href: '#' },
                        ].map((item, i) => (
                            <Link key={i} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white font-bold text-sm transition-all group">
                                <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </aside>

                {/* ── MAIN FEED ── */}
                <main className="lg:col-span-6 space-y-6">
                    {/* Create Post Card */}
                    <div className="bg-white dark:bg-[#162032] rounded-[2.5rem] p-6 border border-gray-200 dark:border-white/5 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/10 shrink-0 overflow-hidden shadow-inner flex items-center justify-center border border-gray-100 dark:border-white/5">
                                {user?.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : <span className="text-xl font-black text-gray-300">?</span>}
                            </div>
                            <div className="flex-1">
                                <textarea 
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                    placeholder="What's happening in your studies?"
                                    className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium placeholder:text-gray-300 dark:placeholder:text-white/10 resize-none min-h-[100px] py-2"
                                />
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
                                    <div className="flex gap-2">
                                        <button className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center text-gray-400 transition-colors">
                                            <ImageIcon className="w-5 h-5" />
                                        </button>
                                        <button className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center text-gray-400 transition-colors">
                                            <Sparkles className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={handleCreatePost}
                                        disabled={!newPost.trim() || isSubmitting}
                                        className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Posts List */}
                    <div className="space-y-6">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-64 rounded-[2.5rem] bg-gray-100 dark:bg-white/5 animate-pulse" />
                            ))
                        ) : (
                            posts.map((post) => {
                                const isLiked = post.likes?.includes(user?.uid || '');
                                return (
                                    <motion.article 
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="bg-white dark:bg-[#162032] rounded-[2.5rem] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all relative overflow-hidden group"
                                    >
                                        {/* Optional Glow for special post types */}
                                        {post.type === 'ai_share' && (
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] pointer-events-none rounded-full" />
                                        )}

                                        <div className="flex items-center justify-between mb-6 relative z-10">
                                            <Link href={`/dashboard/profile/${post.authorId}`} className="group/author">
                                                <UserBadge uid={post.authorId} size="sm" className="hover:opacity-80 transition-opacity" />
                                            </Link>
                                            <p className="text-xs font-bold text-gray-400">{formatTimeAgo(post.createdAt)}</p>
                                        </div>

                                        <div className="mb-6 relative z-10">
                                            {post.type !== 'general' && (
                                                <span className={cn(
                                                    "inline-block px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-widest mb-4",
                                                    post.type === 'ai_share' ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400" :
                                                    post.type === 'quiz' ? "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 text-amber-600 dark:text-amber-400" :
                                                    "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500"
                                                )}>
                                                    {post.type.replace('_share', ' ✨')}
                                                </span>
                                            )}
                                            {post.title && <h3 className="text-xl font-black text-black dark:text-white mb-3 tracking-tight">{post.title}</h3>}
                                            <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">{post.content}</p>
                                        </div>

                                        {/* Interaction Bar */}
                                        <div className="flex items-center border-t border-gray-50 dark:border-white/5 pt-5 relative z-10">
                                            <div className="flex items-center space-x-6">
                                                <button 
                                                    onClick={() => handleLike(post)} 
                                                    className={cn('flex items-center gap-2 text-sm font-bold transition-all', isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500')}
                                                >
                                                    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center transition-colors', isLiked ? 'bg-red-50 dark:bg-red-500/10' : 'hover:bg-red-50 dark:hover:bg-red-500/10')}>
                                                        <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
                                                    </div>
                                                    <span>{post.likes?.length || 0}</span>
                                                </button>
                                                <Link href={`/dashboard/community/${post.id}`} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black dark:hover:text-white transition-all">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                        <MessageCircle className="w-4 h-4" />
                                                    </div>
                                                    <span>{post.commentCount || 0}</span>
                                                </Link>
                                            </div>
                                            <button className="w-10 h-10 ml-auto rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-105 transition-all">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.article>
                                );
                            })
                        )}
                    </div>
                </main>

                {/* ── RIGHT SIDEBAR: Trending ── */}
                <aside className="lg:col-span-3 hidden lg:flex flex-col gap-6 sticky top-8 h-fit">
                    <div className="bg-white dark:bg-[#162032] rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden relative">
                        {/* Abstract background shape */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-black tracking-tight">Trending</h3>
                        </div>

                        <ul className="space-y-6">
                            {[
                                { tag: '#FinalsPrep', posts: '2.4k students', color: 'text-indigo-500' },
                                { tag: '#AIHacks', posts: '1.8k posts', color: 'text-amber-500' },
                                { tag: '#StudySession', posts: '950 online', color: 'text-emerald-500' },
                                { tag: '#WaliaPro', posts: '420 winners', color: 'text-rose-500' }
                            ].map((item, i) => (
                                <li key={i} className="group cursor-pointer">
                                    <p className="text-sm font-black text-black dark:text-white group-hover:text-amber-500 transition-colors">{item.tag}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{item.posts}</p>
                                </li>
                            ))}
                        </ul>

                        <button className="w-full mt-8 py-3 rounded-2xl border-2 border-gray-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all">
                            View All Topics
                        </button>
                    </div>

                    {/* Pro CTA */}
                    <Link href="/dashboard/upgrade" className="group rounded-[2rem] p-6 bg-black text-white shadow-xl shadow-black/20 hover:scale-[1.02] transition-transform overflow-hidden relative">
                        <div className="relative z-10">
                            <PartyPopper className="w-8 h-8 text-amber-400 mb-4" />
                            <h4 className="text-lg font-black tracking-tight leading-tight">Join Walia Pro</h4>
                            <p className="text-white/50 text-xs font-bold mt-2">Get verified badges and priority AI tools.</p>
                        </div>
                        <div className="absolute -bottom-8 -right-8 opacity-20 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-24 h-24 text-white" />
                        </div>
                    </Link>
                </aside>

            </div>
        </div>
    );
}
