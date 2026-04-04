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
    getDoc,
    increment
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
    PartyPopper,
    MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

interface Post {
    id: string;
    authorId: string;
    content: string;
    createdAt: any;
    likes: string[];
    commentCount: number;
    type: 'general' | 'ai_share' | 'quiz' | 'note' | 'text';
    title?: string;
    tags?: string[];
    isAdminPost?: boolean;
}

function CommunityContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState(searchParams.get('initialText') || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAdminPost, setIsAdminPost] = useState(false);

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
        const isLiked = post.likes?.includes(user.id);
        await updateDoc(postRef, {
            likes: isLiked ? arrayRemove(user.id) : arrayUnion(user.id)
        });
    };

    const handleCreatePost = async () => {
        if (!user || !newPost.trim()) return;
        setIsSubmitting(true);
        try {
            // Extract hashtags using basic regex (e.g. #FinalsPrep)
            // match returns array or null, default to empty array
            const extractedTags = newPost.match(/#\w+/g) || [];

            await addDoc(collection(db, 'posts'), {
                authorId: user.id,
                content: newPost.trim(),
                createdAt: serverTimestamp(),
                likes: [],
                commentCount: 0,
                type: 'general',
                tags: extractedTags,
                isAdminPost: user?.isAdmin ? isAdminPost : false,
            });
            // Reward Tokens
            try {
                await updateDoc(doc(db, 'users', user.id), {
                    tokensUsed: increment(-10)
                });
                alert("🎉 Bonus Tokens! You earned +10 tokens for posting.");
            } catch (e) {
                console.error("Token reward failed", e);
            }
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

    const renderTextWithHashtags = (text: string) => {
        if (!text) return null;
        const words = text.split(/(\s+)/);
        return words.map((word, index) => {
            if (word.match(/^#\w+/)) {
                return <span key={index} className="text-amber-500 font-bold hover:underline cursor-pointer">{word}</span>;
            }
            return <span key={index}>{word}</span>;
        });
    };

    return (
        <div className="flex-1 overflow-y-auto premium-scrollbar min-h-screen">
            <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-0">
                
                {/* ── LEFT FEED FILTERS ── */}
                <aside className="col-span-3 hidden lg:block py-10 px-8">
                    <div className="sticky top-10 flex flex-col gap-8">
                        <div className="space-y-1">
                            <h3 className="px-3 text-[10px] font-extrabold text-[var(--color-outline)] uppercase tracking-[0.15em] mb-3 font-[family-name:var(--font-manrope)]">Discovery</h3>
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-[var(--color-surface-container)] text-[var(--color-primary)] rounded-lg text-sm font-bold tracking-tight font-[family-name:var(--font-manrope)]">
                                <TrendingUp className="w-5 h-5 flex-shrink-0" />
                                Trending
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[var(--color-secondary)] hover:bg-[var(--color-surface-container)]/50 rounded-lg text-sm font-medium transition-all font-[family-name:var(--font-manrope)]">
                                <Sparkles className="w-5 h-5 flex-shrink-0" />
                                For You
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[var(--color-secondary)] hover:bg-[var(--color-surface-container)]/50 rounded-lg text-sm font-medium transition-all font-[family-name:var(--font-manrope)]">
                                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                                Groups
                            </button>
                        </div>
                        <div className="space-y-4">
                            <h3 className="px-3 text-[10px] font-extrabold text-[var(--color-outline)] uppercase tracking-[0.15em] font-[family-name:var(--font-manrope)]">Live Pulse</h3>
                            <div className="p-4 bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-outline)]/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="relative flex h-2 w-2 flex-shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-tertiary)] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-tertiary)]"></span>
                                    </span>
                                    <span className="text-[11px] font-bold uppercase tracking-tight font-[family-name:var(--font-manrope)]">New Discussion</span>
                                </div>
                                <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed font-medium">Join the live study session starting in 15 mins.</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ── CENTER FEED ── */}
                <section className="col-span-12 xl:col-span-6 lg:col-span-9 border-x border-[var(--color-outline)]/10 min-h-screen bg-[var(--color-surface-container-lowest)]">
                    {/* Top Bar (Mobile/Tablet visible) */}
                    <div className="sticky top-0 z-10 bg-[var(--color-surface-container-lowest)]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-[var(--color-outline)]/10">
                        <h2 className="text-lg font-bold font-[family-name:var(--font-manrope)] tracking-tight">Community Feed</h2>
                        <div className="xl:hidden text-[var(--color-outline)]">
                            <Search className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Post Composer */}
                    <div className="p-6 border-b border-[var(--color-outline)]/10 bg-[var(--color-surface-container-low)]/30">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-surface-container)] shrink-0 flex items-center justify-center">
                                {user?.photoURL ? <img src={user.photoURL} alt="User" className="w-full h-full object-cover grayscale contrast-125" /> : <span className="font-bold text-[var(--color-outline-variant)] uppercase">{user?.name?.charAt(0) || 'U'}</span>}
                            </div>
                            <div className="flex-1">
                                <textarea 
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                    className="w-full bg-transparent border-none focus:ring-0 text-[var(--color-on-surface)] placeholder-[var(--color-outline)] text-lg resize-none min-h-[50px] p-0 font-medium leading-tight font-[family-name:var(--font-inter)]" 
                                    placeholder="What's happening in the lab?"
                                />
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex gap-1 text-[var(--color-secondary)]">
                                        <button className="p-2 hover:bg-[var(--color-surface-container)] rounded-full transition-colors"><ImageIcon className="w-5 h-5 text-[var(--color-secondary)]" /></button>
                                        <button className="p-2 hover:bg-[var(--color-surface-container)] rounded-full transition-colors"><Sparkles className="w-5 h-5 text-[var(--color-secondary)]" /></button>
                                        {user?.isAdmin && (
                                            <label className="flex items-center gap-2 text-xs font-bold ml-2 cursor-pointer text-[var(--color-tertiary)] bg-[var(--color-tertiary-container)]/50 px-3 py-1.5 rounded-full">
                                                <input type="checkbox" checked={isAdminPost} onChange={(e) => setIsAdminPost(e.target.checked)} className="rounded border-[var(--color-tertiary)] bg-[var(--color-surface-container-lowest)] text-[var(--color-tertiary)] focus:ring-[var(--color-tertiary)] focus:ring-offset-0 w-3 h-3" />
                                                Official
                                            </label>
                                        )}
                                    </div>
                                    <button 
                                        onClick={handleCreatePost}
                                        disabled={!newPost.trim() || isSubmitting}
                                        className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-6 py-2 rounded-full text-sm font-bold tracking-tight hover:opacity-90 active:scale-95 transition-all font-[family-name:var(--font-manrope)] disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feed Posts List */}
                    <div className="divide-y divide-[var(--color-outline)]/5 pb-24">
                        {loading ? (
                            <div className="p-8 text-center text-[var(--color-outline)] font-medium text-sm">Loading feed...</div>
                        ) : (
                            posts.map((post) => {
                                const isLiked = post.likes?.includes(user?.id || '');
                                return (
                                    <article key={post.id} className={cn("p-6 transition-colors hover:bg-[var(--color-surface-container-low)]/20", post.isAdminPost && "bg-[var(--color-tertiary-container)]/10")}>
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 shrink-0 flex justify-center mt-1">
                                                <UserBadge uid={post.authorId} size="md" className="grayscale contrast-125" />
                                            </div>
                                            <div className="flex-1 space-y-3 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <span className="font-bold font-[family-name:var(--font-manrope)] text-sm tracking-tight truncate">User {post.authorId.substring(0, 4)}</span>
                                                        <span className="text-xs text-[var(--color-outline)] font-medium shrink-0">• {formatTimeAgo(post.createdAt)}</span>
                                                        {post.isAdminPost && <span className="bg-[var(--color-tertiary)] text-[var(--color-on-primary)] text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest shrink-0">Admin</span>}
                                                    </div>
                                                </div>
                                                
                                                {/* Text Content */}
                                                <p className="text-[15px] leading-relaxed text-[var(--color-on-surface)] font-medium whitespace-pre-wrap break-words">
                                                    {post.title && <span className="block font-bold mb-2 font-[family-name:var(--font-manrope)]">{post.title}</span>}
                                                    {renderTextWithHashtags(post.content)}
                                                </p>

                                                {/* AI Output / Special Format Content */}
                                                {post.type !== 'general' && (
                                                    <div className={cn("p-4 rounded-2xl border-none mt-3", post.type === 'ai_share' ? "bg-[var(--color-tertiary-container)]/20" : "bg-[var(--color-surface-container)]")}>
                                                        <div className={cn("flex items-center gap-2 mb-1.5", post.type === 'ai_share' ? "text-[var(--color-tertiary)]" : "text-[var(--color-primary)]")}>
                                                            <Sparkles className="w-3.5 h-3.5" />
                                                            <span className="text-[9px] font-extrabold uppercase tracking-[0.1em]">{post.type.replace('_share', ' Insight')}</span>
                                                        </div>
                                                        <p className={cn("text-[12px] leading-normal font-medium", post.type === 'ai_share' ? "text-[var(--color-tertiary)]/90" : "text-[var(--color-on-surface-variant)]")}>
                                                            This post was generated or shared from a specific tool context.
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Interaction Bar */}
                                                <div className="flex items-center justify-between max-w-sm pt-2 text-[var(--color-outline)] font-semibold">
                                                    <Link href={`/dashboard/community/${post.id}`} className="flex items-center gap-1.5 hover:text-blue-500 transition-colors text-xs font-[family-name:var(--font-inter)]">
                                                        <MessageCircle className="w-[18px] h-[18px]" /> {post.commentCount || 0}
                                                    </Link>
                                                    <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors text-xs">
                                                        <TrendingUp className="w-[18px] h-[18px]" />
                                                    </button>
                                                    <button onClick={() => handleLike(post)} className={cn("flex items-center gap-1.5 transition-colors text-xs", isLiked ? "text-red-500" : "hover:text-red-500")}>
                                                        <Heart className={cn("w-[18px] h-[18px]", isLiked && "fill-current")} /> {post.likes?.length || 0}
                                                    </button>
                                                    <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors text-xs">
                                                        <Share2 className="w-[18px] h-[18px]" />
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </article>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* ── RIGHT CONTEXT ── */}
                <aside className="col-span-3 hidden xl:block py-10 px-8">
                    <div className="sticky top-10 space-y-6">
                        {/* Search */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors w-[18px] h-[18px]" />
                            <input type="text" className="w-full pl-11 pr-4 py-2.5 bg-[var(--color-surface-container)] border-none rounded-full text-sm placeholder:text-[var(--color-outline)] font-medium focus:ring-0 focus:bg-[var(--color-surface-container-low)] transition-all font-[family-name:var(--font-inter)] text-[var(--color-on-surface)]" placeholder="Search Community" />
                        </div>
                        
                        {/* Premium Tonal Block */}
                        <div className="bg-[var(--color-primary)] p-6 rounded-3xl relative overflow-hidden text-[var(--color-on-primary)] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]">
                            <div className="absolute -right-6 -top-6 w-32 h-32 bg-[var(--color-surface-container-lowest)] opacity-5 rounded-full blur-3xl"></div>
                            <h3 className="text-xl font-bold font-[family-name:var(--font-manrope)] mb-2 leading-tight">Elevate your study game.</h3>
                            <p className="text-[var(--color-on-primary)]/70 text-xs mb-6 leading-relaxed font-medium font-[family-name:var(--font-inter)]">Get advanced AI analysis, unlimited cloud storage, and priority support.</p>
                            <Link href="/dashboard/upgrade" className="block text-center w-full py-3 bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)] rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-[0.98] transition-all font-[family-name:var(--font-manrope)]">
                                Join Walia Pro
                            </Link>
                        </div>
                        
                        {/* Trending Topics */}
                        <div className="bg-[var(--color-surface-container-low)] rounded-3xl p-6">
                            <h3 className="text-sm font-bold font-[family-name:var(--font-manrope)] mb-5 px-1 tracking-tight text-[var(--color-on-surface)]">Trending Topics</h3>
                            <div className="space-y-5">
                                {[
                                    { cat: 'Academics', title: '#FinalsPrep', stat: '2.4k Posts' },
                                    { cat: 'Technology', title: '#AIHacks', stat: '12.1k Posts' },
                                    { cat: 'Community', title: '#WaliaMeetup', stat: '840 Posts' }
                                ].map((t, idx) => (
                                    <div key={idx} className="px-1 group cursor-pointer">
                                        <p className="text-[9px] text-[var(--color-outline)] font-extrabold uppercase tracking-widest mb-1 font-[family-name:var(--font-inter)]">{t.cat}</p>
                                        <h4 className="text-[13px] font-bold text-[var(--color-on-surface)] group-hover:underline font-[family-name:var(--font-manrope)]">{t.title}</h4>
                                        <p className="text-[10px] text-[var(--color-outline-variant)] font-semibold font-[family-name:var(--font-inter)]">{t.stat}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-6 text-[11px] font-bold text-[var(--color-primary)] hover:opacity-70 px-1 font-[family-name:var(--font-inter)]">Show more</button>
                        </div>

                        {/* Footer */}
                        <footer className="px-1 flex flex-wrap gap-x-3 gap-y-1 opacity-40">
                            {['Privacy', 'Terms', 'Cookies', 'Advertising'].map(link => (
                                <a key={link} href="#" className="text-[10px] text-[var(--color-on-surface)] font-semibold hover:underline font-[family-name:var(--font-inter)]">{link}</a>
                            ))}
                            <p className="text-[10px] text-[var(--color-on-surface)] font-semibold w-full mt-2 font-[family-name:var(--font-inter)]">© {new Date().getFullYear()} Walia AI Inc.</p>
                        </footer>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default function CommunityPage() {
    return (
        <Suspense fallback={<div>Loading Community...</div>}>
            <CommunityContent />
        </Suspense>
    );
}
