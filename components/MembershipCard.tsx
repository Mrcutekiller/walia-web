import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MembershipCardProps {
    name: string;
    username: string;
    id: string;
    isPro: boolean;
    memberSince: string;
    avatar?: string;
}

export default function MembershipCard({ name, username, id, isPro, memberSince, avatar }: MembershipCardProps) {
    const { colors, isDark } = useTheme();
    const [flipped, setFlipped] = useState(false);
    const flipAnim = useRef(new Animated.Value(0)).current;

    const flipCard = () => {
        const toValue = flipped ? 0 : 180;
        Animated.spring(flipAnim, {
            toValue,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
        setFlipped(!flipped);
    };

    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }],
    };

    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }],
    };

    return (
        <TouchableOpacity activeOpacity={1} onPress={flipCard} style={styles.container}>
            {/* Front Side */}
            <Animated.View style={[styles.card, frontAnimatedStyle, { backgroundColor: colors.surface, backfaceVisibility: 'hidden' }]}>
                <LinearGradient
                    colors={isPro ? ['#000000', '#1A1A1A'] : ['#FFFFFF', '#FDFDFD']}
                    style={[styles.cardGradient, !isPro && { borderWidth: 1, borderColor: '#f1f5f9' }]}
                >
                    <View style={styles.cardHeader}>
                        <View style={styles.logoRow}>
                            <View style={[styles.logoCircle, { backgroundColor: isPro ? '#222' : '#f8fafc' }]}>
                                <Image source={require('../assets/images/walia-logo.png')} style={styles.logo} resizeMode="contain" />
                            </View>
                            <Text style={[styles.logoText, { color: isPro ? '#FFFFFF' : '#000000' }]}>WALIA</Text>
                        </View>
                        {isPro && <View style={styles.proBadge}><Text style={styles.proBadgeText}>PRO MEMBER</Text></View>}
                    </View>

                    <View style={styles.cardMain}>
                        <View style={styles.avatarWrap}>
                             <Text style={{fontSize: 40}}>{avatar || '🧑‍🎓'}</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={[styles.idLabel, { color: isPro ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }]}>MEMBER ID</Text>
                            <Text style={[styles.userName, { color: isPro ? '#FFFFFF' : '#000000' }]}>{name}</Text>
                            <Text style={[styles.userHandle, { color: isPro ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }]}>@{username}</Text>
                        </View>
                    </View>

                    <View style={styles.cardFooter}>
                        <View>
                            <Text style={[styles.footerLabel, { color: isPro ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }]}>MEMBER SINCE</Text>
                            <Text style={[styles.footerValue, { color: isPro ? '#FFFFFF' : '#000000' }]}>{memberSince}</Text>
                        </View>
                        <View style={styles.idWrap}>
                           <Text style={[styles.footerLabel, { color: isPro ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', textAlign: 'right' }]}>ID NUMBER</Text>
                           <Text style={[styles.footerValue, { color: isPro ? '#FFFFFF' : '#000000', textAlign: 'right' }]}>{id}</Text>
                        </View>
                    </View>

                    {/* Background "W" decoration */}
                    <Text style={[styles.bgW, { color: isPro ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }]}>W</Text>
                </LinearGradient>
            </Animated.View>

            {/* Back Side */}
            <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, { backgroundColor: isPro ? '#000000' : '#FFFFFF', backfaceVisibility: 'hidden' }]}>
                <View style={styles.backContent}>
                    <View style={styles.qrPlaceholder}>
                        <Ionicons name="qr-code-outline" size={120} color={isPro ? '#FFFFFF' : '#000000'} />
                    </View>
                    <Text style={[styles.backText, { color: isPro ? '#FFFFFF' : '#000000' }]}>Scan to verify membership</Text>
                    <View style={styles.barcodeWrap}>
                        <View style={[styles.barcode, { backgroundColor: isPro ? '#FFFFFF' : '#000000', opacity: 0.2 }]} />
                        <Text style={[styles.barcodeText, { color: isPro ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }]}>{id}</Text>
                    </View>
                </View>
            </Animated.View>

            <View style={styles.instruction}>
                <Ionicons name="sync-outline" size={14} color={colors.textTertiary} />
                <Text style={[styles.instructionText, { color: colors.textTertiary }]}>Tap to flip</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginVertical: Spacing.lg,
    },
    card: {
        width: '100%',
        aspectRatio: 1.6,
        borderRadius: BorderRadius.xxl,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    cardBack: {
        position: 'absolute',
        top: 0,
    },
    cardGradient: {
        flex: 1,
        padding: Spacing.xl,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    logoCircle: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    logoText: {
        fontSize: 14,
        fontWeight: FontWeight.heavy,
        letterSpacing: 3,
    },
    proBadge: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    proBadgeText: {
        color: '#000000',
        fontSize: 8,
        fontWeight: FontWeight.heavy,
        letterSpacing: 1,
    },
    cardMain: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.lg,
    },
    avatarWrap: {
        width: 64,
        height: 64,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    userInfo: {
        flex: 1,
    },
    idLabel: {
        fontSize: 7,
        fontWeight: FontWeight.heavy,
        letterSpacing: 1.5,
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    userName: {
        fontSize: 20,
        fontWeight: FontWeight.heavy,
        letterSpacing: -0.5,
    },
    userHandle: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
        opacity: 0.5,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    footerLabel: {
        fontSize: 8,
        fontWeight: FontWeight.heavy,
        letterSpacing: 1,
        marginBottom: 2,
    },
    footerValue: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
    },
    idWrap: {
        alignItems: 'flex-end',
    },
    bgW: {
        position: 'absolute',
        top: -40,
        right: -20,
        fontSize: 240,
        fontWeight: FontWeight.heavy,
        zIndex: -1,
    },
    backContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    qrPlaceholder: {
        marginBottom: Spacing.md,
    },
    backText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        opacity: 0.6,
        marginBottom: Spacing.lg,
    },
    barcodeWrap: {
        width: '100%',
        alignItems: 'center',
    },
    barcode: {
        width: '80%',
        height: 30,
        borderRadius: 4,
    },
    barcodeText: {
        fontSize: 10,
        marginTop: 4,
        fontWeight: FontWeight.medium,
        letterSpacing: 4,
    },
    instruction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: Spacing.sm,
        opacity: 0.8,
    },
    instructionText: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
