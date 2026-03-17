import { Avatar } from '@/components/ui/Avatar';
import { PostCard } from '@/components/ui/PostCard';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { auth, db } from '@/services/firebase';
import { XP_REWARDS, useSocial } from '@/store/social';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabType = 'messages' | 'groups' | 'community';

export default function ChatScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { posts, likePost, addXP } = useSocial();
    const [activeTab, setActiveTab] = useState<TabType>('messages');

    const [chats, setChats] = useState<any[]>([]);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

    useEffect(() => {
        if (!auth.currentUser) return;

        // Query chats where user is a participant
        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', auth.currentUser.uid),
            orderBy('updatedAt', 'desc')
        );

        return onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setChats(data);
        });
    }, []);

    const privateChats = chats.filter(c => c.type === 'private');
    const groupChats = chats.filter(c => c.type === 'group');

    const handleQuizAnswer = (postId: string, answerIdx: number) => {
        if (quizAnswers[postId] !== undefined) return;
        const post = posts.find(p => p.id === postId);
        if (!post || post.type !== 'quiz') return;
        setQuizAnswers(prev => ({ ...prev, [postId]: answerIdx }));
        if (answerIdx === post.quizAnswer) addXP(XP_REWARDS.quiz_correct, 'Quiz correct! 🧠');
    };

    const renderChatItem = (chat: any) => {
        return (
            <TouchableOpacity key={chat.id} style={[styles.chatItem, { borderBottomColor: colors.divider }]}
                onPress={() => router.push(chat.type === 'group' ? `/chat/group/${chat.id}` : `/chat/${chat.id}` as any)}
                activeOpacity={0.7}
            >
                <Avatar emoji={chat.avatar || (chat.type === 'group' ? '👥' : '👤')} size={50} online={chat.type === 'private'} />
                <View style={styles.chatInfo}>
                    <View style={styles.chatTopRow}>
                        <Text style={[styles.chatName, { color: colors.text }]} numberOfLines={1}>{chat.name}</Text>
                        <Text style={[styles.chatTime, { color: colors.textTertiary }]}>
                            {chat.updatedAt?.seconds ? new Date(chat.updatedAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                        </Text>
                    </View>
                    <Text style={[styles.chatMsg, { color: colors.textSecondary }]} numberOfLines={1}>{chat.lastMessage}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.headerContainer, { backgroundColor: isDark ? '#000' : '#fff', borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.header}>
                        <View>
                            <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Connect & Learn</Text>
                            <Text style={[styles.headerTitle, { color: colors.text }]}>Walia Social</Text>
                        </View>
                        <TouchableOpacity style={[styles.newBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => router.push('/chat/new')}>
                            <Ionicons name="create-outline" size={20} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

                <View style={styles.tabBar}>
                    {(['messages', 'groups', 'community'] as const).map(key => {
                        const active = activeTab === key;
                        const icons = { messages: 'chatbubble', groups: 'people', community: 'earth' };
                        return (
                            <TouchableOpacity key={key} style={styles.tabItem} onPress={() => setActiveTab(key)}>
                                <View style={[styles.tabIconContainer, active && { backgroundColor: colors.primary + '10' }]}>
                                    <Ionicons name={`${icons[key]}${active ? '' : '-outline'}` as any} size={20} color={active ? colors.primary : colors.textTertiary} />
                                </View>
                                <Text style={[styles.tabLabel, { color: active ? colors.text : colors.textTertiary, fontWeight: active ? FontWeight.heavy : FontWeight.bold }]}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Text>
                                {active && <View style={[styles.tabIndicator, { backgroundColor: colors.text }]} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.list} contentContainerStyle={{ paddingBottom: 100 }}>
                {activeTab === 'messages' && (
                    <>
                        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Private Messages</Text>
                        {privateChats.length === 0 ? <Text style={styles.empty}>No private messages yet.</Text> : privateChats.map(renderChatItem)}
                    </>
                )}

                {activeTab === 'groups' && (
                    <>
                        <TouchableOpacity style={[styles.newGroupBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push('/chat/new')}>
                            <LinearGradient colors={['#6C63FF', '#5A52E0']} style={styles.newGroupIcon}>
                                <Ionicons name="people" size={20} color="#fff" />
                            </LinearGradient>
                            <Text style={[styles.newGroupText, { color: colors.text }]}>Start a new group</Text>
                            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                        </TouchableOpacity>
                        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Your Groups</Text>
                        {groupChats.length === 0 ? <Text style={styles.empty}>No groups yet.</Text> : groupChats.map(renderChatItem)}
                    </>
                )}

                {activeTab === 'community' && (
                    <View style={styles.communityContent}>
                        <TouchableOpacity style={[styles.composeBar, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push('/community/new-post')}>
                            <Text style={[styles.composePlaceholder, { color: colors.textTertiary }]}>Share something with the community...</Text>
                            <View style={[styles.postBtn, { backgroundColor: colors.primary }]}>
                                <Text style={styles.postBtnText}>Post</Text>
                            </View>
                        </TouchableOpacity>
                        {posts.map(p => (
                            <PostCard key={p.id} post={p} onLike={() => likePost(p.id)} onQuizAnswer={(idx) => handleQuizAnswer(p.id, idx)} quizAnswered={quizAnswers[p.id] ?? null} />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerContainer: { zIndex: 10 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm, paddingBottom: Spacing.md },
    headerSub: { fontSize: 10, fontWeight: FontWeight.heavy, textTransform: 'uppercase', letterSpacing: 1.5 },
    headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy },
    newBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent' },
    tabBar: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: Spacing.xs, paddingBottom: 2 },
    tabItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md, gap: 4, position: 'relative' },
    tabIndicator: { position: 'absolute', bottom: 0, left: '25%', right: '25%', height: 2, borderRadius: 2 },
    tabIconContainer: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
    tabLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
    list: { flex: 1 },
    sectionLabel: { fontSize: 10, fontWeight: FontWeight.heavy, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: Spacing.xl, marginBottom: Spacing.sm, paddingHorizontal: Spacing.xl, color: '#94a3b8' },
    chatItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.lg, borderBottomWidth: 1, paddingHorizontal: Spacing.xl },
    chatInfo: { flex: 1, marginLeft: Spacing.md },
    chatTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
    chatName: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
    chatTime: { fontSize: 10, fontWeight: FontWeight.semibold },
    chatMsg: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
    empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40, fontSize: FontSize.sm, fontStyle: 'italic', paddingHorizontal: Spacing.xl },
    newGroupBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.xl, padding: Spacing.lg, marginTop: Spacing.md, marginHorizontal: Spacing.xl, borderWidth: 1, gap: Spacing.md },
    newGroupIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    newGroupText: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.bold },
    communityContent: { paddingTop: Spacing.md, paddingHorizontal: Spacing.xl },
    composeBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 24, padding: Spacing.md, marginBottom: Spacing.xl, borderWidth: 1, gap: Spacing.md },
    composePlaceholder: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.medium, marginLeft: 4 },
    postBtn: { borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
    postBtnText: { fontSize: FontSize.xs, fontWeight: FontWeight.heavy, textTransform: 'uppercase', letterSpacing: 1 },
});
