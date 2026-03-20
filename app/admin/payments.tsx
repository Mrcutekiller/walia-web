import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';

interface Payment { id: string; userId: string; amount: number; currency: 'ETB' | 'USD'; status: string; receiptUrl?: string; createdAt: any; }

export default function AdminPaymentsScreen() {
    const { colors, isDark } = useTheme();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Payment)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleAction = async (paymentId: string, action: 'approve' | 'reject', userId: string, amount: number) => {
        Alert.alert(
            action === 'approve' ? 'Approve Payment?' : 'Reject Payment?',
            'Are you sure you want to proceed?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        setProcessingId(paymentId);
                        try {
                            const status = action === 'approve' ? 'approved' : 'rejected';
                            await updateDoc(doc(db, 'payments', paymentId), { status });
                            if (status === 'approved') {
                                // Defaulting 30 days
                                const expiryDate = new Date();
                                expiryDate.setDate(expiryDate.getDate() + 30);
                                await updateDoc(doc(db, 'users', userId), { plan: 'pro', planExpiresAt: expiryDate.toISOString() });
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to process payment');
                        } finally {
                            setProcessingId(null);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: Payment }) => (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.amount, { color: colors.text }]}>
                        {item.amount.toLocaleString()} {item.currency}
                    </Text>
                    <Text style={[styles.userId, { color: colors.textTertiary }]}>{item.userId.substring(0, 10)}...</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: item.status === 'pending' ? '#F59E0B20' : item.status === 'approved' ? '#10B98120' : '#EF444420' }]}>
                    <Text style={[styles.badgeText, { color: item.status === 'pending' ? '#F59E0B' : item.status === 'approved' ? '#10B981' : '#EF4444' }]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            {item.receiptUrl && (
                <TouchableOpacity onPress={() => Linking.openURL(item.receiptUrl!)} style={styles.receiptRow}>
                    <Ionicons name="document-attach" size={16} color="#3B82F6" />
                    <Text style={styles.receiptText}>View Receipt</Text>
                </TouchableOpacity>
            )}

            {item.status === 'pending' && (
                <View style={styles.actionsBox}>
                    <TouchableOpacity onPress={() => handleAction(item.id, 'reject', item.userId, item.amount)} disabled={!!processingId} style={[styles.actionBtn, { backgroundColor: '#EF444420' }]}>
                        <Text style={[styles.actionText, { color: '#EF4444' }]}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleAction(item.id, 'approve', item.userId, item.amount)} disabled={!!processingId} style={[styles.actionBtn, { backgroundColor: '#10B98120', flex: 2 }]}>
                        {processingId === item.id ? <ActivityIndicator size="small" color="#10B981" /> : <Text style={[styles.actionText, { color: '#10B981' }]}>Approve to Pro</Text>}
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
            ) : (
                <FlatList
                    data={payments}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={[styles.empty, { color: colors.textTertiary }]}>No payments found.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    list: { padding: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
    empty: { textAlign: 'center', marginTop: 40, fontFamily: 'System', fontWeight: 'bold' },
    card: { padding: Spacing.lg, borderRadius: 24, borderWidth: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    amount: { fontSize: FontSize.lg, fontWeight: FontWeight.black },
    userId: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, marginTop: 4, fontFamily: 'monospace' },
    badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    badgeText: { fontSize: 10, fontWeight: FontWeight.black, textTransform: 'uppercase' },
    receiptRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.md, paddingVertical: 4 },
    receiptText: { color: '#3B82F6', fontSize: 12, fontWeight: '900' },
    actionsBox: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg },
    actionBtn: { flex: 1, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    actionText: { fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
});
