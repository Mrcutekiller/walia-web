'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Clock, Download, Share2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

interface ReceiptData {
    plan: string;
    amount: string;
    billingDate: string;
    nextBilling: string;
    status: 'paid' | 'unpaid' | 'pending';
    invoiceId: string;
    paymentMethod: string;
}

const STEPS = ['Order Placed', 'Payment Processed', 'Plan Activated', 'Receipt Generated'];

export default function ReceiptPage() {
    const { user } = useAuth();
    const [receipt, setReceipt] = useState<ReceiptData | null>(null);
    const [activeStep, setActiveStep] = useState(3);

    useEffect(() => {
        if (!user) return;
        // Build receipt from user's plan data
        const isPro = user.plan === 'Pro' || user.isPro;
        const now = new Date();
        const next = new Date(now);
        next.setMonth(next.getMonth() + 1);

        setReceipt({
            plan: isPro ? 'Walia Pro' : 'Walia Free',
            amount: isPro ? '$9.99' : '$0.00',
            billingDate: now.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
            nextBilling: next.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
            status: isPro ? 'paid' : 'unpaid',
            invoiceId: `WAL-${user.id?.slice(0, 8).toUpperCase() ?? 'XXXXXXXX'}-${now.getFullYear()}`,
            paymentMethod: 'Visa Ending 2986',
        });
    }, [user]);

    const handlePrint = () => window.print();

    if (!receipt) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
            <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const isPaid = receipt.status === 'paid';

    return (
        <div className="min-h-screen bg-[var(--color-surface)] flex flex-col items-center justify-start py-10 px-4 font-[family-name:var(--font-inter)]">

            {/* Back button */}
            <div className="w-full max-w-md mb-6 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </Link>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 text-xs font-black text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] uppercase tracking-widest transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Save
                </button>
            </div>

            {/* Receipt Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md"
            >
                {/* Tape top — the printer receipt effect */}
                <div className="relative h-5 overflow-hidden">
                    <div className="absolute inset-0"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, var(--color-surface-container-low) 8px, var(--color-surface-container-low) 16px)',
                            backgroundSize: '16px 100%',
                        }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-outline-variant)] opacity-30" />
                </div>

                <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-highest)] border-t-0 px-8 py-8 shadow-2xl shadow-black/10">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-[10px] font-black text-[var(--color-outline)] uppercase tracking-[0.2em]">Walia AI · Invoice</p>
                            <p className="font-mono text-xs text-[var(--color-on-surface-variant)] mt-1">{receipt.invoiceId}</p>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            isPaid
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        }`}>
                            {isPaid
                                ? <CheckCircle2 className="w-3 h-3" />
                                : <Clock className="w-3 h-3" />
                            }
                            {receipt.status.toUpperCase()}
                        </div>
                    </div>

                    {/* Divider with scissors */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex-1 border-t border-dashed border-[var(--color-outline-variant)]/40" />
                        <span className="text-[var(--color-outline-variant)] text-xs rotate-90">✂</span>
                        <div className="flex-1 border-t border-dashed border-[var(--color-outline-variant)]/40" />
                    </div>

                    {/* Plan info */}
                    <div className="mb-8">
                        <p className="text-[10px] font-black text-[var(--color-outline)] uppercase tracking-[0.2em] mb-4">Order Summary</p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--color-on-surface-variant)] font-medium">Plan</span>
                                <span className="text-sm font-black text-[var(--color-on-surface)]">{receipt.plan}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--color-on-surface-variant)] font-medium">Billing Date</span>
                                <span className="text-sm font-bold text-[var(--color-on-surface)]">{receipt.billingDate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--color-on-surface-variant)] font-medium">Next Billing</span>
                                <span className="text-sm font-bold text-[var(--color-on-surface)]">{receipt.nextBilling}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--color-on-surface-variant)] font-medium">Payment Method</span>
                                <span className="text-sm font-bold text-[var(--color-on-surface)]">{receipt.paymentMethod}</span>
                            </div>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-[var(--color-outline-variant)]/30 pt-4 mb-8">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-[var(--color-on-surface)] uppercase tracking-widest">Total Amount</span>
                            <span className="text-2xl font-black text-[var(--color-on-surface)] tracking-tight">{receipt.amount}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] text-[var(--color-outline)] font-bold">Per Month · Billed Annually</span>
                            <span className={`text-[10px] font-black ${isPaid ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {isPaid ? '✓ PAYMENT CONFIRMED' : '⚠ PAYMENT PENDING'}
                            </span>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <p className="text-[10px] font-black text-[var(--color-outline)] uppercase tracking-[0.2em] mb-4">Payment Status</p>
                        <div className="relative flex items-center justify-between">
                            {STEPS.map((step, i) => {
                                const done = i < activeStep;
                                const current = i === activeStep - 1;
                                return (
                                    <div key={i} className="flex flex-col items-center gap-1.5 relative z-10">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                                            done
                                                ? 'bg-emerald-500 border-emerald-500'
                                                : current
                                                    ? 'bg-[var(--color-surface-container-low)] border-[var(--color-on-surface)]'
                                                    : 'bg-[var(--color-surface-container)] border-[var(--color-outline-variant)]/30'
                                        }`}>
                                            {done
                                                ? <CheckCircle2 className="w-4 h-4 text-white" />
                                                : <span className={`text-[10px] font-black ${current ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-outline-variant)]'}`}>{i + 1}</span>
                                            }
                                        </div>
                                        <span className="text-[8px] font-black text-[var(--color-outline)] uppercase tracking-wider hidden sm:block text-center max-w-[60px]">{step}</span>
                                    </div>
                                );
                            })}
                            {/* Progress line */}
                            <div className="absolute top-3.5 left-3.5 right-3.5 h-px bg-[var(--color-outline-variant)]/20 z-0">
                                <motion.div
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${((activeStep - 1) / (STEPS.length - 1)) * 100}%` }}
                                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                                    className="h-full bg-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <Link
                            href="/dashboard"
                            className="flex-1 py-3.5 rounded-2xl bg-[var(--color-on-surface)] text-[var(--color-surface)] text-sm font-black text-center uppercase tracking-widest hover:opacity-90 transition-opacity"
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={handlePrint}
                            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] text-sm font-black hover:bg-[var(--color-surface-container-high)] transition-colors border border-[var(--color-outline-variant)]/20"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                        <button className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] text-sm font-black hover:bg-[var(--color-surface-container-high)] transition-colors border border-[var(--color-outline-variant)]/20">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Tape bottom */}
                <div className="relative h-5 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px bg-[var(--color-outline-variant)] opacity-30" />
                    <div className="absolute inset-0"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, var(--color-surface-container-low) 8px, var(--color-surface-container-low) 16px)',
                            backgroundSize: '16px 100%',
                        }}
                    />
                </div>

                <p className="text-center text-[10px] font-black text-[var(--color-outline)] uppercase tracking-[0.2em] mt-6">
                    Thank you for using Walia AI 🦌
                </p>
            </motion.div>
        </div>
    );
}
