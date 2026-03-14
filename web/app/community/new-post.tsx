import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useSocial } from '@/store/social';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PostType = 'text' | 'quiz' | 'note' | 'ai_share';

export default function NewPostScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { addPost } = useSocial();
    const [type, setType] = useState<PostType>('text');
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [quizType, setQuizType] = useState<'choose' | 'tf'>('choose');
    const [quizOptions, setQuizOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState<number>(0);

    const types: { key: PostType; icon: string; label: string; color: string }[] = [
        { key: 'text', icon: '💬', label: 'Post', color: '#FF6B6B' },
        { key: 'quiz', icon: '🧮', label: 'Quiz', color: '#6C63FF' },
        { key: 'note', icon: '📒', label: 'Note', color: '#FFA502' },
        { key: 'ai_share', icon: '🤖', label: 'AI Share', color: '#4ECDC4' },
    ];

    const handlePost = () => {
        if (!content.trim()) return;

        let finalOptions = undefined;
        let finalAnswer = undefined;

        if (type === 'quiz') {
            if (quizType === 'choose') {
                finalOptions = quizOptions.filter(o => o.trim() !== '');
                finalAnswer = correctAnswer;
            } else {
                finalOptions = ['True', 'False'];
                finalAnswer = correctAnswer;
            }
        }

        addPost({
<<<<<<< HEAD
=======
            userId: '1',
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
            type,
            title: title.trim() || undefined,
            content: content.trim(),
            quizOptions: finalOptions,
            quizAnswer: finalAnswer,
        });
        router.back();
    };

    const currentType = types.find(t => t.key === type)!;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <LinearGradient
                colors={isDark ? ['#1A1A2E', '#0D0D1A'] : ['#6C63FF', '#8B85FF']}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                            <Ionicons name="close" size={22} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.headerCenter}>
                            <Text style={styles.headerTitle}>New Post</Text>
                            <View style={styles.xpChip}>
                                <Text style={styles.xpChipText}>+100 XP on post</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[styles.postBtn, !content.trim() && { opacity: 0.4 }]}
                            onPress={handlePost}
                            disabled={!content.trim()}
                        >
                            <Text style={styles.postBtnText}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView style={[styles.content, { backgroundColor: colors.background }]}>
                    {/* Type selector */}
                    <View style={styles.typeRow}>
                        {types.map(t => (
                            <TouchableOpacity
                                key={t.key}
                                style={[styles.typeBtn, { backgroundColor: colors.surface, borderColor: type === t.key ? t.color : colors.border }, type === t.key && { backgroundColor: `${t.color}12` }]}
                                onPress={() => setType(t.key)}
                            >
                                <Text style={{ fontSize: 16 }}>{t.icon}</Text>
                                <Text style={[styles.typeLabel, { color: type === t.key ? t.color : colors.textSecondary, fontWeight: type === t.key ? FontWeight.bold : FontWeight.regular }]}>
                                    {t.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Accent bar by type */}
                    <View style={[styles.accentBar, { backgroundColor: currentType.color }]} />

                    {type !== 'text' && (
                        <TextInput
                            style={[styles.titleInput, { color: colors.text, borderBottomColor: colors.divider }]}
                            placeholder="Title (optional)..."
                            placeholderTextColor={colors.textTertiary}
                            value={title}
                            onChangeText={setTitle}
                        />
                    )}

                    <TextInput
                        style={[styles.contentInput, { color: colors.text }]}
                        placeholder={
                            type === 'quiz' ? 'Write your question...'
                                : type === 'note' ? 'Write your note or key points...'
                                    : type === 'ai_share' ? 'Paste your AI conversation or insight...'
                                        : "What's on your mind? 💭"
                        }
                        placeholderTextColor={colors.textTertiary}
                        value={content}
                        onChangeText={setContent}
                        multiline
                        textAlignVertical="top"
                    />

                    {type === 'quiz' && (
                        <View style={styles.quizSection}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quiz Type</Text>
                            <View style={styles.quizTypeRow}>
                                <TouchableOpacity
                                    style={[styles.quizTypeBtn, { backgroundColor: colors.surface, borderColor: quizType === 'choose' ? colors.primary : colors.border }]}
                                    onPress={() => setQuizType('choose')}
                                >
                                    <Ionicons name="list" size={20} color={quizType === 'choose' ? colors.primary : colors.textTertiary} />
                                    <Text style={{ color: quizType === 'choose' ? colors.primary : colors.textSecondary }}>Multiple Choice</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.quizTypeBtn, { backgroundColor: colors.surface, borderColor: quizType === 'tf' ? colors.primary : colors.border }]}
                                    onPress={() => { setQuizType('tf'); setCorrectAnswer(0); }}
                                >
                                    <Ionicons name="checkmark-circle-outline" size={20} color={quizType === 'tf' ? colors.primary : colors.textTertiary} />
                                    <Text style={{ color: quizType === 'tf' ? colors.primary : colors.textSecondary }}>True / False</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.lg }]}>Answer Options</Text>
                            {quizType === 'choose' ? (
                                <View style={styles.optionsList}>
                                    {quizOptions.map((opt, i) => (
                                        <View key={i} style={styles.optionRow}>
                                            <TouchableOpacity
                                                onPress={() => setCorrectAnswer(i)}
                                                style={[styles.radio, { borderColor: correctAnswer === i ? colors.primary : colors.textTertiary }]}
                                            >
                                                {correctAnswer === i && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                                            </TouchableOpacity>
                                            <TextInput
                                                style={[styles.optionInput, { color: colors.text, backgroundColor: colors.surfaceAlt }]}
                                                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                                placeholderTextColor={colors.textTertiary}
                                                value={opt}
                                                onChangeText={(val) => {
                                                    const newOpts = [...quizOptions];
                                                    newOpts[i] = val;
                                                    setQuizOptions(newOpts);
                                                }}
                                            />
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <View style={styles.tfRow}>
                                    {['True', 'False'].map((label, i) => (
                                        <TouchableOpacity
                                            key={i}
                                            style={[styles.tfBtn, { backgroundColor: correctAnswer === i ? colors.primary : colors.surfaceAlt }]}
                                            onPress={() => setCorrectAnswer(i)}
                                        >
                                            <Text style={{ color: correctAnswer === i ? '#fff' : colors.textSecondary, fontWeight: FontWeight.bold }}>{label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>

                <View style={[styles.toolbar, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
                    <TouchableOpacity style={styles.toolbarBtn}>
                        <Ionicons name="image-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toolbarBtn}>
                        <Ionicons name="link-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.charCount, { color: colors.textTertiary }]}>{content.length} chars</Text>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerGradient: {},
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: Spacing.sm },
    closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    headerCenter: { flex: 1, alignItems: 'center', gap: 4 },
    headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: '#fff' },
    xpChip: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
    xpChipText: { fontSize: 10, color: '#fff', fontWeight: FontWeight.bold },
    postBtn: { backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm + 2 },
    postBtnText: { color: '#fff', fontWeight: FontWeight.bold, fontSize: FontSize.md },
    content: { flex: 1, padding: Spacing.xl },
    typeRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
    typeBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.pill, borderWidth: 1.5 },
    typeLabel: { fontSize: FontSize.sm },
    accentBar: { height: 3, borderRadius: 2, marginBottom: Spacing.lg, width: 40 },
    titleInput: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginBottom: Spacing.md, borderBottomWidth: 1, paddingBottom: Spacing.sm },
    contentInput: { fontSize: FontSize.md, lineHeight: 24, minHeight: 120 },
    quizSection: { marginTop: Spacing.lg, paddingBottom: 40 },
    sectionTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, marginBottom: Spacing.sm },
    quizTypeRow: { flexDirection: 'row', gap: Spacing.md },
    quizTypeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1.5 },
    optionsList: { gap: Spacing.sm },
    optionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    radioInner: { width: 10, height: 10, borderRadius: 5 },
    optionInput: { flex: 1, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md, fontSize: FontSize.md },
    tfRow: { flexDirection: 'row', gap: Spacing.md },
    tfBtn: { flex: 1, padding: Spacing.lg, borderRadius: BorderRadius.lg, alignItems: 'center' },
    toolbar: { flexDirection: 'row', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, paddingBottom: Spacing.xl, borderTopWidth: 1, gap: Spacing.lg, alignItems: 'center' },
    toolbarBtn: { padding: Spacing.sm },
    charCount: { marginLeft: 'auto', fontSize: FontSize.xs },
});
