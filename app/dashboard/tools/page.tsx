'use client';

import { cn } from '@/lib/utils';
import { ArrowRight, ChevronRight, FileText, HelpCircle, Layers, PenTool, Sparkles } from 'lucide-react';
import Link from 'next/link';

const TOOLS = [
    { title: 'Summarize', desc: 'Condense any text to key points', icon: FileText, gradient: 'from-[#6C63FF] to-[#5A52E0]', shadow: 'shadow-[#6C63FF]/30', route: '/dashboard/tools/summarize', emoji: '📄', id: 'summarize', color: '#6C63FF' },
    { title: 'Quiz', desc: 'Generate & take practice tests', icon: HelpCircle, gradient: 'from-[#FF6B6B] to-[#E53935]', shadow: 'shadow-[#FF6B6B]/30', route: '/dashboard/tools/quiz', emoji: '🧠', id: 'quiz', color: '#FF6B6B' },
    { title: 'Flashcards', desc: 'Flip-card studying system', icon: Layers, gradient: 'from-[#4ECDC4] to-[#00897B]', shadow: 'shadow-[#4ECDC4]/30', route: '/dashboard/tools/flashcard', emoji: '🃏', id: 'flashcard', color: '#4ECDC4' },
    { title: 'Notes', desc: 'Write & organize your ideas', icon: PenTool, gradient: 'from-[#FFA502] to-[#E65100]', shadow: 'shadow-[#FFA502]/30', route: '/dashboard/tools/notes', emoji: '📝', id: 'notes', color: '#FFA502' },
];

export default function ToolsPage() {
    // Mock counts since web doesn't have studyHistory ported yet
    const counts = { quiz: 12, notes: 34, flashcard: 156, summarize: 8 };

    // Mock recent history
    const recentActivity = [
        { title: 'Cell Biology Notes', tool: 'notes', date: 'Today' },
        { title: 'Calculus Ch 4 Summary', tool: 'summarize', date: 'Yesterday' },
        { title: 'Physics Midterm Prep', tool: 'quiz', date: 'Oct 12' },
    ];

    const getToolIcon = (toolId: string) => {
        const found = TOOLS.find(t => t.id === toolId);
        return found ? { Icon: found.icon, color: found.color } : { Icon: PenTool, color: '#FFA502' };
    };

    return (
        <div className="animate-fade-in flex flex-col h-full bg-[#f8f9fa] dark:bg-[#0a0a0a]">
            {/* Header Area */}
            <div className="p-6 pb-8 bg-gradient-to-br from-[#6C63FF] to-[#7C75FF] dark:from-[#1A1A2E] dark:to-[#0D0D1A] -mx-4 -mt-4 md:-mx-6 md:-mt-6 lg:-mx-10 lg:-mt-10 mb-6 relative overflow-hidden">
                <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight mb-1">Study Tools 🛠️</h1>
                        <p className="text-white/70 text-sm font-medium">4 tools to supercharge your learning</p>
                    </div>
                    <Link href="/dashboard/ai" className="flex items-center gap-2 bg-white/20 border border-white/30 px-3 py-1.5 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors">
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-xs font-bold text-white">Ask AI</span>
                    </Link>
                </div>
            </div>

            <div className="px-1 pb-10">
                {/* 4-Card Grid (Staggered on mobile) */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {TOOLS.map((tool, i) => (
                        <Link
                            href={tool.route}
                            key={tool.id}
                            className={cn(
                                "group relative overflow-hidden flex flex-col justify-between p-5 rounded-3xl bg-gradient-to-br shadow-xl transition-transform hover:scale-[1.02] active:scale-95 h-[170px]",
                                tool.gradient,
                                tool.shadow,
                                i % 2 === 1 && "mt-6" // Staggered effect
                            )}
                        >
                            <div>
                                <div className="text-3xl mb-2">{tool.emoji}</div>
                                <h3 className="text-base font-bold text-white leading-tight mb-1">{tool.title}</h3>
                                <p className="text-[10px] text-white/80 leading-relaxed max-w-[90%] font-medium">{tool.desc}</p>
                            </div>
                            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center self-end backdrop-blur-sm">
                                <ArrowRight className="w-3.5 h-3.5 text-white" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-around bg-white dark:bg-[#1A1A2E] p-5 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 mb-8">
                    {[
                        { val: counts.quiz, label: 'Quizzes' },
                        { val: counts.notes, label: 'Notes' },
                        { val: counts.flashcard, label: 'Cards' },
                        { val: counts.summarize, label: 'Summaries' }
                    ].map(stat => (
                        <div key={stat.label} className="flex flex-col items-center">
                            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{stat.val}</span>
                            <span className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mt-1">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <div>
                    <h2 className="text-lg font-black text-black dark:text-white mb-4">Recent Activity</h2>
                    <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
                        {recentActivity.map((item, i) => {
                            const { Icon, color } = getToolIcon(item.tool);
                            return (
                                <div key={i} className="group flex items-center p-4 border-b border-black/5 dark:border-white/5 last:border-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mr-4" style={{ backgroundColor: `${color}20` }}>
                                        <Icon className="w-5 h-5" style={{ color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-black dark:text-white truncate">{item.title}</h4>
                                        <p className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest mt-0.5">{item.tool} · {item.date}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: `${color}10` }}>
                                        <ChevronRight className="w-4 h-4" style={{ color }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
