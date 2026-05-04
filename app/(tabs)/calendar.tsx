import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, Animated, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/store/auth';
import { db } from '@/services/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const { width } = Dimensions.get('window');

interface Plan {
    id: string;
    title: string;
    description?: string;
    date: string;
    time: string;
    completed: boolean;
    uid?: string;
}

export default function CalendarScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    const bg = isDark ? colors.background : '#F8FAFC';
    const cardBg = isDark ? colors.surface : '#FFFFFF';

    const { user } = useAuth();
    
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'tasks'), where('uid', '==', user.id));
        const unsubscribe = onSnapshot(q, snap => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Plan));
            setPlans(data);
            setLoading(false);
        }, (err) => {
            console.error(err);
            setLoading(false);
        });
        return unsubscribe;
    }, [user]);

    // Check for notifications
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            plans.forEach(p => {
                if (p.date === todayStr && p.time === timeStr && !p.completed) {
                    // Show notification
                    Alert.alert(
                        '📅 Task Reminder',
                        `${p.title}\n\n${p.description || ''}`,
                        [
                            { text: 'Done', onPress: () => toggleStatus(p.id) },
                            { text: 'Remind me after 10 min', onPress: () => snoozePlan(p.id) },
                            { text: 'Dismiss', style: 'cancel' }
                        ]
                    );
                }
            });
        }, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [plans]);

    const snoozePlan = async (planId: string) => {
        const plan = plans.find(p => p.id === planId);
        if (!plan) return;
        
        // Add 10 minutes to current time
        const [hours, minutes] = plan.time.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes + 10);
        const newTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        
        await updateDoc(doc(db, 'tasks', planId), { time: newTime });
    };

    const toggleStatus = async (planId: string) => {
        const plan = plans.find(p => p.id === planId);
        if (!plan || !user) return;
        await updateDoc(doc(db, 'tasks', planId), { completed: !plan.completed });
    };

    const markedDates: any = {};
    plans.forEach(p => {
        const statusColor = p.completed ? '#10B981' : colors.textTertiary;
        markedDates[p.date] = {
            marked: true,
            dotColor: statusColor,
            selected: p.date === selectedDate,
            selectedColor: '#6366F1'
        };
    });
    if (selectedDate && !markedDates[selectedDate]) {
        markedDates[selectedDate] = { selected: true, selectedColor: '#6366F1' };
    }

    const filteredPlans = selectedDate ? plans.filter(p => p.date === selectedDate) : plans;
    const stats = {
        done: plans.filter(p => p.completed).length,
        pending: plans.filter(p => !p.completed).length,
    };

    const today = new Date().toISOString().split('T')[0];
    const isToday = selectedDate === today;

    const STATUS_CONFIG = {
        'done': { icon: 'checkmark-circle', color: '#10B981', label: 'Completed', bg: '#10B98115' },
        'not-done': { icon: 'ellipse-outline', color: '#94A3B8', label: 'Planned', bg: '#94A3B815' },
    };

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>

            {/* ── Header ── */}
            <LinearGradient
                colors={isDark ? ['#1E293B', '#0F172A'] : ['#6366F1', '#818CF8']}
                style={styles.header}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
                <SafeAreaView edges={['top']} style={styles.safeHeader}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.headerSub}>STUDY COMPANION</Text>
                            <Text style={styles.headerTitle}>Study Plan</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.addBtn}
                            onPress={() => router.push('/calendar/add' as any)}
                        >
                            <Ionicons name="add" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Stats Bar */}
                    <View style={styles.statsBar}>
                        {[
                            { val: stats.done, label: 'Done', color: '#10B981' },
                            { val: stats.pending, label: 'Pending', color: '#94A3B8' },
                        ].map((s, i, arr) => (
                            <React.Fragment key={s.label}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statVal}>{s.val}</Text>
                                    <View style={[styles.statDot, { backgroundColor: s.color }]} />
                                    <Text style={styles.statLab}>{s.label}</Text>
                                </View>
                                {i < arr.length - 1 && <View style={styles.statDivider} />}
                            </React.Fragment>
                        ))}
                    </View>
                </SafeAreaView>
                {/* Decorative */}
                <View style={styles.headerDecor1} />
                <View style={styles.headerDecor2} />
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* ── Calendar Widget ── */}
                <View style={[styles.calendarCard, {
                    backgroundColor: cardBg,
                    borderColor: isDark ? '#1E293B' : '#F1F5F9',
                }]}>
                    <Calendar
                        onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
                        markedDates={markedDates}
                        theme={{
                            backgroundColor: 'transparent',
                            calendarBackground: 'transparent',
                            textSectionTitleColor: colors.textTertiary,
                            selectedDayBackgroundColor: '#6366F1',
                            selectedDayTextColor: '#FFF',
                            todayTextColor: '#6366F1',
                            dayTextColor: colors.text,
                            textDisabledColor: colors.textTertiary,
                            dotColor: '#6366F1',
                            selectedDotColor: '#FFF',
                            arrowColor: '#6366F1',
                            monthTextColor: colors.text,
                            textMonthFontWeight: '900',
                            textDayFontSize: 14,
                            textMonthFontSize: 16,
                            textDayHeaderFontWeight: '700',
                            textDayFontWeight: '600',
                        }}
                    />
                </View>

                {/* ── Plans Section ── */}
                <View style={styles.plansSection}>
                    <View style={styles.plansHeader}>
                        <View>
                            <Text style={[styles.plansTitle, { color: colors.text }]}>
                                {isToday ? "Today's Agenda" : selectedDate
                                    ? new Date(selectedDate).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })
                                    : 'All Plans'}
                            </Text>
                            <Text style={[styles.plansSub, { color: colors.textTertiary }]}>
                                {filteredPlans.length} task{filteredPlans.length !== 1 ? 's' : ''} scheduled
                            </Text>
                        </View>
                        <View style={styles.plansActions}>
                            {selectedDate && (
                                <TouchableOpacity
                                    style={[styles.showAllBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                                    onPress={() => setSelectedDate('')}
                                >
                                    <Text style={[styles.showAllText, { color: colors.textSecondary }]}>All</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={[styles.addPlanBtn, { backgroundColor: '#6366F1' }]}
                                onPress={() => router.push('/calendar/add' as any)}
                            >
                                <Ionicons name="add" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {filteredPlans.length === 0 ? (
                        <View style={[styles.emptyState, { backgroundColor: cardBg, borderColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                            <View style={[styles.emptyIconBox, { backgroundColor: '#6366F110' }]}>
                                <Ionicons name="calendar-clear-outline" size={36} color="#6366F1" />
                            </View>
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>No tasks scheduled</Text>
                            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                                {isToday ? "You're all clear today! Add a task to stay organized." : 'No plans for this date.'}
                            </Text>
                            <TouchableOpacity
                                style={styles.createBtn}
                                onPress={() => router.push('/calendar/add' as any)}
                            >
                                <Ionicons name="add-circle-outline" size={16} color="#FFF" />
                                <Text style={styles.createBtnText}>Add Task</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.plansList}>
                                {filteredPlans.map((p) => {
                                const info = STATUS_CONFIG[p.completed ? 'done' : 'not-done'];
                                return (
                                    <TouchableOpacity
                                        key={p.id}
                                        activeOpacity={0.85}
                                        onPress={() => toggleStatus(p.id)}
                                        style={[styles.planCard, {
                                            backgroundColor: cardBg,
                                            borderColor: isDark ? '#1E293B' : '#F1F5F9',
                                        }]}
                                    >
                                        {/* Left Accent */}
                                        <View style={[styles.planAccent, { backgroundColor: info.color }]} />

                                        <View style={styles.planBody}>
                                            <View style={styles.planTop}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={[
                                                        styles.planTitle,
                                                        { color: colors.text },
                                                        p.completed && styles.planDone
                                                    ]}>
                                                        {p.title}
                                                    </Text>
                                                    <View style={styles.planStatusRow}>
                                                        <View style={[styles.statusBadge, { backgroundColor: info.bg }]}>
                                                            <Ionicons name={info.icon as any} size={10} color={info.color} />
                                                            <Text style={[styles.statusLabel, { color: info.color }]}>
                                                                {info.label}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={[styles.timeChip, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }]}>
                                                    <Ionicons name="time-outline" size={11} color={colors.textSecondary} />
                                                    <Text style={[styles.timeText, { color: colors.textSecondary }]}>{p.time}</Text>
                                                </View>
                                            </View>

                                            {p.description ? (
                                                <Text style={[styles.planDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                                                    {p.description}
                                                </Text>
                                            ) : null}

                                            <View style={styles.planFooter}>
                                                <TouchableOpacity
                                                    style={[styles.cycleBtn, { backgroundColor: `${info.color}10`, borderColor: `${info.color}20` }]}
                                                    onPress={() => toggleStatus(p.id)}
                                                >
                                                    <Ionicons name="sync-outline" size={12} color={info.color} />
                                                    <Text style={[styles.cycleText, { color: info.color }]}>
                                                        {p.completed ? 'Mark Not Done' : 'Mark Done'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: {
        overflow: 'hidden',
        position: 'relative',
    },
    safeHeader: { paddingHorizontal: 22, paddingBottom: 20 },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 8,
    },
    headerSub: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 30,
        fontWeight: '900',
        letterSpacing: -0.5,
        marginTop: 4,
    },
    addBtn: {
        width: 46,
        height: 46,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.15)',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    statItem: { flex: 1, alignItems: 'center', gap: 4 },
    statVal: { color: '#FFF', fontSize: 20, fontWeight: '900' },
    statDot: { width: 6, height: 6, borderRadius: 3 },
    statLab: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
    statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.15)' },
    headerDecor1: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.05)',
        right: -50,
        top: -50,
    },
    headerDecor2: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.06)',
        left: -20,
        bottom: -30,
    },

    // Content
    scrollContent: { paddingBottom: 120 },

    // Calendar Card
    calendarCard: {
        margin: 20,
        borderRadius: 28,
        padding: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
        marginTop: -20,
    },

    // Plans
    plansSection: { paddingHorizontal: 20 },
    plansHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    plansTitle: { fontSize: 20, fontWeight: '900', letterSpacing: -0.3 },
    plansSub: { fontSize: 13, fontWeight: '500', marginTop: 3 },
    plansActions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
    showAllBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },
    showAllText: { fontSize: 13, fontWeight: '700' },
    addPlanBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: 44,
        paddingHorizontal: 32,
        borderRadius: 28,
        borderWidth: 1,
        gap: 10,
    },
    emptyIconBox: {
        width: 72,
        height: 72,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    emptyTitle: { fontSize: 17, fontWeight: '900' },
    emptyText: { fontSize: 13, fontWeight: '500', textAlign: 'center', lineHeight: 20 },
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#6366F1',
        paddingHorizontal: 22,
        paddingVertical: 13,
        borderRadius: 16,
        marginTop: 8,
    },
    createBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },

    // Plan Cards
    plansList: { gap: 14 },
    planCard: {
        flexDirection: 'row',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    planAccent: { width: 5 },
    planBody: { flex: 1, padding: 18 },
    planTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
    planTitle: { fontSize: 16, fontWeight: '800', letterSpacing: -0.2, flex: 1 },
    planDone: { textDecorationLine: 'line-through', opacity: 0.5 },
    planStatusRow: { marginTop: 6 },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    statusLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    timeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    timeText: { fontSize: 11, fontWeight: '700' },
    planDesc: { fontSize: 13, lineHeight: 19, marginTop: 10 },
    planFooter: { marginTop: 14 },
    cycleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        alignSelf: 'flex-start',
    },
    cycleText: { fontSize: 11, fontWeight: '800' },
});
