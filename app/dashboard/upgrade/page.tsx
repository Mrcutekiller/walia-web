import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

const features = [
    { icon: 'sparkles', title: 'Unlimited AI Chat', desc: 'No daily limits or message caps.' },
    { icon: 'bulb', title: 'GPT-4 & Gemini 2.0', desc: "Priority access to the world's best AI models." },
    { icon: 'lock-closed', title: 'Unlimited Files', desc: 'Upload, scan, and summarize unlimited PDFs & photos.' },
    { icon: 'flash', title: 'Custom Tools', desc: 'Early access to all new study micro-apps.' },
    { icon: 'trending-up', title: 'Advanced Market AI', desc: 'Real-time chart scanning with precise SL/TP targets.' },
    { icon: 'shield-checkmark', title: 'Ad-Free Space', desc: 'Focus entirely on your studies with zero distractions.' },
];

export default function UpgradePage() {
    const { profile } = useAuth();
    const isEthiopia = profile?.country === 'Ethiopia';
    const priceText = isEthiopia ? '1500 ETB' : '$10';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Next Generation Learning</Text>
                </View>
                <Text style={styles.title}>Unlock Your Potential</Text>
                <Text style={styles.subtitle}>
                    Upgrade to Walia Pro and join thousands of students who have already transformed their productivity.
                </Text>
            </View>

            {/* Plan Card */}
            <LinearGradient
                colors={['#4F46E5', '#7C3AED']}
                style={styles.planCard}
            >
                <View style={styles.planHeader}>
                    <View style={styles.zapContainer}>
                        <Ionicons name="flash" size={32} color="white" />
                    </View>
                    <View style={styles.billingBadge}>
                        <Text style={styles.billingText}>Monthly Billing</Text>
                    </View>
                </View>

                <View style={styles.priceContainer}>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>{priceText}</Text>
                        <Text style={styles.perMonth}>/ Month</Text>
                    </View>
                    <Text style={styles.planDesc}>The most popular choice for dedicated students.</Text>
                </View>

                <View style={styles.checksContainer}>
                    {['Cancel anytime', '14-Day Money-back', 'Multiple Payment Options'].map((lbl, i) => (
                        <View key={i} style={styles.checkRow}>
                            <View style={styles.checkIcon}>
                                <Ionicons name="checkmark" size={12} color="#4F46E5" />
                            </View>
                            <Text style={styles.checkText}>{lbl}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Start Pro Membership</Text>
                </TouchableOpacity>
            </LinearGradient>

            {/* Features Grid */}
            <View style={styles.featuresGrid}>
                {features.map((f, i) => (
                    <View key={i} style={styles.featureItem}>
                        <View style={styles.featureIconContainer}>
                            <Ionicons name={f.icon as any} size={20} color="#4F46E5" />
                        </View>
                        <Text style={styles.featureTitle}>{f.title}</Text>
                        <Text style={styles.featureDesc}>{f.desc}</Text>
                    </View>
                ))}
            </View>

            {/* Trust Section */}
            <View style={styles.trustBanner}>
                <Text style={styles.quote}>
                    "Walia Pro literally changed how I study for my finals. The AI Summarizer is a game changer."
                </Text>
                <Text style={styles.author}>Daniel W. - CS Student</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0B',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginVertical: 40,
    },
    badge: {
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(79, 70, 229, 0.2)',
        marginBottom: 16,
    },
    badgeText: {
        color: '#4F46E5',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
        textAlign: 'center',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.4)',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 20,
        maxWidth: 300,
    },
    planCard: {
        borderRadius: 32,
        padding: 32,
        marginBottom: 40,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    zapContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 12,
        borderRadius: 16,
    },
    billingBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    billingText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    priceContainer: {
        marginBottom: 40,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: 48,
        fontWeight: '900',
        color: 'white',
        letterSpacing: -2,
    },
    perMonth: {
        fontSize: 12,
        fontWeight: '900',
        color: 'rgba(255, 255, 255, 0.6)',
        textTransform: 'uppercase',
        marginLeft: 8,
    },
    planDesc: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 8,
    },
    checksContainer: {
        marginBottom: 40,
        gap: 12,
    },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    checkIcon: {
        width: 20,
        height: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '900',
    },
    button: {
        backgroundColor: 'white',
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#4F46E5',
        fontSize: 18,
        fontWeight: '900',
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    featureItem: {
        width: (width - 56) / 2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    featureIconContainer: {
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    featureTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 8,
    },
    featureIcon: {
        // Ionicons doesn't need styles here unless specifically positioned
    },
    featureDesc: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 10,
        lineHeight: 14,
    },
    trustBanner: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 32,
        borderRadius: 32,
        marginTop: 40,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    quote: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
    },
    author: {
        color: '#4F46E5',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
});
