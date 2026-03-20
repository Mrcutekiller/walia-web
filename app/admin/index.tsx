import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';

export default function AdminOverviewScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalUsers: 0, proUsers: 0, revenueEtb: 0, revenueUsd: 0, totalPosts: 0, totalHashtags: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const snap = await getDoc(doc(db, 'platform_stats', 'main'));
                if (snap.exists()) setStats(snap.data() as any);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const SECTIONS = [
        { id: 'users', title: 'Manage Users', icon: 'people', color: '#3B82F6', href: '/admin/users' },
        { id: 'payments', title: 'Approve Payments', icon: 'card', color: '#10B981', href: '/admin/payments' },
        { id: 'notifications', title: 'Broadcast Notifications', icon: 'megaphone', color: '#8B5CF6', href: '/admin/notifications' },
        { id: 'support', title: 'Support Inbox', icon: 'chatbubbles', color: '#F59E0B', href: '/admin/support' },
    ];

    if (loading) return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator size="large" color={colors.primary} /></View>;

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.scroll}>
            <Text style={[styles.title, { color: colors.text }]}>Platform Stats</Text>
            
            <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
                    <Text style={[styles.statTitle, { color: colors.textSecondary }]}>Total Users</Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalUsers}</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
                    <Text style={[styles.statTitle, { color: colors.primary }]}>Pro Users</Text>
                    <Text style={[styles.statValue, { color: colors.primary }]}>{stats.proUsers}</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
                    <Text style={[styles.statTitle, { color: colors.textSecondary }]}>Revenue (ETB)</Text>
                    <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.revenueEtb} Br</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
                    <Text style={[styles.statTitle, { color: colors.textSecondary }]}>Total Posts</Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalPosts}</Text>
                </View>
            </View>

            <Text style={[styles.title, { color: colors.text, marginTop: Spacing.xxl }]}>Admin Actions</Text>
            <View style={styles.actionsList}>
                {SECTIONS.map((sec) => (
                    <TouchableOpacity 
                        key={sec.id} 
                        style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.divider }]}
                        onPress={() => router.push(sec.href as any)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconBox, { backgroundColor: sec.color + '20' }]}>
                            <Ionicons name={sec.icon as any} size={24} color={sec.color} />
                        </View>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>{sec.title}</Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: Spacing.xl, paddingBottom: 100 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: FontSize.lg, fontWeight: FontWeight.heavy, textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.md },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
    statCard: { width: '47%', padding: Spacing.lg, borderRadius: 24, borderWidth: 1 },
    statTitle: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    statValue: { fontSize: FontSize.2xl, fontWeight: '900' },
    actionsList: { gap: Spacing.md },
    actionBtn: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderRadius: 24, borderWidth: 1, gap: Spacing.md },
    iconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    actionTitle: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.heavy },
});
