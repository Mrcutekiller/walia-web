import { Avatar } from '@/components/ui/Avatar';
import { PostCard } from '@/components/ui/PostCard';
import { Input } from '@/components/ui/Input';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { useSocial } from '@/store/social';
import { useTheme } from '@/store/theme';
import { getUserById } from '@/store/data';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const { posts, likePost, addComment, deletePost, togglePostPrivacy } = useSocial();
    
    const post = posts.find(p => p.id === id);
    const [commentText, setCommentText] = useState('');

    if (!post) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ color: colors.text }}>Post not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: colors.primary }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleSendComment = () => {
        if (!commentText.trim() || !user) return;
        addComment(post.id, {
            userId: user.id,
            text: commentText.trim()
        });
        setCommentText('');
    };

    const handleOptions = () => {
        if (post.authorId !== user?.id) return;
        Alert.alert(
            'Post Options',
            'What would you like to do?',
            [
                { text: post.isPrivate ? 'Make Public' : 'Make Private', onPress: () => togglePostPrivacy(post.id) },
                { text: 'Delete Post', onPress: () => { deletePost(post.id); router.back(); }, style: 'destructive' },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const bg = isDark ? colors.background : '#F8FAFC';
    const cardBg = isDark ? colors.surface : '#FFFFFF';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
            <View style={[styles.header, { borderBottomColor: colors.divider }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Post</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                        <PostCard 
                            post={post} 
                            onLike={() => likePost(post.id)} 
                            onOptions={post.authorId === user?.id ? handleOptions : undefined}
                        />
                    </View>

                    <View style={styles.commentsSection}>
                        <Text style={[styles.commentsTitle, { color: colors.textSecondary }]}>
                            COMMENTS ({post.comments?.length || 0})
                        </Text>
                        
                        {post.comments?.map((comment) => {
                            const cUser = getUserById(comment.userId);
                            return (
                                <View key={comment.id} style={[styles.commentRow, { borderBottomColor: colors.divider }]}>
                                    <Avatar emoji={cUser?.photoURL || '👤'} size={32} />
                                    <View style={styles.commentContent}>
                                        <View style={styles.commentHeader}>
                                            <Text style={[styles.commentName, { color: colors.text }]}>{cUser?.name || 'User'}</Text>
                                            <Text style={[styles.commentTime, { color: colors.textTertiary }]}>{comment.timestamp}</Text>
                                        </View>
                                        <Text style={[styles.commentText, { color: colors.textSecondary }]}>{comment.text}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>

                <View style={[styles.inputContainer, { backgroundColor: cardBg, borderTopColor: colors.divider }]}>
                    <Input
                        placeholder="Write a comment..."
                        value={commentText}
                        onChangeText={setCommentText}
                        style={{ flex: 1 }}
                        containerStyle={{ flex: 1, backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderWidth: 0 }}
                    />
                    <TouchableOpacity 
                        style={[styles.sendBtn, { backgroundColor: commentText.trim() ? '#6366F1' : colors.surfaceAlt }]} 
                        onPress={handleSendComment}
                        disabled={!commentText.trim()}
                    >
                        <Ionicons name="send" size={18} color={commentText.trim() ? '#FFF' : colors.textTertiary} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderBottomWidth: 1 },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: FontSize.md, fontWeight: FontWeight.heavy },
    commentsSection: { paddingHorizontal: Spacing.xl, marginTop: Spacing.md },
    commentsTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: Spacing.lg },
    commentRow: { flexDirection: 'row', gap: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1 },
    commentContent: { flex: 1 },
    commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
    commentName: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    commentTime: { fontSize: 10, fontWeight: FontWeight.bold },
    commentText: { fontSize: FontSize.sm, lineHeight: 20 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderTopWidth: 1, gap: Spacing.md },
    sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
