'use client';

import AvatarSelector from '@/components/AvatarSelector';
import DashboardShell from '@/components/DashboardShell';
import UserReviews from '@/components/UserReviews';
import { useAuth } from '@/context/AuthContext';
import { auth, db } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [school, setSchool] = useState('');
    const [level, setLevel] = useState('');
    const [bio, setBio] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [useCases, setUseCases] = useState<string[]>([]);
    const [whyWalia, setWhyWalia] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!user) return;
        getDoc(doc(db, 'users', user.uid)).then(d => {
            if (d.exists()) {
                const data = d.data();
                setName(data.name || user.displayName || '');
                setUsername(data.username || '');
                setPhotoURL(data.photoURL || user.photoURL || '');
                setSchool(data.school || '');
                setLevel(data.schoolLevel || '');
                setBio(data.bio || '');
                setGender(data.gender || '');
                setAge(data.age || '');
                setUseCases(data.useCases || []);
                setWhyWalia(data.whyWalia || '');
            } else {
                setName(user.displayName || '');
                setPhotoURL(user.photoURL || '');
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
                bio,
                gender,
                age,
                useCases,
                whyWalia
            }, { merge: true });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardShell>
            <div className="p-6 max-w-xl mx-auto pb-20">
                <div className="mb-8 border-b border-black/5 dark:border-white/5 pb-4">
                    <p className="text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-widest mb-1">Account</p>
                    <h1 className="text-3xl font-black text-black dark:text-white tracking-tight">Profile</h1>
                </div>

                {/* Selection Area */}
                <div className="mb-10 p-2 sm:p-5 rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/8 shadow-sm dark:shadow-none">
                    <AvatarSelector selectedAvatar={photoURL} onSelect={setPhotoURL} />
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {[
                        { label: 'Full Name', val: name, set: setName, ph: 'Your full name' },
                        { label: 'Username', val: username, set: setUsername, ph: '@username' },
                        { label: 'School / University', val: school, set: setSchool, ph: 'e.g. Addis Ababa University' },
                        { label: 'Education Level', val: level, set: setLevel, ph: 'e.g. Undergraduate' },
                        { label: 'Gender', val: gender, set: setGender, ph: 'Male / Female / Other' },
                        { label: 'Age', val: age, set: setAge, ph: 'e.g. 21', type: 'number' },
                    ].map(({ label, val, set, ph, type }) => (
                        <div key={label}>
                            <label className="text-[10px] font-black text-black/35 dark:text-white/35 uppercase tracking-widest mb-1.5 block">{label}</label>
                            <input type={type || 'text'} value={val} onChange={e => set(e.target.value)} placeholder={ph}
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/8 text-black dark:text-white text-sm placeholder:text-black/20 dark:placeholder:text-white/20 outline-none focus:border-indigo-600 transition-colors shadow-sm dark:shadow-none" />
                        </div>
                    ))}

                    {useCases.length > 0 && (
                        <div>
                            <label className="text-[10px] font-black text-black/35 dark:text-white/35 uppercase tracking-widest mb-1.5 block">Your Goals</label>
                            <div className="flex flex-wrap gap-2">
                                {useCases.map((goal, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[10px] font-black text-black/60 dark:text-white/60 uppercase tracking-wider border border-black/5 dark:border-white/5">
                                        {goal}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-[10px] font-black text-black/35 dark:text-white/35 uppercase tracking-widest mb-1.5 block">Bio</label>
                        <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell the community about yourself..." rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/8 text-black dark:text-white text-sm placeholder:text-black/20 dark:placeholder:text-white/20 outline-none focus:border-indigo-600 shadow-sm dark:shadow-none resize-none transition-colors" />
                    </div>

                    {whyWalia && (
                        <div>
                            <label className="text-[10px] font-black text-black/35 dark:text-white/35 uppercase tracking-widest mb-1.5 block">Why Walia?</label>
                            <p className="text-sm text-black/60 dark:text-white/60 italic px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                                "{whyWalia}"
                            </p>
                        </div>
                    )}

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
