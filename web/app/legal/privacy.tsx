import { Spacing } from '@/constants/theme';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyScreen() {
    const router = useRouter();
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SafeAreaView edges={['top']} style={{ backgroundColor: colors.surface }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy Policy</Text>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>Last Updated: March 2, 2026</Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Information We Collect</Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    Walia collects information to provide better services to our users. This includes account information (name, email), study data (XP, level), and device information for app performance monitoring.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>2. How We Use Information</Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    We use the information we collect to maintain and improve our services, develop new study tools, and protect Walia and our users. We also use your data to personalize your study experience.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Data Storage & Firebase</Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    We use Google Firebase for authentication and real-time database services. Your data is stored securely on Google's servers. By using Walia, you consent to the storage of your data via Firebase.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Advertising (AdMob)</Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    Walia uses Google AdMob to display advertisements. These ads help us provide free AI services to students. AdMob may collect device identifiers to serve personalized ads. You can manage your ad preferences in your device settings.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>5. AI Data Processing</Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    AI chats and summaries are processed by third-party providers (OpenAI, DeepSeek, Google). While we do not share your personal identity with these providers, we recommend not sharing sensitive personal information in AI chats.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>6. Contact Us</Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                    If you have any questions about this Privacy Policy, please contact us at support@walia.app.
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
