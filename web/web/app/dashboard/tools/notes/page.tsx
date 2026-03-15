'use client';

import { AlignCenter, AlignJustify, AlignLeft, BookOpen, Cloud, Moon, Settings2, Sun } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type Theme = 'light' | 'dark' | 'cream';
type FontFamily = 'sans' | 'serif' | 'mono';
type Alignment = 'left' | 'center' | 'justify';
type FontSize = 'sm' | 'base' | 'lg' | 'xl';

export default function WaliaNotesPage() {
    const [theme, setTheme] = useState<Theme>('light');
    const [fontFamily, setFontFamily] = useState<FontFamily>('serif');
    const [alignment, setAlignment] = useState<Alignment>('left');
    const [fontSize, setFontSize] = useState<FontSize>('lg');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Theme mappings
    const themeStyles = {
        light: 'bg-white text-gray-900 placeholder:text-gray-300',
        dark: 'bg-[#0f172a] text-gray-100 placeholder:text-gray-600',
        cream: 'bg-[#FDFBF7] text-[#4A453E] placeholder:text-[#C5BEB1]'
    };

    const fontStyles = {
        sans: 'font-sans',
        serif: 'font-serif',
        mono: 'font-mono'
    };

    const alignStyles = {
        left: 'text-left',
        center: 'text-center',
        justify: 'text-justify'
    };

    const sizeStyles = {
        sm: 'text-sm leading-relaxed',
        base: 'text-base leading-relaxed',
        lg: 'text-lg leading-loose',
        xl: 'text-xl leading-loose'
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500); // Simulate network
    };

    return (
        <div className={`min-h-[calc(100vh-80px)] md:min-h-screen w-full transition-colors duration-500 ease-in-out relative flex flex-col ${themeStyles[theme].split(' ')[0]}`}>

            {/* Header */}
            <header className="w-full max-w-4xl mx-auto px-6 py-8 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-black/5 border border-black/10 dark:border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        <Image src="/walia-logo.png" alt="Walia" width={24} height={24} unoptimized className={`object-contain ${theme === 'dark' ? 'invert' : ''}`} />
                    </div>
                    <div>
                        <h1 className={`text-base font-black ${theme === 'dark' ? 'text-white' : 'text-black'} tracking-tight`}>My Walia Notes</h1>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-40">Auto-saved</p>
                    </div>
                </div>
            </header>

            {/* Editor Area */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-6 pb-32">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your brilliant ideas here..."
                    className={`w-full h-full min-h-[60vh] bg-transparent resize-none outline-none border-none focus:ring-0 ${themeStyles[theme]} ${fontStyles[fontFamily]} ${alignStyles[alignment]} ${sizeStyles[fontSize]} transition-all duration-300`}
                    spellCheck="false"
                />
            </main>

            {/* Distraction-Free Settings Overlay */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsSettingsOpen(false)}>
                    {/* Dark/Light overlay backdrop could go here, but omitted for seamless feel */}
                </div>
            )}

            {/* Bottom Toolbar Area */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full max-w-md px-4">

                {/* Expandable Settings Panel */}
                <div className={`w-full max-w-sm bg-white/90 dark:bg-[#1e293b]/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl transition-all duration-300 transform origin-bottom ${isSettingsOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8 pointer-events-none'}`}>

                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 text-center">Reader Settings</h3>

                    {/* Theme Row */}
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-black/20 p-2 rounded-2xl mb-4">
                        {[
                            { id: 'light', icon: Sun, color: 'text-amber-500' },
                            { id: 'cream', icon: BookOpen, color: 'text-orange-900/40' },
                            { id: 'dark', icon: Moon, color: 'text-indigo-400' }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={(e) => { e.stopPropagation(); setTheme(t.id as Theme); }}
                                className={`flex-1 py-3 flex justify-center rounded-xl transition-all ${theme === t.id ? 'bg-white dark:bg-white/10 shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                            >
                                <t.icon className={`w-5 h-5 ${theme === t.id ? t.color : 'text-gray-400'}`} />
                            </button>
                        ))}
                    </div>

                    {/* Typography Row */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                        <button onClick={(e) => { e.stopPropagation(); setFontFamily('sans'); }} className={`flex-1 py-2 text-sm rounded-xl border ${fontFamily === 'sans' ? 'border-black dark:border-white font-bold bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'border-gray-200 dark:border-white/10 text-gray-400 hover:border-gray-300'} transition-all`}>Aa<br /><span className="text-[10px] font-normal uppercase tracking-widest">Sans</span></button>
                        <button onClick={(e) => { e.stopPropagation(); setFontFamily('serif'); }} className={`flex-1 py-2 text-sm rounded-xl border font-serif ${fontFamily === 'serif' ? 'border-black dark:border-white font-bold bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'border-gray-200 dark:border-white/10 text-gray-400 hover:border-gray-300'} transition-all`}>Aa<br /><span className="text-[10px] font-normal font-sans uppercase tracking-widest">Serif</span></button>
                        <button onClick={(e) => { e.stopPropagation(); setFontFamily('mono'); }} className={`flex-1 py-2 text-sm rounded-xl border font-mono ${fontFamily === 'mono' ? 'border-black dark:border-white font-bold bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'border-gray-200 dark:border-white/10 text-gray-400 hover:border-gray-300'} transition-all`}>Aa<br /><span className="text-[10px] font-normal font-sans uppercase tracking-widest">Mono</span></button>
                    </div>

                    {/* Size & Alignment Row */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex bg-gray-50 dark:bg-black/20 rounded-xl p-1 flex-1">
                            {['sm', 'base', 'lg', 'xl'].map(s => (
                                <button key={s} onClick={(e) => { e.stopPropagation(); setFontSize(s as FontSize); }} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${fontSize === s ? 'bg-white dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}>
                                    {s.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <div className="flex bg-gray-50 dark:bg-black/20 rounded-xl p-1">
                            <button onClick={(e) => { e.stopPropagation(); setAlignment('left'); }} className={`p-2 rounded-lg transition-all ${alignment === 'left' ? 'bg-white dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}><AlignLeft className="w-4 h-4" /></button>
                            <button onClick={(e) => { e.stopPropagation(); setAlignment('center'); }} className={`p-2 rounded-lg transition-all ${alignment === 'center' ? 'bg-white dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}><AlignCenter className="w-4 h-4" /></button>
                            <button onClick={(e) => { e.stopPropagation(); setAlignment('justify'); }} className={`p-2 rounded-lg transition-all ${alignment === 'justify' ? 'bg-white dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}><AlignJustify className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                {/* The Floating Action Bar */}
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border ${theme === 'dark' ? 'bg-[#1e293b] text-white border-white/10 hover:bg-[#334155]' : 'bg-white text-black border-gray-200 hover:bg-gray-50'}`}
                    >
                        <Settings2 className="w-6 h-6" />
                    </button>

                    <button
                        onClick={handleSave}
                        className={`px-8 h-14 rounded-full flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_8px_30px_rgba(34,197,94,0.3)] border border-green-500/20 bg-green-500 hover:bg-green-600 hover:-translate-y-1 text-white font-bold tracking-wide`}
                    >
                        {isSaving ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Cloud className="w-5 h-5" />
                        )}
                        {isSaving ? 'SAVING...' : 'SAVE TO CLOUD'}
                    </button>
                </div>

            </div>

        </div>
    );
}
