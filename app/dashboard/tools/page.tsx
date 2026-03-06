'use client';

import { cn } from '@/lib/utils';
import {
    ArrowRight,
    BookOpen,
    BrainCircuit,
    Code,
    FileText,
    HelpCircle,
    Languages,
    Mic2,
    Sparkles,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';

const tools = [
    { id: '1', title: 'AI Summarizer', icon: FileText, color: 'bg-blue-500/20 text-blue-500', desc: 'Paste long texts and get key insights in seconds.' },
    { id: '2', title: 'Flashcard Gen', icon: BrainCircuit, color: 'bg-emerald-500/20 text-emerald-500', desc: 'Generate custom study cards from your notes.' },
    { id: '3', title: 'Mock Quiz', icon: HelpCircle, color: 'bg-purple-500/20 text-purple-500', desc: 'Create AI-powered practice tests for any subject.' },
    { id: '4', title: 'Note Helper', icon: BookOpen, color: 'bg-amber-500/20 text-amber-500', desc: 'Organize and expand your thoughts with AI help.' },
    { id: '5', title: 'Transcription', icon: Mic2, color: 'bg-red-500/20 text-red-500', desc: 'Convert voice recordings into structured notes.' },
    { id: '6', title: 'Market AI', icon: TrendingUp, color: 'bg-walia-accent/20 text-walia-accent', desc: 'Scan charts and get real-time trading signals.' },
    { id: '7', title: 'Translator', icon: Languages, color: 'bg-indigo-500/20 text-indigo-500', desc: 'Communicate across 50+ languages instantly.' },
    { id: '8', title: 'Code Assistant', icon: Code, color: 'bg-green-500/20 text-green-500', desc: 'Debug and write code snippets with AI guidance.' },
];

export default function ToolsPage() {
    return (
        <div className="space-y-12 animate-fade-in-up">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Professional Tools</h1>
                <p className="text-white/40 text-sm max-w-xl font-medium leading-relaxed">
                    Unlock your full academic potential with our specialized AI micro-tools.
                    Each tool is designed to solve a specific study challenge.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {tools.map((tool) => (
                    <div
                        key={tool.id}
                        className="group relative p-8 rounded-[40px] bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer overflow-hidden flex flex-col h-full"
                    >
                        {/* Background Glow */}
                        <div className={cn(
                            "absolute -top-10 -right-10 w-24 h-24 blur-3xl opacity-0 transition-opacity group-hover:opacity-20",
                            tool.color.split(' ')[1].replace('text-', 'bg-')
                        )} />

                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shrink-0 border border-white/5 transition-transform group-hover:scale-110", tool.color)}>
                            <tool.icon className="w-7 h-7" />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-3 group-hover:text-walia-primary transition-colors">{tool.title}</h3>
                            <p className="text-sm text-white/30 leading-relaxed font-medium">
                                {tool.desc}
                            </p>
                        </div>

                        <div className="mt-8 flex items-center text-xs font-black uppercase tracking-widest text-white/20 group-hover:text-walia-primary transition-all">
                            Launch Tool <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Upgrade Banner */}
            <div className="p-12 rounded-[48px] bg-walia-primary/10 border border-walia-primary/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
                <div className="absolute top-0 right-0 p-8 text-walia-primary/20 rotate-12 transition-transform group-hover:scale-150">
                    <Sparkles className="w-40 h-40" />
                </div>

                <div className="relative z-10 max-w-lg text-center md:text-left">
                    <h2 className="text-3xl font-black text-white mb-4 leading-tight">Need even more advanced tools?</h2>
                    <p className="text-white/50 font-medium">
                        Upgrade to Walia Pro to unlock unlimited usage, custom tool workflows,
                        and our latest experimental AI models.
                    </p>
                </div>

                <Link href="/dashboard/upgrade" className="relative z-10 px-10 py-5 rounded-3xl bg-walia-primary text-white font-black hover:bg-walia-secondary transition-all shadow-xl shadow-walia-primary/30 hover:-translate-y-1">
                    Upgrade Today
                </Link>
            </div>

        </div>
    );
}
