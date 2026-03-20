import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useSocial } from '@/store/social';
import { useTheme } from '@/store/theme';
import { useTokens, TokenFeature } from '@/store/tokens';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_W = (width - Spacing.xl * 2 - Spacing.md) / 2;

const TOOLS: { title: string, desc: string, icon: string, route: string, emoji: string, color: string, id: TokenFeature }[] = [
    { title: 'Summarizer', desc: 'Condense long articles and textbooks.', icon: 'document-text', route: '/ai?mode=summarizer', emoji: '📄', color: '#3b82f6', id: 'summarizer' },
    { title: 'Quiz Maker', desc: 'Generate MCQs and tests from notes.', icon: 'help-circle', route: '/ai?mode=quiz', emoji: '🧠', color: '#10b981', id: 'quiz_maker' },
    { title: 'Flashcards', desc: 'AI-generated study card sets.', icon: 'layers', route: '/ai?mode=flashcard', emoji: '🃏', color: '#f59e0b', id: 'flashcards' },
    { title: 'Image Scanner', desc: 'Extract text and equations from photos.', icon: 'scan', route: '/ai?mode=scanner', emoji: '📸', color: '#a855f7', id: 'image_scanner' },
    { title: 'Code Assistant', desc: 'Debug and explain coding logic.', icon: 'code-slash', route: '/ai?mode=code', emoji: '💻', color: '#6366f1', id: 'code_assistant' },
    { title: 'Translator', desc: 'Academic translation in 50+ languages.', icon: 'language', route: '/ai?mode=translate', emoji: '🌐', color: '#f43f5e', id: 'translator' },
    { title: 'Grammar Pro', desc: 'Refine your academic writing.', icon: 'pencil', route: '/ai?mode=grammar', emoji: '✍️', color: '#06b6d4', id: 'grammar_pro' },
    { title: 'Citations', desc: 'Generate APA/MLA references.', icon: 'quote', route: '/ai?mode=cite', emoji: '📚', color: '#f97316', id: 'citations' },
];

export default function ToolsScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { studyHistory } = useSocial();
    const { tokenDisplay, consumeTokens, isPro } = useTokens();

    const counts = {
        quiz: studyHistory.filter(h => h.tool === 'quiz').length,
        summarize: studyHistory.filter(h => h.tool === 'summarize').length,
        flashcard: studyHistory.filter(h => h.tool === 'flashcard').length,
        notes: studyHistory.filter(h => h.tool === 'notes').length || 0,
        scanner: studyHistory.filter(h => h.tool as any === 'scanner').length || 0,
        code: studyHistory.filter(h => h.tool as any === 'code').length || 0,
        translate: studyHistory.filter(h => h.tool as any === 'translate').length || 0,
        grammar: studyHistory.filter(h => h.tool as any === 'grammar').length || 0,
    };

    const sortedHistory = [...studyHistory].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 5);

    const getToolIcon = (tool: string) => {
        const t = TOOLS.find(tt => tt.title.toLowerCase().includes(tool.toLowerCase()));
        return { n: t?.icon || 'create', c: t?.color || colors.primary };
    };

    const handleToolPress = (tool: typeof TOOLS[0]) => {
        if (consumeTokens(tool.id)) {
            router.push(tool.route as any);
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
                            <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Academic Toolkit</Text>
                            <Text style={[styles.headerTitle, { color: colors.text }]}>Walia Tools</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <View style={[styles.tokenPill, { backgroundColor: isPro ? '#6C63FF15' : colors.surfaceAlt, borderColor: isPro ? '#6C63FF30' : colors.border }]}>
                                <Text style={{ fontSize: 12 }}>🪙</Text>
                                <Text style={[styles.tokenText, { color: isPro ? '#6C63FF' : colors.text }]}>{tokenDisplay}</Text>
                            </View>
                            <TouchableOpacity style={[styles.aiShortcut, { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={() => router.push('/ai/')}>
                                <Ionicons name="sparkles" size={18} color={colors.textInverse} />
                                <Text style={[styles.aiShortcutText, { color: colors.textInverse }]}>Ask AI</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Tool cards grid */}
                <View style={styles.grid}>
                    {TOOLS.map((tool, i) => (
                        <TouchableOpacity key={i} style={[styles.toolCard]} onPress={() => handleToolPress(tool)} activeOpacity={0.85}>
                            <View style={[styles.toolInner, { backgroundColor: isDark ? colors.surface : '#FAFAFA', borderWidth: 1, borderColor: colors.border }]}>
                                <View style={[styles.iconBox, { backgroundColor: tool.color + '15' }]}>
                                    <Ionicons name={tool.icon as any} size={28} color={isDark ? tool.color : tool.color} />
                                </View>
                                <View>
                                    <Text style={[styles.toolTitle, { color: colors.text }]}>{tool.title}</Text>
                                    <Text style={[styles.toolDesc, { color: colors.textSecondary }]} numberOfLines={2}>{tool.desc}</Text>
                                </View>
                                <View style={styles.toolFooter}>
                                    <Text style={[styles.toolEmoji]}>{tool.emoji}</Text>
                                    <View style={[styles.toolArrow, { backgroundColor: colors.surfaceAlt }]}>
                                        <Ionicons name="arrow-forward" size={14} color={colors.text} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Stats summary moved to a more compact style */}
                <View style={[styles.statsRow, { backgroundColor: isDark ? colors.surface : '#FAFAFA' }]}>
                    <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Total Sessions: {studyHistory.length}</Text>
                    <View style={styles.statsSeparator} />
                    <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>XP Earned: {studyHistory.length * 20}</Text>
                </View>

                {/* Recent activity */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
                <View style={[styles.recentCard, { backgroundColor: isDark ? colors.surface : '#FAFAFA' }]}>
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
    headerGradient: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg, paddingBottom: Spacing.xl },
    headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, letterSpacing: -1 },
    headerSub: { fontSize: 10, fontWeight: FontWeight.heavy, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
    aiShortcut: { flexDirection: 'row', gap: 6, alignItems: 'center', borderRadius: BorderRadius.pill, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1 },
    aiShortcutText: { fontSize: 10, fontWeight: FontWeight.heavy, textTransform: 'uppercase', letterSpacing: 1 },
    tokenPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
    tokenText: { fontSize: 11, fontWeight: FontWeight.heavy, letterSpacing: 0.5 },
    content: { padding: Spacing.xl, paddingBottom: 120 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xl },
    toolCard: { width: CARD_W, borderRadius: 32, marginBottom: Spacing.md },
    toolInner: { padding: Spacing.lg, minHeight: 180, justifyContent: 'space-between', borderRadius: 32 },
    iconBox: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
    toolTitle: { fontSize: FontSize.md, fontWeight: FontWeight.heavy, letterSpacing: -0.5 },
    toolDesc: { fontSize: 10, lineHeight: 14, marginTop: 4, fontWeight: FontWeight.medium, opacity: 0.6 },
    toolFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md },
    toolEmoji: { fontSize: 24 },
    toolArrow: { width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 20, padding: Spacing.md, marginBottom: Spacing.xl, borderWidth: 1, borderColor: '#E5E7EB', gap: Spacing.md },
    statsLabel: { fontSize: 10, fontWeight: FontWeight.heavy, textTransform: 'uppercase', letterSpacing: 1 },
    statsSeparator: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#cbd5e1' },
    sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.heavy, marginBottom: Spacing.lg, letterSpacing: -0.5 },
    recentCard: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
    recentItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg },
    recentIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    recentTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, letterSpacing: -0.3 },
    recentSub: { fontSize: FontSize.xs, marginTop: 2, fontWeight: FontWeight.medium, opacity: 0.6 },
    badge: { borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.sm + 2, paddingVertical: 4 },
    divider: { height: 1, marginHorizontal: Spacing.lg },
});
