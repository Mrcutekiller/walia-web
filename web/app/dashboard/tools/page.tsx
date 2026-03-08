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
        <div className="animate-fade-in flex flex-col h-full bg-[#f8f9fa] pb-20 md:pb-10">
            {/* Header Area */}
            <div className="p-8 md:p-12 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 -mx-4 -mt-4 md:-mx-6 md:-mt-6 lg:-mx-10 lg:-mt-10 mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">Study Tools</h1>
                        <p className="text-white/80 text-sm font-medium">Four powerful AI tools to supercharge your learning journey</p>
                    </div>
                    <Link href="/dashboard/chat" className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 px-6 py-3 rounded-2xl backdrop-blur-md transition-all group w-fit">
                        <Sparkles className="w-5 h-5 text-white animate-pulse" />
                        <span className="text-sm font-bold text-white">Ask Walia AI</span>
                    </Link>
                </div>
            </div>

            <div className="px-2 md:px-0">
                {/* Tools Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {TOOLS.map((tool) => (
                        <Link
                            href={tool.route}
                            key={tool.id}
                            className={cn(
                                "group relative overflow-hidden flex flex-col justify-between p-7 rounded-[32px] bg-white border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 active:scale-95 h-[220px]",
                            )}
                        >
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">
                                    {tool.emoji}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">{tool.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">{tool.desc}</p>
                            </div>

                            <div className="relative z-10 flex items-center justify-between mt-4">
                                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                    Launch
                                </span>
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Decorative background element */}
                            <div className={cn("absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity bg-current")} style={{ color: tool.color }} />
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Recent Activity</h2>
                            <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
                        </div>
                        <div className="bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden p-2">
                            {recentActivity.map((item, i) => {
                                const { Icon, color } = getToolIcon(item.tool);
                                return (
                                    <div key={i} className="group flex items-center p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-sm border border-slate-50" style={{ backgroundColor: `${color}10` }}>
                                            <Icon className="w-5 h-5" style={{ color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.tool} • {item.date}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stats & Quick Actions */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest px-2">Your Impact</h2>
                        <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm text-center">
                            <div className="grid grid-cols-2 gap-8">
                                {[
                                    { val: counts.quiz, label: 'Quizzes' },
                                    { val: counts.notes, label: 'Notes' },
                                    { val: counts.flashcard, label: 'Cards' },
                                    { val: counts.summarize, label: 'Summaries' }
                                ].map(stat => (
                                    <div key={stat.label} className="bg-slate-50/50 rounded-2xl p-4 border border-slate-50">
                                        <p className="text-2xl font-extrabold text-indigo-600 mb-1">{stat.val}</p>
                                        <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <p className="text-xs font-medium text-slate-500 mb-4">You're in the top <span className="text-indigo-600 font-bold">5%</span> of learners this week!</p>
                                <button className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all">
                                    View Detailed Stats
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
