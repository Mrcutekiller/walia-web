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

const TOOLS: { title: string, desc: string, icon: string, route: string, emoji: string, color: string, id: TokenFeature, tokens: number }[] = [
    { title: 'Summarizer', desc: 'Condense long articles and textbooks.', icon: 'document-text', route: '/ai?mode=summarizer', emoji: '📄', color: '#3b82f6', id: 'summarizer', tokens: 3 },
    { title: 'Quiz Maker', desc: 'Generate MCQs and tests from notes.', icon: 'help-circle', route: '/ai?mode=quiz', emoji: '🧠', color: '#10b981', id: 'quiz_maker', tokens: 3 },
    { title: 'Flashcards', desc: 'AI-generated study card sets.', icon: 'layers', route: '/ai?mode=flashcard', emoji: '🃏', color: '#f59e0b', id: 'flashcards', tokens: 3 },
    { title: 'Image Scanner', desc: 'Extract text and equations from photos.', icon: 'scan', route: '/ai?mode=scanner', emoji: '📸', color: '#a855f7', id: 'image_scanner', tokens: 5 },
    { title: 'Code Assistant', desc: 'Debug and explain coding logic.', icon: 'code-slash', route: '/ai?mode=code', emoji: '💻', color: '#6366f1', id: 'code_assistant', tokens: 2 },
    { title: 'Translator', desc: 'Academic translation in 50+ languages.', icon: 'language', route: '/ai?mode=translate', emoji: '🌐', color: '#f43f5e', id: 'translator', tokens: 2 },
    { title: 'Grammar Pro', desc: 'Refine your academic writing.', icon: 'pencil', route: '/ai?mode=grammar', emoji: '✍️', color: '#06b6d4', id: 'grammar_pro', tokens: 2 },
    { title: 'Citations', desc: 'Generate APA/MLA references.', icon: 'quote', route: '/ai?mode=cite', emoji: '📚', color: '#f97316', id: 'citations', tokens: 2 },
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
                        <View style={{ flex: 1 }}>
                            <View style={[styles.headerBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderWidth: 1, alignSelf: 'flex-start', marginBottom: 12 }]}>
                                <Ionicons name="flash" size={12} color={colors.text} style={{ marginRight: 6 }} />
                                <Text style={[styles.badgeText, { color: colors.text }]}>ACADEMIC TOOLKIT</Text>
                            </View>
                            <Text style={[styles.headerTitle, { color: colors.text }]}>Smart Tools for{"\n"}Modern Students.</Text>
                        </View>
                        <View style={[styles.tokenPill, { backgroundColor: isPro ? '#6C63FF15' : colors.surfaceAlt, borderColor: isPro ? '#6C63FF30' : colors.border }]}>
                            <Text style={{ fontSize: 12 }}>🪙</Text>
                            <Text style={[styles.tokenText, { color: isPro ? '#6C63FF' : colors.text }]}>{tokenDisplay}</Text>
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
                                    <View style={[styles.tokenTag, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                                        <Text style={[styles.tokenTagText, { color: colors.textTertiary }]}>🪙 {tool.tokens}</Text>
                                    </View>
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
                                    <View style={[styles.recentBadge, { backgroundColor: `${icon.c}20` }]}>
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
    headerTitle: { fontSize: 32, fontWeight: FontWeight.black, letterSpacing: -1.5, lineHeight: 36 },
    headerSub: { fontSize: 10, fontWeight: FontWeight.black, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
    aiShortcut: { flexDirection: 'row', gap: 6, alignItems: 'center', borderRadius: BorderRadius.pill, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1 },
    aiShortcutText: { fontSize: 10, fontWeight: FontWeight.black, textTransform: 'uppercase', letterSpacing: 1 },
    tokenPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1 },
    tokenText: { fontSize: 14, fontWeight: FontWeight.black, letterSpacing: 0.5 },
    content: { padding: Spacing.xl, paddingBottom: 120 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xl },
    toolCard: { width: CARD_W, borderRadius: 32, marginBottom: Spacing.md },
    toolInner: { padding: Spacing.lg, minHeight: 200, justifyContent: 'space-between', borderRadius: 32 },
    iconBox: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
    toolTitle: { fontSize: FontSize.md, fontWeight: FontWeight.black, letterSpacing: -0.5 },
    toolDesc: { fontSize: 11, lineHeight: 16, marginTop: 4, fontWeight: FontWeight.medium, opacity: 0.6 },
    toolFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md },
    toolEmoji: { fontSize: 24 },
    toolArrow: { width: 32, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    tokenTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    tokenTagText: { fontSize: 10, fontWeight: FontWeight.black },
    headerBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.pill },
    badgeText: { fontSize: 9, fontWeight: FontWeight.black, letterSpacing: 1.5 },
    statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 24, padding: Spacing.lg, marginBottom: Spacing.xl, borderWidth: 1, borderColor: '#eff1f5', gap: Spacing.md },
    statsLabel: { fontSize: 10, fontWeight: FontWeight.black, textTransform: 'uppercase', letterSpacing: 1 },
    statsSeparator: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#cbd5e1' },
    sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.black, marginBottom: Spacing.lg, letterSpacing: -0.5 },
    recentCard: { borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: '#eff1f5' },
    recentItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg },
    recentIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    recentTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, letterSpacing: -0.3 },
    recentSub: { fontSize: FontSize.xs, marginTop: 2, fontWeight: FontWeight.medium, opacity: 0.6 },
    recentBadge: { borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.sm + 2, paddingVertical: 4 },
    divider: { height: 1, marginHorizontal: Spacing.lg },
});
