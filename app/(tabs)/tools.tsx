import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useSocial } from '@/store/social';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_W = (width - Spacing.xl * 2 - Spacing.md) / 2;

const TOOLS = [
    { title: 'Summarize', desc: 'Condense any text to key points', icon: 'document-text', route: '/tools/summarize', emoji: '📄' },
    { title: 'Quiz', desc: 'Generate & take practice tests', icon: 'help-circle', route: '/tools/quiz', emoji: '🧠' },
    { title: 'Flashcards', desc: 'Flip-card studying system', icon: 'layers', route: '/tools/flashcard', emoji: '🃏' },
    { title: 'Notes', desc: 'Write & organize your ideas', icon: 'create', route: '/tools/notes', emoji: '📝' },
];

export default function ToolsScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { studyHistory } = useSocial();

    const counts = {
        quiz: studyHistory.filter(h => h.tool === 'quiz').length,
        summarize: studyHistory.filter(h => h.tool === 'summarize').length,
        flashcard: studyHistory.filter(h => h.tool === 'flashcard').length,
        notes: studyHistory.filter(h => h.tool === 'notes').length || 0,
    };

    const sortedHistory = [...studyHistory].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 5);

    const getToolIcon = (tool: string) => {
        const iconColor = colors.text;
        switch (tool) {
            case 'quiz': return { n: 'help-circle', c: iconColor };
            case 'summarize': return { n: 'document-text', c: iconColor };
            case 'flashcard': return { n: 'layers', c: iconColor };
            default: return { n: 'create', c: iconColor };
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient
                colors={isDark ? ['#000000', '#121212'] : ['#F9FAFB', '#FFFFFF']}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={[styles.headerTitle, { color: colors.text }]}>Study Tools 🛠️</Text>
                            <Text style={[styles.headerSub, { color: colors.textSecondary }]}>4 tools to supercharge your learning</Text>
                        </View>
                        <TouchableOpacity style={[styles.aiShortcut, { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={() => router.push('/ai/')}>
                            <Ionicons name="sparkles" size={18} color={colors.textInverse} />
                            <Text style={[styles.aiShortcutText, { color: colors.textInverse }]}>Ask AI</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Tool cards grid */}
                <View style={styles.grid}>
                    {TOOLS.map((tool, i) => (
                        <TouchableOpacity key={i} style={[styles.toolCard, i % 2 === 1 && styles.toolCardOffset]} onPress={() => router.push(tool.route as any)} activeOpacity={0.85}>
                            <View style={[styles.toolGradient, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.divider }]}>
                                <Text style={styles.toolEmoji}>{tool.emoji}</Text>
                                <Text style={[styles.toolTitle, { color: colors.text }]}>{tool.title}</Text>
                                <Text style={[styles.toolDesc, { color: colors.textSecondary }]}>{tool.desc}</Text>
                                <View style={[styles.toolArrow, { backgroundColor: colors.surfaceAlt }]}>
                                    <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Stats row */}
                <View style={[styles.statsRow, { backgroundColor: colors.surface }]}>
                    {[[counts.quiz, 'Quizzes'], [counts.notes, 'Notes'], [counts.flashcard, 'Flashcards'], [counts.summarize, 'Summaries']].map(([val, label]) => (
                        <View key={label} style={styles.statItem}>
                            <Text style={[styles.statVal, { color: colors.primary }]}>{val}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
                        </View>
                    ))}
                </View>

                {/* Recent activity */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
                <View style={[styles.recentCard, { backgroundColor: colors.surface }]}>
                    {sortedHistory.length > 0 ? sortedHistory.map((item, i) => {
                        const icon = getToolIcon(item.tool);
                        const date = new Date(item.timestamp).toLocaleDateString();
                        return (
                            <View key={i}>
                                {i > 0 && <View style={[styles.divider, { backgroundColor: colors.divider }]} />}
                                <View style={styles.recentItem}>
                                    <View style={[styles.recentIcon, { backgroundColor: `${icon.c}20` }]}>
                                        <Ionicons name={icon.n as any} size={20} color={icon.c} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.recentTitle, { color: colors.text }]}>{item.title}</Text>
                                        <Text style={[styles.recentSub, { color: colors.textSecondary }]}>{item.tool.toUpperCase()} · {date}</Text>
                                    </View>
                                    <View style={[styles.badge, { backgroundColor: `${icon.c}20` }]}>
                                        <Ionicons name="chevron-forward" size={14} color={icon.c} />
                                    </View>
                                </View>
                            </View>
                        );
                    }) : (
                        <View style={{ padding: Spacing.xl, alignItems: 'center' }}>
                            <Text style={{ color: colors.textTertiary }}>No study activity yet! 📚</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerGradient: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg, paddingBottom: Spacing.xl },
    headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, letterSpacing: -1 },
    headerSub: { fontSize: 10, fontWeight: FontWeight.heavy, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
    aiShortcut: { flexDirection: 'row', gap: 6, alignItems: 'center', borderRadius: BorderRadius.pill, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1 },
    aiShortcutText: { fontSize: 10, fontWeight: FontWeight.heavy, textTransform: 'uppercase', letterSpacing: 1 },
    content: { padding: Spacing.xl, paddingBottom: 120 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xl },
    toolCard: { width: CARD_W, borderRadius: 32, overflow: 'hidden' },
    toolCardOffset: { marginTop: Spacing.lg },
    toolGradient: { padding: Spacing.xl, minHeight: 180, justifyContent: 'space-between', borderRadius: 32 },
    toolEmoji: { fontSize: 36, marginBottom: Spacing.sm },
    toolTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.heavy, letterSpacing: -0.5 },
    toolDesc: { fontSize: 11, lineHeight: 16, marginTop: 4, fontWeight: FontWeight.medium, opacity: 0.7 },
    toolArrow: { alignSelf: 'flex-end', width: 32, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.sm },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', borderRadius: 24, padding: Spacing.xl, marginBottom: Spacing.xl, borderWidth: 1, borderColor: '#f1f5f9' },
    statItem: { alignItems: 'center' },
    statVal: { fontSize: FontSize.xl, fontWeight: FontWeight.heavy, letterSpacing: -1 },
    statLabel: { fontSize: 10, fontWeight: FontWeight.heavy, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
    sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.heavy, marginBottom: Spacing.lg, letterSpacing: -0.5 },
    recentCard: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#f1f5f9' },
    recentItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg },
    recentIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    recentTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, letterSpacing: -0.3 },
    recentSub: { fontSize: FontSize.xs, marginTop: 2, fontWeight: FontWeight.medium, opacity: 0.6 },
    badge: { borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.sm + 2, paddingVertical: 4 },
    divider: { height: 1, marginHorizontal: Spacing.lg },
});
