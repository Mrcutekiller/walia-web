import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { useSocial } from '@/store/social';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

type PostType = 'text' | 'quiz';

export default function NewPostScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const { addPost } = useSocial();

    const [type, setType] = useState<PostType>('text');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [quizOptions, setQuizOptions] = useState(['', '', '', '']);
    const [quizAnswer, setQuizAnswer] = useState(0);
    const [loading, setLoading] = useState(false);

    const handlePost = async () => {
        if (!content.trim()) return;
        setLoading(true);
        try {
            await addPost({
                type: type === 'quiz' ? 'quiz' : 'text',
                title: title.trim() || undefined,
                content: content.trim(),
                quizOptions: type === 'quiz' ? quizOptions : undefined,
                quizAnswer: type === 'quiz' ? quizAnswer : undefined,
            });
            router.back();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuizOption = (val: string, index: number) => {
        const next = [...quizOptions];
        next[index] = val;
        setQuizOptions(next);
    };

    const isValid = type === 'text' ? content.trim().length > 0 : (content.trim().length > 0 && quizOptions.every(o => o.trim().length > 0));

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.divider }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>New {type === 'quiz' ? 'Quiz' : 'Post'}</Text>
                <TouchableOpacity 
                    onPress={handlePost} 
                    disabled={!isValid || loading}
                    style={[styles.postBtn, { backgroundColor: isValid ? colors.primary : colors.surfaceAlt }]}
                >
                    {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={[styles.postBtnText, { color: isValid ? '#fff' : colors.textTertiary }]}>Post</Text>}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    {/* Type Selector */}
                    <View style={[styles.tabs, { backgroundColor: colors.surfaceAlt }]}>
                        {(['text', 'quiz'] as PostType[]).map(t => (
                            <TouchableOpacity 
                                key={t} 
                                onPress={() => setType(t)}
                                style={[styles.tab, type === t && { backgroundColor: colors.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }]}
                            >
                                <Ionicons name={t === 'text' ? 'document-text' : 'help-circle'} size={18} color={type === t ? colors.primary : colors.textTertiary} />
                                <Text style={[styles.tabText, { color: type === t ? colors.text : colors.textTertiary }]}>{t.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Title (Optional for text, Required for Quiz) */}
                    <TextInput
                        placeholder={type === 'quiz' ? "Quiz Title (e.g. Biology Unit 1)" : "Add a title (optional)"}
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor={colors.textTertiary}
                        style={[styles.titleInput, { color: colors.text }]}
                    />

                    {/* Content / Question */}
                    <TextInput
                        placeholder={type === 'quiz' ? "Ask your question..." : "What's on your mind?"}
                        value={content}
                        onChangeText={setContent}
                        multiline
                        placeholderTextColor={colors.textTertiary}
                        style={[styles.contentInput, { color: colors.text, minHeight: type === 'text' ? 200 : 100 }]}
                    />

                    {/* Quiz specific fields */}
                    {type === 'quiz' && (
                        <View style={styles.quizFields}>
                            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Options</Text>
                            {quizOptions.map((opt, i) => (
                                <View key={i} style={styles.optionRow}>
                                    <TouchableOpacity 
                                        onPress={() => setQuizAnswer(i)}
                                        style={[styles.radio, { borderColor: quizAnswer === i ? colors.primary : colors.divider, backgroundColor: quizAnswer === i ? colors.primary : 'transparent' }]}
                                    >
                                        {quizAnswer === i && <Ionicons name="checkmark" size={12} color="#fff" />}
                                    </TouchableOpacity>
                                    <TextInput
                                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                        value={opt}
                                        onChangeText={(val) => updateQuizOption(val, i)}
                                        placeholderTextColor={colors.textTertiary}
                                        style={[styles.optionInput, { color: colors.text, backgroundColor: colors.surfaceAlt }]}
                                    />
                                </View>
                            ))}
                            <Text style={styles.hint}>Tap the circle to mark the correct answer.</Text>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderBottomWidth: 1 },
    closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: FontSize.md, fontWeight: FontWeight.heavy },
    postBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: BorderRadius.pill },
    postBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.heavy },
    scroll: { padding: Spacing.xl },
    tabs: { flexDirection: 'row', borderRadius: 16, padding: 4, marginBottom: Spacing.xl },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, borderRadius: 12 },
    tabText: { fontSize: 10, fontWeight: FontWeight.heavy, letterSpacing: 0.5 },
    titleInput: { fontSize: FontSize.lg, fontWeight: FontWeight.heavy, marginBottom: Spacing.md },
    contentInput: { fontSize: FontSize.md, textAlignVertical: 'top', lineHeight: 24 },
    quizFields: { marginTop: Spacing.xl },
    sectionLabel: { fontSize: 10, fontWeight: FontWeight.heavy, textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.lg },
    optionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
    radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    optionInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    hint: { fontSize: 10, color: '#94a3b8', textAlign: 'center', marginTop: Spacing.md },
});
