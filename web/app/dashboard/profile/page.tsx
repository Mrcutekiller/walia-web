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
    Calendar,
    Camera,
    ChevronRight,
    Edit3,
    Loader2,
    Lock,
    LogOut,
    Mail,
    MessageSquare,
    Shield,
    Trash2,
    User
} from 'lucide-react';
import Image from 'next/image';
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
        <div className="min-h-screen bg-[#F8FAFC] pb-20 md:pb-10">
            {/* Header Section */}
            <div className="relative h-64 md:h-72 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] border-4 border-white shadow-2xl overflow-hidden bg-slate-100 ring-8 ring-white/10">
                                {user?.photoURL ? (
                                    <Image src={user.photoURL} alt="Profile" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                                        <User className="w-16 h-16 text-indigo-200" />
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="absolute bottom-2 right-2 p-3 rounded-2xl bg-white text-indigo-600 shadow-xl hover:scale-110 active:scale-95 transition-all border border-slate-100 group-hover:shadow-indigo-500/20"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                        </div>

                        <div className="text-center md:text-left pb-2">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                                    {formData.displayName || 'Set Name'}
                                </h1>
                                <button onClick={() => setIsEditing(true)} className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-white transition-all shadow-sm">
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-[10px] uppercase tracking-widest border border-indigo-100">
                                    @{profile?.username || 'student'}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-widest border border-slate-200">
                                    Free Plan
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form / Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {isEditing ? (
                            <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm space-y-6">
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Edit Profile</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Display Name</label>
                                        <input
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-semibold"
                                            value={formData.displayName}
                                            onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Bio</label>
                                        <textarea
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium h-32 resize-none"
                                            value={formData.bio}
                                            placeholder="Tell the community about yourself..."
                                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => setIsEditing(false)} className="flex-1 py-4 rounded-2xl bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                                    <button onClick={handleSave} disabled={loading} className="flex-[2] py-4 rounded-2xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </section>
                        ) : (
                            <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">About Me</h2>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    {formData.bio || "No biography provided yet. Click the edit button to share your story!"}
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
                                    {[
                                        { icon: User, label: 'Identity', value: 'Verified Student' },
                                        { icon: Mail, label: 'Contact', value: user?.email },
                                        { icon: Calendar, label: 'Member Since', value: user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A' },
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <item.icon className="w-5 h-5 text-indigo-500 mb-3" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                            <p className="text-xs font-bold text-slate-900 truncate">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Security & Preferences</h2>
                            <div className="space-y-2">
                                {[
                                    { icon: Lock, label: 'Privacy Settings', desc: 'Control who sees your activity' },
                                    { icon: Bell, label: 'Email Notifications', desc: 'Manage your alerts and updates' },
                                    { icon: Shield, label: 'Account Security', desc: 'Secure your login and data' },
                                ].map((item, i) => (
                                    <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-slate-900">{item.label}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Actions / Stats */}
                    <div className="space-y-8">
                        <section className="bg-white border border-slate-100 rounded-[32px] p-2 shadow-sm">
                            <button onClick={() => window.dispatchEvent(new CustomEvent('trigger-review-popup'))} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-indigo-50 transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-bold text-slate-900">Feedback</p>
                                    <p className="text-xs text-slate-400 font-medium">Help us improve</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-rose-50 transition-all group mt-1">
                                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-bold text-slate-900">Logout</p>
                                    <p className="text-xs text-slate-400 font-medium">Securely sign out</p>
                                </div>
                            </button>
                        </section>

                        <section className="bg-rose-50/50 border border-rose-100 rounded-[32px] p-8 text-center">
                            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-4">Danger Zone</p>
                            <button onClick={() => setShowDeleteConfirm(true)} className="text-xs font-bold text-rose-600 hover:text-rose-700 underline underline-offset-4">
                                Delete Account Permanently
                            </button>
                        </section>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-sm p-8 rounded-[40px] bg-white border border-slate-100 shadow-2xl text-center space-y-6">
                            <div className="w-16 h-16 bg-rose-100 rounded-3xl flex items-center justify-center mx-auto text-rose-600">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Delete Account?</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                    This action is final. You will lose all your study data and AI history forever.
                                </p>
                            </div>
                            <div className="space-y-2 pt-2">
                                <button onClick={handleDeleteAccount} disabled={loading} className="w-full py-4 rounded-2xl bg-rose-600 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all">
                                    {loading ? 'Deleting...' : 'Delete Permanently'}
                                </button>
                                <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-4 rounded-2xl bg-slate-50 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all">
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
