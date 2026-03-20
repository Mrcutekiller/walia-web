import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { collection, query, limit, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Avatar } from '@/components/ui/Avatar';
import { FontSize, FontWeight, Spacing, BorderRadius } from '@/constants/theme';

interface AppUser { id: string; name: string; email: string; plan: string; isSuspended?: boolean; isAdmin?: boolean; photoURL?: string; }

export default function AdminUsersScreen() {
    const { colors, isDark } = useTheme();
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'users'), limit(50));
            const snap = await getDocs(q);
            let results = snap.docs.map(d => ({ id: d.id, ...d.data() } as AppUser));
            if (search) {
                const s = search.toLowerCase();
                results = results.filter(u => u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s));
            }
            setUsers(results);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleAction = async (userId: string, action: 'pro' | 'tokens' | 'suspend' | 'unsuspend') => {
        setProcessingId(userId);
        try {
            const userRef = doc(db, 'users', userId);
            if (action === 'pro') {
                await updateDoc(userRef, { plan: 'pro' });
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: 'pro' } : u));
                Alert.alert('Success', 'User upgraded to Pro.');
            } else if (action === 'tokens') {
                Alert.prompt('Add Tokens', 'Enter amount:', async (amount) => {
                    if (!amount || isNaN(parseInt(amount))) return;
                    await updateDoc(userRef, { tokensUsed: increment(-parseInt(amount)) });
                    Alert.alert('Success', `${amount} tokens granted.`);
                });
            } else if (action === 'suspend') {
                await updateDoc(userRef, { isSuspended: true });
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: true } : u));
            } else if (action === 'unsuspend') {
                await updateDoc(userRef, { isSuspended: false });
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: false } : u));
            }
        } catch (error) {
            Alert.alert('Error', 'Action failed');
        } finally {
            setProcessingId(null);
        }
    };

    const renderItem = ({ item }: { item: AppUser }) => (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
            <View style={styles.cardHeader}>
                <Avatar emoji={item.photoURL || '👤'} size={40} />
                <View style={styles.userInfo}>
                    <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.email, { color: colors.textSecondary }]}>{item.email}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: item.plan === 'pro' ? '#F59E0B20' : colors.surfaceAlt }]}>
                    <Text style={[styles.badgeText, { color: item.plan === 'pro' ? '#F59E0B' : colors.textTertiary }]}>{item.plan || 'free'}</Text>
                </View>
            </View>
            <View style={styles.actionsBox}>
                {!item.isSuspended ? (
                    <>
                        {item.plan !== 'pro' && (
                            <TouchableOpacity onPress={() => handleAction(item.id, 'pro')} disabled={processingId === item.id} style={[styles.actionBtn, { backgroundColor: '#F59E0B20' }]}>
                                <Ionicons name="star" size={16} color="#F59E0B" />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={() => handleAction(item.id, 'tokens')} disabled={processingId === item.id} style={[styles.actionBtn, { backgroundColor: '#3B82F620' }]}>
                            <Ionicons name="cash" size={16} color="#3B82F6" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleAction(item.id, 'suspend')} disabled={processingId === item.id} style={[styles.actionBtn, { backgroundColor: '#EF444420' }]}>
                            <Ionicons name="ban" size={16} color="#EF4444" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity onPress={() => handleAction(item.id, 'unsuspend')} disabled={processingId === item.id} style={[styles.actionTextBtn, { backgroundColor: '#10B98120' }]}>
                        <Text style={{ color: '#10B981', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' }}>Unsuspend</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.divider }]}
                    placeholder="Search users..."
                    placeholderTextColor={colors.textTertiary}
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={fetchUsers}
                />
            </View>
            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    searchBar: { padding: Spacing.lg, paddingBottom: 0, position: 'relative' },
    searchIcon: { position: 'absolute', left: 32, top: 32, zIndex: 1 },
    searchInput: { height: 50, borderRadius: 25, paddingLeft: 44, paddingRight: 20, borderWidth: 1, fontFamily: 'System', fontSize: 14, fontWeight: 'bold' },
    list: { padding: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
    card: { padding: Spacing.lg, borderRadius: 24, borderWidth: 1, gap: Spacing.md },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    userInfo: { flex: 1 },
    name: { fontSize: FontSize.md, fontWeight: FontWeight.heavy },
    email: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
    badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    badgeText: { fontSize: 10, fontWeight: FontWeight.black, textTransform: 'uppercase' },
    actionsBox: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.sm },
    actionBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    actionTextBtn: { paddingHorizontal: 16, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
