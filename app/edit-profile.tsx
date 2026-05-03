import { Input } from '@/components/ui/Input';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AVATARS = ['👦', '👧', '👨', '👩', '🤖', '👽', '👾', '🦊', '🐼', '🦁', '🦉', '🐸'];

export default function EditProfileScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { user, updateProfile } = useAuth();
    
    const [name, setName] = useState(user?.name || '');
    const [username, setUsername] = useState(user?.username || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [avatar, setAvatar] = useState(user?.photoURL || AVATARS[0]);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateProfile({
                name,
                username,
                bio,
                photoURL: avatar
            });
            router.back();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const bg = isDark ? colors.background : '#F8FAFC';
    const cardBg = isDark ? colors.surface : '#FFFFFF';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
            <View style={[styles.header, { borderBottomColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.saveBtn}>
                    {loading ? (
                        <ActivityIndicator color="#6366F1" size="small" />
                    ) : (
                        <Text style={styles.saveBtnText}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.content}>
                    
                    {/* Avatar Selection */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>AVATAR</Text>
                        <View style={[styles.avatarCard, { backgroundColor: cardBg, borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                            <View style={styles.currentAvatarWrap}>
                                <View style={[styles.currentAvatarBox, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
                                    <Text style={styles.currentAvatarEmoji}>{avatar}</Text>
                                </View>
                            </View>
                            
                            <View style={styles.avatarGrid}>
                                {AVATARS.map((emoji) => (
                                    <TouchableOpacity 
                                        key={emoji} 
                                        style={[
                                            styles.avatarOption, 
                                            { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
                                            avatar === emoji && { borderColor: '#6366F1', borderWidth: 2, backgroundColor: '#6366F120' }
                                        ]}
                                        onPress={() => setAvatar(emoji)}
                                    >
                                        <Text style={styles.avatarEmoji}>{emoji}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Profile Info */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>PROFILE INFO</Text>
                        <View style={[styles.infoCard, { backgroundColor: cardBg, borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                            <Input
                                label="Name"
                                value={name}
                                onChangeText={setName}
                                placeholder="Your Name"
                                style={{ marginBottom: Spacing.lg }}
                            />
                            <Input
                                label="Username"
                                value={username}
                                onChangeText={setUsername}
                                placeholder="@username"
                                style={{ marginBottom: Spacing.lg }}
                            />
                            <Input
                                label="Bio"
                                value={bio}
                                onChangeText={setBio}
                                placeholder="A short bio about yourself..."
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: Spacing.xl, 
        paddingVertical: Spacing.md, 
        borderBottomWidth: 1 
    },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: FontSize.md, fontWeight: FontWeight.heavy },
    saveBtn: { paddingHorizontal: 16, paddingVertical: 8 },
    saveBtnText: { color: '#6366F1', fontWeight: 'bold', fontSize: FontSize.md },
    content: { padding: Spacing.xl, paddingBottom: 100 },
    section: { marginBottom: Spacing.xxl },
    sectionLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 12, marginLeft: 4, textTransform: 'uppercase' },
    avatarCard: { borderRadius: 24, borderWidth: 1, padding: 20 },
    currentAvatarWrap: { alignItems: 'center', marginBottom: 20 },
    currentAvatarBox: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
    currentAvatarEmoji: { fontSize: 40 },
    avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
    avatarOption: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
    avatarEmoji: { fontSize: 24 },
    infoCard: { borderRadius: 24, borderWidth: 1, padding: 20 },
});
