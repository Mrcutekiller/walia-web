'use client';

import DashboardShell from '@/components/DashboardShell';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Check, Crown, X, Zap, ArrowRight, Upload, Info, Loader2, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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
    const { user, profile } = useAuth();
    const [step, setStep] = useState(1); // 1: Pricing, 2: Payment Method, 3: Proof
    const [yearly, setYearly] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [uploading, setUploading] = useState(false);
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [success, setSuccess] = useState(false);

    const isEthiopia = profile?.country === 'Ethiopia';
    const currency = isEthiopia ? 'ETB' : 'USD';
    
    // Pricing
    const monthlyPrice = isEthiopia ? 1200 : 10;
    const yearlyPrice = isEthiopia ? 10000 : 100;

    const currentPrice = yearly ? yearlyPrice : monthlyPrice;

    const ethMethods = [
        { id: 'telebirr', name: 'Telebirr', details: 'Phone: 0911223344 (Username: Walia AI)' },
        { id: 'cbe', name: 'CBE (Commercial Bank)', details: 'Account: 1000123456789 (Name: Walia Trading)' }
    ];

    const intlMethods = [
        { id: 'binance', name: 'Binance Pay', details: 'ID: 123456789 (Username: WaliaAI_Intl)' },
        { id: 'bybit', name: 'ByBit', details: 'UID: 987654321' },
        { id: 'crypto', name: 'TRC20 / BNB Address', details: 'Address: TXXXXXXXXXXXX (TRC20) or 0xXXXXXXXXXX (BNB)' }
    ];

    const methods = isEthiopia ? ethMethods : intlMethods;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setScreenshot(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!screenshot || !selectedMethod || !user) return;
        setUploading(true);

        try {
            // 1. Upload screenshot
            const storageRef = ref(storage, `payment_proofs/${user.uid}_${Date.now()}`);
            await uploadBytes(storageRef, screenshot);
            const proofURL = await getDownloadURL(storageRef);

            // 2. Create payment request
            await addDoc(collection(db, 'payment_requests'), {
                userId: user.uid,
                userEmail: user.email,
                userName: profile?.name || user.displayName,
                plan: yearly ? 'yearly' : 'monthly',
                amount: currentPrice,
                currency,
                method: selectedMethod,
                proofURL,
                status: 'processing',
                createdAt: serverTimestamp()
            });

            // 3. Send Notification to User
            await addDoc(collection(db, 'notifications'), {
                userId: user.uid,
                title: 'Payment Processing',
                message: `We've received your payment proof for the ${yearly ? 'Yearly' : 'Monthly'} Pro plan. Our team is verifying it now.`,
                type: 'system',
                read: false,
                createdAt: serverTimestamp()
            });

            setSuccess(true);
        } catch (error) {
            console.error('Error submitting payment:', error);
            alert('Failed to submit payment. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (success) {
        return (
            <DashboardShell>
                <div className="p-12 max-w-xl mx-auto text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                        <Check className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-black text-white">Proof Submitted!</h1>
                    <p className="text-white/60 leading-relaxed">
                        Thank you for upgrading. Your payment proof has been sent to our admin team for verification. 
                        You will receive a notification once your Pro plan is activated (usually within 1-2 hours).
                    </p>
                    <Link href="/dashboard" className="inline-block px-8 py-4 rounded-2xl bg-white text-black font-black hover:scale-[1.02] transition-transform">
                        Back to Dashboard
                    </Link>
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <div className="p-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
                        <Crown className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Elevate Your Learning</p>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        {step === 1 ? 'Choose Your Plan' : step === 2 ? 'Select Payment Method' : 'Upload Proof'}
                    </h1>
                </div>

                {step === 1 && (
                    <div className="space-y-8">
                        {/* Toggle */}
                        <div className="flex items-center justify-center gap-4">
                            <span className={`text-sm font-bold transition-colors ${!yearly ? 'text-white' : 'text-white/30'}`}>Monthly</span>
                            <button onClick={() => setYearly(v => !v)}
                                className={`relative w-14 h-7 rounded-full transition-all ${yearly ? 'bg-indigo-600' : 'bg-white/10'}`}>
                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all ${yearly ? 'left-[32px]' : 'left-1'}`} />
                            </button>
                            <span className={`text-sm font-bold transition-colors ${yearly ? 'text-white' : 'text-white/30'}`}>
                                Yearly <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-wider">Save 15%</span>
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Free */}
                            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 flex flex-col">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-6">Standard</p>
                                <div className="flex items-end gap-1 mb-8">
                                    <span className="text-5xl font-black text-white">$0</span>
                                    <span className="text-white/30 text-sm mb-1.5 font-bold">/forever</span>
                                </div>
                                <ul className="space-y-4 mb-10 flex-1">
                                    {FREE_FEATURES.map(f => (
                                        <li key={f.text} className="flex items-start gap-3 text-xs font-medium">
                                            {f.included
                                                ? <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5 text-white" /></div>
                                                : <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center shrink-0"><X className="w-2.5 h-2.5 text-white/20" /></div>}
                                            <span className={f.included ? 'text-white/70' : 'text-white/20'}>{f.text}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-black uppercase tracking-widest text-white/30 text-center">
                                    Current Plan
                                </div>
                            </div>

                            {/* Pro */}
                            <div className="p-8 rounded-[32px] bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/40 relative overflow-hidden flex flex-col">
                                <div className="absolute top-0 right-0 px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                                    Pro Access
                                </div>
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Premium</p>
                                <div className="flex items-end gap-1 mb-1">
                                    <span className="text-5xl font-black text-white">{currency === 'ETB' ? '' : '$'}{currentPrice} {currency === 'ETB' ? 'ETB' : ''}</span>
                                    <span className="text-white/40 text-sm mb-1.5 font-bold">/{yearly ? 'year' : 'month'}</span>
                                </div>
                                {yearly && <p className="text-xs text-indigo-400 font-bold mb-8 italic">Best Value: One-time annual payment</p>}
                                <ul className="space-y-4 mb-10 mt-2 flex-1">
                                    {PRO_FEATURES.map(f => (
                                        <li key={f} className="flex items-center gap-3 text-xs font-bold text-white/90">
                                            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                                                <Zap className="w-2.5 h-2.5 text-white" />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button 
                                    onClick={() => setStep(2)}
                                    className="w-full py-4 rounded-2xl bg-white text-black font-black text-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-xl shadow-white/10"
                                >
                                    Proceed to Payment <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            {methods.map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => setSelectedMethod(m.id)}
                                    className={`p-6 rounded-[24px] border text-left transition-all ${selectedMethod === m.id ? 'bg-indigo-600/20 border-indigo-500 shadow-xl shadow-indigo-500/10' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg font-black text-white">{m.name}</span>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === m.id ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-white/10'}`}>
                                            {selectedMethod === m.id && <Check className="w-4 h-4" />}
                                        </div>
                                    </div>
                                    <p className="text-sm text-white/50 font-medium font-mono">{m.details}</p>
                                </button>
                            ))}
                        </div>
                        
                        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex gap-4 text-xs text-indigo-300 leading-relaxed italic">
                            <Info className="w-5 h-5 shrink-0" />
                            Please make the payment of {currentPrice} {currency} using one of the methods above. Save a screenshot or photo of the receipt to submit in the next step.
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold text-sm">Back</button>
                            <button 
                                disabled={!selectedMethod}
                                onClick={() => setStep(3)}
                                className="flex-[2] py-4 rounded-2xl bg-white text-black font-black text-sm disabled:opacity-50 transition-transform active:scale-95"
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="max-w-xl mx-auto space-y-8">
                        <div className="relative group cursor-pointer">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={`w-full h-64 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center transition-all ${screenshot ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 bg-white/5 group-hover:border-indigo-500/40'}`}>
                                {screenshot ? (
                                    <>
                                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                                            <Check className="w-8 h-8 text-green-500" />
                                        </div>
                                        <p className="text-white font-bold">{screenshot.name}</p>
                                        <p className="text-xs text-white/40 mt-1">Tap to change image</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="w-8 h-8 text-white/40" />
                                        </div>
                                        <p className="text-white font-bold">Upload Your Receipt</p>
                                        <p className="text-xs text-white/40 mt-1">Click or drag & drop (JPG, PNG)</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(2)} className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold text-sm">Back</button>
                            <button 
                                onClick={handleSubmit}
                                disabled={!screenshot || uploading}
                                className="flex-[2] py-4 rounded-2xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
                            >
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Submit Proof</>}
                            </button>
                        </div>
                        <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-widest">Walia Payment Verification Unit</p>
                    </div>
                )}
            </div>
        </DashboardShell>
    );
}
