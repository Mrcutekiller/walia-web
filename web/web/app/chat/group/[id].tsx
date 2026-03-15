import { ChatBubble } from '@/components/ui/ChatBubble';
import { WaliaAIOrb } from '@/components/ui/WaliaAIOrb';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { auth, db } from '@/services/firebase';
import { useSocial } from '@/store/social';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView, Platform, ScrollView,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COMPANION_API_URL = 'https://walia-web-pi.vercel.app/api/chat/companion';

export default function GroupChatScreen() {
    const { id: roomId } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { isPro } = useSocial();

    const [roomData, setRoomData] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [weeklyAiCount, setWeeklyAiCount] = useState(0);

    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (!roomId || !auth.currentUser) return;

        const unsubRoom = onSnapshot(doc(db, 'chats', roomId), (snap) => {
            if (snap.exists()) setRoomData(snap.data());
        });

        const q = query(collection(db, 'chats', roomId, 'messages'), orderBy('createdAt', 'asc'));
        const unsubMessages = onSnapshot(q, (snap) => {
            const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setMessages(msgs);
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        });

        const currentWeek = getWeekNumber(new Date());
        getDoc(doc(db, 'usage', `${auth.currentUser.uid}_companion_w${currentWeek}`)).then(d => {
            if (d.exists()) setWeeklyAiCount(d.data().count || 0);
        });

        return () => {
            unsubRoom();
            unsubMessages();
        };
    }, [roomId]);

    const isAIActive = roomData?.aiSession?.isActive && roomData.aiSession.expiresAt > Date.now();
    const hasFreeWeeklyUsed = !isPro && weeklyAiCount >= 1;

    const sendMessage = async () => {
        const text = message.trim();
        if (!text || !auth.currentUser || !roomId) return;
        setMessage('');

        await addDoc(collection(db, 'chats', roomId, 'messages'), {
            text,
            senderId: auth.currentUser.uid,
            senderName: auth.currentUser.displayName || 'Anonymous',
            createdAt: serverTimestamp(),
            isAI: false,
        });

        await updateDoc(doc(db, 'chats', roomId), {
            lastMessage: text,
            updatedAt: serverTimestamp()
        });

        if (isAIActive && roomData?.aiSession) {
            triggerAI(text, roomId, roomData.aiSession);
        }
    };

    const triggerAI = async (userText: string, rId: string, aiSession: any) => {
        const history = messages.slice(-5).map(m => ({
            role: m.isAI ? 'assistant' : 'user',
            content: `${m.senderName}: ${m.text}`
        }));

        try {
            fetch(COMPANION_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `${auth.currentUser?.displayName}: ${userText}`,
                    history,
                    mode: aiSession.mode,
                    level: aiSession.level
                }),
            }).then(res => res.json()).then(async data => {
                if (data.reply) {
                    await addDoc(collection(db, 'chats', rId, 'messages'), {
                        text: data.reply,
                        senderId: 'walia-ai',
                        senderName: 'Walia',
                        isAI: true,
                        createdAt: serverTimestamp(),
                    });
                    await updateDoc(doc(db, 'chats', rId), { lastMessage: data.reply.substring(0, 50) + '...', updatedAt: serverTimestamp() });
                }
            });
        } catch (e) { console.error('AI error', e); }
    };

    const startSession = async (mode: string, level: string, durationMin: number) => {
        if (!roomId || !auth.currentUser) return;
        if (!isPro) {
            const currentWeek = getWeekNumber(new Date());
            await setDoc(doc(db, 'usage', `${auth.currentUser.uid}_companion_w${currentWeek}`), { count: weeklyAiCount + 1 });
            setWeeklyAiCount(c => c + 1);
        }

        const expiresAt = durationMin === 9999 ? Date.now() + 1000 * 60 * 60 * 24 * 365 : Date.now() + durationMin * 60000;
        await updateDoc(doc(db, 'chats', roomId), { aiSession: { mode, level, expiresAt, isActive: true } });

        await addDoc(collection(db, 'chats', roomId, 'messages'), {
            text: `Hello everyone. I am here to assist for the next ${durationMin === 9999 ? 'while' : durationMin + ' minutes'}.`,
            senderId: 'walia-ai',
            senderName: 'Walia',
            isAI: true,
            createdAt: serverTimestamp(),
        });
    };

    const stopSession = async () => {
        if (!roomId) return;
        await updateDoc(doc(db, 'chats', roomId), { 'aiSession.isActive': false });
        await addDoc(collection(db, 'chats', roomId, 'messages'), {
            text: 'Walia: The session has ended.',
            senderId: 'walia-ai', senderName: 'Walia', isAI: true, createdAt: serverTimestamp(),
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient colors={isDark ? ['#1A1A2E', '#12123A'] : [Colors.primary, Colors.primaryDark]} style={styles.headerGradient}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                            <Ionicons name="arrow-back" size={22} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerEmoji}>{roomData?.avatar || '👥'}</Text>
                        <View style={styles.headerInfo}>
                            <Text style={styles.headerName}>{roomData?.name || 'Group'}</Text>
                            <View style={styles.statusRow}>
                                {isAIActive ? (
                                    <>
                                        <Ionicons name="sparkles" size={10} color={Colors.success} />
                                        <Text style={[styles.headerStatus, { color: Colors.success, fontWeight: '700' }]}>Walia AI Active</Text>
                                    </>
                                ) : (
                                    <Text style={styles.headerStatus}>{roomData?.members?.length || 0} members</Text>
                                )}
                            </View>
                        </View>
                        {isAIActive && (
                            <TouchableOpacity onPress={stopSession} style={styles.stopAiHeader}>
                                <Text style={styles.stopAiText}>Stop AI</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.headerBtn}>
                            <Ionicons name="people-outline" size={20} color="rgba(255,255,255,0.8)" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={{ padding: Spacing.xl, paddingBottom: 120 }}>
                    {messages.map(m => (
                        <View key={m.id}>
                            {m.senderId !== auth.currentUser?.uid && (
                                <Text style={[styles.senderName, { color: colors.primary }]}>{m.senderName}</Text>
                            )}
                            <ChatBubble text={m.text} isSent={m.senderId === auth.currentUser?.uid} timestamp={m.createdAt ? new Date(m.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} isAI={m.isAI} />
                        </View>
                    ))}
                </ScrollView>

                <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
                    <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.surfaceAlt }]}>
                        <Ionicons name="image" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <View style={[styles.inputWrap, { backgroundColor: colors.surfaceAlt }]}>
                        <TextInput style={[styles.input, { color: colors.text }]} placeholder="Type a message..." placeholderTextColor={colors.textTertiary} value={message} onChangeText={setMessage} multiline />
                    </View>
                    <TouchableOpacity onPress={sendMessage}>
                        <LinearGradient colors={['#7C75FF', '#5A52E0']} style={styles.sendBtn}>
                            <Ionicons name="arrow-up" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {!isAIActive && <WaliaAIOrb onStartSession={startSession} isPro={isPro} hasFreeWeeklyUsed={hasFreeWeeklyUsed} />}
            </KeyboardAvoidingView>
        </View>
    );
}

function getWeekNumber(d: Date) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerGradient: {},
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: Spacing.sm },
    headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    headerEmoji: { fontSize: 28 },
    headerInfo: { flex: 1, marginLeft: Spacing.xs },
    headerName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: '#fff' },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
    headerStatus: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)' },
    stopAiHeader: { backgroundColor: 'rgba(255,107,107,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    stopAiText: { color: '#FF6B6B', fontSize: 10, fontWeight: '800' },
    messages: { flex: 1 },
    senderName: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, marginBottom: 2, marginLeft: Spacing.xs },
    inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, paddingBottom: 34, borderTopWidth: 1, gap: Spacing.sm },
    addBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    inputWrap: { flex: 1, borderRadius: BorderRadius.xxl, paddingHorizontal: Spacing.lg, paddingVertical: Platform.OS === 'ios' ? Spacing.md : Spacing.xs },
    input: { flex: 1, fontSize: FontSize.md, maxHeight: 100 },
    sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
});
