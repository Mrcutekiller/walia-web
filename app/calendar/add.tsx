import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { auth, db } from '@/services/firebase';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PlanStatus = 'done' | 'ongoing' | 'not-done';

export default function AddPlanScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const [status, setStatus] = useState<PlanStatus>('not-done');
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!title.trim() || !auth.currentUser) return;
        setLoading(true);
        try {
            await addDoc(collection(db, `users/${auth.currentUser.uid}/plans`), {
                title: title.trim(),
                description: description.trim(),
                date,
                time,
                status,
                createdAt: serverTimestamp(),
            });
            router.back();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const STATUSES: { key: PlanStatus; label: string; icon: any; color: string }[] = [
        { key: 'not-done', label: 'Pending', icon: 'ellipse-outline', color: '#94a3b8' },
        { key: 'ongoing', label: 'Ongoing', icon: 'play-circle', color: '#f59e0b' },
        { key: 'done', label: 'Done', icon: 'checkmark-circle', color: '#10b981' },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.divider }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>New Study Plan</Text>
                <TouchableOpacity 
                    onPress={handleAdd} 
                    disabled={!title.trim() || loading}
                    style={[styles.saveBtn, { backgroundColor: title.trim() ? colors.primary : colors.surfaceAlt }]}
                >
                    {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={[styles.saveBtnText, { color: title.trim() ? '#fff' : colors.textTertiary }]}>Save</Text>}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Plan Title</Text>
                        <TextInput
                            placeholder="What are you studying?"
                            value={title}
                            onChangeText={setTitle}
                            placeholderTextColor={colors.textTertiary}
                            style={[styles.input, { color: colors.text, fontSize: FontSize.lg, fontWeight: FontWeight.bold }]}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Notes (Optional)</Text>
                        <TextInput
                            placeholder="Add more details..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                            placeholderTextColor={colors.textTertiary}
                            style={[styles.input, { color: colors.text, minHeight: 80, textAlignVertical: 'top' }]}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
                            <TextInput
                                placeholder="YYYY-MM-DD"
                                value={date}
                                onChangeText={setDate}
                                placeholderTextColor={colors.textTertiary}
                                style={[styles.input, { color: colors.text }]}
                            />
                        </View>
                        <View style={{ width: Spacing.lg }} />
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Time</Text>
                            <TextInput
                                placeholder="HH:MM"
                                value={time}
                                onChangeText={setTime}
                                placeholderTextColor={colors.textTertiary}
                                style={[styles.input, { color: colors.text }]}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Initial Status</Text>
                        <View style={styles.statusGrid}>
                            {STATUSES.map(s => (
                                <TouchableOpacity 
                                    key={s.key} 
                                    onPress={() => setStatus(s.key)}
                                    style={[styles.statusOption, { backgroundColor: status === s.key ? s.color + '15' : colors.surfaceAlt, borderColor: status === s.key ? s.color : 'transparent', borderWidth: 1 }]}
                                >
                                    <Ionicons name={s.icon} size={20} color={status === s.key ? s.color : colors.textTertiary} />
                                    <Text style={[styles.statusLabel, { color: status === s.key ? s.color : colors.textTertiary }]}>{s.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderBottomWidth: 1 },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: FontSize.md, fontWeight: FontWeight.heavy },
    saveBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: BorderRadius.pill },
    saveBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.heavy },
    scroll: { padding: Spacing.xl },
    inputGroup: { marginBottom: Spacing.xl },
    label: { fontSize: 10, fontWeight: FontWeight.heavy, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    input: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    row: { flexDirection: 'row' },
    statusGrid: { flexDirection: 'row', gap: Spacing.md, marginTop: 4 },
    statusOption: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 16, gap: 8 },
    statusLabel: { fontSize: 10, fontWeight: FontWeight.heavy, textTransform: 'uppercase' },
});
