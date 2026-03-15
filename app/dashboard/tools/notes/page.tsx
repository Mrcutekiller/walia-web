'use client';

import { AlignCenter, AlignJustify, AlignLeft, ArrowLeft, BookOpen, Cloud, Moon, Plus, Settings2, Sun, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'cream';
type FontFamily = 'sans' | 'serif' | 'mono';
type Alignment = 'left' | 'center' | 'justify';
type FontSize = 'sm' | 'base' | 'lg' | 'xl';

interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

const STORAGE_KEY = 'walia_notes';

function loadNotes(): Note[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveNotes(notes: Note[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch { }
}

function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─────────────────────────────────────────────
// Notes List View
// ─────────────────────────────────────────────
function NotesListView({
    notes,
    onCreate,
    onOpen,
    onDelete
}: {
    notes: Note[];
    onCreate: () => void;
    onOpen: (note: Note) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-white flex flex-col">
            {/* Header */}
            <header className="px-6 pt-8 pb-4 max-w-2xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-black tracking-tight">My Notes</h1>
                        <p className="text-gray-400 text-sm font-medium mt-1">
                            {notes.length === 0 ? 'No notes yet' : `${notes.length} note${notes.length > 1 ? 's' : ''}`}
                        </p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 px-6 pb-32 max-w-2xl mx-auto w-full">
                {notes.length === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center mb-6">
                            <span className="text-4xl">📝</span>
                        </div>
                        <h2 className="text-xl font-black text-black mb-2">Nothing here yet</h2>
                        <p className="text-gray-400 text-sm font-medium mb-8 max-w-xs">
                            Tap the <span className="font-bold text-black">+</span> button below to create your first note.
                        </p>
                    </div>
                ) : (
                    /* Notes grid */
                    <div className="space-y-3 mt-4">
                        {notes.map(note => (
                            <div
                                key={note.id}
                                className="group flex items-start gap-4 p-5 bg-white rounded-[1.5rem] border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer relative"
                                onClick={() => onOpen(note)}
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-black text-base leading-tight truncate">
                                        {note.title || 'Untitled Note'}
                                    </h3>
                                    <p className="text-gray-400 text-xs mt-1 line-clamp-2 font-medium leading-relaxed">
                                        {note.content || 'No content yet...'}
                                    </p>
                                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-2">
                                        {formatDate(note.updatedAt)}
                                    </p>
                                </div>
                                {/* Delete */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* FAB — + button */}
            <div className="fixed bottom-8 right-6 z-50">
                <button
                    onClick={onCreate}
                    className="w-16 h-16 bg-black text-white rounded-full shadow-2xl shadow-black/30 flex items-center justify-center hover:scale-110 hover:bg-zinc-800 active:scale-95 transition-all"
                    aria-label="Create new note"
                >
                    <Plus className="w-7 h-7" />
                </button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Note Editor View
// ─────────────────────────────────────────────
function NoteEditorView({
    note,
    onSave,
    onBack
}: {
    note: Note;
    onSave: (updated: Note) => void;
    onBack: () => void;
}) {
    const [theme, setTheme] = useState<Theme>('light');
    const [fontFamily, setFontFamily] = useState<FontFamily>('serif');
    const [alignment, setAlignment] = useState<Alignment>('left');
    const [fontSize, setFontSize] = useState<FontSize>('lg');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [isSaving, setIsSaving] = useState(false);

    const themeStyles = {
        light: { bg: 'bg-white', text: 'text-gray-900', placeholder: 'placeholder:text-gray-300' },
        dark: { bg: 'bg-[#0f172a]', text: 'text-gray-100', placeholder: 'placeholder:text-gray-600' },
        cream: { bg: 'bg-[#FDFBF7]', text: 'text-[#4A453E]', placeholder: 'placeholder:text-[#C5BEB1]' }
    };
    const fontStyles = { sans: 'font-sans', serif: 'font-serif', mono: 'font-mono' };
    const alignStyles = { left: 'text-left', center: 'text-center', justify: 'text-justify' };
    const sizeStyles = {
        sm: 'text-sm leading-relaxed',
        base: 'text-base leading-relaxed',
        lg: 'text-lg leading-loose',
        xl: 'text-xl leading-loose'
    };

    const { bg, text, placeholder } = themeStyles[theme];
    const isDark = theme === 'dark';

    const handleSave = () => {
        setIsSaving(true);
        const updated: Note = {
            ...note,
            title: title.trim() || 'Untitled Note',
            content,
            updatedAt: new Date().toISOString()
        };
        onSave(updated);
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <div className={`min-h-[calc(100vh-80px)] w-full transition-colors duration-500 relative flex flex-col ${bg}`}>

            {/* Editor Header */}
            <header className={`w-full max-w-4xl mx-auto px-6 py-6 flex items-center justify-between gap-4 z-10`}>
                <button
                    onClick={onBack}
                    className={`flex items-center gap-2 font-bold text-sm transition-all px-4 py-2 rounded-full ${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className={`flex-1 max-w-xs`}>
                    <input
                        className={`w-full bg-transparent font-black text-base outline-none border-none text-center ${isDark ? 'text-white placeholder:text-gray-600' : 'text-black placeholder:text-gray-300'}`}
                        placeholder="Note title..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div className="w-16" /> {/* spacer to balance */}
            </header>

            {/* Editor Area */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-6 pb-40">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your brilliant ideas here..."
                    className={`w-full h-full min-h-[55vh] bg-transparent resize-none outline-none border-none focus:ring-0 ${text} ${placeholder} ${fontStyles[fontFamily]} ${alignStyles[alignment]} ${sizeStyles[fontSize]} transition-all duration-300`}
                    spellCheck="false"
                />
            </main>

            {/* Overlay to close settings panel */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsSettingsOpen(false)} />
            )}

            {/* Bottom Toolbar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full max-w-md px-4">

                {/* Settings Panel */}
                <div className={`w-full max-w-sm bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-2xl transition-all duration-300 transform origin-bottom ${isSettingsOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8 pointer-events-none'}`}>

                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 text-center">Reader Settings</h3>

                    {/* Theme Row */}
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-2xl mb-4">
                        {[
                            { id: 'light', icon: Sun, color: 'text-amber-500' },
                            { id: 'cream', icon: BookOpen, color: 'text-orange-900/40' },
                            { id: 'dark', icon: Moon, color: 'text-indigo-400' }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={(e) => { e.stopPropagation(); setTheme(t.id as Theme); }}
                                className={`flex-1 py-3 flex justify-center rounded-xl transition-all ${theme === t.id ? 'bg-white shadow-sm' : 'hover:bg-black/5'}`}
                            >
                                <t.icon className={`w-5 h-5 ${theme === t.id ? t.color : 'text-gray-400'}`} />
                            </button>
                        ))}
                    </div>

                    {/* Font Family Row */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                        <button onClick={(e) => { e.stopPropagation(); setFontFamily('sans'); }} className={`flex-1 py-2 text-sm rounded-xl border ${fontFamily === 'sans' ? 'border-black font-bold bg-black/5 text-black' : 'border-gray-200 text-gray-400 hover:border-gray-300'} transition-all`}>Aa<br /><span className="text-[10px] font-normal uppercase tracking-widest">Sans</span></button>
                        <button onClick={(e) => { e.stopPropagation(); setFontFamily('serif'); }} className={`flex-1 py-2 text-sm rounded-xl border font-serif ${fontFamily === 'serif' ? 'border-black font-bold bg-black/5 text-black' : 'border-gray-200 text-gray-400 hover:border-gray-300'} transition-all`}>Aa<br /><span className="text-[10px] font-normal font-sans uppercase tracking-widest">Serif</span></button>
                        <button onClick={(e) => { e.stopPropagation(); setFontFamily('mono'); }} className={`flex-1 py-2 text-sm rounded-xl border font-mono ${fontFamily === 'mono' ? 'border-black font-bold bg-black/5 text-black' : 'border-gray-200 text-gray-400 hover:border-gray-300'} transition-all`}>Aa<br /><span className="text-[10px] font-normal font-sans uppercase tracking-widest">Mono</span></button>
                    </div>

                    {/* Size & Alignment Row */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex bg-gray-50 rounded-xl p-1 flex-1">
                            {['sm', 'base', 'lg', 'xl'].map(s => (
                                <button key={s} onClick={(e) => { e.stopPropagation(); setFontSize(s as FontSize); }} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${fontSize === s ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>
                                    {s.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <div className="flex bg-gray-50 rounded-xl p-1">
                            <button onClick={(e) => { e.stopPropagation(); setAlignment('left'); }} className={`p-2 rounded-lg transition-all ${alignment === 'left' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}><AlignLeft className="w-4 h-4" /></button>
                            <button onClick={(e) => { e.stopPropagation(); setAlignment('center'); }} className={`p-2 rounded-lg transition-all ${alignment === 'center' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}><AlignCenter className="w-4 h-4" /></button>
                            <button onClick={(e) => { e.stopPropagation(); setAlignment('justify'); }} className={`p-2 rounded-lg transition-all ${alignment === 'justify' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}><AlignJustify className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border ${isDark ? 'bg-[#1e293b] text-white border-white/10 hover:bg-[#334155]' : 'bg-white text-black border-gray-200 hover:bg-gray-50'}`}
                    >
                        <Settings2 className="w-6 h-6" />
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-8 h-14 rounded-full flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_8px_30px_rgba(34,197,94,0.3)] border border-green-500/20 bg-green-500 hover:bg-green-600 hover:-translate-y-1 text-white font-bold tracking-wide"
                    >
                        {isSaving ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Cloud className="w-5 h-5" />
                        )}
                        {isSaving ? 'SAVING...' : 'SAVE NOTE'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────
export default function WaliaNotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setNotes(loadNotes());
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleCreate = () => {
        const newNote: Note = {
            id: `note_${Date.now()}`,
            title: '',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setActiveNote(newNote);
    };

    const handleOpen = (note: Note) => {
        setActiveNote(note);
    };

    const handleSave = (updated: Note) => {
        setNotes(prev => {
            const exists = prev.find(n => n.id === updated.id);
            const next = exists
                ? prev.map(n => n.id === updated.id ? updated : n)
                : [updated, ...prev];
            saveNotes(next);
            return next;
        });
    };

    const handleDelete = (id: string) => {
        setNotes(prev => {
            const next = prev.filter(n => n.id !== id);
            saveNotes(next);
            return next;
        });
    };

    const handleBack = () => {
        setActiveNote(null);
    };

    if (activeNote) {
        return (
            <NoteEditorView
                note={activeNote}
                onSave={handleSave}
                onBack={handleBack}
            />
        );
    }

    return (
        <NotesListView
            notes={notes}
            onCreate={handleCreate}
            onOpen={handleOpen}
            onDelete={handleDelete}
        />
    );
}
