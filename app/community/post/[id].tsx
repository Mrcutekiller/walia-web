import { Avatar } from '@/components/ui/Avatar';
import { PostCard } from '@/components/ui/PostCard';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { POSTS, getUserById } from '@/store/data';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert, KeyboardAvoidingView, Platform, ScrollView,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const [post, setPost] = useState(POSTS.find(p => p.id === id));
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(post?.comments || []);
    const [quizAnswered, setQuizAnswered] = useState<number | null>(null);

    if (!post) return null;

    const addComment = () => {
        if (!comment.trim()) return;
        setComments([...comments, { id: Date.now().toString(), userId: '1', text: comment, timestamp: 'Just now' }]);
        setComment('');
    };

    const handleLike = () => {
        setPost(p => p ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p);
    };

    const handleQuizAnswer = (idx: number) => {
        if (quizAnswered !== null) return; // Already answered
        setQuizAnswered(idx);
        const correct = idx === post.quizAnswer;
        setTimeout(() => {
            Alert.alert(
                correct ? '🎉 Correct!' : '❌ Wrong answer',
                correct
                    ? `That's right! "${post.quizOptions?.[idx]}" is the correct answer.`
                    : `The correct answer was "${post.quizOptions?.[post.quizAnswer ?? 0]}". Keep studying! 💪`,
            );
        }, 400);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <LinearGradient
                colors={isDark ? ['#1A1A2E', '#0D0D1A'] : ['#6C63FF', '#8B85FF']}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                            <Ionicons name="arrow-back" size={22} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Post</Text>
                        <TouchableOpacity
                            style={styles.headerBtn}
                            onPress={() => Alert.alert('Shared!', 'Post link copied 📋')}
                        >
                            <Ionicons name="share-outline" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.xl, paddingBottom: 100 }}>
                {/* Post card with live like/quiz */}
                <PostCard
                    post={post}
                    onLike={handleLike}
                    onComment={() => { }}
                    onShare={() => Alert.alert('Shared!', 'Post link copied 📋')}
                    onQuizAnswer={handleQuizAnswer}
                    quizAnswered={quizAnswered}
                />

                {/* Comments section */}
                <Text style={[styles.commentsTitle, { color: colors.text }]}>
                    💬 Comments ({comments.length})
                </Text>

                {comments.length === 0 && (
                    <View style={styles.noComments}>
                        <Text style={{ fontSize: 36, marginBottom: Spacing.sm }}>💭</Text>
                        <Text style={[styles.noCommentsText, { color: colors.textSecondary }]}>
                            Be the first to comment!
                        </Text>
                    </View>
                )}

                {comments.map(c => {
                    const user = getUserById(c.userId);
                    return (
                        <View key={c.id} style={styles.commentItem}>
                            <Avatar emoji={user?.avatar || '🧑‍🎓'} size={36} />
                            <View style={[styles.commentBubble, { backgroundColor: colors.surface }]}>
                                <View style={styles.commentMeta}>
                                    <Text style={[styles.commentName, { color: colors.text }]}>
                                        {user?.name || 'You'}
                                    </Text>
                                    <Text style={[styles.commentTime, { color: colors.textTertiary }]}>
                                        {c.timestamp}
                                    </Text>
                                </View>
                                <Text style={[styles.commentText, { color: colors.text }]}>{c.text}</Text>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            {/* Comment input */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
                    <Avatar emoji="🧑‍🎓" size={36} />
                    <View style={[styles.inputWrap, { backgroundColor: colors.surfaceAlt }]}>
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="Write a comment..."
                            placeholderTextColor={colors.textTertiary}
                            value={comment}
                            onChangeText={setComment}
                            multiline
                        />
                    </View>
                    <TouchableOpacity
                        onPress={addComment}
                        disabled={!comment.trim()}
                        style={[styles.sendBtn, { backgroundColor: comment.trim() ? colors.primary : colors.border }]}
                    >
                        <Ionicons name="arrow-up" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerGradient: {},
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
    headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: '#fff' },
    commentsTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginTop: Spacing.md, marginBottom: Spacing.lg },
    noComments: { alignItems: 'center', paddingVertical: Spacing.xxxl },
    noCommentsText: { fontSize: FontSize.md },
    commentItem: { flexDirection: 'row', marginBottom: Spacing.lg, alignItems: 'flex-start' },
    commentBubble: { flex: 1, marginLeft: Spacing.md, borderRadius: BorderRadius.lg, padding: Spacing.md },
    commentMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
    commentName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
    commentTime: { fontSize: FontSize.xs },
    commentText: { fontSize: FontSize.md, lineHeight: 20 },
    inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, paddingBottom: Spacing.xl + 48, borderTopWidth: 1, gap: Spacing.md },
    inputWrap: { flex: 1, borderRadius: BorderRadius.xxl, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
    input: { fontSize: FontSize.md, maxHeight: 80 },
    sendBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
