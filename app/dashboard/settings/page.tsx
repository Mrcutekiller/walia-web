'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
    Bell,
    ChevronRight,
    CreditCard,
    Download,
    Globe,
    Key,
    Laptop,
    Shield,
    User
} from 'lucide-react';
import { useEffect, useState } from 'react';

// ─── PDF Generator ──────────────────────────────────────────────────────────
async function downloadBillPDF(invoiceItem: {
    date: string;
    desc: string;
    amount: string;
    id: string;
}, userName: string, userEmail: string) {
    // Dynamically import jsPDF to keep bundle small
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // ── Helpers ────────────────────────────────────────
    const center = (text: string, y: number, size: number, style: 'normal' | 'bold' = 'normal', color = [0, 0, 0]) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(text, pageWidth / 2, y, { align: 'center' });
    };
    const left = (text: string, x: number, y: number, size: number, style: 'normal' | 'bold' = 'normal', color = [0, 0, 0]) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(text, x, y);
    };
    const right = (text: string, x: number, y: number, size: number, style: 'normal' | 'bold' = 'normal', color = [0, 0, 0]) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(text, x, y, { align: 'right' });
    };
    const hLine = (y: number, x1 = margin, x2 = pageWidth - margin, color = [220, 220, 220], lw = 0.3) => {
        doc.setDrawColor(color[0], color[1], color[2]);
        doc.setLineWidth(lw);
        doc.line(x1, y, x2, y);
    };
    const dashedLine = (y: number) => {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.setLineDashPattern([2, 2], 0);
        doc.line(margin, y, pageWidth - margin, y);
        doc.setLineDashPattern([], 0);
    };
    const fillRect = (x: number, y: number, w: number, h: number, r = 0, g = 0, b = 0) => {
        doc.setFillColor(r, g, b);
        doc.rect(x, y, w, h, 'F');
    };

    // ── Black Header Banner ──────────────────────────────
    fillRect(0, 0, pageWidth, 45, 10, 10, 10);

    // Logo placeholder — draw a small rounded black square with "W"
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, 10, 18, 18, 3, 3, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 10, 10);
    doc.text('W', margin + 5.5, 22.5);

    // App name in header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Walia', margin + 24, 19);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 180, 180);
    doc.text('Official Receipt', margin + 24, 25);

    // Receipt label (right side of header)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 180, 180);
    doc.text(`Invoice ${invoiceItem.id}`, pageWidth - margin, 19, { align: 'right' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(130, 130, 130);
    doc.text(invoiceItem.date, pageWidth - margin, 25, { align: 'right' });

    let y = 60;

    // ── Thank you section ──────────────────────────────────
    center('🎉', y, 28); y += 14;
    center('Thank you!', y, 20, 'bold'); y += 8;
    center('Your payment has been received and approved.', y, 9, 'normal', [100, 100, 100]); y += 16;

    // ── Dashed divider ─────────────────────────────────────
    dashedLine(y); y += 12;

    // ── Details block ──────────────────────────────────────
    const col1 = margin;
    const col2 = pageWidth - margin;

    // Invoice ID / Amount
    left('INVOICE ID', col1, y, 7.5, 'normal', [140, 140, 140]); right('Amount', col2, y, 7.5, 'normal', [140, 140, 140]); y += 5;
    left(invoiceItem.id, col1, y, 11, 'bold', [20, 20, 20]); right(invoiceItem.amount, col2, y, 13, 'bold', [20, 20, 20]); y += 12;

    // Date
    left('DATE', col1, y, 7.5, 'normal', [140, 140, 140]); y += 5;
    left(invoiceItem.date, col1, y, 11, 'bold', [20, 20, 20]); y += 12;

    // Plan / Description
    left('PLAN', col1, y, 7.5, 'normal', [140, 140, 140]); y += 5;
    left(invoiceItem.desc, col1, y, 11, 'bold', [20, 20, 20]); y += 14;

    // ── Light gray card: Customer info ────────────────────
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(margin, y, contentWidth, 28, 4, 4, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 28, 4, 4, 'S');

    left('CUSTOMER', col1 + 6, y + 8, 7.5, 'normal', [140, 140, 140]);
    left(userName || 'Walia User', col1 + 6, y + 16, 11, 'bold', [20, 20, 20]);
    left(userEmail || '', col1 + 6, y + 22, 8, 'normal', [100, 100, 100]);
    y += 36;

    // ── Dashed divider ─────────────────────────────────────
    dashedLine(y); y += 12;

    // ── Barcode-style decoration ─────────────────────────
    const barWidths = [1, 3, 1, 2, 4, 1, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 1, 2];
    let bx = margin + 10;
    const barY = y;
    const barH = 14;
    barWidths.forEach((w, i) => {
        if (i % 2 === 0) {
            fillRect(bx, barY, w * 1.8, barH, 20, 20, 20);
        }
        bx += w * 1.8 + 0.8;
    });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(130, 130, 130);
    doc.text(invoiceItem.id.replace('INV-', '') + '00' + Date.now().toString().slice(-6), margin + 10, y + barH + 5);
    y += barH + 14;

    // ── Footer divider ─────────────────────────────────────
    hLine(y, margin, pageWidth - margin, [230, 230, 230], 0.5);
    y += 10;

    // ── CEO / Founder Signature Block ─────────────────────
    // Left: Signature area
    left('Authorized by:', col1, y, 8, 'normal', [140, 140, 140]); y += 7;

    // Decorative signature (simple cursive-style text simulation)
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('Biruk Tamiru', col1, y); y += 6;

    // Underline for signature
    hLine(y, col1, col1 + 52, [80, 80, 80], 0.8); y += 6;

    left('CEO & Founder, Walia Platform', col1, y, 7.5, 'normal', [100, 100, 100]); y += 12;

    // ── Footer ─────────────────────────────────────────────
    hLine(y, 0, pageWidth, [220, 220, 220]); y += 8;

    center('Walia Platform  •  walia.app  •  support@walia.app', y, 8, 'normal', [150, 150, 150]); y += 6;
    center('This is an official digital receipt issued by Walia Platform.', y, 7, 'normal', [180, 180, 180]);

    // ── Save PDF ───────────────────────────────────────────
    doc.save(`Walia-Receipt-${invoiceItem.id}-${Date.now()}.pdf`);
}

// ─── Settings Page ───────────────────────────────────────────────────────────
export default function SettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Account');

    // Security States
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const tabs = ['Account', 'Preferences', 'Notifications', 'Billing', 'Security'];

    useEffect(() => {
        if (!user) return;
        const fetchSecuritySettings = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists() && userDoc.data().twoFactorEnabled !== undefined) {
                    setTwoFactorEnabled(userDoc.data().twoFactorEnabled);
                }
            } catch (error) {
                console.error("Error fetching 2FA status:", error);
            }
        };
        fetchSecuritySettings();
    }, [user]);

    const handleUpdatePassword = async () => {
        if (!user || !newPassword) return;
        try {
            await updatePassword(user, newPassword);
            alert("Password updated successfully.");
            setIsUpdatingPassword(false);
            setNewPassword('');
        } catch (error: any) {
            console.error("Error updating password:", error);
            alert("Failed to update password. You may need to sign in again. " + error.message);
        }
    };

    const handleToggle2FA = async () => {
        if (!user) return;
        const newState = !twoFactorEnabled;
        setTwoFactorEnabled(newState);
        try {
            await updateDoc(doc(db, 'users', user.uid), { twoFactorEnabled: newState });
        } catch (error) {
            console.error("Error updating 2FA:", error);
            alert("Failed to update 2FA status.");
            setTwoFactorEnabled(!newState);
        }
    };

    const handleDownloadBill = async (item: { date: string; desc: string; amount: string; id: string }) => {
        setDownloadingId(item.id);
        try {
            await downloadBillPDF(
                item,
                user?.displayName || 'Walia User',
                user?.email || ''
            );
        } catch (err) {
            console.error('PDF generation error:', err);
            alert('Could not generate PDF. Please try again.');
        } finally {
            setDownloadingId(null);
        }
    };

    const billingHistory = [
        { date: 'Oct 1, 2024', desc: 'Walia Free Tier', amount: '$0.00', status: 'Paid', id: 'INV-003' },
        { date: 'Sep 1, 2024', desc: 'Walia Free Tier', amount: '$0.00', status: 'Paid', id: 'INV-002' },
        { date: 'Aug 1, 2024', desc: 'Walia Free Tier', amount: '$0.00', status: 'Paid', id: 'INV-001' },
    ];

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
                <div className="flex flex-col md:flex-row gap-12 border-b border-white justify-center items-center">
                    {/* Settings Navigation */}
                    <aside className="w-full md:w-64 shrink-0">
                        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 custom-scrollbar sticky top-32">
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

                    {/* Settings Content */}
                    <div className="flex-1 w-full space-y-12 pb-12">
                        {activeTab === 'Account' && (
                            <section className="space-y-8 animate-in slide-in-from-right-4 fade-in">
                                <div>
                                    <h2 className="text-xl font-black mb-1">Account Summary</h2>
                                    <p className="text-sm text-gray-500 font-medium">Basic information regarding your account.</p>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-200">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                            {user?.photoURL ? (
                                                <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <User className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-lg font-black">{user?.displayName || 'User'}</p>
                                            <p className="text-sm text-gray-500 font-medium mt-1">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-200">
                                            <div>
                                                <p className="text-sm font-bold">Email Address</p>
                                                <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-400 border border-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest cursor-not-allowed">
                                                Locked
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-200">
                                            <div>
                                                <p className="text-sm font-bold">Phone Number</p>
                                                <p className="text-xs text-gray-500 mt-1">{user?.phoneNumber || 'Not provided'}</p>
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-400 border border-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest cursor-not-allowed">
                                                Locked
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'Preferences' && (
                            <section className="space-y-8 animate-in slide-in-from-right-4 fade-in">
                                <div>
                                    <h2 className="text-xl font-black mb-1">App Preferences</h2>
                                    <p className="text-sm text-gray-500 font-medium">Customize your interface and experience.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-8 rounded-[2rem] border border-gray-200">
                                        <div className="flex items-center gap-4 mb-6">
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
                                </div>
                            </section>
                        )}

                        {activeTab === 'Notifications' && (
                            <section className="space-y-8 animate-in slide-in-from-right-4 fade-in">
                                <div>
                                    <h2 className="text-xl font-black mb-1">Notifications</h2>
                                    <p className="text-sm text-gray-500 font-medium">Choose what you want to be notified about.</p>
                                </div>
                                <div className="p-8 rounded-[2rem] border border-gray-200 space-y-6">
                                    <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black">
                                            <Bell className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Email Notifications</p>
                                            <p className="text-xs text-gray-500 mt-1">Updates sent directly to your inbox</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-2">
                                        {[
                                            { label: 'Weekly Reports', desc: 'Summary of your learning progress', active: true },
                                            { label: 'New Features', desc: 'Updates about Walia features', active: true },
                                            { label: 'Community Mentions', desc: 'When someone replies to your post', active: false },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-2">
                                                <div>
                                                    <p className="text-sm font-bold">{item.label}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                                </div>
                                                <button className={cn(
                                                    "w-12 h-6 rounded-full transition-colors relative flex items-center px-1",
                                                    item.active ? "bg-black" : "bg-gray-200"
                                                )}>
                                                    <div className={cn(
                                                        "w-4 h-4 rounded-full bg-white transition-transform",
                                                        item.active ? "translate-x-6 shadow-sm" : "translate-x-0 outline outline-1 outline-black/10"
                                                    )} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'Billing' && (
                            <section className="space-y-8 animate-in slide-in-from-right-4 fade-in">
                                <div>
                                    <h2 className="text-xl font-black mb-1">Plan & Billing</h2>
                                    <p className="text-sm text-gray-500 font-medium">Manage your subscription and payment methods.</p>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-200">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                        <div>
                                            <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-gray-600 font-bold text-[10px] uppercase tracking-widest mb-3">
                                                Current Plan
                                            </span>
                                            <h3 className="text-2xl font-black">Free Tier</h3>
                                            <p className="text-sm text-gray-500 mt-2 max-w-sm">
                                                You are currently on the free plan with limits on AI generation and advanced tools.
                                            </p>
                                        </div>
                                        <button className="px-6 py-3 rounded-full bg-black text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20">
                                            Upgrade to Pro
                                        </button>
                                    </div>
                                </div>
                                <div className="p-8 rounded-[2rem] border border-gray-200">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Payment Methods</p>
                                            <p className="text-xs text-gray-500 mt-1">Cards connected to your account</p>
                                        </div>
                                    </div>
                                    <div className="mt-8 border-t border-gray-100 pt-8">
                                        <h3 className="text-sm font-bold mb-4 text-black text-center sm:text-left">Billing History</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse min-w-[500px]">
                                                <thead>
                                                    <tr className="border-b border-gray-100">
                                                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Invoice</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {billingHistory.map((item, index) => (
                                                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                                            <td className="py-4 px-4 text-xs font-medium text-black">{item.date}</td>
                                                            <td className="py-4 px-4 text-xs text-gray-600">{item.desc}</td>
                                                            <td className="py-4 px-4 text-xs font-medium text-black">{item.amount}</td>
                                                            <td className="py-4 px-4">
                                                                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-[10px] uppercase font-black tracking-widest rounded-full">
                                                                    {item.status}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-4 text-right">
                                                                <button
                                                                    onClick={() => handleDownloadBill(item)}
                                                                    disabled={downloadingId === item.id}
                                                                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-black hover:text-gray-600 uppercase tracking-wide transition-colors disabled:opacity-50 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full"
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
                                </div>
                            </section>
                        )}

                        {activeTab === 'Security' && (
                            <section className="space-y-8 animate-in slide-in-from-right-4 fade-in">
                                <div>
                                    <h2 className="text-xl font-black mb-1">Security</h2>
                                    <p className="text-sm text-gray-500 font-medium">Keep your account safe and manage sessions.</p>
                                </div>
                                <div className="p-8 rounded-[2rem] border border-gray-200 space-y-4">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-black shrink-0">
                                                <Key className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">Password</p>
                                                <p className="text-xs text-gray-500 mt-1">Change your current password</p>
                                            </div>
                                        </div>
                                        {isUpdatingPassword ? (
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                <input
                                                    type="password"
                                                    placeholder="New password"
                                                    value={newPassword}
                                                    onChange={e => setNewPassword(e.target.value)}
                                                    className="flex-1 sm:w-32 text-xs border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-black transition-all"
                                                />
                                                <button onClick={handleUpdatePassword} className="text-xs font-bold px-4 py-2 bg-black text-white rounded-full hover:bg-zinc-800 transition-colors shadow-sm">
                                                    Save
                                                </button>
                                                <button onClick={() => { setIsUpdatingPassword(false); setNewPassword(''); }} className="text-xs font-bold px-3 py-2 text-gray-500 hover:text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setIsUpdatingPassword(true)} className="text-xs font-bold px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors shadow-sm w-full sm:w-auto">
                                                Update
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-black shrink-0">
                                                <Shield className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">Two-Factor Authentication</p>
                                                <p className="text-xs text-gray-500 mt-1">Add an extra layer of security</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleToggle2FA}
                                            className={cn(
                                                "text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-sm w-full sm:w-auto",
                                                twoFactorEnabled
                                                    ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20"
                                                    : "bg-black text-white hover:bg-zinc-800 shadow-black/20"
                                            )}
                                        >
                                            {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2rem] border border-gray-200 mt-8">
                                    <h3 className="text-sm font-bold mb-6">Active Sessions</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                                            <div className="flex items-center gap-4">
                                                <Laptop className="w-6 h-6 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-bold flex items-center gap-2">
                                                        Windows Chrome <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Current</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">Addis Ababa, Ethiopia · Active now</p>
                                                </div>
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
