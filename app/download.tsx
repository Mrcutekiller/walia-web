import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/store/theme';
import { BlurView } from 'expo-blur';

export default function DownloadScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out Walia AI - Your smartest study companion! Download it here: https://walia-web.vercel.app/download',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings & Updates</Text>
        <View style={{ width: 44 }} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
            <Ionicons name="cloud-download" size={40} color="#fff" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Walia for Mobile</Text>
          <Text style={[styles.version, { color: colors.textTertiary }]}>v1.0.4 - Official Build</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>CURRENT STATUS</Text>
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.infoRow}>
              <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.infoText, { color: colors.text }]}>System is up to date</Text>
            </View>
            <Text style={[styles.infoSub, { color: colors.textTertiary }]}>You are using the latest stable version of Walia AI.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>SHARE WALIA</Text>
          <TouchableOpacity onPress={handleShare} style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="share-social" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Share with friends</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>LINKS</Text>
          <View style={[styles.linksContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={[styles.linkText, { color: colors.text }]}>Website</Text>
              <Ionicons name="open-outline" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.linkItem}>
              <Text style={[styles.linkText, { color: colors.text }]}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.linkItem}>
              <Text style={[styles.linkText, { color: colors.text }]}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            Designed with ❤️ in Addis Ababa{'\n'}© 2024 Walia AI Technologies
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  content: { padding: 25 },
  hero: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  iconContainer: { width: 100, height: 100, borderRadius: 35, alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  title: { fontSize: 24, fontWeight: '900' },
  version: { fontSize: 14, fontWeight: '600', marginTop: 5 },
  section: { marginBottom: 30 },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 12, marginLeft: 5 },
  infoCard: { padding: 20, borderRadius: 25, borderWidth: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  infoText: { fontSize: 16, fontWeight: '800' },
  infoSub: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 25, borderWidth: 1 },
  actionLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  actionIcon: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { fontSize: 16, fontWeight: '800' },
  linksContainer: { borderRadius: 25, borderWidth: 1, overflow: 'hidden' },
  linkItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  linkText: { fontSize: 15, fontWeight: '700' },
  divider: { height: 1, width: '100%' },
  footerText: { textAlign: 'center', fontSize: 12, lineHeight: 20, fontWeight: '600', marginTop: 20, paddingBottom: 40 },
});
