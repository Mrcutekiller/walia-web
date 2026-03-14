import { BorderRadius, Colors, FontSize, FontWeight, Shadow, Spacing } from '@/constants/theme';
import { NOTES, Note } from '@/store/data';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NOTE_COLORS = ['#FFE8A3', '#FFB3B3', '#B3E5FC', '#C8E6C9', '#E1BEE7', '#FFCCBC'];

export default function NotesScreen() {
    const router = useRouter();
    const [notes, setNotes] = useState<Note[]>(NOTES);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);

    const createNote = () => {
        setEditingNote(null);
        setTitle('');
        setContent('');
        setSelectedColor(NOTE_COLORS[0]);
        setEditingNote({ id: '', title: '', content: '', color: NOTE_COLORS[0], category: 'General', timestamp: 'Just now' });
    };

    const saveNote = () => {
        if (!title.trim() && !content.trim()) return;
        const newNote: Note = {
            id: editingNote?.id || Date.now().toString(),
            title: title || 'Untitled',
            content,
            color: selectedColor,
            category: 'General',
            timestamp: 'Just now',
        };
        if (editingNote?.id) {
            setNotes(notes.map(n => n.id === editingNote.id ? newNote : n));
        } else {
            setNotes([newNote, ...notes]);
        }
        setEditingNote(null);
    };

    if (editingNote !== null) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setEditingNote(null)}>
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>{editingNote.id ? 'Edit Note' : 'New Note'}</Text>
                    <TouchableOpacity onPress={saveNote}>
                        <Ionicons name="checkmark" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.editContent}>
                    <View style={[styles.notePreview, { backgroundColor: selectedColor }]}>
                        <TextInput style={styles.noteTitleInput} placeholder="Add title..." placeholderTextColor="rgba(0,0,0,0.3)" value={title} onChangeText={setTitle} />
                        <TextInput style={styles.noteContentInput} placeholder="Add text to this note" placeholderTextColor="rgba(0,0,0,0.3)" value={content} onChangeText={setContent} multiline textAlignVertical="top" />
                    </View>

                    <Text style={styles.colorLabel}>Note color</Text>
                    <View style={styles.colorRow}>
                        {NOTE_COLORS.map(c => (
                            <TouchableOpacity key={c} style={[styles.colorDot, { backgroundColor: c }, selectedColor === c && styles.colorDotActive]} onPress={() => setSelectedColor(c)} />
                        ))}
                    </View>

                    <View style={styles.actionsRow}>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Ionicons name="link-outline" size={20} color={Colors.text} />
                            <Text style={styles.actionLabel}>Copy link</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Ionicons name="share-outline" size={20} color={Colors.text} />
                            <Text style={styles.actionLabel}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Ionicons name="pencil-outline" size={20} color={Colors.text} />
                            <Text style={styles.actionLabel}>Draw</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Ionicons name="save-outline" size={20} color={Colors.text} />
                            <Text style={styles.actionLabel}>Save</Text>
                        </TouchableOpacity>
                    </View>
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
                <Text style={styles.title}>Notes 📝</Text>
                <TouchableOpacity onPress={createNote}>
                    <Ionicons name="add-circle-outline" size={26} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.notesGrid}>
                {notes.map(n => (
                    <TouchableOpacity key={n.id} style={[styles.noteCard, Shadow.sm, { backgroundColor: n.color }]} onPress={() => { setEditingNote(n); setTitle(n.title); setContent(n.content); setSelectedColor(n.color); }}>
                        <Text style={styles.noteTitle}>{n.title}</Text>
                        <Text style={styles.noteContent} numberOfLines={4}>{n.content}</Text>
                        <View style={styles.noteFooter}>
                            <Text style={styles.noteCategory}>{n.category}</Text>
                            <Text style={styles.noteTime}>{n.timestamp}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
    title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
    notesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.xl, gap: Spacing.md, paddingBottom: Spacing.huge },
    noteCard: { width: '47%', borderRadius: BorderRadius.xl, padding: Spacing.lg },
    noteTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: 'rgba(0,0,0,0.8)', marginBottom: Spacing.sm },
    noteContent: { fontSize: FontSize.sm, color: 'rgba(0,0,0,0.6)', lineHeight: 20, marginBottom: Spacing.md },
    noteFooter: { flexDirection: 'row', justifyContent: 'space-between' },
    noteCategory: { fontSize: FontSize.xs, color: 'rgba(0,0,0,0.5)', fontWeight: FontWeight.medium },
    noteTime: { fontSize: FontSize.xs, color: 'rgba(0,0,0,0.4)' },
    editContent: { padding: Spacing.xl },
    notePreview: { borderRadius: BorderRadius.xl, padding: Spacing.xl, minHeight: 200, marginBottom: Spacing.xxl },
    noteTitleInput: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: 'rgba(0,0,0,0.8)', marginBottom: Spacing.md },
    noteContentInput: { fontSize: FontSize.md, color: 'rgba(0,0,0,0.7)', lineHeight: 22, minHeight: 120 },
    colorLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: Spacing.md },
    colorRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xxl },
    colorDot: { width: 36, height: 36, borderRadius: 18 },
    colorDotActive: { borderWidth: 3, borderColor: Colors.text },
    actionsRow: { flexDirection: 'row', justifyContent: 'space-around' },
    actionBtn: { alignItems: 'center', gap: Spacing.xs },
    actionLabel: { fontSize: FontSize.xs, color: Colors.textSecondary },
});
