import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, orderBy, query, updateDoc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';

interface PaymentRequest {
    id: string;
    userId: string;
    userEmail: string;
    userName: string;
    plan: string;
    amount: number;
    currency: string;
    method: string;
    proofURL: string;
    status: 'processing' | 'approved' | 'rejected';
    createdAt: any;
}

export default function AdminPayments() {
    const [requests, setRequests] = useState<PaymentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'processing' | 'approved' | 'rejected'>('processing');

    useEffect(() => {
        const q = query(collection(db, 'payment_requests'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setRequests(snap.docs.map(d => ({
                id: d.id,
                ...d.data()
            } as PaymentRequest)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleAction = async (request: PaymentRequest, status: 'approved' | 'rejected') => {
        try {
            await updateDoc(doc(db, 'payment_requests', request.id), { status });

            if (status === 'approved') {
                await updateDoc(doc(db, 'users', request.userId), { 
                    plan: 'pro',
                    proType: request.plan,
                    planActivatedAt: serverTimestamp()
                });
            }

            const message = status === 'approved' 
                ? `Your payment has been approved! You are now on the Pro plan. Enjoy unlimited access to all Walia AI features.`
                : `Your payment was rejected. Please ensure your proof of payment is clear and matches the requested amount.`;
            
            await addDoc(collection(db, 'notifications'), {
                userId: request.userId,
                title: status === 'approved' ? 'Payment Approved ✅' : 'Payment Rejected ❌',
                message,
                type: status === 'approved' ? 'system' : 'message',
                read: false,
                createdAt: serverTimestamp()
            });

            Alert.alert('Success', `Request ${status} successfully.`);
        } catch (error) {
            console.error(`Error processing ${status}:`, error);
            Alert.alert('Error', `Failed to ${status} request.`);
        }
    };

    const deleteRequest = (id: string) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this payment record?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: async () => {
                    try {
                        await deleteDoc(doc(db, 'payment_requests', id));
                    } catch (error) {
                        console.error('Error deleting request:', error);
                    }
                }}
            ]
        );
    };

    const filteredRequests = requests.filter(r => filter === 'all' ? true : r.status === filter);

    const renderItem = ({ item }: { item: PaymentRequest }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.idText}>#{item.id.slice(-8)}</Text>
                <View style={[styles.statusBadge, 
                    item.status === 'approved' ? styles.statusSuccess :
                    item.status === 'rejected' ? styles.statusFailed : styles.statusPending
                ]}>
                    <Text style={[styles.statusText, 
                        item.status === 'approved' ? styles.textSuccess :
                        item.status === 'rejected' ? styles.textFailed : styles.textPending
                    ]}>{item.status}</Text>
                </View>
            </View>
            
            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Ionicons name="person" size={14} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.userName}>{item.userName}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="mail" size={14} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.userEmail}>{item.userEmail}</Text>
                </View>
                <View style={[styles.infoRow, { marginTop: 8 }]}>
                    <View style={styles.badgePair}>
                        <View style={styles.miniBadge}>
                            <Text style={styles.miniBadgeText}>{item.plan.toUpperCase()}</Text>
                        </View>
                        <View style={styles.miniBadge}>
                            <Text style={styles.miniBadgeText}>{item.amount} {item.currency}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.footerInfo}>
                    <Ionicons name="card" size={12} color="rgba(255,255,255,0.3)" />
                    <Text style={styles.methodText}>{item.method.toUpperCase()}</Text>
                </View>
                {item.proofURL && (
                    <TouchableOpacity 
                        style={styles.viewProofBtn}
                        onPress={() => Linking.openURL(item.proofURL)}
                    >
                        <Text style={styles.viewProofText}>View Proof</Text>
                        <Ionicons name="external-link" size={12} color="#4F46E5" />
                    </TouchableOpacity>
                )}
            </View>

            {item.status === 'processing' && (
                <View style={styles.actionRow}>
                    <TouchableOpacity 
                        style={[styles.actionBtn, styles.approveBtn]}
                        onPress={() => handleAction(item, 'approved')}
                    >
                        <Ionicons name="checkmark" size={16} color="white" />
                        <Text style={styles.actionBtnText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.actionBtn, styles.rejectBtn]}
                        onPress={() => handleAction(item, 'rejected')}
                    >
                        <Ionicons name="close" size={16} color="#EF4444" />
                        <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Reject</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity 
                style={styles.deleteBtn}
                onPress={() => deleteRequest(item.id)}
            >
                <Ionicons name="trash" size={16} color="rgba(255,255,255,0.2)" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Payment Verification</Text>
                <Text style={styles.subtitle}>Review and approve manual payment proofs from users.</Text>
            </View>

            <View style={styles.filterContainer}>
                {(['processing', 'approved', 'rejected', 'all'] as const).map((f) => (
                    <TouchableOpacity
                        key={f}
                        onPress={() => setFilter(f)}
                        style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
                    >
                        <Text style={[styles.filterBtnText, filter === f && styles.filterBtnTextActive]}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <View style={styles.centerBox}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                </View>
            ) : (
                <FlatList
                    data={filteredRequests}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.centerBox}>
                            <Ionicons name="time" size={48} color="rgba(255,255,255,0.05)" />
                            <Text style={styles.emptyText}>No {filter !== 'all' ? filter : ''} requests found.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0B',
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: 'white',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.4)',
        marginTop: 4,
    },
    filterContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 4,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    filterBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    filterBtnActive: {
        backgroundColor: 'white',
    },
    filterBtnText: {
        fontSize: 11,
        fontWeight: '800',
        color: 'rgba(255, 255, 255, 0.4)',
        textTransform: 'capitalize',
    },
    filterBtnTextActive: {
        color: 'black',
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#141415',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        position: 'relative',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    idText: {
        fontSize: 12,
        fontWeight: '900',
        color: 'rgba(255, 255, 255, 0.6)',
        fontFamily: 'monospace',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusSuccess: { backgroundColor: 'rgba(34, 197, 94, 0.1)' },
    statusFailed: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
    statusPending: { backgroundColor: 'rgba(249, 115, 22, 0.1)' },
    statusText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    textSuccess: { color: '#22C55E' },
    textFailed: { color: '#EF4444' },
    textPending: { color: '#F97316' },
    cardBody: {
        gap: 6,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    userName: {
        fontSize: 15,
        fontWeight: '900',
        color: 'white',
    },
    userEmail: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
    },
    badgePair: {
        flexDirection: 'row',
        gap: 8,
    },
    miniBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    miniBadgeText: {
        fontSize: 9,
        fontWeight: '900',
        color: 'rgba(255, 255, 255, 0.6)',
    },
    cardFooter: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    methodText: {
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(255, 255, 255, 0.3)',
        letterSpacing: 1,
    },
    viewProofBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewProofText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#4F46E5',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    actionBtn: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    approveBtn: {
        backgroundColor: '#10B981',
    },
    rejectBtn: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    actionBtnText: {
        fontSize: 12,
        fontWeight: '900',
        color: 'white',
    },
    deleteBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        opacity: 0.5,
    },
    centerBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },
    emptyText: {
        color: 'rgba(255, 255, 255, 0.2)',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 16,
    },
});
