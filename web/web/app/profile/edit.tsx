import { Avatar } from '@/components/ui/Avatar';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [username, setUsername] = useState(user?.username || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [bio, setBio] = useState(user?.bio || '');

    const handleSave = async () => {
        await updateProfile({ name, email, username, phone, bio });
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Ionicons name="checkmark" size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarSection}>
                    <Avatar emoji="🧑‍🎓" size={90} />
                    <TouchableOpacity style={styles.changeAvatarBtn}>
                        <Ionicons name="camera" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={Colors.textTertiary} />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>E mail address</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="your@email.com" placeholderTextColor={Colors.textTertiary} keyboardType="email-address" />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>User name</Text>
                    <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="@username" placeholderTextColor={Colors.textTertiary} />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Bio</Text>
                    <TextInput style={[styles.input, styles.bioInput]} value={bio} onChangeText={setBio} placeholder="Tell us about yourself" placeholderTextColor={Colors.textTertiary} multiline />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Phone number</Text>
                    <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+1 234 567 890" placeholderTextColor={Colors.textTertiary} keyboardType="phone-pad" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
    headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text },
    content: { padding: Spacing.xl },
    avatarSection: { alignItems: 'center', marginBottom: Spacing.xxl, position: 'relative' },
    changeAvatarBtn: { position: 'absolute', bottom: 0, right: '35%', width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.background },
    field: { marginBottom: Spacing.xl },
    label: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: Spacing.sm },
    input: { borderBottomWidth: 1, borderBottomColor: Colors.border, paddingVertical: Spacing.md, fontSize: FontSize.md, color: Colors.text },
    bioInput: { minHeight: 60, textAlignVertical: 'top' },
});
