'use client';

import DashboardShell from '@/components/DashboardShell';
import { useAuth } from '@/context/AuthContext';
import { Brain, FileText, FlaskConical, Globe, Languages, Mic, PenLine, Search, Sparkles, Wand2, Zap } from 'lucide-react';
import { useState } from 'react';

const TOOLS = [
    { icon: Brain, label: 'Flashcard Generator', desc: 'AI creates study cards from your notes', color: 'from-violet-600 to-indigo-700', badge: 'Popular' },
    { icon: FileText, label: 'AI Summarizer', desc: 'Paste any text and get a clean summary', color: 'from-blue-600 to-cyan-700', badge: '' },
    { icon: PenLine, label: 'Essay Writer', desc: 'Outline and draft essays with AI', color: 'from-emerald-600 to-teal-700', badge: '' },
    { icon: Search, label: 'Research Assistant', desc: 'Deep-dive any topic with structured research', color: 'from-orange-600 to-amber-700', badge: '' },
    { icon: FlaskConical, label: 'Quiz Generator', desc: 'Turn notes into multiple-choice quizzes', color: 'from-pink-600 to-rose-700', badge: 'New' },
    { icon: Wand2, label: 'Study Planner', desc: 'AI builds a personalised study schedule', color: 'from-fuchsia-600 to-purple-700', badge: '' },
    { icon: Globe, label: 'Translation', desc: 'Translate text into 50+ languages instantly', color: 'from-sky-600 to-blue-700', badge: '' },
    { icon: Languages, label: 'Language Tutor', desc: 'Practice speaking and writing a new language', color: 'from-lime-600 to-green-700', badge: '' },
    { icon: Mic, label: 'Voice to Notes', desc: 'Speak and get structured, edited notes', color: 'from-red-600 to-orange-700', badge: 'Pro' },
    { icon: Sparkles, label: 'AI Explainer', desc: 'Any concept explained at your school level', color: 'from-yellow-600 to-amber-700', badge: '' },
    { icon: Zap, label: 'Speed Reader', desc: 'Read and comprehend faster with AI assistance', color: 'from-cyan-600 to-sky-700', badge: '' },
];

export default function ToolsPage() {
    const { user } = useAuth();
    const [active, setActive] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const runTool = async () => {
        if (!input.trim() || !user || !active) return;
        setLoading(true); setOutput('');
        try {
            const systemPrompt = `You are a specialized Walia AI study tool: ${active}. 
            Your goal is to process the following input and return high-quality results exactly matching the tool's purpose.
            Be structured, helpful, and academic.`;

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    systemPrompt
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.reply || 'API Error');
            setOutput(data.reply || 'No response. Try again.');
        } catch (error: any) {
            setOutput(`Error: ${error.message || 'Connection unstable. Please try again.'}`);
        }
        setLoading(false);
    };

    return (
        <DashboardShell>
            <div className="p-6 max-w-5xl mx-auto">
                <div className="mb-8">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Study Tools</p>
                    <h1 className="text-3xl font-black text-white tracking-tight">AI Toolbox</h1>
                    <p className="text-white/40 text-sm mt-1">Powerful AI tools to supercharge your studies.</p>
                </div>

                {active ? (
                    /* ── Tool Panel ── */
                    <div className="space-y-4">
                        <button onClick={() => { setActive(null); setInput(''); setOutput(''); }} className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1">
                            ← Back to tools
                        </button>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-lg font-black text-white mb-4">{active}</h2>
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Paste your text, notes, or topic here..."
                                rows={5}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 resize-none transition-colors"
                            />
                            <button onClick={runTool} disabled={loading || !input.trim()}
                                className="mt-3 px-6 py-3 rounded-xl bg-white text-black font-black text-sm hover:bg-white/90 transition-all disabled:opacity-30">
                                {loading ? 'Working...' : 'Generate'}
                            </button>
                            {output && (
                                <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                                    {output}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* ── Tools Grid ── */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {TOOLS.map(({ icon: Icon, label, desc, color, badge }) => (
                            <button key={label} onClick={() => setActive(label)}
                                className="text-left p-5 rounded-2xl bg-white/5 border border-white/8 hover:border-white/20 hover:bg-white/8 transition-all group">
                                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-sm font-bold text-white leading-tight">{label}</h3>
                                    {badge && (
                                        <span className={`shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${badge === 'Pro' ? 'bg-amber-500/20 text-amber-400' : badge === 'New' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
                                            {badge}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-white/35 mt-1 leading-relaxed">{desc}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </DashboardShell>
    );
}
