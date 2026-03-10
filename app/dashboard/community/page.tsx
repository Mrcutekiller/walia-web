'use client';

import UserBadge from '@/components/UserBadge';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { cn, formatTimeAgo } from '@/lib/utils';
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import {
    FileText,
    Heart,
    HelpCircle,
    MessageCircle,
    MoreHorizontal,
    Plus,
    Share2,
    Trash2,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Post {
    id: string;
    authorId: string;
    title: string;
    content: string;
    type: 'ai_share' | 'quiz' | 'note' | 'general';
    likes: string[];
    commentCount: number;
    createdAt: any;
}

export default function CommunityPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [postInput, setPostInput] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postType, setPostType] = useState<'ai_share' | 'quiz' | 'note' | 'general'>('general');
    const [isPosting, setIsPosting] = useState(false);
    const [showNewPost, setShowNewPost] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
        const unsub = onSnapshot(q, (snap) => {
            setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
        });
        return () => unsub();
    }, []);

    const handleCreatePost = async () => {
        if (!postInput.trim() || !user) return;
        setIsPosting(true);
        try {
            await addDoc(collection(db, 'posts'), {
                authorId: user.uid,
                title: postTitle || '',
                content: postInput,
                type: postType,
                likes: [],
                commentCount: 0,
                createdAt: serverTimestamp()
            });
            setPostInput('');
            setPostTitle('');
            setPostType('general');
            setShowNewPost(false);
        } catch (error) {
            console.error('Post error:', error);
        } finally {
            setIsPosting(false);
        }
    };

    const handleLike = async (post: Post) => {
        if (!user) return;
        const postRef = doc(db, 'posts', post.id);
        const isLiked = post.likes?.includes(user.uid);
        try {
            await updateDoc(postRef, { likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid) });
        } catch (error) {
            console.error('Like error:', error);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, 'posts', postId));
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div className="min-h-full bg-[#0A101D] text-white animate-in fade-in pb-20 selection:bg-white/20">
            {/* Header / Top Navigation */}
            <header className="sticky top-0 z-20 bg-[#0A101D]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-[#1E293B]">
                <div className="flex items-center gap-6">
                    <button className="text-xl font-black text-white border-b-2 border-white pb-1">Discover</button>
                    <button className="text-xl font-bold text-[#64748B] hover:text-white transition-colors pb-1">Following</button>
                </div>
                {/* Could add a notification/messages icon here if needed, but keeping it minimal based on references */}
            </header>

            <main className="max-w-2xl mx-auto px-4 pt-8 space-y-10">

                {/* Horizontal "Story/Topic" Section - Adapted for Web */}
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                    <div className="shrink-0 snap-start w-28 h-40 rounded-[2rem] border-2 border-dashed border-[#1E293B] flex flex-col items-center justify-center p-4 hover:border-white/20 hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-[#94A3B8] group-hover:text-white transition-colors">Your Story</span>
                    </div>
                    {/* Placeholder structural items mimicking the reference */}
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="shrink-0 snap-start w-28 h-40 rounded-[2rem] bg-[#182134] overflow-hidden relative cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border border-white/5 hover:border-white/20">
                            {/* Gradient/Image Placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] to-[#0F172A] opacity-80 mix-blend-screen" />
                            <div className="absolute bottom-3 left-0 w-full flex justify-center z-10">
                                <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-[#0F172A] flex items-center justify-center shadow-md">
                                    <Users className="w-4 h-4 text-[#94A3B8]" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Compose Post Area */}
                <div className="relative z-10 w-full mb-8">
                    {!showNewPost ? (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowNewPost(true)}
                                className="flex-1 flex items-center justify-between p-4 rounded-[2rem] bg-[#182134] border border-[#1E293B] hover:border-white/20 hover:shadow-lg hover:bg-[#1E293B] transition-all font-medium text-[#94A3B8] group"
                            >
                                <span className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#4ade80] flex items-center justify-center text-black shrink-0 group-hover:scale-110 transition-transform">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <span className="group-hover:text-white transition-colors">Post an update...</span>
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div className="p-6 rounded-[2rem] bg-[#182134] border border-[#1E293B] shadow-xl space-y-4 animate-in slide-in-from-top-4 fade-in">
                            <input
                                type="text"
                                placeholder="Post Title (optional)"
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
                                className="w-full bg-transparent text-xl font-black text-white outline-none placeholder:text-[#475569]"
                            />
                            <textarea
                                placeholder="What do you want to share with the community?"
                                value={postInput}
                                onChange={(e) => setPostInput(e.target.value)}
                                className="w-full bg-transparent text-base text-[#CBD5E1] outline-none resize-none min-h-[100px] placeholder:text-[#64748B] font-medium custom-scrollbar"
                            />
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex gap-2">
                                    {[
                                        { id: 'general', icon: Share2, label: 'Discussion' },
                                        { id: 'quiz', icon: HelpCircle, label: 'Quiz' },
                                        { id: 'note', icon: FileText, label: 'Notes' }
                                    ].map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setPostType(t.id as any)}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border",
                                                postType === t.id
                                                    ? "bg-white text-black border-white"
                                                    : "bg-transparent text-[#94A3B8] border-white/10 hover:border-white/20"
                                            )}
                                        >
                                            <t.icon className="w-4 h-4" />
                                            <span className="hidden sm:inline">{t.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowNewPost(false)}
                                        className="px-5 py-2.5 rounded-full text-sm font-bold text-[#94A3B8] hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreatePost}
                                        disabled={!postInput.trim() || isPosting}
                                        className="px-6 py-2.5 rounded-full bg-[#4ade80] text-black text-sm font-bold disabled:opacity-50 hover:bg-[#22c55e] transition-colors shadow-lg"
                                    >
                                        {isPosting ? 'Posting...' : 'Publish'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Feed Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
                    <h2 className="text-sm font-black text-[#64748B] uppercase tracking-widest">Recently Posted</h2>
                    <button className="p-2 text-[#64748B] hover:text-white transition-colors rounded-xl hover:bg-white/5">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>

                {/* Feed Body */}
                <div className="space-y-8">
                    {posts.length === 0 ? (
                        <div className="text-center py-20 bg-[#182134] rounded-[3rem] border border-[#1E293B]">
                            <Users className="w-12 h-12 text-[#475569] mx-auto mb-4" />
                            <h3 className="text-lg font-black text-white">No posts yet</h3>
                            <p className="text-sm font-medium text-[#94A3B8] mt-2">Be the first to share something!</p>
                        </div>
                    ) : (
                        posts.map((post, i) => {
                            const isLiked = post.likes?.includes(user?.uid || '');
                            return (
                                <div
                                    key={post.id}
                                    className="p-6 md:p-8 rounded-[3rem] bg-[#182134] border border-[#1E293B] shadow-sm hover:shadow-xl hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    {/* Post Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <Link href={`/dashboard/profile/${post.authorId}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                                            {/* White Circular-Border Element for Community posts avatar */}
                                            <div className="relative p-1 rounded-full border-[3px] border-white/80 shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-[#182134]">
                                                <div className="scale-105 origin-center rounded-full overflow-hidden flex">
                                                    <UserBadge uid={post.authorId} size="sm" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-white leading-tight">User Name Data</span> {/* Replace with actual resolved name if available, or fetch in component */}
                                                </div>
                                                <span className="text-xs font-bold text-[#64748B]">
                                                    Posted in <span className="text-[#94A3B8]">walia</span> - {formatTimeAgo(post.createdAt)}
                                                </span>
                                            </div>
                                        </Link>

                                        <div className="flex items-center gap-2">
                                            {post.type !== 'general' && (
                                                <span className="hidden sm:inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-[#94A3B8] tracking-widest">
                                                    {post.type.replace('_share', '')}
                                                </span>
                                            )}
                                            {post.authorId === user?.uid && (
                                                <button
                                                    onClick={() => handleDeletePost(post.id)}
                                                    className="w-8 h-8 flex items-center justify-center text-[#64748B] hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <div className="mb-6">
                                        {post.title && <h3 className="text-xl font-black text-white mb-3 tracking-tight">{post.title}</h3>}
                                        <p className="text-[15px] text-[#CBD5E1] leading-relaxed font-medium whitespace-pre-wrap">{post.content}</p>
                                    </div>

                                    {/* Post Footer Actions */}
                                    <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-2">
                                        <div className="flex items-center space-x-6">
                                            <button
                                                onClick={() => handleLike(post)}
                                                className={cn(
                                                    "flex items-center space-x-2 text-sm font-bold transition-all group/btn",
                                                    isLiked ? "text-[#4ade80]" : "text-[#64748B] hover:text-white"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                                    isLiked ? "bg-[#4ade80]/10" : "bg-transparent group-hover/btn:bg-white/5"
                                                )}>
                                                    <Heart className={cn("w-5 h-5 transition-transform", isLiked ? "fill-current scale-110" : "group-hover/btn:scale-110")} />
                                                </div>
                                                <span>{post.likes?.length || 0} Likes</span>
                                            </button>
                                            <button className="flex items-center space-x-2 text-sm font-bold text-[#64748B] hover:text-white transition-all group/btn">
                                                <div className="w-10 h-10 rounded-full bg-transparent group-hover/btn:bg-white/5 flex items-center justify-center transition-colors">
                                                    <MessageCircle className="w-5 h-5" />
                                                </div>
                                                <span className="hidden sm:inline">{post.commentCount || 0} Comments</span>
                                            </button>
                                        </div>
                                        <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/10 hover:scale-105 transition-all">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
}
