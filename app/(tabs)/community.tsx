import { Avatar } from '@/components/ui/Avatar';
import { PostCard } from '@/components/ui/PostCard';
import { useAuth } from '@/store/auth';
import { XP_REWARDS, useSocial } from '@/store/social';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CommunityScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const { posts, stories, likePost, deletePost, togglePostPrivacy, addXP, addStory } = useSocial();
    const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

    const trendingTags = React.useMemo(() => {
        const tagCounts: Record<string, number> = {};
        posts.forEach(post => {
            const matches = post.content.match(/#\w+/g);
            if (matches) {
                matches.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });
        const colorsArr = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#06B6D4'];
        return Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([tag, count], i) => ({ tag, count, color: colorsArr[i % colorsArr.length] }));
    }, [posts]);

    const bg = isDark ? colors.background : '#F8FAFC';
    const cardBg = isDark ? colors.surface : '#FFFFFF';

    const handleQuizAnswer = (postId: string, answerIdx: number) => {
        if (quizAnswers[postId] !== undefined) return;
        const post = posts.find(p => p.id === postId);
        if (!post || post.type !== 'quiz') return;
        setQuizAnswers(prev => ({ ...prev, [postId]: answerIdx }));
        if (answerIdx === post.quizAnswer) addXP(XP_REWARDS.quiz_correct, 'Quiz correct! 🧠');
    };

    const handleOptions = (postId: string, authorId: string, isPrivate?: boolean) => {
        Alert.alert(
            'Post Options',
            'What would you like to do with this post?',
            [
                { text: isPrivate ? 'Make Public' : 'Make Private', onPress: () => togglePostPrivacy(postId) },
                { text: 'Delete Post', onPress: () => deletePost(postId), style: 'destructive' },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const visiblePosts = posts.filter(p => !p.isPrivate || p.authorId === user?.id);

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            {/* ── Premium Header ── */}
            <LinearGradient
                colors={isDark ? ['#0F172A', '#1E293B'] : ['#FFFFFF', '#FFFFFF']}
                style={[styles.header, { borderBottomColor: isDark ? '#1E293B' : '#F1F5F9', borderBottomWidth: 1 }]}
            >
                <SafeAreaView edges={['top']} style={styles.safeHeader}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={[styles.headerSub, { color: colors.textTertiary }]}>WALIA HUB</Text>
                            <Text style={[styles.headerTitle, { color: colors.text }]}>Community</Text>
                        </View>
                        <View style={styles.headerActions}>
                            <TouchableOpacity
                                style={[styles.iconBtn, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: isDark ? '#334155' : '#E2E8F0' }]}
                                onPress={() => router.push('/community/new-post')}
                            >
                                <Ionicons name="create-outline" size={20} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 120, paddingTop: 16 }}
            >
                {/* Stories */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScroll}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.storyContainer} onPress={() => {
                        Alert.prompt('Add Story', 'What is on your mind?', [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Post', onPress: (text) => text && addStory(text) }
                        ]);
                    }}>
                        <View style={[styles.storyCircle, { borderColor: isDark ? '#334155' : '#E2E8F0', borderStyle: 'dashed', borderWidth: 2, backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                            <Ionicons name="add" size={24} color={colors.textTertiary} />
                        </View>
                        <Text style={[styles.storyUsername, { color: colors.text }]}>Your Story</Text>
                    </TouchableOpacity>
                    {stories.map(story => (
                        <TouchableOpacity activeOpacity={0.8} key={story.id} style={styles.storyContainer} onPress={() => Alert.alert('Story', 'Story viewing coming soon!')}>
                            <View style={[styles.storyCircle, { backgroundColor: isDark ? '#FFFFFF' : '#000000', borderColor: story.hasUnseen ? colors.text : 'transparent', borderWidth: story.hasUnseen ? 2 : 0 }]}>
                                <Text style={[styles.storyAvatarText, { color: isDark ? '#000000' : '#FFFFFF' }]}>{story.image}</Text>
                            </View>
                            <Text style={[styles.storyUsername, { color: colors.textTertiary }]}>{story.username}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Trending Tags */}
                {trendingTags.length > 0 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tagsScroll}
                    >
                        {trendingTags.map((item, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.tag, { backgroundColor: `${item.color}12`, borderColor: `${item.color}30` }]}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.tagText, { color: item.color }]}>{item.tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* Compose Bar */}
                <TouchableOpacity
                    style={[styles.composeBar, { backgroundColor: cardBg, borderColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                    onPress={() => router.push('/community/new-post')}
                    activeOpacity={0.8}
                >
                    <Avatar emoji={user?.photoURL || '👤'} size={38} />
                    <Text style={[styles.composePlaceholder, { color: colors.textTertiary }]}>
                        Share insight • Use #walia for +200 pts...
                    </Text>
                    <View style={[styles.postBtn, { backgroundColor: '#6366F1' }]}>
                        <Ionicons name="arrow-up" size={18} color="#FFF" />
                    </View>
                </TouchableOpacity>

                <View style={styles.feedHeader}>
                    <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>COMMUNITY FEED</Text>
                </View>

                {visiblePosts.length === 0 ? (
                    <View style={[styles.emptyBox, { marginHorizontal: 20, backgroundColor: cardBg, borderColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                        <View style={[styles.emptyIconWrap, { backgroundColor: '#10B98110' }]}>
                            <Ionicons name="compass-outline" size={32} color="#10B981" />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No posts yet</Text>
                        <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                            Be the first to share in the community!
                        </Text>
                    </View>
                ) : (
                    visiblePosts.map(p => (
                        <PostCard
                            key={p.id}
                            post={p}
                            onLike={() => likePost(p.id)}
                            onOptions={p.authorId === user?.id ? () => handleOptions(p.id, p.authorId, p.isPrivate) : undefined}
                            onQuizAnswer={(idx) => handleQuizAnswer(p.id, idx)}
                            quizAnswered={quizAnswers[p.id] ?? null}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { zIndex: 10 },
    safeHeader: { paddingHorizontal: 20, paddingBottom: 16 },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    headerSub: { fontSize: 10, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' },
    headerTitle: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
    headerActions: { flexDirection: 'row', gap: 10 },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },

    content: { flex: 1 },

    // Stories
    storiesScroll: { paddingHorizontal: 20, paddingBottom: 16, gap: 16 },
    storyContainer: { alignItems: 'center', gap: 6 },
    storyCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
    storyAvatarText: { fontSize: 24, fontWeight: '900' },
    storyUsername: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

    // Trending Tags
    tagsScroll: { paddingHorizontal: 20, paddingVertical: 10, gap: 10, marginBottom: 4 },
    tag: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    tagText: { fontSize: 13, fontWeight: '800', letterSpacing: -0.2 },

    // Compose Bar
    composeBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 24,
        padding: 12,
        borderRadius: 24,
        borderWidth: 1,
        gap: 12,
    },
    composePlaceholder: { flex: 1, fontSize: 14, fontWeight: '500' },
    postBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },

    feedHeader: { paddingHorizontal: 20, marginBottom: 12 },
    sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },

    // Empty Box
    emptyBox: {
        borderRadius: 24,
        borderWidth: 1,
        padding: 40,
        alignItems: 'center',
        gap: 8,
    },
    emptyIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    emptyTitle: { fontSize: 16, fontWeight: '800' },
    emptyText: { fontSize: 13, fontWeight: '500', textAlign: 'center' },
});
