import { Avatar } from '@/components/ui/Avatar';
import { PostCard } from '@/components/ui/PostCard';
import { useAuth } from '@/store/auth';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert, Animated, Modal, Platform, ScrollView, StyleSheet,
    Switch, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { useSocial } from '@/store/social';

type TabType = 'messages' | 'groups';

export default function ChatScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const { notes, addNote } = useSocial();
    const [activeTab, setActiveTab] = useState<TabType>('messages');
    const [chats, setChats] = useState<any[]>([]);

    // ── Walia AI Auto-Reply state ──
    const [showAIModal, setShowAIModal] = useState(false);
    const [aiEnabled, setAiEnabled] = useState(false);
    const [aiStep, setAiStep] = useState<'type' | 'rizz' | 'tone'>('type');
    const [aiChatType, setAiChatType] = useState<string>('');
    const [aiRizzStyle, setAiRizzStyle] = useState<string>('');
    const [aiRizzGender, setAiRizzGender] = useState<string>('');
    const [aiRizzGoal, setAiRizzGoal] = useState<string>('');
    const [aiTone, setAiTone] = useState<string>('friendly');
    const [aiCustomMsg, setAiCustomMsg] = useState('');
    const [aiScheduled, setAiScheduled] = useState(false);
    const [aiScheduleHour, setAiScheduleHour] = useState('08');
    const [aiScheduleMin, setAiScheduleMin] = useState('00');

    const CHAT_TYPES = [
        { id: 'work', label: 'Work Chat', emoji: '💼', desc: 'Professional, concise replies' },
        { id: 'friend', label: 'Friend Chat', emoji: '😄', desc: 'Casual, fun and warm' },
        { id: 'mentor', label: 'Mentor Chat', emoji: '🧠', desc: 'Thoughtful, guiding and wise' },
        { id: 'rizz', label: 'Rizz Mode', emoji: '🔥', desc: 'Smooth, charming replies' },
        { id: 'family', label: 'Family Chat', emoji: '🏠', desc: 'Loving, warm and caring' },
        { id: 'custom', label: 'Custom', emoji: '✨', desc: 'Set your own tone below' },
    ] as const;

    const RIZZ_STYLES = [
        { id: 'smooth', label: 'Smooth Rizz 🕶️', desc: 'Cool, confident and chill' },
        { id: 'funny', label: 'Funny Rizz 😂', desc: 'Playful humor with a twist' },
        { id: 'deep', label: 'Deep Rizz 🌌', desc: 'Emotional, thoughtful connection' },
        { id: 'bold', label: 'Bold Rizz 💪', desc: 'Confident and direct' },
        { id: 'poet', label: 'Poet Rizz 🌹', desc: 'Romantic, poetic and sweet' },
    ] as const;

    const RIZZ_GENDERS = [
        { id: 'girl', label: 'Girl 👩' },
        { id: 'guy', label: 'Guy 👨' },
        { id: 'nonbinary', label: 'Non-binary 🌈' },
    ] as const;

    const RIZZ_GOALS = [
        { id: 'gf', label: 'Want her as GF 💕' },
        { id: 'already_gf', label: 'She\'s my GF ❤️' },
        { id: 'crush', label: 'My crush 🥰' },
        { id: 'friendzone', label: 'Escape friend zone 🚪' },
        { id: 'reconnect', label: 'Reconnecting 🔄' },
        { id: 'flirt', label: 'Just flirting 😏' },
    ] as const;

    const AI_TONES = [
        { id: 'friendly', label: 'Friendly 😊', desc: 'Warm and approachable' },
        { id: 'professional', label: 'Professional 💼', desc: 'Formal and to-the-point' },
        { id: 'casual', label: 'Casual 😎', desc: 'Relaxed, like a friend' },
        { id: 'rizz', label: 'Rizz 🔥', desc: 'Smooth, charming and confident' },
    ] as const;

    const resetAIModal = () => { setAiStep('type'); setAiChatType(''); setAiRizzStyle(''); setAiRizzGender(''); setAiRizzGoal(''); };

    const bg = isDark ? colors.background : '#F8FAFC';
    const cardBg = isDark ? colors.surface : '#FFFFFF';

    useEffect(() => {
        if (!user) return;
        // Mock local chats for demonstration since Firebase is removed
        setChats([
            {
                id: '1',
                type: 'private',
                name: 'Alex Rivera',
                lastMessage: 'Sounds good, let\'s study later!',
                updatedAt: { seconds: Date.now() / 1000 - 60 },
                unread: 2,
                avatar: '👦'
            },
            {
                id: '2',
                type: 'group',
                name: 'CS101 Study Group',
                lastMessage: 'Who has the notes for chapter 4?',
                updatedAt: { seconds: Date.now() / 1000 - 3600 },
                unread: 0,
                avatar: '👥'
            }
        ]);
    }, [user]);

    const privateChats = chats.filter(c => c.type === 'private');
    const groupChats = chats.filter(c => c.type === 'group');


    // ── Walia AI pinned card ──
    const renderAIAssistantCard = () => (
        <TouchableOpacity
            style={[styles.aiCard, { backgroundColor: cardBg }]}
            onPress={() => { resetAIModal(); setShowAIModal(true); }}
            activeOpacity={0.85}
        >
            <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={styles.aiCardAvatar}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
                <Text style={{ fontSize: 22 }}>🤖</Text>
            </LinearGradient>
            <View style={styles.aiCardInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={[styles.chatName, { color: colors.text }]}>Walia AI Assistant</Text>
                    <View style={styles.aiBadge}>
                        <Text style={styles.aiBadgeText}>AI</Text>
                    </View>
                </View>
                <Text style={[styles.chatMsg, { color: colors.textTertiary }]}>
                    {aiEnabled
                        ? `Auto-reply ON · ${aiChatType === 'rizz' ? `Rizz (${aiRizzStyle})` : aiChatType}`
                        : 'Set up smart auto-replies for your chats'}
                </Text>
            </View>
            <View style={[styles.aiStatusDot, { backgroundColor: aiEnabled ? '#10B981' : '#94A3B8' }]} />
        </TouchableOpacity>
    );

    const renderChatItem = (chat: any) => (
        <TouchableOpacity
            key={chat.id}
            style={[styles.chatItem, { backgroundColor: cardBg, borderColor: isDark ? '#1E293B' : '#F1F5F9' }]}
            onPress={() => router.push(chat.type === 'group' ? `/chat/group/${chat.id}` : `/chat/${chat.id}` as any)}
            activeOpacity={0.75}
        >
            <View style={styles.chatAvatarWrap}>
                <Avatar emoji={chat.avatar || (chat.type === 'group' ? '👥' : '👤')} size={52} online={chat.type === 'private'} />
            </View>
            <View style={styles.chatInfo}>
                <View style={styles.chatTopRow}>
                    <Text style={[styles.chatName, { color: colors.text }]} numberOfLines={1}>{chat.name}</Text>
                    <Text style={[styles.chatTime, { color: colors.textTertiary }]}>
                        {chat.updatedAt?.seconds
                            ? new Date(chat.updatedAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'Now'}
                    </Text>
                </View>
                <View style={styles.chatBottomRow}>
                    <Text style={[styles.chatMsg, { color: colors.textSecondary }]} numberOfLines={1}>{chat.lastMessage}</Text>
                    {chat.unread > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{chat.unread}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    const TAB_LABELS = ['messages', 'groups'] as const;

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>

            {/* ── Premium Header ── */}
            <LinearGradient
                colors={isDark ? ['#0F172A', '#1E293B'] : ['#FFFFFF', '#FFFFFF']}
                style={[styles.header, { borderBottomColor: isDark ? '#1E293B' : '#F1F5F9', borderBottomWidth: 1 }]}
            >
                <SafeAreaView edges={['top']} style={styles.safeHeader}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={[styles.headerSub, { color: colors.textTertiary }]}>WALIA HUB</Text>
                            <Text style={[styles.headerTitle, { color: colors.text }]}>Social</Text>
                        </View>
                        <View style={styles.headerActions}>
                            <TouchableOpacity
                                style={[styles.iconBtn, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: isDark ? '#334155' : '#E2E8F0' }]}
                                onPress={() => router.push('/chat/new')}
                            >
                                <Ionicons name="create-outline" size={20} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Tab Bar */}
                    <View style={styles.tabBar}>
                        {TAB_LABELS.map(key => {
                            const active = activeTab === key;
                            const label = key.charAt(0).toUpperCase() + key.slice(1);
                            return (
                                <TouchableOpacity
                                    key={key}
                                    style={[
                                        styles.tabItem,
                                        active && [styles.tabItemActive, { backgroundColor: '#6366F1' }]
                                    ]}
                                    onPress={() => setActiveTab(key)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.tabText,
                                        { color: active ? '#FFFFFF' : colors.textTertiary }
                                    ]}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 120, paddingTop: 16 }}
            >
                {activeTab === 'messages' && (
                    <View style={styles.section}>
                        {/* Notes Section */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.notesScroll}>
                            <TouchableOpacity activeOpacity={0.8} style={styles.noteContainer} onPress={() => {
                                Alert.prompt('Add Note', 'Share a thought...', [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Share', onPress: (text) => text && addNote(text) }
                                ]);
                            }}>
                                <View style={[styles.noteBubble, { backgroundColor: cardBg, borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
                                    <Text style={[styles.noteText, { color: colors.textTertiary }]}>Share a thought...</Text>
                                    <View style={[styles.noteTail, { borderTopColor: cardBg }]} />
                                </View>
                                <View style={[styles.storyCircle, { borderColor: isDark ? '#334155' : '#E2E8F0', borderStyle: 'dashed', borderWidth: 2, backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                                    <Ionicons name="add" size={20} color={colors.textTertiary} />
                                </View>
                                <Text style={[styles.storyUsername, { color: colors.textTertiary }]}>Note</Text>
                            </TouchableOpacity>
                            {notes.map(note => (
                                <TouchableOpacity activeOpacity={0.8} key={note.id} style={styles.noteContainer} onPress={() => Alert.alert('Note', 'Note viewing coming soon!')}>
                                    <View style={[styles.noteBubble, { backgroundColor: cardBg, borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
                                        <Text style={[styles.noteText, { color: colors.text }]} numberOfLines={1}>{note.note}</Text>
                                        <View style={[styles.noteTail, { borderTopColor: cardBg }]} />
                                    </View>
                                    <View style={[styles.storyCircle, { backgroundColor: isDark ? '#FFFFFF' : '#000000', borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
                                        <Text style={[styles.storyAvatarText, { color: isDark ? '#000000' : '#FFFFFF' }]}>{note.image}</Text>
                                    </View>
                                    <Text style={[styles.storyUsername, { color: colors.textTertiary }]}>{note.username}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>DIRECT MESSAGES</Text>
                            <TouchableOpacity
                                style={[styles.newChatChip, { backgroundColor: '#6366F110', borderColor: '#6366F130' }]}
                                onPress={() => router.push('/chat/new')}
                            >
                                <Ionicons name="add" size={14} color="#6366F1" />
                                <Text style={styles.newChatChipText}>New</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Pinned Walia AI card */}
                        {renderAIAssistantCard()}

                        {privateChats.length === 0 ? (
                            <View style={[styles.emptyBox, { backgroundColor: cardBg, borderColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                                <View style={[styles.emptyIconWrap, { backgroundColor: '#6366F110' }]}>
                                    <Ionicons name="chatbubbles-outline" size={32} color="#6366F1" />
                                </View>
                                <Text style={[styles.emptyTitle, { color: colors.text }]}>No conversations yet</Text>
                                <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                                    Start a new chat to connect with friends
                                </Text>
                                <TouchableOpacity
                                    style={styles.emptyAction}
                                    onPress={() => router.push('/chat/new')}
                                >
                                    <Text style={styles.emptyActionText}>Start Chat</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.chatList}>
                                {privateChats.map(renderChatItem)}
                            </View>
                        )}
                    </View>
                )}

                {activeTab === 'groups' && (
                    <View style={styles.section}>
                        {/* Create Group CTA */}
                        <TouchableOpacity
                            style={styles.createGroupCard}
                            onPress={() => router.push('/chat/new-group')}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={['#6366F1', '#8B5CF6']}
                                style={styles.createGroupGradient}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.createGroupIcon}>
                                    <Ionicons name="people" size={22} color="#FFF" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.createGroupTitle}>Create Study Group</Text>
                                    <Text style={styles.createGroupSub}>Collaborate with classmates in real-time</Text>
                                </View>
                                <View style={styles.createGroupArrow}>
                                    <Ionicons name="arrow-forward" size={18} color="#FFF" />
                                </View>
                                {/* Decor */}
                                <View style={styles.groupDecor1} />
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>YOUR GROUPS</Text>
                        </View>

                        {groupChats.length === 0 ? (
                            <View style={[styles.emptyBox, { backgroundColor: cardBg, borderColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                                <View style={[styles.emptyIconWrap, { backgroundColor: '#8B5CF610' }]}>
                                    <Ionicons name="people-outline" size={32} color="#8B5CF6" />
                                </View>
                                <Text style={[styles.emptyTitle, { color: colors.text }]}>No groups joined</Text>
                                <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                                    Join or create a study group to get started
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.chatList}>
                                {groupChats.map(renderChatItem)}
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* ── Walia AI Auto-Reply Modal ── */}
            <Modal visible={showAIModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowAIModal(false)}>
                <SafeAreaView style={[styles.modalSafe, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
                    {/* Modal header */}
                    <View style={[styles.modalHeader2, { borderBottomColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            {aiStep !== 'type' && (
                                <TouchableOpacity
                                    onPress={() => setAiStep(aiStep === 'rizz' ? 'type' : aiChatType === 'rizz' ? 'rizz' : 'type')}
                                    style={[styles.modalClose, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                                >
                                    <Ionicons name="arrow-back" size={18} color={colors.text} />
                                </TouchableOpacity>
                            )}
                            <View>
                                <Text style={[styles.modalTitle2, { color: colors.text }]}>Walia AI Assistant</Text>
                                <Text style={[styles.modalSub, { color: colors.textTertiary }]}>
                                    {aiStep === 'type' ? 'Choose chat type' : aiStep === 'rizz' ? 'Configure Rizz Mode 🔥' : 'Tone & Schedule'}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => setShowAIModal(false)} style={[styles.modalClose, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                            <Ionicons name="close" size={20} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Step indicator */}
                    <View style={styles.stepRow}>
                        {(['type', aiChatType === 'rizz' ? 'rizz' : null, 'tone'].filter(Boolean) as string[]).map((s, i, arr) => (
                            <View key={s} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={[styles.stepDot, {
                                    backgroundColor: aiStep === s ? '#6366F1' : (arr.indexOf(aiStep) > i ? '#10B981' : (isDark ? '#334155' : '#E2E8F0'))
                                }]}>
                                    {arr.indexOf(aiStep) > i
                                        ? <Ionicons name="checkmark" size={12} color="#FFF" />
                                        : <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '900' }}>{i + 1}</Text>
                                    }
                                </View>
                                {i < arr.length - 1 && <View style={[styles.stepLine, { backgroundColor: arr.indexOf(aiStep) > i ? '#10B981' : (isDark ? '#334155' : '#E2E8F0') }]} />}
                            </View>
                        ))}
                    </View>

                    <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

                        {/* ── STEP 1: Chat Type ── */}
                        {aiStep === 'type' && (
                            <>
                                <Text style={[styles.aiLabel, { color: colors.textTertiary }]}>WHAT KIND OF CHAT IS THIS?</Text>
                                {CHAT_TYPES.map(ct => (
                                    <TouchableOpacity
                                        key={ct.id}
                                        onPress={() => {
                                            setAiChatType(ct.id);
                                            setAiStep(ct.id === 'rizz' ? 'rizz' : 'tone');
                                        }}
                                        style={[styles.toneCard, {
                                            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                                            borderColor: aiChatType === ct.id ? '#6366F1' : (isDark ? '#334155' : '#F1F5F9'),
                                            borderWidth: aiChatType === ct.id ? 2 : 1,
                                        }]}
                                    >
                                        <Text style={{ fontSize: 28 }}>{ct.emoji}</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.toneName, { color: colors.text }]}>{ct.label}</Text>
                                            <Text style={[styles.toneDesc, { color: colors.textTertiary }]}>{ct.desc}</Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                                    </TouchableOpacity>
                                ))}
                            </>
                        )}

                        {/* ── STEP 2: Rizz sub-options ── */}
                        {aiStep === 'rizz' && (
                            <>
                                <Text style={[styles.aiLabel, { color: colors.textTertiary }]}>RIZZ STYLE</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 4 }}>
                                    {RIZZ_STYLES.map(rs => (
                                        <TouchableOpacity
                                            key={rs.id}
                                            onPress={() => setAiRizzStyle(rs.id)}
                                            style={[styles.rizzChip, {
                                                backgroundColor: aiRizzStyle === rs.id ? '#6366F1' : (isDark ? '#1E293B' : '#F1F5F9'),
                                                borderColor: aiRizzStyle === rs.id ? '#6366F1' : (isDark ? '#334155' : '#E2E8F0'),
                                            }]}
                                        >
                                            <Text style={[styles.rizzChipText, { color: aiRizzStyle === rs.id ? '#FFF' : colors.text }]}>{rs.label}</Text>
                                            <Text style={{ color: aiRizzStyle === rs.id ? 'rgba(255,255,255,0.7)' : colors.textTertiary, fontSize: 11, marginTop: 2 }}>{rs.desc}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>

                                <Text style={[styles.aiLabel, { color: colors.textTertiary }]}>THEIR GENDER</Text>
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    {RIZZ_GENDERS.map(rg => (
                                        <TouchableOpacity
                                            key={rg.id}
                                            onPress={() => setAiRizzGender(rg.id)}
                                            style={[styles.genderBtn, {
                                                backgroundColor: aiRizzGender === rg.id ? '#6366F1' : (isDark ? '#1E293B' : '#F1F5F9'),
                                                borderColor: aiRizzGender === rg.id ? '#6366F1' : (isDark ? '#334155' : '#E2E8F0'),
                                            }]}
                                        >
                                            <Text style={[styles.genderBtnText, { color: aiRizzGender === rg.id ? '#FFF' : colors.text }]}>{rg.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <Text style={[styles.aiLabel, { color: colors.textTertiary }]}>YOUR GOAL</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                    {RIZZ_GOALS.map(rg => (
                                        <TouchableOpacity
                                            key={rg.id}
                                            onPress={() => setAiRizzGoal(rg.id)}
                                            style={[styles.goalChip, {
                                                backgroundColor: aiRizzGoal === rg.id ? '#6366F115' : (isDark ? '#1E293B' : '#F8FAFC'),
                                                borderColor: aiRizzGoal === rg.id ? '#6366F1' : (isDark ? '#334155' : '#E2E8F0'),
                                                borderWidth: aiRizzGoal === rg.id ? 2 : 1,
                                            }]}
                                        >
                                            <Text style={[styles.goalChipText, { color: aiRizzGoal === rg.id ? '#6366F1' : colors.text }]}>{rg.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TouchableOpacity
                                    onPress={() => { if (aiRizzStyle && aiRizzGender && aiRizzGoal) setAiStep('tone'); }}
                                    style={{ opacity: (aiRizzStyle && aiRizzGender && aiRizzGoal) ? 1 : 0.4 }}
                                    activeOpacity={0.9}
                                >
                                    <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.saveBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                        <Text style={styles.saveBtnText}>Next → Tone & Schedule</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        )}

                        {/* ── STEP 3: Tone, Schedule & Save ── */}
                        {aiStep === 'tone' && (
                            <>
                                {/* Enable toggle */}
                                <View style={[styles.aiSection, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#F1F5F9' }]}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.aiSectionTitle, { color: colors.text }]}>Enable AI Auto-Reply</Text>
                                        <Text style={[styles.aiSectionSub, { color: colors.textTertiary }]}>
                                            Walia AI replies as you — recipients see your name, not AI.
                                        </Text>
                                    </View>
                                    <Switch value={aiEnabled} onValueChange={setAiEnabled} trackColor={{ false: '#94A3B8', true: '#6366F1' }} thumbColor={aiEnabled ? '#FFF' : '#F1F5F9'} />
                                </View>

                                {aiEnabled && (
                                    <>
                                        <Text style={[styles.aiLabel, { color: colors.textTertiary }]}>REPLY TONE</Text>
                                        {AI_TONES.map(tone => (
                                            <TouchableOpacity
                                                key={tone.id}
                                                onPress={() => setAiTone(tone.id)}
                                                style={[styles.toneCard, {
                                                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                                                    borderColor: aiTone === tone.id ? '#6366F1' : (isDark ? '#334155' : '#F1F5F9'),
                                                    borderWidth: aiTone === tone.id ? 2 : 1,
                                                }]}
                                            >
                                                <View style={{ flex: 1 }}>
                                                    <Text style={[styles.toneName, { color: colors.text }]}>{tone.label}</Text>
                                                    <Text style={[styles.toneDesc, { color: colors.textTertiary }]}>{tone.desc}</Text>
                                                </View>
                                                {aiTone === tone.id && <Ionicons name="checkmark-circle" size={22} color="#6366F1" />}
                                            </TouchableOpacity>
                                        ))}

                                        <Text style={[styles.aiLabel, { color: colors.textTertiary }]}>CUSTOM CONTEXT (OPTIONAL)</Text>
                                        <View style={[styles.aiTextWrap, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#F1F5F9' }]}>
                                            <TextInput
                                                value={aiCustomMsg}
                                                onChangeText={setAiCustomMsg}
                                                placeholder={aiChatType === 'rizz' ? `e.g. She loves music, use that...` : `e.g. I'm in a meeting, reply briefly...`}
                                                placeholderTextColor={colors.textTertiary}
                                                style={[styles.aiTextInput, { color: colors.text }]}
                                                multiline
                                            />
                                        </View>

                                        <View style={[styles.aiSection, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#F1F5F9' }]}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.aiSectionTitle, { color: colors.text }]}>Schedule Auto-Reply</Text>
                                                <Text style={[styles.aiSectionSub, { color: colors.textTertiary }]}>Set a daily time window for AI to be active</Text>
                                            </View>
                                            <Switch value={aiScheduled} onValueChange={setAiScheduled} trackColor={{ false: '#94A3B8', true: '#6366F1' }} thumbColor={aiScheduled ? '#FFF' : '#F1F5F9'} />
                                        </View>

                                        {aiScheduled && (
                                            <View style={[styles.scheduleRow, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#F1F5F9' }]}>
                                                <Text style={[styles.scheduleLabel, { color: colors.textSecondary }]}>Active from</Text>
                                                <TextInput value={aiScheduleHour} onChangeText={v => setAiScheduleHour(v.replace(/[^0-9]/g, '').slice(0, 2))} style={[styles.timeInput, { color: colors.text, backgroundColor: isDark ? '#334155' : '#F1F5F9' }]} keyboardType="number-pad" maxLength={2} />
                                                <Text style={[styles.scheduleLabel, { color: colors.textSecondary }]}>:</Text>
                                                <TextInput value={aiScheduleMin} onChangeText={v => setAiScheduleMin(v.replace(/[^0-9]/g, '').slice(0, 2))} style={[styles.timeInput, { color: colors.text, backgroundColor: isDark ? '#334155' : '#F1F5F9' }]} keyboardType="number-pad" maxLength={2} />
                                                <Text style={[styles.scheduleLabel, { color: colors.textTertiary }]}>daily</Text>
                                            </View>
                                        )}

                                        <View style={[styles.privacyNote, { backgroundColor: '#6366F108', borderColor: '#6366F120' }]}>
                                            <Ionicons name="shield-checkmark-outline" size={18} color="#6366F1" />
                                            <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
                                                Recipients see replies from <Text style={{ fontWeight: '900', color: colors.text }}>your name</Text>. AI identity is never disclosed.
                                            </Text>
                                        </View>
                                    </>
                                )}

                                <TouchableOpacity
                                    onPress={() => {
                                        setShowAIModal(false);
                                        if (aiEnabled) {
                                            Alert.alert('🤖 Walia AI Active', `Auto-reply is ON${aiChatType === 'rizz' ? ` with ${aiRizzStyle} Rizz` : ` (${aiChatType})`}.${aiScheduled ? `\nActive from ${aiScheduleHour}:${aiScheduleMin} daily.` : ''}`);
                                        }
                                    }}
                                    activeOpacity={0.9}
                                >
                                    <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.saveBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                        <Text style={styles.saveBtnText}>Save Settings</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },


    // Header
    header: { zIndex: 10 },
    safeHeader: { paddingHorizontal: 20, paddingBottom: 0 },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    headerSub: { fontSize: 10, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' },
    headerTitle: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
    headerActions: { flexDirection: 'row', gap: 10 },
    iconBtn: {
        width: 42,
        height: 42,
        borderRadius: 13,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Tab Bar
    tabBar: {
        flexDirection: 'row',
        gap: 8,
        paddingBottom: 16,
        paddingTop: 4,
    },
    tabItem: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
    },
    tabItemActive: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    tabText: { fontSize: 14, fontWeight: '800' },

    // Notes
    notesScroll: { paddingBottom: 16, gap: 16, marginHorizontal: -20, paddingHorizontal: 20 },
    noteContainer: { alignItems: 'center', gap: 4, marginTop: 32 },
    noteBubble: {
        position: 'absolute', top: -38, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1,
        maxWidth: 80, alignItems: 'center', justifyContent: 'center', zIndex: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2
    },
    noteText: { fontSize: 9, fontWeight: '700', textAlign: 'center' },
    noteTail: {
        position: 'absolute', bottom: -5, width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 5, borderStyle: 'solid',
        backgroundColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent'
    },
    storyCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
    storyAvatarText: { fontSize: 20, fontWeight: '900' },
    storyUsername: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

    // Content
    content: { flex: 1 },
    section: { paddingHorizontal: 20 },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
        marginTop: 8,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    newChatChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
    },
    newChatChipText: { fontSize: 12, fontWeight: '800', color: '#6366F1' },

    // Chat Items
    chatList: { gap: 10 },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 22,
        borderWidth: 1,
        gap: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    chatAvatarWrap: {},
    chatInfo: { flex: 1, gap: 4 },
    chatTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    chatName: { fontSize: 15, fontWeight: '800', flex: 1, marginRight: 8 },
    chatTime: { fontSize: 11, fontWeight: '600' },
    chatBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    chatMsg: { fontSize: 13, fontWeight: '500', flex: 1 },
    unreadBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#6366F1',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    unreadText: { color: '#FFF', fontSize: 10, fontWeight: '900' },

    // Groups
    createGroupCard: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    createGroupGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    createGroupIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createGroupTitle: { color: '#FFF', fontSize: 16, fontWeight: '900' },
    createGroupSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '600', marginTop: 2 },
    createGroupArrow: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    groupDecor1: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.06)',
        right: -30,
        top: -30,
    },

    // Empty States
    emptyBox: {
        alignItems: 'center',
        padding: 36,
        borderRadius: 24,
        borderWidth: 1,
        gap: 8,
    },
    emptyIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    emptyTitle: { fontSize: 16, fontWeight: '800' },
    emptyText: { fontSize: 13, fontWeight: '500', textAlign: 'center', lineHeight: 20 },
    emptyAction: {
        marginTop: 12,
        backgroundColor: '#6366F1',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 14,
    },
    emptyActionText: { color: '#FFF', fontSize: 14, fontWeight: '800' },

    // Community
    tagsScroll: { paddingHorizontal: 20, gap: 10, paddingBottom: 16 },
    tag: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    tagText: { fontSize: 12, fontWeight: '900' },
    composeBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        borderRadius: 22,
        padding: 12,
        borderWidth: 1,
        gap: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    composePlaceholder: { flex: 1, fontSize: 13, fontWeight: '500' },
    postBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    feedHeader: { paddingHorizontal: 20, marginBottom: 12 },

    // Walia AI card
    aiCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 22,
        marginBottom: 10,
        gap: 14,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    aiCardAvatar: {
        width: 52,
        height: 52,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiCardInfo: { flex: 1, gap: 4 },
    aiBadge: {
        backgroundColor: '#6366F115',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    aiBadgeText: { color: '#6366F1', fontSize: 9, fontWeight: '900' },
    aiStatusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },

    // AI Modal
    modalSafe: { flex: 1 },
    modalHeader2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 20,
        borderBottomWidth: 1,
    },
    modalTitle2: { fontSize: 20, fontWeight: '900' },
    modalSub: { fontSize: 13, fontWeight: '500', marginTop: 4 },
    modalClose: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 18,
        borderRadius: 22,
        borderWidth: 1,
    },
    aiSectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
    aiSectionSub: { fontSize: 12, fontWeight: '500', lineHeight: 18 },
    aiLabel: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 8,
        marginTop: 4,
    },
    toneCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 18,
        marginBottom: 10,
        gap: 12,
    },
    toneName: { fontSize: 15, fontWeight: '800' },
    toneDesc: { fontSize: 12, fontWeight: '500', marginTop: 2 },
    aiTextWrap: {
        borderRadius: 18,
        borderWidth: 1,
        padding: 14,
    },
    aiTextInput: {
        fontSize: 14,
        fontWeight: '500',
        minHeight: 70,
        textAlignVertical: 'top',
    },
    scheduleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 16,
        borderRadius: 18,
        borderWidth: 1,
    },
    scheduleLabel: { fontSize: 13, fontWeight: '700' },
    timeInput: {
        width: 50,
        height: 42,
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '900',
    },
    privacyNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 16,
        borderRadius: 18,
        borderWidth: 1,
    },
    privacyText: { flex: 1, fontSize: 13, fontWeight: '500', lineHeight: 20 },
    saveBtn: {
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' },

    // Step indicator
    stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 0 },
    stepDot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
    stepLine: { width: 40, height: 2, marginHorizontal: 4 },

    // Rizz chips
    rizzChip: {
        width: 140,
        padding: 14,
        borderRadius: 18,
        borderWidth: 1,
    },
    rizzChipText: { fontSize: 13, fontWeight: '900' },

    // Gender buttons
    genderBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
    },
    genderBtnText: { fontSize: 14, fontWeight: '800' },

    // Goal chips
    goalChip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
    },
    goalChipText: { fontSize: 13, fontWeight: '700' },
});
