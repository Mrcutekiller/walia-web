'use client';

import { useAuth } from '@/context/AuthContext';
import { auth, db, storage } from '@/lib/firebase';
import { deleteAccount } from '@/lib/user';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bell,
    Camera,
    Check,
    ChevronRight,
    Crown,
    Edit3,
    HelpCircle,
    Loader2,
    Lock,
    LogOut,
    Moon,
    Shield,
    Trash2,
    User
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function ProfilePage() {
    const { user, profile } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // States
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [uploading, setUploading] = useState(false);

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

    const handleLogout = async () => {
        await auth.signOut();
        router.push('/');
    };

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                ...formData,
            });
            await updateProfile(user, { displayName: formData.displayName });
            setSaveSuccess(true);
            setIsEditing(false);
            setTimeout(() => setSaveSuccess(false), 3000);
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

    return (
        <div className="animate-fade-in flex flex-col pb-8 bg-[#f8f9fa] dark:bg-[#0a0a0a] min-h-full">

            {/* Header Background */}
            <div className="h-40 bg-gradient-to-br from-[#6C63FF] to-[#7C75FF] dark:from-[#1A1A2E] dark:to-[#0D0D1A] -mx-4 -mt-4 md:-mx-6 md:-mt-6 lg:-mx-10 lg:-mt-10 relative shrink-0">
                <div className="absolute top-6 right-6 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hidden">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Free Plan</span>
                </div>
            </div>

            {/* Profile Info Overlap */}
            <div className="px-6 -mt-16 flex flex-col items-center mb-8 relative z-10">
                <div className="relative mb-4 group">
                    <div className="w-32 h-32 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center font-black text-indigo-600 dark:text-white text-5xl border-4 border-[#f8f9fa] dark:border-[#0a0a0a] shadow-xl overflow-hidden relative">
                        {profile?.photoURL ? (
                            <Image src={profile.photoURL} alt="Avatar" fill className="object-cover" />
                        ) : (
                            <span>{formData.displayName.charAt(0)?.toUpperCase() || 'U'}</span>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="absolute bottom-1 right-1 p-2.5 rounded-full bg-indigo-600 text-white border-2 border-[#f8f9fa] dark:border-[#0a0a0a] shadow-lg hover:scale-110 transition-transform z-20"
                    >
                        <Camera className="w-4 h-4" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                </div>

                {isEditing ? (
                    <div className="w-full max-w-sm space-y-3 mt-2">
                        <input
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-lg font-black text-black dark:text-white outline-none focus:border-indigo-500 text-center"
                            value={formData.displayName}
                            onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                            placeholder="Your Name"
                        />
                        <textarea
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black/70 dark:text-white/70 outline-none focus:border-indigo-500 h-20 resize-none text-center"
                            value={formData.bio}
                            placeholder="Write a short bio..."
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                        />
                        <div className="flex justify-center gap-2 pt-2">
                            <button onClick={() => setIsEditing(false)} className="px-5 py-2 rounded-full bg-black/10 dark:bg-white/10 text-xs font-bold text-black/60 dark:text-white/60">Cancel</button>
                            <button onClick={handleSave} disabled={loading} className="px-6 py-2 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-md disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <h2 className="text-2xl font-black text-black dark:text-white">{formData.displayName || 'Student User'}</h2>
                            <button onClick={() => setIsEditing(true)} className="p-1.5 rounded-full text-black/30 dark:text-white/30 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-3">@{profile?.username || user?.email?.split('@')[0]}</p>

                        {formData.bio && (
                            <p className="text-black/50 dark:text-white/50 text-xs font-medium max-w-xs mx-auto mb-4">{formData.bio}</p>
                        )}

                        <AnimatePresence>
                            {saveSuccess && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-widest mt-2">
                                    <Check className="w-3 h-3 mr-1" /> Profile Saved
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <div className="px-4 space-y-6 max-w-lg mx-auto w-full">
                {/* Pro Banner */}
                {profile?.plan !== 'pro' && (
                    <Link href="/dashboard/upgrade" className="block p-5 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-white/10 rotate-12 group-hover:scale-110 transition-transform">
                            <Crown className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-white mb-1">Unlock Walia Pro</h3>
                                <p className="text-xs text-white/70 font-medium">Ultimate study tools & unlimited AI.</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <ChevronRight className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </Link>
                )}

                {/* Settings Sections */}

                {/* Account */}
                <div>
                    <h4 className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest mb-3 pl-2">Account Options</h4>
                    <div className="bg-white dark:bg-[#1A1A2E] rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={() => setIsEditing(true)}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center"><User className="w-4 h-4 text-blue-500" /></div>
                                <span className="text-sm font-bold text-black dark:text-white">Edit Profile</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-black/20 dark:text-white/20" />
                        </div>
                        <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center"><Bell className="w-4 h-4 text-purple-500" /></div>
                                <span className="text-sm font-bold text-black dark:text-white">Notifications</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-black/20 dark:text-white/20" />
                        </div>
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center"><Shield className="w-4 h-4 text-emerald-500" /></div>
                                <span className="text-sm font-bold text-black dark:text-white">Privacy & Security</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-black/20 dark:text-white/20" />
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div>
                    <h4 className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest mb-3 pl-2">Preferences</h4>
                    <div className="bg-white dark:bg-[#1A1A2E] rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center"><Moon className="w-4 h-4 text-indigo-500" /></div>
                                <span className="text-sm font-bold text-black dark:text-white">Appearance</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-black/20 dark:text-white/20" />
                        </div>
                    </div>
                </div>

                {/* Support */}
                <div>
                    <h4 className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest mb-3 pl-2">Support</h4>
                    <div className="bg-white dark:bg-[#1A1A2E] rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center"><HelpCircle className="w-4 h-4 text-amber-500" /></div>
                                <span className="text-sm font-bold text-black dark:text-white">Help Center</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-black/20 dark:text-white/20" />
                        </div>
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-500/10 flex items-center justify-center"><Lock className="w-4 h-4 text-gray-500" /></div>
                                <span className="text-sm font-bold text-black dark:text-white">Legal & Policies</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-black/20 dark:text-white/20" />
                        </div>
                    </div>
                </div>

                {/* Action Zone */}
                <div className="pt-2 pb-6">
                    <button onClick={handleLogout} className="w-full p-4 rounded-full bg-white dark:bg-[#1A1A2E] border border-black/5 dark:border-white/5 text-black/60 dark:text-white/60 font-bold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center justify-center shadow-sm mb-4">
                        <LogOut className="w-5 h-5 mr-2" /> Log Out
                    </button>

                    <button onClick={() => setShowDeleteConfirm(true)} className="w-full text-center text-xs font-bold text-red-500/70 hover:text-red-500 transition-colors uppercase tracking-widest p-2">
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="relative w-full max-w-sm p-8 rounded-[40px] bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-2xl text-center space-y-6">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                                <Trash2 className="w-8 h-8 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-black dark:text-white mb-2">Delete Account?</h3>
                                <p className="text-black/50 dark:text-white/50 text-sm font-medium leading-relaxed">
                                    All your data, AI chats, and study progress will be permanently erased.
                                </p>
                            </div>
                            <div className="space-y-2 pt-2">
                                <button onClick={handleDeleteAccount} disabled={loading} className="w-full py-4 rounded-full bg-red-500 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-red-500/20 disabled:opacity-50">
                                    {loading ? 'Deleting...' : 'Delete Everything'}
                                </button>
                                <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-4 rounded-full bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 font-bold uppercase tracking-widest text-xs">
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
