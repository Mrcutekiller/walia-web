'use client';

import UserBadge from '@/components/UserBadge';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { cn, formatTimeAgo } from '@/lib/utils';
import {
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    limit,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
    increment
} from 'firebase/firestore';
import { Heart, Loader2, MessageCircle, Share2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { user: currentUser } = useAuth();

    const userId = params.id as string;

    const [profileUser, setProfileUser] = useState<any>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // Redirect if it's the current user's profile
    useEffect(() => {
        if (currentUser && currentUser.uid === userId) {
            router.replace('/dashboard/profile');
        }
    }, [currentUser, userId, router]);

    // Fetch user profile data
    useEffect(() => {
        async function fetchUser() {
            if (!userId) return;
            try {
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists()) {
                    setProfileUser(userDoc.data());
                } else {
                    setProfileUser(null);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [userId]);

    // Fetch user's posts
    useEffect(() => {
        if (!userId) return;
        const q = query(
            collection(db, 'posts'),
            where('authorId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(20)
        );
        const unsub = onSnapshot(q, (snap) => {
            setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
        });
        return () => unsub();
    }, [userId]);

    const handleLike = async (post: Post) => {
        if (!currentUser) return;
        const postRef = doc(db, 'posts', post.id);
        const isLiked = post.likes?.includes(currentUser.uid);
        try {
            await updateDoc(postRef, { likes: isLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid) });
        } catch (error) {
            console.error('Like error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-full flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 text-black animate-spin" />
            </div>
        );
    }

    if (!profileUser) {
        return (
            <div className="min-h-full flex flex-col items-center justify-center bg-white">
                <h1 className="text-2xl font-black text-black mb-2">User Not Found</h1>
                <p className="text-gray-500 mb-6">The profile you are looking for does not exist.</p>
                <Link href="/dashboard/community" className="px-6 py-3 rounded-full bg-black text-white font-bold text-sm hover:scale-105 transition-transform">
                    Return to Community
                </Link>
            </div>
        );
    }

    const handleFollow = async () => {
        if (!currentUser || !profileUser) return;
        const targetUserId = userId;
        const currentRef = doc(db, 'users', currentUser.uid);
        const targetRef = doc(db, 'users', targetUserId);
        
        try {
            // Very simple following logic assuming we had a similar one to mobile
            // Just updating stats for now, and rewarding tokens
            await updateDoc(currentRef, {
                tokensUsed: increment(-5) // reward 5 tokens
            });
            alert('🎉 Bonus Tokens! You earned +5 tokens for following.');
            
            // To be exhaustive, we would also add to their following list here...
            // e.g. following: arrayUnion(targetUserId)
        } catch(e) {
            console.error('Follow error:', e);
        }
    }

    return (
        <div className="min-h-full bg-[#FAFAFA] text-black animate-in fade-in pb-20 selection:bg-black selection:text-white">

            <main className="max-w-3xl mx-auto px-4 pt-8 md:pt-12 space-y-8">

                {/* Profile Card */}
                <div className="bg-white rounded-[3rem] p-2 border border-gray-200 shadow-xl shadow-black-[0.02]">
                    <div className="relative h-48 md:h-56 rounded-[2.5rem] overflow-hidden bg-gray-100 border border-gray-100 mb-16">
                        {/* Soft background graphic for banner */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-transparent opacity-50" />

                        {/* Profile Image - Centered and overflowing bottom */}
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                            <div className="p-1 rounded-full bg-white relative">
                                <div className="absolute inset-0 rounded-full ring-2 ring-gray-100 scale-[1.05]" />
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {profileUser.photoURL ? (
                                        <img src={profileUser.photoURL} alt="User Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-black text-gray-300">{profileUser.displayName?.charAt(0) || '?'}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Top Right Action (e.g., Follow) */}
                        <div className="absolute top-4 right-4">
                            <button 
                                onClick={handleFollow}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs shadow-md shadow-black/5 hover:-translate-y-0.5 hover:shadow-lg transition-all border border-gray-100"
                            >
                                Follow <UserPlus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Bio and Info */}
                    <div className="text-center px-6 pb-8">
                        <h1 className="text-3xl font-black tracking-tight text-black mb-1">
                            {profileUser.displayName || 'Anonymous User'}
                        </h1>
                        <p className="text-sm font-bold text-gray-400 mb-4 tracking-wide">
                            @{profileUser.username || `user_${userId.slice(0, 5)}`}
                        </p>

                        <p className="max-w-md mx-auto text-[15px] font-medium text-gray-600 leading-relaxed mb-8">
                            {profileUser.bio || "This user hasn't added a bio yet."}
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center justify-center gap-4 bg-gray-50 rounded-[2rem] p-4 max-w-sm mx-auto border border-gray-100">
                            <div className="flex-1">
                                <p className="text-lg font-black text-black">{posts.length}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Posts</p>
                            </div>
                            <div className="w-px h-8 bg-gray-200" />
                            <div className="flex-1">
                                <p className="text-lg font-black text-black">{profileUser.followersCount || 0}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Followers</p>
                            </div>
                            <div className="w-px h-8 bg-gray-200" />
                            <div className="flex-1">
                                <p className="text-lg font-black text-black">{profileUser.followingCount || 0}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Following</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts Heading */}
                <div className="px-4 py-2 border-b-2 border-black w-fit mt-10 mb-6 mx-auto md:mx-0">
                    <h2 className="text-sm font-black text-black uppercase tracking-widest">Recent Posts</h2>
                </div>

                {/* Posts List */}
                <div className="space-y-6">
                    {posts.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-[3rem] border border-gray-200">
                            <p className="text-gray-400 font-bold">No posts available.</p>
                        </div>
                    ) : (
                        posts.map(post => {
                            const isLiked = post.likes?.includes(currentUser?.uid || '');
                            return (
                                <div key={post.id} className="p-6 md:p-8 rounded-[3rem] bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="scale-110 origin-left">
                                            <UserBadge uid={post.authorId} size="sm" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-black leading-tight">{profileUser.displayName}</span>
                                            <span className="text-xs font-bold text-gray-400">
                                                {formatTimeAgo(post.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        {post.type !== 'general' && (
                                            <span className="inline-block px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-black uppercase text-gray-500 tracking-widest mb-3">
                                                {post.type.replace('_share', '')}
                                            </span>
                                        )}
                                        {post.title && <h3 className="text-xl font-black text-black mb-3 tracking-tight">{post.title}</h3>}
                                        <p className="text-[15px] text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">{post.content}</p>
                                    </div>

                                    <div className="flex items-center border-t border-gray-100 pt-5 mt-2">
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
                                                <span>{post.likes?.length || 0}</span>
                                            </button>
                                            <button className="flex items-center space-x-2 text-sm font-bold text-gray-400 hover:text-black transition-all group/btn">
                                                <div className="w-10 h-10 rounded-full bg-transparent group-hover/btn:bg-gray-50 flex items-center justify-center transition-colors">
                                                    <MessageCircle className="w-5 h-5" />
                                                </div>
                                                <span>{post.commentCount || 0}</span>
                                            </button>
                                        </div>
                                        <button className="w-10 h-10 ml-auto rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 hover:scale-105 transition-all">
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
