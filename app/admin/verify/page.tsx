'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Clock,
    ExternalLink,
    Eye,
    FileText,
    ShieldCheck,
    XCircle
} from 'lucide-react';

interface VerificationRequest {
    id: string;
    name: string;
    type: string;
    status: string;
    submitted: string;
    email: string;
}

const mockVerifications: VerificationRequest[] = [
    { id: 'V-001', name: 'Biruk Anteneh', type: 'Student ID', status: 'Pending', submitted: '2024-03-05', email: 'biruk@example.com' },
    { id: 'V-002', name: 'Antonio Samuel', type: 'Identity', status: 'Approved', submitted: '2024-03-02', email: 'antonio@walia.com' },
    { id: 'V-003', name: 'Kris Payer', type: 'Student ID', status: 'Rejected', submitted: '2024-03-04', email: 'kris.payer@gmail.com' },
    { id: 'V-004', name: 'Sarah Miller', type: 'Institution', status: 'Pending', submitted: '2024-03-06', email: 'sarah.m@outlook.com' },
];

export default function AdminVerify() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tight">Trust & Safety</h1>
                    <p className="text-white/30 text-sm font-medium">Process user verification requests and maintain platform credibility.</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5 flex items-center space-x-2 text-white/40">
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">12 Pending Actions</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {mockVerifications.map((v, i) => (
                    <motion.div
                        key={v.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-6 rounded-[32px] bg-[#141415] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-white/10 transition-all"
                    >
                        <div className="flex items-center space-x-5">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                <ShieldCheck className={cn("w-6 h-6", v.status === 'Approved' ? "text-walia-success" : "text-white/20")} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-white">{v.name}</h3>
                                <div className="flex items-center space-x-3 text-[10px] text-white/30 font-bold uppercase tracking-tighter">
                                    <span className="flex items-center text-walia-success"><FileText className="w-3 h-3 mr-1" /> {v.type}</span>
                                    <span>•</span>
                                    <span>{v.email}</span>
                                    <span>•</span>
                                    <span>Submitted {v.submitted}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className={cn(
                                "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border",
                                v.status === 'Approved' ? "bg-walia-success/10 text-walia-success border-walia-success/20" :
                                    v.status === 'Rejected' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                        "bg-orange-500/10 text-orange-500 border-orange-500/20"
                            )}>
                                {v.status}
                            </div>

                            <div className="h-8 w-px bg-white/5 mx-1" />

                            <button className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-walia-success hover:bg-walia-success/10 transition-all active:scale-95">
                                <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-95">
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Verification Footer */}
            <div className="p-10 rounded-[40px] bg-gradient-to-br from-[#1A1A1E] to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3 max-w-lg">
                    <h4 className="text-xl font-black text-white tracking-tight">Enterprise Compliance</h4>
                    <p className="text-xs text-white/40 font-medium leading-relaxed">
                        Ensure all users meet the platform requirements for AI safety and data privacy. Verification adds a "Verified" badge to profiles and unlocks premium collaboration features.
                    </p>
                </div>
                <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center space-x-2">
                    <span>Audit Verification Logs</span>
                    <ExternalLink className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
