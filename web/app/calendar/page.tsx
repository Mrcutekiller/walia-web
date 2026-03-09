'use client';

import DashboardShell from '@/components/DashboardShell';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface CalendarEvent {
    id: string;
    day: number;
    month: number;
    year: number;
    label: string;
    color: string;
}

const COLORS = ['bg-rose-500', 'bg-amber-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-pink-500'];

export default function CalendarPage() {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());

    // Initial dummy events
    const [events, setEvents] = useState<CalendarEvent[]>([
        { id: '1', day: 5, month, year, label: 'Physics Exam', color: 'bg-rose-500' },
        { id: '2', day: 12, month, year, label: 'Essay Due', color: 'bg-amber-500' },
    ]);

    // Add event modal state
    const [showAdd, setShowAdd] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [newEventLabel, setNewEventLabel] = useState('');
    const [newEventColor, setNewEventColor] = useState(COLORS[2]);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
    const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

    const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

    const handleDayClick = (day: number | null) => {
        if (!day) return;
        setSelectedDay(day);
        setShowAdd(true);
    };

    const addEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEventLabel.trim() || !selectedDay) return;
        const newEvnt: CalendarEvent = {
            id: Math.random().toString(),
            day: selectedDay, month, year,
            label: newEventLabel, color: newEventColor
        };
        setEvents([...events, newEvnt].sort((a, b) => a.day - b.day));
        setShowAdd(false);
        setNewEventLabel('');
        setSelectedDay(null);
    };

    const deleteEvent = (id: string) => {
        setEvents(events.filter(e => e.id !== id));
    };

    const currentEvents = events.filter(e => e.month === month && e.year === year);

    return (
        <DashboardShell>
            <div className="p-6 max-w-2xl mx-auto pb-20">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Schedule</p>
                        <h1 className="text-3xl font-black text-white tracking-tight">Calendar</h1>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/8 rounded-3xl p-6 relative">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={prev} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <h2 className="text-lg font-black text-white">{MONTH_NAMES[month]} {year}</h2>
                        <button onClick={next} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Day labels */}
                    <div className="grid grid-cols-7 mb-2">
                        {DAYS.map(d => <p key={d} className="text-center text-[10px] font-black text-white/25 py-1">{d}</p>)}
                    </div>

                    {/* Cells */}
                    <div className="grid grid-cols-7 gap-1">
                        {cells.map((day, i) => {
                            const dayEvents = day ? currentEvents.filter(e => e.day === day) : [];
                            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                            return (
                                <div key={i} onClick={() => handleDayClick(day)} className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-bold transition-all relative ${!day ? '' :
                                        isToday ? 'bg-white text-black' :
                                            'hover:bg-white/8 text-white/60 cursor-pointer'
                                    }`}>
                                    {day && <span>{day}</span>}
                                    {dayEvents.length > 0 && (
                                        <div className="absolute bottom-1.5 flex gap-0.5 max-w-[80%] flex-wrap justify-center">
                                            {dayEvents.slice(0, 3).map((ev, idx) => (
                                                <div key={idx} className={`w-1.5 h-1.5 rounded-full ${ev.color}`} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Add Event Form Inline */}
                {showAdd && selectedDay && (
                    <div className="mt-6 p-5 rounded-2xl bg-indigo-900/30 border border-indigo-500/30">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-white">Add Event for {MONTH_NAMES[month]} {selectedDay}</h3>
                            <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
                        </div>
                        <form onSubmit={addEvent} className="flex flex-col sm:flex-row gap-3">
                            <input
                                autoFocus
                                value={newEventLabel}
                                onChange={e => setNewEventLabel(e.target.value)}
                                placeholder="Event title..."
                                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 outline-none focus:border-indigo-500 transition-colors"
                            />
                            <div className="flex items-center gap-2">
                                {COLORS.map(c => (
                                    <button type="button" key={c} onClick={() => setNewEventColor(c)} className={`w-6 h-6 rounded-full ${c} ${newEventColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a]' : 'opacity-50'}`} />
                                ))}
                            </div>
                            <button type="submit" disabled={!newEventLabel.trim()} className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-sm disabled:opacity-40 hover:bg-white/90 whitespace-nowrap">
                                Add Event
                            </button>
                        </form>
                    </div>
                )}

                {/* Events list */}
                <div className="mt-8 space-y-2">
                    <p className="text-[10px] font-black text-white/25 uppercase tracking-widest mb-3">Events in {MONTH_NAMES[month]}</p>
                    {currentEvents.length === 0 ? (
                        <p className="text-xs text-white/30 italic">No events for this month. Click a day to add one.</p>
                    ) : currentEvents.map(e => (
                        <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8 group">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${e.color}`} />
                            <p className="text-sm font-semibold text-white">{e.label}</p>
                            <p className="ml-auto text-[10px] text-white/30 mr-2">Day {e.day}</p>
                            <button onClick={() => deleteEvent(e.id)} className="w-6 h-6 rounded-md bg-rose-500/10 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardShell>
    );
}
