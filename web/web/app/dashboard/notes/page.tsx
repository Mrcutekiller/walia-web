'use client';

import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen, Brain, HelpCircle, Layers, MoreHorizontal,
  Pencil, Plus, Search, Trash2, X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  addDoc, collection, deleteDoc, doc,
  onSnapshot, orderBy, query, serverTimestamp,
  updateDoc, where
} from 'firebase/firestore';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: any;
  updatedAt: any;
  uid: string;
}

const AI_ACTIONS = [
  { icon: Brain, label: 'Summarize', color: 'bg-black text-white', action: 'summarize' },
  { icon: Layers, label: 'Flashcards', color: 'bg-black text-white', action: 'flashcards' },
  { icon: HelpCircle, label: 'Quiz Me', color: 'bg-black text-white', action: 'quiz' },
];

export default function NotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMode, setAiMode] = useState('');
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'notes'), where('uid', '==', user.uid), orderBy('updatedAt', 'desc'));
    return onSnapshot(q, snap => setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Note))));
  }, [user]);

  const createNote = async () => {
    if (!user) return;
    const ref = await addDoc(collection(db, 'notes'), {
      uid: user.uid, title: 'Untitled Note', content: '',
      createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    const newNote = { id: ref.id, uid: user.uid, title: 'Untitled Note', content: '', createdAt: null, updatedAt: null };
    setSelected(newNote); setTitle('Untitled Note'); setContent('');
  };

  const selectNote = (note: Note) => {
    setSelected(note); setTitle(note.title); setContent(note.content); setAiResult('');
  };

  const saveNote = (t: string, c: string) => {
    if (!selected) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      await updateDoc(doc(db, 'notes', selected.id), { title: t, content: c, updatedAt: serverTimestamp() });
    }, 800);
  };

  const deleteNote = async (id: string) => {
    await deleteDoc(doc(db, 'notes', id));
    if (selected?.id === id) { setSelected(null); setTitle(''); setContent(''); }
  };

  const handleAI = async (action: string) => {
    if (!content.trim()) { setAiResult('Add some content to your note first.'); return; }
    setAiLoading(true); setAiMode(action); setAiResult('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: action === 'summarize'
            ? `Summarize this:\n${content}`
            : action === 'flashcards'
            ? `Create 5 flashcards from this text. Format: Q: ... A: ...\n${content}`
            : `Create a 5-question quiz from this text:\n${content}`,
          mode: 'Study'
        }),
      });
      const data = await res.json();
      setAiResult(data.reply || 'No response from AI.');
    } catch { setAiResult('AI request failed. Please try again.'); }
    finally { setAiLoading(false); }
  };

  const filtered = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0A0A18] dark:via-[#0D0D1A] dark:to-[#0A0A18] text-black dark:text-white">

      {/* ── Sidebar: Note list ── */}
      <div className="w-72 border-r border-gray-200/60 dark:border-white/5 flex flex-col bg-white/70 dark:bg-black/30 backdrop-blur-xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200/60 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <span className="font-black text-sm uppercase tracking-wide">Notes</span>
          </div>
          <button onClick={createNote} className="w-8 h-8 rounded-xl bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-lg">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-200/60 dark:border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search notes..." 
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/10 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/5 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-300">
              <BookOpen className="w-8 h-8 mb-2" />
              <p className="text-xs font-medium">No notes yet</p>
            </div>
          ) : filtered.map((note, index) => (
            <div
              key={note.id}
              onClick={() => selectNote(note)}
              className={`group p-4 border-b border-gray-200/60 dark:border-white/5 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 relative ${selected?.id === note.id ? 'bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-200 text-white dark:text-black' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm truncate ${selected?.id === note.id ? 'text-white dark:text-black' : 'text-black dark:text-white'}`}>{note.title || 'Untitled'}</p>
                  <p className={`text-xs mt-0.5 truncate ${selected?.id === note.id ? 'text-white/50 dark:text-black/50' : 'text-gray-400'}`}>{note.content.slice(0, 60) || 'No content'}</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                  className={`opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${selected?.id === note.id ? 'hover:bg-white/20 dark:hover:bg-black/20' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create button */}
        <div className="p-3 border-t border-gray-200/60 dark:border-white/5">
          <button onClick={createNote} className="w-full py-3 rounded-2xl bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black text-xs font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300 shadow-lg">
            <Plus className="w-3.5 h-3.5" /> New Note
          </button>
        </div>
      </div>

      {/* ── Editor ── */}
      {selected ? (
        <div className="flex-1 flex flex-col overflow-hidden bg-white/50 dark:bg-black/20 backdrop-blur-xl">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-gray-200/60 dark:border-white/5 flex items-center gap-3">
            <Pencil className="w-4 h-4 text-gray-400" />
            <input
              type="text" value={title}
              onChange={e => { setTitle(e.target.value); saveNote(e.target.value, content); }}
              className="flex-1 font-black text-lg bg-transparent outline-none text-black dark:text-white placeholder:text-gray-200 dark:placeholder:text-gray-600"
              placeholder="Note title..."
            />
            {/* AI Buttons */}
            <div className="flex gap-2">
              {AI_ACTIONS.map(({ icon: Icon, label, action }) => (
                <button
                  key={action}
                  onClick={() => handleAI(action)}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black text-xs font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 shadow-md"
                >
                  <Icon className="w-3 h-3" /> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Text area */}
            <textarea
              value={content}
              onChange={e => { setContent(e.target.value); saveNote(title, e.target.value); }}
              placeholder="Start writing your note..."
              className="flex-1 p-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent outline-none resize-none font-medium placeholder:text-gray-200 dark:placeholder:text-gray-600"
            />

            {/* AI Result panel */}
            {(aiResult || aiLoading) && (
              <div className="w-80 border-l border-gray-200/60 dark:border-white/5 flex flex-col overflow-hidden bg-white/70 dark:bg-black/30 backdrop-blur-xl">
                <div className="px-4 py-3 border-b border-gray-200/60 dark:border-white/5 flex items-center justify-between bg-gray-50 dark:bg-white/5">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-black dark:text-white" />
                    <span className="text-xs font-black uppercase tracking-wide text-black dark:text-white">
                      {aiMode === 'summarize' ? 'Summary' : aiMode === 'flashcards' ? 'Flashcards' : 'Quiz'}
                    </span>
                  </div>
                  <button onClick={() => setAiResult('')} className="w-6 h-6 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-all">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {aiLoading ? (
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => <div key={i} className="h-3 bg-gray-100 dark:bg-white/10 rounded-full animate-pulse" style={{ width: `${70 + i * 7}%` }} />)}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{aiResult}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-200 dark:text-gray-700">
          <div className="text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-black text-gray-300 dark:text-gray-600">Select or create a note</p>
            <button onClick={createNote} className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black text-sm font-bold hover:scale-105 transition-all duration-300 shadow-lg">
              <Plus className="w-4 h-4 inline mr-2" /> New Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
