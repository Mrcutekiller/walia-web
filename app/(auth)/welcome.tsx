import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// ─── Live Counter Component (Mobile) ───
const LiveCounter = ({ target, label, suffix = '' }: { target: number, label: string, suffix?: string }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const increment = Math.max(1, target / (duration / 16));
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        const liveTimer = setInterval(() => {
            setCount(prev => prev + Math.floor(Math.random() * 2) + 1);
        }, 8000);
        return () => { clearInterval(timer); clearInterval(liveTimer); };
    }, [target]);

    return (
        <View style={styles.statItem}>
            <View style={styles.statValueRow}>
                <View style={styles.liveDot} />
                <Text style={styles.statValue}>{count.toLocaleString()}{suffix}</Text>
            </View>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
};

export default function WelcomeScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const videoRef = useRef<Video>(null);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            
            {/* ━━━━━━━━━━ FULL-SCREEN BACKGROUND VIDEO ━━━━━━━━━━ */}
            <Video
                ref={videoRef}
                source={require('../../assets/videos/welcome-bg.mp4')}
                style={StyleSheet.absoluteFill}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
                isMuted={true}
            />

            {/* ── Dark Overlays (matching website) ── */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.70)' }]} />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(99,102,241,0.08)' }]} />
            
            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <SafeAreaView style={styles.safeArea}>
                    
                    {/* ━━━━━━━━━━ BOTTOM-LEFT ANCHORED CONTENT ━━━━━━━━━━ */}
                    <View style={styles.bottomContent}>
                        
                        {/* Version Badge */}
                        <View style={styles.badge}>
                            <View style={[styles.liveDot, { backgroundColor: '#4ADE80', shadowColor: '#4ADE80', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 8 }]} />
                            <Text style={styles.badgeText}>v1.0 — NOW ON ANDROID</Text>
                        </View>

                        {/* Origin Line */}
                        <Text style={styles.originLine}>FROM THE MOUNTAINS OF ETHIOPIA</Text>

                        {/* App Title */}
                        <Text style={styles.title}>Walia</Text>

                        {/* Tagline */}
                        <View style={styles.taglineRow}>
                            <View style={styles.taglineLine} />
                            <Text style={styles.tagline}>Climb Higher. Think Smarter.</Text>
                        </View>

                        {/* CTAs */}
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity 
                                style={styles.primaryBtn} 
                                onPress={() => router.push('/(auth)/signup')}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.primaryBtnText}>Get Started Free</Text>
                                <Ionicons name="arrow-forward" size={20} color="#000" />
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.secondaryBtn} 
                                onPress={() => {}} // Download logic
                                activeOpacity={0.8}
                            >
                                <Ionicons name="download-outline" size={20} color="#fff" />
                                <Text style={styles.secondaryBtnText}>Download APK</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Sign In Link */}
                        <TouchableOpacity 
                            onPress={() => router.push('/(auth)/login')}
                            style={styles.signInLink}
                        >
                            <Text style={styles.signInText}>
                                Already a member? <Text style={styles.signInTextBold}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>

                        {/* Stats Row (floating bottom right-ish on web, here just above buttons or below?) */}
                        <View style={styles.statsRow}>
                            <LiveCounter target={12450} label="Students" suffix="+" />
                            <LiveCounter target={1200500} label="AI Messages" suffix="+" />
                        </View>
                    </View>
                </SafeAreaView>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    content: { flex: 1 },
    safeArea: { flex: 1 },
    bottomContent: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: Spacing.xl * 1.5, paddingBottom: Spacing.xxxl },
    
    badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: BorderRadius.pill, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', alignSelf: 'flex-start', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 1.5 },
    
    originLine: { fontSize: 11, fontWeight: FontWeight.black, color: 'rgba(255,255,255,0.5)', letterSpacing: 4, marginBottom: 12 },
    
    title: { fontSize: 100, fontWeight: FontWeight.black, color: '#fff', letterSpacing: -4, lineHeight: 90, marginBottom: 16 },
    
    taglineRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 40 },
    taglineLine: { height: 2, width: 30, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 1 },
    tagline: { fontSize: 18, color: 'rgba(255,255,255,0.8)', fontWeight: FontWeight.bold },
    
    buttonGroup: { gap: 14, marginBottom: 24 },
    primaryBtn: { backgroundColor: '#fff', height: 68, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, shadowColor: '#fff', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20 },
    primaryBtnText: { fontSize: 17, fontWeight: FontWeight.black, color: '#000' },
    
    secondaryBtn: { backgroundColor: 'rgba(255,255,255,0.12)', height: 68, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
    secondaryBtnText: { fontSize: 17, fontWeight: FontWeight.bold, color: '#fff' },
    
    signInLink: { alignItems: 'center', marginTop: 10 },
    signInText: { fontSize: 15, color: 'rgba(255,255,255,0.6)', fontWeight: FontWeight.medium },
    signInTextBold: { color: '#fff', fontWeight: FontWeight.black },
    
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 24, marginTop: 24, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' },
    statItem: { alignItems: 'center' },
    statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ADE80' },
    statValue: { fontSize: 24, fontWeight: FontWeight.black, color: '#fff' },
    statLabel: { fontSize: 11, fontWeight: FontWeight.black, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 6 },
});
