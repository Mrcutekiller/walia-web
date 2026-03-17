import MembershipCard from '@/components/MembershipCard';
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
            { icon: 'language', label: 'Language', desc: 'English', color: '#000000' },
        ],
    },
    {
        title: 'Settings',
        items: [
            { icon: 'notifications', label: 'Notifications', desc: 'Push & sound', color: '#000000' },
            { icon: 'shield-checkmark', label: 'Privacy Policy', desc: 'Personal data & ads', color: '#000000' },
            { icon: 'document-text', label: 'Terms of Service', desc: 'App rules & safety', color: '#000000' },
            { icon: 'moon', label: 'Appearance', desc: 'Dark / Light mode', color: '#000000', isThemeToggle: true },
        ],
    },
    {
        title: 'Support',
        items: [
            { icon: 'help-circle', label: 'Help Centre', desc: 'AI Support Chat', color: '#000000' },
            { icon: 'chatbubble-ellipses', label: 'Contact Us', desc: 'Telegram: @Mrcute_killer', color: '#000000' },
            { icon: 'star', label: 'Rate Walia', desc: 'Leave a review ⭐', color: '#000000' },
            { icon: 'information-circle', label: 'About', desc: 'Mission & History', color: '#000000' },
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
    const totalLikes = myPosts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);

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
            router.push('/legal/privacy' as any);
            return;
        }
        if (label === 'Terms of Service') {
            router.push('/legal/terms' as any);
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
                <View style={[styles.profileBlock, { backgroundColor: isDark ? '#000' : '#F9FAFB' }]}>
                    <SafeAreaView edges={['top']}>
                        <View style={styles.headerRow}>
                            <View style={styles.headerLeft}>
                                <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>
                                {isPro && (
                                    <View style={styles.proChip}>
                                        <Text style={styles.proChipText}>⭐ PRO</Text>
                                    </View>
                                )}
                            </View>
                            <TouchableOpacity style={[styles.settingsBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => router.push('/profile/settings' as any)}>
                                <Ionicons name="settings-outline" size={20} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>

                    <View style={styles.profileContent}>
                        <MembershipCard
                            name={user?.name || 'Student'}
                            username={user?.username || 'student'}
                            id={user?.id?.slice(0, 8).toUpperCase() || 'WALIA-001'}
                            isPro={isPro}
                            memberSince="March 2024"
                            avatar={user?.photoURL || '🧑‍🎓'}
                        />

                        <View style={styles.avatarActionRow}>
                             <TouchableOpacity style={[styles.avatarUploadBtn, { backgroundColor: colors.surfaceAlt }]} onPress={handleUpdateAvatar}>
                                <Ionicons name="camera-outline" size={16} color={colors.text} />
                                <Text style={[styles.avatarActionText, { color: colors.text }]}>Change Avatar</Text>
                             </TouchableOpacity>
                             <TouchableOpacity style={[styles.editProfileBtn, { backgroundColor: colors.primary }]} onPress={() => router.push('/profile/edit' as any)}>
                                <Ionicons name="create-outline" size={16} color={colors.textInverse} />
                                <Text style={[styles.avatarActionText, { color: colors.textInverse }]}>Edit Bio</Text>
                             </TouchableOpacity>
                        </View>

                        {/* Real stats */}
                        <View style={[styles.statsRow, { borderTopColor: colors.divider }]}>
                            {[
                                { val: followers.length.toLocaleString(), label: 'Followers', color: colors.text },
                                { val: following.length.toLocaleString(), label: 'Following', color: colors.text },
                                { val: myPosts.length.toLocaleString(), label: 'Posts', color: colors.text },
                                { val: totalLikes.toLocaleString(), label: 'Likes', color: colors.text },
                            ].map(({ val, label, color }, i) => (
                                <View key={label} style={styles.statItem}>
                                    <Text style={[styles.statVal, { color }]}>{val}</Text>
                                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
                                </View>
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
    profileBlock: { paddingBottom: Spacing.xl },
    profileContent: { paddingHorizontal: Spacing.xl },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, height: 60 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.heavy },
    proChip: { backgroundColor: 'rgba(255,165,0,0.15)', borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderWidth: 1, borderColor: '#FFA502' },
    proChipText: { color: '#FFA502', fontSize: 10, fontWeight: FontWeight.heavy },
    settingsBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    avatarActionRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
    avatarUploadBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 46, borderRadius: 14, borderWidth: 1, borderColor: '#eee' },
    editProfileBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 46, borderRadius: 14 },
    avatarActionText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: Spacing.xl, borderTopWidth: 1 },
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
