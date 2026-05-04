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
export const XP_REWARDS = {
    daily_login: 50,
    post_created: 100,
    hashtag_walia: 200,  // bonus for using #walia in a post
    ai_chat: 10,          // per AI message
    quiz_correct: 30,
    tool_used: 20,
    comment_added: 10,
};
export const PRO_PLAN_XP_COST = 10000;  // 10k Walia Points → Pro
export const PRO_PLAN_ETB_COST = 1350;
export const XP_PER_LEVEL = 500;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SocialPost {
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

export interface Comment {
    id: string;
    userId: string;
    text: string;
    timestamp: string;
}

export interface Story {
    id: string;
    uid: string;
    username: string;
    image: string;
    hasUnseen: boolean;
    createdAt: any;
}

export interface Note {
    id: string;
    uid: string;
    username: string;
    image: string;
    note: string;
    createdAt: any;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'payment' | 'message' | 'system' | 'community';
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export interface FollowRelation {
    followerId: string;
    followingId: string;
}

export interface SocialState {
    xp: number;               // Walia Points
    isPro: boolean;
    followers: string[];
    following: string[];
    posts: SocialPost[];
    likedPostIds: string[];
    totalLikesReceived: number;
    totalViews: number;
    lastLoginDate: string;
    xpHistory: { amount: number; reason: string; timestamp: string }[];
    dailyAiCount: number;
    dailyUploadCount: number;
    lastUpdateDate: string;
    studyHistory: StudyHistoryItem[];
    notifications: Notification[];
    stories: Story[];
    notes: Note[];
}

export interface StudyHistoryItem {
    id: string;
    tool: 'flashcard' | 'summarize' | 'quiz' | 'notes';
    title: string;
    content: any;
    timestamp: string;
}

interface SocialContextType extends SocialState {
    addXP: (amount: number, reason: string) => void;
    level: number;
    xpToNextLevel: number;
    xpProgress: number;
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
    showXpToast: (amount: number, reason: string) => void;
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
let _showXpToastGlobal = (_amount: number, _reason: string) => { };

export function XpToastContainer() {
    const [toasts, setToasts] = useState<{ id: string; amount: number; reason: string; anim: Animated.Value }[]>([]);

    useEffect(() => {
        _showXpToastGlobal = (amount: number, reason: string) => {
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
        <View style={xpStyles.container} pointerEvents="none">
            {toasts.map(t => (
                <Animated.View key={t.id} style={[xpStyles.toast, {
                    opacity: t.anim,
                    transform: [
                        { translateY: t.anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
                        { scale: t.anim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }
                    ],
                }]}>
                    <Text style={xpStyles.waliaW}>W</Text>
                    <Text style={xpStyles.plus}>+{t.amount}</Text>
                    <Text style={xpStyles.reason}>{t.reason}</Text>
                </Animated.View>
            ))}
        </View>
    );
}

const xpStyles = StyleSheet.create({
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
export function SocialProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<SocialState>({
        xp: 0,
        isPro: false,
        followers: [],
        following: [],
        posts: DEFAULT_POSTS,
        likedPostIds: [],
        totalLikesReceived: 0,
        totalViews: 0,
        lastLoginDate: '',
        xpHistory: [],
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
                        xp: data.xp || 0,
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

    // ── Walia Points (XP) ──
    const showXpToast = useCallback((amount: number, reason: string) => {
        _showXpToastGlobal(amount, reason);
    }, []);

    const addXP = useCallback(async (amount: number, reason: string) => {
        if (!auth.currentUser) return;
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
            xp: increment(amount),
            xpHistory: arrayUnion({ amount, reason, timestamp: new Date().toISOString() })
        });
        showXpToast(amount, reason);

        // Auto-unlock Pro at 10k points
        setState(prev => {
            if (!prev.isPro && (prev.xp + amount) >= PRO_PLAN_XP_COST) {
                // Notify but don't auto-set — let claimProPlan handle it
            }
            return prev;
        });
    }, [showXpToast]);

    const claimProPlan = useCallback(() => {
        setState(prev => {
            if (prev.isPro) {
                Alert.alert('✅ Already Pro!', 'You are already on the Pro plan.');
                return prev;
            }
            if (prev.xp < PRO_PLAN_XP_COST) {
                Alert.alert(
                    '⭐ Walia Points needed',
                    `You need ${PRO_PLAN_XP_COST.toLocaleString()} Walia Points.\nYou have ${prev.xp.toLocaleString()} pts.\n\nKeep chatting with AI, posting, and using tools!`
                );
                return prev;
            }
            if (auth.currentUser) {
                updateDoc(doc(db, 'users', auth.currentUser.uid), {
                    isPro: true,
                    xp: increment(-PRO_PLAN_XP_COST)
                }).catch(() => { });
            }
            Alert.alert(
                '🎉 Welcome to Walia Pro!',
                'You unlocked Pro with 10,000 Walia Points!\n\nEnjoy unlimited AI chats, advanced tools and priority support.'
            );
            return { ...prev, xp: prev.xp - PRO_PLAN_XP_COST, isPro: true };
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
                xp: prev.xp + XP_REWARDS.daily_login,
                xpHistory: [
                    { amount: XP_REWARDS.daily_login, reason: 'Daily login 🌟', timestamp: new Date().toISOString() },
                    ...prev.xpHistory.slice(0, 49)
                ],
            };
            setTimeout(() => showXpToast(XP_REWARDS.daily_login, 'Daily login 🌟'), 2000);
            return next;
        });
    }, [showXpToast]);

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
        addXP(XP_REWARDS.post_created, 'Post created 📝');

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
            setTimeout(() => addXP(XP_REWARDS.hashtag_walia, '#walia bonus 🌟'), 800);
        }

        // Reward tokens
        try {
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                tokensUsed: increment(-10)
            });
        } catch (e) {
            console.error('Failed to reward tokens', e);
        }
    }, [addXP]);

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
            addXP(XP_REWARDS.comment_added, 'Comment added 💬');
        } catch (e) {
            console.error('Failed to add comment', e);
        }
    }, [addXP, state.posts]);

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
            addXP(XP_REWARDS.ai_chat, 'AI chat 🤖');
        }
        return allowed;
    }, [updateState, resetDailyIfNewDay, addXP]);

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
            xp: increment(XP_REWARDS.tool_used)
        });
        showXpToast(XP_REWARDS.tool_used, `${item.tool.charAt(0).toUpperCase() + item.tool.slice(1)} completed 🎓`);
    }, [showXpToast]);

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
            addXP(XP_REWARDS.post_created, 'Story posted 📸');
        } catch (e) {
            console.error('Failed to add story', e);
        }
    }, [addXP]);

    const addNote = useCallback(async (text: string) => {
        if (!auth.currentUser) return;
        await addDoc(collection(db, 'notes'), {
            uid: auth.currentUser.uid,
            username: auth.currentUser.displayName || 'User',
            image: (auth.currentUser.displayName || 'U').charAt(0).toUpperCase(),
            note: text.slice(0, 60),
            createdAt: serverTimestamp()
        });
        addXP(XP_REWARDS.comment_added, 'Note updated 💭');
    }, [addXP]);

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
    const level = Math.floor(state.xp / XP_PER_LEVEL) + 1;
    const xpInCurrentLevel = state.xp % XP_PER_LEVEL;
    const xpProgress = xpInCurrentLevel / XP_PER_LEVEL;
    const xpToNextLevel = XP_PER_LEVEL - xpInCurrentLevel;

    return (
        <SocialContext.Provider value={{
            ...state,
            addXP, level, xpToNextLevel, xpProgress,
            claimProPlan, followUser, unfollowUser, isFollowing,
            addPost, deletePost, togglePostPrivacy, likePost, addComment, recordView,
            checkDailyLogin, showXpToast,
            recordAiMessage, recordUpload, togglePro,
            saveStudyHistory, addNotification, markNotificationRead, deleteNotification,
            addStory,
            addNote
        }}>
            {children}
        </SocialContext.Provider>
    );
}

export function useSocial() {
    const ctx = useContext(SocialContext);
    if (!ctx) throw new Error('useSocial must be used within SocialProvider');
    return ctx;
}
