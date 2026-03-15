import { Input } from '@/components/ui/Input';
import { BorderRadius, Colors, FontSize, FontWeight, Shadow, Spacing } from '@/constants/theme';
import { askAI } from '@/services/ai';
import { useSocial } from '@/store/social';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuizScreen() {
    const router = useRouter();
    const { saveStudyHistory } = useSocial();
    const [note, setNote] = useState('');
    const [quizType, setQuizType] = useState<'mcq' | 'tf'>('mcq');
    const [loading, setLoading] = useState(false);
    const [quizzes, setQuizzes] = useState<{
        question: string;
        options: string[];
        correctIndex: number;
        explanation: string;
    }[]>([]);

    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [finished, setFinished] = useState(false);

    const quiz = quizzes[currentQ];

    const handleGenerate = async () => {
        if (!note.trim()) return;
        setLoading(true);
        try {
            const prompt = `Generate a 5-question ${quizType === 'mcq' ? 'Multiple Choice' : 'True/False'} quiz based on the following notes. 
            Format your response as a valid JSON array of objects. 
            Each object MUST have:
            - question (string)
            - options (array of strings, exactly 4 for MCQ, exactly 2 for T/F which must be ["True", "False"])
            - correctIndex (number, 0-indexed)
            - explanation (string)

            Notes: ${note}`;

            const { text: result } = await askAI(prompt, [], 'auto');

            // Extract JSON from response (sometimes AI adds markdown blocks)
            const jsonMatch = result.match(/\[[\s\S]*\]/);
            if (!jsonMatch) throw new Error('Invalid AI response format');

            const data = JSON.parse(jsonMatch[0]);
            setQuizzes(data);
        } catch (e: any) {
            Alert.alert('AI Issue', e.message || 'Failed to generate quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (index: number) => {
        if (answered) return;
        setSelected(index);
        setAnswered(true);
        if (index === quiz.correctIndex) setScore(score + 1);
    };

    const handleNext = async () => {
        if (currentQ < quizzes.length - 1) {
            setCurrentQ(currentQ + 1);
            setSelected(null);
            setAnswered(false);
        } else {
            setFinished(true);
            await saveStudyHistory({
                tool: 'quiz',
                title: note.slice(0, 20) + '...',
                content: { note, score, total: quizzes.length, type: quizType }
            });
        }
    };

    if (finished) {
        const percentage = Math.round((score / quizzes.length) * 100);
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Quiz Complete! 🎉</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.resultContainer}>
                    <Text style={styles.resultEmoji}>{percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : '📚'}</Text>
                    <Text style={styles.resultScore}>{percentage}%</Text>
                    <Text style={styles.resultText}>{score} out of {quizzes.length} correct</Text>
                    <Text style={styles.resultMsg}>{percentage >= 80 ? 'Excellent work!' : percentage >= 60 ? 'Good job, keep practicing!' : 'Keep studying, you\'ll get there!'}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={() => { setQuizzes([]); setCurrentQ(0); setScore(0); setSelected(null); setAnswered(false); setFinished(false); }}>
                        <Text style={styles.retryBtnText}>Try New Quiz</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (quizzes.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Quiz 🧮</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView contentContainerStyle={styles.setupContent}>
                    <Text style={styles.setupLabel}>Prepare your quiz:</Text>
                    <Input
                        placeholder="Paste notes for the quiz..."
                        value={note}
                        onChangeText={setNote}
                        multiline
                        numberOfLines={4}
                        style={styles.setupInput}
                    />

                    <Text style={styles.setupLabel}>Question Type:</Text>
                    <View style={styles.typeRow}>
                        <TouchableOpacity
                            style={[styles.typeBtn, quizType === 'mcq' && styles.typeBtnActive]}
                            onPress={() => setQuizType('mcq')}
                        >
                            <Ionicons name="list" size={20} color={quizType === 'mcq' ? '#fff' : Colors.textTertiary} />
                            <Text style={[styles.typeBtnText, quizType === 'mcq' && styles.typeBtnTextActive]}>Multiple Choice</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeBtn, quizType === 'tf' && styles.typeBtnActive]}
                            onPress={() => setQuizType('tf')}
                        >
                            <Ionicons name="checkmark-done" size={20} color={quizType === 'tf' ? '#fff' : Colors.textTertiary} />
                            <Text style={[styles.typeBtnText, quizType === 'tf' && styles.typeBtnTextActive]}>True / False</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.genBtn, !note.trim() && styles.disabledBtn]}
                        onPress={handleGenerate}
                        disabled={loading || !note.trim()}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.genBtnText}>Start Quiz</Text>}
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Quiz 🧮</Text>
                <Text style={styles.counter}>{currentQ + 1}/{quizzes.length}</Text>
            </View>

            {/* Progress */}
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${((currentQ + 1) / quizzes.length) * 100}%` }]} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.question}>{quiz.question}</Text>

                <View style={styles.options}>
                    {(quiz.options as string[]).map((opt: string, i: number) => {
                        let optStyle = styles.option;
                        let textColor = Colors.text;
                        if (answered) {
                            if (i === quiz.correctIndex) { optStyle = styles.optionCorrect; textColor = Colors.success; }
                            else if (i === selected) { optStyle = styles.optionWrong; textColor = Colors.error; }
                        } else if (i === selected) {
                            optStyle = styles.optionSelected;
                        }
                        return (
                            <TouchableOpacity key={i} style={optStyle} onPress={() => handleAnswer(i)} disabled={answered}>
                                <Text style={[styles.optLetter, { color: textColor }]}>{String.fromCharCode(65 + i)}</Text>
                                <Text style={[styles.optText, { color: textColor }]}>{opt}</Text>
                                {answered && i === quiz.correctIndex && <Ionicons name="checkmark-circle" size={22} color={Colors.success} />}
                                {answered && i === selected && i !== quiz.correctIndex && <Ionicons name="close-circle" size={22} color={Colors.error} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {answered && (
                    <View style={[styles.explanationCard, Shadow.sm]}>
                        <Text style={styles.explanationTitle}>💡 Explanation</Text>
                        <Text style={styles.explanationText}>{quiz.explanation}</Text>
                    </View>
                )}
            </ScrollView>

            {answered && (
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                        <Text style={styles.nextBtnText}>{currentQ < quizzes.length - 1 ? 'Next Question' : 'See Results'}</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
    title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
    counter: { fontSize: FontSize.md, color: Colors.primary, fontWeight: FontWeight.semibold },
    progressBar: { height: 4, backgroundColor: Colors.surfaceAlt, marginHorizontal: Spacing.xl, borderRadius: 2 },
    progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
    content: { padding: Spacing.xl, paddingBottom: Spacing.huge },
    question: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text, lineHeight: 30, marginTop: Spacing.xxl, marginBottom: Spacing.xxl },
    options: { gap: Spacing.md },
    option: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1.5, borderColor: Colors.border },
    optionSelected: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceAlt, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1.5, borderColor: Colors.primary },
    optionCorrect: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1.5, borderColor: Colors.success },
    optionWrong: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1.5, borderColor: Colors.error },
    optLetter: { fontSize: FontSize.md, fontWeight: FontWeight.bold, marginRight: Spacing.md, width: 24 },
    optText: { fontSize: FontSize.md, flex: 1 },
    explanationCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.xl, marginTop: Spacing.xxl },
    explanationTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.sm },
    explanationText: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 22 },
    footer: { padding: Spacing.xl },
    nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: BorderRadius.pill, paddingVertical: Spacing.lg },
    nextBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.bold },
    resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl },
    resultEmoji: { fontSize: 80, marginBottom: Spacing.lg },
    resultScore: { fontSize: 56, fontWeight: FontWeight.heavy, color: Colors.primary },
    resultText: { fontSize: FontSize.lg, color: Colors.textSecondary, marginTop: Spacing.sm },
    resultMsg: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: Spacing.sm, textAlign: 'center' },
    retryBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.pill, paddingVertical: Spacing.lg, paddingHorizontal: Spacing.huge, marginTop: Spacing.xxl },
    retryBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.bold },
    setupContent: { padding: Spacing.xl },
    setupLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textTertiary, textTransform: 'uppercase', marginBottom: Spacing.md, marginTop: Spacing.lg },
    setupInput: { height: 100 },
    typeRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
    typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
    typeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    typeBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
    typeBtnTextActive: { color: '#fff' },
    genBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.pill, paddingVertical: Spacing.lg, alignItems: 'center', marginTop: Spacing.md },
    disabledBtn: { opacity: 0.5 },
    genBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.bold },
    shareBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.lg },
    shareBtnText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
});
