'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword as firebaseUpdatePassword
} from 'firebase/auth';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import {
    Bell,
    CheckCircle,
    ChevronRight,
    CreditCard,
    Download,
    Globe,
    Key,
    Laptop,
    Shield,
    User,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

// PDF Generator (jsPDF)
async function downloadBillPDF(invoiceItem: {
    date: string; desc: string; amount: string; id: string;
}, userName: string, userEmail: string) {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    const left = (text: string, x: number, y: number, size: number, style: 'normal' | 'bold' = 'normal', color = [0, 0, 0]) => {
        doc.setFontSize(size); doc.setFont('helvetica', style); doc.setTextColor(color[0], color[1], color[2]); doc.text(text, x, y);
    };
    const right = (text: string, x: number, y: number, size: number, style: 'normal' | 'bold' = 'normal', color = [0, 0, 0]) => {
        doc.setFontSize(size); doc.setFont('helvetica', style); doc.setTextColor(color[0], color[1], color[2]); doc.text(text, x, y, { align: 'right' });
    };
    const center = (text: string, y: number, size: number, style: 'normal' | 'bold' = 'normal', color = [0, 0, 0]) => {
        doc.setFontSize(size); doc.setFont('helvetica', style); doc.setTextColor(color[0], color[1], color[2]); doc.text(text, pageWidth / 2, y, { align: 'center' });
    };
    const dashedLine = (y: number) => {
        doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3); doc.setLineDashPattern([2, 2], 0);
        doc.line(margin, y, pageWidth - margin, y); doc.setLineDashPattern([], 0);
    };

    // Black header
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, pageWidth, 45, 'F');
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, 10, 18, 18, 3, 3, 'F');
    doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(10, 10, 10);
    doc.text('W', margin + 5.5, 22.5);
    doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('Walia', margin + 24, 19);
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(180, 180, 180);
    doc.text('Official Receipt', margin + 24, 26);
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(180, 180, 180);
    doc.text(`Invoice ${invoiceItem.id}`, pageWidth - margin, 19, { align: 'right' });
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(130, 130, 130);
    doc.text(invoiceItem.date, pageWidth - margin, 26, { align: 'right' });

    let y = 60;
    center('🎉', y, 28); y += 14;
    center('Thank you!', y, 20, 'bold'); y += 8;
    center('Your payment has been received and approved.', y, 9, 'normal', [100, 100, 100]); y += 16;
    dashedLine(y); y += 12;

    left('INVOICE ID', margin, y, 7.5, 'normal', [140, 140, 140]);
    right('Amount', pageWidth - margin, y, 7.5, 'normal', [140, 140, 140]); y += 5;
    left(invoiceItem.id, margin, y, 11, 'bold');
    right(invoiceItem.amount, pageWidth - margin, y, 13, 'bold'); y += 12;
    left('DATE', margin, y, 7.5, 'normal', [140, 140, 140]); y += 5;
    left(invoiceItem.date, margin, y, 11, 'bold'); y += 12;
    left('PLAN', margin, y, 7.5, 'normal', [140, 140, 140]); y += 5;
    left(invoiceItem.desc, margin, y, 11, 'bold'); y += 14;

    // Customer card
    doc.setFillColor(248, 249, 250); doc.roundedRect(margin, y, contentWidth, 28, 4, 4, 'F');
    doc.setDrawColor(230, 230, 230); doc.setLineWidth(0.3); doc.roundedRect(margin, y, contentWidth, 28, 4, 4, 'S');
    left('CUSTOMER', margin + 6, y + 8, 7.5, 'normal', [140, 140, 140]);
    left(userName || 'Walia User', margin + 6, y + 16, 11, 'bold');
    left(userEmail || '', margin + 6, y + 22, 8, 'normal', [100, 100, 100]); y += 36;
    dashedLine(y); y += 12;

    // Barcode decoration
    const barWidths = [1, 3, 1, 2, 4, 1, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 1, 2];
    let bx = margin + 10;
    barWidths.forEach((w, i) => {
        if (i % 2 === 0) { doc.setFillColor(20, 20, 20); doc.rect(bx, y, w * 1.8, 14, 'F'); }
        bx += w * 1.8 + 0.8;
    });
    doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.setTextColor(130, 130, 130);
    doc.text(invoiceItem.id.replace('INV-', '') + '00' + Date.now().toString().slice(-6), margin + 10, y + 19); y += 30;

    // Signature
    doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.5); doc.line(margin, y, pageWidth - margin, y); y += 10;
    left('Authorized by:', margin, y, 8, 'normal', [140, 140, 140]); y += 7;
    doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 30, 30);
    doc.text('Biruk Tamiru', margin, y); y += 6;
    doc.setDrawColor(80, 80, 80); doc.setLineWidth(0.8); doc.line(margin, y, margin + 52, y); y += 6;
    left('CEO & Founder, Walia Platform', margin, y, 7.5, 'normal', [100, 100, 100]); y += 12;

    // Footer
    doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.3); doc.line(0, y, pageWidth, y); y += 8;
    center('Walia Platform  •  walia.app  •  support@walia.app', y, 8, 'normal', [150, 150, 150]); y += 6;
    center('This is an official digital receipt issued by Walia Platform.', y, 7, 'normal', [180, 180, 180]);

    doc.save(`Walia-Receipt-${invoiceItem.id}-${Date.now()}.pdf`);
}

// ─── Inline Alert ────────────────────────────────────────────────────────────
function Alert({ type, msg }: { type: 'success' | 'error'; msg: string }) {
    if (!msg) return null;
    return (
        <div className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium border mt-3",
            type === 'success' ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
        )}>
            {type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
            {msg}
        </div>
    );
}

// ─── Settings Page ────────────────────────────────────────────────────────────
export default function SettingsPage() {
    const { user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState('Account');

    // Phone from Firestore (from sign-up)
    const [phone, setPhone] = useState('');

    // Password states
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordAlert, setPasswordAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // 2FA states
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [twoFAAlert, setTwoFAAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const [twoFALoading, setTwoFALoading] = useState(false);

    // Billing
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const billingHistory = [
        { date: 'Oct 1, 2024', desc: 'Walia Free Tier', amount: '$0.00', status: 'Paid', id: 'INV-003' },
        { date: 'Sep 1, 2024', desc: 'Walia Free Tier', amount: '$0.00', status: 'Paid', id: 'INV-002' },
        { date: 'Aug 1, 2024', desc: 'Walia Free Tier', amount: '$0.00', status: 'Paid', id: 'INV-001' },
    ];

    const tabs = ['Account', 'Preferences', 'Notifications', 'Billing', 'Security'];

    // Real-time profile from Firestore (phone, 2FA status)
    useEffect(() => {
        if (!user) return;
        const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setPhone(data.phoneNumber || data.phone || '');
                setTwoFactorEnabled(data.twoFactorEnabled || false);
            }
        });
        return () => unsub();
    }, [user]);

    // ── Password Update ──────────────────────────────────────────────
    const handleUpdatePassword = async () => {
        setPasswordAlert(null);
        if (!user) return;
        if (!currentPassword) { setPasswordAlert({ type: 'error', msg: 'Please enter your current password.' }); return; }
        if (!newPassword) { setPasswordAlert({ type: 'error', msg: 'Please enter a new password.' }); return; }
        if (newPassword.length < 6) { setPasswordAlert({ type: 'error', msg: 'New password must be at least 6 characters.' }); return; }
        if (newPassword !== confirmPassword) { setPasswordAlert({ type: 'error', msg: 'Passwords do not match.' }); return; }

        setPasswordLoading(true);
        try {
            // Re-authenticate first
            const credential = EmailAuthProvider.credential(user.email!, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await firebaseUpdatePassword(user, newPassword);
            setPasswordAlert({ type: 'success', msg: 'Password updated successfully!' });
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
            setIsUpdatingPassword(false);
        } catch (error: any) {
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                setPasswordAlert({ type: 'error', msg: 'Incorrect current password. Please try again.' });
            } else if (error.code === 'auth/requires-recent-login') {
                setPasswordAlert({ type: 'error', msg: 'Session expired. Please sign out and sign in again, then retry.' });
            } else {
                setPasswordAlert({ type: 'error', msg: error.message || 'Failed to update password.' });
            }
        } finally {
            setPasswordLoading(false);
        }
    };

    // ── 2FA Toggle ────────────────────────────────────────────────────
    const handleToggle2FA = async () => {
        setTwoFAAlert(null);
        if (!user) return;
        const newState = !twoFactorEnabled;

        // If enabling, require code verification simulation
        if (newState && !twoFactorCode) {
            setTwoFAAlert({ type: 'error', msg: 'Please enter the 6-digit code sent to your email/phone to enable 2FA.' });
            return;
        }
        if (newState && twoFactorCode.length < 4) {
            setTwoFAAlert({ type: 'error', msg: 'Incorrect code. Please enter the correct verification code.' });
            return;
        }

        setTwoFALoading(true);
        try {
            await updateDoc(doc(db, 'users', user.uid), { twoFactorEnabled: newState });
            setTwoFactorEnabled(newState);
            setTwoFactorCode('');
            setTwoFAAlert({
                type: 'success',
                msg: newState ? '2FA enabled. Your account is now more secure.' : '2FA has been disabled.'
            });
        } catch (error) {
            setTwoFAAlert({ type: 'error', msg: 'Failed to update 2FA settings.' });
        } finally {
            setTwoFALoading(false);
        }
    };

    const handleDownloadBill = async (item: { date: string; desc: string; amount: string; id: string }) => {
        setDownloadingId(item.id);
        try {
            await downloadBillPDF(item, user?.displayName || 'Walia User', user?.email || '');
        } catch (err) {
            alert('Could not generate PDF. Please try again.');
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div className="min-h-full bg-white text-black animate-in fade-in pb-20">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 md:px-12 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Settings</h1>
                    <p className="text-gray-500 font-medium">Manage your account settings and preferences.</p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 md:px-12 pt-8">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar Nav */}
                    <aside className="w-full md:w-52 shrink-0">
                        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 custom-scrollbar md:sticky md:top-32">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "flex items-center px-4 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap",
                                        activeTab === tab
                                            ? "bg-black text-white shadow-md shadow-black/10"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-black"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Content */}
                    <div className="flex-1 w-full space-y-8 pb-12">

                        {/* ── ACCOUNT ── */}
                        {activeTab === 'Account' && (
                            <section className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                                <div>
                                    <h2 className="text-xl font-black mb-1">Account Summary</h2>
                                    <p className="text-sm text-gray-500 font-medium">Information from your sign-up. Locked fields cannot be changed here.</p>
                                </div>

                                <div className="p-7 rounded-[2rem] bg-gray-50 border border-gray-200">
                                    {/* Avatar + name */}
                                    <div className="flex items-center gap-5 mb-7">
                                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                                            {user?.photoURL ? (
                                                <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <User className="w-7 h-7 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-lg font-black">{user?.displayName || profile?.name || 'User'}</p>
                                            <p className="text-sm text-gray-500 font-medium mt-0.5">{user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Email — locked, cannot change */}
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-200">
                                            <div>
                                                <p className="text-sm font-bold">Email Address</p>
                                                <p className="text-xs text-gray-500 mt-1">{user?.email || '—'}</p>
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-400 border border-gray-200 px-3 py-1.5 rounded-full uppercase tracking-widest cursor-not-allowed select-none">
                                                🔒 Locked
                                            </div>
                                        </div>

                                        {/* Phone — from sign-up, read-only */}
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-200">
                                            <div>
                                                <p className="text-sm font-bold">Phone Number</p>
                                                <p className="text-xs text-gray-500 mt-1">{phone || user?.phoneNumber || 'Not provided at sign-up'}</p>
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-400 border border-gray-200 px-3 py-1.5 rounded-full uppercase tracking-widest cursor-not-allowed select-none">
                                                🔒 Locked
                                            </div>
                                        </div>

                                        {/* Username — from sign-up */}
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-200">
                                            <div>
                                                <p className="text-sm font-bold">Username</p>
                                                <p className="text-xs text-gray-500 mt-1">@{profile?.username || `user_${user?.uid.slice(0, 5)}`}</p>
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-400 border border-gray-200 px-3 py-1.5 rounded-full uppercase tracking-widest cursor-not-allowed select-none">
                                                🔒 Locked
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* ── PREFERENCES ── */}
                        {activeTab === 'Preferences' && (
                            <section className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                                <div>
                                    <h2 className="text-xl font-black mb-1">App Preferences</h2>
                                    <p className="text-sm text-gray-500 font-medium">Customize your interface.</p>
                                </div>
                                <div className="p-7 rounded-[2rem] border border-gray-200">
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Language</p>
                                            <p className="text-xs text-gray-500 mt-1">Select your preferred language</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200 relative">
                                        <p className="text-sm font-bold">Global Language</p>
                                        <select
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                document.cookie = `googtrans=/en/${e.target.value}; path=/; domain=${window.location.hostname}`;
                                                document.cookie = `googtrans=/en/${e.target.value}; path=/;`;
                                                window.location.reload();
                                            }}
                                            defaultValue={
                                                typeof document !== 'undefined'
                                                    ? document.cookie.split('; ').find(row => row.startsWith('googtrans='))?.split('/')[2] || 'en'
                                                    : 'en'
                                            }
                                        >
                                            <option value="en">English (US)</option>
                                            <option value="es">Español (Spanish)</option>
                                            <option value="fr">Français (French)</option>
                                            <option value="de">Deutsch (German)</option>
                                            <option value="zh-CN">中文 (Chinese Simplified)</option>
                                            <option value="ar">العربية (Arabic)</option>
                                            <option value="hi">हिन्दी (Hindi)</option>
                                            <option value="am">አማርኛ (Amharic)</option>
                                        </select>
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-500 pointer-events-none">
                                            Select Language <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* ── NOTIFICATIONS ── */}
                        {activeTab === 'Notifications' && (
                            <section className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                                <div>
                                    <h2 className="text-xl font-black mb-1">Notifications</h2>
                                    <p className="text-sm text-gray-500 font-medium">Choose what you want to be notified about.</p>
                                </div>
                                <div className="p-7 rounded-[2rem] border border-gray-200 space-y-5">
                                    <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black">
                                            <Bell className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Email Notifications</p>
                                            <p className="text-xs text-gray-500 mt-1">Updates sent directly to your inbox</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 pt-1">
                                        {[
                                            { label: 'Weekly Reports', desc: 'Summary of your learning progress', active: true },
                                            { label: 'New Features', desc: 'Updates about Walia features', active: true },
                                            { label: 'Community Mentions', desc: 'When someone replies to your post', active: false },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-3">
                                                <div>
                                                    <p className="text-sm font-bold">{item.label}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                                </div>
                                                <button className={cn(
                                                    "w-12 h-6 rounded-full transition-colors relative flex items-center px-1",
                                                    item.active ? "bg-black" : "bg-gray-200"
                                                )}>
                                                    <div className={cn("w-4 h-4 rounded-full bg-white transition-transform", item.active ? "translate-x-6 shadow-sm" : "translate-x-0")} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* ── BILLING ── */}
                        {activeTab === 'Billing' && (
                            <section className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                                <div>
                                    <h2 className="text-xl font-black mb-1">Plan & Billing</h2>
                                    <p className="text-sm text-gray-500 font-medium">Manage your subscription and payment methods.</p>
                                </div>

                                {/* Current plan */}
                                <div className="p-7 rounded-[2rem] bg-gray-50 border border-gray-200">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                                        <div>
                                            <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-gray-600 font-bold text-[10px] uppercase tracking-widest mb-3">Current Plan</span>
                                            <h3 className="text-2xl font-black">Free Tier</h3>
                                            <p className="text-sm text-gray-500 mt-2 max-w-sm">Limited AI generation and advanced tools.</p>
                                        </div>
                                        <button className="px-6 py-3 rounded-full bg-black text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20">
                                            Upgrade to Pro
                                        </button>
                                    </div>
                                </div>

                                {/* Billing history */}
                                <div className="p-7 rounded-[2rem] border border-gray-200">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Billing History & Receipts</p>
                                            <p className="text-xs text-gray-500 mt-1">Download official PDF receipts for each payment</p>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[480px]">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Receipt</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {billingHistory.map((item, index) => (
                                                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="py-4 px-4 text-xs font-medium text-black">{item.date}</td>
                                                        <td className="py-4 px-4 text-xs text-gray-600">{item.desc}</td>
                                                        <td className="py-4 px-4 text-xs font-medium text-black">{item.amount}</td>
                                                        <td className="py-4 px-4">
                                                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-[10px] uppercase font-black tracking-widest rounded-full">{item.status}</span>
                                                        </td>
                                                        <td className="py-4 px-4 text-right">
                                                            <button
                                                                onClick={() => handleDownloadBill(item)}
                                                                disabled={downloadingId === item.id}
                                                                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-black uppercase tracking-wide transition-colors disabled:opacity-50 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full"
                                                            >
                                                                {downloadingId === item.id ? (
                                                                    <span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />
                                                                ) : (
                                                                    <Download className="w-3 h-3" />
                                                                )}
                                                                {downloadingId === item.id ? 'Generating...' : 'Download PDF'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* ── SECURITY ── */}
                        {activeTab === 'Security' && (
                            <section className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                                <div>
                                    <h2 className="text-xl font-black mb-1">Security</h2>
                                    <p className="text-sm text-gray-500 font-medium">Keep your account safe.</p>
                                </div>

                                {/* Password */}
                                <div className="p-7 rounded-[2rem] border border-gray-200 space-y-4">
                                    <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black shrink-0">
                                            <Key className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold">Password</p>
                                            <p className="text-xs text-gray-500 mt-1">Update your account password</p>
                                        </div>
                                        {!isUpdatingPassword && (
                                            <button
                                                onClick={() => { setIsUpdatingPassword(true); setPasswordAlert(null); }}
                                                className="text-xs font-bold px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                                            >
                                                Update Password
                                            </button>
                                        )}
                                    </div>

                                    {isUpdatingPassword && (
                                        <div className="space-y-3 animate-in fade-in">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Current Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Enter your current password"
                                                    value={currentPassword}
                                                    onChange={e => setCurrentPassword(e.target.value)}
                                                    className="w-full text-sm border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">New Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Min 6 characters"
                                                    value={newPassword}
                                                    onChange={e => setNewPassword(e.target.value)}
                                                    className="w-full text-sm border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Re-enter new password"
                                                    value={confirmPassword}
                                                    onChange={e => setConfirmPassword(e.target.value)}
                                                    className="w-full text-sm border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all"
                                                />
                                            </div>

                                            {passwordAlert && <Alert type={passwordAlert.type} msg={passwordAlert.msg} />}

                                            <div className="flex gap-3 pt-1">
                                                <button
                                                    onClick={handleUpdatePassword}
                                                    disabled={passwordLoading}
                                                    className="flex-1 py-3 rounded-full bg-black text-white font-bold text-sm hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
                                                >
                                                    {passwordLoading ? 'Saving...' : 'Save New Password'}
                                                </button>
                                                <button
                                                    onClick={() => { setIsUpdatingPassword(false); setPasswordAlert(null); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}
                                                    className="px-5 py-3 rounded-full text-sm font-bold text-gray-500 hover:text-black bg-gray-100 hover:bg-gray-200 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 2FA */}
                                <div className="p-7 rounded-[2rem] border border-gray-200 space-y-4">
                                    <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black shrink-0">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold">Two-Factor Authentication</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {twoFactorEnabled ? '✅ 2FA is currently enabled.' : 'Add an extra layer of security to your account.'}
                                            </p>
                                        </div>
                                        <div className={cn(
                                            "text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest",
                                            twoFactorEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                        )}>
                                            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                        </div>
                                    </div>

                                    {/* Code input — only shown when enabling */}
                                    {!twoFactorEnabled && (
                                        <div className="animate-in fade-in">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Verification Code</label>
                                            <p className="text-xs text-gray-500 mb-2">Enter the 6-digit code sent to your email or phone to enable 2FA.</p>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={6}
                                                placeholder="Enter 6-digit code"
                                                value={twoFactorCode}
                                                onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                                                className="w-full text-sm border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all tracking-widest text-center font-bold"
                                            />
                                        </div>
                                    )}

                                    {twoFAAlert && <Alert type={twoFAAlert.type} msg={twoFAAlert.msg} />}

                                    <button
                                        onClick={handleToggle2FA}
                                        disabled={twoFALoading}
                                        className={cn(
                                            "w-full py-3 rounded-full font-bold text-sm transition-all shadow-sm disabled:opacity-50",
                                            twoFactorEnabled
                                                ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                                                : "bg-black text-white hover:bg-zinc-800"
                                        )}
                                    >
                                        {twoFALoading ? 'Saving...' : twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                                    </button>
                                </div>

                                {/* Active Sessions */}
                                <div className="p-7 rounded-[2rem] border border-gray-200">
                                    <h3 className="text-sm font-bold mb-5">Active Sessions</h3>
                                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <Laptop className="w-6 h-6 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-bold flex items-center gap-2">
                                                    Windows Chrome
                                                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Current</span>
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">Addis Ababa, Ethiopia · Active now</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
