import MembershipCard from '@/components/MembershipCard';
import { PostCard } from '@/components/ui/PostCard';
import { useAuth } from '@/store/auth';
import { PRO_PLAN_XP_COST, useSocial } from '@/store/social';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
    Alert, Animated, Image, Linking, Modal, ScrollView,
    StyleSheet, Switch, Text, TouchableOpacity, View, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
    const router = useRouter();
    const { colors, isDark, toggleTheme } = useTheme();
    const { user, logout, uploadAvatar } = useAuth();
    const [updatingAvatar, setUpdatingAvatar] = useState(false);
    const social = useSocial();

    const { xp, followers, following, posts, isPro } = social;
    const myPosts = posts.filter(p => p.authorId === user?.id);

    const scaleAnim = useRef(new Animated.Value(1)).current;

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
        color: '#6366F1'
    });

    const showModal = (title: string, msg: string, icon: string, color: string, onConfirm?: () => void) => {
        setModal({ visible: true, title, msg, icon, color, onConfirm });
    };

    const handleLogout = () => {
        showModal('Sign Out', 'Are you sure you want to sign out from Walia?', 'log-out-outline', '#EF4444', () => logout());
    };

    const handleDeleteAccount = () => {
        showModal('Delete Account', 'This action is permanent. All your data will be lost forever.', 'trash-outline', '#EF4444', () => {
            setTimeout(() => logout(), 500);
        });
    };

    const handleEditProfile = () => {
        router.push('/edit-profile');
    };

    const xpToProPct = Math.min(100, Math.round((xp / PRO_PLAN_XP_COST) * 100));

    const MENU_ITEMS = [
        { icon: 'moon-outline', label: 'Dark Mode', color: '#6366F1', toggle: true, value: isDark, action: toggleTheme },
        { icon: 'notifications-outline', label: 'Notifications', color: '#F59E0B', action: () => router.push('/notifications') },
        { icon: 'bookmark-outline', label: 'Saved Insights', color: '#10B981', action: () => { } },
        { icon: 'help-circle-outline', label: 'Help & Support', color: '#8B5CF6', action: () => router.push('/contact') },
        { icon: 'shield-checkmark-outline', label: 'Privacy Policy', color: '#EC4899', action: () => { } },
        { icon: 'document-text-outline', label: 'Terms of Service', color: '#06B6D4', action: () => { } },
    ];

    const bg = isDark ? colors.background : '#F8FAFC';
    const cardBg = isDark ? colors.surface : '#FFFFFF';

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

                {/* ── Hero Banner ── */}
                <LinearGradient
                    colors={isDark ? ['#1E293B', '#0F172A'] : ['#6366F1', '#818CF8']}
                    style={styles.heroBanner}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                >
                    <SafeAreaView edges={['top']}>
                        <View style={styles.bannerTop}>
                            <Text style={styles.bannerLabel}>WALIA PROFILE</Text>
                            <TouchableOpacity
                                style={styles.settingsBtn}
                                onPress={() => router.push('/notifications')}
                            >
                                <Ionicons name="notifications-outline" size={20} color="rgba(255,255,255,0.9)" />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>

                    {/* Decorative circles */}
                    <View style={styles.circleDecor1} />
                    <View style={styles.circleDecor2} />
                </LinearGradient>

                {/* ── Avatar floated above banner ── */}
                <View style={styles.profileCard}>
                    <View style={[styles.profileCardInner, { backgroundColor: cardBg }]}>
                        <View style={styles.avatarSection}>
                            <TouchableOpacity onPress={handleEditProfile} activeOpacity={0.85}>
                                <View style={[styles.avatarRing, { borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
                                    {user?.photoURL?.length && user.photoURL.length <= 2 ? (
                                        <View style={[styles.avatarPlaceholder, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}>
                                            <Text style={styles.avatarEmoji}>{user.photoURL}</Text>
                                        </View>
                                    ) : user?.photoURL ? (
                                        <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
                                    ) : (
                                        <LinearGradient
                                            colors={['#6366F1', '#8B5CF6']}
                                            style={styles.avatarPlaceholder}
                                        >
                                            <Text style={styles.avatarInitial}>
                                                {user?.name?.charAt(0)?.toUpperCase() || '?'}
                                            </Text>
                                        </LinearGradient>
                                    )}
                                    <View style={[styles.cameraBtn, { backgroundColor: '#6366F1' }]}>
                                        <Ionicons name="pencil" size={14} color="#FFF" />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <View style={styles.userInfo}>
                                <Text style={[styles.userName, { color: colors.text }]}>
                                    {user?.name || 'Explorer'}
                                </Text>
                                <Text style={[styles.userHandle, { color: colors.textTertiary }]}>
                                    @{user?.username || 'walia_user'}
                                </Text>
                                {isPro && (
                                    <View style={styles.proBadge}>
                                        <Ionicons name="shield-checkmark" size={10} color="#FFF" />
                                        <Text style={styles.proBadgeText}>PRO</Text>
                                    </View>
                                )}
                            </View>
                            
                            <TouchableOpacity style={styles.editProfileBtn} onPress={handleEditProfile}>
                                <Text style={styles.editProfileBtnText}>Edit</Text>
                            </TouchableOpacity>
                        </View>

                        {user?.bio ? (
                            <Text style={[styles.userBio, { color: colors.textSecondary }]}>
                                {user.bio}
                            </Text>
                        ) : (
                            <Text style={[styles.userBio, { color: colors.textTertiary }]}>
                                Building the future with Walia AI 🚀
                            </Text>
                        )}

                        {/* Stats Row */}
                        <View style={[styles.statsRow, { borderTopColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                            {[
                                { val: myPosts.length, label: 'Posts' },
                                { val: followers.length, label: 'Followers' },
                                { val: following.length, label: 'Following' },
                                { val: xp.toLocaleString(), label: '⭐ pts' },
                            ].map((stat, i, arr) => (
                                <React.Fragment key={stat.label}>
                                    <View style={styles.statItem}>
                                        <Text style={[styles.statValue, { color: colors.text }]}>{stat.val}</Text>
                                        <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{stat.label}</Text>
                                    </View>
                                    {i < arr.length - 1 && (
                                        <View style={[styles.statDiv, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]} />
                                    )}
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                </View>

                {/* ── Membership Card ── */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>MEMBERSHIP</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/pro')}
                        activeOpacity={0.92}
                        style={styles.membershipCard}
                    >
                        <LinearGradient
                            colors={isPro ? ['#6366F1', '#8B5CF6', '#A78BFA'] : ['#0F172A', '#1E293B']}
                            style={styles.membershipGradient}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.membershipRow}>
                                <View style={styles.membershipIconBox}>
                                    <Ionicons name={isPro ? 'shield-checkmark' : 'flash'} size={26} color="#FFF" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.membershipTitle}>
                                        {isPro ? 'Walia Pro Member' : 'Unlock Pro Access'}
                                    </Text>
                                    <Text style={styles.membershipSub}>
                                        {isPro
                                            ? 'Full access to all AI models & features'
                                            : `${xp.toLocaleString()} / 10,000 Walia Points to free Pro`}
                                    </Text>
                                </View>
                                <View style={styles.membershipArrow}>
                                    <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
                                </View>
                            </View>

                            {!isPro && (
                                <View style={styles.progressBg}>
                                    <View style={[styles.progressBar, { width: `${xpToProPct}%` }]} />
                                </View>
                            )}

                            {/* Decorative circles */}
                            <View style={styles.memberDecor1} />
                            <View style={styles.memberDecor2} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* ── Plan Details ── */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>YOUR PLAN</Text>
                    <View style={[styles.planCard, { backgroundColor: cardBg, borderColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                        {/* Plan header */}
                        <View style={styles.planHeader}>
                            <View style={[styles.planBadge, { backgroundColor: isPro ? '#6366F115' : '#F1F5F9' }]}>
                                <Text style={styles.planBadgeEmoji}>{isPro ? '👑' : '🌱'}</Text>
                                <Text style={[styles.planBadgeText, { color: isPro ? '#6366F1' : colors.textSecondary }]}>
                                    {isPro ? 'Pro Plan' : 'Free Plan'}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => router.push('/pro')}
                                style={[styles.planUpgradeBtn, { backgroundColor: isPro ? '#10B98115' : '#6366F1' }]}
                            >
                                <Text style={[styles.planUpgradeBtnText, { color: isPro ? '#10B981' : '#FFF' }]}>
                                    {isPro ? '✓ Active' : 'Upgrade'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Limits grid */}
                        <View style={styles.limitsGrid}>
                            {[
                                { icon: 'chatbubbles-outline', label: 'AI Chats / day', free: '20', pro: '∞' },
                                { icon: 'calendar-outline', label: 'Study Plans', free: '5', pro: '∞' },
                                { icon: 'grid-outline', label: 'Tool Uses / day', free: '10', pro: '∞' },
                                { icon: 'image-outline', label: 'Uploads / day', free: '5', pro: '∞' },
                            ].map((item, i) => (
                                <View key={i} style={[styles.limitItem, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: isDark ? '#334155' : '#F1F5F9' }]}>
                                    <Ionicons name={item.icon as any} size={18} color={isPro ? '#6366F1' : colors.textTertiary} />
                                    <Text style={[styles.limitLabel, { color: colors.textSecondary }]} numberOfLines={1}>{item.label}</Text>
                                    <Text style={[styles.limitVal, { color: isPro ? '#6366F1' : colors.text }]}>
                                        {isPro ? item.pro : item.free}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {!isPro && (
                            <View style={styles.planProgress}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text style={[styles.planProgressLabel, { color: colors.textSecondary }]}>
                                        Walia Points to Pro
                                    </Text>
                                    <Text style={[styles.planProgressVal, { color: '#6366F1' }]}>
                                        {xp.toLocaleString()} / 10,000
                                    </Text>
                                </View>
                                <View style={[styles.planProgressBg, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
                                    <LinearGradient
                                        colors={['#6366F1', '#8B5CF6']}
                                        style={[styles.planProgressFill, { width: `${Math.min(100, (xp / 10000) * 100)}%` as any }]}
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {/* ── Preferences ── */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>PREFERENCES</Text>

                    <View style={[styles.menuCard, { backgroundColor: cardBg, borderColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                        {MENU_ITEMS.map((item, i) => (
                            <TouchableOpacity
                                key={item.label}
                                style={[
                                    styles.menuItem,
                                    { borderBottomColor: isDark ? '#1E293B' : '#F8FAFC' },
                                    i < MENU_ITEMS.length - 1 && { borderBottomWidth: 1 }
                                ]}
                                onPress={item.action}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.menuIconBox, { backgroundColor: `${item.color}15` }]}>
                                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                                </View>
                                <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                                {item.toggle ? (
                                    <Switch
                                        value={item.value}
                                        onValueChange={item.action}
                                        trackColor={{ false: isDark ? '#334155' : '#E2E8F0', true: '#6366F1' }}
                                        thumbColor="#FFF"
                                        ios_backgroundColor={isDark ? '#334155' : '#E2E8F0'}
                                    />
                                ) : (
                                    <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* ── Account Actions ── */}
                <View style={[styles.section, { marginTop: 8 }]}>
                    <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>ACCOUNT</Text>
                    <TouchableOpacity
                        style={[styles.signOutBtn, { backgroundColor: isDark ? '#1E293B' : '#FEF2F2', borderColor: '#FEE2E2' }]}
                        onPress={handleLogout}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteLink} onPress={handleDeleteAccount}>
                        <Text style={[styles.deleteLinkText, { color: colors.textTertiary }]}>
                            Delete Account Permanently
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.versionText, { color: colors.textTertiary }]}>
                    Walia v2.0 • Made with ♥
                </Text>
            </ScrollView>

            {/* ── Confirmation Modal ── */}
            <Modal transparent visible={modal.visible} animationType="fade">
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        onPress={() => setModal({ ...modal, visible: false })}
                    />
                    <View style={[styles.modalCard, { backgroundColor: cardBg }]}>
                        <View style={[styles.modalIconWrap, { backgroundColor: `${modal.color}15` }]}>
                            <Ionicons name={modal.icon as any} size={32} color={modal.color} />
                        </View>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{modal.title}</Text>
                        <Text style={[styles.modalMsg, { color: colors.textSecondary }]}>{modal.msg}</Text>
                        <View style={styles.modalBtns}>
                            <TouchableOpacity
                                style={[styles.modalBtnCancel, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                                onPress={() => setModal({ ...modal, visible: false })}
                            >
                                <Text style={[styles.modalBtnCancelText, { color: colors.textSecondary }]}>Cancel</Text>
                            </TouchableOpacity>
                            {modal.onConfirm && (
                                <TouchableOpacity
                                    style={[styles.modalBtnConfirm, { backgroundColor: modal.color }]}
                                    onPress={() => { setModal({ ...modal, visible: false }); modal.onConfirm?.(); }}
                                >
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

    // Hero
    heroBanner: {
        height: 180,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        overflow: 'hidden',
    },
    bannerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 8,
    },
    bannerLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
    },
    settingsBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleDecor1: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.05)',
        right: -60,
        top: -60,
    },
    circleDecor2: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.08)',
        left: -30,
        bottom: -30,
    },

    // Profile Card
    profileCard: {
        marginHorizontal: 20,
        marginTop: -48,
        marginBottom: 8,
    },
    profileCardInner: {
        borderRadius: 28,
        padding: 20,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 8,
    },
    avatarSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 14,
    },
    avatarRing: {
        width: 80,
        height: 80,
        borderRadius: 26,
        borderWidth: 3,
        overflow: 'visible',
        position: 'relative',
    },
    avatarImage: {
        width: 74,
        height: 74,
        borderRadius: 23,
    },
    avatarPlaceholder: {
        width: 74,
        height: 74,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFF',
    },
    avatarEmoji: {
        fontSize: 36,
    },
    cameraBtn: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 28,
        height: 28,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    userInfo: { flex: 1 },
    userName: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
    userHandle: { fontSize: 14, fontWeight: '600', marginTop: 2 },
    proBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#6366F1',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 6,
    },
    proBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
    userBio: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
    editProfileBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(99,102,241,0.1)',
        alignSelf: 'flex-start',
    },
    editProfileBtnText: {
        color: '#6366F1',
        fontWeight: '700',
        fontSize: 12,
    },

    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
    },
    statItem: { flex: 1, alignItems: 'center' },
    statValue: { fontSize: 20, fontWeight: '900' },
    statLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 2 },
    statDiv: { width: 1, height: 32 },

    // Sections
    section: { paddingHorizontal: 20, marginTop: 28 },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 14,
        marginLeft: 4,
        textTransform: 'uppercase',
    },

    // Membership
    membershipCard: { borderRadius: 24, overflow: 'hidden' },
    membershipGradient: { padding: 22, position: 'relative', overflow: 'hidden' },
    membershipRow: { flexDirection: 'row', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 },
    membershipIconBox: {
        width: 52,
        height: 52,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    membershipTitle: { color: '#FFF', fontSize: 17, fontWeight: '900' },
    membershipSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600', marginTop: 3 },
    membershipArrow: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBg: {
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 4,
        marginTop: 16,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
    },
    progressBar: { height: '100%', backgroundColor: '#FFF', borderRadius: 4 },
    memberDecor1: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.05)',
        right: -40,
        top: -40,
    },
    memberDecor2: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.07)',
        left: -20,
        bottom: -20,
    },

    // Menu
    menuCard: {
        borderRadius: 24,
        borderWidth: 1,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
    menuIconBox: {
        width: 40,
        height: 40,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuLabel: { flex: 1, fontSize: 15, fontWeight: '700' },

    // Plan card
    planCard: {
        borderRadius: 24,
        borderWidth: 1,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    planBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
    planBadgeEmoji: { fontSize: 16 },
    planBadgeText: { fontSize: 14, fontWeight: '900' },
    planUpgradeBtn: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 14 },
    planUpgradeBtnText: { fontSize: 13, fontWeight: '900' },
    limitsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    limitItem: {
        width: '47%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
    },
    limitLabel: { flex: 1, fontSize: 11, fontWeight: '600' },
    limitVal: { fontSize: 14, fontWeight: '900' },
    planProgress: { marginTop: 16 },
    planProgressLabel: { fontSize: 12, fontWeight: '700' },
    planProgressVal: { fontSize: 12, fontWeight: '900' },
    planProgressBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
    planProgressFill: { height: '100%', borderRadius: 4 },


    signOutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 18,
        borderRadius: 20,
        borderWidth: 1,
    },
    signOutText: { fontSize: 16, fontWeight: '800', color: '#EF4444' },
    deleteLink: { alignItems: 'center', marginTop: 14, paddingVertical: 8 },
    deleteLinkText: { fontSize: 13, fontWeight: '600', textDecorationLine: 'underline' },

    versionText: { textAlign: 'center', fontSize: 12, fontWeight: '500', marginTop: 32, paddingBottom: 20 },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 28,
    },
    modalCard: {
        width: '100%',
        borderRadius: 32,
        padding: 28,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 40,
        elevation: 20,
    },
    modalIconWrap: {
        width: 68,
        height: 68,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    modalTitle: { fontSize: 22, fontWeight: '900', marginBottom: 8, textAlign: 'center' },
    modalMsg: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
    modalBtns: { flexDirection: 'row', gap: 12, width: '100%' },
    modalBtnCancel: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    modalBtnCancelText: { fontSize: 15, fontWeight: '700' },
    modalBtnConfirm: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    modalBtnConfirmText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
});
