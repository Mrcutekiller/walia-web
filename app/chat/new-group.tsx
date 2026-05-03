import { Avatar } from '@/components/ui/Avatar';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewGroupScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [groupName, setGroupName] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock users since we don't have a backend
        setUsers([
            { id: 'u1', name: 'Alex Rivera', username: 'alexr', photoURL: '👦' },
            { id: 'u2', name: 'Sarah Chen', username: 'sarahc', photoURL: '👩' },
            { id: 'u3', name: 'Mike Johnson', username: 'mikej', photoURL: '👨' },
            { id: 'u4', name: 'Emma Wilson', username: 'emmaw', photoURL: '👱‍♀️' },
        ]);
        setLoading(false);
    }, []);

    const toggleUser = (userId: string) => {
        const next = new Set(selectedUsers);
        if (next.has(userId)) next.delete(userId);
        else next.add(userId);
        setSelectedUsers(next);
    };

    const createGroup = async () => {
        if (!user || selectedUsers.size === 0 || !groupName.trim()) return;

        const participants = [user.id, ...Array.from(selectedUsers)];
        const newChatId = Date.now().toString();

        const newChat = {
            id: newChatId,
            type: 'group',
            participants,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastMessage: 'Group created',
            name: groupName.trim(),
            avatar: '👥',
        };
        
        try {
            // Save to local storage for persistence
            const existingData = await AsyncStorage.getItem(`walia_chats_${user.id}`);
            const existingChats = existingData ? JSON.parse(existingData) : [];
            await AsyncStorage.setItem(`walia_chats_${user.id}`, JSON.stringify([newChat, ...existingChats]));
        } catch(e) {
            console.error(e);
        }
        
        router.replace(`/chat/group/${newChatId}` as any);
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>New Group</Text>
                <TouchableOpacity 
                    onPress={createGroup}
                    disabled={selectedUsers.size === 0 || !groupName.trim()}
                    style={[styles.createBtn, (selectedUsers.size === 0 || !groupName.trim()) && { opacity: 0.5 }]}
                >
                    <Text style={styles.createBtnText}>Create</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.nameContainer}>
                <TextInput
                    placeholder="Group Name"
                    value={groupName}
                    onChangeText={setGroupName}
                    placeholderTextColor={colors.textTertiary}
                    style={[styles.nameInput, { color: colors.text, borderBottomColor: colors.divider }]}
                />
            </View>

            <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color={colors.textTertiary} />
                <TextInput
                    placeholder="Search users to add..."
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor={colors.textTertiary}
                    style={[styles.input, { color: colors.text }]}
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
                    renderItem={({ item }) => {
                        const isSelected = selectedUsers.has(item.id);
                        return (
                            <TouchableOpacity style={styles.userItem} onPress={() => toggleUser(item.id)}>
                                <Avatar emoji={item.photoURL || '👤'} size={50} />
                                <View style={styles.userInfo}>
                                    <Text style={[styles.userName, { color: colors.text }]}>{item.name}</Text>
                                    <Text style={[styles.userTag, { color: colors.textSecondary }]}>@{item.username}</Text>
                                </View>
                                <Ionicons 
                                    name={isSelected ? "checkmark-circle" : "ellipse-outline"} 
                                    size={24} 
                                    color={isSelected ? '#6366F1' : colors.textTertiary} 
                                />
                            </TouchableOpacity>
                        );
                    }}
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
    createBtn: { backgroundColor: '#6366F1', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    createBtnText: { color: '#FFF', fontWeight: 'bold' },
    nameContainer: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
    nameInput: { fontSize: FontSize.lg, fontWeight: 'bold', paddingVertical: 10, borderBottomWidth: 1 },
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
