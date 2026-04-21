'use client';

import { DashboardHeader } from '@/components/DashboardHeader';
import { DashboardShell } from '@/components/DashboardShell';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { 
  addDoc, collection, doc, onSnapshot, query, 
  updateDoc, where, deleteDoc, serverTimestamp 
} from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Plus, CheckCircle2, Circle, Calendar, Clock, 
  Check, Trash2, Edit3, ChevronRight 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

export default function DailyPlanPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<any[]>([]);
    const [newTask, setNewTask] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isAdding, setIsAdding] = useState(false);

    // Generate week days
    const weekStart = startOfWeek(selectedDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'tasks'),
            where('userId', '==', user.id)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [user]);

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim() || !user) return;
        
        try {
            await addDoc(collection(db, 'tasks'), {
                userId: user.id,
                title: newTask,
                completed: false,
                date: format(selectedDate, 'yyyy-MM-dd'),
                createdAt: serverTimestamp(),
                priority: 'medium'
            });
            setNewTask('');
            setIsAdding(false);
        } catch (e) {
            console.error(e);
        }
    };

    const toggleTask = async (task: any) => {
        try {
            await updateDoc(doc(db, 'tasks', task.id), {
                completed: !task.completed
            });
        } catch (e) {
            console.error(e);
        }
    };

    const deleteTask = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'tasks', id));
        } catch (e) {
            console.error(e);
        }
    };

    const filteredTasks = tasks.filter(t => t.date === format(selectedDate, 'yyyy-MM-dd'));

    return (
        <DashboardShell>
            <DashboardHeader 
                heading="Daily Plan" 
                text="Organize your study sessions and track your progress."
            >
                <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-2xl font-black hover:scale-[1.02] transition-transform shadow-lg shadow-[var(--color-primary)]/20"
                >
                    <Plus className="w-5 h-5" />
                    New Task
                </button>
            </DashboardHeader>

            <div className="grid gap-8">
                {/* Calendar Strip */}
                <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/20 rounded-[2.5rem] p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-container)] flex items-center justify-center text-[var(--color-primary)]">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-xl">{format(selectedDate, 'MMMM yyyy')}</h3>
                                <p className="text-sm text-[var(--color-outline)] font-bold uppercase tracking-wider">Your Weekly Schedule</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-4">
                        {weekDays.map((date, i) => {
                            const isSelected = isSameDay(date, selectedDate);
                            const isToday = isSameDay(date, new Date());
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(date)}
                                    className={`relative flex flex-col items-center gap-3 p-6 rounded-3xl transition-all ${
                                        isSelected 
                                        ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-xl shadow-[var(--color-primary)]/20 scale-105 z-10' 
                                        : 'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:scale-[1.02]'
                                    }`}
                                >
                                    {isToday && !isSelected && (
                                        <div className="absolute top-2 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                                    )}
                                    <span className={`text-xs font-black uppercase tracking-widest ${isSelected ? 'opacity-80' : 'opacity-60'}`}>
                                        {format(date, 'EEE')}
                                    </span>
                                    <span className="text-2xl font-black">
                                        {format(date, 'd')}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Task List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <h3 className="font-black text-xl">Tasks for {format(selectedDate, 'MMM d')}</h3>
                            <span className="px-3 py-1 bg-[var(--color-surface-container)] rounded-full text-[10px] font-black uppercase tracking-widest text-[var(--color-outline)]">
                                {filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'}
                            </span>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {isAdding && (
                                <motion.form
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onSubmit={addTask}
                                    className="p-6 bg-[var(--color-surface-container-low)] border-2 border-dashed border-[var(--color-primary)]/30 rounded-[2rem] flex gap-4"
                                >
                                    <input 
                                        autoFocus
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        placeholder="What needs to be done?"
                                        className="flex-1 bg-transparent text-lg font-bold outline-none placeholder:opacity-50"
                                    />
                                    <div className="flex gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => setIsAdding(false)}
                                            className="p-2 rounded-xl hover:bg-[var(--color-surface-container)] text-[var(--color-outline)]"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                        <button 
                                            type="submit"
                                            className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl font-black"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </motion.form>
                            )}

                            {filteredTasks.length === 0 && !isAdding ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-20 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/10 rounded-[2.5rem] flex flex-col items-center gap-4 text-[var(--color-outline)] opacity-40 shadow-sm"
                                >
                                    <CheckCircle2 className="w-16 h-16 stroke-[1]" />
                                    <p className="font-black uppercase tracking-[0.2em] text-sm">No tasks for this day</p>
                                </motion.div>
                            ) : (
                                filteredTasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className={`group flex items-center gap-4 p-6 rounded-[2rem] border transition-all ${
                                            task.completed 
                                            ? 'bg-[var(--color-surface-container-low)]/50 border-[var(--color-outline-variant)]/10 opacity-60' 
                                            : 'bg-[var(--color-surface-container-lowest)] border-[var(--color-outline-variant)]/20 shadow-lg hover:shadow-xl'
                                        }`}
                                    >
                                        <button 
                                            onClick={() => toggleTask(task)}
                                            className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                                task.completed 
                                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                                : 'border-[var(--color-outline)] group-hover:border-[var(--color-primary)]'
                                            }`}
                                        >
                                            {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <p className={`text-lg transition-all ${task.completed ? 'line-through decoration-emerald-500' : 'font-bold text-[var(--color-on-surface)]'}`}>
                                                {task.title}
                                            </p>
                                        </div>

                                        <button 
                                            onClick={() => deleteTask(task.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Stats/Inspiration Card */}
                    <div className="space-y-8">
                        <div className="bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-[2.5rem] p-8 shadow-xl shadow-[var(--color-primary)]/20 overflow-hidden relative group">
                            <div className="relative z-10">
                                <h4 className="font-black text-2xl mb-2">Keep Going!</h4>
                                <p className="text-sm opacity-80 font-medium leading-relaxed mb-6">You've completed {tasks.filter(t => t.completed).length} tasks this week. Consistency is key to mastery.</p>
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(tasks.filter(t => t.completed).length / (tasks.length || 1)) * 100}%` }}
                                        className="h-full bg-white"
                                    />
                                </div>
                            </div>
                            <CheckCircle2 className="absolute -bottom-10 -right-10 w-44 h-44 text-white opacity-10 group-hover:rotate-12 transition-transform duration-700" />
                        </div>

                        <div className="bg-[var(--color-surface-container-low)] rounded-[2.5rem] p-8 border border-[var(--color-outline-variant)]/20">
                            <h4 className="font-black text-lg mb-4">Study Tips</h4>
                            <div className="space-y-4">
                                {[
                                    'Break large tasks into bit-sized chunks.',
                                    'Use the Pomodoro technique for better focus.',
                                    'Review your notes shortly after a session.'
                                ].map((tip, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="shrink-0 w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-[10px] font-black">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm text-[var(--color-on-surface-variant)]">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

const X = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
