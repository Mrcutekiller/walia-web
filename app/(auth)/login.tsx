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
                            <Text style={styles.title}>Welcome back</Text>
                            <Text style={styles.subtitle}>Sign in to continue to Walia.</Text>
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
                            <Text style={styles.dividerText}>or email</Text>
                            <View style={styles.divider} />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    bgBase: { ...StyleSheet.absoluteFillObject, backgroundColor: '#fff' },
    bgGlow: { position: 'absolute', width: 350, height: 350, borderRadius: 175, backgroundColor: '#000', opacity: 0.02, top: -120, alignSelf: 'center' },
    content: { paddingHorizontal: 32, paddingVertical: Spacing.xl, paddingBottom: Spacing.huge },
    backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FA', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl, borderWidth: 1, borderColor: '#EDF2F7' },
    logoSection: { alignItems: 'flex-start', marginBottom: 32 },
    logoRing: { 
        width: 44, height: 44, borderRadius: 10, 
        backgroundColor: '#fff', overflow: 'hidden', 
        borderWidth: 1, borderColor: '#EDF2F7', 
        marginBottom: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
    },
    logoImg: { width: 32, height: 32 },
    title: { fontSize: 30, fontFamily: 'Inter_900Black', color: '#000', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#718096', fontFamily: 'Inter_500Medium' },
    form: { gap: 20, marginBottom: 24 },
    errorBox: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8, 
        backgroundColor: '#FFF5F5', 
        borderRadius: 16, 
        padding: 14, 
        borderWidth: 1, 
        borderColor: '#FED7D7' 
    },
    errorText: { color: '#C53030', fontSize: 13, fontFamily: 'Inter_600SemiBold', flex: 1 },
    inputBlock: { gap: 8 },
    inputLabel: { fontSize: 10, fontFamily: 'Inter_900Black', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: 1.5, marginLeft: 4 },
    inputRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F8F9FA', 
        borderRadius: 20, 
        paddingHorizontal: 16, 
        borderWidth: 1, 
        borderColor: '#EDF2F7', 
        minHeight: 56 
    },
    inputIcon: { marginRight: 12, opacity: 0.4 },
    textInput: { flex: 1, fontSize: 15, color: '#000', fontFamily: 'Inter_500Medium', paddingVertical: 12 },
    forgotBtn: { alignSelf: 'flex-end', marginTop: -8 },
    forgotText: { fontSize: 12, color: '#000', fontFamily: 'Inter_700Bold', opacity: 0.8 },
    loginBtn: { 
        backgroundColor: '#000', 
        borderRadius: 20, 
        paddingVertical: 18, 
        alignItems: 'center', 
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24, 
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 15, elevation: 6 
    },
    loginBtnText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_900Black' },
    signupLink: { alignItems: 'center', marginBottom: 32 },
    signupText: { fontSize: 14, color: '#718096', fontFamily: 'Inter_500Medium' },
    signupBold: { color: '#000', fontFamily: 'Inter_900Black' },
    dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
    divider: { flex: 1, height: 1, backgroundColor: '#EDF2F7' },
    dividerText: { fontSize: 10, color: '#A0AEC0', fontFamily: 'Inter_800ExtraBold', textTransform: 'uppercase', letterSpacing: 1.5 },
    socialButtons: { gap: 12 },
    socialBtn: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 12, 
        paddingVertical: 16, 
        borderRadius: 20, 
        borderWidth: 1, 
        borderColor: '#EDF2F7', 
        backgroundColor: '#fff' 
    },
    socialBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#000' },
});
