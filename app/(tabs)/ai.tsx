import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { AIMessage, AIProvider, askAI, PROVIDERS } from '@/services/ai';
import { db } from '@/services/firebase';
import { useAuth } from '@/store/auth';
import { AI_CHATS } from '@/store/data';
import { useSocial } from '@/store/social';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions, Image, Keyboard, KeyboardAvoidingView,
    Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type ChatMessage = { id: string; role: 'user' | 'ai'; text: string; imageUri?: string; timestamp: string; provider?: AIProvider };

function AnimatedBubble({ message, colors }: { message: ChatMessage; colors: any }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(message.role === 'user' ? 20 : -20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
        ]).start();
    }, []);

    const isUser = message.role === 'user';
    const providerInfo = !isUser && message.provider ? PROVIDERS.find(p => p.id === message.provider) : null;

    return (
        <Animated.View style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.aiBubble,
            { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
        ]}>
            {!isUser && (
                <View style={[styles.aiAvatarWrap, { borderColor: providerInfo ? `${providerInfo.color}40` : colors.divider }]}>
                    {providerInfo ? (
                        <Text style={{ fontSize: 18 }}>{providerInfo.icon}</Text>
                    ) : (
                        <Image source={require('../../assets/images/walia-logo.png')} style={{ width: 32, height: 32 }} resizeMode="contain" />
                    )}
                </View>
            )}
            <View style={[
                styles.bubbleContent,
                isUser
                    ? { borderBottomRightRadius: 4 }
                    : { flex: 1, borderBottomLeftRadius: 4, backgroundColor: colors.surface, borderWidth: 1, borderColor: providerInfo ? `${providerInfo.color}30` : 'transparent' },
            ]}>
                {isUser ? (
                    <View style={[styles.userGradient, { backgroundColor: colors.primary }]}>
                        {message.imageUri && <Image source={{ uri: message.imageUri }} style={styles.bubbleImage} />}
                        <Text style={styles.userText}>{message.text}</Text>
                        <Text style={styles.userTime}>{message.timestamp}</Text>
                    </View>
                ) : (
                    <View style={{ padding: Spacing.lg }}>
                        {providerInfo && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                                <Text style={{ fontSize: FontSize.xs, color: providerInfo.color, fontWeight: FontWeight.bold }}>{providerInfo.name}</Text>
                            </View>
                        )}
                        <Text style={[styles.aiText, { color: colors.text }]}>{message.text}</Text>
                        <Text style={[styles.aiTime, { color: colors.textTertiary }]}>{message.timestamp}</Text>
                    </View>
                )}
            </View>
        </Animated.View>
    );
}

export default function AITabScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { isPro, recordAiMessage, dailyAiCount } = useSocial();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showAttach, setShowAttach] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState('');
    const [preferredProvider, setPreferredProvider] = useState<AIProvider>('auto');
    const [showModels, setShowModels] = useState(false);
    const [sessions, setSessions] = useState<{ id: string, title: string, lastText: string, updatedAt: any }[]>([]);
    const [activeSession, setActiveSession] = useState<string | null>(null);
    const scrollRef = useRef<ScrollView>(null);

    const inputRef = useRef<TextInput>(null);

    // Fetch AI Sessions
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'users', user.id, 'ai_sessions'),
            orderBy('updatedAt', 'desc')
        );
        const unsub = onSnapshot(q, (snap) => {
            setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
        });
        return () => unsub();
    }, [user]);

    // Fetch Messages for Active Session
    useEffect(() => {
        if (!activeSession || !user) {
            setChatMessages([]);
            return;
        }
        const q = query(
            collection(db, 'users', user.id, 'ai_sessions', activeSession, 'messages'),
            orderBy('createdAt', 'asc')
        );
        const unsub = onSnapshot(q, (snap) => {
            const msgs = snap.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    role: data.role,
                    text: data.text,
                    imageUri: data.image,
                    timestamp: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    provider: data.provider,
                } as ChatMessage;
            });
            setChatMessages(msgs);
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
        });
        return () => unsub();
    }, [activeSession, user]);
    const buildHistory = (msgs: ChatMessage[]): AIMessage[] =>
        msgs.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));

    const sendMessage = async (text?: string, imageUri?: string) => {
        const content = (text ?? message).trim();
        if (!content && !imageUri || isLoading) return;

        // Check limits
        if (!isPro && !recordAiMessage()) {
            Alert.alert(
                '🚀 Daily Limit Hit',
                `Free users are limited to 20 AI messages per day.\n\nUpgrade to Pro for unlimited chats and access to ChatGPT/DeepSeek!`,
                [
                    { text: 'Maybe Later', style: 'cancel' },
                    { text: 'Upgrade to Pro', onPress: () => router.push('/pro' as any) }
                ]
            );
            return;
        }

        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: content, imageUri, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setChatMessages(prev => [...prev, userMsg]);
        setMessage('');
        setShowAttach(false);
        setIsLoading(true);
        Keyboard.dismiss();
        setShowModels(false);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);

        let sessionId = activeSession;
        try {
            if (!sessionId) {
                const sessionRef = await addDoc(collection(db, 'users', user!.id, 'ai_sessions'), {
                    title: content.slice(0, 30) || 'Image Analysis',
                    lastText: content || 'Image sent',
                    updatedAt: serverTimestamp(),
                    createdAt: serverTimestamp()
                });
                sessionId = sessionRef.id;
                setActiveSession(sessionId);
            }

            // Save user message to Firestore
            await addDoc(collection(db, 'users', user!.id, 'ai_sessions', sessionId, 'messages'), {
                role: 'user',
                text: content,
                image: imageUri || null,
                createdAt: serverTimestamp()
            });

            // Update session
            await updateDoc(doc(db, 'users', user!.id, 'ai_sessions', sessionId), {
                title: content.slice(0, 30) || 'Conversation',
                lastText: content || 'Image shared',
                updatedAt: serverTimestamp()
            });

            const { text: aiText, provider } = await askAI(content, buildHistory(chatMessages), preferredProvider);

            // Save AI message to Firestore
            await addDoc(collection(db, 'users', user!.id, 'ai_sessions', sessionId, 'messages'), {
                role: 'ai',
                text: aiText,
                provider: provider,
                createdAt: serverTimestamp()
            });

        } catch (e: any) {
            if (sessionId) {
                await addDoc(collection(db, 'users', user!.id, 'ai_sessions', sessionId, 'messages'), {
                    role: 'ai',
                    text: `⚠️ Connection issue.\n\n${e.message}`,
                    createdAt: serverTimestamp()
                });
            }
        } finally {
            setIsLoading(false);
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Permission needed', 'Allow photo library access to share images.'); return; }
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
        if (!result.canceled && result.assets[0]) sendMessage('Analyze this image', result.assets[0].uri);
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Permission needed', 'Allow camera access to take photos.'); return; }
        const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
        if (!result.canceled && result.assets[0]) sendMessage('Analyze this image', result.assets[0].uri);
    };

    const SUGGESTIONS = [
        { label: 'Explain recursion 🔁', q: 'Explain recursion simply' },
        { label: 'Photosynthesis 🌿', q: 'Summarize photosynthesis' },
        { label: 'Calculus help 🧮', q: 'Help me understand calculus integration' },
        { label: 'Quiz me 🌍', q: 'Quiz me on world history with 3 questions' },
    ];

    const providerObj = PROVIDERS.find(p => p.id === preferredProvider)!;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Gradient Header */}
            <LinearGradient
                colors={isDark ? ['#000000', '#121212'] : ['#F9FAFB', '#FFFFFF']}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']} style={styles.headerInner}>
                    <View style={styles.headerRow}>
                        <View style={styles.headerLeft}>
                            <View style={styles.logoCircle}>
                                <Image source={require('../../assets/images/walia-logo.png')} style={{ width: 44, height: 44 }} resizeMode="contain" />
                            </View>
                            <View>
                                <Text style={[styles.headerTitle, { color: colors.text }]}>Walia AI</Text>
                                <View style={styles.statusRow}>
                                    <View style={[styles.statusDot, { backgroundColor: isLoading ? '#FFA502' : '#2ED573' }]} />
                                    <Text style={[styles.statusText, { color: colors.textSecondary }]}>{isLoading ? 'Thinking...' : `${providerObj.name} · Online`}</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/ai/' as any)} style={[styles.historyBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                            <Ionicons name="time-outline" size={16} color={colors.text} />
                            <Text style={[styles.historyText, { color: colors.text }]}>History</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Stats bar */}
                    {sessions.length > 0 && !activeSession && (
                        <View style={[styles.statsBar, { borderTopColor: colors.divider }]}>
                            <Text style={[styles.statsText, { color: colors.textSecondary }]}>{sessions.length} total sessions</Text>
                        </View>
                    )}

                    {activeSession && (
                        <View style={[styles.statsBar, { borderTopColor: colors.divider }]}>
                            <TouchableOpacity onPress={() => setActiveSession(null)}>
                                <Text style={[styles.clearBtn, { color: colors.primary }]}>← Back to Home / New Chat</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </SafeAreaView>
            </LinearGradient>

            {/* Model Selector Dropdown */}
            {showModels && (
                <View style={[styles.modelDropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {PROVIDERS.map((p, i) => (
                        <TouchableOpacity
                            key={p.id}
                            style={[
                                styles.modelOption,
                                { borderBottomColor: i < PROVIDERS.length - 1 ? colors.divider : 'transparent' },
                                preferredProvider === p.id && { backgroundColor: `${colors.primary}10` },
                                (!isPro && p.pro) && { opacity: 0.5 }
                            ]}
                            onPress={() => {
                                if (!isPro && p.pro) {
                                    Alert.alert(
                                        'Upgrade to Pro',
                                        `The ${p.name} model is available only for Pro users. Upgrade to unlock!`,
                                        [
                                            { text: 'Maybe Later', style: 'cancel' },
                                            { text: 'Upgrade to Pro', onPress: () => router.push('/pro' as any) }
                                        ]
                                    );
                                } else {
                                    setPreferredProvider(p.id);
                                    setShowModels(false);
                                }
                            }}
                            disabled={!isPro && p.pro}
                        >
                            <View style={[styles.modelOptionIcon, { backgroundColor: `${p.color}15` }]}>
                                <Text style={{ fontSize: 16 }}>{p.icon}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.modelOptionName, { color: colors.text }]}>{p.name}</Text>
                                <Text style={[styles.modelOptionDesc, { color: colors.textSecondary }]}>{p.desc}</Text>
                            </View>
                            {(!isPro && p.pro) && <Ionicons name="lock-closed" size={20} color={colors.textTertiary} />}
                            {preferredProvider === p.id && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
                <ScrollView
                    ref={scrollRef}
                    style={styles.messages}
                    contentContainerStyle={{ padding: Spacing.xl, paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                    keyboardDismissMode="on-drag"
                >
                    {/* Empty State */}
                    {chatMessages.length === 0 && (
                        <View style={styles.emptyState}>
                            <View style={[styles.emptyLogoRing, { backgroundColor: colors.surfaceAlt }]}>
                                <Image source={require('../../assets/images/walia-logo.png')} style={{ width: 72, height: 72 }} resizeMode="contain" />
                            </View>
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>Hi, I&apos;m Walia AI! 👋</Text>
                            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                                Your ultimate study companion. I can switch between Gemini, ChatGPT, and DeepSeek automatically!
                            </Text>

                            <View style={styles.suggestGrid}>
                                {SUGGESTIONS.map((s, i) => (
                                    <TouchableOpacity key={i} style={[styles.suggestChip, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => sendMessage(s.q)}>
                                        <Text style={[styles.suggestChipText, { color: colors.text }]}>{s.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={[styles.recentLabel, { color: colors.textSecondary }]}>📚 Recent conversations</Text>
                            {sessions.slice(0, 5).map(c => (
                                <TouchableOpacity key={c.id} style={[styles.recentCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => setActiveSession(c.id)}>
                                    <View style={styles.recentIcon}>
                                        <Image source={require('../../assets/images/walia-logo.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.recentTitle, { color: colors.text }]}>{c.title}</Text>
                                        <Text style={[styles.recentSub, { color: colors.textSecondary }]} numberOfLines={1}>{c.lastText}</Text>
                                    </View>
                                    <Text style={[styles.recentTime, { color: colors.textTertiary }]}>
                                        {c.updatedAt ? new Date(c.updatedAt.toDate()).toLocaleDateString() : ''}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {chatMessages.map(m => <AnimatedBubble key={m.id} message={m} colors={colors} />)}

                    {/* Typing indicator */}
                    {isLoading && (
                        <View style={[styles.bubble, styles.aiBubble]}>
                            <View style={styles.aiAvatarWrap}>
                                <Image source={require('../../assets/images/walia-logo.png')} style={{ width: 32, height: 32 }} resizeMode="contain" />
                            </View>
                            <View style={[styles.typingBubble, { backgroundColor: colors.surface }]}>
                                <ActivityIndicator size="small" color="#6C63FF" />
                                <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, fontStyle: 'italic' }}>Walia is thinking...</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Attach panel */}
                {showAttach && (
                    <View style={[styles.attachPanel, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
                        {[
                            { label: 'Gallery', icon: 'image', color: '#2196F3', bg: '#E8F4FD', action: pickImage },
                            { label: 'Camera', icon: 'camera', color: '#F44336', bg: '#FDE8E8', action: takePhoto },
                        ].map(item => (
                            <TouchableOpacity key={item.label} style={styles.attachBtn} onPress={item.action}>
                                <View style={[styles.attachIcon, { backgroundColor: item.bg }]}>
                                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                                </View>
                                <Text style={[styles.attachLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Input bar */}
                <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
                    {/* Model toggle button */}
                    <TouchableOpacity
                        style={[styles.modelToggleBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                        onPress={() => setShowModels(!showModels)}
                    >
                        <Text style={{ fontSize: 16 }}>{providerObj.icon}</Text>
                        <Ionicons name={showModels ? 'chevron-down' : 'chevron-up'} size={14} color={colors.textTertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.addBtn, { backgroundColor: showAttach ? colors.primary : colors.surfaceAlt }]}
                        onPress={() => setShowAttach(!showAttach)}
                    >
                        <Ionicons name={showAttach ? 'close' : 'add'} size={22} color={showAttach ? '#fff' : colors.primary} />
                    </TouchableOpacity>

                    <View style={[styles.inputWrap, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, borderWidth: 1 }]}>
                        <TextInput
                            ref={inputRef}
                            style={[styles.input, { color: colors.text }]}
                            placeholder={`Ask ${providerObj.name}...`}
                            placeholderTextColor={colors.textTertiary}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            editable={!isLoading}
                            onSubmitEditing={() => sendMessage()}
                            selectionColor={colors.primary}
                        />
                    </View>
                    <TouchableOpacity
                        style={[styles.sendBtn, { opacity: (!message.trim() || isLoading) ? 0.5 : 1 }]}
                        onPress={() => sendMessage()}
                        disabled={!message.trim() || isLoading}
                    >
                        <View style={[styles.sendGradient, { backgroundColor: colors.primary }]}>
                            {isLoading ? <ActivityIndicator size="small" color={colors.textInverse} /> : <Ionicons name="arrow-up" size={20} color={colors.textInverse} />}
                        </View>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerGradient: {},
    headerInner: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.md },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.sm },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    logoCircle: { width: 46, height: 46, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#eee', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.heavy },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusText: { fontSize: FontSize.xs },
    historyBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 10, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderWidth: 1 },
    historyText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
    statsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1 },
    statsText: { fontSize: FontSize.xs },
    clearBtn: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },

    modelDropdown: { position: 'absolute', bottom: 90, left: Spacing.xl, right: Spacing.xl, borderRadius: BorderRadius.xl, borderWidth: 1, zIndex: 100, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 8 },
    modelOption: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, gap: Spacing.md },
    modelOptionIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    modelOptionName: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
    modelOptionDesc: { fontSize: FontSize.xs, marginTop: 2 },

    messages: { flex: 1 },
    emptyState: { alignItems: 'center', paddingTop: Spacing.xxl },
    emptyLogoRing: { width: 88, height: 88, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
    emptyTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, marginBottom: Spacing.sm, textAlign: 'center' },
    emptyDesc: { fontSize: FontSize.md, textAlign: 'center', lineHeight: 22, paddingHorizontal: Spacing.xxl, marginBottom: Spacing.xxl },
    suggestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, alignSelf: 'stretch', marginBottom: Spacing.xxl },
    suggestChip: { borderRadius: 12, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm + 2, borderWidth: 1 },
    suggestChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    recentLabel: { alignSelf: 'flex-start', fontSize: FontSize.sm, fontWeight: FontWeight.heavy, marginBottom: Spacing.md },
    recentCard: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: Spacing.lg, marginBottom: Spacing.sm, gap: Spacing.md, borderWidth: 1 },
    recentIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f5f5f5', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
    recentTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    recentSub: { fontSize: FontSize.xs, marginTop: 2 },
    recentTime: { fontSize: FontSize.xs },
    bubble: { marginBottom: Spacing.lg },
    userBubble: { alignItems: 'flex-end' },
    aiBubble: { flexDirection: 'row', alignItems: 'flex-start' },
    aiAvatarWrap: { width: 36, height: 36, borderRadius: 10, overflow: 'hidden', marginRight: Spacing.sm, marginTop: 4, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    bubbleContent: { maxWidth: width * 0.75, borderRadius: 16, overflow: 'hidden' },
    userGradient: { padding: Spacing.lg, paddingBottom: Spacing.md },
    userText: { fontSize: FontSize.md, color: '#fff', lineHeight: 22, fontWeight: FontWeight.medium },
    userTime: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.6)', marginTop: Spacing.xs, textAlign: 'right' },
    aiText: { fontSize: FontSize.md, lineHeight: 22 },
    aiTime: { fontSize: FontSize.xs, marginTop: Spacing.xs, textAlign: 'right' },
    typingBubble: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: 16, padding: Spacing.lg, flex: 1 },
    inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, paddingBottom: Spacing.xl + 20, borderTopWidth: 1, gap: Spacing.sm },
    modelToggleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 12, borderWidth: 1, gap: 2, marginBottom: 2 },
    inputWrap: { flex: 1, borderRadius: 14, paddingHorizontal: Spacing.lg, paddingVertical: Platform.OS === 'ios' ? 10 : 6, minHeight: 44, borderWidth: 1 },
    input: { fontSize: FontSize.md, maxHeight: 120, textAlignVertical: 'center' },
    addBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
    attachPanel: { flexDirection: 'row', gap: Spacing.xl, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.xl, borderTopWidth: 1, justifyContent: 'center' },
    attachBtn: { alignItems: 'center', gap: Spacing.xs },
    attachIcon: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    attachLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
    bubbleImage: { width: 200, height: 150, borderRadius: 12, marginBottom: Spacing.sm },
    sendBtn: { marginBottom: 2 },
    sendGradient: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
