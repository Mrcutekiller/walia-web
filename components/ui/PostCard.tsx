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
    const typeIcons: Record<string, string> = { quiz: '🧮', note: '📒', ai_share: '🤖', text: '💬', general: '💬' };
    const typeLabels: Record<string, string> = { quiz: 'QUIZ', note: 'NOTE', ai_share: 'AI INSIGHT', text: 'POST', general: 'GENERAL' };
    const accent = colors.text;

    const getOptionStyle = (i: number) => {
        if (quizAnswered === null || quizAnswered === undefined) {
            return { backgroundColor: colors.surfaceAlt };
        }
        if (i === post.quizAnswer) {
            return { backgroundColor: '#2ED57320', borderWidth: 1.5, borderColor: '#2ED573' };
        }
        if (i === quizAnswered && i !== post.quizAnswer) {
            return { backgroundColor: '#FF475720', borderWidth: 1.5, borderColor: '#FF4757' };
        }
        return { backgroundColor: colors.surfaceAlt, opacity: 0.5 };
    };

    const getOptionIcon = (i: number) => {
        if (quizAnswered === null || quizAnswered === undefined) return null;
        if (i === post.quizAnswer) return <Ionicons name="checkmark-circle" size={18} color="#2ED573" />;
        if (i === quizAnswered && i !== post.quizAnswer) return <Ionicons name="close-circle" size={18} color="#FF4757" />;
        return null;
    };

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface }]}
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
                    <Avatar emoji={user?.photoURL || '👤'} size={40} />
                    <View style={styles.headerText}>
                        <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'Unknown'}</Text>
                        <Text style={[styles.time, { color: colors.textTertiary }]}>
                            {post.createdAt ? new Date(post.createdAt.toDate?.() || post.createdAt).toLocaleDateString() : 'Just now'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={[styles.typeBadge, { backgroundColor: `${accent}18` }]}>
                    <Text style={{ fontSize: 12 }}>{typeIcons[post.type]}</Text>
                    <Text style={[styles.typeBadgeText, { color: accent }]}>{typeLabels[post.type]}</Text>
                </View>
            </View>

            {/* Content */}
            {post.title && <Text style={[styles.title, { color: colors.text }]}>{post.title}</Text>}
            <Text style={[styles.content, { color: colors.text }]}>{post.content}</Text>

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
                            <Text style={[styles.quizLetter, { color: quizAnswered != null && (i === post.quizAnswer || i === quizAnswered) ? (i === post.quizAnswer ? '#2ED573' : '#FF4757') : colors.textSecondary }]}>
                                {String.fromCharCode(65 + i)}
                            </Text>
                            <Text style={[styles.quizText, { color: colors.text, flex: 1 }]}>{opt}</Text>
                            {getOptionIcon(i)}
                        </TouchableOpacity>
                    ))}
                    {quizAnswered != null && (
                        <Text style={{ fontSize: FontSize.xs, color: colors.textTertiary, marginTop: Spacing.xs, textAlign: 'center' }}>
                            {quizAnswered === post.quizAnswer ? '🎉 You got it right!' : `✅ Correct answer: ${String.fromCharCode(65 + (post.quizAnswer ?? 0))}`}
                        </Text>
                    )}
                </View>
            )}

            {/* Actions */}
            <View style={[styles.actions, { borderTopColor: colors.divider }]}>
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
                    <Ionicons name="chatbubble-outline" size={18} color={colors.textSecondary} />
                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>{post.commentCount || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.action} onPress={onShare}>
                    <Ionicons name="share-outline" size={18} color={colors.textSecondary} />
                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>0</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: { borderRadius: 32, padding: Spacing.xl, marginBottom: Spacing.lg, borderWidth: 1, borderColor: '#f1f5f9' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg, justifyContent: 'space-between' },
    userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    headerText: { flex: 1, marginLeft: Spacing.md, marginRight: Spacing.sm },
    name: { fontSize: FontSize.md, fontWeight: FontWeight.heavy, letterSpacing: -0.5 },
    time: { fontSize: 10, fontWeight: FontWeight.bold, opacity: 0.4 },
    typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: BorderRadius.pill, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#f1f5f9' },
    typeBadgeText: { fontSize: 10, fontWeight: FontWeight.heavy, letterSpacing: 1 },
    title: { fontSize: FontSize.xl, fontWeight: FontWeight.heavy, marginBottom: Spacing.sm, letterSpacing: -0.5 },
    content: { fontSize: FontSize.md, lineHeight: 24, marginBottom: Spacing.xl, fontWeight: FontWeight.medium, opacity: 0.8 },
    quizOptions: { marginBottom: Spacing.xl },
    quizOption: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: Spacing.lg, marginBottom: Spacing.md, gap: Spacing.md, borderWidth: 1, borderColor: '#f8fafc' },
    quizLetter: { fontSize: FontSize.sm, fontWeight: FontWeight.heavy, width: 20 },
    quizText: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
    actions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: Spacing.lg, gap: Spacing.xl },
    action: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    actionText: { fontSize: 12, fontWeight: FontWeight.bold },
});
