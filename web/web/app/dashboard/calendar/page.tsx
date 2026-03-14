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

function makeDateKey(year: number, month: number, day: number) {
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

const STATUS_CONFIG: Record<PlanStatus, { label: string; color: string; bg: string; border: string; dotColor: string }> = {
    done: {
        label: 'Done',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        dotColor: 'bg-emerald-500',
    },
    ongoing: {
        label: 'Ongoing',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        dotColor: 'bg-amber-400',
    },
    'not-done': {
        label: 'Not Done',
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        dotColor: 'bg-red-500',
    },
};

/* ─────────────── Status Icon ─────────────── */
function StatusIcon({ status }: { status: PlanStatus }) {
    if (status === 'done') return <Check className="w-4 h-4 text-emerald-600" />;
    if (status === 'ongoing') return <Clock className="w-4 h-4 text-amber-500" />;
    return <Circle className="w-4 h-4 text-red-500" />;
}

/* ─────────────── Component ─────────────── */
export default function CalendarPage() {
    const { user } = useAuth();
    const today = new Date();

    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<string>(
        makeDateKey(today.getFullYear(), today.getMonth(), today.getDate())
    );
    const [plans, setPlans] = useState<Plan[]>([]);
    const [allDatesWithPlans, setAllDatesWithPlans] = useState<Set<string>>(new Set());
    const [showModal, setShowModal] = useState(false);
    const [defaultStatus, setDefaultStatus] = useState<PlanStatus>('not-done');
    const [form, setForm] = useState({ title: '', description: '', status: 'not-done' as PlanStatus });
    const [saving, setSaving] = useState(false);

    /* calendar grid computation */
    const { firstDayOfWeek, daysInMonth } = useMemo(() => {
        const first = new Date(viewYear, viewMonth, 1);
        const days = new Date(viewYear, viewMonth + 1, 0).getDate();
        return { firstDayOfWeek: first.getDay(), daysInMonth: days };
    }, [viewYear, viewMonth]);

    const cells = useMemo(() => {
        const blanks: null[] = Array(firstDayOfWeek).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        return [...blanks, ...days];
    }, [firstDayOfWeek, daysInMonth]);

    /* load plans for selected date */
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'users', user.uid, 'plans'),
            where('dateKey', '==', selectedDate)
        );
        const unsub = onSnapshot(q, snap => {
            setPlans(snap.docs.map(d => ({ id: d.id, ...d.data() } as Plan)));
        });
        return () => unsub();
    }, [user, selectedDate]);

    /* load date markers for visible month */
    useEffect(() => {
        if (!user) return;
        const startKey = makeDateKey(viewYear, viewMonth, 1);
        const endKey = makeDateKey(viewYear, viewMonth, daysInMonth);
        const q = query(
            collection(db, 'users', user.uid, 'plans'),
            where('dateKey', '>=', startKey),
            where('dateKey', '<=', endKey)
        );
        const unsub = onSnapshot(q, snap => {
            setAllDatesWithPlans(new Set(snap.docs.map(d => (d.data() as Plan).dateKey)));
        });
        return () => unsub();
    }, [user, viewYear, viewMonth, daysInMonth]);

    /* navigation */
    const prevMonth = () => {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    };
    const goToToday = () => {
        setViewYear(today.getFullYear());
        setViewMonth(today.getMonth());
        setSelectedDate(makeDateKey(today.getFullYear(), today.getMonth(), today.getDate()));
    };

    /* handlers */
    const openModal = (status: PlanStatus = 'not-done') => {
        setDefaultStatus(status);
        setForm({ title: '', description: '', status });
        setShowModal(true);
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
            setShowModal(false);
            setForm({ title: '', description: '', status: 'not-done' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (planId: string) => {
        if (!user) return;
        await deleteDoc(doc(db, 'users', user.uid, 'plans', planId));
    };

    const cycleStatus = async (plan: Plan) => {
        if (!user) return;
        const cycle: PlanStatus[] = ['not-done', 'ongoing', 'done'];
        const next = cycle[(cycle.indexOf(plan.status) + 1) % 3];
        await updateDoc(doc(db, 'users', user.uid, 'plans', plan.id), { status: next });
    };

    const plansByStatus = (status: PlanStatus) => plans.filter(p => p.status === status);

    const displayDateStr = (() => {
        const [y, m, d] = selectedDate.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
        });
    })();

    const todayKey = makeDateKey(today.getFullYear(), today.getMonth(), today.getDate());

    return (
        <div className="h-full flex flex-col lg:flex-row bg-gray-50 dark:bg-[#0a0a0a] overflow-hidden">

            {/* ── LEFT: Calendar ── */}
            <div className="w-full lg:w-[360px] shrink-0 bg-white dark:bg-[#0A101D] border-r border-gray-200 dark:border-white/5 flex flex-col">
                {/* Month nav */}
                <div className="px-6 pt-8 pb-2 flex items-center justify-between">
                    <button
                        onClick={prevMonth}
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-base font-black text-black dark:text-white tracking-tight">
                        {MONTHS[viewMonth]} {viewYear}
                    </h2>
                    <button
                        onClick={nextMonth}
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Day labels */}
                <div className="px-4 grid grid-cols-7 mb-1">
                    {DAYS.map(d => (
                        <div key={d} className="text-center text-[9px] font-black text-gray-400 uppercase tracking-widest py-2">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="px-4 pb-4 grid grid-cols-7 gap-1 flex-shrink-0">
                    {cells.map((day, i) => {
                        if (!day) return <div key={`blank-${i}`} />;
                        const key = makeDateKey(viewYear, viewMonth, day);
                        const isSelected = key === selectedDate;
                        const isTodayCell = key === todayKey;
                        const hasPlan = allDatesWithPlans.has(key);

                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedDate(key)}
                                className={[
                                    'relative flex flex-col items-center justify-center rounded-2xl aspect-square text-sm font-bold transition-all',
                                    isSelected
                                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg scale-105'
                                        : isTodayCell
                                            ? 'ring-2 ring-inset ring-black/30 dark:ring-white/30 text-black dark:text-white'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10',
                                ].join(' ')}
                            >
                                {day}
                                {hasPlan && (
                                    <span className={[
                                        'absolute bottom-1 w-1.5 h-1.5 rounded-full',
                                        isSelected ? 'bg-white/60 dark:bg-black/60' : 'bg-black dark:bg-[#4ade80]',
                                    ].join(' ')} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Jump to today */}
                <div className="px-5 pb-6 mt-auto">
                    <button
                        onClick={goToToday}
                        className="w-full py-3 rounded-2xl border-2 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-black text-xs uppercase tracking-widest hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all"
                    >
                        Today
                    </button>
                </div>
            </div>

            {/* ── RIGHT: Plans ── */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 bg-white dark:bg-[#0A101D] border-b border-gray-200 dark:border-white/5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-md">
                            <CalendarDays className="w-5 h-5 text-white dark:text-black" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{selectedDate === todayKey ? 'Today' : 'Selected'}</p>
                            <h1 className="text-sm font-black text-black dark:text-white leading-tight">{displayDateStr}</h1>
                        </div>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/15"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Plan</span>
                    </button>
                </div>

                {/* Scrollable plan cards */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {(['done', 'ongoing', 'not-done'] as PlanStatus[]).map(status => {
                        const cfg = STATUS_CONFIG[status];
                        const items = plansByStatus(status);
                        return (
                            <div key={status} className={`rounded-3xl border-2 ${cfg.border} ${cfg.bg} dark:bg-white/5 dark:border-white/10 p-5`}>
                                {/* Card header */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className={`w-2.5 h-2.5 rounded-full ${cfg.dotColor}`} />
                                    <h3 className={`text-xs font-black ${cfg.color} dark:text-white/70 uppercase tracking-widest flex-1`}>
                                        {cfg.label}
                                    </h3>
                                    <span className={`text-xs font-black ${cfg.color} dark:text-white/40 opacity-60`}>
                                        {items.length}
                                    </span>
                                </div>

                                {/* Plan items */}
                                <div className="space-y-2 mb-4">
                                    <AnimatePresence initial={false}>
                                        {items.map(plan => (
                                            <motion.div
                                                key={plan.id}
                                                layout
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -30 }}
                                                className="group bg-white dark:bg-white/5 rounded-2xl px-4 py-3 border border-white dark:border-white/10 shadow-sm hover:shadow-md transition-all flex items-start gap-3"
                                            >
                                                {/* Cycle button */}
                                                <button
                                                    onClick={() => cycleStatus(plan)}
                                                    title="Cycle status"
                                                    className={[
                                                        'mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all hover:scale-110',
                                                        plan.status === 'done' ? 'bg-emerald-500 border-emerald-500' :
                                                        plan.status === 'ongoing' ? 'bg-amber-400 border-amber-400' :
                                                        'bg-transparent border-gray-300 dark:border-white/20',
                                                    ].join(' ')}
                                                >
                                                    {plan.status !== 'not-done' && (
                                                        <StatusIcon status={plan.status} />
                                                    )}
                                                </button>

                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-bold text-black dark:text-white leading-snug ${plan.status === 'done' ? 'line-through opacity-40' : ''}`}>
                                                        {plan.title}
                                                    </p>
                                                    {plan.description && (
                                                        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{plan.description}</p>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => handleDelete(plan.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shrink-0"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {items.length === 0 && (
                                        <p className={`text-center text-xs font-bold ${cfg.color} opacity-30 py-2`}>
                                            No {cfg.label.toLowerCase()} plans
                                        </p>
                                    )}
                                </div>

                                {/* Add-to-section button */}
                                <button
                                    onClick={() => openModal(status)}
                                    className={`w-full py-2.5 rounded-2xl border-2 ${cfg.border} ${cfg.color} text-[10px] font-black uppercase tracking-widest hover:bg-white dark:hover:bg-white/10 transition-all flex items-center justify-center gap-1.5`}
                                >
                                    <Plus className="w-3 h-3" />
                                    Add to {cfg.label}
                                </button>
                            </div>
                        );
                    })}

                    {plans.length === 0 && (
                        <div className="text-center py-20 opacity-30">
                            <CalendarDays className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                            <p className="text-sm font-black text-gray-400">No plans for this day</p>
                            <p className="text-xs text-gray-400 mt-1">Tap &ldquo;Add Plan&rdquo; above</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── MODAL ── */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: 80, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 80, opacity: 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 230 }}
                            className="relative w-full max-w-md bg-white dark:bg-[#0A101D] rounded-t-[32px] sm:rounded-[32px] p-7 shadow-2xl z-10 border border-transparent dark:border-white/10"
                        >
                            <div className="w-10 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mx-auto mb-6 sm:hidden" />

                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-black dark:text-white">New Plan</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500 dark:text-gray-300" />
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
                                        onKeyDown={e => e.key === 'Enter' && handleAddPlan()}
                                        placeholder="What do you plan to do?"
                                        autoFocus
                                        className="w-full border-2 border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white rounded-2xl px-4 py-3 text-sm font-medium text-black dark:text-white bg-transparent outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-white/20"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Notes</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        placeholder="Optional details..."
                                        rows={2}
                                        className="w-full border-2 border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white rounded-2xl px-4 py-3 text-sm font-medium text-black dark:text-white bg-transparent outline-none resize-none transition-all placeholder:text-gray-300 dark:placeholder:text-white/20"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Status</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['not-done', 'ongoing', 'done'] as PlanStatus[]).map(s => {
                                            const cfg = STATUS_CONFIG[s];
                                            const isActive = form.status === s;
                                            return (
                                                <button
                                                    key={s}
                                                    onClick={() => setForm(f => ({ ...f, status: s }))}
                                                    className={[
                                                        'flex flex-col items-center py-3 rounded-2xl border-2 text-[10px] font-black uppercase tracking-wider transition-all gap-1',
                                                        isActive
                                                            ? `${cfg.border} ${cfg.bg} ${cfg.color} scale-[1.03] shadow-sm`
                                                            : 'border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-gray-300',
                                                    ].join(' ')}
                                                >
                                                    <StatusIcon status={s} />
                                                    {cfg.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Date display */}
                                <div className="flex items-center gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                                    <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{displayDateStr}</span>
                                </div>

                                {/* Submit */}
                                <button
                                    onClick={handleAddPlan}
                                    disabled={!form.title.trim() || saving}
                                    className="w-full py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-sm font-black uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-gray-100 transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:active:scale-100"
                                >
                                    {saving ? 'Saving...' : '+ Add Plan'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
