import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();
    const [showIntro, setShowIntro] = useState(true);
    const videoRef = useRef<Video>(null);

    // Animations for the main welcome content
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const contentTranslateY = useRef(new Animated.Value(40)).current;
    const logoScale = useRef(new Animated.Value(0)).current;
    const featureAnims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;
    const buttonsAnim = useRef(new Animated.Value(0)).current;

    const features = [
        { emoji: '✨', label: 'Walia AI', desc: 'Chat with AI for instant study help' },
        { emoji: '💬', label: 'Social', desc: 'Connect with study groups & friends' },
        { emoji: '🛠️', label: 'Tools', desc: 'Summarize, quiz, flashcards & notes' },
        { emoji: '📅', label: 'Calendar', desc: 'Smart reminders & study planner' },
    ];

    const animateWelcomeContent = useCallback(() => {
        // Staggered entrance animations
        Animated.sequence([
            // Logo bounce in
            Animated.spring(logoScale, { toValue: 1, tension: 50, friction: 5, useNativeDriver: true }),
            // Content fade in
            Animated.parallel([
                Animated.timing(contentOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(contentTranslateY, { toValue: 0, duration: 400, useNativeDriver: true }),
            ]),
            // Feature cards stagger in
            Animated.stagger(100, featureAnims.map(anim =>
                Animated.spring(anim, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true })
            )),
            // Buttons slide in
            Animated.spring(buttonsAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        ]).start();
    }, []);

    const onVideoEnd = useCallback((status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
            setShowIntro(false);
            animateWelcomeContent();
        }
    }, [animateWelcomeContent]);

    // Fallback: if video fails or takes too long, skip intro after 8 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            if (showIntro) {
                setShowIntro(false);
                animateWelcomeContent();
            }
        }, 8000);
        return () => clearTimeout(timer);
    }, []);

    if (showIntro) {
        return (
            <View style={styles.introContainer}>
                <StatusBar style="light" />
                <Video
                    ref={videoRef}
                    source={require('../../assets/images/3d-logo.mp4')}
                    style={styles.introVideo}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay
                    isMuted={false}
                    volume={1.0}
                    onPlaybackStatusUpdate={onVideoEnd}
                />
                {/* Skip button */}
                <SafeAreaView edges={['top']} style={styles.skipContainer}>
                    <TouchableOpacity
                        style={styles.skipBtn}
                        onPress={() => {
                            setShowIntro(false);
                            animateWelcomeContent();
                        }}
                    >
                        <Text style={styles.skipText}>Skip →</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            {/* Background */}
            <View style={StyleSheet.absoluteFill}>
                <View style={styles.bgBase} />
                <View style={styles.bgGlow1} />
                <View style={styles.bgGlow2} />
                <View style={styles.bgGlow3} />
            </View>

            <SafeAreaView style={styles.safeArea}>
                {/* Top section - Logo */}
                <View style={styles.topSection}>
                    <Animated.View style={[styles.logoOuter, { transform: [{ scale: logoScale }] }]}>
                        <View style={styles.logoInner}>
                            <Image
                                source={require('../../assets/images/walia-logo.png')}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        </View>
                    </Animated.View>
                    <Animated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }}>
                        <Text style={styles.appName}>Walia</Text>
                        <Text style={styles.tagline}>Your AI Study Companion</Text>
                    </Animated.View>
                </View>

                {/* Feature cards */}
                <View style={styles.featuresGrid}>
                    {features.map((f, i) => (
                        <Animated.View
                            key={i}
                            style={[
                                styles.featureCard,
                                i % 2 === 0 ? styles.featureCardLeft : styles.featureCardRight,
                                {
                                    opacity: featureAnims[i],
                                    transform: [{
                                        translateY: featureAnims[i].interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [30, 0],
                                        })
                                    }],
                                }
                            ]}
                        >
                            <Text style={styles.featureEmoji}>{f.emoji}</Text>
                            <Text style={styles.featureLabel}>{f.label}</Text>
                            <Text style={styles.featureDesc}>{f.desc}</Text>
                        </Animated.View>
                    ))}
                </View>

                {/* Buttons */}
                <Animated.View style={[styles.buttonsSection, {
                    opacity: buttonsAnim,
                    transform: [{ translateY: buttonsAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
                }]}>
                    <TouchableOpacity style={styles.getStartedBtn} onPress={() => router.push('/(auth)/signup')}>
                        <Text style={styles.getStartedText}>Get Started →</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/(auth)/login')}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <Text style={styles.loginTextBold}>Sign In</Text>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    // ─── Intro Video ─────────────────────────────────────────
    introContainer: { flex: 1, backgroundColor: '#000' },
    introVideo: { width, height, position: 'absolute', top: 0, left: 0 },
    skipContainer: { position: 'absolute', top: 0, right: 0, paddingHorizontal: Spacing.xl, paddingTop: Spacing.md },
    skipBtn: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 20, paddingVertical: 10,
        borderRadius: BorderRadius.pill,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
    },
    skipText: { color: '#fff', fontSize: FontSize.sm, fontWeight: FontWeight.semiBold },

    // ─── Main Welcome ────────────────────────────────────────
    container: { flex: 1 },
    bgBase: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0A0A18' },
    bgGlow1: {
        position: 'absolute', width: 400, height: 400, borderRadius: 200,
        backgroundColor: '#6C63FF', opacity: 0.12,
        top: -150, left: -100,
    },
    bgGlow2: {
        position: 'absolute', width: 300, height: 300, borderRadius: 150,
        backgroundColor: '#6C63FF', opacity: 0.08,
        bottom: 50, right: -80,
    },
    bgGlow3: {
        position: 'absolute', width: 200, height: 200, borderRadius: 100,
        backgroundColor: '#C8956C', opacity: 0.07,
        top: '45%', left: '50%',
    },
    safeArea: { flex: 1, justifyContent: 'space-between', paddingHorizontal: Spacing.xxl },
    topSection: { alignItems: 'center', paddingTop: Spacing.xxxl },
    logoOuter: {
        width: 120, height: 120, borderRadius: 60,
        borderWidth: 1.5, borderColor: 'rgba(108,99,255,0.5)',
        alignItems: 'center', justifyContent: 'center',
        padding: 4, marginBottom: Spacing.xl,
    },
    logoInner: {
        width: 108, height: 108, borderRadius: 54,
        backgroundColor: '#000',
        overflow: 'hidden',
        alignItems: 'center', justifyContent: 'center',
    },
    logoImage: { width: 108, height: 108 },
    appName: {
        fontSize: 52, fontWeight: '900', color: '#FFFFFF',
        letterSpacing: 0.5, marginBottom: Spacing.xs, textAlign: 'center',
    },
    tagline: {
        fontSize: FontSize.lg, color: 'rgba(255,255,255,0.5)',
        letterSpacing: 0.3, textAlign: 'center',
    },

    featuresGrid: {
        flexDirection: 'row', flexWrap: 'wrap',
        gap: Spacing.md,
    },
    featureCard: {
        width: (width - Spacing.xxl * 2 - Spacing.md) / 2,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: BorderRadius.xl, padding: Spacing.xl,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    },
    featureCardLeft: { transform: [{ translateY: 0 }] },
    featureCardRight: { transform: [{ translateY: 20 }] },
    featureEmoji: { fontSize: 28, marginBottom: Spacing.sm },
    featureLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: '#fff', marginBottom: Spacing.xs },
    featureDesc: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.5)', lineHeight: 16 },

    buttonsSection: { paddingBottom: Spacing.xl, gap: Spacing.md },
    getStartedBtn: {
        backgroundColor: '#6C63FF',
        borderRadius: BorderRadius.pill, paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
    },
    getStartedText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '800', letterSpacing: 0.5 },
    loginBtn: { flexDirection: 'row', justifyContent: 'center', paddingVertical: Spacing.sm },
    loginText: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.5)' },
    loginTextBold: { fontSize: FontSize.md, color: '#6C63FF', fontWeight: FontWeight.bold },
});
