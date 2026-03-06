'use client';

import { useAuth } from '@/context/AuthContext';
import { auth, db, storage } from '@/lib/firebase';
import { deleteAccount } from '@/lib/user';
import { formatTimeAgo } from '@/lib/utils';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Briefcase,
    Calendar as CalendarIcon,
    Camera,
    Check,
    Edit3,
    GraduationCap,
    Hash,
    LogOut,
    Mail,
    MapPin,
    Save,
    Trash2,
    User,
    X
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function ProfilePage() {
    const { user, profile } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form states
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Editable fields
    const [formData, setFormData] = useState({
        displayName: '',
        username: '',
        bio: '',
        location: '',
        profession: '',
        interests: '',
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                displayName: profile.displayName || user?.displayName || '',
                username: profile.username || '',
                bio: profile.bio || '',
                location: profile.location || '',
                profession: profile.profession || '',
                interests: profile.interests || '',
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
                displayName: formData.displayName, // Ensure consistency
            });
            // Update Auth profile as well
            const { updateProfile } = require('firebase/auth');
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
            const { updateProfile } = require('firebase/auth');
            await updateProfile(user, { photoURL: url });
        } catch (error) {
            console.error('Error uploading avatar:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up md:p-6">
            {/* Profile Header */}
            <header className="relative p-10 md:p-16 rounded-[48px] bg-white/5 border border-white/10 overflow-hidden group">
                <div className="absolute top-0 right-0 p-20 text-walia-primary/5 -rotate-12 transition-transform group-hover:scale-150">
                    <User className="w-80 h-80" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-10">
                    <div className="relative group/avatar">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] bg-black flex items-center justify-center font-black text-white text-5xl md:text-6xl border-4 border-white/10 shadow-2xl overflow-hidden relative">
                            {profile?.photoURL ? (
                                <Image src={profile.photoURL} alt="Avatar" fill className="object-cover" />
                            ) : (
                                <span className="opacity-20">{formData.displayName.charAt(0) || 'U'}</span>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-black border border-white/20 text-white hover:border-indigo-500 transition-all shadow-xl z-20"
                        >
                            <Camera className="w-5 h-5 text-indigo-500" />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            {isEditing ? (
                                <input
                                    className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-2xl font-black text-white outline-none focus:border-indigo-500"
                                    value={formData.displayName}
                                    onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                />
                            ) : (
                                <h1 className="text-3xl md:text-4xl font-black text-white break-all">{formData.displayName || 'Student User'}</h1>
                            )}
                            <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase text-indigo-500 tracking-widest self-center md:self-start md:mt-1">
                                {profile?.plan === 'pro' ? 'Pro Member' : 'Free Plan'}
                            </span>
                        </div>

                        {isEditing ? (
                            <textarea
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-sm text-white/60 outline-none focus:border-indigo-500 h-20 resize-none"
                                value={formData.bio}
                                placeholder="Write a short bio..."
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            />
                        ) : (
                            <p className="text-white/40 text-sm font-medium mb-6 leading-relaxed max-w-xl">
                                {formData.bio || 'Mastering AI & Computer Science @ Walia Academy'}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSave} disabled={loading} className="px-8 py-3 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest flex items-center hover:scale-105 transition-all">
                                        <Save className="w-4 h-4 mr-2" /> Save Changes
                                    </button>
                                    <button onClick={() => setIsEditing(false)} className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white/50 hover:bg-white/10 transition-all flex items-center">
                                        <X className="w-4 h-4 mr-2" /> Cancel
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white/50 hover:text-white hover:border-white/20 transition-all flex items-center group">
                                    <Edit3 className="w-4 h-4 mr-2 group-hover:text-indigo-500" /> Edit Profile
                                </button>
                            )}

                            <AnimatePresence>
                                {saveSuccess && (
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center text-green-500 font-bold text-xs ml-2">
                                        <Check className="w-4 h-4 mr-1" /> Profile Saved!
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Sidebar: Details */}
                <div className="space-y-8">
                    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-8">
                        <h2 className="text-lg font-bold text-white mb-2">Personal Details</h2>

                        <div className="space-y-6">
                            {[
                                { icon: Mail, label: 'Email', value: user?.email || 'N/A', field: null },
                                { icon: Hash, label: 'Username', value: profile?.username || 'Not set', field: 'username' },
                                { icon: MapPin, label: 'Location', value: formData.location || 'Addis Ababa', field: 'location' },
                                { icon: Briefcase, label: 'Profession', value: formData.profession || 'Student', field: 'profession' },
                                { icon: GraduationCap, label: 'Interests', value: formData.interests || 'AI, CS', field: 'interests' },
                                { icon: CalendarIcon, label: 'Joined', value: formatTimeAgo(profile?.createdAt), field: null },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 shrink-0">
                                        <item.icon className="w-4 h-4 text-white/30" />
                                    </div>
                                    <div className="overflow-hidden flex-1">
                                        <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">{item.label}</p>
                                        {isEditing && item.field ? (
                                            <input
                                                className="w-full bg-transparent border-b border-white/10 text-sm font-bold text-indigo-400 outline-none mt-1"
                                                value={(formData as any)[item.field]}
                                                onChange={e => setFormData({ ...formData, [item.field as string]: e.target.value })}
                                            />
                                        ) : (
                                            <p className="text-sm font-bold text-white/80 truncate leading-relaxed">
                                                {item.field === 'username' && item.value !== 'Not set' ? `@${item.value}` : item.value}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full py-5 rounded-[32px] bg-white/5 border border-white/5 text-white/40 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center hover:bg-white/10 hover:text-white transition-all shadow-lg"
                    >
                        <LogOut className="w-5 h-5 mr-3" /> Logout
                    </button>
                </div>

                {/* Content: Goals & Danger Zone */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="p-10 rounded-[40px] bg-white/5 border border-white/10 space-y-10">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2">Goals & Objectives</h2>
                            <p className="text-white/40 text-sm font-medium leading-relaxed">Specific topics you've selected to master with Walia.</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {profile?.goals?.length > 0 ? profile.goals.map((goal: string) => (
                                <span key={goal} className="px-5 py-3 rounded-2xl bg-black border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mr-3 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                                    {goal}
                                </span>
                            )) : (
                                <p className="text-white/20 italic text-sm">No goals identified yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="p-10 rounded-[40px] bg-red-500/5 border border-red-500/10 space-y-6">
                        <div>
                            <h2 className="text-2xl font-black text-red-500 mb-2">Danger Zone</h2>
                            <p className="text-white/40 text-sm font-medium leading-relaxed">Sensitive operations that cannot be undone.</p>
                        </div>

                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-between group shadow-xl hover:shadow-red-500/20"
                        >
                            <span>Delete My Account</span>
                            <Trash2 className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteConfirm(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="relative w-full max-w-md p-10 rounded-[48px] bg-black border border-white/10 shadow-3xl text-center space-y-8"
                        >
                            <div className="w-20 h-20 bg-red-500/20 rounded-[32px] flex items-center justify-center mx-auto">
                                <Trash2 className="w-10 h-10 text-red-500" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-white">Are you sure?</h3>
                                <p className="text-white/40 font-medium leading-relaxed">
                                    Deleting your account will permanently remove all your messages, study notes, and AI history. This action <span className="text-white">cannot be undone</span>.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={loading}
                                    className="w-full py-5 rounded-3xl bg-red-600 text-white font-black uppercase tracking-widest text-sm hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 disabled:opacity-50"
                                >
                                    {loading ? 'Deleting...' : 'Yes, Delete Everything'}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="w-full py-5 rounded-3xl bg-white/5 text-white/40 font-bold uppercase tracking-widest text-xs hover:text-white transition-all"
                                >
                                    No, Keep My Account
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
