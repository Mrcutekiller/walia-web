import { Avatar } from '@/components/ui/Avatar';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { auth, db } from '@/services/firebase';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    addDoc,
    collection,
    getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    where
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewChatScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const q = query(collection(db, 'users'));
            const snap = await getDocs(q);
            const data = snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(u => u.id !== auth.currentUser?.uid);
            setUsers(data);
            setLoading(false);
        };
        fetchUsers();
    }, []);

    const startChat = async (targetUser: any) => {
        if (!auth.currentUser) return;

        // Check if private chat already exists
        const q = query(
            collection(db, 'chats'),
            where('type', '==', 'private'),
            where('participants', 'array-contains', auth.currentUser.uid)
        );

        const snap = await getDocs(q);
        const existing = snap.docs.find(d => {
            const p = d.data().participants;
            return p.includes(targetUser.id);
        });

        if (existing) {
            router.replace(`/chat/${existing.id}` as any);
        } else {
            const newChat = await addDoc(collection(db, 'chats'), {
                type: 'private',
                participants: [auth.currentUser.uid, targetUser.id],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                lastMessage: 'Started a new conversation',
                name: targetUser.name, // for display in chat list
                avatar: targetUser.photoURL,
            });
            router.replace(`/chat/${newChat.id}` as any);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(search.toLowerCase()) || 
        u.username?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.divider }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>New Message</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color={colors.textTertiary} />
                <TextInput
                    placeholder="Search users..."
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor={colors.textTertiary}
                    style={[styles.input, { color: colors.text }]}
                    autoFocus
                />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.userItem} onPress={() => startChat(item)}>
                            <Avatar emoji={item.photoURL || '👤'} size={50} />
                            <View style={styles.userInfo}>
                                <Text style={[styles.userName, { color: colors.text }]}>{item.name}</Text>
                                <Text style={[styles.userTag, { color: colors.textSecondary }]}>@{item.username}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => !search ? null : (
                        <Text style={styles.emptyText}>No users found matching "{search}"</Text>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderBottomWidth: 1 },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: FontSize.md, fontWeight: FontWeight.heavy },
    searchBar: { flexDirection: 'row', alignItems: 'center', margin: Spacing.xl, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.03)' },
    input: { flex: 1, marginLeft: 10, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    list: { paddingHorizontal: Spacing.xl },
    userItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md },
    userInfo: { flex: 1, marginLeft: Spacing.md },
    userName: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
    userTag: { fontSize: FontSize.xs, marginTop: 2 },
    emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 40, fontSize: FontSize.sm },
});
