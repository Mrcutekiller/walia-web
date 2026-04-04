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
            <Animated.View style={[styles.card, frontAnimatedStyle, { backgroundColor: '#FFFFFF', backfaceVisibility: 'hidden' }]}>
                {/* Gold stripe */}
                <LinearGradient 
                    colors={['#000000', '#FBD38D', '#000000']} 
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                    style={styles.cardStripe}
                />
                
                <View style={styles.cardContent}>
                    {/* Header */}
                    <View style={styles.cardHeader}>
                        <View style={styles.logoRow}>
                            <View style={styles.logoCircle}>
                                <Image source={require('../assets/images/walia-logo.png')} style={styles.logo} resizeMode="contain" />
                            </View>
                            <View>
                                <Text style={styles.logoText}>WALIA</Text>
                                <Text style={styles.logoSub}>AI PLATFORM</Text>
                            </View>
                        </View>
                        <Ionicons name="shield-checkmark" size={24} color="#10B981" />
                    </View>

                    {/* Main */}
                    <View style={styles.cardMain}>
                        <View style={styles.avatarWrap}>
                             {avatar && avatar.length > 2 ? (
                                <Image source={{ uri: avatar }} style={styles.avatarImg} />
                             ) : (
                                <Text style={styles.avatarEmoji}>{avatar || '🧑‍🎓'}</Text>
                             )}
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName} numberOfLines={1}>{name}</Text>
                            <Text style={styles.userHandle}>@{username}</Text>
                            <View style={styles.badgeRow}>
                                <View style={styles.verifiedBadge}>
                                    <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                                    <Text style={styles.verifiedText}>VERIFIED</Text>
                                </View>
                                <View style={styles.planBadge}>
                                    <Text style={styles.planText}>{isPro ? 'PRO' : 'FREE'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.cardFooter}>
                        <Text style={styles.idNumber}>{id}</Text>
                        <Text style={styles.sinceText}>SINCE {memberSince}</Text>
                    </View>
                </View>

                {/* Background Decoration */}
                <View style={styles.bgDecoration}>
                    <View style={styles.bgCircleLarge} />
                    <View style={styles.bgCircleSmall} />
                </View>
            </Animated.View>

            {/* Back Side */}
            <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, { backgroundColor: '#FFFFFF', backfaceVisibility: 'hidden' }]}>
                <LinearGradient 
                    colors={['#000000', '#FBD38D', '#000000']} 
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                    style={styles.cardStripe}
                />
                
                <View style={styles.backContent}>
                    <View style={styles.barcodeContainer}>
                        <View style={styles.barcodeArt}>
                            {[1.5, 3, 1, 2, 4, 1.5, 1, 3, 2, 1.5, 4, 1, 2, 3, 1, 2, 1, 4, 1, 2, 1, 3].map((w, i) => (
                                <View key={i} style={[styles.barcodeBar, { width: w * 3 }]} />
                            ))}
                        </View>
                        <Text style={styles.barcodeId}>{id}</Text>
                    </View>

                    <View style={styles.verifiedChip}>
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text style={styles.verifiedChipText}>VERIFIED WALIA CITIZEN</Text>
                    </View>

                    <Text style={styles.backDisclaimer}>
                        This card confirms the digital identity of <Text style={{color: '#000'}}>{name}</Text> on the Walia AI platform.
                    </Text>
                </View>

                {/* Watermark */}
                <View style={styles.watermarkContainer}>
                     <Image source={require('../assets/images/walia-logo.png')} style={styles.watermark} resizeMode="contain" />
                </View>
            </Animated.View>

            <View style={styles.instruction}>
                <View style={styles.pulseDot} />
                <Text style={styles.instructionText}>Digital Walia ID · Tap to flip</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 12,
    },
    card: {
        width: '100%',
        height: 200,
        borderRadius: 32,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 10,
    },
    cardBack: {
        position: 'absolute',
        top: 0,
    },
    cardStripe: {
        height: 6,
        width: '100%',
    },
    cardContent: {
        flex: 1,
        padding: 24,
        zIndex: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoCircle: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        padding: 6,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    logoText: {
        fontSize: 14,
        fontFamily: 'Inter_900Black',
        color: '#000',
        letterSpacing: 2,
    },
    logoSub: {
        fontSize: 8,
        fontFamily: 'Inter_700Bold',
        color: '#A0AEC0',
        letterSpacing: 1,
    },
    cardMain: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        flex: 1,
    },
    avatarWrap: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: '#F7FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#EDF2F7',
        overflow: 'hidden',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
    },
    avatarEmoji: {
        fontSize: 32,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontFamily: 'Inter_900Black',
        color: '#000',
        marginBottom: 2,
    },
    userHandle: {
        fontSize: 11,
        fontFamily: 'Inter_700Bold',
        color: '#A0AEC0',
        marginBottom: 8,
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 8,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: '#ECFDF5',
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    verifiedText: {
        fontSize: 8,
        fontFamily: 'Inter_900Black',
        color: '#059669',
        letterSpacing: 0.5,
    },
    planBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: '#F7FAFC',
        borderWidth: 1,
        borderColor: '#EDF2F7',
    },
    planText: {
        fontSize: 8,
        fontFamily: 'Inter_900Black',
        color: '#718096',
        letterSpacing: 0.5,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F7FAFC',
        paddingTop: 16,
    },
    idNumber: {
        fontSize: 11,
        fontFamily: 'Inter_600SemiBold', // Mono replacement
        color: '#A0AEC0',
        letterSpacing: 2,
    },
    sinceText: {
        fontSize: 9,
        fontFamily: 'Inter_800ExtraBold',
        color: '#CBD5E0',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    bgDecoration: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0,
        opacity: 0.04,
    },
    bgCircleLarge: {
        position: 'absolute',
        right: -40,
        top: -40,
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 30,
        borderColor: '#000',
    },
    bgCircleSmall: {
        position: 'absolute',
        right: 10,
        top: 60,
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 15,
        borderColor: '#000',
    },
    backContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    barcodeContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    barcodeArt: {
        flexDirection: 'row',
        height: 36,
        gap: 1,
        marginBottom: 16,
    },
    barcodeBar: {
        backgroundColor: '#000',
        height: '100%',
        borderRadius: 1,
    },
    barcodeId: {
        fontSize: 12,
        fontFamily: 'Inter_700Bold',
        color: '#000',
        letterSpacing: 4,
        opacity: 0.7,
    },
    verifiedChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#EDF2F7',
        marginBottom: 16,
    },
    verifiedChipText: {
        fontSize: 10,
        fontFamily: 'Inter_900Black',
        color: '#000',
        letterSpacing: 1.5,
    },
    backDisclaimer: {
        fontSize: 10,
        fontFamily: 'Inter_600SemiBold',
        color: '#718096',
        textAlign: 'center',
        lineHeight: 16,
    },
    watermarkContainer: {
        position: 'absolute',
        left: -40,
        bottom: -40,
        opacity: 0.04,
    },
    watermark: {
        width: 200,
        height: 200,
    },
    instruction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
    },
    pulseDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    instructionText: {
        fontSize: 11,
        fontFamily: 'Inter_800ExtraBold',
        color: '#A0AEC0',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
