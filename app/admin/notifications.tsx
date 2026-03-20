import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';

export default function AdminNotificationsScreen() {
    const { colors, isDark } = useTheme();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetType, setTargetType] = useState<'all' | 'specific'>('all');
    const [targetUserId, setTargetUserId] = useState('');
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!title.trim() || !message.trim()) {
            Alert.alert('Error', 'Title and message are required.');
            return;
        }
        if (targetType === 'specific' && !targetUserId.trim()) {
            Alert.alert('Error', 'User ID is required for targeted specific messages.');
            return;
        }

        setSending(true);
        try {
            await addDoc(collection(db, 'notifications'), {
                userId: targetType === 'all' ? 'all' : targetUserId.trim(),
                title: title.trim(),
                message: message.trim(),
                sender: 'admin',
                createdAt: serverTimestamp(),
                read: false,
            });
            Alert.alert('Success', 'Broadcast sent successfully!');
            setTitle('');
            setMessage('');
            setTargetUserId('');
        } catch (error) {
            Alert.alert('Error', 'Failed to send notification.');
        } finally {
            setSending(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.scroll}>
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
                
                <View style={styles.segmentControl}>
                    <TouchableOpacity 
                        style={[styles.segmentBtn, targetType === 'all' && { backgroundColor: isDark ? '#FFFFFF' : '#000000' }]}
                        onPress={() => setTargetType('all')}
                    >
                        <Text style={[styles.segmentText, { color: targetType === 'all' ? (isDark ? '#000' : '#fff') : colors.textTertiary }]}>All Users</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.segmentBtn, targetType === 'specific' && { backgroundColor: isDark ? '#FFFFFF' : '#000000' }]}
                        onPress={() => setTargetType('specific')}
                    >
                        <Text style={[styles.segmentText, { color: targetType === 'specific' ? (isDark ? '#000' : '#fff') : colors.textTertiary }]}>Specific User</Text>
                    </TouchableOpacity>
                </View>

                {targetType === 'specific' && (
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>USER ID</Text>
                        <TextInput 
                            style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.divider }]}
                            placeholder="Paste exact User ID here"
                            placeholderTextColor={colors.textTertiary}
                            value={targetUserId}
                            onChangeText={setTargetUserId}
                        />
                    </View>
                )}

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>TITLE</Text>
                    <TextInput 
                        style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.divider }]}
                        placeholder="e.g. New Feature Released!"
                        placeholderTextColor={colors.textTertiary}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>MESSAGE</Text>
                    <TextInput 
                        style={[styles.textArea, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.divider }]}
                        placeholder="Write your announcement..."
                        placeholderTextColor={colors.textTertiary}
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.submitBtn, { backgroundColor: isDark ? '#FFFFFF' : '#000000' }]}
                    onPress={handleSend}
                    disabled={sending}
                >
                    {sending ? (
                        <ActivityIndicator size="small" color={isDark ? '#000000' : '#FFFFFF'} />
                    ) : (
                        <>
                            <Ionicons name="send" size={18} color={isDark ? '#000' : '#fff'} />
                            <Text style={[styles.submitText, { color: isDark ? '#000' : '#fff' }]}>SEND BROADCAST</Text>
                        </>
                    )}
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: Spacing.lg, paddingBottom: 100 },
    card: { padding: Spacing.lg, borderRadius: 24, borderWidth: 1, gap: Spacing.xl },
    segmentControl: { flexDirection: 'row', backgroundColor: '#88888820', borderRadius: 20, padding: 4 },
    segmentBtn: { flex: 1, paddingVertical: 12, borderRadius: 16, alignItems: 'center' },
    segmentText: { fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
    inputGroup: { gap: 8 },
    label: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
    input: { height: 50, borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, fontSize: 14, fontWeight: 'bold' },
    textArea: { height: 120, borderRadius: 16, paddingHorizontal: 16, paddingTop: 16, borderWidth: 1, fontSize: 14, fontWeight: 'bold' },
    submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, borderRadius: 28, gap: 8, marginTop: Spacing.sm },
    submitText: { fontSize: 14, fontWeight: FontWeight.heavy, letterSpacing: 1 },
});
