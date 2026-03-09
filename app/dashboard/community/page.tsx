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
    updateDoc,
    where
} from 'firebase/firestore';
import {
    Clock,
    Eye,
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
import { useEffect, useRef, useState } from 'react';

interface Story {
    id: string;
    authorId: string;
    imageUrl?: string;
    content?: string;
    views: string[];
    likes: string[];
    createdAt: any;
}

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
    const [stories, setStories] = useState<Story[]>([]);
    const [postInput, setPostInput] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postType, setPostType] = useState<'ai_share' | 'quiz' | 'note' | 'general'>('general');
    const [isPosting, setIsPosting] = useState(false);
    const [isSharingStory, setIsSharingStory] = useState(false);
    const [showNewPost, setShowNewPost] = useState(false);
    const storyFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
        const unsub = onSnapshot(q, (snap) => {
            setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
        });

        // Fetch stories from last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const sq = query(
            collection(db, 'stories'),
            where('createdAt', '>=', twentyFourHoursAgo),
            orderBy('createdAt', 'desc')
        );
        const unsubStories = onSnapshot(sq, (snap) => {
            setStories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Story)));
        });

        return () => { unsub(); unsubStories(); };
    }, []);

    const handleCreateStory = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setIsSharingStory(true);
        try {
            // In a real app we'd upload to Storage, for now using base64 for simplicity in demo
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = reader.result as string;
                await addDoc(collection(db, 'stories'), {
                    authorId: user.uid,
                    imageUrl: base64,
                    views: [],
                    likes: [],
                    createdAt: serverTimestamp()
                });
                setIsSharingStory(false);
            };
        } catch (error) {
            console.error('Story error:', error);
            setIsSharingStory(false);
        }
    };

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
        <div className="min-h-full bg-white text-black animate-in fade-in pb-20 selection:bg-black selection:text-white">
            {/* Header / Top Navigation */}
            <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-6">
                    <button className="text-xl font-black text-black border-b-2 border-black pb-1">Discover</button>
                    <button className="text-xl font-bold text-gray-400 hover:text-black transition-colors pb-1">Following</button>
                </div>
                {/* Could add a notification/messages icon here if needed, but keeping it minimal based on references */}
            </header>

            <main className="max-w-2xl mx-auto px-4 pt-8 space-y-10">

                {/* Horizontal Stories Section */}
                <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar snap-x scroll-smooth">
                    <div
                        onClick={() => storyFileRef.current?.click()}
                        className="shrink-0 snap-start w-32 h-48 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-4 hover:border-black hover:bg-gray-50 transition-all cursor-pointer group relative overflow-hidden"
                    >
                        <input
                            type="file"
                            ref={storyFileRef}
                            onChange={handleCreateStory}
                            accept="image/*"
                            className="hidden"
                        />
                        {isSharingStory ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin" />
                                <span className="text-[10px] font-black uppercase text-black/40">Sharing...</span>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-black text-gray-500 group-hover:text-black transition-colors">Your Story</span>
                            </>
                        )}
                    </div>

                    {stories.map(story => (
                        <div
                            key={story.id}
                            className="shrink-0 snap-start w-32 h-48 rounded-[2.5rem] bg-gray-100 overflow-hidden relative cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-1 border border-gray-200 hover:border-black group"
                        >
                            {story.imageUrl ? (
                                <img src={story.imageUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Story" />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 opacity-50" />
                            )}

                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full border border-white/50 overflow-hidden">
                                        <UserBadge uid={story.authorId} size="sm" />
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-white uppercase tracking-widest">
                                        <Eye className="w-2 h-2" />
                                        {story.views?.length || 0}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-white uppercase tracking-widest">
                                        <Heart className="w-2 h-2 fill-current" />
                                        {story.likes?.length || 0}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-[7px] font-bold text-white/60 uppercase tracking-tighter">
                                    <Clock className="w-2 h-2" />
                                    {formatTimeAgo(story.createdAt)}
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
                                className="flex-1 flex items-center justify-between p-4 rounded-[2rem] bg-gray-50 border border-gray-200 hover:border-black hover:shadow-md hover:bg-white transition-all font-medium text-gray-500 group"
                            >
                                <span className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <span className="group-hover:text-black transition-colors">Post an update...</span>
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div className="p-6 rounded-[2rem] bg-white border border-gray-200 shadow-xl space-y-4 animate-in slide-in-from-top-4 fade-in">
                            <input
                                type="text"
                                placeholder="Post Title (optional)"
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
                                className="w-full bg-transparent text-xl font-black text-black outline-none placeholder:text-gray-300"
                            />
                            <textarea
                                placeholder="What do you want to share with the community?"
                                value={postInput}
                                onChange={(e) => setPostInput(e.target.value)}
                                className="w-full bg-transparent text-base text-gray-700 outline-none resize-none min-h-[100px] placeholder:text-gray-400 font-medium custom-scrollbar"
                            />
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
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
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
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
                                        className="px-5 py-2.5 rounded-full text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreatePost}
                                        disabled={!postInput.trim() || isPosting}
                                        className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-bold disabled:opacity-50 hover:bg-zinc-800 transition-colors shadow-lg"
                                    >
                                        {isPosting ? 'Posting...' : 'Publish'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Feed Header */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Recently Posted</h2>
                    <button className="p-2 text-gray-400 hover:text-black transition-colors rounded-xl hover:bg-gray-50">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>

                {/* Feed Body */}
                <div className="space-y-8">
                    {posts.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-gray-200">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-black text-black">No posts yet</h3>
                            <p className="text-sm font-medium text-gray-500 mt-2">Be the first to share something!</p>
                        </div>
                    ) : (
                        posts.map((post, i) => {
                            const isLiked = post.likes?.includes(user?.uid || '');
                            return (
                                <div
                                    key={post.id}
                                    className="p-6 md:p-8 rounded-[3rem] bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    {/* Post Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <Link href={`/dashboard/profile/${post.authorId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                            <div className="scale-110 origin-left ring-2 ring-transparent group-hover:ring-black/5 rounded-full transition-all">
                                                <UserBadge uid={post.authorId} size="sm" />
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-black leading-tight">User Name Data</span> {/* Replace with actual resolved name if available, or fetch in component */}
                                                </div>
                                                <span className="text-xs font-bold text-gray-400">
                                                    Posted in <span className="text-black">walia</span> - {formatTimeAgo(post.createdAt)}
                                                </span>
                                            </div>
                                        </Link>

                                        <div className="flex items-center gap-2">
                                            {post.type !== 'general' && (
                                                <span className="hidden sm:inline-block px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-black uppercase text-gray-500 tracking-widest">
                                                    {post.type.replace('_share', '')}
                                                </span>
                                            )}
                                            {post.authorId === user?.uid && (
                                                <button
                                                    onClick={() => handleDeletePost(post.id)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <div className="mb-6">
                                        {post.title && <h3 className="text-xl font-black text-black mb-3 tracking-tight">{post.title}</h3>}
                                        <p className="text-[15px] text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">{post.content}</p>
                                    </div>

                                    {/* Post Footer Actions */}
                                    <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-2">
                                        <div className="flex items-center space-x-6">
                                            <button
                                                onClick={() => handleLike(post)}
                                                className={cn(
                                                    "flex items-center space-x-2 text-sm font-bold transition-all group/btn",
                                                    isLiked ? "text-black" : "text-gray-400 hover:text-black"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                                    isLiked ? "bg-gray-100" : "bg-transparent group-hover/btn:bg-gray-50"
                                                )}>
                                                    <Heart className={cn("w-5 h-5 transition-transform", isLiked && "fill-current group-hover/btn:scale-110")} />
                                                </div>
                                                <span>{post.likes?.length || 0} Likes</span>
                                            </button>
                                            <button className="flex items-center space-x-2 text-sm font-bold text-gray-400 hover:text-black transition-all group/btn">
                                                <div className="w-10 h-10 rounded-full bg-transparent group-hover/btn:bg-gray-50 flex items-center justify-center transition-colors">
                                                    <MessageCircle className="w-5 h-5" />
                                                </div>
                                                <span className="hidden sm:inline">{post.commentCount || 0} Comments</span>
                                            </button>
                                        </div>
                                        <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 hover:scale-105 transition-all">
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
