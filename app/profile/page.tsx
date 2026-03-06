'use client';

import DashboardShell from '@/components/DashboardShell';
import UserReviews from '@/components/UserReviews';
import { useAuth } from '@/context/AuthContext';
import { auth, db } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Camera, Save, User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [school, setSchool] = useState('');
    const [level, setLevel] = useState('');
    const [bio, setBio] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!user) return;
        setName(user.displayName || '');
        setPhotoURL(user.photoURL || '');
        getDoc(doc(db, 'users', user.uid)).then(d => {
            if (d.exists()) {
                const data = d.data();
                setUsername(data.username || '');
                setSchool(data.school || '');
                setLevel(data.schoolLevel || '');
                setBio(data.bio || '');
            } else {
                // Set default username if not exists
                setUsername(user.displayName?.toLowerCase().replace(/\s+/g, '') || user.email?.split('@')[0] || '');
            }
        });
    }, [user]);

    const save = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await updateProfile(auth.currentUser!, {
                displayName: name,
                photoURL: photoURL
            });
            await setDoc(doc(db, 'users', user.uid), {
                name,
                username: username.startsWith('@') ? username : `@${username}`,
                photoURL,
                school,
                schoolLevel: level,
                bio
            }, { merge: true });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoURL(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <DashboardShell>
            <div className="p-6 max-w-xl mx-auto">
                <div className="mb-8 border-b border-black/5 dark:border-white/5 pb-4">
                    <p className="text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-widest mb-1">Account</p>
                    <h1 className="text-3xl font-black text-black dark:text-white tracking-tight">Profile</h1>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-5 mb-8 p-5 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/8 shadow-sm dark:shadow-none transition-colors">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center overflow-hidden border border-black/5 dark:border-white/10">
                            {photoURL
                                ? <Image src={photoURL} alt="Avatar" width={64} height={64} className="object-cover" />
                                : <User className="w-8 h-8 text-black/30 dark:text-white/30" />}
                        </div>
                        <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg border-2 border-white dark:border-[#0a0a0a] cursor-pointer hover:bg-indigo-700 transition-colors">
                            <Camera className="w-3.5 h-3.5 text-white" />
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        </label>
                    </div>
                    <div>
                        <p className="text-base font-black text-black dark:text-white">{name || 'Your Name'}</p>
                        <p className="text-xs text-black/35 dark:text-white/35 font-medium">{username || '@username'}</p>
                        <span className="mt-1.5 inline-block px-2 py-0.5 rounded-md bg-indigo-600/10 text-[9px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-wider">Free Plan</span>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {[
                        { label: 'Full Name', val: name, set: setName, ph: 'Your full name' },
                        { label: 'Username', val: username, set: setUsername, ph: '@username' },
                        { label: 'School / University', val: school, set: setSchool, ph: 'e.g. Addis Ababa University' },
                        { label: 'Education Level', val: level, set: setLevel, ph: 'e.g. Undergraduate' },
                    ].map(({ label, val, set, ph }) => (
                        <div key={label}>
                            <label className="text-[10px] font-black text-black/35 dark:text-white/35 uppercase tracking-widest mb-1.5 block">{label}</label>
                            <input value={val} onChange={e => set(e.target.value)} placeholder={ph}
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/8 text-black dark:text-white text-sm placeholder:text-black/20 dark:placeholder:text-white/20 outline-none focus:border-indigo-600 transition-colors shadow-sm dark:shadow-none" />
                        </div>
                    ))}
                    <div>
                        <label className="text-[10px] font-black text-black/35 dark:text-white/35 uppercase tracking-widest mb-1.5 block">Bio</label>
                        <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell the community about yourself..." rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/8 text-black dark:text-white text-sm placeholder:text-black/20 dark:placeholder:text-white/20 outline-none focus:border-indigo-600 shadow-sm dark:shadow-none resize-none transition-colors" />
                    </div>
                    <button onClick={save} disabled={saving}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-black text-sm hover:opacity-90 transition-all disabled:opacity-40 shadow-lg mt-4">
                        <Save className="w-4 h-4" />{saved ? 'Saved! ✓' : saving ? 'Saving...' : 'Save Changes'}
                    </button>

                    {/* User reviews management */}
                    <UserReviews />
                </div>
            </div>
        </DashboardShell>
    );
}
