import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    Image, KeyboardAvoidingView, Platform, ScrollView,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const router = useRouter();
    const { login, loginWithGoogle, resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email.trim() || !password) { setError('Please fill all fields'); return; }
        setLoading(true); setError('');
        try {
            await login(email, password);
        } catch (e: any) {
            setError(e.message);
        } finally { setLoading(false); }
    };

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            setError('Please enter your email first');
            return;
        }
        try {
            await resetPassword(email);
            Alert.alert('Success', 'Password reset email sent. Please check your inbox.');
        } catch (e: any) {
            setError(e.message || 'Failed to send reset email');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={StyleSheet.absoluteFill}>
                <View style={styles.bgBase} />
                <View style={styles.bgGlow} />
            </View>

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                        {/* Back */}
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={22} color="rgba(255,255,255,0.8)" />
                        </TouchableOpacity>

                        {/* Logo + Title */}
                        <View style={styles.logoSection}>
                            <View style={styles.logoRing}>
                                <Image source={require('../../assets/images/walia-logo.png')} style={styles.logoImg} resizeMode="contain" />
                            </View>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Sign in to continue with Walia</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            {error ? (
                                <View style={styles.errorBox}>
                                    <Ionicons name="alert-circle" size={18} color="#FF6B6B" />
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}

                            <View style={styles.inputBlock}>
                                <Text style={styles.inputLabel}>Email</Text>
                                <View style={styles.inputRow}>
                                    <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="you@email.com"
                                        placeholderTextColor="rgba(255,255,255,0.25)"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.inputLabel}>Password</Text>
                                <View style={styles.inputRow}>
                                    <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.textInput, { flex: 1 }]}
                                        placeholder="Your password"
                                        placeholderTextColor="rgba(255,255,255,0.25)"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="rgba(255,255,255,0.4)" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.forgotBtn} onPress={handleForgotPassword}>
                                <Text style={styles.forgotText}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            style={[styles.loginBtn, loading && { opacity: 0.7 }]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Text style={styles.loginBtnText}>{loading ? 'Signing in...' : 'Sign In →'}</Text>
                        </TouchableOpacity>

                        {/* Sign Up Link */}
                        <TouchableOpacity style={styles.signupLink} onPress={() => router.push('/(auth)/signup')}>
                            <Text style={styles.signupText}>Don't have an account? <Text style={styles.signupBold}>Sign Up</Text></Text>
                        </TouchableOpacity>

                        <View style={styles.socialButtons}>
                            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#fff', borderColor: '#ddd' }]} onPress={loginWithGoogle}>
                                <Ionicons name="logo-google" size={24} color="#DB4437" />
                                <Text style={[styles.socialBtnText, { color: '#000' }]}>Sign in with Google</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Or divider */}
                        <View style={styles.dividerRow}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>Walia AI</Text>
                            <View style={styles.divider} />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    bgBase: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
    bgGlow: { position: 'absolute', width: 350, height: 350, borderRadius: 175, backgroundColor: '#fff', opacity: 0.05, top: -120, alignSelf: 'center' },
    content: { paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.xl, paddingBottom: Spacing.huge },
    backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
    logoSection: { alignItems: 'center', marginBottom: Spacing.xxxl },
    logoRing: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#000', overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', marginBottom: Spacing.xl },
    logoImg: { width: 80, height: 80 },
    title: { fontSize: 34, fontWeight: '900', color: '#fff', marginBottom: Spacing.sm },
    subtitle: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
    form: { gap: Spacing.lg, marginBottom: Spacing.xl },
    errorBox: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: 'rgba(255,107,107,0.12)', borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: 'rgba(255,107,107,0.3)' },
    errorText: { color: '#FF6B6B', fontSize: FontSize.sm, flex: 1 },
    inputBlock: { gap: Spacing.sm },
    inputLabel: { fontSize: FontSize.sm, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 0.3 },
    inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: BorderRadius.xl, paddingHorizontal: Spacing.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', minHeight: 54 },
    inputIcon: { marginRight: Spacing.md },
    textInput: { flex: 1, fontSize: FontSize.md, color: '#fff', paddingVertical: Spacing.md },
    forgotBtn: { alignSelf: 'flex-end' },
    forgotText: { fontSize: FontSize.sm, color: '#fff', fontWeight: '600', opacity: 0.6 },
    loginBtn: { backgroundColor: '#fff', borderRadius: BorderRadius.pill, paddingVertical: 18, alignItems: 'center', marginBottom: Spacing.xl, shadowColor: '#fff', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
    loginBtnText: { color: '#000', fontSize: FontSize.lg, fontWeight: '900' },
    signupLink: { alignItems: 'center', marginBottom: Spacing.xxl },
    signupText: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
    signupBold: { color: '#fff', fontWeight: '900' },
    dividerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, marginBottom: Spacing.xl },
    divider: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
    dividerText: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.3)', fontWeight: '700' },
    socialButtons: { marginBottom: Spacing.xl },
    socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.md, paddingVertical: 16, borderRadius: BorderRadius.pill, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)' },
    socialBtnText: { fontSize: FontSize.md, fontWeight: '700', color: '#fff' },
    demoBtn: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: BorderRadius.pill, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    demoBtnText: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.md, fontWeight: '700' },
});
