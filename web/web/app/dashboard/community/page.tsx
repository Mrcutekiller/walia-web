'use client';

import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { 
    Heart, MessageCircle, Share2, Send, Plus, MoreHorizontal, 
    UserPlus, UserMinus, Search, TrendingUp, Sparkles, X, Image as ImageIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
    collection, onSnapshot, orderBy, query, addDoc, 
    serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc, getDoc, where
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface Post {
    id: string;
    uid: string;
    username: string;
    content: string;
    image?: string;
    likes: string[];
    commentsCount: number;
    createdAt: any;
}

interface Story {
    id: string;
    uid: string;
    username: string;
    image: string;
    hasUnseen: boolean;
    createdAt: any;
}

export default function CommunityPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [following, setFollowing] = useState<string[]>([]);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);

    const trendingTags = React.useMemo(() => {
        const tagCounts: Record<string, number> = {};
        posts.forEach(post => {
            const matches = post.content.match(/#\w+/g);
            if (matches) {
                matches.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });
        return Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([tag, count]) => ({ tag, count }));
    }, [posts]);

    const [stories, setStories] = useState<Story[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        return onSnapshot(q, snap => {
            setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
        });
    }, []);

    useEffect(() => {
        const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
        return onSnapshot(q, snap => {
            setStories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Story)));
        });
    }, []);

    useEffect(() => {
        if (!user) return;
        return onSnapshot(doc(db, 'users', user.uid), snap => {
            setFollowing(snap.data()?.following || []);
        });
    }, [user]);

    const [storyFile, setStoryFile] = useState<File | null>(null);
    const [postFile, setPostFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const uploadFile = async (file: File, path: string) => {
        const { storage } = await import('@/lib/firebase');
        const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
        const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const handleAddStory = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        setUploading(true);
        try {
            const url = await uploadFile(file, 'stories');
            await addDoc(collection(db, 'stories'), {
                uid: user.uid,
                username: user.username || 'User',
                image: url,
                hasUnseen: true,
                createdAt: serverTimestamp()
            });
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!content.trim() && !postFile) || !user || loading) return;
        setLoading(true);
        try {
            let imageUrl = '';
            if (postFile) {
                imageUrl = await uploadFile(postFile, 'posts');
            }
            await addDoc(collection(db, 'posts'), {
                uid: user.uid,
                username: user.username || 'User',
                content: content.trim(),
                image: imageUrl,
                likes: [],
                commentsCount: 0,
                createdAt: serverTimestamp()
            });
            setContent('');
            setPostFile(null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (post: Post) => {
        if (!user) return;
        const ref = doc(db, 'posts', post.id);
        const isLiked = post.likes.includes(user.uid);
        await updateDoc(ref, {
            likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
        });

        if (!isLiked && post.uid !== user.uid) {
            await addDoc(collection(db, 'notifications'), {
                userId: post.uid,
                type: 'community',
                title: 'New Like',
                message: `${user.username || 'Someone'} liked your post.`,
                read: false,
                createdAt: serverTimestamp()
            });
        }
    };

    const handleFollow = async (postUid: string) => {
        if (!user || user.uid === postUid) return;
        const isFollowing = following.includes(postUid);
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            following: isFollowing ? arrayRemove(postUid) : arrayUnion(postUid)
        });

        if (!isFollowing) {
            await addDoc(collection(db, 'notifications'), {
                userId: postUid,
                type: 'community',
                title: 'New Follower',
                message: `${user.username || 'Someone'} started following you.`,
                read: false,
                createdAt: serverTimestamp()
            });
        }
    };

    return (
        <div className="flex h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0A0A18] dark:via-[#0D0D1A] dark:to-[#0A0A18]">
            {/* ── Main Feed ── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-2xl mx-auto px-6 py-10">
                    
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-3xl font-black text-black dark:text-white tracking-tighter uppercase">Community</h1>
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Connect with the herd</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" placeholder="Search posts..."
                                    className="pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/10 text-xs font-medium outline-none focus:border-black dark:focus:border-white transition-all duration-300 w-40 md:w-60 shadow-sm hover:shadow-md"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Stories */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.5 }} className="mb-10 flex gap-4 overflow-x-auto custom-scrollbar pb-4">
                        {/* Add Story */}
                        <label className="flex flex-col items-center gap-2 cursor-pointer group shrink-0">
                            <input type="file" accept="image/*" className="hidden" onChange={handleAddStory} />
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-white/20 group-hover:border-black dark:group-hover:border-white transition-all">
                                    {uploading ? (
                                        <div className="w-5 h-5 border-2 border-gray-300 border-t-black dark:border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Plus className="w-6 h-6 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                                    )}
                                </div>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white mt-1">Your Story</span>
                        </label>
                        {/* Real Stories */}
                        {stories.map(story => (
                            <div key={story.id} className="flex flex-col items-center gap-2 cursor-pointer group shrink-0" onClick={() => setSelectedStory(story)}>
                                <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${story.hasUnseen ? 'border-black dark:border-white' : 'border-gray-200 dark:border-white/10'}`}>
                                    {story.image.startsWith('http') ? (
                                        <img src={story.image} alt={story.username} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-black text-white font-black text-xl">{story.image}</div>
                                    )}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1">{story.username}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Create Post */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="mb-12 p-6 rounded-[2.5rem] bg-white/70 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 shadow-inner backdrop-blur-sm">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-black to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center text-white dark:text-black font-black text-xs shrink-0 shadow-lg">
                                {user?.username?.slice(0, 2) || 'U'}
                            </div>
                            <form onSubmit={handlePost} className="flex-1">
                                <textarea 
                                    value={content} onChange={e => setContent(e.target.value)}
                                    placeholder="Write something to the community..."
                                    className="w-full bg-transparent border-none outline-none resize-none text-sm font-medium text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 mb-4"
                                    rows={3}
                                />
                                <div className="flex items-center justify-between border-t border-gray-200/60 dark:border-white/5 pt-4">
                                    <div className="flex gap-2 items-center">
                                        <label className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 cursor-pointer transition-all duration-300 hover:shadow-md">
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => setPostFile(e.target.files?.[0] || null)} />
                                            <ImageIcon className="w-4 h-4" />
                                        </label>
                                        {postFile && (
                                            <span className="text-[10px] font-bold text-black dark:text-white bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md flex items-center gap-1">
                                                {postFile.name.slice(0, 10)}... <X className="w-2 h-2 cursor-pointer" onClick={() => setPostFile(null)} />
                                            </span>
                                        )}
                                        <button type="button" className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 transition-all duration-300 hover:shadow-md"><Sparkles className="w-4 h-4" /></button>
                                    </div>
                                    <button 
                                        type="submit" disabled={!content.trim() || loading}
                                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all duration-300 shadow-xl shadow-black/10 disabled:opacity-30"
                                    >
                                        {loading ? "Posting..." : "Post"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>

                    {/* Feed */}
                    <div className="space-y-6">
                        {posts.map((post, index) => (
                            <motion.div 
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.05 }}
                                className="p-8 rounded-[2.5rem] bg-white/70 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group backdrop-blur-sm"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-black to-gray-700 dark:from-white dark:to-gray-300 border border-black/5 dark:border-white/10 flex items-center justify-center text-white dark:text-black font-black text-xs uppercase shadow-sm">
                                            {post.username.slice(0, 2)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-tight">{post.username}</h3>
                                                {post.uid === 'founder' && <Sparkles className="w-3 h-3 text-amber-500" />}
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                {post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                                            </p>
                                        </div>
                                    </div>
                                    {user && user.uid !== post.uid && (
                                        <button 
                                            onClick={() => handleFollow(post.uid)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                                following.includes(post.uid)
                                                ? 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-red-500'
                                                : 'bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black hover:opacity-90'
                                            }`}
                                        >
                                            {following.includes(post.uid) ? 'Following' : 'Follow'}
                                        </button>
                                    )}
                                </div>

                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed mb-8 whitespace-pre-line">
                                    {post.content}
                                </p>

                                {post.image && (
                                    <div className="mb-8 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-lg">
                                        <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
                                    </div>
                                )}

                                <div className="flex items-center gap-6 pt-6 border-t border-gray-200/60 dark:border-white/5">
                                    <button 
                                        onClick={() => handleLike(post)}
                                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                            post.likes.includes(user?.uid || '') 
                                            ? 'text-red-500' 
                                            : 'text-gray-400 hover:text-black dark:hover:text-white'
                                        }`}
                                    >
                                        <Heart className={`w-4 h-4 ${post.likes.includes(user?.uid || '') ? 'fill-current' : ''}`} />
                                        {post.likes.length} Likes
                                    </button>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300">
                                        <MessageCircle className="w-4 h-4" />
                                        {post.commentsCount} Comments
                                    </button>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300 ml-auto">
                                        <Share2 className="w-4 h-4" />
                                        Share
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right Panel: Trending/Suggested ── */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="hidden lg:flex w-80 border-l border-gray-200/60 dark:border-white/5 flex-col p-8 bg-white/70 dark:bg-black/30 backdrop-blur-xl overflow-y-auto custom-scrollbar">
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-4 h-4 text-black dark:text-white" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-black dark:text-white">Trending Topics</h2>
                    </div>
                    <div className="space-y-4">
                        {trendingTags.length > 0 ? trendingTags.map(({tag, count}, index) => (
                            <motion.div key={tag} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + index * 0.05 }} className="group cursor-pointer">
                                <p className="text-xs font-black text-black dark:text-white group-hover:underline transition-all duration-300">{tag}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{count} posts</p>
                            </motion.div>
                        )) : (
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No trending tags yet</p>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="w-4 h-4 text-black dark:text-white" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-black dark:text-white">Who to follow</h2>
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: 'Mrcute', role: 'Founder', tag: '@mrcute_killer' },
                            { name: 'GoldWatcher', role: 'Trader', tag: '@gold_king' },
                            { name: 'AIBrain', role: 'Developer', tag: '@dev_walia' }
                        ].map((u, index) => (
                            <motion.div key={u.tag} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.05 }} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black flex items-center justify-center font-black text-xs uppercase shadow-sm">
                                    {u.name.slice(0, 2)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black text-black dark:text-white truncate uppercase tracking-tight">{u.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{u.tag}</p>
                                </div>
                                <button className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-black dark:hover:bg-white text-gray-400 hover:text-white dark:hover:text-black transition-all duration-300 hover:shadow-md">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Story Viewer Modal */}
            <AnimatePresence>
                {selectedStory && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8" onClick={() => setSelectedStory(null)}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg aspect-[9/16] bg-black rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]"
                            onClick={e => e.stopPropagation()}
                        >
                            <img src={selectedStory.image} alt={selectedStory.username} className="w-full h-full object-cover" />
                            
                            {/* Overlay Top */}
                            <div className="absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/80 to-transparent">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-black font-black shadow-lg">
                                            {selectedStory.username.slice(0, 1).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-sm uppercase tracking-widest">{selectedStory.username}</p>
                                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                                                {selectedStory.createdAt?.toDate ? new Date(selectedStory.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedStory(null)}
                                        className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="absolute top-4 left-8 right-8 h-1 bg-white/20 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 5, ease: 'linear' }}
                                    onAnimationComplete={() => setSelectedStory(null)}
                                    className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
