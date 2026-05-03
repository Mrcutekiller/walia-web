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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
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
    { id: 'Fast', label: 'Fast Mode', icon: 'flash', desc: 'Quick responses (Gemini Flash)' },
    { id: 'Thinking', label: 'Thinking Mode', icon: 'git-network', desc: 'Deep reasoning (DeepSeek)' },
    { id: 'Work', label: 'Work Assistant', icon: 'sparkles', desc: 'Professional & productive' },
    { id: 'Fun', label: 'Fun Mode', icon: 'happy', desc: 'Witty & entertaining' },
];

type ChatMessage = { id: string; role: 'user' | 'ai'; text: string; imageUri?: string; timestamp: string; provider?: AIProvider; onShare?: () => void; onCopy?: () => void };

function AnimatedBubble({ message, colors }: { message: ChatMessage; colors: any }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(message.role === 'user' ? 20 : -20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true }),
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
                    : { flex: 1, borderBottomLeftRadius: 4, backgroundColor: colors.surface, borderWidth: 1, borderColor: providerInfo ? `${providerInfo.color}30` : colors.border },
            ]}>
                {isUser ? (
                    <LinearGradient
                        colors={['#6366F1', '#4F46E5']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.userGradient}
                    >
                        {message.imageUri && <Image source={{ uri: message.imageUri }} style={styles.bubbleImage} />}
                        <Text style={[styles.chatText, { color: '#FFFFFF' }]}>{message.text}</Text>
                    </LinearGradient>
                ) : (
                    <View style={styles.aiBubbleInner}>
                        {providerInfo != null && (
                            <View style={[styles.providerTag, { backgroundColor: `${providerInfo.color}15` }]}>
                                <Text style={{ fontSize: 10 }}>{providerInfo.icon}</Text>
                                <Text style={[styles.providerName, { color: providerInfo.color }]}>{providerInfo.name}</Text>
                            </View>
                        )}
                        <Text style={[styles.chatText, { color: colors.text }]}>{message.text}</Text>
                        
                        <View style={styles.bubbleFooter}>
                            <Text style={[styles.aiTime, { color: colors.textTertiary }]}>{message.timestamp}</Text>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                <TouchableOpacity 
                                    style={[styles.aiShareBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.divider }]}
                                    onPress={message.onCopy}
                                >
                                    <Ionicons name="copy-outline" size={12} color={colors.textSecondary} />
                                    <Text style={[styles.aiShareText, { color: colors.textSecondary }]}>Copy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.aiShareBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.divider }]}
                                    onPress={message.onShare}
                                >
                                    <Ionicons name="share-social-outline" size={12} color={colors.textSecondary} />
                                    <Text style={[styles.aiShareText, { color: colors.textSecondary }]}>Share</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </View>
            {isUser && (
                <View style={[styles.userAvatarWrap, { borderColor: colors.divider }]}>
                     <Ionicons name="person" size={18} color={colors.textTertiary} />
                </View>
            )}
        </Animated.View>
    );
}

export default function AITabScreen() {
    const router = useRouter();
    const { colors, isDark, mode } = useTheme();
    const { isPro, recordAiMessage, xp } = useSocial();
    const { user } = useAuth();
    const { consumeTokens, canAfford, getRemaining } = useTokens();
    const [isLoading, setIsLoading] = useState(false);
    const [showAttach, setShowAttach] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState('');
    const [preferredProvider, setPreferredProvider] = useState<AIProvider>('qwen/qwen-2.5-coder-32b-instruct:free');
    const [showModels, setShowModels] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [activeMode, setActiveMode] = useState(MODES[0]);
    const [showModes, setShowModes] = useState(false);
    const [sessions, setSessions] = useState<{ id: string, title: string, lastText: string, updatedAt: any }[]>([]);
    const [activeSession, setActiveSession] = useState<string | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [hasInitialLoaded, setHasInitialLoaded] = useState(false);
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [shareText, setShareText] = useState('');
    const scrollRef = useRef<ScrollView>(null);
    const inputRef = useRef<TextInput>(null);

    // Fetch AI Sessions from AsyncStorage
    useEffect(() => {
        if (!user) return;
        const loadSessions = async () => {
            try {
                const data = await AsyncStorage.getItem(`walia_ai_sessions_${user.id}`);
                const fetchedSessions = data ? JSON.parse(data) : [];
                setSessions(fetchedSessions);
                
                if (!hasInitialLoaded) {
                    if (fetchedSessions.length > 0) {
                        setActiveSession(fetchedSessions[0].id);
                    }
                    setHasInitialLoaded(true);
                }
            } catch(e) {
                console.error(e);
            }
        };
        loadSessions();
    }, [user, hasInitialLoaded]);

    // Fetch Messages for Active Session from AsyncStorage
    useEffect(() => {
        if (!activeSession || !user) {
            setChatMessages([]);
            return;
        }
        const loadMessages = async () => {
            try {
                const data = await AsyncStorage.getItem(`walia_ai_msgs_${activeSession}`);
                const msgs = data ? JSON.parse(data) : [];
                // Hydrate with the share function
                const hydratedMsgs = msgs.map((m: any) => ({
                    ...m,
                    onShare: () => handleShareAIResponse(m.text),
                    onCopy: () => handleCopyAIResponse(m.text)
                }));
                setChatMessages(hydratedMsgs);
                setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
            } catch(e) {
                console.error(e);
            }
        };
        loadMessages();
    }, [activeSession, user]);

    const buildHistory = (msgs: ChatMessage[]): AIMessage[] =>
        msgs.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));

    const handleCopyAIResponse = async (text: string) => {
        await Clipboard.setStringAsync(text);
        Alert.alert("Copied", "AI response copied to clipboard.");
    };

    const handleShareAIResponse = (text: string) => {
        setShareText(text);
        setShareModalVisible(true);
    };

    const shareToChat = (text: string) => {
        router.push({
            pathname: '/chat/new',
            params: { initialText: `Check out this AI Insight:\n\n${text}` }
        });
    };

    const shareToCommunity = async (text: string) => {
        try {
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

        if (!consumeTokens('ai_chat')) return;
        if (imageUri && !consumeTokens('image_uploads')) return;
        recordAiMessage();

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
                sessionId = Date.now().toString();
                const newSession = {
                    id: sessionId,
                    title: content.slice(0, 30) || 'New Conversation',
                    lastText: content || 'Image sent',
                    updatedAt: new Date().toISOString(),
                    createdAt: new Date().toISOString()
                };
                const updatedSessions = [newSession, ...sessions];
                setSessions(updatedSessions);
                await AsyncStorage.setItem(`walia_ai_sessions_${user!.id}`, JSON.stringify(updatedSessions));
                setActiveSession(sessionId);
                setIsCreatingNew(false);
            } else {
                const updatedSessions = sessions.map(s => 
                    s.id === sessionId ? { ...s, lastText: content || 'Image sent', updatedAt: new Date().toISOString() } : s
                );
                setSessions(updatedSessions);
                await AsyncStorage.setItem(`walia_ai_sessions_${user!.id}`, JSON.stringify(updatedSessions));
            }

            const newMsgData = {
                id: Date.now().toString() + 'u',
                role: 'user',
                text: content,
                imageUri: imageUri || null,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            
            // Get current msgs from local to append correctly
            const msgData = await AsyncStorage.getItem(`walia_ai_msgs_${sessionId}`);
            const currentMsgs = msgData ? JSON.parse(msgData) : [];
            const msgsWithUser = [...currentMsgs, newMsgData];
            await AsyncStorage.setItem(`walia_ai_msgs_${sessionId}`, JSON.stringify(msgsWithUser));

            // Determine provider based on mode if requested
            let modelToUse = preferredProvider;
            if (activeMode.id === 'Fast') modelToUse = 'google/gemini-2.5-flash:free';
            if (activeMode.id === 'Thinking') modelToUse = 'deepseek/deepseek-r1:free';

            const systemPrompt = `You are in ${activeMode.id} mode. ${activeMode.desc}.`;
            const { text: aiText, provider } = await askAI(content, buildHistory(chatMessages), modelToUse, systemPrompt);

            const aiMsgData = {
                id: Date.now().toString() + 'a',
                role: 'ai',
                text: aiText,
                provider: provider,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            const msgsWithAi = [...msgsWithUser, aiMsgData];
            setChatMessages(msgsWithAi.map((m: any) => ({ 
                ...m, 
                onShare: () => handleShareAIResponse(m.text),
                onCopy: () => handleCopyAIResponse(m.text)
            })));
            await AsyncStorage.setItem(`walia_ai_msgs_${sessionId}`, JSON.stringify(msgsWithAi));

        } catch (e: any) {
            console.error(e);
            const errorMsg = {
                id: Date.now().toString() + 'e',
                role: 'ai',
                text: `⚠️ Connection issue.\n\n${e.message}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatMessages(prev => [...prev, errorMsg as any]);
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
        { label: 'Explain AI 🤖', q: 'Explain AI simply' },
        { label: 'Coding Help 💻', q: 'Show me a clean React component example' },
        { label: 'Travel Plan ✈️', q: 'Plan a 3-day trip to Paris' },
        { label: 'Fitness Tips 🏋️', q: 'Give me a 15-min home workout' },
    ];

    const MOCK_CHATS = [
        { id: '1', name: 'Alex Rivera', type: 'private', avatar: '👦' },
        { id: '2', name: 'CS101 Study Group', type: 'group', avatar: '👥' },
        { id: '3', name: 'Sarah Jenkins', type: 'private', avatar: '👩' },
    ];

    const providerObj = PROVIDERS.find(p => p.id === preferredProvider)!;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient
                colors={isDark ? ['#020617', '#0F172A'] : ['#FFFFFF', '#F8FAFC']}
                style={[styles.headerGradient, { borderBottomColor: colors.divider, borderBottomWidth: 1 }]}
            >
                <SafeAreaView edges={['top']} style={styles.headerInner}>
                    <View style={styles.headerRow}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity 
                                onPress={() => setShowModes(true)}
                                style={[styles.menuBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                            >
                                <Ionicons name="grid-outline" size={24} color={colors.text} />
                            </TouchableOpacity>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Text style={[styles.headerTitle, { color: colors.text }]}>Walia AI</Text>
                                    <View style={[styles.activeBadge, { backgroundColor: colors.success }]}>
                                        <Text style={styles.activeBadgeText}>LIVE</Text>
                                    </View>
                                </View>
                                <Text style={[styles.modeLabel, { color: colors.textTertiary }]}>{activeMode.label}</Text>
                            </View>
                        </View>
                        <View style={styles.headerRight}>
                            <TouchableOpacity 
                                style={[styles.newChatBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                                onPress={() => { setActiveSession(null); setIsCreatingNew(true); setChatMessages([]); }}
                            >
                                <Ionicons name="add-circle-outline" size={26} color={colors.primary} />
                            </TouchableOpacity>
                            <View style={[styles.tokenPill, { backgroundColor: isPro ? '#6366F120' : colors.surfaceAlt, borderColor: isPro ? '#6366F140' : colors.border }]}>
                                <Text style={{ fontSize: 12 }}>⭐</Text>
                                <Text style={[styles.tokenText, { color: isPro ? '#6366F1' : colors.text }]}>{isPro ? '∞' : `${xp.toLocaleString()} pts`}</Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {showModes && (
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalBlur} onPress={() => setShowModes(false)} />
                    <Animated.View style={[styles.personaModal, { backgroundColor: colors.surface }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>EXPLORE PERSONAS</Text>
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
                                        style={[styles.personaItem, { backgroundColor: active ? `${colors.primary}10` : 'transparent', borderColor: active ? colors.primary : colors.divider }]}
                                    >
                                        <View style={[styles.personaIconBox, { backgroundColor: active ? colors.primary : colors.surfaceAlt }]}>
                                            <Ionicons name={m.icon as any} size={18} color={active ? '#FFF' : colors.textSecondary} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.personaLabel, { color: colors.text }]}>{m.label}</Text>
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

            {showModels && (
                <View style={[styles.modelDropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.modelHeaderRow}>
                        <Text style={[styles.modelDropdownTitle, { color: colors.text }]}>Switch Intelligence</Text>
                        <TouchableOpacity onPress={() => setShowModels(false)}>
                            <Ionicons name="close-circle" size={24} color={colors.textTertiary} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={{ paddingHorizontal: Spacing.md }}>
                        {['All', 'Coding', 'Fast', 'Reasoning', 'General'].map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.categoryChip,
                                    selectedCategory === cat ? { backgroundColor: colors.primary } : { backgroundColor: colors.surfaceAlt }
                                ]}
                                onPress={() => setSelectedCategory(cat)}
                            >
                                <Text style={[
                                    styles.categoryChipText,
                                    selectedCategory === cat ? { color: '#FFF' } : { color: colors.textSecondary }
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <ScrollView style={{ maxHeight: 350 }}>
                        {PROVIDERS.filter(p => selectedCategory === 'All' || p.category === selectedCategory).map((p, i, arr) => (
                            <TouchableOpacity
                                key={p.id}
                                style={[
                                    styles.modelOption,
                                    { borderBottomColor: i < arr.length - 1 ? colors.divider : 'transparent' },
                                    preferredProvider === p.id && { backgroundColor: `${colors.primary}10` },
                                    (!isPro && p.pro) && { opacity: 0.6 }
                                ]}
                                onPress={() => {
                                    if (!isPro && p.pro) {
                                        Alert.alert('Pro Model', `Upgrade to unlock ${p.name}.`, [{ text: 'Cancel' }, { text: 'Upgrade', onPress: () => router.push('/pro') }]);
                                    } else {
                                        setPreferredProvider(p.id);
                                        setShowModels(false);
                                    }
                                }}
                                disabled={!isPro && p.pro}
                            >
                                <View style={[styles.modelOptionIcon, { backgroundColor: `${p.color}15` }]}>
                                    <Text style={{ fontSize: 18 }}>{p.icon}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.modelOptionName, { color: colors.text }]}>{p.name}</Text>
                                    <Text style={[styles.modelOptionDesc, { color: colors.textSecondary }]} numberOfLines={1}>{p.desc}</Text>
                                </View>
                                {(!isPro && p.pro) && <Ionicons name="lock-closed" size={16} color={colors.textTertiary} />}
                                {preferredProvider === p.id && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* ── Messages scroll area ── */}
            <ScrollView
                ref={scrollRef}
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: Spacing.xl, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="on-drag"
            >
                {chatMessages.length === 0 && (
                    <View style={styles.emptyState}>
                        <View style={[styles.heroIconWrap, { backgroundColor: `${colors.primary}10` }]}>
                            <Ionicons name="sparkles" size={64} color={colors.primary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>Walia Intelligence</Text>
                        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                            Ready to assist with research, coding, or just a friendly chat.
                        </Text>

                        <View style={styles.suggestionGrid}>
                            {SUGGESTIONS.map((s, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.suggestCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                    onPress={() => sendMessage(s.q)}
                                >
                                    <Text style={[styles.suggestCardTitle, { color: colors.text }]}>{s.label}</Text>
                                    <Ionicons name="arrow-forward-circle-outline" size={24} color={colors.primary} />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.recentSection}>
                            <Text style={[styles.recentLabel, { color: colors.textTertiary }]}>CONTINUE EXPLORING</Text>
                            {sessions.slice(0, 3).map(c => (
                                <TouchableOpacity key={c.id} style={[styles.recentCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => setActiveSession(c.id)}>
                                    <View style={[styles.recentIcon, { backgroundColor: colors.surfaceAlt }]}>
                                        <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.recentTitle, { color: colors.text }]} numberOfLines={1}>{c.title}</Text>
                                        <Text style={[styles.recentSub, { color: colors.textTertiary }]} numberOfLines={1}>{c.lastText}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {chatMessages.map(m => <AnimatedBubble key={m.id} message={m} colors={colors} />)}

                {isLoading && (
                    <View style={[styles.bubble, styles.aiBubble]}>
                        <View style={styles.aiAvatarWrap}>
                            <ActivityIndicator size="small" color={colors.primary} />
                        </View>
                        <View style={[styles.typingBubble, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
                            <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary }}>Walia is composing...</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* ── Attach Panel ── */}
            {showAttach && (
                <View style={[styles.attachPanel, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
                    {[
                        { label: 'Library', icon: 'image-outline', color: '#6366F1', action: pickImage },
                        { label: 'Camera', icon: 'camera-outline', color: '#EC4899', action: takePhoto },
                    ].map(item => (
                        <TouchableOpacity key={item.label} style={styles.attachBtn} onPress={item.action}>
                            <View style={[styles.attachIcon, { backgroundColor: `${item.color}15` }]}>
                                <Ionicons name={item.icon as any} size={24} color={item.color} />
                            </View>
                            <Text style={[styles.attachLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* ── Input Bar — always at bottom ── */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 10}
            >
                <View style={[
                    styles.inputBar,
                    {
                        backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                        borderTopColor: isDark ? '#1E293B' : '#E2E8F0',
                        borderTopWidth: 1,
                        shadowColor: isDark ? '#6366F1' : '#000',
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: isDark ? 0.15 : 0.06,
                        shadowRadius: 16,
                        elevation: 12,
                    }
                ]}>
                    <TouchableOpacity
                        style={[styles.modelToggleBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderColor: isDark ? '#334155' : '#E2E8F0' }]}
                        onPress={() => setShowModels(!showModels)}
                    >
                        <Text style={{ fontSize: 20 }}>{providerObj.icon}</Text>
                        <Ionicons name="chevron-up" size={12} color={colors.textTertiary} />
                    </TouchableOpacity>

                    <View style={[
                        styles.inputWrap,
                        {
                            backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                            borderColor: isDark ? '#334155' : '#E2E8F0',
                            borderWidth: 1.5,
                        }
                    ]}>
                        <TextInput
                            ref={inputRef}
                            style={[styles.input, { color: colors.text }]}
                            placeholder="Message Walia AI..."
                            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            editable={!isLoading}
                            selectionColor="#6366F1"
                        />
                        <TouchableOpacity
                            style={styles.addBtn}
                            onPress={() => setShowAttach(!showAttach)}
                        >
                            <Ionicons
                                name={showAttach ? 'close-circle' : 'attach-outline'}
                                size={26}
                                color={showAttach ? '#EF4444' : '#6366F1'}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.sendBtn, { opacity: (!message.trim() || isLoading) ? 0.35 : 1 }]}
                        onPress={() => sendMessage()}
                        disabled={!message.trim() || isLoading}
                    >
                        <LinearGradient
                            colors={['#6366F1', '#4F46E5']}
                            style={styles.sendGradient}
                        >
                            {isLoading
                                ? <ActivityIndicator size="small" color="#FFF" />
                                : <Ionicons name="arrow-up" size={22} color="#FFF" />
                            }
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* ── Share Modal ── */}
            {shareModalVisible && (
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalBlur} onPress={() => setShareModalVisible(false)} />
                    <Animated.View style={[styles.personaModal, { backgroundColor: colors.surface }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>SHARE AI INSIGHT</Text>
                            <TouchableOpacity onPress={() => setShareModalVisible(false)}>
                                <Ionicons name="close" size={24} color={colors.textTertiary} />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView style={{ padding: 20 }}>
                            <TouchableOpacity 
                                style={[styles.shareOption, { backgroundColor: `${colors.primary}10`, borderColor: colors.primary }]}
                                onPress={() => { setShareModalVisible(false); shareToCommunity(shareText); }}
                            >
                                <View style={[styles.shareIconBox, { backgroundColor: colors.primary }]}>
                                    <Ionicons name="globe-outline" size={22} color="#FFF" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.shareOptionTitle, { color: colors.text }]}>Post to Community</Text>
                                    <Text style={[styles.shareOptionDesc, { color: colors.textTertiary }]}>Share this insight with everyone</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color={colors.primary} />
                            </TouchableOpacity>

                            <Text style={[styles.shareSectionLabel, { color: colors.textTertiary }]}>RECENT CHATS & GROUPS</Text>
                            
                            {MOCK_CHATS.map(chat => (
                                <TouchableOpacity 
                                    key={chat.id}
                                    style={[styles.shareOption, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                                    onPress={() => {
                                        setShareModalVisible(false);
                                        router.push({
                                            pathname: chat.type === 'group' ? `/chat/group/${chat.id}` as any : `/chat/${chat.id}` as any,
                                            params: { initialText: `Check out this AI Insight:\n\n${shareText}` }
                                        });
                                    }}
                                >
                                    <View style={[styles.shareAvatarBox, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
                                        <Text style={{ fontSize: 20 }}>{chat.avatar}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.shareOptionTitle, { color: colors.text }]}>{chat.name}</Text>
                                        <Text style={[styles.shareOptionDesc, { color: colors.textTertiary }]}>{chat.type === 'group' ? 'Study Group' : 'Direct Message'}</Text>
                                    </View>
                                    <Ionicons name="send" size={16} color={colors.primary} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>
                </View>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1 },
    headerGradient: { zIndex: 10 },
    headerInner: { paddingHorizontal: 20, paddingBottom: 12 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerTitle: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
    activeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    activeBadgeText: { color: '#FFF', fontSize: 8, fontWeight: '900' },
    modeLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    menuBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    newChatBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    tokenPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
    tokenText: { fontSize: 12, fontWeight: '800' },

    messages: { flex: 1 },
    bubble: { marginBottom: 16, flexDirection: 'row', alignItems: 'flex-start' },
    userBubble: { justifyContent: 'flex-end', paddingLeft: 40 },
    aiBubble: { paddingRight: 40 },
    aiAvatarWrap: { width: 32, height: 32, borderRadius: 8, overflow: 'hidden', marginRight: 10, marginTop: 4, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    userAvatarWrap: { width: 32, height: 32, borderRadius: 16, overflow: 'hidden', marginLeft: 10, marginTop: 4, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
    bubbleContent: { maxWidth: '100%', borderRadius: 20, overflow: 'hidden', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    userGradient: { padding: 14, paddingHorizontal: 18 },
    aiBubbleInner: { padding: 14, paddingHorizontal: 18 },
    chatText: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
    bubbleImage: { width: 220, height: 160, borderRadius: 12, marginBottom: 8 },
    providerTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 6 },
    providerName: { fontSize: 10, fontWeight: '700' },
    bubbleFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
    aiTime: { fontSize: 10 },
    aiShareBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
    aiShareText: { fontSize: 10, fontWeight: '600' },

    emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 20 },
    heroIconWrap: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 28, fontWeight: '900', marginBottom: 10, letterSpacing: -0.5 },
    emptyDesc: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 40 },
    suggestionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
    suggestCard: { width: '47%', padding: 16, borderRadius: 20, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    suggestCardTitle: { fontSize: 13, fontWeight: '700', flex: 1, marginRight: 8 },
    recentSection: { width: '100%', marginTop: 40 },
    recentLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 16 },
    recentCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 18, borderWidth: 1, marginBottom: 10, gap: 12 },
    recentIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    recentTitle: { fontSize: 14, fontWeight: '700' },
    recentSub: { fontSize: 12, marginTop: 2 },

    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 14,
        paddingTop: 14,
        paddingBottom: Platform.OS === 'ios' ? 36 : 18,
        gap: 10,
    },
    modelToggleBtn: {
        width: 46,
        height: 46,
        borderRadius: 15,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        marginBottom: 1,
    },
    inputWrap: {
        flex: 1,
        borderRadius: 22,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 4,
        minHeight: 50,
        maxHeight: 140,
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        maxHeight: 120,
        paddingVertical: 12,
        lineHeight: 22,
    },
    addBtn: { paddingBottom: 12, paddingLeft: 8 },
    sendBtn: { width: 50, height: 50, marginBottom: 1 },
    sendGradient: {
        width: 50,
        height: 50,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
    },
    typingBubble: { padding: 12, borderRadius: 16, borderBottomLeftRadius: 4, flex: 1 },

    modalOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 1000, justifyContent: 'flex-end' },
    modalBlur: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
    personaModal: { width: '100%', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 40, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    modalTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
    personaList: { padding: 16 },
    personaItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginBottom: 10, gap: 16, borderWidth: 1 },
    personaIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    personaLabel: { fontSize: 15, fontWeight: '700' },
    personaDesc: { fontSize: 12, marginTop: 2 },

    modelDropdown: { position: 'absolute', bottom: 100, left: 16, right: 16, borderRadius: 24, borderWidth: 1, zIndex: 100, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10, overflow: 'hidden', paddingBottom: 12 },
    modelHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    modelDropdownTitle: { fontSize: 18, fontWeight: '800' },
    categoryScroll: { marginBottom: 12 },
    categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginRight: 8 },
    categoryChipText: { fontSize: 12, fontWeight: '800' },
    modelOption: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
    modelOptionIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    modelOptionName: { fontSize: 15, fontWeight: '700' },
    modelOptionDesc: { fontSize: 12, marginTop: 2 },
    attachPanel: { flexDirection: 'row', gap: 30, paddingHorizontal: 40, paddingVertical: 20, borderTopWidth: 1, justifyContent: 'center' },
    attachBtn: { alignItems: 'center', gap: 6 },
    attachIcon: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    attachLabel: { fontSize: 12, fontWeight: '700' },

    shareOption: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginBottom: 12, gap: 14, borderWidth: 1 },
    shareIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    shareAvatarBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    shareOptionTitle: { fontSize: 16, fontWeight: '800' },
    shareOptionDesc: { fontSize: 12, fontWeight: '500', marginTop: 2 },
    shareSectionLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginTop: 20, marginBottom: 12 },
});
