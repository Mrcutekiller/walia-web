import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { AI_PROVIDERS, AIMessage, AIProvider, askAI } from '@/services/ai';
import { AI_CHATS } from '@/store/data';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator, Image, KeyboardAvoidingView, Platform,
    ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ChatMessage = { id: string; role: 'user' | 'ai'; text: string; timestamp: string; provider?: AIProvider };

export default function AIConversationScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const chat = AI_CHATS.find(c => c.id === id);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>(
        (chat?.messages || []).map(m => ({ id: m.id, role: m.role === 'ai' ? 'ai' : 'user', text: m.text, timestamp: m.timestamp }))
    );
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    const buildHistory = (msgs: ChatMessage[]): AIMessage[] =>
        msgs.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));

    const sendMessage = async (text?: string) => {
        const userText = text ?? message;
        if (!userText.trim() || isLoading) return;
        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: userText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setMessage('');
        setIsLoading(true);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        try {
            const { text: aiText, provider } = await askAI(userText, buildHistory(messages), 'auto');
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: aiText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), provider }]);
        } catch (e: any) {
            setMessages(prev => [...prev, { id: (Date.now() + 2).toString(), role: 'ai', text: `⚠️ Couldn't reach Walia AI right now.\n\n${e.message}`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } finally {
            setIsLoading(false);
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient colors={isDark ? ['#1A1A2E', '#12123A'] : ['#6C63FF', '#5A52E0']} style={styles.headerGradient}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                            <Ionicons name="arrow-back" size={22} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.headerCenter}>
                            <View style={styles.headerLogo}>
                                <Image source={require('../../assets/images/walia-logo.png')} style={{ width: 32, height: 32 }} resizeMode="contain" />
                            </View>
                            <View>
                                <Text style={styles.headerTitle}>{chat?.title || 'Walia AI'}</Text>
                                <Text style={styles.headerSub}>{isLoading ? '⏳ Thinking...' : '✨ Gemini · Online'}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.headerBtn}>
                            <Ionicons name="share-outline" size={20} color="rgba(255,255,255,0.8)" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
                <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={{ padding: Spacing.xl, paddingBottom: Spacing.huge }}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}>
                    {messages.length === 0 && (
                        <View style={styles.emptyState}>
                            <View style={[styles.emptyLogo, { borderColor: colors.primary }]}>
                                <Image source={require('../../assets/images/walia-logo.png')} style={{ width: 64, height: 64 }} resizeMode="contain" />
                            </View>
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>Ask me anything!</Text>
                            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>Powered by Google Gemini</Text>
                            {['Explain recursion', 'Summarize photosynthesis', 'Help with calculus'].map((s, i) => (
                                <TouchableOpacity key={i} style={[styles.suggestBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => sendMessage(s)}>
                                    <Text style={[styles.suggestText, { color: colors.primary }]}>{s}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {messages.map(m => {
                        const providerInfo = m.role === 'ai' && m.provider ? AI_PROVIDERS.find(p => p.id === m.provider) : null;
                        return (
                            <View key={m.id} style={[styles.bubble, m.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                                {m.role === 'ai' && (
                                    <View style={[styles.aiAvatar, { borderColor: providerInfo ? `${providerInfo.color}40` : 'rgba(108,99,255,0.3)' }]}>
                                        {providerInfo ? (
                                            <Text style={{ fontSize: 16 }}>{providerInfo.icon}</Text>
                                        ) : (
                                            <Image source={require('../../assets/images/walia-logo.png')} style={{ width: 28, height: 28 }} resizeMode="contain" />
                                        )}
                                    </View>
                                )}
                                <View style={[styles.bubbleContent, m.role === 'user' ? { backgroundColor: colors.primary, borderBottomRightRadius: Spacing.xs } : { backgroundColor: colors.surface, borderBottomLeftRadius: Spacing.xs, flex: 1, borderWidth: 1, borderColor: providerInfo ? `${providerInfo.color}30` : 'transparent' }]}>
                                    {providerInfo && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                                            <Text style={{ fontSize: FontSize.xs, color: providerInfo.color, fontWeight: FontWeight.bold }}>{providerInfo.name}</Text>
                                        </View>
                                    )}
                                    <Text style={[styles.bubbleText, { color: m.role === 'user' ? '#fff' : colors.text }]}>{m.text}</Text>
                                    <Text style={[styles.ts, { color: m.role === 'user' ? 'rgba(255,255,255,0.6)' : colors.textTertiary }]}>{m.timestamp}</Text>
                                </View>
                            </View>
                        );
                    })}

                    {isLoading && (
                        <View style={[styles.bubble, styles.aiBubble]}>
                            <View style={styles.aiAvatar}>
                                <Image source={require('../../assets/images/walia-logo.png')} style={{ width: 28, height: 28 }} resizeMode="contain" />
                            </View>
                            <View style={[styles.bubbleContent, { backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }]}>
                                <ActivityIndicator size="small" color={colors.primary} />
                                <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, fontStyle: 'italic' }}>Generating response...</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
                    <View style={[styles.inputWrap, { backgroundColor: colors.surfaceAlt }]}>
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="Ask Walia AI..."
                            placeholderTextColor={colors.textTertiary}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            editable={!isLoading}
                            selectionColor={colors.primary}
                        />
                    </View>
                    <TouchableOpacity disabled={!message.trim() || isLoading} onPress={() => sendMessage()} style={{ opacity: (!message.trim() || isLoading) ? 0.5 : 1 }}>
                        <LinearGradient colors={['#7C75FF', '#5A52E0']} style={styles.sendBtn}>
                            {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="arrow-up" size={20} color="#fff" />}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerGradient: {},
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
    headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    headerCenter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    headerLogo: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#000', overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)' },
    headerTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: '#fff' },
    headerSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
    messages: { flex: 1 },
    emptyState: { alignItems: 'center', paddingTop: Spacing.huge },
    emptyLogo: { width: 80, height: 80, backgroundColor: '#000', borderRadius: 40, overflow: 'hidden', marginBottom: Spacing.xl, borderWidth: 2 },
    emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginBottom: Spacing.xs },
    emptyDesc: { fontSize: FontSize.sm, marginBottom: Spacing.xxl },
    suggestBtn: { borderRadius: BorderRadius.pill, padding: Spacing.md, paddingHorizontal: Spacing.xl, borderWidth: 1, marginBottom: Spacing.sm, width: '100%' },
    suggestText: { fontSize: FontSize.md, textAlign: 'center' },
    bubble: { marginBottom: Spacing.lg },
    userBubble: { alignItems: 'flex-end' },
    aiBubble: { flexDirection: 'row', alignItems: 'flex-start' },
    aiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#0D0D1A', overflow: 'hidden', marginRight: Spacing.sm, marginTop: 4, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    bubbleContent: { maxWidth: '85%', borderRadius: BorderRadius.xl, padding: Spacing.lg },
    bubbleText: { fontSize: FontSize.md, lineHeight: 22 },
    ts: { fontSize: FontSize.xs, marginTop: Spacing.xs, textAlign: 'right' },
    inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, paddingBottom: Spacing.xl + 48, borderTopWidth: 1, gap: Spacing.sm },
    inputWrap: { flex: 1, borderRadius: BorderRadius.xxl, paddingHorizontal: Spacing.lg, paddingVertical: Platform.OS === 'ios' ? Spacing.md : Spacing.xs },
    input: { fontSize: FontSize.md, maxHeight: 100 },
    sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
});
