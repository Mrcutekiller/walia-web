import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { AIMessage, AIProvider, askAI, PROVIDERS } from '@/services/ai';
import { db } from '@/services/firebase';
import { useAuth } from '@/store/auth';
import { AI_CHATS } from '@/store/data';
import { useSocial } from '@/store/social';
import { useTheme } from '@/store/theme';
import { useTokens } from '@/store/tokens';
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

const MODES = [
    { id: 'Study', label: 'Study Helper', icon: 'brain', desc: 'Academic & tutoring mode' },
    { id: 'Work', label: 'Work Assistant', icon: 'sparkles', desc: 'Professional & productive' },
    { id: 'Debate', label: 'Debate AI', icon: 'chatbubbles', desc: 'Critical thinking & logic' },
    { id: 'Fun', label: 'Fun Mode', icon: 'happy', desc: 'Witty & entertaining' },
];

type ChatMessage = { id: string; role: 'user' | 'ai'; text: string; imageUri?: string; timestamp: string; provider?: AIProvider; onShare?: () => void };

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
                        <Image source={require('../../assets/images/walia-logo.png')} style={{ width: 22, height: 22 }} resizeMode="contain" />
                    )}
                </View>
            )}
            <View style={[
                styles.bubbleContent,
                isUser
                    ? { borderBottomRightRadius: 4 }
                    : { flex: 1, borderBottomLeftRadius: 4, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: providerInfo ? `${providerInfo.color}30` : colors.border },
            ]}>
                {isUser ? (
                    <View style={[styles.userGradient, { backgroundColor: colors.primary }]}>
                        {message.imageUri && <Image source={{ uri: message.imageUri }} style={styles.bubbleImage} />}
                        <Text style={[styles.chatText, { color: colors.textInverse }]}>{message.text}</Text>
                    </View>
                ) : (
                    <View style={styles.aiBubbleInner}>
                        {providerInfo != null && (
                            <View style={[styles.providerTag, { backgroundColor: `${providerInfo.color}15` }]}>
                                <Text style={{ fontSize: 10 }}>{providerInfo.icon}</Text>
                                <Text style={[styles.providerName, { color: providerInfo.color }]}>{providerInfo.name}</Text>
                            </View>
                        )}
                        <Text style={[styles.chatText, { color: colors.text }]}>{message.text}</Text>
                        
                        {/* Share Button for AI */}
                        <TouchableOpacity 
                            style={[styles.aiShareBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.divider }]}
                            onPress={message.onShare}
                        >
                            <Ionicons name="share-social-outline" size={14} color={colors.textSecondary} />
                            <Text style={[styles.aiShareText, { color: colors.textSecondary }]}>Share</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Animated.View>
    );
}

export default function AITabScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { isPro, recordAiMessage } = useSocial();
    const { user } = useAuth();
    const { tokenDisplay, consumeTokens, canAfford, tokensRemaining } = useTokens();
    const [isLoading, setIsLoading] = useState(false);
    const [showAttach, setShowAttach] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState('');
    const [preferredProvider, setPreferredProvider] = useState<AIProvider>('auto');
    const [showModels, setShowModels] = useState(false);
    const [activeMode, setActiveMode] = useState(MODES[0]);
    const [showModes, setShowModes] = useState(false);
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
                    onShare: () => handleShareAIResponse(data.text)
                } as ChatMessage;
            });
            setChatMessages(msgs);
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
        });
        return () => unsub();
    }, [activeSession, user]);
    const buildHistory = (msgs: ChatMessage[]): AIMessage[] =>
        msgs.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));

    const handleShareAIResponse = (text: string) => {
        Alert.alert(
            "Share AI Insight",
            "Where would you like to share this?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "To Community", onPress: () => shareToCommunity(text) },
                { text: "To Chat", onPress: () => shareToChat(text) },
            ]
        );
    };

    const shareToChat = (text: string) => {
        router.push({
            pathname: '/chat/new',
            params: { initialText: `Check out this AI Insight:\n\n${text}` }
        });
    };

    const shareToCommunity = async (text: string) => {
        try {
            // Very simple post creation inside the component since addPost handles details
            router.push({
                pathname: '/community/new-post',
                params: { initialText: `Check out this AI Insight:\n\n${text}` }
            });
        } catch (e) {
            console.error("Share failed", e);
        }
    };

    const sendMessage = async (text?: string, imageUri?: string) => {
        const content = (text ?? message).trim();
        if (!content && !imageUri || isLoading) return;

        // Check token balance
        if (!consumeTokens('ai_chat')) {
            return; // consumeTokens shows alert internally
        }
        recordAiMessage(); // still track for stats

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

            const systemPrompt = `You are in ${activeMode.id} mode. ${activeMode.desc}.`;
            const { text: aiText, provider } = await askAI(content, buildHistory(chatMessages), preferredProvider, systemPrompt);

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
            {/* Gradient Header - Mirroring Website Header */}
            <LinearGradient
                colors={isDark ? ['#000000', '#121212'] : ['#FFFFFF', '#F9FAFB']}
                style={[styles.headerGradient, { borderBottomColor: colors.divider, borderBottomWidth: 1 }]}
            >
                <SafeAreaView edges={['top']} style={styles.headerInner}>
                    <View style={styles.headerRow}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity 
                                onPress={() => setShowModes(true)}
                                style={[styles.menuBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                            >
                                <Ionicons name="menu-outline" size={20} color={colors.text} />
                            </TouchableOpacity>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <View style={styles.logoTiny}>
                                        <Image source={require('../../assets/images/walia-logo.png')} style={{ width: 14, height: 14 }} resizeMode="contain" />
                                    </View>
                                    <Text style={[styles.headerTitle, { color: colors.text }]}>Walia AI</Text>
                                    <View style={styles.activeBadge}>
                                        <Text style={styles.activeBadgeText}>ACTIVE</Text>
                                    </View>
                                </View>
                                <Text style={[styles.modeLabel, { color: colors.textTertiary }]}>{activeMode.label} Mode</Text>
                            </View>
                        </View>
                        <View style={styles.headerRight}>
                            <View style={[styles.tokenPill, { backgroundColor: isPro ? '#6C63FF15' : colors.surfaceAlt, borderColor: isPro ? '#6C63FF30' : colors.border }]}>
                                <Text style={{ fontSize: 12 }}>🪙</Text>
                                <Text style={[styles.tokenText, { color: isPro ? '#6C63FF' : colors.text }]}>{tokenDisplay}</Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* Persona Selection Modal (Mirroring Website Sidebar) */}
            {showModes && (
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalBlur} onPress={() => setShowModes(false)} />
                    <Animated.View style={[styles.personaModal, { backgroundColor: colors.surface }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>AI PERSONAS</Text>
                            <TouchableOpacity onPress={() => setShowModes(false)}>
                                <Ionicons name="close" size={24} color={colors.textTertiary} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.personaList}>
                            {MODES.map((m) => {
                                const active = m.id === activeMode.id;
                                return (
                                    <TouchableOpacity 
                                        key={m.id}
                                        onPress={() => { setActiveMode(m); setShowModes(false); }}
                                        style={[styles.personaItem, { backgroundColor: active ? colors.surfaceAlt : 'transparent', borderColor: active ? colors.divider : 'transparent' }]}
                                    >
                                        <View style={[styles.personaIconBox, { backgroundColor: active ? colors.primary : colors.surfaceAlt }]}>
                                            <Ionicons name={m.icon as any} size={18} color={active ? colors.textInverse : colors.textSecondary} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.personaLabel, { color: active ? colors.text : colors.textSecondary }]}>{m.label}</Text>
                                            <Text style={[styles.personaDesc, { color: colors.textTertiary }]}>{m.desc}</Text>
                                        </View>
                                        {active && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </Animated.View>
                </View>
            )}

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
    headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.black },
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
    emptyTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.black, marginBottom: Spacing.sm, textAlign: 'center' },
    emptyDesc: { fontSize: FontSize.md, textAlign: 'center', lineHeight: 22, paddingHorizontal: Spacing.xxl, marginBottom: Spacing.xxl },
    suggestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, alignSelf: 'stretch', marginBottom: Spacing.xxl },
    suggestChip: { borderRadius: 12, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm + 2, borderWidth: 1 },
    suggestChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    recentLabel: { alignSelf: 'flex-start', fontSize: FontSize.sm, fontWeight: FontWeight.black, marginBottom: Spacing.md },
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
    inputWrap: { flex: 1, borderRadius: 28, paddingHorizontal: Spacing.lg, paddingVertical: Platform.OS === 'ios' ? 10 : 6, minHeight: 44, borderWidth: 1 },
    input: { fontSize: FontSize.md, maxHeight: 120, textAlignVertical: 'center' },
    addBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
    attachPanel: { flexDirection: 'row', gap: Spacing.xl, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.xl, borderTopWidth: 1, justifyContent: 'center' },
    attachBtn: { alignItems: 'center', gap: Spacing.xs },
    attachIcon: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    attachLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
    bubbleImage: { width: 200, height: 150, borderRadius: 12, marginBottom: Spacing.sm },
    sendBtn: { marginBottom: 2 },
    sendGradient: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    tokenPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
    tokenText: { fontSize: 11, fontWeight: FontWeight.black, letterSpacing: 0.5 },
    chatText: { fontSize: FontSize.md, lineHeight: 22, fontWeight: FontWeight.medium },
    aiBubbleInner: { padding: Spacing.lg },
    providerTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 6 },
    providerName: { fontSize: 10, fontWeight: FontWeight.bold },
    bubbleFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
    shareBtn: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
    
    // Website Modal Styles
    modalOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 1000, justifyContent: 'flex-end' },
    modalBlur: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
    personaModal: { width: '100%', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 40, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    modalTitle: { fontSize: 12, fontWeight: FontWeight.black, letterSpacing: 1.5 },
    personaList: { padding: 16 },
    personaItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginBottom: 8, gap: 16, borderWidth: 1 },
    personaIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    personaLabel: { fontSize: 14, fontWeight: FontWeight.bold },
    personaDesc: { fontSize: 12, marginTop: 2 },
    logoTiny: { width: 22, height: 22, borderRadius: 6, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#eee' },
    activeBadge: { backgroundColor: '#10B981', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    activeBadgeText: { color: '#fff', fontSize: 8, fontWeight: FontWeight.black },
    modeLabel: { fontSize: 10, fontWeight: FontWeight.bold, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 1 },
    menuBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 }
} as any);
