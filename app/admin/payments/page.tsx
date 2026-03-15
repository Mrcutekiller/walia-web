import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

interface Transaction {
    id: string;
    user: string;
    plan: string;
    amount: string;
    status: string;
    date: string;
    method: string;
}

export default function AdminPayments() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'payments'), orderBy('date', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setTransactions(snap.docs.map(d => ({
                id: d.id,
                ...d.data(),
                date: d.data().date || (d.data().createdAt?.toDate ? d.data().createdAt.toDate().toLocaleString() : 'N/A')
            } as Transaction)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const filteredTransactions = transactions.filter(tx =>
        tx.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderItem = ({ item }: { item: Transaction }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.idText}>#{item.id.slice(-8)}</Text>
                <View style={[styles.statusBadge, 
                    item.status === 'Completed' || item.status === 'succeeded' ? styles.statusSuccess :
                    item.status === 'Failed' ? styles.statusFailed : styles.statusPending
                ]}>
                    <Text style={[styles.statusText, 
                        item.status === 'Completed' || item.status === 'succeeded' ? styles.textSuccess :
                        item.status === 'Failed' ? styles.textFailed : styles.textPending
                    ]}>{item.status}</Text>
                </View>
            </View>
            
            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Ionicons name="person" size={14} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.userName}>{item.user}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="card" size={14} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.planName}>{item.plan} • {item.amount}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="time" size={14} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.dateText}>{item.date}</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <Text style={styles.methodText}>{item.method.toUpperCase()}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Financial Records</Text>
                <Text style={styles.subtitle}>Verify transaction logs and monitor subscription revenue.</Text>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color="rgba(255,255,255,0.2)" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by User or Transaction ID..."
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>

            {loading ? (
                <View style={styles.centerBox}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                </View>
            ) : (
                <FlatList
                    data={filteredTransactions}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.centerBox}>
                            <Text style={styles.emptyText}>No transactions found</Text>
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
        color: 'rgba(255, 255, 255, 0.3)',
        marginTop: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        paddingHorizontal: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        height: 50,
        color: 'white',
        fontSize: 14,
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
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
    },
    planName: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
    },
    dateText: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.2)',
    },
    cardFooter: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    methodText: {
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(255, 255, 255, 0.3)',
        letterSpacing: 1,
    },
    centerBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        color: 'rgba(255, 255, 255, 0.2)',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
