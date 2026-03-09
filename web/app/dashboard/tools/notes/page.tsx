'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import {
    ArrowLeft,
    FileText,
    Loader2,
    Plus,
    Search,
    Sparkles,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Note {
    id: string;
    title: string;
    content: string;
    updatedAt: any;
}

export default function NotesPage() {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);

    // Fetch notes
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'users', user.uid, 'notes'), orderBy('updatedAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Note)));
        });
        return () => unsub();
    }, [user]);

    // Handle auto-save
    useEffect(() => {
        if (!activeNote || !user) return;
        const timer = setTimeout(async () => {
            if (title === activeNote.title && content === activeNote.content) return;
            setIsSaving(true);
            try {
                await updateDoc(doc(db, 'users', user.uid, 'notes', activeNote.id), {
                    title: title || 'Untitled Note',
                    content,
                    updatedAt: serverTimestamp()
                });
            } catch (err) {
                console.error('Auto-save error:', err);
            } finally {
                setIsSaving(false);
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, [title, content, activeNote, user]);

    const createNote = async () => {
        if (!user) return;
        const newNote = {
            title: 'New Study Note',
            content: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, 'users', user.uid, 'notes'), newNote);
        setActiveNote({ id: docRef.id, ...newNote });
        setTitle('New Study Note');
        setContent('');
    };

    const deleteNote = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user || !confirm('Delete this note?')) return;
        await deleteDoc(doc(db, 'users', user.uid, 'notes', id));
        if (activeNote?.id === id) {
            setActiveNote(null);
            setTitle('');
            setContent('');
        }
    };

    const handleGenerateOutline = async () => {
        if (!content.trim() || aiLoading) return;
        setAiLoading(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `Generate a structured study outline for the following content: \n\n${content}`,
                    systemPrompt: "You are an academic secretary. Create structured, hierarchical outlines for study notes. Use markdown headers and bullets."
                })
            });
            const data = await res.json();
            setContent(prev => `${prev}\n\n--- AI Generated Outline ---\n\n${data.reply}`);
        } catch (err) {
            console.error('AI Outline error:', err);
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row bg-white dark:bg-[#0A0A18] text-black dark:text-white animate-in fade-in overflow-hidden transition-colors">

            {/* Sidebar */}
            <aside className={cn(
                "w-full md:w-80 border-r border-gray-100 dark:border-gray-800 flex flex-col bg-gray-50/50 dark:bg-white/5 transition-all",
                !showSidebar ? "hidden md:flex md:w-0 md:opacity-0" : "flex"
            )}>
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/tools" className="hover:opacity-50 transition-opacity">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h2 className="font-black text-xl tracking-tight">Notes</h2>
                    </div>
                    <button
                        onClick={createNote}
                        className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:bg-zinc-800 dark:hover:bg-gray-200 transition-all shadow-lg shadow-black/10 dark:shadow-white/5"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            onClick={() => { setActiveNote(note); setTitle(note.title); setContent(note.content); }}
                            className={cn(
                                "p-4 rounded-[1.5rem] border transition-all cursor-pointer group relative",
                                activeNote?.id === note.id
                                    ? "bg-white dark:bg-white/10 border-black dark:border-white shadow-md shadow-black/5 dark:shadow-white/5"
                                    : "bg-transparent border-transparent hover:bg-white dark:hover:bg-white/5 hover:border-gray-200 dark:hover:border-gray-800"
                            )}
                        >
                            <h3 className="text-sm font-black truncate pr-6 text-black dark:text-white">{note.title || 'Untitled'}</h3>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest">
                                {note.updatedAt ? new Date(note.updatedAt.seconds * 1000).toLocaleDateString() : 'Saving...'}
                            </p>
                            <button
                                onClick={(e) => deleteNote(note.id, e)}
                                className="absolute top-4 right-4 text-gray-300 dark:text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {notes.length === 0 && (
                        <div className="text-center py-20 opacity-20 flex flex-col items-center">
                            <FileText className="w-10 h-10 mb-4" />
                            <p className="text-xs font-black uppercase tracking-widest">Nothing yet</p>
                        </div>
                    )}
                </div>
            </aside>

            {/* Editor Area */}
            <main className="flex-1 flex flex-col relative h-full transition-colors">
                {activeNote ? (
                    <>
                        <header className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
                            <div className="flex-1 flex items-center gap-4">
                                <button onClick={() => setShowSidebar(!showSidebar)} className="hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors">
                                    <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                </button>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Note title..."
                                    className="bg-transparent text-xl font-black text-black dark:text-white outline-none w-full"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                {isSaving ? (
                                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic animate-pulse">Saving...</span>
                                ) : (
                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Saved</span>
                                )}
                                <div className="h-4 w-px bg-gray-100 dark:bg-gray-800" />
                                <button
                                    onClick={handleGenerateOutline}
                                    disabled={aiLoading || !content.trim()}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-gray-800 text-xs font-bold text-black dark:text-white hover:bg-white dark:hover:bg-white/10 transition-all disabled:opacity-20 shadow-sm"
                                >
                                    {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                    <span className="hidden sm:inline">AI Outline</span>
                                </button>
                            </div>
                        </header>

                        <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Start typing your study notes here..."
                                className="w-full h-full bg-transparent resize-none outline-none font-medium text-gray-700 dark:text-gray-300 leading-relaxed text-lg placeholder:text-gray-200 dark:placeholder:text-gray-800 custom-scrollbar"
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
                        <div className="w-24 h-24 rounded-[3rem] bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-8">
                            <FileText className="w-10 h-10 text-black dark:text-white" />
                        </div>
                        <h2 className="text-2xl font-black mb-2">Select a note</h2>
                        <p className="text-sm font-medium">Or create a new one to begin your study session.</p>
                        <button
                            onClick={createNote}
                            className="mt-8 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest shadow-xl shadow-black/10 dark:shadow-white/5 hover:scale-105 transition-all"
                        >
                            Create New Note
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
