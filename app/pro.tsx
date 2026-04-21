import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { PRO_PLAN_XP_COST, useSocial } from '@/store/social';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const PRO_FEATURES = [
    { icon: 'infinite', label: 'Unlimited AI Chats', desc: 'GPT-4, Gemini 2.0 & Claude models', color: '#000000' },
    { icon: 'flash', label: 'Priority AI Speed', desc: 'Instant responses with no queue', color: '#000000' },
    { icon: 'layers', label: '12+ Advanced Tools', desc: 'Unlimited summaries, quizzes & reports', color: '#000000' },
    { icon: 'people', label: 'Exclusive Community', desc: 'Access Pro-only study groups', color: '#000000' },
    { icon: 'shield-checkmark', label: 'Ad-Free Experience', desc: 'Clean, distraction-free learning', color: '#000000' },
    { icon: 'star', label: 'Pro Badge', desc: 'Verified Citizen gold badge', color: '#000000' },
];

export default function ProScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { xp, isPro, claimProPlan, level } = useSocial();

    const xpNeeded = Math.max(0, PRO_PLAN_XP_COST - xp);
    const progress = Math.min(1, xp / PRO_PLAN_XP_COST);
    const canAfford = xp >= PRO_PLAN_XP_COST;

    const handleBuyWithMoney = () => {
        router.push({
            pathname: '/payment',
            params: { callbackUrl: '/(tabs)/profile' }
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
                {/* Hero section */}
                <View style={[styles.hero, { backgroundColor: isDark ? '#000' : '#F9FAFB', borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
                    <SafeAreaView edges={['top']}>
                        <View style={styles.heroHeader}>
                            <TouchableOpacity onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: colors.surfaceAlt }]}>
                                <Ionicons name="close" size={20} color={colors.text} />
                            </TouchableOpacity>
                            {isPro && <View style={[styles.proBadge, { backgroundColor: colors.primary }]}><Text style={styles.proBadgeText}>⭐ PRO</Text></View>}
                        </View>
                    </SafeAreaView>

                    <View style={styles.heroContent}>
                        <View style={[styles.heroIcon, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
                            <Text style={{ fontSize: 48 }}>{isPro ? '👑' : '✨'}</Text>
                        </View>
                        <h1 style={[styles.heroTitle, { color: colors.text }]}>{isPro ? 'You\'re Pro!' : 'Walia Pro'}</h1>
                        <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
                            {isPro
                                ? 'Enjoy all premium features with no limits'
                                : '10,000 XP or $12/mo · Unlock everything'}
                        </Text>
                        <View style={[styles.pricePill, { backgroundColor: colors.surfaceAlt }]}>
                            <Text style={[styles.priceXp, { color: colors.text }]}>10,000 XP</Text>
                            <Text style={[styles.priceSep, { color: colors.textTertiary }]}> or </Text>
                            <Text style={[styles.priceEtb, { color: colors.text }]}>$12 / mo</Text>
                        </View>
                    </View>
                </View>

                {/* XP Progress card (if not pro) */}
                {!isPro && (
                    <View style={[styles.xpCard, { backgroundColor: colors.surface }]}>
                        <View style={styles.xpCardTop}>
                            <View>
                                <Text style={[styles.xpCardLabel, { color: colors.textSecondary }]}>Your XP Balance</Text>
                                <Text style={[styles.xpCardVal, { color: colors.primary }]}>{xp.toLocaleString()} XP</Text>
                            </View>
                            <View style={[styles.levelChip, { backgroundColor: `${colors.primary}20` }]}>
                                <Text style={[styles.levelChipText, { color: colors.primary }]}>Level {level}</Text>
                            </View>
                        </View>
                        <View style={styles.xpBarRow}>
                            <View style={[styles.xpBarBg, { backgroundColor: colors.surfaceAlt }]}>
                                <LinearGradient
                                    colors={['#6C63FF', '#4ECDC4']}
                                    style={[styles.xpBarFill, { width: `${progress * 100}%` as any }]}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                />
                            </View>
                            <Text style={[styles.xpBarLabel, { color: colors.textTertiary }]}>
                                {xp.toLocaleString()} / {PRO_PLAN_XP_COST.toLocaleString()}
                            </Text>
                        </View>
                        {xpNeeded > 0 && (
                            <Text style={[styles.xpNeededText, { color: colors.textSecondary }]}>
                                🎯 You need <Text style={{ color: colors.primary, fontWeight: FontWeight.bold }}>{xpNeeded.toLocaleString()} more XP</Text> to unlock Pro
                            </Text>
                        )}

                        {/* How to earn XP */}
                        <View style={[styles.earnSection, { borderTopColor: colors.divider }]}>
                            <Text style={[styles.earnTitle, { color: colors.text }]}>How to earn XP</Text>
                            {[
                                { emoji: '🌟', label: 'Daily login', xp: '+50 XP' },
                                { emoji: '📝', label: 'Create a post', xp: '+100 XP' },
                                { emoji: '🧠', label: 'Answer quiz correctly', xp: '+30 XP' },
                                { emoji: '🛠️', label: 'Use a study tool', xp: '+20 XP' },
                                { emoji: '💬', label: 'Comment on a post', xp: '+10 XP' },
                            ].map((item, i) => (
                                <View key={i} style={styles.earnItem}>
                                    <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                                    <Text style={[styles.earnLabel, { color: colors.text }]}>{item.label}</Text>
                                    <Text style={[styles.earnXp, { color: colors.primary }]}>{item.xp}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Features */}
                <View style={{ paddingHorizontal: Spacing.xl, marginTop: Spacing.xl }}>
                    <Text style={[styles.featuresTitle, { color: colors.text }]}>What you get with Pro</Text>
                    <View style={styles.featuresGrid}>
                        {PRO_FEATURES.map((f, i) => (
                            <View key={i} style={[styles.featureCard, { backgroundColor: colors.surface, borderColor: `${f.color}30` }]}>
                                <View style={[styles.featureIcon, { backgroundColor: `${f.color}15` }]}>
                                    <Ionicons name={`${f.icon}-outline` as any} size={22} color={f.color} />
                                </View>
                                <Text style={[styles.featureLabel, { color: colors.text }]}>{f.label}</Text>
                                <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>{f.desc}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* CTAs */}
            {!isPro && (
                <View style={[styles.ctaBar, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
                    <TouchableOpacity
                        style={[styles.xpBtn, !canAfford && { opacity: 0.5 }]}
                        onPress={claimProPlan}
                    >
                        <LinearGradient colors={['#6C63FF', '#5A52E0']} style={styles.xpBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                            <Ionicons name="sparkles" size={18} color="#fff" />
                            <Text style={styles.xpBtnText}>
                                {canAfford ? 'Unlock with 10,000 XP 🎉' : `${xpNeeded.toLocaleString()} XP to go`}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.moneyBtn, { borderColor: colors.border }]} onPress={handleBuyWithMoney}>
                        <Text style={[styles.moneyBtnText, { color: colors.text }]}>Buy with $12 / month</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    hero: { paddingBottom: Spacing.xxxl },
    heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl },
    closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    proBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
    proBadgeText: { color: '#fff', fontWeight: FontWeight.bold, fontSize: FontSize.sm },
    heroContent: { alignItems: 'center', paddingTop: Spacing.xxl, paddingHorizontal: Spacing.xl },
    heroIcon: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
    heroTitle: { fontSize: 36, fontWeight: '900', color: '#fff', marginBottom: Spacing.sm },
    heroSub: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
    pricePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
    priceXp: { color: '#fff', fontWeight: FontWeight.bold, fontSize: FontSize.md },
    priceSep: { color: 'rgba(255,255,255,0.6)', fontSize: FontSize.sm },
    priceEtb: { color: '#fff', fontWeight: FontWeight.bold, fontSize: FontSize.md },
    xpCard: { marginHorizontal: Spacing.xl, marginTop: -Spacing.xl, borderRadius: BorderRadius.xxl, padding: Spacing.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
    xpCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
    xpCardLabel: { fontSize: FontSize.sm, marginBottom: 4 },
    xpCardVal: { fontSize: FontSize.xxl, fontWeight: '800' },
    levelChip: { borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2 },
    levelChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    xpBarRow: { gap: Spacing.xs },
    xpBarBg: { height: 10, borderRadius: 5, overflow: 'hidden' },
    xpBarFill: { height: '100%', borderRadius: 5 },
    xpBarLabel: { fontSize: FontSize.xs, textAlign: 'right' },
    xpNeededText: { fontSize: FontSize.sm, marginTop: Spacing.md, textAlign: 'center' },
    earnSection: { marginTop: Spacing.lg, paddingTop: Spacing.lg, borderTopWidth: 1 },
    earnTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, marginBottom: Spacing.md },
    earnItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm },
    earnLabel: { flex: 1, fontSize: FontSize.md },
    earnXp: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    featuresTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginBottom: Spacing.lg },
    featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
    featureCard: { width: (width - Spacing.xl * 2 - Spacing.md) / 2, borderRadius: BorderRadius.xl, padding: Spacing.lg, borderWidth: 1 },
    featureIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
    featureLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, marginBottom: 4 },
    featureDesc: { fontSize: FontSize.xs, lineHeight: 16 },
    ctaBar: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg, paddingBottom: Spacing.xl + 8, borderTopWidth: 1, gap: Spacing.md },
    xpBtn: {},
    xpBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderRadius: BorderRadius.pill, paddingVertical: Spacing.lg },
    xpBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.bold },
    moneyBtn: { borderRadius: BorderRadius.pill, paddingVertical: Spacing.md + 2, alignItems: 'center', borderWidth: 1.5 },
    moneyBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
});
