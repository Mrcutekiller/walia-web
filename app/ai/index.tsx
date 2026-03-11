import { BorderRadius, Colors, FontSize, FontWeight, Shadow, Spacing } from '@/constants/theme';
import { AI_CHATS } from '@/store/data';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AIChatListScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>AI Assistant 🤖</Text>
                <View style={{ width: 24 }} />
            </View>

            <TouchableOpacity style={[styles.newChat, Shadow.md]} onPress={() => router.push('/ai/new' as any)}>
                <View style={styles.newChatIcon}>
                    <Ionicons name="add" size={28} color={Colors.primary} />
                </View>
                <View>
                    <Text style={styles.newChatTitle}>Start New Chat</Text>
                    <Text style={styles.newChatDesc}>Ask me anything about your studies</Text>
                </View>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Recent Conversations</Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
                {AI_CHATS.map(c => (
                    <TouchableOpacity key={c.id} style={[styles.chatItem, Shadow.sm]} onPress={() => router.push(`/ai/${c.id}` as any)}>
                        <View style={styles.chatIcon}>
                            <Text style={{ fontSize: 24 }}>🤖</Text>
                        </View>
                        <View style={styles.chatInfo}>
                            <Text style={styles.chatTitle}>{c.title}</Text>
                            <Text style={styles.chatLastMsg} numberOfLines={1}>{c.lastMessage}</Text>
                        </View>
                        <Text style={styles.chatTime}>{c.timestamp}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
    title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
    newChat: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, marginHorizontal: Spacing.xl, backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.xl, marginBottom: Spacing.xxl },
    newChatIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
    newChatTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
    newChatDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
    sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textSecondary, marginHorizontal: Spacing.xl, marginBottom: Spacing.md },
    list: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.huge },
    chatItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md },
    chatIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
    chatInfo: { flex: 1, marginLeft: Spacing.md },
    chatTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
    chatLastMsg: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
    chatTime: { fontSize: FontSize.xs, color: Colors.textTertiary },
});
