import { Avatar } from '@/components/ui/Avatar';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/store/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const [chat, setChat] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const { user } = useAuth();
    
    // AI Reply Tone State
    const [replyToneModalOpen, setReplyToneModalOpen] = useState(false);
    const [selectedMessageForReply, setSelectedMessageForReply] = useState<string | null>(null);
    const [chatType, setChatType] = useState<string>('Work'); // Work, Friend Chat, Mentor Chat, Rizz
    const [rizzTarget, setRizzTarget] = useState<string>('Girl'); // Girl, Boy
    const [rizzRelation, setRizzRelation] = useState<string>('Crush'); // Girlfriend, Crush, New girl
    const [replyStyle, setReplyStyle] = useState<string>('Smooth'); // Smooth, Funny, Confident, Flirty
    const [isGeneratingReply, setIsGeneratingReply] = useState(false);

    useEffect(() => {
        if (!id || !user) return;
        
        // Listen to messages
        const q = query(
            collection(db, 'conversations', id as string, 'messages'),
            orderBy('createdAt', 'desc')
        );

        const unsubMessages = onSnapshot(q, (snap) => {
            setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Load chat info
        const loadChat = async () => {
            try {
                const cSnap = await getDoc(doc(db, 'conversations', id as string));
                if (cSnap.exists()) {
                    const data = cSnap.data();
                    const otherUid = data.participants.find((p: string) => p !== user.id);
                    let otherUser = { username: 'User', displayName: 'User' };
                    if (otherUid) {
                        const uSnap = await getDoc(doc(db, 'users', otherUid));
                        if (uSnap.exists()) {
                            const uData = uSnap.data();
                            otherUser = { 
                                username: uData.username || 'unknown', 
                                displayName: uData.displayName || uData.username || 'User'
                            };
                        }
                    }
                    setChat({ ...data, id: cSnap.id, name: otherUser.displayName, otherUser });
                }
            } catch (e) {
                console.error(e);
            }
        };
        loadChat();

        return () => unsubMessages();
    }, [id, user]);

    const sendMessage = async (imageUrl?: string) => {
        if (!text.trim() && !imageUrl) return;
        if (!user || !id) return;

        setSending(true);
        const msgText = text.trim();
        setText('');

        try {
            await addDoc(collection(db, 'conversations', id as string, 'messages'), {
                senderId: user.id,
                text: msgText,
                type: imageUrl ? 'image' : 'text',
                image: imageUrl || null,
                createdAt: serverTimestamp(),
            });
            
            await updateDoc(doc(db, 'conversations', id as string), {
                lastMessage: imageUrl ? 'Sent an image 🖼️' : msgText,
                updatedAt: serverTimestamp()
            });
        } catch (e) {
            console.error(e);
        } finally {
            setSending(false);
        }
    };

    const generateAIReply = async () => {
        if (!selectedMessageForReply) return;
        setIsGeneratingReply(true);
        
        // Simulate AI generation
        setTimeout(() => {
            let generatedReply = "";
            if (chatType === 'Rizz') {
                if (replyStyle === 'Funny') generatedReply = "Haha that's actually hilarious 😂 You always know what to say.";
                else if (replyStyle === 'Smooth') generatedReply = "I was just thinking about that... great minds think alike 😉";
                else if (replyStyle === 'Flirty') generatedReply = "Stop it, you're making me blush 😳";
                else generatedReply = "I love that confidence. Tell me more.";
            } else if (chatType === 'Work') {
                generatedReply = "Noted. I'll get back to you on this shortly. Thanks!";
            } else if (chatType === 'Mentor Chat') {
                generatedReply = "Thank you for the guidance, I truly appreciate the insight!";
            } else {
                generatedReply = "That sounds awesome! Catch up soon?";
            }
            
            setText(generatedReply);
            setReplyToneModalOpen(false);
            setIsGeneratingReply(false);
            setSelectedMessageForReply(null);
        }, 1500);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri: string) => {
        if (!user || !id) return;
        setSending(true);
        try {
            // Mocking upload for local version
            setTimeout(() => {
                sendMessage(uri);
                setSending(false);
            }, 1000);
        } catch (e) {
            console.error(e);
            setSending(false);
        }
    };

    if (!chat) return (
        <View style={[styles.center, { backgroundColor: colors.background }]}>
            <ActivityIndicator color={colors.primary} />
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.divider }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Avatar emoji={chat.avatar || (chat.type === 'group' ? '👥' : '👤')} size={36} />
                    <View style={styles.headerText}>
                        <Text style={[styles.chatName, { color: colors.text }]} numberOfLines={1}>{chat.name}</Text>
                        <Text style={[styles.chatStatus, { color: colors.textTertiary }]}>{chat.type === 'group' ? 'Group Chat' : 'Online'}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.infoBtn}>
                    <Ionicons name="information-circle-outline" size={24} color={colors.textTertiary} />
                </TouchableOpacity>
            </View>

            {/* Messages */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} keyboardVerticalOffset={8}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    inverted
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.messageList}
                    renderItem={({ item }) => {
                        const isMe = item.senderId === user?.id;
                        return (
                            <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.theirMessageRow]}>
                                <View style={[
                                    styles.bubble,
                                    isMe ? [styles.myBubble, { backgroundColor: colors.primary }] : [styles.theirBubble, { backgroundColor: colors.surfaceAlt }]
                                ]}>
                                    {item.image && (
                                        <Image source={{ uri: item.image }} style={styles.msgImage} resizeMode="cover" />
                                    )}
                                    {item.text && (
                                        <Text style={[styles.messageText, { color: isMe ? '#fff' : colors.text }]}>{item.text}</Text>
                                    )}
                                    <Text style={[styles.messageTime, { color: isMe ? 'rgba(255,255,255,0.6)' : colors.textTertiary }]}>
                                        {item.createdAt?.seconds 
                                            ? new Date(item.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                                            : item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                    </Text>
                                </View>
                                {!isMe && (
                                    <TouchableOpacity 
                                        style={[styles.aiReplyBtn, { backgroundColor: colors.primary }]}
                                        onPress={() => {
                                            setSelectedMessageForReply(item.text);
                                            setReplyToneModalOpen(true);
                                        }}
                                    >
                                        <Ionicons name="sparkles" size={14} color="#fff" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    }}
                />

                {/* Input */}
                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
                    <TouchableOpacity onPress={pickImage} style={[styles.attachBtn, { backgroundColor: colors.surfaceAlt }]}>
                        <Ionicons name="image-outline" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.surfaceAlt }]}>
                        <TextInput
                            placeholder="Type a message..."
                            value={text}
                            onChangeText={setText}
                            placeholderTextColor={colors.textTertiary}
                            style={[styles.input, { color: colors.text }]}
                            multiline
                        />
                    </View>
                    <TouchableOpacity 
                        onPress={() => sendMessage()} 
                        disabled={!text.trim() || sending}
                        style={[styles.sendBtn, { backgroundColor: (text.trim() && !sending) ? colors.primary : colors.surfaceAlt }]}
                    >
                        {sending ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="send" size={20} color={(text.trim() && !sending) ? '#fff' : colors.textTertiary} />}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* AI Reply Tone Modal */}
            <Modal visible={replyToneModalOpen} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>AI Reply Tone</Text>
                            <TouchableOpacity onPress={() => setReplyToneModalOpen(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.modalScroll}>
                            <View style={[styles.repCtx, { backgroundColor: colors.surfaceAlt }]}>
                                <Text style={[styles.repCtxLabel, { color: colors.textTertiary }]}>Replying to:</Text>
                                <Text style={[styles.repCtxMsg, { color: colors.text }]}>"{selectedMessageForReply}"</Text>
                            </View>

                            <Text style={styles.stepLabel}>Step 1: Choose Chat Type</Text>
                            <View style={styles.chipGrid}>
                                {['Work', 'Friend Chat', 'Mentor Chat', 'Rizz'].map(t => (
                                    <TouchableOpacity 
                                        key={t} onPress={() => setChatType(t)}
                                        style={[styles.chip, { borderColor: chatType === t ? colors.primary : colors.divider, backgroundColor: chatType === t ? colors.primary + '20' : 'transparent' }]}
                                    >
                                        <Text style={[styles.chipText, { color: chatType === t ? colors.primary : colors.textSecondary }]}>{t}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {chatType === 'Rizz' && (
                                <View style={styles.rizzSection}>
                                    <Text style={styles.stepLabel}>Target</Text>
                                    <View style={styles.chipGrid}>
                                        {['Girl', 'Boy'].map(t => (
                                            <TouchableOpacity key={t} onPress={() => setRizzTarget(t)} style={[styles.miniChip, { backgroundColor: rizzTarget === t ? colors.primary : colors.surfaceAlt }]}>
                                                <Text style={[styles.miniChipText, { color: rizzTarget === t ? '#fff' : colors.textSecondary }]}>{t}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <Text style={styles.stepLabel}>Relation</Text>
                                    <View style={styles.chipGrid}>
                                        {['Girlfriend', 'Crush', 'New girl'].map(r => (
                                            <TouchableOpacity key={r} onPress={() => setRizzRelation(r)} style={[styles.miniChip, { backgroundColor: rizzRelation === r ? colors.primary : colors.surfaceAlt }]}>
                                                <Text style={[styles.miniChipText, { color: rizzRelation === r ? '#fff' : colors.textSecondary }]}>{r}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <Text style={styles.stepLabel}>Style</Text>
                                    <View style={styles.chipGrid}>
                                        {['Smooth', 'Funny', 'Confident', 'Flirty'].map(s => (
                                            <TouchableOpacity key={s} onPress={() => setReplyStyle(s)} style={[styles.miniChip, { backgroundColor: replyStyle === s ? '#EC4899' : colors.surfaceAlt }]}>
                                                <Text style={[styles.miniChipText, { color: '#fff' }]}>{s}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            <TouchableOpacity 
                                style={[styles.generateBtn, { backgroundColor: colors.primary }]}
                                onPress={generateAIReply}
                                disabled={isGeneratingReply}
                            >
                                {isGeneratingReply ? <ActivityIndicator color="#fff" /> : <><Ionicons name="sparkles" size={18} color="#fff" /><Text style={styles.generateBtnText}>Generate Reply</Text></>}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderBottomWidth: 1 },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitleContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: 4 },
    headerText: { flex: 1 },
    chatName: { fontSize: FontSize.md, fontWeight: FontWeight.heavy },
    chatStatus: { fontSize: 10, fontWeight: FontWeight.bold, opacity: 0.5 },
    infoBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
    messageList: { padding: Spacing.xl },
    messageRow: { marginBottom: Spacing.lg, flexDirection: 'row', alignItems: 'center' },
    myMessageRow: { justifyContent: 'flex-end' },
    theirMessageRow: { justifyContent: 'flex-start' },
    bubble: { maxWidth: '75%', padding: 12, borderRadius: 20 },
    myBubble: { borderBottomRightRadius: 4 },
    theirBubble: { borderBottomLeftRadius: 4 },
    messageText: { fontSize: FontSize.md, fontWeight: FontWeight.medium, lineHeight: 22 },
    messageTime: { fontSize: 9, marginTop: 4, alignSelf: 'flex-end', fontWeight: FontWeight.bold },
    msgImage: { width: 220, height: 160, borderRadius: 12, marginBottom: 8 },
    aiReplyBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginLeft: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: Spacing.md, borderTopWidth: 1, gap: 12 },
    attachBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    inputWrapper: { flex: 1, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 8, maxHeight: 100, justifyContent: 'center' },
    input: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
    sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 40, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'between', padding: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    modalTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.heavy, flex: 1 },
    modalScroll: { padding: 24 },
    repCtx: { padding: 16, borderRadius: 20, marginBottom: 24 },
    repCtxLabel: { fontSize: 10, fontWeight: FontWeight.bold, textTransform: 'uppercase', marginBottom: 4 },
    repCtxMsg: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, fontStyle: 'italic' },
    stepLabel: { fontSize: 10, fontWeight: FontWeight.heavy, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 12 },
    chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
    chipText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
    miniChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    miniChipText: { fontSize: 10, fontWeight: FontWeight.bold },
    rizzSection: { marginTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 16 },
    generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 20, marginTop: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    generateBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.heavy },
});
