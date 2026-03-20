import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '@/services/firebase';
import { collection, onSnapshot, query, doc, updateDoc } from 'firebase/firestore';

interface Plan {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    status: 'done' | 'ongoing' | 'not-done';
    color?: string;
}

export default function CalendarScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) return;
        const q = query(collection(db, `users/${auth.currentUser.uid}/plans`));
        const unsub = onSnapshot(q, (snap) => {
            const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() } as Plan));
            setPlans(fetched);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const cycleStatus = async (planId: string) => {
        const plan = plans.find(p => p.id === planId);
        if (!plan || !auth.currentUser) return;
        
        const nextStatus: Record<string, 'done' | 'ongoing' | 'not-done'> = {
            'not-done': 'ongoing',
            'ongoing': 'done',
            'done': 'not-done'
        };
        
        const updatedStatus = nextStatus[plan.status || 'not-done'];
        const planRef = doc(db, `users/${auth.currentUser.uid}/plans`, planId);
        await updateDoc(planRef, { status: updatedStatus });
    };

    const markedDates: any = {};
    plans.forEach(p => {
        const colors_status: Record<string, string> = { 'done': '#10b981', 'ongoing': '#f59e0b', 'not-done': '#94a3b8' };
        const statusColor = colors_status[p.status || 'not-done'];
        markedDates[p.date] = { 
            marked: true, 
            dotColor: statusColor, 
            selected: p.date === selectedDate, 
            selectedColor: colors.primary 
        };
    });
    if (selectedDate && !markedDates[selectedDate]) markedDates[selectedDate] = { selected: true, selectedColor: colors.primary };

    const filteredPlans = selectedDate ? plans.filter(p => p.date === selectedDate) : plans;
    const stats = {
        done: plans.filter(p => p.status === 'done').length,
        ongoing: plans.filter(p => p.status === 'ongoing').length,
        notDone: plans.filter(p => p.status === 'not-done' || !p.status).length,
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: colors.text }]}>Study Plan 📅</Text>
                    <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, marginTop: 2 }}>{stats.done} done · {stats.ongoing} ongoing · {stats.notDone} pending</Text>
                </View>
                <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => router.push('/calendar/add' as any)}>
                    <Ionicons name="add" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <Calendar
                    onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
                    markedDates={markedDates}
                    theme={{
                        backgroundColor: colors.background,
                        calendarBackground: colors.surface,
                        textSectionTitleColor: colors.textSecondary,
                        selectedDayBackgroundColor: colors.primary,
                        selectedDayTextColor: '#fff',
                        todayTextColor: colors.primary,
                        dayTextColor: colors.text,
                        textDisabledColor: colors.textTertiary,
                        dotColor: colors.primary,
                        arrowColor: colors.primary,
                        monthTextColor: colors.text,
                        textMonthFontWeight: FontWeight.bold,
                        textDayFontSize: FontSize.md,
                        textMonthFontSize: FontSize.lg,
                    }}
                    style={[styles.calendar, { backgroundColor: colors.surface }]}
                />

                <View style={styles.reminders}>
                    <View style={styles.remindersHeader}>
                        <Text style={[styles.remindersTitle, { color: colors.text }]}>{selectedDate ? `Plans for ${selectedDate}` : 'All Plans'}</Text>
                        {selectedDate && <TouchableOpacity onPress={() => setSelectedDate('')}><Text style={{ fontSize: FontSize.sm, color: colors.primary, fontWeight: FontWeight.bold }}>Show All</Text></TouchableOpacity>}
                    </View>

                    {filteredPlans.length === 0 ? (
                        <View style={styles.emptyState}>
                            <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceAlt }]}>
                                <Ionicons name="calendar-outline" size={32} color={colors.textTertiary} />
                            </View>
                            <Text style={{ fontSize: FontSize.md, color: colors.textSecondary, fontWeight: FontWeight.bold }}>No plans for this date</Text>
                        </View>
                    ) : (
                        filteredPlans.map(p => {
                            const statusInfo = {
                                'done': { icon: 'checkmark-circle', color: '#10b981', label: 'Done' },
                                'ongoing': { icon: 'play-circle', color: '#f59e0b', label: 'Ongoing' },
                                'not-done': { icon: 'ellipse-outline', color: colors.textTertiary, label: 'Pending' }
                            };
                            const info = statusInfo[p.status || 'not-done'];
                            
                            return (
                                <TouchableOpacity 
                                    key={p.id} 
                                    activeOpacity={0.8}
                                    onPress={() => cycleStatus(p.id)}
                                    style={[styles.reminderCard, { backgroundColor: colors.surface, borderColor: colors.divider, borderWidth: 1 }]}
                                >
                                    <View style={[styles.reminderAccent, { backgroundColor: info.color }]} />
                                    <View style={styles.reminderContent}>
                                        <View style={styles.reminderTopRow}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.reminderTitle, { color: colors.text }, p.status === 'done' && { textDecorationLine: 'line-through', opacity: 0.5 }]}>{p.title}</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                                    <Ionicons name={info.icon as any} size={14} color={info.color} />
                                                    <Text style={{ fontSize: 10, color: info.color, fontWeight: FontWeight.heavy, textTransform: 'uppercase', letterSpacing: 0.5 }}>{info.label}</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={() => cycleStatus(p.id)} style={[styles.statusTap, { backgroundColor: colors.surfaceAlt }]}>
                                                <Ionicons name="refresh-outline" size={16} color={colors.textSecondary} />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, marginTop: Spacing.sm }} numberOfLines={2}>{p.description}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.md }}>
                                            <View style={styles.metaItem}>
                                                <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                                                <Text style={styles.metaText}>{p.time}</Text>
                                            </View>
                                            <View style={styles.metaItem}>
                                                <Ionicons name="calendar-outline" size={12} color={colors.textTertiary} />
                                                <Text style={styles.metaText}>{p.date}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
    title: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, letterSpacing: -1 },
    addBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    calendar: { borderRadius: 24, marginHorizontal: Spacing.xl, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
    reminders: { padding: Spacing.xl },
    remindersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
    remindersTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.heavy, letterSpacing: -0.5 },
    emptyState: { alignItems: 'center', paddingVertical: 60, gap: 16 },
    emptyIcon: { width: 80, height: 80, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
    reminderCard: { flexDirection: 'row', borderRadius: 24, marginBottom: Spacing.md, overflow: 'hidden' },
    reminderAccent: { width: 6 },
    reminderContent: { flex: 1, padding: Spacing.lg },
    reminderTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    reminderTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, letterSpacing: -0.3 },
    statusTap: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 10, fontWeight: FontWeight.bold, color: '#94a3b8' },
});
