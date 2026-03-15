import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { REMINDERS as INITIAL_REMINDERS, Reminder } from '@/store/data';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CalendarScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const [selectedDate, setSelectedDate] = useState('');
    const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS.map(r => ({ ...r })));

    const toggleComplete = (reminderId: string) => {
        const reminder = reminders.find(r => r.id === reminderId);
        if (!reminder) return;
        if (!reminder.completed) {
            Alert.alert('✅ Task Complete!', `"${reminder.title}" marked as done.`, [
                { text: 'Undo', style: 'cancel' },
                { text: 'Done', onPress: () => setReminders(prev => prev.map(r => r.id === reminderId ? { ...r, completed: true } : r)) },
            ]);
        } else {
            setReminders(prev => prev.map(r => r.id === reminderId ? { ...r, completed: false } : r));
        }
    };

    const markedDates: any = {};
    reminders.forEach(r => {
        markedDates[r.date] = { marked: true, dotColor: r.completed ? colors.success : r.color, selected: r.date === selectedDate, selectedColor: colors.primary };
    });
    if (selectedDate && !markedDates[selectedDate]) markedDates[selectedDate] = { selected: true, selectedColor: colors.primary };

    const filteredReminders = selectedDate ? reminders.filter(r => r.date === selectedDate) : reminders;
    const completedCount = reminders.filter(r => r.completed).length;
    const pendingCount = reminders.filter(r => !r.completed).length;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: colors.text }]}>Calendar 📅</Text>
                    <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, marginTop: 2 }}>{completedCount} done · {pendingCount} pending</Text>
                </View>
                <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => router.push('/calendar/add')}>
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
                        <Text style={[styles.remindersTitle, { color: colors.text }]}>{selectedDate ? `Reminders for ${selectedDate}` : 'All Reminders'}</Text>
                        {selectedDate && <TouchableOpacity onPress={() => setSelectedDate('')}><Text style={{ fontSize: FontSize.sm, color: colors.primary, fontWeight: FontWeight.medium }}>Show All</Text></TouchableOpacity>}
                    </View>

                    {filteredReminders.length === 0 ? (
                        <View style={styles.emptyState}><Text style={styles.emptyEmoji}>📭</Text><Text style={{ fontSize: FontSize.md, color: colors.textSecondary }}>No reminders for this date</Text></View>
                    ) : (
                        filteredReminders.map(r => (
                            <View key={r.id} style={[styles.reminderCard, { backgroundColor: colors.surface, opacity: r.completed ? 0.7 : 1 }]}>
                                <View style={[styles.reminderAccent, { backgroundColor: r.completed ? colors.success : r.color }]} />
                                <View style={styles.reminderContent}>
                                    <View style={styles.reminderTopRow}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.reminderTitle, { color: colors.text }, r.completed && { textDecorationLine: 'line-through', color: colors.textTertiary }]}>{r.title}</Text>
                                            {r.completed && (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                                    <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                                                    <Text style={{ fontSize: FontSize.xs, color: colors.success, fontWeight: FontWeight.medium }}>Done</Text>
                                                </View>
                                            )}
                                        </View>
                                        <TouchableOpacity onPress={() => toggleComplete(r.id)} style={{ padding: Spacing.xs }}>
                                            <Ionicons name={r.completed ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={r.completed ? colors.success : colors.textTertiary} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={{ fontSize: FontSize.sm, color: r.completed ? colors.textTertiary : colors.textSecondary, marginTop: Spacing.xs }}>{r.description}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.sm }}>
                                        <Ionicons name="calendar-outline" size={14} color={colors.textTertiary} />
                                        <Text style={{ fontSize: FontSize.xs, color: colors.textTertiary, marginRight: Spacing.sm }}>{r.date}</Text>
                                        <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                                        <Text style={{ fontSize: FontSize.xs, color: colors.textTertiary }}>{r.time}</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
    title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold },
    addBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    calendar: { borderRadius: BorderRadius.xl, marginHorizontal: Spacing.xl, overflow: 'hidden' },
    reminders: { padding: Spacing.xl },
    remindersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
    remindersTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
    emptyState: { alignItems: 'center', paddingVertical: Spacing.xxxl },
    emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
    reminderCard: { flexDirection: 'row', borderRadius: BorderRadius.lg, marginBottom: Spacing.md, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
    reminderAccent: { width: 4 },
    reminderContent: { flex: 1, padding: Spacing.lg },
    reminderTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    reminderTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
});
