'use client';

import DashboardShell from '@/components/DashboardShell';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Check, Crown, Upload, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

const FREE_FEATURES = [
    { text: '5 AI messages per day', included: true },
    { text: 'Basic study tools', included: true },
    { text: 'Community access', included: true },
    { text: '5 image uploads per day', included: true },
    { text: 'Unlimited AI messages', included: false },
    { text: 'GPT-4 & Claude models', included: false },
    { text: 'All 11 Pro tools', included: false },
];

const PRO_FEATURES = [
    'Unlimited AI Chat Messages',
    'GPT-4, Gemini 2.0 & Claude',
    'Unlimited Image Uploads',
    'All 11 Professional Tools',
    'Study Analytics & Reports',
    'Ad-free Experience',
    'Priority Support',
    'Early Access to New Features',
];

export default function UpgradePage() {
    const { user } = useAuth();
    const [yearly, setYearly] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [email, setEmail] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const monthly = 12;
    const yearly_price = Math.round(monthly * 12 * 0.75); // $108 (25% off)

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !email || !user) return;

        setUploading(true);
        try {
            // Upload screenshot
            const storageRef = ref(storage, `payments/${user.uid}/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            // Save request to Firestore
            await addDoc(collection(db, 'upgrades'), {
                userId: user.uid,
                name: user.displayName || 'Unknown User',
                username: user.displayName || 'unknown',
                email: email,
                screenshotURL: downloadURL,
                status: 'Pending',
                planRequest: yearly ? 'yearly' : 'monthly',
                createdAt: serverTimestamp(),
            });

            setSuccess(true);
            setTimeout(() => {
                setShowPaymentForm(false);
                setSuccess(false);
                setFile(null);
                setEmail('');
            }, 5000);
        } catch (error) {
            console.error('Error uploading payment proof:', error);
            alert('Failed to submit request. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (showPaymentForm) {
        return (
            <DashboardShell>
                <div className="p-6 max-w-xl mx-auto h-full flex flex-col justify-center">
                    <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 relative overflow-hidden">
                        <button onClick={() => setShowPaymentForm(false)} className="absolute top-6 right-6 p-2 rounded-full bg-black/20 text-white/50 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-8 relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20">
                                <Upload className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-black text-white">Upload Payment Proof</h2>
                            <p className="text-white/40 text-sm mt-1">Please transfer <span className="text-white font-bold">${yearly ? yearly_price : monthly}</span> to our account and upload the receipt screenshot below.</p>
                        </div>

                        {success ? (
                            <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-center relative z-10">
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-6 h-6 text-black" />
                                </div>
                                <h3 className="text-lg font-black text-green-400 mb-1">Request Submitted!</h3>
                                <p className="text-green-500/60 text-sm">Your payment proof is under review. Your account will be upgraded shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleUploadSubmit} className="space-y-6 relative z-10">
                                <div>
                                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Payment Email</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors placeholder:text-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Screenshot</label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${file ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}
                                    >
                                        {file ? (
                                            <div className="flex flex-col items-center text-center px-4">
                                                <Check className="w-6 h-6 text-indigo-400 mb-2" />
                                                <p className="text-sm font-bold text-white truncate max-w-full">{file.name}</p>
                                                <p className="text-xs text-white/40 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="w-6 h-6 text-white/30 mb-2" />
                                                <p className="text-sm font-medium text-white/60">Click to upload image</p>
                                                <p className="text-xs text-white/30 mt-1">JPG, PNG up to 5MB</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!file || !email || uploading}
                                    className="w-full py-4 rounded-xl bg-indigo-600 text-white font-black uppercase tracking-wider text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center"
                                >
                                    {uploading ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : 'Submit Payment Request'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <div className="p-6 max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center mx-auto mb-4">
                        <Crown className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Unlock Everything</p>
                    <h1 className="text-3xl font-black text-white tracking-tight">Upgrade to Pro</h1>
                    <p className="text-white/40 mt-2 text-sm">Get unlimited access to all Walia AI features.</p>
                </div>

                {/* Toggle */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <span className={`text-sm font-bold ${!yearly ? 'text-white' : 'text-white/30'}`}>Monthly</span>
                    <button onClick={() => setYearly(v => !v)}
                        className={`relative w-12 h-6 rounded-full transition-all ${yearly ? 'bg-indigo-500' : 'bg-white/10'}`}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${yearly ? 'left-[26px]' : 'left-0.5'}`} />
                    </button>
                    <span className={`text-sm font-bold ${yearly ? 'text-white' : 'text-white/30'}`}>
                        Yearly <span className="text-green-400 text-xs">Save 25%</span>
                    </span>
                </div>

                {/* Price Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Free */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/8 relative z-0">
                        <p className="text-xs font-black text-white/30 uppercase tracking-widest mb-3">Free</p>
                        <div className="flex items-end gap-1 mb-4">
                            <span className="text-4xl font-black text-white">$0</span>
                            <span className="text-white/30 text-sm mb-1">/forever</span>
                        </div>
                        <ul className="space-y-2 mb-6">
                            {FREE_FEATURES.map(f => (
                                <li key={f.text} className="flex items-center gap-2 text-xs">
                                    {f.included
                                        ? <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                                        : <X className="w-3.5 h-3.5 text-white/15 shrink-0" />}
                                    <span className={f.included ? 'text-white/70' : 'text-white/20'}>{f.text}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="w-full py-2.5 rounded-xl border border-white/10 text-xs font-bold text-white/30 text-center">
                            Current Plan
                        </div>
                    </div>

                    {/* Pro */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/60 to-violet-900/60 border border-indigo-500/40 relative overflow-hidden z-0">
                        <div className="absolute top-0 right-0 px-3 py-1.5 bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest z-10">
                            Most Popular
                        </div>
                        <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-3 relative z-10">Pro</p>
                        <div className="flex items-end gap-1 mb-1 relative z-10">
                            <span className="text-4xl font-black text-white">${yearly ? yearly_price : monthly}</span>
                            <span className="text-white/40 text-sm mb-1">/{yearly ? 'year' : 'month'}</span>
                        </div>
                        {yearly && <p className="text-xs text-white/30 line-through mb-3 relative z-10">${monthly * 12}/year</p>}
                        <ul className="space-y-2 mb-6 mt-4 relative z-10">
                            {PRO_FEATURES.map(f => (
                                <li key={f} className="flex items-center gap-2 text-xs">
                                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                    <span className="text-white/80">{f}</span>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setShowPaymentForm(true)} className="w-full py-3 rounded-xl bg-white text-black font-black text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2 relative z-10">
                            <Zap className="w-4 h-4" /> Upgrade Now
                        </button>
                    </div>
                </div>

                <p className="text-center text-xs text-white/20">
                    Secure payment · Cancel anytime · <Link href="/legal/terms" className="underline z-10 relative cursor-pointer hover:text-white/50">Terms</Link>
                </p>
            </div>
        </DashboardShell>
    );
}
