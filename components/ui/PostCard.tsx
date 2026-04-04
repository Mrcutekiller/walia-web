import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { getUserById } from '@/store/data';
import { SocialPost } from '@/store/social';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from './Avatar';

interface PostCardProps {
    post: SocialPost;
    onLike?: () => void;
    onComment?: () => void;
    onShare?: () => void;
    onPress?: () => void;
    onQuizAnswer?: (index: number) => void;
    quizAnswered?: number | null; // which index the user picked
}

export function PostCard({ post, onLike, onComment, onShare, onPress, onQuizAnswer, quizAnswered }: PostCardProps) {
    const { colors } = useTheme();
    const { user: currentUser } = useAuth();
    const router = useRouter();
    const user = getUserById(post.authorId);
    const typeColors: Record<string, string> = { quiz: '#000000', note: '#000000', ai_share: '#000000', text: '#000000', general: '#000000' };
    const typeIcons: Record<string, string> = { quiz: '🧠', note: '📒', ai_share: '✨', text: '💬', general: '💬' };
    const typeLabels: Record<string, string> = { quiz: 'QUIZ', note: 'NOTE', ai_share: 'AI INSIGHT', text: 'POST', general: 'POST' };
    const accent = colors.text;

    const getOptionStyle = (i: number) => {
        if (quizAnswered === null || quizAnswered === undefined) {
            return { backgroundColor: colors.surfaceAlt };
        }
        if (i === post.quizAnswer) {
            return { backgroundColor: '#10b98115', borderWidth: 1.5, borderColor: '#10b981' };
        }
        if (i === quizAnswered && i !== post.quizAnswer) {
            return { backgroundColor: '#ef444415', borderWidth: 1.5, borderColor: '#ef4444' };
        }
        return { backgroundColor: colors.surfaceAlt, opacity: 0.5 };
    };

    const getOptionIcon = (i: number) => {
        if (quizAnswered === null || quizAnswered === undefined) return null;
        if (i === post.quizAnswer) return <Ionicons name="checkmark-circle" size={18} color="#10b981" />;
        if (i === quizAnswered && i !== post.quizAnswer) return <Ionicons name="close-circle" size={18} color="#ef4444" />;
        return null;
    };

    const renderContentWithHashtags = (text: string) => {
        if (!text) return null;
        const words = text.split(/(\s+)/);
        return words.map((word, index) => {
            if (word.match(/^#\w+/)) {
                return (
                    <Text key={index} style={{ color: colors.primary, fontWeight: FontWeight.black }}>
                        {word}
                    </Text>
                );
            }
            return <Text key={index}>{word}</Text>;
        });
    };

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: post.isAdminPost ? colors.surfaceAlt : colors.surface, borderColor: post.isAdminPost ? colors.primary : colors.divider, borderWidth: post.isAdminPost ? 1 : 1 }]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.userInfo}
                    onPress={() => router.push(`/profile/${post.authorId}` as any)}
                    activeOpacity={0.7}
                >
                    <Avatar emoji={user?.photoURL || '👤'} size={38} />
                    <View style={styles.headerText}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'Unknown'}</Text>
                            {post.isAdminPost && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12, gap: 2 }}>
                                    <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                                    <Text style={{ fontSize: 9, fontWeight: '900', color: colors.primary, textTransform: 'uppercase' }}>Admin</Text>
                                </View>
                            )}
                        </View>
                        <Text style={[styles.time, { color: colors.textTertiary }]}>
                            {post.createdAt ? new Date(post.createdAt.toDate?.() || post.createdAt).toLocaleDateString() : 'Just now'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={[styles.typeBadge, { backgroundColor: colors.surfaceAlt, borderColor: colors.divider }]}>
                    <Text style={{ fontSize: 10 }}>{typeIcons[post.type]}</Text>
                    <Text style={[styles.typeBadgeText, { color: colors.textSecondary }]}>{typeLabels[post.type]}</Text>
                </View>
            </View>

            {/* Content */}
            <View style={styles.contentBody}>
                {post.title && <Text style={[styles.title, { color: colors.text }]}>{post.title}</Text>}
                <Text style={[styles.content, { color: colors.textSecondary }]} numberOfLines={5}>
                    {renderContentWithHashtags(post.content)}
                </Text>
            </View>

            {/* Quiz options — with inline result highlighting */}
            {post.type === 'quiz' && post.quizOptions && (
                <View style={styles.quizOptions}>
                    {post.quizOptions.map((opt, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[styles.quizOption, getOptionStyle(i)]}
                            onPress={() => quizAnswered == null && onQuizAnswer?.(i)}
                            activeOpacity={quizAnswered != null ? 1 : 0.7}
                            disabled={quizAnswered != null}
                        >
                            <Text style={[styles.quizLetter, { color: quizAnswered != null && (i === post.quizAnswer || i === quizAnswered) ? (i === post.quizAnswer ? '#10b981' : '#ef4444') : colors.textTertiary }]}>
                                {String.fromCharCode(65 + i)}
                            </Text>
                            <Text style={[styles.quizText, { color: colors.text }]}>{opt}</Text>
                            {getOptionIcon(i)}
                        </TouchableOpacity>
                    ))}
                    {quizAnswered != null && (
                        <Text style={{ fontSize: 10, color: colors.textTertiary, marginTop: Spacing.xs, textAlign: 'center', fontWeight: FontWeight.bold, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {quizAnswered === post.quizAnswer ? '🎉 Correct!' : `✅ Correct: ${String.fromCharCode(65 + (post.quizAnswer ?? 0))}`}
                        </Text>
                    )}
                </View>
            )}

            {/* Actions */}
            <View style={[styles.actions, { borderTopColor: colors.divider }]}>
                <View style={styles.actionGroup}>
                    <TouchableOpacity style={styles.action} onPress={onLike}>
                        <Ionicons
                            name={post.likes?.includes(currentUser?.id || '') ? 'heart' : 'heart-outline'}
                            size={20}
                            color={post.likes?.includes(currentUser?.id || '') ? '#FF6B6B' : colors.textSecondary}
                        />
                        <Text style={[styles.actionText, { color: post.likes?.includes(currentUser?.id || '') ? '#FF6B6B' : colors.textSecondary }]}>
                            {post.likes?.length || 0}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.action} onPress={onComment}>
                        <Ionicons name="chatbox-outline" size={18} color={colors.textSecondary} />
                        <Text style={[styles.actionText, { color: colors.textSecondary }]}>{post.commentCount || 0}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.shareBtn} onPress={onShare}>
                    <Ionicons name="share-social-outline" size={18} color={colors.textTertiary} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: { borderRadius: 32, padding: Spacing.xl, marginBottom: Spacing.lg, borderWidth: 1 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl, justifyContent: 'space-between' },
    userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    headerText: { flex: 1, marginLeft: Spacing.md },
    name: { fontSize: FontSize.md, fontWeight: FontWeight.black, letterSpacing: -0.5 },
    time: { fontSize: 10, fontWeight: FontWeight.bold, opacity: 0.4, marginTop: 1 },
    typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: BorderRadius.pill, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
    typeBadgeText: { fontSize: 9, fontWeight: FontWeight.black, letterSpacing: 0.8, textTransform: 'uppercase' },
    contentBody: { marginBottom: Spacing.xl },
    title: { fontSize: FontSize.lg, fontWeight: FontWeight.black, marginBottom: Spacing.sm, letterSpacing: -0.5 },
    content: { fontSize: FontSize.sm, lineHeight: 22, fontWeight: FontWeight.medium, opacity: 0.9 },
    quizOptions: { marginBottom: Spacing.xl },
    quizOption: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: Spacing.lg, marginBottom: Spacing.md, gap: Spacing.md, borderWidth: 1, borderColor: 'transparent' },
    quizLetter: { fontSize: FontSize.xs, fontWeight: FontWeight.black, width: 20 },
    quizText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, flex: 1 },
    actions: { flexDirection: 'row', borderTopWidth: 1, paddingTop: Spacing.lg, alignItems: 'center', justifyContent: 'space-between' },
    actionGroup: { flexDirection: 'row', gap: Spacing.xl },
    action: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    actionText: { fontSize: 12, fontWeight: FontWeight.black, letterSpacing: 0.2 },
    shareBtn: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
