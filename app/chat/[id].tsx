import { Avatar } from '@/components/ui/Avatar';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { auth, db, storage } from '@/services/firebase';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
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

    useEffect(() => {
        if (!id) return;
        const chatRef = doc(db, 'chats', id as string);
        const unsubChat = onSnapshot(chatRef, (snap) => {
            if (snap.exists()) setChat({ id: snap.id, ...snap.data() });
        });

        const msgsRef = collection(db, 'chats', id as string, 'messages');
        const q = query(msgsRef, orderBy('createdAt', 'desc'));
        const unsubMsgs = onSnapshot(q, (snap) => {
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => {
            unsubChat();
            unsubMsgs();
        };
    }, [id]);

    const sendMessage = async (imageUrl?: string) => {
        if (!text.trim() && !imageUrl) return;
        if (!auth.currentUser || !id) return;

        setSending(true);
        try {
            const chatRef = doc(db, 'chats', id as string);
            const msgData = {
                text: text.trim(),
                senderId: auth.currentUser.uid,
                createdAt: serverTimestamp(),
                image: imageUrl || null,
            };

            await addDoc(collection(db, 'chats', id as string, 'messages'), msgData);
            await updateDoc(chatRef, {
                lastMessage: imageUrl ? 'Sent an image 🖼️' : text.trim(),
                updatedAt: serverTimestamp(),
            });
            setText('');
        } finally {
            setSending(false);
        }
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
        if (!auth.currentUser || !id) return;
        setSending(true);
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const imageRef = ref(storage, `chats/${id}/${Date.now()}`);
            await uploadBytes(imageRef, blob);
            const url = await getDownloadURL(imageRef);
            await sendMessage(url);
        } catch (e) {
            console.error(e);
        } finally {
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
                        const isMe = item.senderId === auth.currentUser?.uid;
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
                                        {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                    </Text>
                                </View>
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
    messageRow: { marginBottom: Spacing.lg, flexDirection: 'row' },
    myMessageRow: { justifyContent: 'flex-end' },
    theirMessageRow: { justifyContent: 'flex-start' },
    bubble: { maxWidth: '80%', padding: 12, borderRadius: 20 },
    myBubble: { borderBottomRightRadius: 4 },
    theirBubble: { borderBottomLeftRadius: 4 },
    messageText: { fontSize: FontSize.md, fontWeight: FontWeight.medium, lineHeight: 22 },
    messageTime: { fontSize: 9, marginTop: 4, alignSelf: 'flex-end', fontWeight: FontWeight.bold },
    msgImage: { width: 220, height: 160, borderRadius: 12, marginBottom: 8 },
    inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: Spacing.md, borderTopWidth: 1, gap: 12 },
    attachBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    inputWrapper: { flex: 1, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 8, maxHeight: 100, justifyContent: 'center' },
    input: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
    sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
