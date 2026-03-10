'use client';

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
    AlertTriangle,
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
        <div className="min-h-full bg-[#FAFAFA] text-black animate-in fade-in pb-20 selection:bg-black selection:text-white">

            <main className="max-w-3xl mx-auto px-4 pt-8 md:pt-12 space-y-8">

                {/* Profile Card */}
                <div className="bg-white rounded-[3rem] p-2 border border-gray-200 shadow-xl shadow-black-[0.02] relative">
                    <div className="relative h-48 md:h-56 rounded-[2.5rem] overflow-hidden bg-gray-100 border border-gray-100 mb-16">
                        {/* Soft background graphic for banner */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-transparent opacity-50" />

                        {/* Profile Image - Centered and overflowing bottom */}
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 group cursor-pointer" onClick={() => !isEditing && fileInputRef.current?.click()}>
                            <div className="p-1 rounded-full bg-white relative">
                                <div className="absolute inset-0 rounded-full ring-2 ring-gray-100 scale-[1.05] transition-transform group-hover:scale-110" />
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center relative">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="User Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-black text-gray-300">{formData.displayName?.charAt(0) || '?'}</span>
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
                                <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs shadow-md border border-gray-100 hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-black font-bold text-xs shadow-md border border-gray-100 hover:bg-gray-50 hover:shadow-lg transition-all">
                                        <Edit3 className="w-4 h-4" /> <span className="hidden sm:inline">Edit</span>
                                    </button>
                                    <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-black font-bold text-xs shadow-md border border-gray-100 hover:bg-gray-50 hover:shadow-lg transition-all">
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
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Display Name</label>
                                    <input
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-black outline-none focus:border-black focus:bg-white transition-all font-semibold text-center"
                                        value={formData.displayName}
                                        onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Bio</label>
                                    <textarea
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-black outline-none focus:border-black focus:bg-white transition-all font-medium h-32 resize-none text-center custom-scrollbar"
                                        value={formData.bio}
                                        placeholder="Tell the community about yourself..."
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                </div>
                                <button onClick={handleSave} disabled={loading} className="w-full py-4 rounded-full bg-black text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 hover:bg-zinc-800">
                                    {loading ? 'Saving...' : 'Save Profile'}
                                </button>

                                <div className="pt-6 mt-6 border-t border-gray-100 flex justify-center">
                                    <button onClick={() => setShowDeleteConfirm(true)} className="text-xs font-bold text-red-500 hover:text-red-700 underline underline-offset-4 decoration-red-200 hover:decoration-red-600 transition-colors">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center animate-in fade-in">
                                <h1 className="text-3xl font-black tracking-tight text-black mb-1">
                                    {formData.displayName || 'Set your name'}
                                </h1>
                                <p className="text-sm font-bold text-gray-400 mb-4 tracking-wide">
                                    @{profile?.username || `user_${user.uid.slice(0, 5)}`}
                                </p>

                                <p className="max-w-md mx-auto text-[15px] font-medium text-gray-600 leading-relaxed mb-8">
                                    {formData.bio || "You haven't added a bio yet. Click the edit button to tell everyone who you are."}
                                </p>

                                {/* Stats Row */}
                                <div className="flex items-center justify-center gap-4 bg-gray-50 rounded-[2rem] p-4 max-w-sm mx-auto border border-gray-100">
                                    <div className="flex-1">
                                        <p className="text-lg font-black text-black">{posts.length}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Posts</p>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200" />
                                    <div className="flex-1">
                                        <p className="text-lg font-black text-black">{profile?.followersCount || 0}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Followers</p>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200" />
                                    <div className="flex-1">
                                        <p className="text-lg font-black text-black">{profile?.followingCount || 0}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Following</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Posts Heading */}
                {!isEditing && (
                    <div className="px-4 py-2 border-b-2 border-black w-fit mt-10 mb-6 mx-auto md:mx-0">
                        <h2 className="text-sm font-black text-black uppercase tracking-widest">Your Posts</h2>
                    </div>
                )}

                {/* Posts List */}
                {!isEditing && (
                    <div className="space-y-6">
                        {posts.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-[3rem] border border-gray-200">
                                <p className="text-gray-400 font-bold mb-4">You haven't posted anything yet.</p>
                                <Link href="/dashboard/community" className="px-6 py-3 rounded-full bg-black text-white font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform inline-block">
                                    Go to Community
                                </Link>
                            </div>
                        ) : (
                            posts.map(post => {
                                const isLiked = post.likes?.includes(user?.uid || '');
                                return (
                                    <div key={post.id} className="p-6 md:p-8 rounded-[3rem] bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="scale-110 origin-left">
                                                    <UserBadge uid={post.authorId} size="sm" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-black leading-tight">{formData.displayName}</span>
                                                    <span className="text-xs font-bold text-gray-400">
                                                        {formatTimeAgo(post.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeletePost(post.id)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
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
                )}
            </main>

            {/* Delete Confirmation Modal (Concept 3: Minimalist) */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-[360px] p-8 rounded-[2rem] bg-[#F8F9FA] shadow-2xl text-center flex flex-col items-center">

                            {/* Warning Icon Container */}
                            <div className="w-[72px] h-[72px] bg-white rounded-3xl flex items-center justify-center text-red-500 mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                                <AlertTriangle className="w-8 h-8 stroke-[2px]" />
                            </div>

                            {/* Titles */}
                            <h3 className="text-[22px] font-black text-black mb-2 tracking-tight">Delete Account</h3>
                            <p className="text-[#6B7280] text-[15px] font-medium leading-relaxed mb-8">
                                You're going to delete your "Account"
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-4 rounded-2xl bg-[#E5E7EB] text-[#4B5563] font-bold text-[14px] hover:bg-gray-300 transition-colors shadow-sm"
                                >
                                    No, keep it.
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={loading}
                                    className="flex-1 py-4 rounded-2xl bg-[#FF3B30] text-white font-bold text-[14px] hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50"
                                >
                                    {loading ? '...' : 'Yes, Delete!'}
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
