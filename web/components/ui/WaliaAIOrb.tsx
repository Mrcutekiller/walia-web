import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OrbProps {
    onStartSession: (mode: string, level: string, durationMin: number) => void;
    isPro: boolean;
    hasFreeWeeklyUsed: boolean;
}

const MODES = ['Study', 'Work', 'Debate', 'Rizz', 'Advice', 'Language Practice', 'Teacher', 'Fun'];

const LEVELS: Record<string, string[]> = {
    Study: ['Beginner', 'High School', 'College', 'Expert'],
    Work: ['Intern', 'Professional', 'Manager', 'Executive'],
    Debate: ['Friendly', 'Serious', 'Aggressive'],
    Rizz: ['Beginner', 'Smooth', 'Elite', 'Legendary'],
    Advice: ['Gentle', 'Direct', 'Brutally Honest'],
    'Language Practice': ['Beginner', 'Intermediate', 'Advanced', 'Native'],
    Teacher: ['Kindergarten', 'High School', 'University Professor'],
    Fun: ['Jester', 'Sarcastic', 'Energetic'],
};

const TIMES = [
    { label: '5 minutes', min: 5 },
    { label: '15 minutes', min: 15 },
    { label: '30 minutes', min: 30 },
    { label: '1 hour', min: 60 },
    { label: 'Unlimited (Pro+)', min: 9999, proRequired: true },
];

export function WaliaAIOrb({ onStartSession, isPro, hasFreeWeeklyUsed }: OrbProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);

    const [mode, setMode] = useState('');
    const [level, setLevel] = useState('');
    const [time, setTime] = useState<number>(0);

    const reset = () => {
        setStep(1); setMode(''); setLevel(''); setTime(0); setOpen(false);
    };

    const handleStart = () => {
        onStartSession(mode, level, time);
        reset();
    };

    const renderLevelStep = () => {
        const levels = LEVELS[mode] || LEVELS['Study'];
        return (
            <View style={styles.stepContainer}>
                <TouchableOpacity onPress={() => setStep(1)} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={16} color="rgba(255,255,255,0.4)" />
                    <Text style={[styles.backText, { color: 'rgba(255,255,255,0.4)' }]}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.stepTitle}>Select {mode} Level</Text>
                {levels.map(l => (
                    <TouchableOpacity key={l} onPress={() => { setLevel(l); setStep(3); }} style={styles.itemBtn}>
                        <Text style={styles.itemText}>{l}</Text>
                        <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.2)" />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderTimeStep = () => {
        return (
            <View style={styles.stepContainer}>
                <TouchableOpacity onPress={() => setStep(2)} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={16} color="rgba(255,255,255,0.4)" />
                    <Text style={[styles.backText, { color: 'rgba(255,255,255,0.4)' }]}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.stepTitle}>Select Session Duration</Text>
                {TIMES.map(t => {
                    const locked = t.proRequired && !isPro;
                    const selected = time === t.min;
                    return (
                        <TouchableOpacity
                            key={t.label}
                            onPress={() => { if (!locked) setTime(t.min); }}
                            disabled={locked}
                            style={[
                                styles.itemBtn,
                                selected && styles.itemBtnActive,
                                locked && { opacity: 0.5 }
                            ]}
                        >
                            <Text style={[styles.itemText, selected && { color: Colors.primaryLight }]}>{t.label}</Text>
                            {locked ? (
                                <View style={styles.proBadge}>
                                    <Text style={styles.proBadgeText}>PRO</Text>
                                </View>
                            ) : selected ? (
                                <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                            ) : (
                                <View style={styles.radio} />
                            )}
                        </TouchableOpacity>
                    );
                })}

                {time > 0 && (
                    <TouchableOpacity onPress={handleStart} style={styles.startBtn}>
                        <LinearGradient colors={[Colors.primary, '#9B4DFF']} style={styles.startGradient}>
                            <Ionicons name="sparkles" size={18} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.startBtnText}>Summon Walia AI</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <>
            {/* Minimal floating orb inside chat */}
            <TouchableOpacity
                onPress={() => setOpen(true)}
                style={styles.orb}
                activeOpacity={0.8}
            >
                <LinearGradient colors={[Colors.primary, '#FF6B6B']} style={styles.orbGradient}>
                    <Ionicons name="sparkles" size={24} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>

            <Modal visible={open} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <SafeAreaView style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {/* Header */}
                            <View style={styles.modalHeader}>
                                <View style={styles.headerTitleRow}>
                                    <LinearGradient colors={[Colors.primary, '#8e44ad']} style={styles.miniIcon}>
                                        <Ionicons name="sparkles" size={14} color="#fff" />
                                    </LinearGradient>
                                    <View>
                                        <Text style={styles.brandTitle}>Walia AI Companion</Text>
                                        <Text style={styles.stepIndicator}>STEP {step} OF 3</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={reset} style={styles.closeBtn}>
                                    <Ionicons name="close" size={20} color="rgba(255,255,255,0.6)" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView contentContainerStyle={styles.scrollContent}>
                                {!isPro && hasFreeWeeklyUsed ? (
                                    <View style={styles.limitContainer}>
                                        <View style={styles.limitIcon}>
                                            <Ionicons name="lock-closed" size={32} color="#FF6B6B" />
                                        </View>
                                        <Text style={styles.limitTitle}>Free Limit Reached</Text>
                                        <Text style={styles.limitText}>
                                            You've used your 1 free session this week. Upgrade to Pro for unlimited AI sessions in your chats!
                                        </Text>
                                        <TouchableOpacity style={styles.upgradeBtn}>
                                            <Text style={styles.upgradeText}>Go Pro</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <>
                                        {step === 1 && (
                                            <View style={styles.stepContainer}>
                                                <Text style={styles.stepTitle}>Select AI Persona Mode</Text>
                                                <View style={styles.grid}>
                                                    {MODES.map(m => (
                                                        <TouchableOpacity key={m} onPress={() => { setMode(m); setStep(2); }} style={styles.gridItem}>
                                                            <Text style={styles.gridText}>{m}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>
                                        )}
                                        {step === 2 && renderLevelStep()}
                                        {step === 3 && renderTimeStep()}
                                    </>
                                )}
                            </ScrollView>
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    orb: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    orbGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        width: '100%',
    },
    modalContent: {
        backgroundColor: '#121212',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        minHeight: 400,
        maxHeight: '90%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    miniIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandTitle: {
        color: '#fff',
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
    },
    stepIndicator: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        fontWeight: FontWeight.heavy,
        letterSpacing: 1,
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: Spacing.xl,
        paddingBottom: 40,
    },
    stepContainer: {
        width: '100%',
    },
    stepTitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        marginBottom: Spacing.lg,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    backText: {
        fontSize: 12,
        marginLeft: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    gridItem: {
        width: (SCREEN_WIDTH - 64) / 2,
        backgroundColor: 'rgba(255,255,255,0.04)',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    gridText: {
        color: '#fff',
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
    },
    itemBtn: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        padding: 16,
        borderRadius: BorderRadius.xl,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    itemBtnActive: {
        borderColor: Colors.primary,
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
    },
    itemText: {
        color: '#fff',
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    proBadge: {
        backgroundColor: 'rgba(255, 171, 0, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    proBadgeText: {
        color: '#FFAB00',
        fontSize: 9,
        fontWeight: FontWeight.heavy,
    },
    startBtn: {
        marginTop: 20,
    },
    startGradient: {
        height: 56,
        borderRadius: BorderRadius.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    startBtnText: {
        color: '#fff',
        fontSize: FontSize.md,
        fontWeight: FontWeight.heavy,
    },
    limitContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    limitIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(255, 107, 107, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    limitTitle: {
        color: '#fff',
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        marginBottom: 12,
    },
    limitText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: FontSize.sm,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
    upgradeBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 48,
        paddingVertical: 14,
        borderRadius: BorderRadius.pill,
    },
    upgradeText: {
        color: '#000',
        fontWeight: FontWeight.heavy,
        fontSize: FontSize.sm,
    }
});
