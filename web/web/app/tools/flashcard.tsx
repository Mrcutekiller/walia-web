import { Input } from '@/components/ui/Input';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useSocial } from '@/store/social';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FlashcardScreen() {
    const router = useRouter();
    const { saveStudyHistory } = useSocial();
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [flashcards, setFlashcards] = useState<{ q: string; a: string; flipped: boolean }[]>([]);

    const handleGenerate = async () => {
        if (!note.trim()) return;
        setLoading(true);
        // Simulate AI generation
        setTimeout(async () => {
            const data = [
                { q: 'Key term from your notes', a: 'Explanation found in the provided text.', flipped: false },
                { q: 'Related concept', a: 'Secondary detail extracted for review.', flipped: false },
            ];
            setFlashcards(data);
            setLoading(false);
            await saveStudyHistory({
                tool: 'flashcard',
                title: note.slice(0, 20) + '...',
                content: { note, count: data.length }
            });
        }, 1500);
    };

    const toggleFlip = (index: number) => {
        setFlashcards(prev => prev.map((c, i) => i === index ? { ...c, flipped: !c.flipped } : c));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Flashcards 🎴</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.inputSection}>
                <Text style={styles.sectionTitle}>Generate from your notes:</Text>
                <Input
                    placeholder="Paste your study notes here..."
                    value={note}
                    onChangeText={setNote}
                    multiline
                    numberOfLines={4}
                    style={styles.input}
                />
                <TouchableOpacity
                    style={[styles.genBtn, !note.trim() && styles.disabledBtn]}
                    onPress={handleGenerate}
                    disabled={loading || !note.trim()}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.genBtnText}>Generate Cards</Text>}
                </TouchableOpacity>
            </View>

            {flashcards.length > 0 ? (
                <FlatList
                    data={flashcards}
                    keyExtractor={(_, i) => i.toString()}
                    contentContainerStyle={styles.list}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={[styles.card, item.flipped && styles.cardFlipped]}
                            onPress={() => toggleFlip(index)}
                        >
                            <Text style={[styles.cardText, item.flipped && styles.cardTextFlipped]}>
                                {item.flipped ? item.a : item.q}
                            </Text>
                            <View style={styles.flipHint}>
                                <Ionicons name="refresh" size={12} color={item.flipped ? Colors.primary : Colors.textTertiary} />
                                <Text style={[styles.flipHintText, { color: item.flipped ? Colors.primary : Colors.textTertiary }]}>
                                    Tap to flip
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Ionicons name="documents-outline" size={48} color={Colors.textTertiary} />
                    <Text style={styles.emptyText}>Enter some notes above to create smart flashcards.</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
    title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
    inputSection: { padding: Spacing.xl, borderBottomWidth: 1, borderBottomColor: Colors.divider },
    sectionTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textSecondary, textTransform: 'uppercase', marginBottom: Spacing.sm },
    input: { height: 100 },
    genBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.pill, paddingVertical: 14, alignItems: 'center' },
    disabledBtn: { opacity: 0.5 },
    genBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.bold },
    list: { padding: Spacing.xl },
    card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.xxl, height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
    cardFlipped: { borderColor: Colors.primary, backgroundColor: Colors.surfaceAlt },
    cardText: { fontSize: FontSize.lg, textAlign: 'center', color: Colors.text, fontWeight: FontWeight.medium, lineHeight: 28 },
    cardTextFlipped: { color: Colors.primary, fontWeight: FontWeight.bold },
    flipHint: { position: 'absolute', bottom: 12, flexDirection: 'row', alignItems: 'center', gap: 4 },
    flipHintText: { fontSize: 10, fontWeight: FontWeight.bold, textTransform: 'uppercase' },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', opacity: 0.5, marginTop: 100 },
    emptyText: { textAlign: 'center', color: Colors.textSecondary, marginTop: Spacing.md, paddingHorizontal: 40 },
});
