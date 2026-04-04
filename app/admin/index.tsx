import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, Alert } from 'react-native';
import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FontSize, FontWeight, Spacing, BorderRadius } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AdminOverviewScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [stats, setStats] = useState({ 
        totalUsers: 0, 
        proUsers: 0, 
        freeUsers: 0,
        revenueEtb: 0, 
        revenueUsd: 0, 
        totalPosts: 0, 
        totalHashtags: 0 
    });

    const loadStats = async () => {
        setLoading(true);
        try {
            const snap = await getDoc(doc(db, 'platform_stats', 'main'));
            if (snap.exists()) setStats(snap.data() as any);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const syncStats = async () => {
        if (syncing) return;
        setSyncing(true);
        try {
            // Replicate Website calculation logic
            const [usersSnap, postsSnap, paymentsSnap] = await Promise.all([
                getDocs(collection(db, 'users')),
                getDocs(collection(db, 'posts')),
                getDocs(collection(db, 'payments'))
            ]);

            let proUsers = 0;
            let freeUsers = 0;
            usersSnap.forEach(d => {
                if (d.data().plan === 'pro') proUsers++;
                else freeUsers++;
            });

            let totalTags = 0;
            postsSnap.forEach(d => {
                if (d.data().tags) totalTags += d.data().tags.length;
            });

            let revEtb = 0;
            let revUsd = 0;
            paymentsSnap.forEach(d => {
                const data = d.data();
                if (data.status === 'approved') {
                    if (data.currency === 'ETB') revEtb += data.amount;
                    else revUsd += data.amount;
                }
            });

            const newStats = {
                totalUsers: usersSnap.size,
                proUsers,
                freeUsers,
                revenueEtb: revEtb,
                revenueUsd: revUsd,
                totalPosts: postsSnap.size,
                totalHashtags: totalTags,
                lastUpdated: new Date().toISOString()
            };

            await setDoc(doc(db, 'platform_stats', 'main'), newStats);
            setStats(newStats as any);
            Alert.alert('Success', 'Platform statistics synchronized.');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const SECTIONS = [
        { id: 'users', title: 'Manage Users', icon: 'people', color: '#3B82F6', href: '/admin/users' },
        { id: 'payments', title: 'Approve Payments', icon: 'card', color: '#10B981', href: '/admin/payments' },
        { id: 'notifications', title: 'Broadcast Notifications', icon: 'megaphone', color: '#8B5CF6', href: '/admin/notifications' },
        { id: 'support', title: 'Support Inbox', icon: 'chatbubbles', color: '#F59E0B', href: '/admin/support' },
        { id: 'settings', title: 'Platform Settings', icon: 'settings', color: '#6B7280', href: '/admin/settings' },
    ];

    const STAT_CARDS = [
        { label: 'Total Users', value: stats.totalUsers, icon: 'people', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
        { label: 'Pro Members', value: stats.proUsers, icon: 'star', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
        { label: 'Revenue (ETB)', value: `${stats.revenueEtb.toLocaleString()} Br`, icon: 'cash', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
        { label: 'Total Posts', value: stats.totalPosts, icon: 'document-text', color: '#6366F1', bg: 'rgba(99, 102, 241, 0.1)' },
    ];

    if (loading) return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator size="large" color={colors.primary} /></View>;

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.scroll}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: colors.text }]}>Business Overview</Text>
                    <Text style={[styles.subtitle, { color: colors.textTertiary }]}>Real-time platform metrics and KPIs.</Text>
                </View>
                <TouchableOpacity 
                    onPress={syncStats} 
                    disabled={syncing}
                    style={[styles.syncBtn, { backgroundColor: colors.text }]}
                >
                    {syncing ? <ActivityIndicator size="small" color={colors.textInverse} /> : <Ionicons name="refresh" size={16} color={colors.textInverse} />}
                    <Text style={[styles.syncBtnText, { color: colors.textInverse }]}>{syncing ? 'Syncing...' : 'Sync Data'}</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.statsGrid}>
                {STAT_CARDS.map((card, i) => (
                    <View key={i} style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.statHeader}>
                            <View style={[styles.statIconBox, { backgroundColor: card.bg }]}>
                                <Ionicons name={card.icon as any} size={18} color={card.color} />
                            </View>
                            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{card.label}</Text>
                        </View>
                        <Text style={[styles.statValue, { color: colors.text }]}>{card.value}</Text>
                        
                        {/* Subtle background glow effect */}
                        <View style={[styles.glow, { backgroundColor: card.color, opacity: isDark ? 0.05 : 0.02 }]} />
                    </View>
                ))}
            </View>

            <Text style={[styles.sectionHeader, { color: colors.text }]}>ADMIN ACTIONS</Text>
            <View style={styles.actionsList}>
                {SECTIONS.map((sec) => (
                    <TouchableOpacity 
                        key={sec.id} 
                        style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={() => router.push(sec.href as any)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconBox, { backgroundColor: sec.color + '20' }]}>
                            <Ionicons name={sec.icon as any} size={24} color={sec.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.actionTitle, { color: colors.text }]}>{sec.title}</Text>
                            <Text style={[styles.actionDesc, { color: colors.textTertiary }]}>Manage platform {sec.id}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: Spacing.xl, paddingBottom: 120 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.xl },
    title: { fontSize: 24, fontWeight: FontWeight.black, letterSpacing: -1 },
    subtitle: { fontSize: 13, fontWeight: FontWeight.bold, marginTop: 4 },
    syncBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14 },
    syncBtnText: { fontSize: 11, fontWeight: FontWeight.black, textTransform: 'uppercase', letterSpacing: 1 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xxl },
    statCard: { width: (width - Spacing.xl * 2 - Spacing.md) / 2, padding: 20, borderRadius: 32, borderWidth: 1, overflow: 'hidden' },
    statHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
    statIconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    statLabel: { fontSize: 10, fontWeight: FontWeight.black, textTransform: 'uppercase', letterSpacing: 1, flex: 1 },
    statValue: { fontSize: 24, fontWeight: FontWeight.black, letterSpacing: -0.5 },
    glow: { position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, borderRadius: 40 },
    sectionHeader: { fontSize: 12, fontWeight: FontWeight.black, letterSpacing: 2, marginBottom: Spacing.lg },
    actionsList: { gap: Spacing.md },
    actionBtn: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderRadius: 28, borderWidth: 1, gap: Spacing.md },
    iconBox: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    actionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.black },
    actionDesc: { fontSize: FontSize.xs, marginTop: 2 },
});
