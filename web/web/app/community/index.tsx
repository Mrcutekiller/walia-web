import { PostCard } from '@/components/ui/PostCard';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
<<<<<<< HEAD
import { useSocial } from '@/store/social';
=======
import { POSTS } from '@/store/data';
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CommunityScreen() {
    const router = useRouter();
<<<<<<< HEAD
    const { posts } = useSocial();
=======
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Community 🌐</Text>
                <TouchableOpacity onPress={() => router.push('/community/new-post')}>
                    <Ionicons name="add-circle-outline" size={26} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
<<<<<<< HEAD
                {posts.map(p => (
                    <PostCard key={p.id} post={p as any} onPress={() => router.push(`/community/post/${p.id}` as any)} />
=======
                {POSTS.map(p => (
                    <PostCard key={p.id} post={p} onPress={() => router.push(`/community/post/${p.id}` as any)} />
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
    title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
    content: { padding: Spacing.xl, paddingTop: 0 },
});
