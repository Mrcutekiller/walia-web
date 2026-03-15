import { Spacing } from '@/constants/theme';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
    const router = useRouter();
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SafeAreaView edges={['top']} style={{ backgroundColor: colors.surface }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Terms of Service</Text>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>Last Updated: March 2, 2026</Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Acceptance of Terms</Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    By accessing or using Walia, you agree to be bound by these Terms of Service. If you do not agree to all terms, do not use the application.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Account Usage</Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    You must provide accurate information when creating an account. You are responsible for all activity that occurs under your account. Walia reserves the right to suspend accounts that violate our community standards.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Use of AI Services</Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    Walia provides AI-powered study assistance. While we strive for accuracy, AI can occasionally provide incorrect or biased information. Users should verify critical study material through primary sources.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Community Standards</Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    Users may not post content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable. We reserve the right to remove any content that violates these standards.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Pro Plan & Payments</Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    Walia Pro can be unlocked via XP or purchase. Paid plans are subject to the terms of the respective app stores. Subscriptions may be cancelled at any time through your store settings.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>6. Limitation of Liability</Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    Walia is provided "as is" without warranty of any kind. We are not liable for any damages resulting from your use of the application.
                </Text>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    content: { padding: Spacing.xl },
    lastUpdated: { fontSize: 12, marginBottom: Spacing.xl },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: Spacing.xl, marginBottom: Spacing.md },
    paragraph: { fontSize: 14, lineHeight: 22, marginBottom: Spacing.md },
});
