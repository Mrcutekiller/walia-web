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
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bell,
    BookOpen,
    CalendarDays,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    Plus,
    Trash2,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Event {
    id: string;
    title: string;
    time: string;
    date: string; // YYYY-MM-DD
    type: string;
    color: string;
    description?: string;
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function EventsPage() {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('Study');
    const [color, setColor] = useState('bg-black');

    // 1. Fetch Events
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'users', user.uid, 'events'),
            orderBy('date', 'asc')
        );
        const unsub = onSnapshot(q, (snap) => {
            setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() } as Event)));
        });
        return () => unsub();
    }, [user]);

    const handleAddEvent = async () => {
        if (!title || !date || !user) return;

        try {
            if (editingEvent) {
                await updateDoc(doc(db, 'users', user.uid, 'events', editingEvent.id), {
                    title, time, date, type, color,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, 'users', user.uid, 'events'), {
                    title, time, date, type, color,
                    createdAt: serverTimestamp()
                });
            }
            closeModal();
        } catch (error) {
            console.error('Event save error:', error);
        }
    };

    const handleDeleteEvent = async (id: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, 'users', user.uid, 'events', id));
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const openModal = (event?: Event) => {
        if (event) {
            setEditingEvent(event);
            setTitle(event.title);
            setTime(event.time);
            setDate(event.date);
            setType(event.type);
            setColor(event.color);
        } else {
            setEditingEvent(null);
            setTitle('');
            setTime('');
            setDate('');
            setType('Study');
            setColor('bg-black');
        }
        setShowAddModal(true);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setEditingEvent(null);
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    };

    // Calendar Generation
    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const currentMonthNum = currentDate.getMonth();
    const currentYearNum = currentDate.getFullYear();
    const totalDays = daysInMonth(currentMonthNum, currentYearNum);
    const startOffset = firstDayOfMonth(currentMonthNum, currentYearNum);

    return (
        <div className="min-h-full bg-white dark:bg-[#0A0A18] text-black dark:text-white animate-in fade-in pb-20 transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#0A0A18]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
                <div>
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-3 text-black dark:text-white">
                        <CalendarDays className="w-6 h-6" /> Schedule & Events
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">Manage your study sessions and upcoming meetings.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold shadow-lg hover:bg-zinc-800 dark:hover:bg-gray-200 transition-colors shrink-0"
                >
                    <Plus className="w-4 h-4" /> New Event
                </button>
            </header>

            <main className="max-w-[1400px] mx-auto px-6 pt-8">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Calendar Column */}
                    <div className="xl:col-span-3 space-y-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 gap-4 transition-colors">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <h2 className="text-2xl font-black text-black dark:text-white">{monthNames[currentMonthNum]}</h2>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-[0.2em] uppercase">{currentYearNum}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={prevMonth} className="p-2.5 rounded-2xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-sm">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button onClick={nextMonth} className="p-2.5 rounded-2xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-sm">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => setCurrentDate(new Date())}
                                className="flex items-center px-5 py-2.5 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all shadow-sm"
                            >
                                <CalendarIcon className="w-4 h-4 mr-2" /> Today
                            </button>
                        </div>

                        <div className="overflow-x-auto rounded-[2rem] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#070712] transition-colors">
                            <div className="min-w-[800px] p-6">
                                {/* Days Header */}
                                <div className="grid grid-cols-7 gap-4 mb-4">
                                    {days.map((day) => (
                                        <div key={day} className="text-center py-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{day}</div>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-4">
                                    {Array.from({ length: 42 }).map((_, i) => {
                                        const dayNum = i - startOffset + 1;
                                        const isValidDay = dayNum > 0 && dayNum <= totalDays;
                                        const dateString = `${currentYearNum}-${String(currentMonthNum + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                                        const dayEvents = events.filter(e => e.date === dateString);
                                        const isToday = new Date().toISOString().split('T')[0] === dateString;

                                        return (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "min-h-[140px] p-4 rounded-3xl border transition-all cursor-pointer group flex flex-col",
                                                    isValidDay
                                                        ? "bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm"
                                                        : "opacity-0 pointer-events-none",
                                                    isToday && "border-black dark:border-white bg-gray-50 dark:bg-white/10 ring-1 ring-black dark:ring-white shadow-md"
                                                )}
                                                onClick={() => isValidDay && openModal({ id: '', title: '', time: '', date: dateString, type: 'Study', color: 'bg-black' })}
                                            >
                                                <p className={cn(
                                                    "text-sm font-black mb-3 w-8 h-8 flex items-center justify-center rounded-full transition-colors",
                                                    isToday ? "bg-black dark:bg-white text-white dark:text-black" : "text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white"
                                                )}>
                                                    {isValidDay ? dayNum : ''}
                                                </p>

                                                {isValidDay && (
                                                    <div className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar pr-1">
                                                        {dayEvents.map(e => (
                                                            <div
                                                                key={e.id}
                                                                onClick={(ev) => { ev.stopPropagation(); openModal(e); }}
                                                                className={cn(
                                                                    "px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest truncate hover:scale-105 transition-all flex items-center justify-between group/item",
                                                                    e.color && e.color === 'bg-black'
                                                                        ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                                                                        : "bg-white dark:bg-white/5 text-black dark:text-white border-gray-200 dark:border-gray-800"
                                                                )}
                                                            >
                                                                <span className="truncate pr-2">{e.title}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Upcoming */}
                    <div className="space-y-8">
                        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-[2rem] p-6 transition-colors">
                            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center mb-6">
                                <Clock className="w-5 h-5 mr-3 text-black dark:text-white" /> Upcoming Events
                            </h2>
                            <div className="space-y-4">
                                {events.length === 0 ? (
                                    <div className="py-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-[2rem]">
                                        <CalendarDays className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500">No upcoming events</p>
                                    </div>
                                ) : (
                                    events.slice(0, 5).map((event) => (
                                        <div
                                            key={event.id}
                                            onClick={() => openModal(event)}
                                            className="p-5 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white hover:shadow-md transition-all group cursor-pointer relative overflow-hidden flex flex-col gap-3"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                                                        {event.date} {event.time && `• ${event.time}`}
                                                    </span>
                                                    <h3 className="text-sm font-black text-black dark:text-white leading-tight group-hover:underline">{event.title}</h3>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}
                                                    className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/10 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-500/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 w-fit px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800">
                                                <BookOpen className="w-3.5 h-3.5 mr-2 text-black dark:text-white" /> {event.type}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-black dark:bg-white text-white dark:text-black space-y-4 shadow-xl transition-colors">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-800 dark:bg-gray-100 border border-zinc-700 dark:border-gray-200 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-white dark:text-black animate-bounce" />
                            </div>
                            <h3 className="text-lg font-black leading-tight">Sync your calendar.</h3>
                            <p className="text-gray-400 dark:text-gray-500 text-sm font-medium leading-relaxed">
                                Stay organized with persistent study sessions and real-time community events.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="w-full max-w-lg bg-white dark:bg-[#0A0A18] rounded-[2rem] p-8 md:p-10 relative z-10 shadow-2xl border border-gray-100 dark:border-gray-800"
                        >
                            <button onClick={closeModal} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors">
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-2xl font-black text-black dark:text-white mb-8">
                                {editingEvent ? 'Edit Event' : 'Add New Event'}
                            </h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Event Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Physics Final Exam"
                                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-2xl px-5 py-4 text-black dark:text-white outline-none focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 transition-all font-semibold placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Date</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-2xl px-5 py-4 text-black dark:text-white outline-none focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 transition-all font-semibold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Time</label>
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-2xl px-5 py-4 text-black dark:text-white outline-none focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 transition-all font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Category</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Study', 'Exam', 'Social', 'AI', 'Personal'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setType(t)}
                                                className={cn(
                                                    "px-5 py-2.5 rounded-full border text-xs font-bold transition-all",
                                                    type === t
                                                        ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-md shadow-black/10"
                                                        : "bg-white dark:bg-white/5 border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-black dark:hover:text-white"
                                                )}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Color Marker</label>
                                    <div className="flex gap-4">
                                        {[
                                            { color: 'bg-black', label: 'Black' },
                                            { color: 'bg-gray-500', label: 'Gray' },
                                            { color: 'bg-indigo-500', label: 'Indigo' },
                                            { color: 'bg-emerald-500', label: 'Green' }
                                        ].map(c => (
                                            <button
                                                key={c.color}
                                                onClick={() => setColor(c.color)}
                                                className={cn(
                                                    "w-10 h-10 rounded-full transition-all border-4",
                                                    c.color,
                                                    color === c.color ? "border-white dark:border-black ring-2 ring-black dark:ring-white scale-110 shadow-lg" : "border-transparent hover:scale-105"
                                                )}
                                                title={c.label}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-3">
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 py-4 rounded-full bg-gray-100 dark:bg-white/10 text-black dark:text-white font-bold text-xs uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddEvent}
                                        className="flex-[2] py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-gray-200 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/20"
                                    >
                                        {editingEvent ? 'Save Changes' : 'Publish Event'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
