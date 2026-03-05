import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SECTIONS = [
    {
        title: 'Preferences',
        items: [
            { icon: 'notifications', label: 'Notifications', desc: 'Push & sound alerts', type: 'toggle', key: 'notifications', defaultVal: true, color: '#FFA502' },
            { icon: 'moon', label: 'Dark Mode', desc: 'Switch app theme', type: 'themeToggle', key: 'darkMode', color: '#6C63FF' },
            { icon: 'language', label: 'Language', desc: 'English', type: 'nav', color: '#4ECDC4' },
            { icon: 'text', label: 'Font Size', desc: 'Normal', type: 'nav', color: '#FF6B6B' },
        ],
    },
    {
        title: 'Privacy & Security',
        items: [
            { icon: 'lock-closed', label: 'Change Password', desc: 'Update your password', type: 'nav', color: '#FF4757' },
            { icon: 'eye-off', label: 'Private Account', desc: 'Control who sees your posts', type: 'toggle', key: 'private', defaultVal: false, color: '#6C63FF' },
            { icon: 'shield', label: 'Two-Factor Auth', desc: 'Extra login security', type: 'toggle', key: 'twoFactor', defaultVal: true, color: '#2ED573' },
            { icon: 'finger-print', label: 'Biometric Login', desc: 'Face ID / Fingerprint', type: 'toggle', key: 'biometric', defaultVal: false, color: '#4ECDC4' },
        ],
    },
    {
        title: 'About',
        items: [
            { icon: 'help-circle', label: 'Help & Support', desc: 'FAQs and guides', type: 'nav', color: '#4ECDC4' },
            { icon: 'document-text', label: 'Terms of Service', desc: 'Legal information', type: 'nav', color: '#9CA3AF' },
            { icon: 'shield-checkmark', label: 'Privacy Policy', desc: 'How we use your data', type: 'nav', color: '#6C63FF' },
            { icon: 'information-circle', label: 'App Version', desc: '', type: 'info', value: '1.0.0', color: '#9CA3AF' },
        ],
    },
];

export default function SettingsScreen() {
    const router = useRouter();
    const { colors, isDark, toggleTheme } = useTheme();

    // Local toggle states
    const [toggles, setToggles] = useState<Record<string, boolean>>({
        notifications: true,
        private: false,
        twoFactor: true,
        biometric: false,
    });

    const handleNav = (label: string) => {
        const responses: Record<string, [string, string]> = {
            'Language': ['🌐 Language', 'Currently set to English.\nMore languages coming soon!'],
            'Font Size': ['🔤 Font Size', 'Font size customization coming in the next update.'],
            'Change Password': ['🔑 Change Password', 'Password change will be available after email verification is set up.'],
            'Help & Support': ['❓ Help & Support', 'Visit help.walia.app for FAQs and step-by-step guides.\n\nEmail: support@walia.app'],
            'Terms of Service': ['📄 Terms of Service', 'Full terms available at walia.app/terms'],
            'Privacy Policy': ['🔒 Privacy Policy', 'Full policy available at walia.app/privacy'],
        };
        const r = responses[label];
        if (r) Alert.alert(r[0], r[1]);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient
                colors={isDark ? ['#1A1A2E', '#0D0D1A'] : ['#6C63FF', '#8B85FF']}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Ionicons name="arrow-back" size={22} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Settings</Text>
                        <View style={{ width: 36 }} />
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.xl, paddingBottom: 100 }}>
                {SECTIONS.map((section, si) => (
                    <View key={si} style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{section.title}</Text>
                        <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
                            {section.items.map((item: any, ii: number) => {
                                const isLast = ii === section.items.length - 1;
                                const isTheme = item.type === 'themeToggle';
                                const toggleVal = isTheme ? isDark : (toggles[item.key] ?? item.defaultVal ?? false);

                                return (
                                    <TouchableOpacity
                                        key={ii}
                                        style={[styles.item, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}
                                        onPress={() => {
                                            if (isTheme) { toggleTheme(); return; }
                                            if (item.type === 'toggle') { setToggles(prev => ({ ...prev, [item.key]: !prev[item.key] })); return; }
                                            if (item.type === 'nav') { handleNav(item.label); return; }
                                        }}
                                        activeOpacity={item.type === 'info' ? 1 : 0.7}
                                    >
                                        <View style={[styles.iconWrap, { backgroundColor: `${item.color}18` }]}>
                                            <Ionicons name={`${item.icon}-outline` as any} size={20} color={item.color} />
                                        </View>
                                        <View style={styles.itemContent}>
                                            <Text style={[styles.itemLabel, { color: colors.text }]}>{item.label}</Text>
                                            {item.desc ? <Text style={[styles.itemDesc, { color: colors.textTertiary }]}>{item.desc}</Text> : null}
                                        </View>
                                        {(item.type === 'toggle' || isTheme) && (
                                            <Switch
                                                value={toggleVal}
                                                onValueChange={() => {
                                                    if (isTheme) { toggleTheme(); return; }
                                                    setToggles(prev => ({ ...prev, [item.key]: !prev[item.key] }));
                                                }}
                                                trackColor={{ false: colors.border, true: item.color }}
                                                thumbColor="#fff"
                                            />
                                        )}
                                        {item.type === 'nav' && (
                                            <View style={styles.navRight}>
                                                {item.value && <Text style={[styles.navValue, { color: colors.textTertiary }]}>{item.value}</Text>}
                                                <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                                            </View>
                                        )}
                                        {item.type === 'info' && (
                                            <Text style={[styles.infoValue, { color: colors.primary }]}>{item.value}</Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerGradient: {},
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
    backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: '#fff' },
    section: { marginBottom: Spacing.xxl },
    sectionTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm, paddingLeft: Spacing.xs },
    sectionCard: { borderRadius: BorderRadius.xl, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
    item: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md },
    iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    itemContent: { flex: 1 },
    itemLabel: { fontSize: FontSize.md, fontWeight: FontWeight.medium },
    itemDesc: { fontSize: FontSize.xs, marginTop: 2 },
    navRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
    navValue: { fontSize: FontSize.sm },
    infoValue: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
});
