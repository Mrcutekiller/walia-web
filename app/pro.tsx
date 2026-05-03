import { PRO_PLAN_XP_COST, useSocial, XP_REWARDS } from '@/store/social';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// ─── Free vs Pro comparison ───────────────────────────────────────────────────
const PLAN_COMPARISON = [
    { label: 'AI Chat Messages / day', free: '20 messages', pro: 'Unlimited', icon: 'chatbubbles-outline' },
    { label: 'Study Plans / Calendar', free: '5 plans', pro: 'Unlimited', icon: 'calendar-outline' },
    { label: 'AI Tool Uses / day', free: '10 uses', pro: 'Unlimited', icon: 'grid-outline' },
    { label: 'Image Uploads / day', free: '5 uploads', pro: 'Unlimited', icon: 'image-outline' },
    { label: 'AI Models Access', free: 'Basic only', pro: 'All 10+ models', icon: 'sparkles-outline' },
    { label: 'Community Posts', free: '3 / day', pro: 'Unlimited', icon: 'people-outline' },
    { label: 'Pro AI Badge', free: false, pro: true, icon: 'shield-checkmark-outline' },
    { label: 'Priority Response Speed', free: false, pro: true, icon: 'flash-outline' },
    { label: 'Ad-Free Experience', free: false, pro: true, icon: 'eye-off-outline' },
];

// ─── Ways to earn ─────────────────────────────────────────────────────────────
const EARN_WAYS = [
    { emoji: '🌟', label: 'Daily login', pts: XP_REWARDS.daily_login },
    { emoji: '🤖', label: 'Chat with AI (per message)', pts: XP_REWARDS.ai_chat },
    { emoji: '📝', label: 'Create a community post', pts: XP_REWARDS.post_created },
    { emoji: '🏷️', label: 'Use #walia in a post (bonus)', pts: XP_REWARDS.hashtag_walia },
    { emoji: '🧠', label: 'Answer quiz correctly', pts: XP_REWARDS.quiz_correct },
    { emoji: '🛠️', label: 'Use a study tool', pts: XP_REWARDS.tool_used },
    { emoji: '💬', label: 'Comment on a post', pts: XP_REWARDS.comment_added },
];

export default function ProScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { xp, isPro, claimProPlan, level } = useSocial();

    const xpNeeded = Math.max(0, PRO_PLAN_XP_COST - xp);
    const progress = Math.min(1, xp / PRO_PLAN_XP_COST);
    const canAfford = xp >= PRO_PLAN_XP_COST;

    const bg = isDark ? colors.background : '#F8FAFC';
    const cardBg = isDark ? colors.surface : '#FFFFFF';

    const handleBuyWithMoney = () => {
        router.push({ pathname: '/payment', params: { callbackUrl: '/(tabs)/profile' } });
    };

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

                {/* ── Hero ── */}
                <LinearGradient
                    colors={isPro ? ['#6366F1', '#8B5CF6', '#A78BFA'] : ['#0F172A', '#1E293B']}
                    style={styles.hero}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                >
                    <SafeAreaView edges={['top']} style={styles.heroSafe}>
                        <View style={styles.heroHeader}>
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={styles.closeBtn}
                            >
                                <Ionicons name="close" size={20} color="rgba(255,255,255,0.8)" />
                            </TouchableOpacity>
                            {isPro && (
                                <View style={styles.proBadge}>
                                    <Ionicons name="shield-checkmark" size={14} color="#FFF" />
                                    <Text style={styles.proBadgeText}>PRO MEMBER</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.heroContent}>
                            <Text style={styles.heroEmoji}>{isPro ? '👑' : '⭐'}</Text>
                            <Text style={styles.heroTitle}>{isPro ? "You're Pro!" : 'Walia Pro'}</Text>
                            <Text style={styles.heroSub}>
                                {isPro
                                    ? 'Enjoy unlimited access to all features'
                                    : 'Earn 10,000 Walia Points to unlock Pro for FREE — or pay $12/mo'}
                            </Text>
                        </View>
                    </SafeAreaView>

                    {/* Decorative */}
                    <View style={styles.heroDecor1} />
                    <View style={styles.heroDecor2} />
                </LinearGradient>

                {/* ── Walia Points Card (if not pro) ── */}
                {!isPro && (
                    <View style={[styles.pointsCard, { backgroundColor: cardBg, borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                        <View style={styles.pointsCardTop}>
                            <View>
                                <Text style={[styles.pointsCardLabel, { color: colors.textSecondary }]}>Your Walia Points</Text>
                                <Text style={[styles.pointsCardVal, { color: '#6366F1' }]}>
                                    {xp.toLocaleString()} <Text style={{ fontSize: 14, fontWeight: '600' }}>/ 10,000</Text>
                                </Text>
                            </View>
                            <View style={[styles.levelChip, { backgroundColor: '#6366F115' }]}>
                                <Text style={styles.levelChipText}>Lv.{level}</Text>
                            </View>
                        </View>

                        {/* Progress bar */}
                        <View style={[styles.progressBg, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                            <LinearGradient
                                colors={['#6366F1', '#8B5CF6']}
                                style={[styles.progressFill, { width: `${progress * 100}%` as any }]}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            />
                        </View>
                        <Text style={[styles.progressLabel, { color: colors.textTertiary }]}>
                            {canAfford
                                ? '🎉 You can unlock Pro right now!'
                                : `${xpNeeded.toLocaleString()} more Walia Points needed`}
                        </Text>

                        {/* Ways to earn */}
                        <View style={[styles.earnSection, { borderTopColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                            <Text style={[styles.earnTitle, { color: colors.text }]}>How to earn Walia Points</Text>
                            {EARN_WAYS.map((item, i) => (
                                <View key={i} style={styles.earnRow}>
                                    <Text style={styles.earnEmoji}>{item.emoji}</Text>
                                    <Text style={[styles.earnLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                                    <View style={styles.earnPtsBadge}>
                                        <Text style={styles.earnPtsText}>+{item.pts} pts</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* ── Free vs Pro Comparison ── */}
                <View style={styles.comparisonSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Free vs Pro</Text>

                    {/* Column headers */}
                    <View style={styles.comparisonHeader}>
                        <View style={styles.comparisonCol} />
                        <View style={[styles.comparisonPlanHeader, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                            <Text style={[styles.planHeaderText, { color: colors.textSecondary }]}>Free</Text>
                        </View>
                        <LinearGradient
                            colors={['#6366F1', '#8B5CF6']}
                            style={styles.comparisonPlanHeader}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        >
                            <Text style={[styles.planHeaderText, { color: '#FFF' }]}>Pro ⭐</Text>
                        </LinearGradient>
                    </View>

                    <View style={[styles.comparisonTable, { backgroundColor: cardBg, borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                        {PLAN_COMPARISON.map((row, i) => (
                            <View key={i} style={[
                                styles.comparisonRow,
                                { borderBottomColor: isDark ? '#1E293B' : '#F8FAFC' },
                                i < PLAN_COMPARISON.length - 1 && { borderBottomWidth: 1 }
                            ]}>
                                <View style={styles.comparisonFeature}>
                                    <Ionicons name={row.icon as any} size={15} color={colors.textTertiary} />
                                    <Text style={[styles.comparisonFeatureText, { color: colors.textSecondary }]}>
                                        {row.label}
                                    </Text>
                                </View>
                                <View style={styles.comparisonCell}>
                                    {typeof row.free === 'boolean' ? (
                                        <Ionicons
                                            name={row.free ? 'checkmark-circle' : 'close-circle'}
                                            size={18}
                                            color={row.free ? '#10B981' : '#94A3B8'}
                                        />
                                    ) : (
                                        <Text style={[styles.comparisonCellText, { color: colors.textTertiary }]}>
                                            {row.free}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.comparisonCell}>
                                    {typeof row.pro === 'boolean' ? (
                                        <Ionicons
                                            name={row.pro ? 'checkmark-circle' : 'close-circle'}
                                            size={18}
                                            color={row.pro ? '#6366F1' : '#94A3B8'}
                                        />
                                    ) : (
                                        <Text style={[styles.comparisonCellText, { color: '#6366F1', fontWeight: '800' }]}>
                                            {row.pro}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* ── CTAs ── */}
            {!isPro && (
                <View style={[styles.ctaBar, { backgroundColor: cardBg, borderTopColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                    <TouchableOpacity
                        onPress={claimProPlan}
                        activeOpacity={0.9}
                        style={[styles.primaryCta, { opacity: canAfford ? 1 : 0.6 }]}
                    >
                        <LinearGradient
                            colors={canAfford ? ['#6366F1', '#4F46E5'] : ['#94A3B8', '#64748B']}
                            style={styles.primaryCtaGradient}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.primaryCtaIcon}>⭐</Text>
                            <Text style={styles.primaryCtaText}>
                                {canAfford
                                    ? 'Unlock Pro with 10,000 Walia Points!'
                                    : `${xpNeeded.toLocaleString()} more points needed`}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.secondaryCta, { borderColor: isDark ? '#334155' : '#E2E8F0' }]}
                        onPress={handleBuyWithMoney}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.secondaryCtaText, { color: colors.textSecondary }]}>
                            Or subscribe for $12 / month
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Hero
    hero: { overflow: 'hidden', position: 'relative' },
    heroSafe: { paddingHorizontal: 22, paddingBottom: 32 },
    heroHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        marginBottom: 28,
    },
    closeBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    proBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    proBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
    heroContent: { alignItems: 'center', gap: 8 },
    heroEmoji: { fontSize: 56, marginBottom: 4 },
    heroTitle: { fontSize: 34, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
    heroSub: { fontSize: 15, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 22, maxWidth: 300 },
    heroDecor1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.04)', right: -60, top: -60 },
    heroDecor2: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.06)', left: -30, bottom: -30 },

    // Points card
    pointsCard: {
        marginHorizontal: 20,
        marginTop: -24,
        borderRadius: 28,
        padding: 22,
        borderWidth: 1,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 8,
        marginBottom: 8,
    },
    pointsCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
    pointsCardLabel: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
    pointsCardVal: { fontSize: 32, fontWeight: '900' },
    levelChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    levelChipText: { color: '#6366F1', fontSize: 13, fontWeight: '900' },
    progressBg: { height: 10, borderRadius: 6, overflow: 'hidden', marginBottom: 10 },
    progressFill: { height: '100%', borderRadius: 6 },
    progressLabel: { fontSize: 12, fontWeight: '600', textAlign: 'center', marginBottom: 4 },

    // Earn section
    earnSection: { marginTop: 20, paddingTop: 20, borderTopWidth: 1 },
    earnTitle: { fontSize: 16, fontWeight: '900', marginBottom: 14, letterSpacing: -0.2 },
    earnRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
    earnEmoji: { fontSize: 20, width: 28 },
    earnLabel: { flex: 1, fontSize: 14, fontWeight: '500' },
    earnPtsBadge: { backgroundColor: '#6366F115', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
    earnPtsText: { color: '#6366F1', fontSize: 12, fontWeight: '900' },

    // Comparison
    comparisonSection: { padding: 20, marginTop: 16 },
    sectionTitle: { fontSize: 22, fontWeight: '900', marginBottom: 18, letterSpacing: -0.3 },
    comparisonHeader: { flexDirection: 'row', marginBottom: 8, gap: 8 },
    comparisonCol: { flex: 2.5 },
    comparisonPlanHeader: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 14,
    },
    planHeaderText: { fontSize: 13, fontWeight: '900' },
    comparisonTable: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    comparisonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 8 },
    comparisonFeature: { flex: 2.5, flexDirection: 'row', alignItems: 'center', gap: 8 },
    comparisonFeatureText: { fontSize: 12, fontWeight: '600', flex: 1 },
    comparisonCell: { flex: 1, alignItems: 'center' },
    comparisonCellText: { fontSize: 12, fontWeight: '700', textAlign: 'center' },

    // CTAs
    ctaBar: {
        padding: 20,
        paddingBottom: 36,
        borderTopWidth: 1,
        gap: 12,
    },
    primaryCta: {},
    primaryCtaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 18,
        borderRadius: 20,
    },
    primaryCtaIcon: { fontSize: 18 },
    primaryCtaText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
    secondaryCta: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1.5,
    },
    secondaryCtaText: { fontSize: 14, fontWeight: '700' },
});
