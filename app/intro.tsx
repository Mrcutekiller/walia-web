'use client';

import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function IntroScreen() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [showNext, setShowNext] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        ]).start();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowNext(true);
            Animated.spring(buttonAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }).start();
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            router.replace('/(tabs)/ai');
        }
    }, [isAuthenticated, authLoading]);

    const handleNext = async () => {
        try {
            await AsyncStorage.setItem('has_seen_intro', 'true');
        } catch (e) {}
        router.replace('/(auth)/welcome');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }]} />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(99,102,241,0.05)' }]} />
            
            <SafeAreaView style={styles.content}>
                <Animated.View 
                    style={[
                        styles.logoContainer,
                        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
                    ]}
                >
                    <View style={styles.logoCircle}>
                        <View style={styles.logoInner}>
                            <Text style={styles.logoEmoji}>🧠</Text>
                        </View>
                    </View>
                    
                    <Text style={styles.title}>WALIA</Text>
                    <Text style={styles.tagline}>Your AI Study Companion</Text>
                </Animated.View>

                <Animated.View style={[styles.features, { opacity: fadeAnim }]}>
                    <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                            <Ionicons name="sparkles" size={22} color="#fff" />
                        </View>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>Smart AI Tutor</Text>
                            <Text style={styles.featureDesc}>Personalized learning</Text>
                        </View>
                    </View>
                    
                    <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                            <Ionicons name="people" size={22} color="#fff" />
                        </View>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>Community</Text>
                            <Text style={styles.featureDesc}>Connect with students</Text>
                        </View>
                    </View>
                    
                    <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                            <Ionicons name="calendar" size={22} color="#fff" />
                        </View>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>Study Tools</Text>
                            <Text style={styles.featureDesc}>Plan & track progress</Text>
                        </View>
                    </View>
                </Animated.View>

                <View style={styles.footer}>
                    <Animated.View style={{ opacity: buttonAnim, transform: [{ translateY: slideAnim }] }}>
                        {showNext && (
                            <TouchableOpacity 
                                style={styles.nextBtn}
                                onPress={handleNext}
                            >
                                <Text style={styles.nextBtnText}>Get Started</Text>
                                <Ionicons name="arrow-forward" size={22} color="#000" />
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    content: { flex: 1, justifyContent: 'space-between', paddingVertical: Spacing.xxxl },
    logoContainer: { alignItems: 'center', paddingTop: Spacing.huge },
    logoCircle: { 
        width: 130, height: 130, 
        borderRadius: 44, 
        backgroundColor: '#fff', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: Spacing.xl,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 25 },
        shadowOpacity: 0.4,
        shadowRadius: 35,
    },
    logoInner: { width: 90, height: 90, borderRadius: 28, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
    logoEmoji: { fontSize: 44 },
    title: { fontSize: 52, fontWeight: FontWeight.black, color: '#fff', letterSpacing: 10, marginBottom: Spacing.sm },
    tagline: { fontSize: FontSize.lg, color: 'rgba(255,255,255,0.6)', fontWeight: FontWeight.medium },
    features: { paddingHorizontal: Spacing.xxl },
    featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl },
    featureIcon: { 
        width: 52, height: 52, 
        borderRadius: 18, 
        backgroundColor: 'rgba(255,255,255,0.15)', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginRight: Spacing.lg 
    },
    featureText: { flex: 1 },
    featureTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: '#fff', marginBottom: 2 },
    featureDesc: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.5)', fontWeight: FontWeight.medium },
    footer: { alignItems: 'center', paddingBottom: Spacing.xxl },
    nextBtn: { 
        backgroundColor: '#fff', 
        paddingVertical: Spacing.lg, 
        paddingHorizontal: Spacing.huge,
        borderRadius: BorderRadius.pill,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 25,
    },
    nextBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.black, color: '#000' },
});