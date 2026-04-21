import MembershipCard from '@/components/MembershipCard';
import { PostCard } from '@/components/ui/PostCard';
import { useAuth } from '@/store/auth';
import { PRO_PLAN_XP_COST, useSocial } from '@/store/social';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Linking, Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const MENU_SECTIONS = [
    {
        title: 'Preparation',
        items: [
            { icon: 'calendar', label: 'Daily Plan', desc: 'Tasks & study schedule', color: '#6C63FF' },
            { icon: 'notifications', label: 'Notifications', desc: 'Inbox & payment alerts', color: '#FFA502' },
            { icon: 'information-circle', label: 'About Walia', desc: 'Mission & History', color: '#9CA3AF' },
            { icon: 'chatbubble-ellipses', label: 'Contact Us', desc: 'Telegram: @Mrcute_killer', color: '#6C63FF' },
            { icon: 'cloud-download', label: 'Updates', desc: 'Download latest version', color: '#10B981' },
        ],
    },
    {
        title: 'Settings',
        items: [
            { icon: 'moon', label: 'Appearance', desc: 'Dark / Light mode', color: '#2F3542', isThemeToggle: true },
            { icon: 'shield-checkmark', label: 'Privacy Policy', desc: 'Personal data & ads', color: '#00D2D3' },
            { icon: 'document-text', label: 'Terms of Service', desc: 'App rules & safety', color: '#718096' },
        ],
    },
    {
        title: 'Support',
        items: [
            { icon: 'help-circle', label: 'Help Centre', desc: 'AI Support Chat', color: '#10B981' },
            { icon: 'chatbubble-ellipses', label: 'Contact Us', desc: 'Telegram: @Mrcute_killer', color: '#6C63FF' },
            { icon: 'star', label: 'Rate Walia', desc: 'Leave a review ⭐', color: '#FF9F43' },
            { icon: 'information-circle', label: 'About', desc: 'Mission & History', color: '#9CA3AF' },
        ],
    },
];

export default function ProfileScreen() {
    const router = useRouter();
    const { colors, isDark, toggleTheme } = useTheme();
    const { user, logout, uploadAvatar } = useAuth();
    const [updatingAvatar, setUpdatingAvatar] = useState(false);
    const social = useSocial();

    const { xp, followers, following, posts, isPro } = social;
    const myPosts = posts.filter(p => p.authorId === user?.id);
    const [notifsEnabled, setNotifsEnabled] = useState(true);

    const [modal, setModal] = useState<{
        visible: boolean;
        title: string;
        msg: string;
        icon: string;
        color: string;
        onConfirm?: () => void;
    }>({ 
        visible: false, 
        title: '', 
        msg: '', 
        icon: '', 
        color: '#6C63FF' 
    });

    const showModal = (title: string, msg: string, icon: string, color: string, onConfirm?: () => void) => {
        setModal({ visible: true, title, msg, icon, color, onConfirm });
    };

    const handleLogout = () => {
        showModal('Log Out', 'Are you sure you want to log out from Walia?', 'log-out', '#FF4757', () => logout());
    };

    const handleDeleteAccount = () => {
        showModal('⚠️ Delete Account', 'This action is permanent and cannot be undone. All your data will be lost.', 'trash', '#FF4757', () => {
            setTimeout(() => logout(), 500);
        });
    };

    const handleMenuPress = (label: string) => {
        if (label === 'Privacy Policy') { router.push('/legal/privacy' as any); return; }
        if (label === 'Terms of Service') { router.push('/legal/terms' as any); return; }
        if (label === 'Contact Us') { Linking.openURL('https://t.me/Mrcute_killer'); return; }
        if (label === 'Help Centre') { router.push('/(tabs)/ai'); return; }
        if (label === 'Notifications') { router.push('/notifications' as any); return; }
        if (label === 'Daily Plan') { router.push('/plan' as any); return; }
        if (label === 'Language') { handleMenuPress('LanguagePopup'); return; }

        const msgs: Record<string, [string, string, string, string]> = {
            'Language': ['🌐 Language', 'Select your preferred language:\n\n• Amharic 🇪🇹\n• Oromo 🇪🇹\n• Tigrinya 🇪🇹\n• English 🇺🇸', 'language', '#6C63FF'],
            'About': ['ℹ️ About Walia', 'Walia was created in 2024 to empower students with localized AI study tools and a collaborative community.', 'information-circle', '#9CA3AF'],
            'Rate Walia': ['⭐ Rate Walia', 'Your feedback helps us improve the app for everyone! (App Store link coming soon)', 'star', '#FF9F43'],
        };

        const m = msgs[label];
        if (m) showModal(m[0], m[1], m[2], m[3]);
    };

    const handleUpdateAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setUpdatingAvatar(true);
            try {
                await uploadAvatar(result.assets[0].uri);
                Alert.alert('Success', 'Profile picture updated! ✨');
            } catch (e: any) {
                Alert.alert('Error', e.message || 'Failed to upload image');
            } finally {
                setUpdatingAvatar(false);
            }
        }
    };

    const xpToProPct = Math.min(100, Math.round((xp / PRO_PLAN_XP_COST) * 100));

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* 1. Banner & Avatar */}
                <View style={styles.topSection}>
                    <LinearGradient colors={['#000', '#1A202C']} style={styles.banner} start={{x:0, y:0}} end={{x:1, y:1}}>
                        <View style={styles.bannerDecoration}>
                             <Image source={require('../../assets/images/walia-logo.png')} style={styles.bannerLogo} resizeMode="contain" />
                        </View>
                    </LinearGradient>
                    
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarWrap}>
                            <View style={styles.avatarRing}>
                                {user?.photoURL ? (
                                    <Image source={{ uri: user.photoURL }} style={styles.avatarImg} />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <Text style={styles.avatarText}>{user?.name?.charAt(0) || '?'}</Text>
                                    </View>
                                )}
                            </View>
                            <TouchableOpacity style={styles.cameraBtn} onPress={handleUpdateAvatar}>
                                <Ionicons name="camera" size={16} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/profile/edit' as any)}>
                                <Ionicons name="create-outline" size={16} color="#fff" />
                                <Text style={styles.editBtnText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/profile/settings' as any)}>
                                <Ionicons name="settings-outline" size={20} color="#718096" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* 2. User Info */}
                <View style={styles.infoSection}>
                    <Text style={styles.displayName}>{user?.name || 'Student Name'}</Text>
                    <Text style={styles.handle}>@{user?.username || 'member'}</Text>
                    <Text style={styles.bio}>{user?.bio || 'Study hard, dream big. 🎓 No bio yet.'}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statVal}>{myPosts.length}</Text>
                            <Text style={styles.statLabel}>POSTS</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statVal}>{followers.length}</Text>
                            <Text style={styles.statLabel}>FOLLOWERS</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statVal}>{following.length}</Text>
                            <Text style={styles.statLabel}>FOLLOWING</Text>
                        </View>
                    </View>
                </View>

                {/* 3. Flippable ID Card */}
                <View style={styles.idCardSection}>
                    <MembershipCard
                        name={user?.name || 'Student'}
                        username={user?.username || 'student'}
                        id={user?.id?.slice(0, 8).toUpperCase() || 'WALIA-ID'}
                        isPro={isPro}
                        memberSince="March 2024"
                        avatar={user?.photoURL || '🧑‍🎓'}
                    />
                </View>

                {/* 4. Pro CTA */}
                {!isPro && (
                    <TouchableOpacity style={styles.proCta} onPress={() => router.push('/pro' as any)}>
                        <LinearGradient colors={['#101010', '#6C63FF']} style={styles.proCtaGrad} start={{x:0,y:0}} end={{x:1,y:0}}>
                            <View style={styles.proCtaIcon}><Text style={{fontSize:22}}>✨</Text></View>
                            <View style={{flex:1}}>
                                <Text style={styles.proCtaTitle}>Unlock Walia Pro</Text>
                                <Text style={styles.proCtaSub}>{xp.toLocaleString()} / 10,000 XP · {xpToProPct}% there</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {/* 5. Menu Sections */}
                {MENU_SECTIONS.map((section, idx) => (
                    <View key={idx} style={styles.menuSection}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.menuCard}>
                            {section.items.map((item, i) => (
                                <TouchableOpacity 
                                    key={i} 
                                    style={[styles.menuItem, { borderBottomWidth: i < section.items.length - 1 ? 1 : 0 }]}
                                    onPress={() => item.isThemeToggle ? toggleTheme() : handleMenuPress(item.label)}
                                >
                                    <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}10` }]}>
                                        <Ionicons name={`${item.icon}-outline` as any} size={18} color={item.color} />
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text style={styles.menuLabel}>{item.label}</Text>
                                        <Text style={styles.menuDesc}>
                                            {item.isThemeToggle ? (isDark ? 'Dark mode is on' : 'Light mode is on') : item.desc}
                                        </Text>
                                    </View>
                                    {item.isThemeToggle ? (
                                        <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: '#E2E8F0', true: '#000' }} thumbColor="#fff" />
                                    ) : (
                                        <Ionicons name="chevron-forward" size={14} color="#CBD5E0" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* 6. My Feed */}
                <View style={styles.feedSection}>
                    <View style={styles.feedHeader}>
                        <Text style={styles.feedTitle}>MY RECENT POSTS</Text>
                        <View style={styles.feedLine} />
                    </View>
                    {myPosts.length > 0 ? (
                        myPosts.map(p => <PostCard key={p.id} post={p} onLike={() => social.likePost(p.id)} />)
                    ) : (
                        <View style={styles.emptyFeed}>
                            <Ionicons name="newspaper-outline" size={32} color="#CBD5E0" />
                            <Text style={styles.emptyText}>You haven't posted anything yet.</Text>
                        </View>
                    )}
                </View>

                {/* 7. Danger Area */}
                <View style={styles.dangerSection}>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
                        <Text style={styles.deleteText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal transparent visible={modal.visible} animationType="fade">
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setModal({...modal, visible:false})} />
                    <View style={styles.modalCard}>
                        <View style={[styles.modalIcon, { backgroundColor: `${modal.color}15` }]}>
                            <Ionicons name={modal.icon as any} size={32} color={modal.color} />
                        </View>
                        <Text style={styles.modalTitle}>{modal.title}</Text>
                        <Text style={styles.modalMsg}>{modal.msg}</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setModal({...modal, visible:false})}>
                                <Text style={styles.modalBtnCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            {modal.onConfirm && (
                                <TouchableOpacity style={[styles.modalBtnConfirm, { backgroundColor: modal.color }]} onPress={() => { setModal({...modal, visible:false}); modal.onConfirm?.(); }}>
                                    <Text style={styles.modalBtnConfirmText}>Confirm</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    topSection: { marginBottom: 12 },
    banner: { height: 140, justifyContent: 'center', alignItems: 'center' },
    bannerDecoration: { position: 'absolute', right: -30, top: -30, opacity: 0.1 },
    bannerLogo: { width: 160, height: 160, opacity: 0.05 },
    profileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 24, marginTop: -44 },
    avatarWrap: { position: 'relative' },
    avatarRing: { width: 92, height: 92, borderRadius: 32, backgroundColor: '#fff', padding: 4, elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 10 },
    avatarImg: { width: '100%', height: '100%', borderRadius: 28, backgroundColor: '#F8FAFC' },
    avatarPlaceholder: { width: '100%', height: '100%', borderRadius: 28, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 32, fontFamily: 'Inter_900Black', color: '#CBD5E0' },
    cameraBtn: { position: 'absolute', bottom: -2, right: -2, width: 34, height: 34, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, borderWidth: 1, borderColor: '#EDF2F7' },
    actionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
    editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#000', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 22, elevation: 4 },
    editBtnText: { color: '#fff', fontSize: 13, fontFamily: 'Inter_900Black', letterSpacing: 0.5 },
    settingsBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EDF2F7' },
    infoSection: { paddingHorizontal: 24, marginBottom: 24 },
    displayName: { fontSize: 26, fontFamily: 'Inter_900Black', color: '#000', letterSpacing: -1 },
    handle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#A0AEC0', marginTop: 2 },
    bio: { fontSize: 15, fontFamily: 'Inter_500Medium', color: '#4A5568', lineHeight: 22, marginTop: 14 },
    statsRow: { flexDirection: 'row', alignItems: 'center', gap: 24, marginTop: 24 },
    statBox: { alignItems: 'flex-start' },
    statVal: { fontSize: 18, fontFamily: 'Inter_900Black', color: '#000' },
    statLabel: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', color: '#CBD5E0', letterSpacing: 1 },
    statDivider: { width: 1, height: 24, backgroundColor: '#EDF2F7' },
    idCardSection: { paddingHorizontal: 24, marginBottom: 12 },
    proCta: { marginHorizontal: 24, marginTop: 16, borderRadius: 24, overflow: 'hidden', elevation: 8, shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16 },
    proCtaGrad: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
    proCtaIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    proCtaTitle: { color: '#fff', fontFamily: 'Inter_900Black', fontSize: 16 },
    proCtaSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Inter_700Bold', marginTop: 2 },
    menuSection: { paddingHorizontal: 24, marginTop: 36 },
    sectionTitle: { fontSize: 11, fontFamily: 'Inter_800ExtraBold', color: '#CBD5E0', letterSpacing: 1.5, marginBottom: 14, marginLeft: 4 },
    menuCard: { backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 16, borderColor: '#F8FAFC' },
    menuIconContainer: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    menuLabel: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#000' },
    menuDesc: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#A0AEC0', marginTop: 2 },
    feedSection: { paddingHorizontal: 24, marginTop: 44 },
    feedHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
    feedTitle: { fontSize: 11, fontFamily: 'Inter_900Black', color: '#000', letterSpacing: 1.5 },
    feedLine: { flex: 1, height: 2, backgroundColor: '#000' },
    emptyFeed: { padding: 48, alignItems: 'center', backgroundColor: '#fff', borderRadius: 32, borderWidth: 1, borderColor: '#EDF2F7', borderStyle: 'dashed', gap: 12 },
    emptyText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#A0AEC0', textAlign: 'center' },
    dangerSection: { paddingHorizontal: 24, marginTop: 48, gap: 16 },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 18, borderRadius: 24, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FEE2E2' },
    logoutText: { fontSize: 15, fontFamily: 'Inter_900Black', color: '#EF4444' },
    deleteBtn: { alignItems: 'center', paddingVertical: 12 },
    deleteText: { fontSize: 13, fontFamily: 'Inter_700Bold', color: '#CBD5E0', textDecorationLine: 'underline' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 32 },
    modalCard: { width: '100%', backgroundColor: '#fff', borderRadius: 36, padding: 32, alignItems: 'center' },
    modalIcon: { width: 68, height: 68, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 22, fontFamily: 'Inter_900Black', color: '#000', marginBottom: 8, textAlign: 'center' },
    modalMsg: { fontSize: 15, fontFamily: 'Inter_500Medium', color: '#718096', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
    modalButtons: { flexDirection: 'row', gap: 12, width: '100%' },
    modalBtnCancel: { flex: 1, paddingVertical: 16, borderRadius: 18, backgroundColor: '#F7FAFC', alignItems: 'center' },
    modalBtnCancelText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#718096' },
    modalBtnConfirm: { flex: 1, paddingVertical: 16, borderRadius: 18, alignItems: 'center' },
    modalBtnConfirmText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#fff' },
});
