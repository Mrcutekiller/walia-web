import { Avatar } from '@/components/ui/Avatar';
import { PostCard } from '@/components/ui/PostCard';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { USERS } from '@/store/data';
import { XP_REWARDS, useSocial } from '@/store/social';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OtherProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { posts, likePost, followUser, unfollowUser, isFollowing, addXP, followers } = useSocial();
    const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

    const user = USERS.find(u => u.id === id);
    const userPosts = posts.filter(p => p.userId === id);
    const following = isFollowing(id || '');

    // Calculate real stats from store
    const realFollowersCount = Object.values(followers).filter(list => list.includes(id || '')).length;
    const realLikesCount = userPosts.reduce((sum, post) => sum + post.likes, 0);

    if (!user) return null;

    const handleFollow = () => {
        if (following) {
            unfollowUser(id!);
        } else {
            followUser(id!);
        }
    };

    const handleQuizAnswer = (postId: string, answerIdx: number) => {
        if (quizAnswers[postId] !== undefined) return;
        const post = posts.find(p => p.id === postId);
        if (!post || post.type !== 'quiz') return;
        setQuizAnswers(prev => ({ ...prev, [postId]: answerIdx }));
        if (answerIdx === post.quizAnswer) addXP(XP_REWARDS.quiz_correct, 'Quiz correct! 🧠');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient
                colors={isDark ? ['#1A1A2E', '#12123A'] : ['#6C63FF', '#8B85FF']}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                            <Ionicons name="arrow-back" size={22} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Profile</Text>
                        <TouchableOpacity style={styles.headerBtn}>
                            <Ionicons name="ellipsis-horizontal" size={20} color="rgba(255,255,255,0.8)" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
                    {/* Gradient mini-cover */}
                    <LinearGradient
                        colors={isDark ? ['#12123A', '#1A1A2E'] : ['#EEF0FF', '#F5F5FF']}
                        style={styles.coverGradient}
                    />

                    <View style={styles.avatarRowCard}>
                        <View style={[styles.avatarRing, { borderColor: colors.primary }]}>
                            <Avatar emoji={user.avatar} size={68} online={user.online} />
                        </View>
                        {/* Follow toggle */}
                        <TouchableOpacity onPress={handleFollow}>
                            {following ? (
                                <View style={[styles.followingBtn, { borderColor: colors.border }]}>
                                    <Ionicons name="checkmark" size={14} color={colors.text} />
                                    <Text style={[styles.followingText, { color: colors.text }]}>Following</Text>
                                </View>
                            ) : (
                                <LinearGradient colors={['#6C63FF', '#5A52E0']} style={styles.followBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                    <Ionicons name="person-add" size={14} color="#fff" />
                                    <Text style={styles.followBtnText}>Follow</Text>
                                </LinearGradient>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
                        <Text style={[styles.username, { color: colors.textSecondary }]}>@{user.username}</Text>
                        {user.bio ? <Text style={[styles.bio, { color: colors.textSecondary }]}>{user.bio}</Text> : null}
                    </View>

                    <View style={[styles.statsRow, { borderTopColor: colors.divider }]}>
                        {[
                            { val: realFollowersCount, label: 'Followers', color: '#6C63FF' },
                            { val: userPosts.length, label: 'Posts', color: '#4ECDC4' },
                            { val: realLikesCount, label: 'Likes', color: '#FF6B6B' },
                        ].map(({ val, label, color }, i) => (
                            <React.Fragment key={label}>
                                {i > 0 && <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />}
                                <View style={styles.statItem}>
                                    <Text style={[styles.statValue, { color }]}>{val}</Text>
                                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
                                </View>
                            </React.Fragment>
                        ))}
                    </View>

                    {/* Message button */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.msgBtn, { backgroundColor: colors.surfaceAlt }]}
                            onPress={() => router.push(`/chat/${id}` as any)}
                        >
                            <Ionicons name="chatbubble-outline" size={16} color={colors.text} />
                            <Text style={[styles.msgBtnText, { color: colors.text }]}>Message</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* User Posts */}
                <View style={{ paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl }}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Posts ({userPosts.length})</Text>
                    {userPosts.length > 0 ? (
                        userPosts.map(p => (
                            <PostCard
                                key={p.id} post={p}
                                onPress={() => router.push(`/community/post/${p.id}` as any)}
                                onLike={() => likePost(p.id)}
                                onComment={() => router.push(`/community/post/${p.id}` as any)}
                                onQuizAnswer={(idx) => handleQuizAnswer(p.id, idx)}
                                quizAnswered={quizAnswers[p.id] ?? null}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyPosts}>
                            <Text style={{ fontSize: 48, marginBottom: Spacing.md }}>📭</Text>
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No posts yet</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerGradient: {},
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
    headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: '#fff' },
    profileCard: { marginHorizontal: Spacing.xl, marginTop: Spacing.md, borderRadius: BorderRadius.xxl, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
    coverGradient: { height: 80 },
    avatarRowCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: Spacing.xl, marginTop: -36 },
    avatarRing: { borderWidth: 2.5, borderRadius: 40, padding: 2 },
    followBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm + 2 },
    followBtnText: { color: '#fff', fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    followingBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm + 2, borderWidth: 1.5 },
    followingText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
    profileInfo: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.md },
    name: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
    username: { fontSize: FontSize.sm, marginTop: 2 },
    bio: { fontSize: FontSize.sm, marginTop: Spacing.sm, lineHeight: 18 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: Spacing.lg, borderTopWidth: 1 },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
    statLabel: { fontSize: FontSize.xs, marginTop: 2 },
    statDivider: { width: 1 },
    actionRow: { flexDirection: 'row', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg, gap: Spacing.md },
    msgBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderRadius: BorderRadius.pill, paddingVertical: Spacing.md },
    msgBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
    sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: Spacing.md },
    emptyPosts: { alignItems: 'center', paddingVertical: Spacing.xxxl },
    emptyText: { fontSize: FontSize.md },
});
