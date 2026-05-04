/**
 * SocialStore — handles Walia Points, levels, follows, posts, likes, views, Pro plan
 * All data persisted in Firestore and available globally via useSocial()
 * 
 * ─── Walia Points System ─────────────────────────────────────────────────────
 * • Daily login:     +50 pts
 * • Post created:   +100 pts
 * • #walia hashtag: +200 pts (bonus)
 * • AI chat:         +10 pts per message
 * • Quiz correct:    +30 pts
 * • Tool used:       +20 pts
 * • Comment added:   +10 pts
 * ─────────────────────────────────────────────────────────────────────────────
 * Reach 10,000 Walia Points → Unlock Pro Plan FREE!
 */
import { auth, db } from '@/services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    limit as firestoreLimit,
    increment,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, View } from 'react-native';

// ─── Walia Points config ──────────────────────────────────────────────────────
ewaliaPointsort const WALIA_POINT_REWARDS = {
    daily_login: 50,
    post_created: 100,
    hashtag_walia: 200,  // bonus for using #walia in a post
    ai_chat: 10,          // per AI message
    quiz_correct: 30,
    tool_used: 20,
    comment_added: 10,
};
ewaliaPointsort const PRO_PLAN_POINTS_COST = 10000;  // 10k Walia Points → Pro
ewaliaPointsort const PRO_PLAN_ETB_COST = 1350;
ewaliaPointsort const POINTS_PER_LEVEL = 500;

// ─── Types ────────────────────────────────────────────────────────────────────
ewaliaPointsort interface SocialPost {
    id: string;
    authorId: string;
    type: 'quiz' | 'note' | 'ai_share' | 'general' | 'text';
    title?: string;
    content: string;
    image?: string;
    createdAt: any;
    likes: string[];
    commentCount: number;
    comments: Comment[];
    quizOptions?: string[];
    quizAnswer?: number;
    tags?: string[];
    isAdminPost?: boolean;
    isPrivate?: boolean;
}

ewaliaPointsort interface Comment {
    id: string;
    userId: string;
    text: string;
    timestamp: string;
}

ewaliaPointsort interface Story {
    id: string;
    uid: string;
    username: string;
    image: string;
    hasUnseen: boolean;
    createdAt: any;
}

ewaliaPointsort interface Note {
    id: string;
    uid: string;
    username: string;
    image: string;
    note: string;
    createdAt: any;
}

ewaliaPointsort interface Notification {
    id: string;
    userId: string;
    type: 'payment' | 'message' | 'system' | 'community';
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

ewaliaPointsort interface FollowRelation {
    followerId: string;
    followingId: string;
}

ewaliaPointsort interface SocialState {
    waliaPoints: number;
    isPro: boolean;
    followers: string[];
    following: string[];
    posts: SocialPost[];
    likedPostIds: string[];
    totalLikesReceived: number;
    totalViews: number;
    lastLoginDate: string;
    pointsHistory: { amount: number; reason: string; timestamp: string }[];
    dailyAiCount: number;
    dailyUploadCount: number;
    lastUpdateDate: string;
    studyHistory: StudyHistoryItem[];
    notifications: Notification[];
    stories: Story[];
    notes: Note[];
}

ewaliaPointsort interface StudyHistoryItem {
    id: string;
    tool: 'flashcard' | 'summarize' | 'quiz' | 'notes';
    title: string;
    content: any;
    timestamp: string;
}

interface SocialContextType extends SocialState {
    addPoints: (points: number, reason: string) => Promise<void>;
    level: number;
    pointsToNextLevel: number;
    pointsProgress: number;
    claimProPlan: () => void;
    followUser: (userId: string) => void;
    unfollowUser: (userId: string) => void;
    isFollowing: (userId: string) => boolean;
    addPost: (post: Omit<SocialPost, 'id' | 'authorId' | 'likes' | 'commentCount' | 'comments' | 'createdAt'>, imageUri?: string) => Promise<void>;
    deletePost: (postId: string) => void;
    togglePostPrivacy: (postId: string) => void;
    likePost: (postId: string) => void;
    addComment: (postId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
    recordView: () => void;
    checkDailyLogin: () => void;
    recordAiMessage: () => boolean;
    recordUpload: () => boolean;
    showPointsToast: (amount: number, reason: string) => void;
    togglePro: () => void;
    saveStudyHistory: (item: Omit<StudyHistoryItem, 'id' | 'timestamp'>) => Promise<void>;
    addNotification: (notif: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
    markNotificationRead: (id: string) => void;
    deleteNotification: (id: string) => void;
    addStory: (text: string) => void;
    addNote: (text: string) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);
const STORAGE_KEY = 'walia_social_v2';
const DEFAULT_POSTS: SocialPost[] = [];

// ─── Walia Points Toast ───────────────────────────────────────────────────────
let _showPointsToastGlobal = (_amount: number, _reason: string) => { };

ewaliaPointsort function PointsToastContainer() {
    const [toasts, setToasts] = useState<{ id: string; amount: number; reason: string; anim: Animated.Value }[]>([]);

    useEffect(() => {
        _showPointsToastGlobal = (amount: number, reason: string) => {
            const id = Date.now().toString();
            const anim = new Animated.Value(0);
            setToasts(prev => [...prev, { id, amount, reason, anim }]);
            Animated.sequence([
                Animated.spring(anim, { toValue: 1, tension: 70, friction: 6, useNativeDriver: true }),
                Animated.delay(2000),
                Animated.timing(anim, { toValue: 0, duration: 350, useNativeDriver: true }),
            ]).start(() => setToasts(prev => prev.filter(t => t.id !== id)));
        };
    }, []);

    return (
        <View style={waliaPointsStyles.container} pointerEvents="none">
            {toasts.map(t => (
                <Animated.View key={t.id} style={[waliaPointsStyles.toast, {
                    opacity: t.anim,
                    transform: [
                        { translateY: t.anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
                        { scale: t.anim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }
                    ],
                }]}>
                    <Text style={waliaPointsStyles.waliaW}>W</Text>
                    <Text style={waliaPointsStyles.plus}>+{t.amount}</Text>
                    <Text style={waliaPointsStyles.reason}>{t.reason}</Text>
                </Animated.View>
            ))}
        </View>
    );
}

const waliaPointsStyles = StyleSheet.create({
    container: { position: 'absolute', bottom: 130, right: 16, alignItems: 'flex-end', zIndex: 9999 },
    toast: {
        backgroundColor: '#000',
        borderRadius: 28,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    waliaW: { color: '#FFF', fontWeight: '900', fontSize: 13, opacity: 0.85 },
    plus: { color: '#FFF', fontWeight: '900', fontSize: 16 },
    reason: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600' },
});

// ─── Provider ─────────────────────────────────────────────────────────────────
ewaliaPointsort function SocialProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<SocialState>({
        waliaPoints: 0,
        isPro: false,
        followers: [],
        following: [],
        posts: DEFAULT_POSTS,
        likedPostIds: [],
        totalLikesReceived: 0,
        totalViews: 0,
        lastLoginDate: '',
        waliaPointsHistory: [],
        dailyAiCount: 0,
        dailyUploadCount: 0,
        lastUpdateDate: new Date().toISOString().slice(0, 10),
        studyHistory: [],
        notifications: [],
        stories: [],
        notes: [],
    });

    // ── Real-time Sync ──
    useEffect(() => {
        const fallbackTimer = setTimeout(() => {
            console.warn('SocialProvider Firestore sync timeout');
        }, 5000);

        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), firestoreLimit(50));
        const unsubscribePosts = onSnapshot(postsQuery, (snap: any) => {
            clearTimeout(fallbackTimer);
            const postsData = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as SocialPost[];
            setState(prev => ({ ...prev, posts: postsData }));
        }, (error) => {
            clearTimeout(fallbackTimer);
            console.warn('Posts sync error:', error);
        });

        let unsubscribeStats = () => { };
        if (auth.currentUser) {
            unsubscribeStats = onSnapshot(doc(db, 'users', auth.currentUser.uid), (snap: any) => {
                if (snap.exists()) {
                    const data = snap.data();
                    setState(prev => ({
                        ...prev,
                        waliaPoints: data.waliaPoints || 0,
                        isPro: data.isPro || false,
                        followers: data.followers || [],
                        following: data.following || [],
                        likedPostIds: data.likedPostIds || [],
                        totalLikesReceived: data.totalLikesReceived || 0,
                        totalViews: data.totalViews || 0,
                        dailyAiCount: data.dailyAiCount || 0,
                        dailyUploadCount: data.dailyUploadCount || 0,
                        studyHistory: data.studyHistory || [],
                    }));
                }
            });
        }

        const storiesQuery = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
        const unsubscribeStories = onSnapshot(storiesQuery, (snap: any) => {
            setState(prev => ({ ...prev, stories: snap.docs.map((d: any) => ({ id: d.id, ...d.data() })) }));
        });

        const notesQuery = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
        const unsubscribeNotes = onSnapshot(notesQuery, (snap: any) => {
            setState(prev => ({ ...prev, notes: snap.docs.map((d: any) => ({ id: d.id, ...d.data() })) }));
        });

        return () => {
            clearTimeout(fallbackTimer);
            unsubscribePosts();
            unsubscribeStats();
            unsubscribeStories();
            unsubscribeNotes();
        };
    }, [auth.currentUser]);

    const updateState = useCallback((updater: (prev: SocialState) => SocialState) => {
        setState(prev => {
            const next = updater(prev);
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => { });
            return next;
        });
    }, []);

    // ── Walia Points (waliaPoints) ──
    const showwaliaPointsToast = useCallback((amount: number, reason: string) => {
        _showwaliaPointsToastGlobal(amount, reason);
    }, []);

    const addwaliaPoints = useCallback(async (amount: number, reason: string) => {
        if (!auth.currentUser) return;
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
            waliaPoints: increment(amount),
            waliaPointsHistory: arrayUnion({ amount, reason, timestamp: new Date().toISOString() })
        });
        showwaliaPointsToast(amount, reason);

        // Auto-unlock Pro at 10k points
        setState(prev => {
            if (!prev.isPro && (prev.waliaPoints + amount) >= PRO_PLAN_waliaPoints_COST) {
                // Notify but don't auto-set — let claimProPlan handle it
            }
            return prev;
        });
    }, [showwaliaPointsToast]);

    const claimProPlan = useCallback(() => {
        setState(prev => {
            if (prev.isPro) {
                Alert.alert('✅ Already Pro!', 'You are already on the Pro plan.');
                return prev;
            }
            if (prev.waliaPoints < PRO_PLAN_waliaPoints_COST) {
                Alert.alert(
                    '⭐ Walia Points needed',
                    `You need ${PRO_PLAN_waliaPoints_COST.toLocaleString()} Walia Points.\nYou have ${prev.waliaPoints.toLocaleString()} pts.\n\nKeep chatting with AI, posting, and using tools!`
                );
                return prev;
            }
            if (auth.currentUser) {
                updateDoc(doc(db, 'users', auth.currentUser.uid), {
                    isPro: true,
                    waliaPoints: increment(-PRO_PLAN_waliaPoints_COST)
                }).catch(() => { });
            }
            Alert.alert(
                '🎉 Welcome to Walia Pro!',
                'You unlocked Pro with 10,000 Walia Points!\n\nEnjoy unlimited AI chats, advanced tools and priority support.'
            );
            return { ...prev, waliaPoints: prev.waliaPoints - PRO_PLAN_waliaPoints_COST, isPro: true };
        });
    }, []);

    // ── Daily login ──
    const checkDailyLogin = useCallback(() => {
        const today = new Date().toISOString().slice(0, 10);
        setState(prev => {
            if (prev.lastLoginDate === today) return prev;
            const next = {
                ...prev,
                lastLoginDate: today,
                waliaPoints: prev.waliaPoints + waliaPoints_REWARDS.daily_login,
                waliaPointsHistory: [
                    { amount: waliaPoints_REWARDS.daily_login, reason: 'Daily login 🌟', timestamp: new Date().toISOString() },
                    ...prev.waliaPointsHistory.slice(0, 49)
                ],
            };
            setTimeout(() => showwaliaPointsToast(waliaPoints_REWARDS.daily_login, 'Daily login 🌟'), 2000);
            return next;
        });
    }, [showwaliaPointsToast]);

    // ── Follow ──
    const followUser = useCallback(async (userId: string) => {
        if (!auth.currentUser) return;
        const isCurrentlyFollowing = state.following.includes(userId);
        if (isCurrentlyFollowing) return;

        try {
            // Update local user's following
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                following: arrayUnion(userId)
            });
            // Update target user's followers
            await updateDoc(doc(db, 'users', userId), {
                followers: arrayUnion(auth.currentUser.uid)
            });
            // Add Notification
            await addDoc(collection(db, 'notifications'), {
                userId: userId,
                type: 'community',
                title: 'New Follower',
                message: `${auth.currentUser.displayName || 'Someone'} started following you.`,
                read: false,
                createdAt: serverTimestamp()
            });
        } catch (e) {
            console.error('Failed to follow', e);
        }
    }, [state.following]);

    const unfollowUser = useCallback(async (userId: string) => {
        if (!auth.currentUser) return;
        try {
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                following: arrayRemove(userId)
            });
            await updateDoc(doc(db, 'users', userId), {
                followers: arrayRemove(auth.currentUser.uid)
            });
        } catch (e) {
            console.error('Failed to unfollow', e);
        }
    }, []);

    const isFollowing = useCallback((userId: string) => state.following.includes(userId), [state.following]);

    // ── Posts ──
    const addPost = useCallback(async (post: Omit<SocialPost, 'id' | 'authorId' | 'likes' | 'commentCount' | 'comments' | 'createdAt'>, imageUri?: string) => {
        if (!auth.currentUser) return;
        
        let imageUrl = post.image;
        if (imageUri) {
            try {
                imageUrl = await uploadFile(imageUri, 'posts');
            } catch (e) {
                console.error('Failed to upload post image', e);
            }
        }

        const newPostData = {
            ...post,
            image: imageUrl,
            authorId: auth.currentUser.uid,
            likes: [],
            commentCount: 0,
            comments: [],
            createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, 'posts'), newPostData);

        // Local base points for posting
        addwaliaPoints(waliaPoints_REWARDS.post_created, 'Post created 📝');

        // Add local notification
        const newNotif: Notification = {
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            userId: auth.currentUser.uid,
            type: 'community',
            title: 'New Post Published',
            message: 'Your post was successfully added to the community feed!',
            read: false,
            createdAt: new Date().toISOString(),
        };

        updateState(prev => ({
            ...prev,
            notifications: [newNotif, ...(prev.notifications || [])]
        }));

        // Bonus points for #walia hashtag
        const hasWaliaTag = post.content.toLowerCase().includes('#walia') ||
            (post.tags || []).some(t => t.toLowerCase() === '#walia');
        if (hasWaliaTag) {
            setTimeout(() => addwaliaPoints(waliaPoints_REWARDS.hashtag_walia, '#walia bonus 🌟'), 800);
        }

        // Reward tokens
        try {
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                tokensUsed: increment(-10)
            });
        } catch (e) {
            console.error('Failed to reward tokens', e);
        }
    }, [addwaliaPoints]);

    const likePost = useCallback(async (postId: string) => {
        if (!auth.currentUser) return;
        const post = state.posts.find(p => p.id === postId);
        if (!post) return;
        
        const alreadyLiked = post.likes.includes(auth.currentUser.uid);
        const ref = doc(db, 'posts', postId);
        
        try {
            await updateDoc(ref, {
                likes: alreadyLiked ? arrayRemove(auth.currentUser.uid) : arrayUnion(auth.currentUser.uid)
            });

            if (!alreadyLiked && post.authorId !== auth.currentUser.uid) {
                await addDoc(collection(db, 'notifications'), {
                    userId: post.authorId,
                    type: 'community',
                    title: 'New Like',
                    message: `${auth.currentUser.displayName || 'Someone'} liked your post.`,
                    read: false,
                    createdAt: serverTimestamp()
                });
            }
        } catch (e) {
            console.error('Failed to like post', e);
        }
    }, [state.posts]);

    const deletePost = useCallback(async (postId: string) => {
        try {
            await deleteDoc(doc(db, 'posts', postId));
        } catch (e) {
            console.error('Failed to delete post', e);
        }
    }, []);

    const togglePostPrivacy = useCallback(async (postId: string) => {
        const post = state.posts.find(p => p.id === postId);
        if (!post) return;
        try {
            await updateDoc(doc(db, 'posts', postId), {
                isPrivate: !post.isPrivate
            });
        } catch (e) {
            console.error('Failed to toggle privacy', e);
        }
    }, [state.posts]);

    const addComment = useCallback(async (postId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
        if (!auth.currentUser) return;
        const newComment: Comment = { ...comment, id: Date.now().toString(), timestamp: new Date().toISOString() };
        try {
            await updateDoc(doc(db, 'posts', postId), {
                comments: arrayUnion(newComment),
                commentCount: increment(1)
            });
            const post = state.posts.find(p => p.id === postId);
            if (post && post.authorId !== auth.currentUser.uid) {
                await addDoc(collection(db, 'notifications'), {
                    userId: post.authorId,
                    type: 'community',
                    title: 'New Comment',
                    message: `${auth.currentUser.displayName || 'Someone'} commented on your post.`,
                    read: false,
                    createdAt: serverTimestamp()
                });
            }
            addwaliaPoints(waliaPoints_REWARDS.comment_added, 'Comment added 💬');
        } catch (e) {
            console.error('Failed to add comment', e);
        }
    }, [addwaliaPoints, state.posts]);

    // ── Limits ──
    const resetDailyIfNewDay = useCallback((s: SocialState) => {
        const today = new Date().toISOString().slice(0, 10);
        if (s.lastUpdateDate !== today) {
            return { ...s, dailyAiCount: 0, dailyUploadCount: 0, lastUpdateDate: today };
        }
        return s;
    }, []);

    // Free plan: 20 AI messages/day. Pro: unlimited.
    const recordAiMessage = useCallback(() => {
        let allowed = true;
        updateState(prev => {
            const next = resetDailyIfNewDay(prev);
            if (!next.isPro && next.dailyAiCount >= 20) {
                allowed = false;
                return next;
            }
            return { ...next, dailyAiCount: next.dailyAiCount + 1 };
        });
        // Award Walia Points for every AI message
        if (allowed) {
            addwaliaPoints(waliaPoints_REWARDS.ai_chat, 'AI chat 🤖');
        }
        return allowed;
    }, [updateState, resetDailyIfNewDay, addwaliaPoints]);

    const recordUpload = useCallback(() => {
        let allowed = true;
        updateState(prev => {
            const next = resetDailyIfNewDay(prev);
            if (!next.isPro && next.dailyUploadCount >= 5) {
                allowed = false;
                return next;
            }
            return { ...next, dailyUploadCount: next.dailyUploadCount + 1 };
        });
        return allowed;
    }, [updateState, resetDailyIfNewDay]);

    const togglePro = useCallback(() => {
        updateState(prev => ({ ...prev, isPro: !prev.isPro }));
    }, [updateState]);

    const saveStudyHistory = useCallback(async (item: Omit<StudyHistoryItem, 'id' | 'timestamp'>) => {
        if (!auth.currentUser) return;
        const newItem: StudyHistoryItem = {
            ...item,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
        };
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
            studyHistory: arrayUnion(newItem),
            waliaPoints: increment(waliaPoints_REWARDS.tool_used)
        });
        showwaliaPointsToast(waliaPoints_REWARDS.tool_used, `${item.tool.charAt(0).toUpperCase() + item.tool.slice(1)} completed 🎓`);
    }, [showwaliaPointsToast]);

    const recordView = useCallback(() => {
        updateState(prev => ({ ...prev, totalViews: prev.totalViews + 1 }));
    }, [updateState]);

    const addNotification = useCallback(async (notif: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
        if (!auth.currentUser) return;
        await addDoc(collection(db, 'notifications'), {
            ...notif,
            userId: auth.currentUser.uid,
            read: false,
            createdAt: serverTimestamp()
        });
    }, []);

    const uploadFile = async (uri: string, path: string) => {
        const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `${path}/${Date.now()}`);
        await uploadBytes(storageRef, blob);
        return await getDownloadURL(storageRef);
    };

    const addStory = useCallback(async (uri: string) => {
        if (!auth.currentUser) return;
        try {
            const url = await uploadFile(uri, 'stories');
            await addDoc(collection(db, 'stories'), {
                uid: auth.currentUser.uid,
                username: auth.currentUser.displayName || 'User',
                image: url,
                hasUnseen: true,
                createdAt: serverTimestamp()
            });
            addwaliaPoints(waliaPoints_REWARDS.post_created, 'Story posted 📸');
        } catch (e) {
            console.error('Failed to add story', e);
        }
    }, [addwaliaPoints]);

    const addNote = useCallback(async (text: string) => {
        if (!auth.currentUser) return;
        await addDoc(collection(db, 'notes'), {
            uid: auth.currentUser.uid,
            username: auth.currentUser.displayName || 'User',
            image: (auth.currentUser.displayName || 'U').charAt(0).toUpperCase(),
            note: text.slice(0, 60),
            createdAt: serverTimestamp()
        });
        addwaliaPoints(waliaPoints_REWARDS.comment_added, 'Note updated 💭');
    }, [addwaliaPoints]);

    const markNotificationRead = useCallback((id: string) => {
        updateState(prev => ({
            ...prev,
            notifications: (prev.notifications || []).map(n => n.id === id ? { ...n, read: true } : n)
        }));
    }, [updateState]);

    const deleteNotification = useCallback((id: string) => {
        updateState(prev => ({
            ...prev,
            notifications: (prev.notifications || []).filter(n => n.id !== id)
        }));
    }, [updateState]);

    // ── Derived stats ──
    const level = Math.floor(state.waliaPoints / waliaPoints_PER_LEVEL) + 1;
    const waliaPointsInCurrentLevel = state.waliaPoints % waliaPoints_PER_LEVEL;
    const waliaPointsProgress = waliaPointsInCurrentLevel / waliaPoints_PER_LEVEL;
    const waliaPointsToNextLevel = waliaPoints_PER_LEVEL - waliaPointsInCurrentLevel;

    return (
        <SocialContext.Provider value={{
            ...state,
            addwaliaPoints, level, waliaPointsToNextLevel, waliaPointsProgress,
            claimProPlan, followUser, unfollowUser, isFollowing,
            addPost, deletePost, togglePostPrivacy, likePost, addComment, recordView,
            checkDailyLogin, showwaliaPointsToast,
            recordAiMessage, recordUpload, togglePro,
            saveStudyHistory, addNotification, markNotificationRead, deleteNotification,
            addStory,
            addNote
        }}>
            {children}
        </SocialContext.Provider>
    );
}

ewaliaPointsort function useSocial() {
    const ctx = useContext(SocialContext);
    if (!ctx) throw new Error('useSocial must be used within SocialProvider');
    return ctx;
}
