import { Avatar } from '@/components/ui/Avatar';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { PRO_PLAN_XP_COST, useSocial } from '@/store/social';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MENU_SECTIONS = [
    {
        title: 'General',
        items: [
            { icon: 'language', label: 'Language', desc: 'English', color: '#6C63FF' },
        ],
    },
    {
        title: 'Settings',
        items: [
            { icon: 'notifications', label: 'Notifications', desc: 'Push & sound', color: '#FFA502' },
            { icon: 'shield-checkmark', label: 'Privacy Policy', desc: 'Personal data & ads', color: '#2ED573' },
            { icon: 'document-text', label: 'Terms of Service', desc: 'App rules & safety', color: '#6C63FF' },
            { icon: 'moon', label: 'Appearance', desc: 'Dark / Light mode', color: '#6C63FF', isThemeToggle: true },
        ],
    },
    {
        title: 'Support',
        items: [
            { icon: 'help-circle', label: 'Help Centre', desc: 'AI Support Chat', color: '#4ECDC4' },
            { icon: 'chatbubble-ellipses', label: 'Contact Us', desc: 'Telegram: @Mrcute_killer', color: '#6C63FF' },
            { icon: 'star', label: 'Rate Walia', desc: 'Leave a review ⭐', color: '#FFA502' },
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

    const { xp, level, xpProgress, isPro, followers, following, posts, totalViews, xpToNextLevel } = social;
    const myPosts = posts.filter(p => p.authorId === user?.id);
    const totalLikes = myPosts.reduce((sum, p) => sum + p.likes.length, 0);

    const [notifsEnabled, setNotifsEnabled] = useState(true);

    const [modal, setModal] = useState<{
        visible: boolean;
        title: string;
        msg: string;
        icon: string;
        color: string;
        onConfirm?: () => void;
        isDanger?: boolean;
    }>({ visible: false, title: '', msg: '', icon: '', color: colors.primary });

    const showModal = (title: string, msg: string, icon: string, color: string, onConfirm?: () => void, isDanger?: boolean) => {
        setModal({ visible: true, title, msg, icon, color, onConfirm, isDanger });
    };

    const handleLogout = () => {
        showModal('Log Out', 'Are you sure you want to log out from Walia?', 'log-out', colors.error, () => logout(), true);
    };

    const handleDeleteAccount = () => {
        showModal('⚠️ Delete Account', 'This action is permanent and cannot be undone. All your data will be lost.', 'trash', colors.error, () => {
            setModal({ visible: false, title: '', msg: '', icon: '', color: '' });
            setTimeout(() => logout(), 500);
        }, true);
    };

    const handleMenuPress = (label: string) => {
        const msgs: Record<string, [string, string, string, string]> = {
            'Favourites': ['❤️ Favourites', 'Your favourite posts and AI conversations will appear here.', 'heart', '#FF6B6B'],
            'Downloads': ['📥 Downloads', 'Download content for offline use. Coming soon!', 'download', '#4ECDC4'],
            'Language': ['🌐 Language', 'Select your preferred language:\n\n• Amharic 🇪🇹\n• Oromo 🇪🇹\n• Tigrinya 🇪🇹\n• Arabic 🇸🇦\n• French 🇫🇷\n• Spanish 🇪🇸\n• English 🇺🇸', 'language', '#6C63FF'],
            'Notifications': ['🔔 Notifications', 'Manage your study reminders and social alerts.', 'notifications', '#FFA502'],
            'Help Centre': ['❓ AI Help Centre', 'Walia AI Support is here to help you 24/7 with any app issues or study questions.', 'help-circle', '#4ECDC4'],
            'Contact Us': ['📫 Contact Us', 'Chat with us on Telegram for direct support: @Mrcute_killer', 'chatbubble-ellipses', '#6C63FF'],
            'About': ['ℹ️ About Walia', 'Walia was created in 2024 by Biruk F. to empower students with localized AI study tools and a collaborative community.', 'information-circle', '#9CA3AF'],
        };

        if (label === 'Privacy Policy') {
            router.push('/legal/privacy');
            return;
        }
        if (label === 'Terms of Service') {
            router.push('/legal/terms');
            return;
        }

        if (label === 'Contact Us') {
            Linking.openURL('https://t.me/Mrcute_killer');
            return;
        }

        if (label === 'Help Centre') {
            router.push('/(tabs)/ai');
            return;
        }

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
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Gradient Cover */}
                <View style={styles.profileBlock}>
                    <LinearGradient
                        colors={isDark ? ['#1A1230', '#12123A', '#0D0D1A'] : ['#6C63FF', '#7C75FF', '#8B85FF']}
                        style={styles.coverGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    >
                        <SafeAreaView edges={['top']}>
                            <View style={styles.headerRow}>
                                <View style={styles.headerLeft}>
                                    <Text style={styles.headerTitle}>My Profile</Text>
                                    {isPro && (
                                        <View style={styles.proChip}>
                                            <Text style={styles.proChipText}>⭐ PRO</Text>
                                        </View>
                                    )}
                                </View>
                                <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/profile/settings')}>
                                    <Ionicons name="settings-outline" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                        <View style={styles.deco1} /><View style={styles.deco2} />
                    </LinearGradient>

                    {/* Profile Card */}
                    <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
                        <View style={styles.avatarRow}>
                            <TouchableOpacity style={styles.avatarRing} onPress={handleUpdateAvatar} disabled={updatingAvatar}>
                                <Avatar emoji={user?.photoURL || '🧑‍🎓'} size={74} />
                                <View style={styles.editAvatarBadge}>
                                    <Ionicons name="camera" size={12} color="#fff" />
                                </View>
                            </TouchableOpacity>
                            <LinearGradient colors={['#FFA502', '#E65100']} style={styles.levelBadge}>
                                <Text style={styles.levelText}>Lv.{level}</Text>
                            </LinearGradient>
                        </View>
                        <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'Student'}</Text>
                        <Text style={[styles.username, { color: colors.textSecondary }]}>@{user?.username || 'student'}</Text>
                        <Text style={[styles.bio, { color: colors.textSecondary }]}>{user?.bio || 'Learning something new every day ✨'}</Text>

                        {/* XP Bar → Pro */}
                        <TouchableOpacity onPress={() => router.push('/pro' as any)}>
                            <View style={styles.xpRow}>
                                <View style={styles.xpLeft}>
                                    <Text style={[styles.xpLabel, { color: colors.text }]}>
                                        {xp.toLocaleString()} XP
                                        {isPro && <Text style={{ color: '#FFA502' }}> · PRO ✓</Text>}
                                    </Text>
                                    <Text style={[styles.xpSub, { color: colors.textTertiary }]}>
                                        {isPro ? 'Pro plan active 👑' : `${(PRO_PLAN_XP_COST - xp).toLocaleString()} XP to Pro`}
                                    </Text>
                                </View>
                                <Text style={[styles.xpPct, { color: colors.primary }]}>{xpToProPct}%</Text>
                            </View>
                            <View style={[styles.xpBarBg, { backgroundColor: colors.surfaceAlt }]}>
                                <LinearGradient
                                    colors={isPro ? ['#FFA502', '#E65100'] : ['#6C63FF', '#4ECDC4']}
                                    style={[styles.xpBarFill, { width: `${xpToProPct}%` as any }]}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.editBtnWrap} onPress={() => router.push('/profile/edit')}>
                            <LinearGradient colors={['#6C63FF', '#5A52E0']} style={styles.editBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                <Ionicons name="create-outline" size={16} color="#fff" />
                                <Text style={styles.editBtnText}>Edit Profile</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Real stats */}
                        <View style={[styles.statsRow, { borderTopColor: colors.divider }]}>
                            {[
                                { val: followers.length.toLocaleString(), label: 'Followers', color: '#FF6B6B' },
                                { val: following.length.toLocaleString(), label: 'Following', color: '#6C63FF' },
                                { val: myPosts.length.toLocaleString(), label: 'Posts', color: '#4ECDC4' },
                                { val: totalLikes.toLocaleString(), label: 'Likes', color: '#FFA502' },
                            ].map(({ val, label, color }, i) => (
                                <React.Fragment key={label}>
                                    {i > 0 && <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />}
                                    <View style={styles.statItem}>
                                        <Text style={[styles.statVal, { color }]}>{val}</Text>
                                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
                                    </View>
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Pro CTA (if not pro) */}
                {!isPro && (
                    <TouchableOpacity style={styles.proCta} onPress={() => router.push('/pro' as any)}>
                        <LinearGradient colors={['#1A1230', '#6C63FF']} style={styles.proCtaGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                            <Text style={{ fontSize: 28 }}>✨</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.proCtaTitle}>Unlock Walia Pro</Text>
                                <Text style={styles.proCtaSub}>{xp.toLocaleString()} / 10,000 XP · {xpToProPct}% there</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {/* Menu Sections */}
                {MENU_SECTIONS.map((section, si) => (
                    <View key={si} style={styles.menuSection}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{section.title}</Text>
                        <View style={[styles.menu, { backgroundColor: colors.surface }]}>
                            {section.items.map((item: any, i: number) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.menuItem, { borderBottomColor: i < section.items.length - 1 ? colors.divider : 'transparent' }]}
                                    onPress={() => item.isThemeToggle ? toggleTheme() : handleMenuPress(item.label)}
                                    activeOpacity={item.isThemeToggle ? 1 : 0.7}
                                >
                                    <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                                        <Ionicons name={`${item.icon}-outline` as any} size={19} color={item.color} />
                                    </View>
                                    <View style={styles.menuContent}>
                                        <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                                        <Text style={[styles.menuDesc, { color: colors.textTertiary }]}>
                                            {item.isThemeToggle ? (isDark ? '🌙 Dark mode on' : '☀️ Light mode on') : item.desc}
                                        </Text>
                                    </View>
                                    {item.label === 'Notifications' ? (
                                        <Switch
                                            value={notifsEnabled}
                                            onValueChange={setNotifsEnabled}
                                            trackColor={{ false: colors.border, true: colors.primary }}
                                            thumbColor="#fff"
                                        />
                                    ) : item.isThemeToggle ? (
                                        <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="#fff" />
                                    ) : (
                                        <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Danger Zone */}
                <View style={styles.dangerZone}>
                    <TouchableOpacity onPress={handleLogout}>
                        <LinearGradient colors={['#FF4757', '#C62828']} style={styles.logoutBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                            <Ionicons name="log-out-outline" size={20} color="#fff" />
                            <Text style={styles.logoutText}>Log Out</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.deleteBtn, { borderColor: colors.error }]} onPress={handleDeleteAccount}>
                        <Ionicons name="trash-outline" size={18} color={colors.error} />
                        <Text style={[styles.deleteText, { color: colors.error }]}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Custom Premium Modal */}
            <Modal transparent visible={modal.visible} animationType="fade">
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={{ ...StyleSheet.absoluteFillObject }} onPress={() => setModal({ ...modal, visible: false })} />
                    <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
                        <View style={[styles.modalIconBox, { backgroundColor: `${modal.color}15` }]}>
                            <Ionicons name={`${modal.icon}` as any} size={32} color={modal.color} />
                        </View>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{modal.title}</Text>
                        <Text style={[styles.modalMsg, { color: colors.textSecondary }]}>{modal.msg}</Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: colors.surfaceAlt }]}
                                onPress={() => setModal({ ...modal, visible: false })}
                            >
                                <Text style={[styles.modalBtnText, { color: colors.text }]}>{modal.onConfirm ? 'Cancel' : 'Close'}</Text>
                            </TouchableOpacity>
                            {modal.onConfirm && (
                                <TouchableOpacity
                                    style={[styles.modalBtn, { backgroundColor: modal.color }]}
                                    onPress={() => {
                                        setModal({ ...modal, visible: false });
                                        modal.onConfirm?.();
                                    }}
                                >
                                    <Text style={[styles.modalBtnText, { color: '#fff' }]}>Confirm</Text>
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
    profileBlock: { marginBottom: Spacing.sm },
    coverGradient: { height: 160, position: 'relative', overflow: 'hidden' },
    deco1: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.06)', bottom: -60, right: -40 },
    deco2: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.04)', top: -30, left: 20 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: '#fff' },
    proChip: { backgroundColor: 'rgba(255,165,0,0.3)', borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderWidth: 1, borderColor: '#FFA502' },
    proChipText: { color: '#FFA502', fontSize: FontSize.xs, fontWeight: FontWeight.bold },
    settingsBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    profileCard: { marginHorizontal: Spacing.xl, borderRadius: BorderRadius.xxl, marginTop: -20, padding: Spacing.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
    avatarRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: -Spacing.xxxl - 10, marginBottom: Spacing.md },
    avatarRing: { borderWidth: 3, borderColor: '#6C63FF', borderRadius: 44, padding: 2, position: 'relative' },
    editAvatarBadge: { position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11, backgroundColor: '#6C63FF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#0A0A18' },
    levelBadge: { borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.sm + 2, paddingVertical: 4, marginLeft: Spacing.sm, marginBottom: 4 },
    levelText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: '#fff' },
    name: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
    username: { fontSize: FontSize.sm, marginTop: 2 },
    bio: { fontSize: FontSize.sm, marginTop: Spacing.sm, lineHeight: 18 },
    xpRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: Spacing.lg, marginBottom: Spacing.xs },
    xpLeft: {},
    xpLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
    xpSub: { fontSize: FontSize.xs, marginTop: 2 },
    xpPct: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    xpBarBg: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: Spacing.lg },
    xpBarFill: { height: '100%', borderRadius: 4 },
    editBtnWrap: { marginBottom: Spacing.lg },
    editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderRadius: BorderRadius.pill, paddingVertical: Spacing.md },
    editBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.semibold },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: Spacing.md, borderTopWidth: 1 },
    statItem: { alignItems: 'center' },
    statVal: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
    statLabel: { fontSize: FontSize.xs, marginTop: 2 },
    statDivider: { width: 1 },
    proCta: { marginHorizontal: Spacing.xl, marginBottom: Spacing.lg, borderRadius: BorderRadius.xl, overflow: 'hidden' },
    proCtaGrad: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md },
    proCtaTitle: { color: '#fff', fontWeight: FontWeight.bold, fontSize: FontSize.md },
    proCtaSub: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.xs, marginTop: 2 },
    menuSection: { marginTop: Spacing.xl, paddingHorizontal: Spacing.xl },
    sectionTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm, paddingLeft: Spacing.xs },
    menu: { borderRadius: BorderRadius.xl, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md + 2, paddingHorizontal: Spacing.lg, borderBottomWidth: 1, gap: Spacing.md },
    menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    menuContent: { flex: 1 },
    menuLabel: { fontSize: FontSize.md, fontWeight: FontWeight.medium },
    menuDesc: { fontSize: FontSize.xs, marginTop: 2 },
    dangerZone: { marginTop: Spacing.xxxl, paddingHorizontal: Spacing.xl, gap: Spacing.md, marginBottom: Spacing.md },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.md, borderRadius: BorderRadius.pill, paddingVertical: Spacing.lg },
    logoutText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: '#fff' },
    deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderRadius: BorderRadius.pill, paddingVertical: Spacing.md + 2, borderWidth: 1.5 },
    deleteText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
    modalCard: { width: '100%', borderRadius: BorderRadius.xxl, padding: Spacing.xl, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 15 },
    modalIconBox: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
    modalTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: Spacing.sm, textAlign: 'center' },
    modalMsg: { fontSize: FontSize.md, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
    modalActions: { flexDirection: 'row', gap: Spacing.md, alignSelf: 'stretch' },
    modalBtn: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill, alignItems: 'center', justifyContent: 'center' },
    modalBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
});
