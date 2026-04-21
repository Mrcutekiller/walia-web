import { Input } from '@/components/ui/Input';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image, KeyboardAvoidingView, Platform, ScrollView,
    StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STEPS = [
    { title: "What's your name?", subtitle: 'How should Walia call you?' },
    { title: 'Create your account', subtitle: 'Choose a username and set your password' },
    { title: 'A bit more about you', subtitle: 'Help us personalize your experience' },
    { title: 'Where are you from?', subtitle: "We'll tailor content for your region" },
    { title: 'Your study level?', subtitle: 'Walia will personalize content for you' },
    { title: "What's your goal?", subtitle: "We'll tailor the experience just for you" },
    { title: 'What do you study?', subtitle: 'Pick all the subjects that apply' },
    { title: 'Your study style?', subtitle: 'How do you learn best?' },
    { title: 'How did you hear about us?', subtitle: 'Help us understand how you found Walia' },
    { title: 'Profile Picture', subtitle: 'How should other students see you?' },
];

const GENDERS = ['Male', 'Female', 'Other', 'Private'];
const COUNTRIES = ['Ethiopia', 'USA', 'UK', 'Canada', 'Germany', 'UAE', 'Kenya', 'Other'];
const LEVELS = ['High School', 'Undergraduate', 'Graduate', 'Self-Learning', 'Professional'];
const GOALS = [
    { emoji: '📚', label: 'Ace my exams' },
    { emoji: '💼', label: 'Career prep' },
    { emoji: '🌍', label: 'Learn new skills' },
    { emoji: '🔬', label: 'Research' },
    { emoji: '🎓', label: 'Get my degree' },
    { emoji: '🚀', label: 'Personal growth' },
];
const SUBJECTS = [
    { emoji: '🔢', label: 'Mathematics' },
    { emoji: '🔭', label: 'Science' },
    { emoji: '⚗️', label: 'Chemistry' },
    { emoji: '🧬', label: 'Biology' },
    { emoji: '💻', label: 'Computer Science' },
    { emoji: '📖', label: 'Literature' },
    { emoji: '🌐', label: 'History' },
    { emoji: '💰', label: 'Economics' },
    { emoji: '🗣️', label: 'Languages' },
    { emoji: '🎨', label: 'Arts & Design' },
    { emoji: '⚖️', label: 'Law' },
    { emoji: '🧠', label: 'Psychology' },
    { emoji: '🏥', label: 'Medicine' },
    { emoji: '📊', label: 'Business' },
    { emoji: '🌱', label: 'Agriculture' },
    { emoji: '🔧', label: 'Engineering' },
];
const STUDY_STYLES = [
    { emoji: '🎧', label: 'Solo focus', desc: 'I study alone, undistracted' },
    { emoji: '👥', label: 'Study groups', desc: 'I learn better with others' },
    { emoji: '⚡', label: 'Short sessions', desc: 'Quick bursts throughout the day' },
    { emoji: '📅', label: 'Long sessions', desc: 'Deep dives, 2+ hours at a time' },
    { emoji: '🌙', label: 'Night owl', desc: 'I study best late at night' },
    { emoji: '☀️', label: 'Early bird', desc: 'Morning is my peak time' },
];
const REFERRAL_SOURCES = [
    { emoji: '📲', label: 'Social Media', desc: 'TikTok, Instagram, X/Twitter' },
    { emoji: '👫', label: 'Friend or Family', desc: 'Someone recommended it' },
    { emoji: '🔍', label: 'Google Search', desc: 'Found it while searching' },
    { emoji: '📺', label: 'YouTube', desc: 'Saw a video or ad' },
    { emoji: '🏫', label: 'School / Teacher', desc: 'Recommended by my school' },
    { emoji: '📰', label: 'Blog / Article', desc: 'Read about it online' },
    { emoji: '📻', label: 'Radio / TV', desc: 'Heard an ad' },
    { emoji: '🤷', label: 'Other', desc: 'Something else' },
];

export default function SignupScreen() {
    const router = useRouter();
    const { signup } = useAuth();
    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [country, setCountry] = useState('');
    const [level, setLevel] = useState('');
    const [goal, setGoal] = useState('');
    const [subjects, setSubjects] = useState<string[]>([]);
    const [studyStyle, setStudyStyle] = useState('');
    const [referralSource, setReferralSource] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { uploadAvatar } = useAuth();

    // Timeout fallback - prevent infinite loading
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (loading) {
            timeout = setTimeout(() => {
                setLoading(false);
                setError('Request timed out. Please try again.');
            }, 20000);
        }
        return () => clearTimeout(timeout);
    }, [loading]);

    const toggleSubject = (label: string) => {
        setSubjects(prev =>
            prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
        );
    };

    const canNext = [
        name.trim().length > 0,                                  // 0
        email.trim() && username.trim() && password.length >= 6, // 1
        age.trim() && gender !== '',                             // 2
        country !== '' && phone.trim().length >= 5,              // 3
        level !== '',                                            // 4
        goal !== '',                                             // 5
        subjects.length > 0,                                     // 6
        studyStyle !== '',                                        // 7
        referralSource !== '',                                    // 8
        true,                                                    // 9 avatar optional
    ][step];

    const handleNext = async () => {
        if (step < STEPS.length - 1) { setStep(step + 1); return; }
        setLoading(true);
        setError('');
        try {
            await signup({
                name, email, username, phone, level, goal, age, gender, country,
                subjects, studyStyle, referralSource,
            }, password);
            if (avatar) {
                try { await uploadAvatar(avatar); } catch (imgErr) {
                    console.error('Avatar upload failed:', imgErr);
                }
            }
            // Redirect to AI chat after successful signup
            router.replace('/(tabs)/ai');
        } catch (e: any) {
            setError(e.message || 'Signup failed. Please try again.');
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        if (!result.canceled) setAvatar(result.assets[0].uri);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={StyleSheet.absoluteFill}>
                <View style={styles.bgBase} />
                <View style={styles.bgGlow} />
            </View>

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={22} color="rgba(255,255,255,0.8)" />
                    </TouchableOpacity>
                    <Image source={require('../../assets/images/walia-logo.png')} style={styles.headerLogo} resizeMode="contain" />
                    <View style={{ width: 38 }} />
                </View>

                {/* Progress */}
                <View style={styles.progressRow}>
                    {STEPS.map((_, i) => (
                        <View key={i} style={[
                            styles.progressDot,
                            i <= step && styles.progressDotActive,
                            i === step && styles.progressDotCurrent
                        ]} />
                    ))}
                </View>

                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                        <Text style={styles.stepLabel}>Step {step + 1} of {STEPS.length}</Text>
                        <Text style={styles.title}>{STEPS[step].title}</Text>
                        <Text style={styles.subtitle}>{STEPS[step].subtitle}</Text>
                        
                        {error ? (
                            <View style={styles.errorBox}>
                                <Ionicons name="alert-circle" size={18} color="#FF6B6B" />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        {/* ── Step 0: Name ── */}
                        {step === 0 && (
                            <View style={styles.fields}>
                                <Input
                                    label="Full Name"
                                    placeholder="e.g. Biruk Firk"
                                    value={name}
                                    onChangeText={setName}
                                    icon={<Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.6)" />}
                                    style={{ marginBottom: Spacing.md }}
                                    containerStyle={styles.darkInput}
                                    labelStyle={styles.darkLabel}
                                    inputStyle={styles.darkInputText}
                                />
                            </View>
                        )}

                        {/* ── Step 1: Account ── */}
                        {step === 1 && (
                            <View style={styles.fields}>
                                <Input label="Email" placeholder="you@email.com" value={email} onChangeText={setEmail} keyboardType="email-address"
                                    icon={<Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.6)" />}
                                    style={{ marginBottom: Spacing.md }} containerStyle={styles.darkInput} labelStyle={styles.darkLabel} inputStyle={styles.darkInputText} />
                                <Input label="Username" placeholder="@username" value={username} onChangeText={setUsername}
                                    icon={<Ionicons name="at-outline" size={20} color="rgba(255,255,255,0.6)" />}
                                    style={{ marginBottom: Spacing.md }} containerStyle={styles.darkInput} labelStyle={styles.darkLabel} inputStyle={styles.darkInputText} />
                                <Input label="Password" placeholder="Min. 6 characters" value={password} onChangeText={setPassword} secureTextEntry
                                    icon={<Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.6)" />}
                                    style={{ marginBottom: Spacing.md }} containerStyle={styles.darkInput} labelStyle={styles.darkLabel} inputStyle={styles.darkInputText} />
                            </View>
                        )}

                        {/* ── Step 2: Age & Gender ── */}
                        {step === 2 && (
                            <View style={styles.fields}>
                                <Input label="How old are you?" placeholder="e.g. 20" value={age} onChangeText={setAge} keyboardType="numeric"
                                    icon={<Ionicons name="calendar-outline" size={20} color="rgba(255,255,255,0.6)" />}
                                    style={{ marginBottom: Spacing.xl }} containerStyle={styles.darkInput} labelStyle={styles.darkLabel} inputStyle={styles.darkInputText} />
                                <Text style={[styles.darkLabel, { marginBottom: Spacing.sm, fontSize: FontSize.sm, fontWeight: '700' }]}>Gender</Text>
                                <View style={styles.chipGrid}>
                                    {GENDERS.map(g => (
                                        <TouchableOpacity key={g} style={[styles.chip, gender === g && styles.chipActive]} onPress={() => setGender(g)}>
                                            <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* ── Step 3: Country & Phone ── */}
                        {step === 3 && (
                            <View style={styles.fields}>
                                <Input label="Phone Number" placeholder="+251 ..." value={phone} onChangeText={setPhone} keyboardType="phone-pad"
                                    icon={<Ionicons name="call-outline" size={20} color="rgba(255,255,255,0.6)" />}
                                    style={{ marginBottom: Spacing.xl }} containerStyle={styles.darkInput} labelStyle={styles.darkLabel} inputStyle={styles.darkInputText} />
                                <Text style={[styles.darkLabel, { marginBottom: Spacing.sm, fontSize: FontSize.sm, fontWeight: '700' }]}>Country</Text>
                                <View style={styles.chipGrid}>
                                    {COUNTRIES.map(c => (
                                        <TouchableOpacity key={c} style={[styles.chip, country === c && styles.chipActive]} onPress={() => setCountry(c)}>
                                            <Text style={[styles.chipText, country === c && styles.chipTextActive]}>{c}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* ── Step 4: Level ── */}
                        {step === 4 && (
                            <View style={styles.chipGrid}>
                                {LEVELS.map(l => (
                                    <TouchableOpacity key={l} style={[styles.chip, level === l && styles.chipActive]} onPress={() => setLevel(l)}>
                                        <Text style={[styles.chipText, level === l && styles.chipTextActive]}>{l}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* ── Step 5: Goal ── */}
                        {step === 5 && (
                            <View style={styles.goalGrid}>
                                {GOALS.map(g => (
                                    <TouchableOpacity key={g.label} style={[styles.goalCard, goal === g.label && styles.goalCardActive]} onPress={() => setGoal(g.label)}>
                                        <Text style={styles.goalEmoji}>{g.emoji}</Text>
                                        <Text style={[styles.goalLabel, goal === g.label && styles.goalLabelActive]}>{g.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* ── Step 6: Subjects ── */}
                        {step === 6 && (
                            <>
                                <Text style={styles.multiHint}>Select all that apply</Text>
                                <View style={styles.subjectGrid}>
                                    {SUBJECTS.map(s => {
                                        const active = subjects.includes(s.label);
                                        return (
                                            <TouchableOpacity key={s.label} style={[styles.subjectCard, active && styles.subjectCardActive]} onPress={() => toggleSubject(s.label)}>
                                                <Text style={styles.subjectEmoji}>{s.emoji}</Text>
                                                <Text style={[styles.subjectLabel, active && styles.subjectLabelActive]}>{s.label}</Text>
                                                {active && <View style={styles.checkBadge}><Ionicons name="checkmark" size={10} color="#000" /></View>}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </>
                        )}

                        {/* ── Step 7: Study Style ── */}
                        {step === 7 && (
                            <View style={styles.styleGrid}>
                                {STUDY_STYLES.map(s => (
                                    <TouchableOpacity key={s.label} style={[styles.styleCard, studyStyle === s.label && styles.styleCardActive]} onPress={() => setStudyStyle(s.label)}>
                                        <Text style={styles.styleEmoji}>{s.emoji}</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.styleLabel, studyStyle === s.label && styles.styleLabelActive]}>{s.label}</Text>
                                            <Text style={styles.styleDesc}>{s.desc}</Text>
                                        </View>
                                        {studyStyle === s.label && <Ionicons name="checkmark-circle" size={22} color="#fff" />}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* ── Step 8: Referral Source ── */}
                        {step === 8 && (
                            <View style={styles.styleGrid}>
                                {REFERRAL_SOURCES.map(r => (
                                    <TouchableOpacity key={r.label} style={[styles.styleCard, referralSource === r.label && styles.styleCardActive]} onPress={() => setReferralSource(r.label)}>
                                        <Text style={styles.styleEmoji}>{r.emoji}</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.styleLabel, referralSource === r.label && styles.styleLabelActive]}>{r.label}</Text>
                                            <Text style={styles.styleDesc}>{r.desc}</Text>
                                        </View>
                                        {referralSource === r.label && <Ionicons name="checkmark-circle" size={22} color="#fff" />}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* ── Step 9: Avatar ── */}
                        {step === 9 && (
                            <View style={styles.avatarPickerSection}>
                                <TouchableOpacity style={styles.avatarMain} onPress={pickImage}>
                                    {avatar ? (
                                        <Image source={{ uri: avatar }} style={styles.avatarEdit} />
                                    ) : (
                                        <View style={styles.avatarPlaceholder}>
                                            <Ionicons name="camera-outline" size={40} color="rgba(255,255,255,0.4)" />
                                            <Text style={styles.avatarPlaceholderText}>Add Photo</Text>
                                        </View>
                                    )}
                                    <View style={styles.editBadge}>
                                        <Ionicons name="pencil" size={16} color="#fff" />
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.avatarHint}>A profile picture helps you connect with other students in the community.</Text>
                            </View>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.nextBtn, !canNext && styles.nextBtnDisabled]}
                        onPress={handleNext}
                        disabled={!canNext || loading}
                    >
                        <Text style={styles.nextBtnText}>
                            {loading ? 'Creating...' : step < STEPS.length - 1 ? 'Continue →' : 'Create Account 🚀'}
                        </Text>
                    </TouchableOpacity>
                    {step === 0 && (
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.signinLink}>
                            <Text style={styles.signinText}>Already have an account? <Text style={styles.signinBold}>Sign In</Text></Text>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    bgBase: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
    bgGlow: { position: 'absolute', width: 350, height: 350, borderRadius: 175, backgroundColor: '#fff', opacity: 0.05, top: -100, alignSelf: 'center' },
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingTop: Spacing.md },
    backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
    headerLogo: { width: 36, height: 36, backgroundColor: '#000', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 4, paddingVertical: Spacing.lg, flexWrap: 'wrap', paddingHorizontal: Spacing.xl },
    progressDot: { width: 20, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)' },
    progressDotActive: { backgroundColor: 'rgba(255,255,255,0.4)' },
    progressDotCurrent: { backgroundColor: '#fff', width: 32 },
    content: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.huge },
    stepLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Spacing.sm },
    errorBox: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8, 
        backgroundColor: 'rgba(255,75,75,0.15)', 
        borderRadius: 16, 
        padding: 14, 
        marginBottom: Spacing.md,
        borderWidth: 1, 
        borderColor: 'rgba(255,75,75,0.3)' 
    },
    errorText: { color: '#FF6B6B', fontSize: 13, fontWeight: '600', flex: 1 },
    title: { fontSize: 30, fontWeight: '800', color: '#fff', marginBottom: Spacing.sm, lineHeight: 36 },
    subtitle: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.5)', marginBottom: Spacing.xxl, lineHeight: 22, fontWeight: '600' },
    fields: { gap: Spacing.md },
    darkInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16 },
    darkLabel: { color: 'rgba(255,255,255,0.6)', fontWeight: '700' },
    darkInputText: { color: '#fff' },
    chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
    chip: { borderRadius: 999, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, backgroundColor: 'rgba(255,255,255,0.03)' },
    chipActive: { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' },
    chipText: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
    chipTextActive: { color: '#fff', fontWeight: '800' },
    goalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
    goalCard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: Spacing.xl, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', gap: Spacing.sm },
    goalCardActive: { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' },
    goalEmoji: { fontSize: 32 },
    goalLabel: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', textAlign: 'center', fontWeight: '700' },
    goalLabelActive: { color: '#fff' },
    multiHint: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.35)', fontWeight: '600', marginBottom: Spacing.lg, letterSpacing: 0.3 },
    subjectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    subjectCard: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 999, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: 'rgba(255,255,255,0.03)', position: 'relative' },
    subjectCardActive: { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.12)' },
    subjectEmoji: { fontSize: 16 },
    subjectLabel: { fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: '600' },
    subjectLabelActive: { color: '#fff', fontWeight: '800' },
    checkBadge: { position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    styleGrid: { gap: Spacing.md },
    styleCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: Spacing.lg, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
    styleCardActive: { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
    styleEmoji: { fontSize: 28 },
    styleLabel: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.7)', fontWeight: '700' },
    styleLabelActive: { color: '#fff' },
    styleDesc: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.35)', marginTop: 2, fontWeight: '500' },
    avatarPickerSection: { alignItems: 'center', paddingTop: Spacing.xl },
    avatarMain: { width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    avatarEdit: { width: 136, height: 136, borderRadius: 68 },
    avatarPlaceholder: { alignItems: 'center', gap: Spacing.xs },
    avatarPlaceholderText: { color: 'rgba(255,255,255,0.4)', fontSize: FontSize.sm, fontWeight: '700' },
    editBadge: { position: 'absolute', bottom: 5, right: 5, width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#000' },
    avatarHint: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: Spacing.xxl, paddingHorizontal: Spacing.xl, lineHeight: 20, fontWeight: '500' },
    footer: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.xl, gap: Spacing.md },
    nextBtn: { backgroundColor: '#fff', borderRadius: 999, paddingVertical: 18, alignItems: 'center', shadowColor: '#fff', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
    nextBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.1)', shadowOpacity: 0 },
    nextBtnText: { color: '#000', fontSize: FontSize.lg, fontWeight: '900' },
    signinLink: { alignItems: 'center' },
    signinText: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
    signinBold: { color: '#fff', fontWeight: '900' },
});
