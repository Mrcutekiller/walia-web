import { Input } from '@/components/ui/Input';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { askAI } from '@/services/ai';
import { useSocial } from '@/store/social';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SummarizeScreen() {
    const router = useRouter();
    const { saveStudyHistory } = useSocial();
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSummarize = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const prompt = `Please summarize the following text into a clear, concise bullet-point summary for a student:\n\n${text}`;
            const { text: result } = await askAI(prompt, [], 'auto');

            setSummary(result);
            await saveStudyHistory({
                tool: 'summarize',
                title: text.slice(0, 30) + (text.length > 30 ? '...' : ''),
                content: { original: text, summary: result }
            });
        } catch (e: any) {
            Alert.alert('AI Issue', e.message || 'Failed to generate summary');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Summarize ✨</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Paste your notes or text below:</Text>
                <Input
                    placeholder="Enter or paste text here..."
                    value={text}
                    onChangeText={setText}
                    multiline
                    numberOfLines={6}
                    style={styles.input}
                />

                <TouchableOpacity
                    style={[styles.summarizeBtn, !text.trim() && styles.disabledBtn]}
                    onPress={handleSummarize}
                    disabled={loading || !text.trim()}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="sparkles" size={20} color="#fff" />
                            <Text style={styles.summarizeBtnText}>Summarize with AI</Text>
                        </>
                    )}
                </TouchableOpacity>

                {summary ? (
                    <View style={styles.resultCard}>
                        <View style={styles.resultHeader}>
                            <Ionicons name="document-text" size={20} color={Colors.primary} />
                            <Text style={styles.resultTitle}>Summary Result</Text>
                        </View>
                        <Text style={styles.resultText}>{summary}</Text>
                        <TouchableOpacity style={styles.copyBtn}>
                            <Ionicons name="copy-outline" size={18} color={Colors.primary} />
                            <Text style={styles.copyBtnText}>Copy Summary</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="bulb-outline" size={48} color={Colors.textTertiary} />
                        <Text style={styles.emptyText}>Walia AI will help you condense long notes into key points.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
    title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
    content: { padding: Spacing.xl },
    sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: Spacing.md },
    input: { height: 160, textAlignVertical: 'top' },
    summarizeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: BorderRadius.pill, paddingVertical: Spacing.lg, marginTop: Spacing.md },
    disabledBtn: { opacity: 0.6 },
    summarizeBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.bold },
    resultCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.xl, marginTop: Spacing.xxl, borderWidth: 1, borderColor: Colors.border },
    resultHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
    resultTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
    resultText: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 24 },
    copyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginTop: Spacing.xl, paddingTop: Spacing.xl, borderTopWidth: 1, borderTopColor: Colors.divider },
    copyBtnText: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
    emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 80, opacity: 0.5 },
    emptyText: { textAlign: 'center', color: Colors.textSecondary, marginTop: Spacing.md, paddingHorizontal: 40 },
});
