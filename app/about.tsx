import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/store/theme';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const missionData = [
  { icon: 'bulb-outline', title: 'Innovation', desc: 'Pushing boundaries of AI in education.' },
  { icon: 'shield-checkmark-outline', title: 'Security', desc: 'Your data is private and encrypted.' },
  { icon: 'people-outline', title: 'Community', desc: 'Built for students, by students.' },
];

export default function AboutScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070' }} 
            style={styles.heroImage} 
          />
          <LinearGradient
            colors={['transparent', colors.background]}
            style={styles.heroGradient}
          />
          <SafeAreaView style={styles.headerNav}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={styles.blurBtn}>
                <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
              </BlurView>
            </TouchableOpacity>
          </SafeAreaView>
          
          <View style={styles.heroContent}>
            <Text style={styles.heroBadge}>EST. 2024</Text>
            <Text style={[styles.heroTitle, { color: isDark ? '#fff' : '#000' }]}>Mission Walia</Text>
            <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>Empowering the next generation of learners with personalized AI.</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>The Story</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            Walia was born from a simple observation: students are overwhelmed with information but starving for knowledge. We built an AI that doesn't just give answers, but helps you understand the "why" behind every concept.
          </Text>

          {/* Value Cards */}
          <View style={styles.grid}>
            {missionData.map((item, i) => (
              <View key={i} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name={item.icon as any} size={24} color={colors.primary} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.cardDesc, { color: colors.textTertiary }]}>{item.desc}</Text>
              </View>
            ))}
          </View>

          {/* Founder */}
          <View style={[styles.founderCard, { backgroundColor: colors.primaryDark || '#000' }]}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974' }} 
              style={styles.founderImg} 
            />
            <View style={styles.founderInfo}>
              <Text style={styles.founderName}>Biruk Fikru</Text>
              <Text style={styles.founderRole}>Founder & Lead Architect</Text>
              <Text style={styles.founderBio}>"We're not just building an app; we're building a smarter future for Ethiopia and beyond."</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { height: 450, position: 'relative' },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 300 },
  headerNav: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingHorizontal: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  blurBtn: { width: '100%', height: '100%', alignItems: 'center', justifyCenter: 'center', backgroundColor: 'rgba(255,255,255,0.1)' },
  heroContent: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  heroBadge: { color: '#10B981', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 10 },
  heroTitle: { fontSize: 48, fontWeight: '900', letterSpacing: -2 },
  heroSubtitle: { fontSize: 16, marginTop: 10, lineHeight: 24, fontWeight: '500' },
  content: { padding: 25 },
  sectionTitle: { fontSize: 28, fontWeight: '900', marginBottom: 15 },
  text: { fontSize: 16, lineHeight: 26, fontWeight: '500' },
  grid: { marginTop: 40, gap: 15 },
  card: { padding: 25, borderRadius: 30, borderWidth: 1 },
  iconBox: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  cardDesc: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  founderCard: { marginTop: 40, padding: 30, borderRadius: 35, flexDirection: 'row', gap: 20, alignItems: 'center' },
  founderImg: { width: 80, height: 80, borderRadius: 25 },
  founderInfo: { flex: 1 },
  founderName: { color: '#fff', fontSize: 20, fontWeight: '900' },
  founderRole: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 10 },
  founderBio: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
});
