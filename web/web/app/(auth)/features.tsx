import { Button } from '@/components/ui/Button';
import { BorderRadius, Colors, FontSize, FontWeight, Shadow, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
    const { signup } = useAuth();

    const handleStart = async () => {
        await signup({ name: 'Student', username: 'student', email: 'student@studyhub.com' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Here's what you can do! ✨</Text>
                <Text style={styles.subtitle}>Unlock the full power of StudyHub</Text>

                <View style={styles.grid}>
                    {FEATURES.map((f, i) => (
                        <View key={i} style={[styles.card, Shadow.sm]}>
                            <Text style={styles.cardEmoji}>{f.emoji}</Text>
                            <Text style={styles.cardTitle}>{f.title}</Text>
                            <Text style={styles.cardDesc}>{f.desc}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button title="Start Using Walia 🚀" onPress={handleStart} size="lg" style={{ width: '100%' }} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scroll: { paddingHorizontal: Spacing.xxl, paddingTop: Spacing.xxl, paddingBottom: Spacing.huge },
    title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.text, textAlign: 'center' },
    subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm, marginBottom: Spacing.xxl },
    grid: { gap: Spacing.md },
    card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.xl },
    cardEmoji: { fontSize: 36, marginBottom: Spacing.md },
    cardTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.xs },
    cardDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
    footer: { paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.lg, backgroundColor: Colors.background },
});
