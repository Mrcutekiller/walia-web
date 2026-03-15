import { Avatar } from '@/components/ui/Avatar';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { auth, db } from '@/services/firebase';
import { USERS } from '@/store/data';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    addDoc,
    collection,
    getDocs,
    query,
    serverTimestamp,
    where
} from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewChatScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const [search, setSearch] = useState('');
    const [isGroup, setIsGroup] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [groupName, setGroupName] = useState('');
    const [loading, setLoading] = useState(false);

    const filtered = USERS.filter(u => {
        const q = search.toLowerCase().replace('@', '');
        return (
            (u.name.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q)) &&
            u.id !== auth.currentUser?.uid
        );
    });

    const toggleSelect = (id: string) => {
        if (selected.includes(id)) setSelected(selected.filter(s => s !== id));
        else setSelected([...selected, id]);
    };

    const handleStartChat = async (targetUserId: string) => {
        if (!auth.currentUser || loading) return;
        setLoading(true);
        try {
            // Check if private chat already exists
            const q = query(
                collection(db, 'chats'),
                where('type', '==', 'private'),
                where('participants', 'array-contains', auth.currentUser.uid)
            );
            const snap = await getDocs(q);
            const existing = snap.docs.find(d => d.data().participants.includes(targetUserId));

            if (existing) {
                router.replace(`/chat/${existing.id}` as any);
                return;
            }

            // Create new private chat
            const targetUser = USERS.find(u => u.id === targetUserId);
            const ref = await addDoc(collection(db, 'chats'), {
                type: 'private',
                participants: [auth.currentUser.uid, targetUserId],
                name: targetUser?.name || 'User',
<<<<<<< HEAD
                photoURL: targetUser?.photoURL || '/avatars/avatar1.jpg',
=======
                avatar: targetUser?.avatar || '👤',
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
                lastMessage: 'Started a conversation',
                updatedAt: serverTimestamp(),
            });
            router.replace(`/chat/${ref.id}` as any);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async () => {
        if (!auth.currentUser || !groupName.trim() || loading) return;
        setLoading(true);
        try {
            const ref = await addDoc(collection(db, 'chats'), {
                type: 'group',
                name: groupName.trim(),
<<<<<<< HEAD
                photoURL: '/avatars/avatar1.jpg',
=======
                avatar: '👥',
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
                participants: [auth.currentUser.uid, ...selected],
                lastMessage: 'Group created',
                updatedAt: serverTimestamp(),
            });
            router.replace(`/chat/group/${ref.id}` as any);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient colors={isDark ? ['#1A1A2E', '#0D0D1A'] : ['#6C63FF', '#8B85FF']} style={styles.headerGradient}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                            <Ionicons name="close" size={22} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{isGroup ? 'New Group' : 'New Message'}</Text>
                        <TouchableOpacity style={styles.toggleBtn} onPress={() => setIsGroup(!isGroup)}>
                            <Ionicons name={isGroup ? 'person' : 'people'} size={16} color="#fff" />
                            <Text style={styles.toggleText}>{isGroup ? 'DM' : 'Group'}</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {isGroup && (
                <View style={[styles.groupNameContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Ionicons name="people" size={20} color={colors.textTertiary} />
                    <TextInput
                        style={[styles.groupNameInput, { color: colors.text }]}
                        placeholder="Group name..."
                        placeholderTextColor={colors.textTertiary}
                        value={groupName}
                        onChangeText={setGroupName}
                    />
                </View>
            )}

            <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Ionicons name="search" size={20} color={colors.textTertiary} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search by name or @username..."
                    placeholderTextColor={colors.textTertiary}
                    value={search}
                    onChangeText={setSearch}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            {isGroup && selected.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedRow}>
                    {selected.map(id => {
                        const user = USERS.find(u => u.id === id);
                        return (
                            <TouchableOpacity key={id} style={[styles.selectedChip, { backgroundColor: colors.surfaceAlt }]} onPress={() => toggleSelect(id)}>
<<<<<<< HEAD
                                <Text style={styles.selectedEmoji}>{user?.photoURL}</Text>
=======
                                <Text style={styles.selectedEmoji}>{user?.avatar}</Text>
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
                                <Text style={[styles.selectedName, { color: colors.text }]}>{user?.name.split(' ')[0]}</Text>
                                <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}

            <ScrollView style={styles.userList}>
                {filtered.map(u => (
                    <TouchableOpacity key={u.id} style={[styles.userItem, { borderBottomColor: colors.divider }]} onPress={() => {
                        if (isGroup) toggleSelect(u.id);
                        else handleStartChat(u.id);
                    }}>
<<<<<<< HEAD
                        <Avatar emoji={u.photoURL} size={48} online={u.online} />
=======
                        <Avatar emoji={u.avatar} size={48} online={u.online} />
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
                        <View style={styles.userInfo}>
                            <Text style={[styles.userName, { color: colors.text }]}>{u.name}</Text>
                            <Text style={[styles.userUsername, { color: colors.textSecondary }]}>@{u.username}</Text>
                        </View>
                        {isGroup && (
                            <Ionicons
                                name={selected.includes(u.id) ? 'checkmark-circle' : 'ellipse-outline'}
                                size={24}
                                color={selected.includes(u.id) ? colors.primary : colors.textTertiary}
                            />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {isGroup && selected.length > 0 && (
                <View style={[styles.footer, { backgroundColor: colors.background }]}>
                    <TouchableOpacity
                        style={[styles.createBtn, { backgroundColor: colors.primary }, (!groupName.trim() || loading) && { opacity: 0.6 }]}
                        onPress={handleCreateGroup}
                        disabled={!groupName.trim() || loading}
                    >
                        <Ionicons name="people" size={20} color="#fff" />
                        <Text style={styles.createBtnText}>
                            {loading ? 'Creating...' : `Create Group (${selected.length})`}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerGradient: {},
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
    closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: '#fff' },
    toggleBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
    toggleText: { fontSize: FontSize.sm, color: '#fff', fontWeight: FontWeight.medium },
    groupNameContainer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.xl, marginVertical: Spacing.md, marginHorizontal: Spacing.xl, borderRadius: BorderRadius.xl, paddingVertical: Spacing.md, borderWidth: 1 },
    groupNameInput: { flex: 1, fontSize: FontSize.md },
    searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.xl, borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm + 2, marginBottom: Spacing.md, gap: Spacing.sm, borderWidth: 1, marginTop: Spacing.md },
    searchInput: { flex: 1, fontSize: FontSize.md },
    selectedRow: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.md, maxHeight: 50 },
    selectedChip: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, marginRight: Spacing.sm, gap: Spacing.xs },
    selectedEmoji: { fontSize: 16 },
    selectedName: { fontSize: FontSize.sm },
    userList: { flex: 1, paddingHorizontal: Spacing.xl },
    userItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1 },
    userInfo: { flex: 1, marginLeft: Spacing.md },
    userName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
    userUsername: { fontSize: FontSize.sm, marginTop: 2 },
    footer: { padding: Spacing.xl, paddingBottom: 40 },
    createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.md, borderRadius: BorderRadius.pill, paddingVertical: Spacing.lg },
    createBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.bold },
});
