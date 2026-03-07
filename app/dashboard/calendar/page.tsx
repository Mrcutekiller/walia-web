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
    Trash2
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

export default function CalendarPage() {
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
    const [color, setColor] = useState('bg-walia-primary');

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
            setColor('bg-walia-primary');
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 animate-fade-in-up">

            {/* Calendar Column */}
            <div className="lg:col-span-3 space-y-10">
                <header className="flex flex-col md:flex-row items-center justify-between p-8 rounded-[40px] bg-white/5 border border-white/10 gap-6">
                    <div className="flex items-center space-x-8">
                        <div className="flex flex-col">
                            <h2 className="text-3xl font-black text-white">{monthNames[currentMonthNum]}</h2>
                            <p className="text-xs font-bold text-white/20 tracking-[0.3em] uppercase">{currentYearNum}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={prevMonth} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={nextMonth} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="hidden md:flex items-center px-6 py-3 rounded-2xl bg-white/5 text-xs font-bold text-white/50 hover:text-white transition-all"
                        >
                            <CalendarIcon className="w-4 h-4 mr-3" /> Today
                        </button>
                        <button
                            onClick={() => openModal()}
                            className="px-8 py-3 rounded-2xl bg-walia-primary text-white text-sm font-black hover:bg-walia-secondary transition-all shadow-lg shadow-walia-primary/20 flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-3" /> Add Event
                        </button>
                    </div>
                </header>

                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        {/* Days Header */}
                        <div className="grid grid-cols-7 gap-4 mb-6">
                            {days.map((day) => (
                                <div key={day} className="text-center py-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{day}</div>
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
                                            "min-h-[140px] p-6 rounded-[32px] border transition-all group cursor-pointer",
                                            isValidDay ? "bg-white/5 border-white/5 hover:border-white/10" : "opacity-0 pointer-events-none",
                                            isToday && "border-walia-primary/50 bg-walia-primary/5 shadow-lg shadow-walia-primary/5"
                                        )}
                                        onClick={() => isValidDay && openModal({ id: '', title: '', time: '', date: dateString, type: 'Study', color: 'bg-walia-primary' })}
                                    >
                                        <p className={cn(
                                            "text-sm font-black mb-4",
                                            isToday ? "text-walia-primary" : "text-white/20 group-hover:text-white/40"
                                        )}>
                                            {isValidDay ? dayNum : ''}
                                        </p>

                                        {isValidDay && (
                                            <div className="space-y-2">
                                                {dayEvents.map(e => (
                                                    <div
                                                        key={e.id}
                                                        onClick={(ev) => { ev.stopPropagation(); openModal(e); }}
                                                        className={cn(
                                                            "px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase text-white tracking-widest truncate hover:scale-105 transition-transform",
                                                            e.color || 'bg-walia-primary',
                                                            "border-white/10"
                                                        )}
                                                    >
                                                        {e.title}
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
            <div className="space-y-10">
                <div className="space-y-8">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <Clock className="w-5 h-5 mr-3 text-walia-primary" /> Upcoming Events
                    </h2>
                    <div className="space-y-4">
                        {events.length === 0 ? (
                            <div className="p-8 text-center bg-white/5 border border-dashed border-white/10 rounded-[32px]">
                                <CalendarDays className="w-8 h-8 text-white/10 mx-auto mb-4" />
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">No upcoming events</p>
                            </div>
                        ) : (
                            events.slice(0, 5).map((event) => (
                                <div
                                    key={event.id}
                                    onClick={() => openModal(event)}
                                    className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group cursor-pointer relative overflow-hidden"
                                >
                                    <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", event.color)} />
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                                            {event.date} {event.time && `• ${event.time}`}
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}
                                            className="text-white/10 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <h3 className="text-sm font-bold text-white mb-4 group-hover:text-walia-primary transition-colors">{event.title}</h3>
                                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/20">
                                        <BookOpen className="w-4 h-4 mr-2" /> {event.type} Session
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="p-10 rounded-[40px] bg-gradient-to-br from-walia-primary/10 to-transparent border border-walia-primary/20 space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-walia-primary/10 border border-walia-primary/20 flex items-center justify-center">
                        <Bell className="w-6 h-6 text-walia-primary animate-bounce-sm" />
                    </div>
                    <h3 className="text-lg font-bold text-white leading-tight">Sync your calendar.</h3>
                    <p className="text-white/40 text-xs leading-relaxed">
                        Stay organized with persistent study sessions and real-time community events.
                    </p>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[40px] p-10 relative z-10 shadow-2xl"
                        >
                            <h2 className="text-2xl font-black text-white mb-8">
                                {editingEvent ? 'Edit Event' : 'Add New Event'}
                            </h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-4">Event Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Physics Final Exam"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-walia-primary transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-4">Date</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-walia-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-4">Time</label>
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-walia-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-4">Category</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Study', 'Exam', 'Social', 'AI', 'Personal'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setType(t)}
                                                className={cn(
                                                    "px-6 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                                    type === t ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                                                )}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-4">Color Theme</label>
                                    <div className="flex gap-4 px-2">
                                        {['bg-walia-primary', 'bg-walia-accent', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setColor(c)}
                                                className={cn(
                                                    "w-8 h-8 rounded-full transition-transform",
                                                    c,
                                                    color === c ? "scale-125 border-2 border-white ring-4 ring-walia-primary/20" : "hover:scale-110"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 flex gap-4">
                                    <button
                                        onClick={handleAddEvent}
                                        className="flex-1 py-4 rounded-3xl bg-walia-primary text-white font-black text-xs uppercase tracking-widest hover:bg-walia-secondary transition-all shadow-xl shadow-walia-primary/20"
                                    >
                                        {editingEvent ? 'Update Event' : 'Create Event'}
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="px-8 py-4 rounded-3xl bg-white/5 text-white/40 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                                    >
                                        Cancel
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
