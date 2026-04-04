import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions, ScrollView, StyleSheet, Text,
    TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const PLANS: {
    id: string;
    name: string;
    price: string;
    period: string;
    badge: string | null;
    color: string;
    borderColor: string;
    highlight: boolean;
    features: { icon: string; text: string; dim?: boolean }[];
}[] = [
    {
        id: 'free',
        name: 'Free',
        price: '$0',
        period: 'forever',
        badge: null,
        color: 'rgba(255,255,255,0.08)',
        borderColor: 'rgba(255,255,255,0.15)',
        highlight: false,
        features: [
            { icon: 'chatbubble-outline', text: '30 AI messages / day' },
            { icon: 'construct-outline', text: '3 AI Tools included' },
            { icon: 'people-outline', text: 'Community access' },
            { icon: 'calendar-outline', text: 'Smart calendar' },
            { icon: 'close-circle-outline', text: 'No priority support', dim: true },
            { icon: 'close-circle-outline', text: 'Ads shown', dim: true },
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '$12',
        period: 'per month',
        badge: '⭐ MOST POPULAR',
        color: '#fff',
        borderColor: '#fff',
        highlight: true,
        features: [
            { icon: 'infinite', text: 'Unlimited AI chats' },
            { icon: 'flash', text: 'Priority AI speed (GPT-4 & Gemini)' },
            { icon: 'layers', text: '12+ advanced study tools' },
            { icon: 'shield-checkmark', text: 'Ad-free experience' },
            { icon: 'star', text: 'Pro badge on your profile' },
            { icon: 'people', text: 'Exclusive Pro study groups' },
        ],
    },
    {
        id: 'team',
        name: 'Team',
        price: '$8',
        period: 'per user / mo',
        badge: '🏫 FOR SCHOOLS',
        color: 'rgba(255,255,255,0.08)',
        borderColor: 'rgba(255,255,255,0.3)',
        highlight: false,
        features: [
            { icon: 'people', text: 'Up to 50 students' },
            { icon: 'infinite', text: 'Unlimited AI for all members' },
            { icon: 'analytics', text: 'Admin analytics dashboard' },
            { icon: 'school', text: 'Classroom management tools' },
            { icon: 'headset', text: 'Dedicated support' },
            { icon: 'ribbon', text: 'Custom school branding' },
        ],
    },
];

export default function PricingScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [selected, setSelected] = useState('free');

    const handleContinue = () => {
        if (selected === 'pro') {
            Alert.alert(
                '💳 Walia Pro',
                '$12/month · Billed monthly\n\nPayment integration coming soon!\n\nYou can upgrade anytime from settings. For now, you\'ll start with the Free plan.',
                [
                    { text: 'Start Free for now', onPress: () => router.replace('/(auth)/features') },
                    { text: 'Cancel', style: 'cancel' },
                ]
            );
        } else if (selected === 'team') {
            Alert.alert(
                '🏫 Walia Team',
                'Team plans are available by contacting us.\n\nEmail: team@waliaai.com',
                [
                    { text: 'Continue with Free', onPress: () => router.replace('/(auth)/features') },
                    { text: 'Cancel', style: 'cancel' },
                ]
            );
        } else {
            router.replace('/(auth)/features');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                    {/* Header */}
                    <View style={styles.headerSection}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>🎉 ACCOUNT CREATED</Text>
                        </View>
                        <Text style={styles.title}>
                            Welcome, {user?.name?.split(' ')[0] || 'there'}!{'\n'}Choose your plan
                        </Text>
                        <Text style={styles.subtitle}>
                            Start free and upgrade anytime. No credit card required.
                        </Text>
                    </View>

                    {/* Plans */}
                    <View style={styles.plansCol}>
                        {PLANS.map(plan => {
                            const isSelected = selected === plan.id;
                            return (
                                <TouchableOpacity
                                    key={plan.id}
                                    style={[
                                        styles.planCard,
                                        { borderColor: isSelected ? (plan.highlight ? '#fff' : 'rgba(255,255,255,0.6)') : plan.borderColor },
                                        plan.highlight && isSelected && styles.planCardHighlight,
                                        isSelected && !plan.highlight && styles.planCardSelected,
                                    ]}
                                    onPress={() => setSelected(plan.id)}
                                    activeOpacity={0.85}
                                >
                                    {/* Badge */}
                                    {plan.badge && (
                                        <View style={[styles.planBadge, plan.highlight && styles.planBadgeHighlight]}>
                                            <Text style={[styles.planBadgeText, plan.highlight && { color: '#000' }]}>{plan.badge}</Text>
                                        </View>
                                    )}

                                    {/* Plan header */}
                                    <View style={styles.planHeader}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.planName, plan.highlight && isSelected && { color: '#000' }]}>{plan.name}</Text>
                                            <View style={styles.priceRow}>
                                                <Text style={[styles.planPrice, plan.highlight && isSelected && { color: '#000' }]}>{plan.price}</Text>
                                                <Text style={[styles.planPeriod, plan.highlight && isSelected && { color: 'rgba(0,0,0,0.6)' }]}> / {plan.period}</Text>
                                            </View>
                                        </View>
                                        <View style={[
                                            styles.radioOuter,
                                            isSelected && styles.radioOuterActive,
                                            plan.highlight && isSelected && { borderColor: '#000' },
                                        ]}>
                                            {isSelected && (
                                                <View style={[styles.radioInner, plan.highlight && { backgroundColor: '#000' }]} />
                                            )}
                                        </View>
                                    </View>

                                    {/* Divider */}
                                    <View style={[styles.planDivider, plan.highlight && isSelected && { backgroundColor: 'rgba(0,0,0,0.15)' }]} />

                                    {/* Features */}
                                    <View style={styles.featuresList}>
                                        {plan.features.map((f, i) => (
                                            <View key={i} style={styles.featureRow}>
                                                <Ionicons
                                                    name={f.icon as any}
                                                    size={16}
                                                    color={
                                                        f.dim ? 'rgba(255,255,255,0.2)'
                                                            : plan.highlight && isSelected ? 'rgba(0,0,0,0.7)'
                                                                : 'rgba(255,255,255,0.7)'
                                                    }
                                                />
                                                <Text style={[
                                                    styles.featureText,
                                                    f.dim && styles.featureTextDim,
                                                    plan.highlight && isSelected && { color: 'rgba(0,0,0,0.75)' },
                                                    f.dim && plan.highlight && isSelected && { color: 'rgba(0,0,0,0.3)' },
                                                ]}>
                                                    {f.text}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Trust line */}
                    <View style={styles.trustRow}>
                        <Ionicons name="lock-closed-outline" size={14} color="rgba(255,255,255,0.3)" />
                        <Text style={styles.trustText}>Secure checkout · Cancel anytime · No hidden fees</Text>
                    </View>
                </ScrollView>

                {/* CTA */}
                <SafeAreaView edges={['bottom']} style={styles.footer}>
                    <TouchableOpacity style={styles.ctaBtn} onPress={handleContinue} activeOpacity={0.85}>
                        <Text style={styles.ctaBtnText}>
                            {selected === 'free' ? 'Continue with Free →'
                                : selected === 'pro' ? 'Get Pro · $12/mo →'
                                    : 'Contact Us for Team →'}
                        </Text>
                    </TouchableOpacity>
                    {selected !== 'free' && (
                        <TouchableOpacity onPress={() => { setSelected('free'); router.replace('/(auth)/features'); }}>
                            <Text style={styles.skipText}>Skip for now · Start free</Text>
                        </TouchableOpacity>
                    )}
                </SafeAreaView>
            </SafeAreaView>
        </View>
    );
}

const CARD_WIDTH = width - Spacing.xxl * 2;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    scroll: { paddingHorizontal: Spacing.xxl, paddingTop: Spacing.xxl, paddingBottom: 120 },

    headerSection: { marginBottom: Spacing.xxxl },
    badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, marginBottom: Spacing.lg },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
    title: { fontSize: 32, fontWeight: '900', color: '#fff', lineHeight: 38, marginBottom: Spacing.sm },
    subtitle: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.45)', lineHeight: 22, fontWeight: '500' },

    plansCol: { gap: Spacing.lg },

    planCard: {
        width: CARD_WIDTH,
        borderRadius: 24,
        borderWidth: 1.5,
        padding: Spacing.xl,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    planCardHighlight: {
        backgroundColor: '#fff',
    },
    planCardSelected: {
        backgroundColor: 'rgba(255,255,255,0.06)',
    },

    planBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginBottom: Spacing.md },
    planBadgeHighlight: { backgroundColor: '#000' },
    planBadgeText: { fontSize: 9, fontWeight: '900', color: '#fff', letterSpacing: 1.2 },

    planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
    planName: { fontSize: FontSize.xl, fontWeight: '900', color: '#fff', marginBottom: 4 },
    priceRow: { flexDirection: 'row', alignItems: 'baseline' },
    planPrice: { fontSize: 28, fontWeight: '900', color: '#fff' },
    planPeriod: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.45)', fontWeight: '600' },

    radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
    radioOuterActive: { borderColor: '#fff' },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },

    planDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: Spacing.lg },

    featuresList: { gap: Spacing.md },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    featureText: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.65)', fontWeight: '500', flex: 1 },
    featureTextDim: { color: 'rgba(255,255,255,0.2)', textDecorationLine: 'line-through' },

    trustRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: Spacing.xxl },
    trustText: { fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: '500' },

    footer: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.md, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', backgroundColor: '#000' },
    ctaBtn: { backgroundColor: '#fff', borderRadius: 999, paddingVertical: 18, alignItems: 'center' },
    ctaBtnText: { color: '#000', fontSize: FontSize.lg, fontWeight: '900' },
    skipText: { textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: FontSize.sm, fontWeight: '600' },
});
