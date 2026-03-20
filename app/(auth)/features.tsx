import { Button } from '@/components/ui/Button';
import { BorderRadius, Colors, FontSize, FontWeight, Shadow, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FEATURES = [
    { emoji: '🤖', title: 'AI Chat Assistant', desc: 'Get instant help with any subject. Ask questions, get explanations, and learn faster.' },
    { emoji: '💬', title: 'Chat with Friends', desc: 'Private messages, group chats, and voice notes. Stay connected with your study buddies.' },
    { emoji: '🌐', title: 'Community Feed', desc: 'Share quizzes, notes, and AI discoveries. Like, comment, and learn from others — just like X/Twitter.' },
    { emoji: '📝', title: 'Study Tools', desc: 'Summarize texts, create flashcards, generate quizzes, and take notes — all AI-powered.' },
    { emoji: '📅', title: 'Smart Calendar', desc: 'Set reminders for exams, assignments, and study sessions. Never miss a deadline.' },
    { emoji: '🔗', title: 'Share Everything', desc: 'Share your AI chats, quizzes, and notes with friends or the entire community.' },
];

export default function FeaturesScreen() {
    const router = useRouter();
    const { user } = useAuth();

    const handleStart = () => {
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Welcome to Walia, {user?.name?.split(' ')[0] || 'Student'}! ✨</Text>
                <Text style={styles.subtitle}>Unlock the full power of your AI Study Companion</Text>

                <View style={styles.grid}>
                    {FEATURES.map((f, i) => (
                        <View key={i} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardEmoji}>{f.emoji}</Text>
                                <Text style={styles.cardTitle}>{f.title}</Text>
                            </View>
                            <Text style={styles.cardDesc}>{f.desc}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <SafeAreaView edges={['bottom']} style={styles.footer}>
                <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
                    <Text style={styles.startBtnText}>Start Using Walia 🚀</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    scroll: { paddingHorizontal: Spacing.xxl, paddingTop: Spacing.huge, paddingBottom: Spacing.huge },
    title: { fontSize: 32, fontWeight: '900', color: '#fff', textAlign: 'center', lineHeight: 38 },
    subtitle: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: Spacing.sm, marginBottom: Spacing.xxxl, fontWeight: '600' },
    grid: { gap: Spacing.md },
    card: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: BorderRadius.xl, padding: Spacing.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
    cardEmoji: { fontSize: 24 },
    cardTitle: { fontSize: FontSize.lg, fontWeight: '800', color: '#fff' },
    cardDesc: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.4)', lineHeight: 20, fontWeight: '500' },
    footer: { paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.xl, backgroundColor: '#000', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
    startBtn: {
        backgroundColor: '#fff',
        borderRadius: BorderRadius.pill,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#fff',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    startBtnText: { color: '#000', fontSize: FontSize.lg, fontWeight: '900' },
});
