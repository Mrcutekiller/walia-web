import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = ['#6C63FF', '#FF6B6B', '#4ECDC4', '#2ED573', '#FFA502', '#E1BEE7'];

export default function AddReminderScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Reminder</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="checkmark" size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <TextInput style={styles.titleInput} placeholder="Reminder title" placeholderTextColor={Colors.textTertiary} value={title} onChangeText={setTitle} />
                <TextInput style={styles.descInput} placeholder="Add description..." placeholderTextColor={Colors.textTertiary} value={description} onChangeText={setDescription} multiline textAlignVertical="top" />

                <Text style={styles.label}>Color</Text>
                <View style={styles.colorRow}>
                    {COLORS.map(c => (
                        <TouchableOpacity key={c} style={[styles.colorDot, { backgroundColor: c }, selectedColor === c && styles.colorDotActive]} onPress={() => setSelectedColor(c)} />
                    ))}
                </View>

                <TouchableOpacity style={styles.optionRow}>
                    <Ionicons name="calendar-outline" size={22} color={Colors.text} />
                    <Text style={styles.optionLabel}>Date</Text>
                    <Text style={styles.optionValue}>March 10, 2026</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionRow}>
                    <Ionicons name="time-outline" size={22} color={Colors.text} />
                    <Text style={styles.optionLabel}>Time</Text>
                    <Text style={styles.optionValue}>09:00 AM</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionRow}>
                    <Ionicons name="repeat-outline" size={22} color={Colors.text} />
                    <Text style={styles.optionLabel}>Repeat</Text>
                    <Text style={styles.optionValue}>Never</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionRow}>
                    <Ionicons name="notifications-outline" size={22} color={Colors.text} />
                    <Text style={styles.optionLabel}>Alert</Text>
                    <Text style={styles.optionValue}>15 min before</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
    headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text },
    content: { padding: Spacing.xl },
    titleInput: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.lg },
    descInput: { fontSize: FontSize.md, color: Colors.text, backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.xl, minHeight: 80, marginBottom: Spacing.xxl, borderWidth: 1, borderColor: Colors.border },
    label: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: Spacing.md },
    colorRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xxl },
    colorDot: { width: 36, height: 36, borderRadius: 18 },
    colorDotActive: { borderWidth: 3, borderColor: Colors.text },
    optionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md, gap: Spacing.md },
    optionLabel: { fontSize: FontSize.md, color: Colors.text, flex: 1 },
    optionValue: { fontSize: FontSize.sm, color: Colors.textSecondary },
});
