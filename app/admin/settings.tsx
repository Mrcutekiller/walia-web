import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Switch } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';

export default function AdminSettingsScreen() {
    const { colors, isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        aiProvider: 'gemini',
        allowGPT: true,
        allowDeepSeek: true,
        proPriceEtb: 1350,
        proPriceUsd: 19.99,
        maintenanceMode: false
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const snap = await getDoc(doc(db, 'platform_settings', 'main'));
                if (snap.exists()) setSettings(snap.data() as any);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'platform_settings', 'main'), settings);
            Alert.alert('Success', 'Global settings updated.');
        } catch (error) {
            Alert.alert('Error', 'Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.scroll}>
            <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>AI Configuration</Text>
                
                <View style={styles.settingRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.settingLabel, { color: colors.text }]}>Allow ChatGPT Fallback</Text>
                        <Text style={[styles.settingDesc, { color: colors.textTertiary }]}>Use OpenAI when Gemini fails.</Text>
                    </View>
                    <Switch 
                        value={settings.allowGPT} 
                        onValueChange={v => setSettings(s => ({ ...s, allowGPT: v }))}
                        trackColor={{ true: colors.primary }}
                    />
                </View>

                <View style={styles.settingRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.settingLabel, { color: colors.text }]}>Allow DeepSeek Fallback</Text>
                        <Text style={[styles.settingDesc, { color: colors.textTertiary }]}>Advanced coding & logic backup.</Text>
                    </View>
                    <Switch 
                        value={settings.allowDeepSeek} 
                        onValueChange={v => setSettings(s => ({ ...s, allowDeepSeek: v }))}
                        trackColor={{ true: colors.primary }}
                    />
                </View>
            </View>

            <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Subscription Pricing</Text>
                
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>PRO PLAN PRICE (ETB)</Text>
                    <TextInput 
                        style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.divider }]}
                        value={String(settings.proPriceEtb)}
                        onChangeText={v => setSettings(s => ({ ...s, proPriceEtb: parseInt(v) || 0 }))}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>PRO PLAN PRICE (USD)</Text>
                    <TextInput 
                        style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.divider }]}
                        value={String(settings.proPriceUsd)}
                        onChangeText={v => setSettings(s => ({ ...s, proPriceUsd: parseFloat(v) || 0 }))}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <TouchableOpacity 
                style={[styles.saveBtn, { backgroundColor: isDark ? '#fff' : '#000' }]}
                onPress={handleSave}
                disabled={saving}
            >
                {saving ? <ActivityIndicator size="small" color={isDark ? '#000' : '#fff'} /> : <Text style={[styles.saveText, { color: isDark ? '#000' : '#fff' }]}>Save Global Settings</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    scroll: { padding: Spacing.xl, gap: Spacing.xl, paddingBottom: 100 },
    section: { padding: Spacing.xl, borderRadius: 32, borderWidth: 1, gap: Spacing.lg },
    sectionTitle: { fontSize: 10, fontWeight: FontWeight.black, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
    settingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    settingLabel: { fontSize: FontSize.md, fontWeight: FontWeight.black },
    settingDesc: { fontSize: 12, marginTop: 2, fontWeight: FontWeight.medium },
    inputGroup: { gap: 8 },
    label: { fontSize: 10, fontWeight: FontWeight.black, letterSpacing: 1.5 },
    input: { height: 52, borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, fontSize: FontSize.md, fontWeight: FontWeight.bold },
    saveBtn: { height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xl },
    saveText: { fontSize: 14, fontWeight: FontWeight.black, textTransform: 'uppercase', letterSpacing: 1 },
});
