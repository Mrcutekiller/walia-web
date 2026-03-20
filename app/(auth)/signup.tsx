import { Input } from '@/components/ui/Input';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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
    { title: 'Where are you from?', subtitle: 'We\'ll tailor content for your region' },
    { title: 'Your study level?', subtitle: 'Walia will personalize content for you' },
    { title: 'What\'s your goal?', subtitle: 'We\'ll tailor the experience just for you' },
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
    const [avatar, setAvatar] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { uploadAvatar } = useAuth();

    const canNext = [
        name.trim().length > 0,
        email.trim() && username.trim() && password.length >= 6,
        age.trim() && gender !== '',
        country !== '' && phone.trim().length >= 10,
        level !== '',
        goal !== '',
        true, // Avatar is optional
    ][step];

    const handleNext = async () => {
        if (step < STEPS.length - 1) { setStep(step + 1); return; }
        setLoading(true);
        try {
            await signup({ name, email, username, phone, level, goal, age, gender, country }, password);
            if (avatar) {
                try {
                    await uploadAvatar(avatar);
                } catch (imgErr) {
                    console.error('Avatar upload failed:', imgErr);
                    // Don't block signup if only avatar upload fails
                }
            }
            router.replace('/(auth)/features');
        } catch (e: any) {
            Alert.alert('Signup Issue', e.message);
        } finally { setLoading(false); }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
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

                {/* Progress dots */}
                <View style={styles.progressRow}>
                    {STEPS.map((_, i) => (
                        <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive, i === step && styles.progressDotCurrent]} />
                    ))}
                </View>

                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                        <Text style={styles.stepLabel}>Step {step + 1} of {STEPS.length}</Text>
                        <Text style={styles.title}>{STEPS[step].title}</Text>
                        <Text style={styles.subtitle}>{STEPS[step].subtitle}</Text>

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

                        {step === 4 && (
                            <View style={styles.chipGrid}>
                                {LEVELS.map(l => (
                                    <TouchableOpacity key={l} style={[styles.chip, level === l && styles.chipActive]} onPress={() => setLevel(l)}>
                                        <Text style={[styles.chipText, level === l && styles.chipTextActive]}>{l}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

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

                        {step === 6 && (
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
    progressRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.xl },
    progressDot: { width: 28, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)' },
    progressDotActive: { backgroundColor: 'rgba(255,255,255,0.4)' },
    progressDotCurrent: { backgroundColor: '#fff', width: 48 },
    content: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.huge },
    stepLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Spacing.sm },
    title: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: Spacing.sm, lineHeight: 38 },
    subtitle: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.5)', marginBottom: Spacing.xxl, lineHeight: 22, fontWeight: '600' },
    fields: { gap: Spacing.md },
    darkInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: BorderRadius.xl },
    darkLabel: { color: 'rgba(255,255,255,0.6)', fontWeight: '700' },
    darkInputText: { color: '#fff' },
    chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
    chip: { borderRadius: BorderRadius.pill, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, backgroundColor: 'rgba(255,255,255,0.03)' },
    chipActive: { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' },
    chipText: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
    chipTextActive: { color: '#fff', fontWeight: '800' },
    goalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
    goalCard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: BorderRadius.xl, padding: Spacing.xl, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', gap: Spacing.sm },
    goalCardActive: { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' },
    goalEmoji: { fontSize: 32 },
    goalLabel: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', textAlign: 'center', fontWeight: '700' },
    goalLabelActive: { color: '#fff' },
    avatarPickerSection: { alignItems: 'center', paddingTop: Spacing.xl },
    avatarMain: { width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    avatarEdit: { width: 136, height: 136, borderRadius: 68 },
    avatarPlaceholder: { alignItems: 'center', gap: Spacing.xs },
    avatarPlaceholderText: { color: 'rgba(255,255,255,0.4)', fontSize: FontSize.sm, fontWeight: '700' },
    editBadge: { position: 'absolute', bottom: 5, right: 5, width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#000' },
    avatarHint: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: Spacing.xxl, paddingHorizontal: Spacing.xl, lineHeight: 20, fontWeight: '500' },
    footer: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.xl, gap: Spacing.md },
    nextBtn: { backgroundColor: '#fff', borderRadius: BorderRadius.pill, paddingVertical: 18, alignItems: 'center', shadowColor: '#fff', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
    nextBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.1)', shadowOpacity: 0 },
    nextBtnText: { color: '#000', fontSize: FontSize.lg, fontWeight: '900' },
    signinLink: { alignItems: 'center' },
    signinText: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
    signinBold: { color: '#fff', fontWeight: '900' },
});
