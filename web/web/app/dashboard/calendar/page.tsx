'use client';

import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { 
    ChevronLeft, ChevronRight, Plus, Clock, Trash2, 
    Calendar as CalendarIcon, CheckCircle2, Bell, X, Sparkles
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
    collection, onSnapshot, query, where, addDoc, 
    serverTimestamp, deleteDoc, doc, updateDoc 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
    id: string;
    title: string;
    date: string;
    time: string;
    completed: boolean;
    uid: string;
}

export default function CalendarPage() {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', time: '09:00' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'tasks'), where('uid', '==', user.uid));
        return onSnapshot(q, snap => {
            setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() } as Task)));
        });
    }, [user]);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const renderHeader = () => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return (
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black text-black dark:text-white tracking-tighter uppercase">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h1>
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Manage your schedule</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                        className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                        className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return (
            <div className="grid grid-cols-7 mb-4">
                {days.map(day => (
                    <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{day}</div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const days = [];
        const totalDays = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-28 md:h-32 border border-transparent" />);
        }

        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(year, month, i);
            const dateStr = date.toISOString().split('T')[0];
            const isSelected = selectedDate.getDate() === i && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
            const isToday = new Date().toDateString() === date.toDateString();
            const dayTasks = tasks.filter(t => t.date === dateStr);

            days.push(
                <div 
                    key={i} 
                    onClick={() => setSelectedDate(date)}
                    className={`h-28 md:h-32 p-3 border border-gray-100 dark:border-white/5 cursor-pointer transition-all relative ${
                        isSelected 
                        ? 'bg-black dark:bg-white text-white dark:text-black ring-1 ring-black dark:ring-white z-10 scale-[1.02] shadow-2xl rounded-2xl' 
                        : 'bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10'
                    }`}
                >
                    <span className={`text-xs font-black ${isToday && !isSelected ? 'text-black dark:text-white underline' : ''}`}>{i}</span>
                    {dayTasks.length > 0 && (
                        <div className="mt-2 space-y-1 overflow-hidden">
                            {dayTasks.slice(0, 2).map(t => (
                                <div key={t.id} className={`text-[8px] font-black uppercase truncate px-2 py-1 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-black/5 dark:bg-white/5'}`}>
                                    {t.title}
                                </div>
                            ))}
                            {dayTasks.length > 2 && <div className="text-[8px] font-bold text-gray-400">+{dayTasks.length - 2} more</div>}
                        </div>
                    )}
                </div>
            );
        }
        return <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-white/5 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5">{days}</div>;
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.title || !user || loading) return;
        setLoading(true);
        try {
            await addDoc(collection(db, 'tasks'), {
                uid: user.uid,
                title: newTask.title,
                date: selectedDate.toISOString().split('T')[0],
                time: newTask.time,
                completed: false,
                createdAt: serverTimestamp()
            });
            setNewTask({ title: '', time: '09:00' });
            setShowAddModal(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (id: string) => {
        await deleteDoc(doc(db, 'tasks', id));
    };

    const toggleTask = async (task: Task) => {
        await updateDoc(doc(db, 'tasks', task.id), { completed: !task.completed });
    };

    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const selectedTasks = tasks.filter(t => t.date === selectedDateStr).sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div className="flex flex-col lg:flex-row h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0A0A18] dark:via-[#0D0D1A] dark:to-[#0A0A18] overflow-hidden">
            {/* ── Left: Calendar ── */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    {renderHeader()}
                    {renderDays()}
                    {renderCells()}
                </motion.div>
            </div>

            {/* ── Right: Tasks Panel ── */}
            <div className="w-full lg:w-[400px] border-l border-gray-200/60 dark:border-white/5 bg-white/70 dark:bg-black/30 backdrop-blur-xl p-8 overflow-y-auto custom-scrollbar">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black text-black dark:text-white tracking-tight uppercase">Daily Tasks</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="w-12 h-12 rounded-2xl bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-black/10"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {selectedTasks.length === 0 ? (
                            <div className="text-center py-20 opacity-30">
                                <CalendarIcon className="w-12 h-12 mx-auto mb-4" />
                                <p className="text-xs font-black uppercase">No tasks for today</p>
                            </div>
                        ) : selectedTasks.map((task, index) => (
                            <motion.div 
                                key={task.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.05 }}
                                className={`group p-6 rounded-[2rem] border transition-all duration-300 flex items-center gap-4 ${
                                    task.completed 
                                    ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20' 
                                    : 'bg-white/70 dark:bg-white/5 border-gray-200/60 dark:border-white/10 hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-sm'
                                }`}
                            >
                                <button 
                                    onClick={() => toggleTask(task)}
                                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                        task.completed 
                                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                                        : 'border-gray-200 dark:border-white/20'
                                    }`}
                                >
                                    {task.completed && <CheckCircle2 className="w-4 h-4" />}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-bold uppercase tracking-tight truncate ${task.completed ? 'text-emerald-900/50 dark:text-emerald-400/50 line-through' : 'text-black dark:text-white'}`}>
                                        {task.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-3 h-3 text-gray-400" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{task.time}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => deleteTask(task.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-300 hover:text-red-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Bell className="w-12 h-12" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Notifications
                        </h3>
                        <p className="text-[10px] font-medium text-white/60 dark:text-black/60 leading-relaxed">
                            Stay on top of your schedule. Walia will remind you about your tasks 15 minutes before they start.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* ── Add Task Modal ── */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowAddModal(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-white/90 dark:bg-[#0A0A18]/90 backdrop-blur-xl rounded-[2.5rem] p-8 border border-gray-200/60 dark:border-white/10 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">Add Task</h3>
                                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddTask} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Title</label>
                                    <input 
                                        type="text" required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                                        placeholder="What needs to be done?"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white outline-none transition-all font-medium text-sm text-black dark:text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Date</label>
                                        <input 
                                            type="date" disabled value={selectedDateStr}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-400 outline-none cursor-not-allowed text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Time</label>
                                        <input 
                                            type="time" required value={newTask.time} onChange={e => setNewTask({...newTask, time: e.target.value})}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white outline-none transition-all font-medium text-sm text-black dark:text-white"
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="submit" disabled={loading}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black font-black text-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all duration-300 shadow-xl shadow-black/10"
                                >
                                    {loading ? "Adding..." : "Add Task"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
