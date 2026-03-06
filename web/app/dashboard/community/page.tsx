'use client';

import UserBadge from '@/components/UserBadge';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
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
    Flame,
    Heart,
    HelpCircle,
    MessageCircle,
    MoreVertical,
    Share2,
    Sparkles,
    Trash2,
    TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Post {
    id: string;
    authorId: string;
    title: string;
    content: string;
    type: 'ai_share' | 'quiz' | 'note' | 'general';
    likes: string[]; // array of user IDs
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

    // 1. Fetch Posts
    useEffect(() => {
        const q = query(
            collection(db, 'posts'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );
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
                title: postTitle || 'Community Update',
                content: postInput,
                type: postType,
                likes: [],
                commentCount: 0,
                createdAt: serverTimestamp()
            });
            setPostInput('');
            setPostTitle('');
            setPostType('general');
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
            await updateDoc(postRef, {
                likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
            });
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 animate-fade-in-up">

            {/* Feed Column */}
            <div className="lg:col-span-3 space-y-8">
                {/* Create Post */}
                <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6 shadow-xl">
                    <div className="flex items-start space-x-6">
                        <UserBadge uid={user?.uid || ''} showUsername={false} className="mt-2" />
                        <div className="flex-1 space-y-4">
                            <input
                                type="text"
                                placeholder="Give your post a title..."
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
                                className="w-full bg-transparent text-xl font-black text-white placeholder:text-white/10 outline-none"
                            />
                            <textarea
                                placeholder="Share a study session, quiz, or note with the community..."
                                value={postInput}
                                onChange={(e) => setPostInput(e.target.value)}
                                className="w-full bg-transparent text-sm text-white/60 placeholder:text-white/10 outline-none resize-none min-h-[100px]"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/5 gap-4">
                        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            {[
                                { id: 'ai_share', icon: Sparkles, label: 'AI Share' },
                                { id: 'quiz', icon: HelpCircle, label: 'Quiz' },
                                { id: 'note', icon: FileText, label: 'Note' },
                                { id: 'general', icon: Share2, label: 'General' }
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setPostType(t.id as any)}
                                    className={cn(
                                        "flex items-center px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                        postType === t.id
                                            ? "bg-walia-primary text-white shadow-lg shadow-walia-primary/20"
                                            : "bg-white/5 text-white/30 hover:text-white"
                                    )}
                                >
                                    <t.icon className="w-3.5 h-3.5 mr-2" /> {t.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleCreatePost}
                            disabled={isPosting || !postInput.trim()}
                            className="w-full md:w-48 py-3.5 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-20"
                        >
                            {isPosting ? 'Posting...' : 'Post to Feed'}
                        </button>
                    </div>
                </div>

                {/* Posts */}
                <div className="space-y-8">
                    {posts.map((post) => (
                        <div key={post.id} className="p-10 rounded-[48px] bg-white/5 border border-white/5 hover:border-white/10 transition-all group shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <UserBadge uid={post.authorId} size="lg" />
                                <div className="flex items-center space-x-2">
                                    {post.authorId === user?.uid && (
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            className="p-3 rounded-2xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button className="p-3 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 text-white/20 hover:text-white transition-all">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
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
                                {post.type === 'note' && (
                                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase text-emerald-500 tracking-widest">
                                        <FileText className="w-3 h-3 mr-2" /> Shared Study Note
                                    </div>
                                )}
                                <h3 className="text-2xl font-black text-white group-hover:text-walia-primary transition-colors">{post.title}</h3>
                                <p className="text-white/50 text-base leading-relaxed font-bold">
                                    {post.content}
                                </p>
                            </div>

                            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <button
                                        onClick={() => handleLike(post)}
                                        className={cn(
                                            "flex items-center space-x-2 text-sm font-bold transition-all px-4 py-2 rounded-xl",
                                            post.likes?.includes(user?.uid || '')
                                                ? "bg-red-500/10 text-red-500"
                                                : "text-white/20 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <Heart className={cn("w-5 h-5", post.likes?.includes(user?.uid || '') && "fill-current animate-bounce-sm")} />
                                        <span>{post.likes?.length || 0}</span>
                                    </button>
                                    <button className="flex items-center space-x-2 text-sm font-bold text-white/20 hover:text-white transition-all px-4 py-2 rounded-xl hover:bg-white/5">
                                        <MessageCircle className="w-5 h-5" />
                                        <span>{post.commentCount || 0}</span>
                                    </button>
                                </div>
                                <button className="p-3 rounded-xl bg-white/5 text-white/30 hover:text-white transition-all">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && (
                        <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-[48px]">
                            <Share2 className="w-12 h-12 text-white/5 mx-auto mb-6" />
                            <h4 className="text-xl font-black text-white/20 uppercase tracking-widest">No posts yet</h4>
                            <p className="text-white/5 text-xs mt-2">Be the first to share something with the Walia community!</p>
                        </div>
                    )}
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
                        {posts.slice(0, 6).map((p) => (
                            <UserBadge key={p.id} uid={p.authorId} showUsername={false} />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

