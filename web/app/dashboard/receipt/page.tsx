'use client';

import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, Download, PartyPopper, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ReceiptPage() {
    const { user } = useAuth();

    // Fallback values if API/user context lags
    const userName = user?.displayName?.split(' ')[0] || 'Lianna';
    const transactionId = Math.random().toString().slice(2, 12);
    const date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' });

    return (
        <div className="min-h-full bg-gradient-to-br from-gray-50 to-[#F1F5F9] text-black animate-in fade-in pb-20 selection:bg-black selection:text-white flex flex-col items-center justify-center p-6 md:p-12">

            <div className="w-full max-w-md mb-6 flex justify-between items-center z-10">
                <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:shadow-md transition-all">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-bold shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-black">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download PDF</span>
                </button>
            </div>

            {/* Receipt Card */}
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-gray-100 overflow-hidden relative animate-in slide-in-from-bottom-8 duration-500">

                {/* Background Watermark Logo */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0 grayscale">
                    <Image src="/walia-logo.png" alt="" width={250} height={250} unoptimized className="object-contain" />
                </div>

                <div className="p-8 md:p-10 relative z-10 flex flex-col items-center text-center">

                    {/* Header Icons & Confetti */}
                    <div className="w-16 h-16 rounded-3xl bg-amber-100 flex items-center justify-center mb-6 shadow-sm border border-amber-200/50">
                        <PartyPopper className="w-8 h-8 text-amber-500" />
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        <h2 className="text-sm font-black text-green-500 uppercase tracking-widest">Walia Pro</h2>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full mb-6">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Status: Admin Approved</span>
                    </div>

                    <h1 className="text-3xl font-black tracking-tight mb-3">Congratulations,<br />{userName}!</h1>
                    <p className="text-gray-500 font-medium text-[15px] leading-relaxed max-w-[280px] mb-8">
                        Your membership upgrade has been officially approved by the Admin. Welcome to the Elite Tier.
                    </p>

                    {/* Dashed Separator */}
                    <div className="w-full border-t-2 border-dashed border-gray-200 my-2 relative">
                        <div className="absolute -left-11 -top-3 w-6 h-6 rounded-full bg-gray-50 border-r-2 border-dashed border-gray-200" />
                        <div className="absolute -right-11 -top-3 w-6 h-6 rounded-full bg-gray-50 border-l-2 border-dashed border-gray-200" />
                    </div>

                    {/* Receipt Details */}
                    <div className="w-full py-8 space-y-5 text-left">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-gray-400 tracking-wider">PAYMENT ID</span>
                            <span className="text-sm font-black text-black">{transactionId}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-gray-400 tracking-wider">DATE</span>
                            <span className="text-sm font-black text-black">{date}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-gray-400 tracking-wider">PLAN</span>
                            <span className="text-sm font-black text-black">Elite Tier (Annual)</span>
                        </div>
                        <div className="w-full h-px bg-gray-100 my-4" />
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Amount Paid</span>
                            <span className="text-3xl font-black text-black">$199.00</span>
                        </div>
                    </div>

                    {/* CEO Signature Seal */}
                    <div className="w-full mt-2 mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between">
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Authorized By</span>
                            <span className="text-sm font-bold text-black" style={{ fontFamily: 'var(--font-serif)' }}>Founder & CEO of Walia</span>
                            <span className="text-[10px] font-bold text-gray-500 mt-1">Digital Signature Verified</span>
                        </div>
                        <div className="relative w-16 h-16 shrink-0 mix-blend-multiply">
                            <Image
                                src="/assets/walia_ceo_seal.png"
                                alt="CEO Seal"
                                fill
                                className="object-contain"
                                unoptimized
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <Link
                        href="/dashboard/id-center"
                        className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-bold text-sm tracking-wide shadow-xl hover:-translate-y-1 hover:bg-black transition-all"
                    >
                        VIEW MY WALIA ID
                    </Link>

                    {/* Barcode Section */}
                    <div className="w-full mt-8 flex flex-col items-center justify-center opacity-80">
                        <div className="flex w-64 h-12 mb-2 gap-[2px] items-stretch justify-center">
                            {/* Detailed pure CSS Barcode */}
                            <div className="w-1 bg-black" /><div className="w-2 bg-black" /><div className="w-1 bg-black" /><div className="w-3 bg-black" />
                            <div className="w-1 bg-black" /><div className="w-1 bg-black" /><div className="w-4 bg-black" /><div className="w-1 bg-black" />
                            <div className="w-2 bg-black" /><div className="w-1 bg-black" /><div className="w-3 bg-black" /><div className="w-1 bg-black" />
                            <div className="w-2 bg-black" /><div className="w-1 bg-black" /><div className="w-1 bg-black" /><div className="w-2 bg-black" />
                            <div className="w-4 bg-black" /><div className="w-1 bg-black" /><div className="w-2 bg-black" /><div className="w-1 bg-black" />
                            <div className="w-1 bg-black" /><div className="w-3 bg-black" /><div className="w-1 bg-black" /><div className="w-2 bg-black" />
                        </div>
                        <div className="flex gap-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">
                            <span>12345678901</span>
                            <span>0987654321</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Disclaimer */}
            <p className="mt-8 text-xs font-medium text-gray-400 max-w-sm text-center">
                This is a secure digital receipt. Keep this copy for your records and billing history.
            </p>

        </div>
    );
}
