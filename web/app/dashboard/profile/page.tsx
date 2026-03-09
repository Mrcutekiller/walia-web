'use client';
import Image from 'next/image';

import UserBadge from '@/components/UserBadge';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { deleteAccount } from '@/lib/user';
import { cn, formatTimeAgo } from '@/lib/utils';
import { updateProfile } from 'firebase/auth';
import {
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    limit,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Camera,
    Edit3,
    Heart,
    Loader2,
    MessageCircle,
    Settings,
    Share2,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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

export default function ProfilePage() {
    const { user, profile } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // States
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);

    // Editable fields
    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                displayName: profile.displayName || user?.displayName || '',
                bio: profile.bio || '',
            });
        }
    }, [profile, user]);

    // Fetch user's posts
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'posts'),
            where('authorId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(20)
        );
        const unsub = onSnapshot(q, (snap) => {
            setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
        });
        return () => unsub();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                ...formData,
            });
            await updateProfile(user, { displayName: formData.displayName });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            await deleteAccount();
            router.push('/');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        setUploading(true);
        try {
            const storageRef = ref(storage, `avatars/${user.uid}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            await updateDoc(doc(db, 'users', user.uid), { photoURL: url });
            await updateProfile(user, { photoURL: url });
        } catch (error) {
            console.error('Error uploading avatar:', error);
        } finally {
            setUploading(false);
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

    if (!user) return null;

    return (
        <div className="min-h-full bg-white dark:bg-[#0A0A18] text-black dark:text-white animate-in fade-in pb-20 selection:bg-black selection:text-white">

            <main className="max-w-3xl mx-auto px-4 pt-8 md:pt-12 space-y-8">

                {/* Profile Card */}
                <div className="bg-white dark:bg-white/5 rounded-[3rem] p-2 border border-gray-200 dark:border-gray-800 shadow-xl shadow-black/5 dark:shadow-white/5 relative transition-colors">
                    <div className="relative h-48 md:h-56 rounded-[2.5rem] overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-gray-800 mb-16 transition-colors">
                        {/* Soft background graphic for banner */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-200 dark:from-gray-800 to-transparent opacity-50 transition-colors" />

                        {/* Profile Image - Centered and overflowing bottom */}
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 group cursor-pointer" onClick={() => !isEditing && fileInputRef.current?.click()}>
                            <div className="p-1 rounded-full bg-white dark:bg-[#0A0A18] relative">
                                <div className="absolute inset-0 rounded-full ring-2 ring-gray-100 dark:ring-gray-800 scale-[1.05] transition-transform group-hover:scale-110" />
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800 flex items-center justify-center relative">
                                    {(profile?.photoURL || user.photoURL) ? (
                                        <Image src={profile?.photoURL || user.photoURL || ''} alt="User Avatar" fill className="object-cover" />
                                    ) : (
                                        <span className="text-4xl font-black text-gray-300 dark:text-gray-700">{formData.displayName?.charAt(0) || profile?.name?.charAt(0) || '?'}</span>
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                        </div>
                                    )}
                                    {!uploading && (
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                                            <Camera className="w-6 h-6 mb-1" />
                                            <span className="text-[10px] uppercase font-bold tracking-widest">Update</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                        </div>

                        {/* Top Right Action: Settings/Edit */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            {isEditing ? (
                                <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-white/10 text-black dark:text-white font-bold text-xs shadow-md border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors">
                                    Cancel
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-white/10 text-black dark:text-white font-bold text-xs shadow-md border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/20 hover:shadow-lg transition-all">
                                        <Edit3 className="w-4 h-4" /> <span className="hidden sm:inline">Edit</span>
                                    </button>
                                    <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-white/10 text-black dark:text-white font-bold text-xs shadow-md border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/20 hover:shadow-lg transition-all">
                                        <Settings className="w-4 h-4" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Bio and Info / Edit Mode */}
                    <div className="px-6 pb-8">
                        {isEditing ? (
                            <div className="space-y-6 max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Display Name</label>
                                    <input
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-2xl px-5 py-3.5 text-black dark:text-white outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 transition-all font-semibold text-center placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        value={formData.displayName}
                                        onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Bio</label>
                                    <textarea
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-2xl px-5 py-3.5 text-black dark:text-white outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 transition-all font-medium h-32 resize-none text-center custom-scrollbar placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        value={formData.bio}
                                        placeholder="Tell the community about yourself..."
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                </div>
                                <button onClick={handleSave} disabled={loading} className="w-full py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 hover:bg-zinc-800 dark:hover:bg-gray-200">
                                    {loading ? 'Saving...' : 'Save Profile'}
                                </button>

                                <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 flex justify-center">
                                    <button onClick={() => setShowDeleteConfirm(true)} className="text-xs font-bold text-red-500 hover:text-red-700 underline underline-offset-4 decoration-red-200 dark:decoration-red-900/40 hover:decoration-red-600 transition-colors">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center animate-in fade-in">
                                <h1 className="text-3xl font-black tracking-tight text-black dark:text-white mb-1">
                                    {profile?.name || formData.displayName || 'Set your name'}
                                </h1>
                                <p className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-4 tracking-wide">
                                    @{profile?.username || 'walia_user'}
                                </p>

                                <p className="max-w-md mx-auto text-[15px] font-medium text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                                    {formData.bio || "You haven't added a bio yet. Click the edit button to tell everyone who you are."}
                                </p>

                                {/* Stats Row */}
                                <div className="flex items-center justify-center gap-4 bg-gray-50 dark:bg-white/5 rounded-[2rem] p-4 max-w-sm mx-auto border border-gray-100 dark:border-gray-800">
                                    <div className="flex-1">
                                        <p className="text-lg font-black text-black dark:text-white">{posts.length}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Posts</p>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
                                    <div className="flex-1">
                                        <p className="text-lg font-black text-black dark:text-white">{profile?.followersCount || 0}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Followers</p>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
                                    <div className="flex-1">
                                        <p className="text-lg font-black text-black dark:text-white">{profile?.followingCount || 0}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Following</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Posts Heading */}
                {!isEditing && (
                    <div className="px-4 py-2 border-b-2 border-black dark:border-white w-fit mt-10 mb-6 mx-auto md:mx-0">
                        <h2 className="text-sm font-black text-black dark:text-white uppercase tracking-widest">Your Posts</h2>
                    </div>
                )}

                {/* Posts List */}
                {!isEditing && (
                    <div className="space-y-6">
                        {posts.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-white/5 rounded-[3rem] border border-gray-200 dark:border-gray-800">
                                <p className="text-gray-400 dark:text-gray-500 font-bold mb-4">You haven't posted anything yet.</p>
                                <Link href="/dashboard/community" className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform inline-block">
                                    Go to Community
                                </Link>
                            </div>
                        ) : (
                            posts.map(post => {
                                const isLiked = post.likes?.includes(user?.uid || '');
                                return (
                                    <div key={post.id} className="p-6 md:p-8 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="scale-110 origin-left">
                                                    <UserBadge uid={post.authorId} size="sm" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-black dark:text-white leading-tight">{formData.displayName}</span>
                                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                                                        {formatTimeAgo(post.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeletePost(post.id)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-300 dark:text-gray-600 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="mb-6">
                                            {post.type !== 'general' && (
                                                <span className="inline-block px-3 py-1 bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gray-800 rounded-full text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-widest mb-3">
                                                    {post.type.replace('_share', '')}
                                                </span>
                                            )}
                                            {post.title && <h3 className="text-xl font-black text-black dark:text-white mb-3 tracking-tight">{post.title}</h3>}
                                            <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">{post.content}</p>
                                        </div>

                                        <div className="flex items-center border-t border-gray-100 dark:border-gray-800 pt-5 mt-2">
                                            <div className="flex items-center space-x-6">
                                                <button
                                                    onClick={() => handleLike(post)}
                                                    className={cn(
                                                        "flex items-center space-x-2 text-sm font-bold transition-all group/btn",
                                                        isLiked ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                                        isLiked ? "bg-gray-100 dark:bg-white/10" : "bg-transparent group-hover/btn:bg-gray-50 dark:group-hover/btn:bg-white/5"
                                                    )}>
                                                        <Heart className={cn("w-5 h-5 transition-transform", isLiked && "fill-current group-hover/btn:scale-110")} />
                                                    </div>
                                                    <span>{post.likes?.length || 0}</span>
                                                </button>
                                                <button className="flex items-center space-x-2 text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-all group/btn">
                                                    <div className="w-10 h-10 rounded-full bg-transparent group-hover/btn:bg-gray-50 dark:group-hover/btn:bg-white/5 flex items-center justify-center transition-colors">
                                                        <MessageCircle className="w-5 h-5" />
                                                    </div>
                                                    <span>{post.commentCount || 0}</span>
                                                </button>
                                            </div>
                                            <button className="w-10 h-10 ml-auto rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-105 transition-all">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </main>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-sm p-8 rounded-[2rem] bg-white dark:bg-[#0A0A18] border border-gray-100 dark:border-gray-800 shadow-2xl text-center space-y-8">
                            <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-600 border border-red-100 dark:border-red-900 shadow-sm">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-black dark:text-white mb-3">Delete Account?</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                                    This action is final. You will lose all your study data and AI history forever.
                                </p>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <button onClick={handleDeleteAccount} disabled={loading} className="w-full py-4 rounded-full bg-red-600 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-red-600/20 hover:bg-red-700 hover:-translate-y-0.5 transition-all">
                                    {loading ? 'Deleting...' : 'Delete Permanently'}
                                </button>
                                <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-4 rounded-full bg-gray-100 dark:bg-white/10 text-black dark:text-white font-bold uppercase tracking-widest text-[10px] hover:bg-gray-200 dark:hover:bg-white/20 transition-all">
                                    Keep My Account
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
