'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc, limit, onSnapshot } from 'firebase/firestore';
import { Trash2, MessageSquare, Loader2, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import UserBadge from '@/components/UserBadge';

interface Post {
    id: string;
    authorId: string;
    content: string;
    type: string;
    createdAt: any;
    likes: string[];
    commentCount: number;
}

export default function AdminContent() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(100)); // Last 100 posts
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
            setPosts(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleDelete = async (postId: string) => {
        if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
        setDeletingId(postId);
        try {
            await deleteDoc(doc(db, 'posts', postId));
            // Snapshot listener will automatically update the UI
        } catch (error) {
            console.error(error);
            alert("Failed to delete post.");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <div className="flex-1 flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">Content Moderation</h1>
                <p className="text-gray-500 text-sm font-bold mt-1">Review recently published community posts.</p>
            </div>

            <div className="space-y-4">
                {posts.length === 0 && (
                    <div className="p-12 text-center text-gray-400 font-bold bg-white dark:bg-[#162032] rounded-[2rem] border border-gray-200 dark:border-white/5">
                        No posts found.
                    </div>
                )}
                {posts.map(post => {
                    const timeAgo = post.createdAt?.toDate ? formatDistanceToNow(post.createdAt.toDate()) + ' ago' : 'Recently';
                    return (
                        <div key={post.id} className="bg-white dark:bg-[#162032] rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 flex gap-4 transition-all hover:border-gray-300 dark:hover:border-white/10 relative group">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 shrink-0 overflow-hidden relative">
                                <UserBadge uid={post.authorId} size="sm" hideName className="absolute inset-0" />
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-sm font-black text-black dark:text-white flex items-center gap-2">
                                            Author ID: {post.authorId.substring(0, 8)}...
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                                                {post.type}
                                            </span>
                                        </p>
                                        <p className="text-xs font-bold text-gray-400">{timeAgo}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(post.id)}
                                        disabled={deletingId === post.id}
                                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100"
                                        title="Delete Post"
                                    >
                                        {deletingId === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
                                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Likes: {post.likes?.length || 0}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Comments: {post.commentCount || 0}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
