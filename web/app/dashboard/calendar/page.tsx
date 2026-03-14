'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { AnimatePresence, motion } from 'framer-motion';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import {
    CalendarDays,
    Check,
    ChevronLeft,
    ChevronRight,
    Circle,
    Clock,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

/* ─────────────── helpers ─────────────── */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

function dateKey(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

type PlanStatus = 'done' | 'ongoing' | 'not-done';

interface Plan {
    id: string;
    title: string;
    description?: string;
    status: PlanStatus;
    dateKey: string;
    createdAt: any;
}

/* ─────────────── status config ─────────────── */
const STATUS_CONFIG: Record<PlanStatus, { label: string; color: string; bg: string; border: string; icon: JSX.Element }> = {
    done: {
        label: 'Done',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: <Check className="w-4 h-4 text-emerald-600" />,
    },
    ongoing: {
        label: 'Ongoing',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: <Clock className="w-4 h-4 text-amber-500" />,
    },
    'not-done': {
        label: 'Not Done',
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: <Circle className="w-4 h-4 text-red-500" />,
    },
};

/* ─────────────── component ─────────────── */
export default function CalendarPage() {
    const { user } = useAuth();
    const today = new Date();

    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<string>(
        dateKey(today.getFullYear(), today.getMonth(), today.getDate())
    );
    const [plans, setPlans] = useState<Plan[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', status: 'not-done' as PlanStatus });
    const [saving, setSaving] = useState(false);

    /* calendar grid */
    const { firstDayOfWeek, daysInMonth } = useMemo(() => {
        const first = new Date(viewYear, viewMonth, 1);
        const days = new Date(viewYear, viewMonth + 1, 0).getDate();
        return { firstDayOfWeek: first.getDay(), daysInMonth: days };
    }, [viewYear, viewMonth]);

    const cells = useMemo(() => {
        const blanks = Array(firstDayOfWeek).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        return [...blanks, ...days];
    }, [firstDayOfWeek, daysInMonth]);

    /* firebase listener */
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'users', user.uid, 'plans'),
            where('dateKey', '==', selectedDate)
        );
        const unsub = onSnapshot(q, (snap) => {
            setPlans(snap.docs.map(d => ({ id: d.id, ...d.data() } as Plan)));
        });
        return () => unsub();
    }, [user, selectedDate]);

    /* all plans to show marker dots on calendar */
    const [allDatesWithPlans, setAllDatesWithPlans] = useState<Set<string>>(new Set());
    useEffect(() => {
        if (!user) return;
        const startKey = dateKey(viewYear, viewMonth, 1);
        const endKey = dateKey(viewYear, viewMonth, daysInMonth);
        const q = query(
            collection(db, 'users', user.uid, 'plans'),
            where('dateKey', '>=', startKey),
            where('dateKey', '<=', endKey)
        );
        const unsub = onSnapshot(q, (snap) => {
            const keys = new Set<string>(snap.docs.map(d => (d.data() as Plan).dateKey));
            setAllDatesWithPlans(keys);
        });
        return () => unsub();
    }, [user, viewYear, viewMonth, daysInMonth]);

    /* handlers */
    const prevMonth = () => {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    };

    const handleAddPlan = async () => {
        if (!user || !form.title.trim()) return;
        setSaving(true);
        try {
            await addDoc(collection(db, 'users', user.uid, 'plans'), {
                title: form.title.trim(),
                description: form.description.trim(),
                status: form.status,
                dateKey: selectedDate,
                createdAt: serverTimestamp(),
            });
            setForm({ title: '', description: '', status: 'not-done' });
            setShowModal(false);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (planId: string) => {
        if (!user) return;
        await deleteDoc(doc(db, 'users', user.uid, 'plans', planId));
    };

    const handleStatusChange = async (planId: string, status: PlanStatus) => {
        if (!user) return;
        await updateDoc(doc(db, 'users', user.uid, 'plans', planId), { status });
    };

    const plansByStatus = (status: PlanStatus) => plans.filter(p => p.status === status);

    const displayDate = (() => {
        const [y, m, d] = selectedDate.split('-').map(Number);
        return new Date(y, m - 1, d);
    })();

    const displayDateStr = displayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const isToday = (day: number) => dateKey(viewYear, viewMonth, day) === dateKey(today.getFullYear(), today.getMonth(), today.getDate());

    return (
        <div className="h-full flex flex-col lg:flex-row bg-gray-50 overflow-hidden animate-in fade-in">

            {/* ── Left: Calendar ── */}
            <div className="w-full lg:w-[380px] shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
                {/* Month navigation */}
                <div className="px-6 pt-8 pb-4 flex items-center justify-between">
                    <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-600">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-black text-black tracking-tight">
                        {MONTHS[viewMonth]} {viewYear}
                    </h2>
                    <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-600">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Day headers */}
                <div className="px-4 grid grid-cols-7 mb-2">
                    {DAYS.map(d => (
                        <div key={d} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest py-2">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="px-4 pb-6 grid grid-cols-7 gap-1">
                    {cells.map((day, i) => {
                        if (!day) return <div key={`blank-${i}`} />;
                        const key = dateKey(viewYear, viewMonth, day);
                        const isSelected = key === selectedDate;
                        const isTodayDay = isToday(day);
                        const hasPlan = allDatesWithPlans.has(key);

                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedDate(key)}
                                className={[
                                    'relative flex flex-col items-center justify-center rounded-2xl aspect-square text-sm font-bold transition-all',
                                    isSelected
                                        ? 'bg-black text-white shadow-lg scale-105'
                                        : isTodayDay
                                            ? 'bg-walia-primary/10 text-walia-primary ring-2 ring-walia-primary/30'
                                            : 'text-gray-700 hover:bg-gray-100',
                                ].join(' ')}
                            >
                                {day}
                                {hasPlan && (
                                    <span className={[
                                        'absolute bottom-1 w-1.5 h-1.5 rounded-full',
                                        isSelected ? 'bg-white/60' : 'bg-walia-primary',
                                    ].join(' ')} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Jump to today */}
                <div className="px-6 pb-8">
                    <button
                        onClick={() => {
                            setViewYear(today.getFullYear());
                            setViewMonth(today.getMonth());
                            setSelectedDate(dateKey(today.getFullYear(), today.getMonth(), today.getDate()));
                        }}
                        className="w-full py-3 rounded-2xl border-2 border-black text-black font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                    >
                        Jump to Today
                    </button>
                </div>
            </div>

            {/* ── Right: Plans ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 shadow-sm">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center shadow">
                            <CalendarDays className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-black text-black tracking-tight">{displayDateStr}</h1>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                {plans.length} plan{plans.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-black text-white text-sm font-black hover:bg-zinc-800 transition-all shadow-lg hover:shadow-black/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Plan</span>
                    </button>
                </div>

                {/* Plan sections */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {(['done', 'ongoing', 'not-done'] as PlanStatus[]).map(status => {
                        const cfg = STATUS_CONFIG[status];
                        const items = plansByStatus(status);
                        return (
                            <div key={status} className={`rounded-3xl border ${cfg.border} ${cfg.bg} p-5 transition-all`}>
                                {/* Section header */}
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center bg-white border ${cfg.border} shadow-sm`}>
                                        {cfg.icon}
                                    </div>
                                    <h3 className={`text-sm font-black ${cfg.color} uppercase tracking-widest`}>
                                        {cfg.label}
                                    </h3>
                                    <span className={`ml-auto text-xs font-black ${cfg.color} opacity-60`}>
                                        {items.length}
                                    </span>
                                </div>

                                {/* Items */}
                                <div className="space-y-2">
                                    <AnimatePresence>
                                        {items.map(plan => (
                                            <motion.div
                                                key={plan.id}
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="group bg-white rounded-2xl p-4 border border-white shadow-sm flex items-start space-x-3 hover:shadow-md transition-all"
                                            >
                                                {/* Status cycle button */}
                                                <button
                                                    onClick={() => {
                                                        const cycle: PlanStatus[] = ['not-done', 'ongoing', 'done'];
                                                        const next = cycle[(cycle.indexOf(plan.status) + 1) % 3];
                                                        handleStatusChange(plan.id, next);
                                                    }}
                                                    title="Cycle status"
                                                    className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all hover:scale-110 ${
                                                        plan.status === 'done'
                                                            ? 'bg-emerald-500 border-emerald-500'
                                                            : plan.status === 'ongoing'
                                                                ? 'bg-amber-400 border-amber-400'
                                                                : 'bg-white border-gray-300'
                                                    }`}
                                                >
                                                    {plan.status === 'done' && <Check className="w-3 h-3 text-white" />}
                                                    {plan.status === 'ongoing' && <Clock className="w-3 h-3 text-white" />}
                                                </button>

                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-bold text-black ${plan.status === 'done' ? 'line-through opacity-50' : ''}`}>
                                                        {plan.title}
                                                    </p>
                                                    {plan.description && (
                                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{plan.description}</p>
                                                    )}
                                                </div>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDelete(plan.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {items.length === 0 && (
                                        <div className="text-center py-4 opacity-40">
                                            <p className={`text-xs font-bold ${cfg.color}`}>No {cfg.label.toLowerCase()} plans</p>
                                        </div>
                                    )}
                                </div>

                                {/* Add to Calendar button */}
                                <button
                                    onClick={() => { setForm(f => ({ ...f, status })); setShowModal(true); }}
                                    className={`mt-4 w-full py-2.5 rounded-2xl border-2 ${cfg.border} ${cfg.color} text-xs font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center space-x-2`}
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add to {cfg.label}</span>
                                </button>
                            </div>
                        );
                    })}

                    {/* Empty state */}
                    {plans.length === 0 && (
                        <div className="text-center py-16 opacity-40 animate-in fade-in">
                            <CalendarDays className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-base font-black text-gray-400">No plans for this day</p>
                            <p className="text-xs text-gray-400 mt-1">Click &ldquo;Add Plan&rdquo; to get started</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Add Plan Modal ── */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: 60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 60, opacity: 0 }}
                            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                            className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] p-8 shadow-2xl z-10"
                        >
                            {/* Drag handle */}
                            <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />

                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-black tracking-tight">New Plan</h2>
                                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <X className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Title *</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        placeholder="What do you plan to do?"
                                        className="w-full border-2 border-gray-200 focus:border-black rounded-2xl px-4 py-3 text-sm font-medium text-black outline-none transition-all placeholder:text-gray-300"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        placeholder="Optional details..."
                                        rows={3}
                                        className="w-full border-2 border-gray-200 focus:border-black rounded-2xl px-4 py-3 text-sm font-medium text-black outline-none transition-all resize-none placeholder:text-gray-300"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Status</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['not-done', 'ongoing', 'done'] as PlanStatus[]).map(s => {
                                            const cfg = STATUS_CONFIG[s];
                                            return (
                                                <button
                                                    key={s}
                                                    onClick={() => setForm(f => ({ ...f, status: s }))}
                                                    className={[
                                                        'flex flex-col items-center py-3 rounded-2xl border-2 text-xs font-black transition-all',
                                                        form.status === s
                                                            ? `${cfg.border} ${cfg.bg} ${cfg.color} scale-[1.03] shadow-sm`
                                                            : 'border-gray-200 text-gray-400 hover:border-gray-300',
                                                    ].join(' ')}
                                                >
                                                    <span className="mb-1">{cfg.icon}</span>
                                                    {cfg.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Date display */}
                                <div className="flex items-center space-x-2 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                    <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span className="text-sm font-bold text-gray-600">{displayDateStr}</span>
                                </div>

                                {/* Submit */}
                                <button
                                    onClick={handleAddPlan}
                                    disabled={!form.title.trim() || saving}
                                    className="w-full py-4 rounded-2xl bg-black text-white text-sm font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg hover:shadow-black/20 active:scale-95 disabled:opacity-30 disabled:hover:bg-black disabled:active:scale-100"
                                >
                                    {saving ? 'Saving...' : 'Add Plan'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
