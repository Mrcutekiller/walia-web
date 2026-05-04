import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { useSocial, XP_REWARDS } from '@/store/social';
import { useTokens } from '@/store/tokens';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

type PostType = 'text' | 'quiz';

const TRENDING_TAGS = ['#walia', '#studytips', '#AIchat', '#examprep', '#coding', '#science'];

export default function NewPostScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const { addPost } = useSocial();
    const { consumeTokens } = useTokens();

    const [type, setType] = useState<PostType>('text');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [quizOptions, setQuizOptions] = useState(['', '', '', '']);
    const [quizAnswer, setQuizAnswer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isAdminPost, setIsAdminPost] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const contentInputRef = useRef<TextInput>(null);

    const hasWaliaTag = content.toLowerCase().includes('#walia');
    const extractedTags = content.match(/#\w+/g) || [];
    const isValid = type === 'text'
        ? content.trim().length > 0
        : (content.trim().length > 0 && quizOptions.every(o => o.trim().length > 0));

    const handlePost = async () => {
        if (!isValid) return;
        if (!consumeTokens('community_posts')) return;
        setLoading(true);
        try {
            await addPost({
                type: type === 'quiz' ? 'quiz' : 'text',
                title: title.trim() || undefined,
                content: content.trim(),
                quizOptions: type === 'quiz' ? quizOptions : undefined,
                quizAnswer: type === 'quiz' ? quizAnswer : undefined,
                tags: extractedTags,
                isAdminPost: user?.isAdmin ? isAdminPost : false,
            }, selectedImage || undefined);
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

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });
        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const appendTag = (tag: string) => {
        const base = content.trim();
        setContent(base ? `${base} ${tag} ` : `${tag} `);
        contentInputRef.current?.focus();
    };

    const bg = isDark ? colors.background : '#F8FAFC';
    const cardBg = isDark ? colors.surface : '#FFFFFF';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
            {/* ── Header ── */}
            <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                    <Ionicons name="close" size={22} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        New {type === 'quiz' ? 'Quiz' : 'Post'}
                    </Text>
                    <View style={styles.pointsPreview}>
                        <Text style={styles.pointsIcon}>⭐</Text>
                        <Text style={[styles.pointsText, { color: '#6366F1' }]}>
                            +{hasWaliaTag ? XP_REWARDS.post_created + XP_REWARDS.hashtag_walia : XP_REWARDS.post_created} pts
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={handlePost}
                    disabled={!isValid || loading}
                    style={[styles.postBtn, { opacity: isValid ? 1 : 0.4 }]}
                >
                    <LinearGradient
                        colors={['#6366F1', '#4F46E5']}
                        style={styles.postBtnGradient}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    >
                        {loading
                            ? <ActivityIndicator size="small" color="#FFF" />
                            : <Text style={styles.postBtnText}>Post</Text>
                        }
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* #walia bonus banner */}
                    {hasWaliaTag && (
                        <View style={styles.waliaBonusBanner}>
                            <LinearGradient
                                colors={['#6366F1', '#8B5CF6']}
                                style={styles.waliaBonusGradient}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.waliaBonusEmoji}>🌟</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.waliaBonusTitle}>#walia Bonus Activated!</Text>
                                    <Text style={styles.waliaBonusSub}>+{XP_REWARDS.hashtag_walia} extra Walia Points for using #walia</Text>
                                </View>
                            </LinearGradient>
                        </View>
                    )}

                    {/* Post Type Selector */}
                    <View style={[styles.typeSelector, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                        {(['text', 'quiz'] as PostType[]).map(t => {
                            const active = type === t;
                            return (
                                <TouchableOpacity
                                    key={t}
                                    onPress={() => setType(t)}
                                    style={[
                                        styles.typeTab,
                                        active && { backgroundColor: cardBg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }
                                    ]}
                                >
                                    <Ionicons
                                        name={t === 'text' ? 'document-text' : 'help-circle'}
                                        size={16}
                                        color={active ? '#6366F1' : colors.textTertiary}
                                    />
                                    <Text style={[styles.typeTabText, { color: active ? colors.text : colors.textTertiary }]}>
                                        {t === 'text' ? 'Post' : 'Quiz'}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Admin toggle */}
                    {user?.isAdmin && (
                        <TouchableOpacity
                            onPress={() => setIsAdminPost(!isAdminPost)}
                            style={[styles.adminRow, { backgroundColor: isAdminPost ? '#6366F110' : 'transparent' }]}
                        >
                            <View style={[styles.checkbox, { borderColor: isAdminPost ? '#6366F1' : colors.textTertiary, backgroundColor: isAdminPost ? '#6366F1' : 'transparent' }]}>
                                {isAdminPost && <Ionicons name="checkmark" size={12} color="#FFF" />}
                            </View>
                            <Text style={[styles.adminLabel, { color: colors.textSecondary }]}>Post as Official Admin</Text>
                            <View style={styles.adminBadge}>
                                <Text style={styles.adminBadgeText}>ADMIN</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Title */}
                    <TextInput
                        placeholder={type === 'quiz' ? 'Quiz title (e.g. Biology Unit 1)' : 'Add a title (optional)'}
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor={colors.textTertiary}
                        style={[styles.titleInput, { color: colors.text, borderBottomColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                    />

                    {/* Content */}
                    <TextInput
                        ref={contentInputRef}
                        placeholder={
                            type === 'quiz'
                                ? 'Write your question here...'
                                : "What's on your mind? Use # to add topics"
                        }
                        value={content}
                        onChangeText={setContent}
                        multiline
                        placeholderTextColor={colors.textTertiary}
                        style={[
                            styles.contentInput,
                            { color: colors.text, minHeight: type === 'text' ? 120 : 80 }
                        ]}
                    />

                    {/* Image Attachment */}
                    {type === 'text' && (
                        <View style={styles.imageSection}>
                            {selectedImage ? (
                                <View style={styles.previewContainer}>
                                    <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                                    <TouchableOpacity 
                                        onPress={() => setSelectedImage(null)}
                                        style={styles.removeImageBtn}
                                    >
                                        <Ionicons name="close-circle" size={24} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity 
                                    onPress={pickImage}
                                    style={[styles.addImageBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderColor: isDark ? '#334155' : '#E2E8F0' }]}
                                >
                                    <Ionicons name="image-outline" size={24} color={colors.primary} />
                                    <Text style={[styles.addImageText, { color: colors.textSecondary }]}>Add Photo</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* Character count & tag preview */}
                    {content.length > 0 && (
                        <View style={styles.contentMeta}>
                            <Text style={[styles.charCount, { color: colors.textTertiary }]}>{content.length} chars</Text>
                            {extractedTags.length > 0 && (
                                <View style={styles.tagPreview}>
                                    {extractedTags.map((tag, i) => (
                                        <View key={i} style={[styles.tagPill, {
                                            backgroundColor: tag.toLowerCase() === '#walia' ? '#6366F115' : (isDark ? '#1E293B' : '#F1F5F9'),
                                            borderColor: tag.toLowerCase() === '#walia' ? '#6366F130' : 'transparent',
                                            borderWidth: 1,
                                        }]}>
                                            <Text style={[styles.tagPillText, { color: tag.toLowerCase() === '#walia' ? '#6366F1' : colors.textTertiary }]}>
                                                {tag}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    {/* Trending Tags Picker */}
                    <View style={styles.trendsSection}>
                        <Text style={[styles.trendsLabel, { color: colors.textTertiary }]}>TRENDING TAGS</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsRow}>
                            {TRENDING_TAGS.map((tag, i) => {
                                const isWalia = tag === '#walia';
                                const isAdded = content.includes(tag);
                                return (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={() => !isAdded && appendTag(tag)}
                                        activeOpacity={isAdded ? 1 : 0.7}
                                        style={[
                                            styles.trendTag,
                                            {
                                                backgroundColor: isAdded
                                                    ? (isWalia ? '#6366F1' : (isDark ? '#334155' : '#E2E8F0'))
                                                    : (isWalia ? '#6366F115' : (isDark ? '#1E293B' : '#F1F5F9')),
                                                borderColor: isWalia
                                                    ? (isAdded ? '#6366F1' : '#6366F130')
                                                    : (isDark ? '#334155' : '#E2E8F0'),
                                                borderWidth: 1,
                                            }
                                        ]}
                                    >
                                        {isWalia && !isAdded && <Text style={styles.trendBonusStar}>⭐</Text>}
                                        <Text style={[styles.trendTagText, {
                                            color: isAdded
                                                ? (isWalia ? '#FFF' : colors.textSecondary)
                                                : (isWalia ? '#6366F1' : colors.textTertiary)
                                        }]}>
                                            {tag}
                                        </Text>
                                        {isWalia && !isAdded && (
                                            <Text style={styles.trendBonusLabel}>+200 pts</Text>
                                        )}
                                        {isAdded && <Ionicons name="checkmark" size={12} color={isWalia ? '#FFF' : colors.textSecondary} />}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* Quiz Options */}
                    {type === 'quiz' && (
                        <View style={styles.quizSection}>
                            <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>ANSWER OPTIONS</Text>
                            {quizOptions.map((opt, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[
                                        styles.optionCard,
                                        {
                                            backgroundColor: quizAnswer === i ? '#6366F110' : cardBg,
                                            borderColor: quizAnswer === i ? '#6366F1' : (isDark ? '#1E293B' : '#F1F5F9'),
                                        }
                                    ]}
                                    onPress={() => setQuizAnswer(i)}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.optionLetter, { backgroundColor: quizAnswer === i ? '#6366F1' : (isDark ? '#1E293B' : '#F1F5F9') }]}>
                                        <Text style={[styles.optionLetterText, { color: quizAnswer === i ? '#FFF' : colors.textTertiary }]}>
                                            {String.fromCharCode(65 + i)}
                                        </Text>
                                    </View>
                                    <TextInput
                                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                        value={opt}
                                        onChangeText={(val) => updateQuizOption(val, i)}
                                        placeholderTextColor={colors.textTertiary}
                                        style={[styles.optionInput, { color: colors.text }]}
                                    />
                                    {quizAnswer === i && (
                                        <View style={styles.correctBadge}>
                                            <Text style={styles.correctBadgeText}>✓ Correct</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                            <Text style={[styles.hint, { color: colors.textTertiary }]}>
                                Tap an option card to mark it as the correct answer
                            </Text>
                        </View>
                    )}

                    {/* Points breakdown */}
                    <View style={[styles.pointsBreakdown, { backgroundColor: cardBg, borderColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                        <Text style={[styles.pointsBreakdownTitle, { color: colors.text }]}>⭐ Points you'll earn</Text>
                        <View style={styles.pointsRow}>
                            <Text style={[styles.pointsKey, { color: colors.textSecondary }]}>Post created</Text>
                            <Text style={[styles.pointsVal, { color: '#6366F1' }]}>+{XP_REWARDS.post_created}</Text>
                        </View>
                        {hasWaliaTag && (
                            <View style={styles.pointsRow}>
                                <Text style={[styles.pointsKey, { color: colors.textSecondary }]}>#walia bonus</Text>
                                <Text style={[styles.pointsVal, { color: '#8B5CF6' }]}>+{XP_REWARDS.hashtag_walia}</Text>
                            </View>
                        )}
                        <View style={[styles.pointsTotal, { borderTopColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                            <Text style={[styles.pointsTotalLabel, { color: colors.text }]}>Total</Text>
                            <Text style={styles.pointsTotalVal}>
                                +{hasWaliaTag ? XP_REWARDS.post_created + XP_REWARDS.hashtag_walia : XP_REWARDS.post_created} Walia Points
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    closeBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    headerTitle: { fontSize: 17, fontWeight: '900' },
    pointsPreview: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    pointsIcon: { fontSize: 12 },
    pointsText: { fontSize: 12, fontWeight: '800' },

    postBtn: {},
    postBtnGradient: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 72,
    },
    postBtnText: { color: '#FFF', fontSize: 14, fontWeight: '900' },

    scroll: { padding: 20, paddingBottom: 60 },

    // Walia Bonus
    waliaBonusBanner: { marginBottom: 20, borderRadius: 20, overflow: 'hidden' },
    waliaBonusGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    waliaBonusEmoji: { fontSize: 28 },
    waliaBonusTitle: { color: '#FFF', fontSize: 14, fontWeight: '900' },
    waliaBonusSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginTop: 2 },

    // Type selector
    typeSelector: {
        flexDirection: 'row',
        borderRadius: 18,
        padding: 4,
        marginBottom: 24,
    },
    typeTab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 14,
    },
    typeTabText: { fontSize: 13, fontWeight: '800' },

    // Admin
    adminRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 12,
        borderRadius: 14,
        marginBottom: 20,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    adminLabel: { flex: 1, fontSize: 13, fontWeight: '700' },
    adminBadge: { backgroundColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    adminBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '900', letterSpacing: 1 },

    // Inputs
    titleInput: {
        fontSize: 22,
        fontWeight: '900',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        letterSpacing: -0.3,
    },
    contentInput: {
        fontSize: 16,
        fontWeight: '500',
        textAlignVertical: 'top',
        lineHeight: 26,
        marginBottom: 12,
    },

    // Content meta
    contentMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    charCount: { fontSize: 11, fontWeight: '600' },
    tagPreview: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' },
    tagPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    tagPillText: { fontSize: 11, fontWeight: '800' },

    // Trending Tags
    trendsSection: { marginBottom: 28 },
    trendsLabel: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    tagsRow: { gap: 8 },
    trendTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    trendBonusStar: { fontSize: 10 },
    trendTagText: { fontSize: 13, fontWeight: '800' },
    trendBonusLabel: {
        fontSize: 9,
        fontWeight: '900',
        color: '#6366F1',
        backgroundColor: '#6366F115',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 6,
        marginLeft: 2,
    },

    // Quiz
    quizSection: { marginBottom: 28 },
    sectionLabel: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 14,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 18,
        borderWidth: 1.5,
        marginBottom: 10,
        gap: 12,
    },
    optionLetter: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionLetterText: { fontSize: 14, fontWeight: '900' },
    optionInput: { flex: 1, fontSize: 15, fontWeight: '600' },
    correctBadge: {
        backgroundColor: '#10B98115',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    correctBadgeText: { color: '#10B981', fontSize: 10, fontWeight: '800' },
    hint: { fontSize: 11, textAlign: 'center', marginTop: 8, fontWeight: '500' },

    // Points breakdown
    pointsBreakdown: {
        padding: 20,
        borderRadius: 22,
        borderWidth: 1,
        marginTop: 8,
    },
    pointsBreakdownTitle: { fontSize: 15, fontWeight: '900', marginBottom: 14 },
    pointsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    pointsKey: { fontSize: 14, fontWeight: '600' },
    pointsVal: { fontSize: 14, fontWeight: '900' },
    pointsTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, marginTop: 4 },
    pointsTotalLabel: { fontSize: 15, fontWeight: '900' },
    pointsTotalVal: { fontSize: 15, fontWeight: '900', color: '#6366F1' },

    // Image Picker
    imageSection: { marginBottom: 20 },
    addImageBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderRadius: 18,
        borderWidth: 1.5,
        borderStyle: 'dashed',
    },
    addImageText: { fontSize: 14, fontWeight: '700' },
    previewContainer: { position: 'relative', borderRadius: 18, overflow: 'hidden' },
    imagePreview: { width: '100%', height: 200, borderRadius: 18 },
    removeImageBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: '#FFF', borderRadius: 12 },
});
