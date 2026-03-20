import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Avatar } from '@/components/ui/Avatar';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminSupportScreen() {
    const { colors, isDark } = useTheme();
    const [chats, setChats] = useState<any[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);

    // Load active tickets
    useEffect(() => {
        const q = query(collection(db, 'support_chats'), orderBy('updatedAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setChats(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // Load messages for active ticket
    useEffect(() => {
        if (!activeChatId) { setMessages([]); return; }
        updateDoc(doc(db, 'support_chats', activeChatId), { unreadAdminCount: 0 }).catch(() => {});
        const q = query(collection(db, `support_chats/${activeChatId}/messages`), orderBy('createdAt', 'asc'));
        const unsub = onSnapshot(q, (snap) => {
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        });
        return () => unsub();
    }, [activeChatId]);

    const handleSend = async () => {
        if (!inputText.trim() || !activeChatId || sending) return;
        setSending(true);
        const textTo = inputText.trim();
        setInputText('');
        try {
            await addDoc(collection(db, `support_chats/${activeChatId}/messages`), {
                text: textTo, sender: 'admin', createdAt: serverTimestamp()
            });
            await updateDoc(doc(db, 'support_chats', activeChatId), {
                lastMessage: textTo, updatedAt: serverTimestamp(), unreadUserCount: 1
            });
        } catch (e) { console.error(e); } finally { setSending(false); }
    };

    if (activeChatId) {
        return (
            <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={[styles.chatHeader, { backgroundColor: colors.surface, borderBottomColor: colors.divider, paddingTop: insets.top }]}>
                    <TouchableOpacity onPress={() => setActiveChatId(null)} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View style={styles.chatHeaderInfo}>
                        <Text style={[styles.chatHeaderTitle, { color: colors.text }]}>Ticket: {activeChatId.substring(0, 6)}</Text>
                        <Text style={[styles.chatHeaderSub, { color: colors.textTertiary }]}>Real-time Support</Text>
                    </View>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.msgList}
                    renderItem={({ item }) => {
                        const isAdmin = item.sender === 'admin';
                        return (
                            <View style={[styles.msgBubble, isAdmin ? [styles.myMsg, { backgroundColor: isDark ? '#fff' : '#000' }] : [styles.theirMsg, { backgroundColor: colors.surfaceAlt }]]}>
                                <Text style={[styles.msgText, { color: isAdmin ? (isDark ? '#000' : '#fff') : colors.text }]}>{item.text}</Text>
                            </View>
                        );
                    }}
                />

                <View style={[styles.inputRow, { backgroundColor: colors.surface, borderTopColor: colors.divider, paddingBottom: insets.bottom || Spacing.md }]}>
                    <TextInput
                        style={[styles.msgInput, { backgroundColor: colors.background, color: colors.text }]}
                        placeholder="Type reply..."
                        placeholderTextColor={colors.textTertiary}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity style={[styles.sendBtn, { backgroundColor: isDark ? '#fff' : '#000' }]} onPress={handleSend} disabled={!inputText.trim()}>
                        {sending ? <ActivityIndicator size="small" color={isDark ? '#000' : '#fff'} /> : <Ionicons name="send" size={16} color={isDark ? '#000' : '#fff'} />}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
            ) : (
                <FlatList
                    data={chats}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={[styles.empty, { color: colors.textTertiary }]}>No active support tickets.</Text>}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={[styles.ticketCard, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]} onPress={() => setActiveChatId(item.id)}>
                            <Avatar emoji="👤" size={40} />
                            <View style={styles.ticketInfo}>
                                <View style={styles.ticketHeader}>
                                    <Text style={[styles.ticketUser, { color: colors.text }]}>User {item.userId.substring(0, 5)}</Text>
                                    {item.unreadAdminCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{item.unreadAdminCount}</Text></View>}
                                </View>
                                <Text style={[styles.ticketLastMsg, { color: item.unreadAdminCount > 0 ? colors.text : colors.textSecondary, fontWeight: item.unreadAdminCount > 0 ? FontWeight.bold : 'normal' }]} numberOfLines={1}>
                                    {item.lastMessage}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    list: { paddingBottom: 100 },
    empty: { textAlign: 'center', marginTop: 40, fontFamily: 'System', fontWeight: 'bold' },
    ticketCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, gap: Spacing.md },
    ticketInfo: { flex: 1 },
    ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    ticketUser: { fontSize: FontSize.md, fontWeight: FontWeight.heavy },
    badge: { backgroundColor: '#EF4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
    ticketLastMsg: { fontSize: FontSize.sm },
    
    chatHeader: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1 },
    backBtn: { padding: 8, marginRight: 8 },
    chatHeaderInfo: { flex: 1 },
    chatHeaderTitle: { fontSize: FontSize.md, fontWeight: FontWeight.heavy },
    chatHeaderSub: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', marginTop: 2 },
    
    msgList: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: 24 },
    msgBubble: { padding: 14, borderRadius: 20, maxWidth: '80%' },
    myMsg: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
    theirMsg: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
    msgText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    
    inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: Spacing.md, borderTopWidth: 1, gap: Spacing.sm },
    msgInput: { flex: 1, minHeight: 44, maxHeight: 120, borderRadius: 22, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
