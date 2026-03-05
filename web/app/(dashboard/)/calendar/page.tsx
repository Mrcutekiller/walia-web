'use client';

import { cn } from '@/lib/utils';
import {
    Bell,
    BookOpen,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    MoreVertical,
    Plus
} from 'lucide-react';

const events = [
    { id: '1', title: 'AI Study Session', time: '10:00 AM', duration: '1h', type: 'AI', color: 'bg-walia-primary' },
    { id: '2', title: 'Group Meeting: Physics', time: '02:00 PM', duration: '2h', type: 'Social', color: 'bg-walia-accent' },
    { id: '3', title: 'Macroeconomics Prep', time: '05:30 PM', duration: '45m', type: 'Study', color: 'bg-emerald-500' },
];

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const currentMonth = 'March 2026';

export default function CalendarPage() {
    const date = new Date();
    const currentDay = 4; // March 4th (based on the system time)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 animate-fade-in-up">

            {/* Calendar Column */}
            <div className="lg:col-span-3 space-y-10">
                <header className="flex items-center justify-between p-8 rounded-[40px] bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-8">
                        <h2 className="text-3xl font-black text-white">{currentMonth}</h2>
                        <div className="flex items-center space-x-2">
                            <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="hidden md:flex items-center px-6 py-3 rounded-2xl bg-white/5 text-xs font-bold text-white/50 hover:text-white transition-all">
                            <CalendarIcon className="w-4 h-4 mr-3" /> Today
                        </button>
                        <button className="px-8 py-3 rounded-2xl bg-walia-primary text-white text-sm font-black hover:bg-walia-secondary transition-all shadow-lg shadow-walia-primary/20 flex items-center">
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

                        {/* Calendar Grid (Mock 5 weeks) */}
                        <div className="grid grid-cols-7 gap-4">
                            {Array.from({ length: 35 }).map((_, i) => {
                                const dayNum = i - 0; // Adjust for starting day of month
                                const isCurrentMonth = dayNum > 0 && dayNum <= 31;
                                const isCurrentDay = dayNum === currentDay;

                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            "min-h-[140px] p-6 rounded-[32px] border transition-all group cursor-pointer",
                                            isCurrentMonth ? "bg-white/5 border-white/5 hover:border-white/10 group h-full" : "opacity-0 pointer-events-none",
                                            isCurrentDay && "border-walia-primary/50 shadow-[0_10px_30px_rgba(108,99,255,0.1)] bg-walia-primary/5"
                                        )}
                                    >
                                        <p className={cn(
                                            "text-sm font-black mb-4",
                                            isCurrentDay ? "text-walia-primary" : "text-white/20 group-hover:text-white/40"
                                        )}>
                                            {isCurrentMonth ? dayNum : ''}
                                        </p>

                                        {isCurrentMonth && isCurrentDay && (
                                            <div className="space-y-2">
                                                <div className="px-3 py-1.5 rounded-xl bg-walia-primary border border-walia-primary text-[9px] font-black uppercase text-white tracking-widest truncate">
                                                    Study Session
                                                </div>
                                                <div className="px-3 py-1.5 rounded-xl bg-walia-accent/20 border border-walia-accent/30 text-[9px] font-black uppercase text-walia-accent tracking-widest truncate">
                                                    Physics Lab
                                                </div>
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
                        <Clock className="w-5 h-5 mr-3 text-walia-primary" /> Upcoming Tasks
                    </h2>
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div key={event.id} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group cursor-pointer relative overflow-hidden">
                                <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", event.color)} />
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{event.time} • {event.duration}</span>
                                    <button className="text-white/10 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                                <h3 className="text-sm font-bold text-white mb-4 group-hover:text-walia-primary transition-colors">{event.title}</h3>
                                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/20">
                                    <BookOpen className="w-4 h-4 mr-2" /> {event.type} Session
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-10 rounded-[40px] bg-gradient-to-br from-walia-primary/10 to-transparent border border-walia-primary/20 space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-walia-primary/10 border border-walia-primary/20 flex items-center justify-center">
                        <Bell className="w-6 h-6 text-walia-primary animate-bounce-sm" />
                    </div>
                    <h3 className="text-lg font-bold text-white leading-tight">Sync your calendar with mobile.</h3>
                    <p className="text-white/40 text-xs leading-relaxed">
                        Enable push notifications on your phone to get smart study reminders 15 minutes before your sessions start.
                    </p>
                </div>
            </div>

        </div>
    );
}
