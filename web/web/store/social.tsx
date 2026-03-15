/**
 * SocialStore — handles XP, levels, follows, posts, likes, views, Pro plan
 * All data persisted in AsyncStorage and available globally via useSocial()
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
<<<<<<< HEAD
    serverTimestamp,
=======
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
    updateDoc
} from 'firebase/firestore';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, View } from 'react-native';

// ─── XP config ────────────────────────────────────────────────────────────────
export const XP_REWARDS = {
    daily_login: 50,
    post_created: 100,
    quiz_correct: 30,
    tool_used: 20,
    comment_added: 10,
};
export const PRO_PLAN_XP_COST = 10000;
export const PRO_PLAN_ETB_COST = 1000;
export const XP_PER_LEVEL = 500;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SocialPost {
    id: string;
<<<<<<< HEAD
    authorId: string;
    type: 'quiz' | 'note' | 'ai_share' | 'general' | 'text';
    title?: string;
    content: string;
    createdAt: any;
    likes: string[]; // array of user IDs
    commentCount: number;
    comments: Comment[]; // kept for local usage
=======
    userId: string;
    type: 'quiz' | 'note' | 'ai_share' | 'text';
    title?: string;
    content: string;
    timestamp: string;
    likes: number;
    liked: boolean;
    shares: number;
    comments: Comment[];
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
    quizOptions?: string[];
    quizAnswer?: number;
}

export interface Comment {
    id: string;
    userId: string;
    text: string;
    timestamp: string;
}

export interface FollowRelation {
    followerId: string;
    followingId: string;
}

export interface SocialState {
    xp: number;
    isPro: boolean;
    followers: string[]; // user IDs
    following: string[]; // user IDs
    posts: SocialPost[];
    likedPostIds: string[];
    totalLikesReceived: number;
    totalViews: number;
    lastLoginDate: string;
    xpHistory: { amount: number; reason: string; timestamp: string }[];
    dailyAiCount: number;
    dailyUploadCount: number;
    lastUpdateDate: string; // for resetting daily counts
    studyHistory: StudyHistoryItem[];
}

export interface StudyHistoryItem {
    id: string;
    tool: 'flashcard' | 'summarize' | 'quiz' | 'notes';
    title: string;
    content: any; // tool specific result
    timestamp: string;
}

interface SocialContextType extends SocialState {
    // XP
    addXP: (amount: number, reason: string) => void;
    level: number;
    xpToNextLevel: number;
    xpProgress: number; // 0-1
    claimProPlan: () => void;
    // Follow
    followUser: (userId: string) => void;
    unfollowUser: (userId: string) => void;
    isFollowing: (userId: string) => boolean;
    // Posts
    addPost: (post: Omit<SocialPost, 'id' | 'likes' | 'liked' | 'shares' | 'comments' | 'timestamp'>) => void;
    likePost: (postId: string) => void;
    addComment: (postId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
    // Stats
    recordView: () => void;
    checkDailyLogin: () => void;
    recordAiMessage: () => boolean; // returns false if limit hit
    recordUpload: () => boolean; // returns false if limit hit
    // XP toast
    showXpToast: (amount: number, reason: string) => void;
    togglePro: () => void; // for testing
    saveStudyHistory: (item: Omit<StudyHistoryItem, 'id' | 'timestamp'>) => Promise<void>;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

const STORAGE_KEY = 'walia_social_v1';

const DEFAULT_POSTS: SocialPost[] = [];


// ─── XP Toast component ───────────────────────────────────────────────────────
let _showXpToastGlobal = (_amount: number, _reason: string) => { };

export function XpToastContainer() {
    const [toasts, setToasts] = useState<{ id: string; amount: number; reason: string; anim: Animated.Value }[]>([]);

    useEffect(() => {
        _showXpToastGlobal = (amount: number, reason: string) => {
            const id = Date.now().toString();
            const anim = new Animated.Value(0);
            setToasts(prev => [...prev, { id, amount, reason, anim }]);
            Animated.sequence([
                Animated.spring(anim, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true }),
                Animated.delay(1500),
                Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true }),
            ]).start(() => setToasts(prev => prev.filter(t => t.id !== id)));
        };
    }, []);

    return (
        <View style={xpStyles.container} pointerEvents="none">
            {toasts.map(t => (
                <Animated.View key={t.id} style={[xpStyles.toast, {
                    opacity: t.anim,
                    transform: [{ translateY: t.anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }, { scale: t.anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
                }]}>
                    <Text style={xpStyles.plus}>+{t.amount} XP</Text>
                    <Text style={xpStyles.reason}>{t.reason}</Text>
                </Animated.View>
            ))}
        </View>
    );
}

const xpStyles = StyleSheet.create({
    container: { position: 'absolute', bottom: 120, right: 16, alignItems: 'flex-end', zIndex: 9999 },
    toast: { backgroundColor: '#6C63FF', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, marginTop: 8, shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8, flexDirection: 'row', gap: 8, alignItems: 'center' },
    plus: { color: '#fff', fontWeight: '800', fontSize: 14 },
    reason: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
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
    });
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Real-time Sync ──
    useEffect(() => {
        // 1. Sync Posts
<<<<<<< HEAD
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), firestoreLimit(50));
=======
        const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), firestoreLimit(50));
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
        const unsubscribePosts = onSnapshot(postsQuery, (snap: any) => {
            const postsData = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as SocialPost[];
            // For authenticated users, we only show real posts. For guests, we show DEFAULT_POSTS if empty.
            setState(prev => ({
                ...prev,
                posts: postsData
            }));
        });

        // 2. Sync User Stats
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

        return () => {
            unsubscribePosts();
            unsubscribeStats();
        };
    }, [auth.currentUser]);

    const updateState = useCallback((updater: (prev: SocialState) => SocialState) => {
        setState(prev => {
            const next = updater(prev);
            // We no longer rely solely on AsyncStorage for core stats, but we can keep it as a backup
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => { });
            return next;
        });
    }, []);

    // ── XP ──
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
    }, [showXpToast]);

    const claimProPlan = useCallback(() => {
        setState(prev => {
            if (prev.isPro) { Alert.alert('✅ Already Pro!', 'You are already on the Pro plan.'); return prev; }
            if (prev.xp < PRO_PLAN_XP_COST) {
                Alert.alert('Not enough XP', `You need ${PRO_PLAN_XP_COST.toLocaleString()} XP.\nYou have ${prev.xp.toLocaleString()} XP.\n\nKeep posting, answering quizzes, and using tools!`);
                return prev;
            }
            Alert.alert('🎉 Welcome to Walia Pro!', 'You unlocked Pro with 10,000 XP!\n\nEnjoy unlimited AI chats, advanced tools and priority support.');
            const next = { ...prev, xp: prev.xp - PRO_PLAN_XP_COST, isPro: true };
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
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
                xpHistory: [{ amount: XP_REWARDS.daily_login, reason: 'Daily login 🌟', timestamp: new Date().toISOString() }, ...prev.xpHistory.slice(0, 49)],
            };
            setTimeout(() => showXpToast(XP_REWARDS.daily_login, 'Daily login 🌟'), 2000);
            return next;
        });
    }, [showXpToast]);

    // ── Follow ──
    const followUser = useCallback((userId: string) => {
        updateState(prev => ({
            ...prev,
            following: prev.following.includes(userId) ? prev.following : [...prev.following, userId],
        }));
    }, [updateState]);

    const unfollowUser = useCallback((userId: string) => {
        updateState(prev => ({
            ...prev,
            following: prev.following.filter(id => id !== userId),
        }));
    }, [updateState]);

    const isFollowing = useCallback((userId: string) => state.following.includes(userId), [state.following]);

    // ── Posts ──
<<<<<<< HEAD
    const addPost = useCallback(async (post: Omit<SocialPost, 'id' | 'likes' | 'commentCount' | 'comments' | 'createdAt'>) => {
        if (!auth.currentUser) return;
        const newPostData = {
            ...post,
            authorId: auth.currentUser.uid,
            likes: [],
            commentCount: 0,
            comments: [],
            createdAt: serverTimestamp(),
=======
    const addPost = useCallback(async (post: Omit<SocialPost, 'id' | 'likes' | 'liked' | 'shares' | 'comments' | 'timestamp'>) => {
        if (!auth.currentUser) return;
        const newPostData = {
            ...post,
            userId: auth.currentUser.uid,
            likes: 0,
            liked: false,
            shares: 0,
            comments: [],
            timestamp: new Date().toISOString(),
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
        };
        await addDoc(collection(db, 'posts'), newPostData);
        addXP(XP_REWARDS.post_created, 'Post created 📝');
    }, [addXP]);

    const likePost = useCallback(async (postId: string) => {
        if (!auth.currentUser) return;
        const postRef = doc(db, 'posts', postId);
        const userRef = doc(db, 'users', auth.currentUser.uid);
<<<<<<< HEAD

        // Find post to check if currently liked
        const post = state.posts.find(p => p.id === postId);
        const alreadyLiked = post?.likes?.includes(auth.currentUser.uid) || false;

        await updateDoc(postRef, {
            likes: alreadyLiked ? arrayRemove(auth.currentUser.uid) : arrayUnion(auth.currentUser.uid)
=======
        const alreadyLiked = state.likedPostIds.includes(postId);

        await updateDoc(postRef, {
            likes: increment(alreadyLiked ? -1 : 1)
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
        });
        await updateDoc(userRef, {
            likedPostIds: alreadyLiked ? arrayRemove(postId) : arrayUnion(postId)
        });
<<<<<<< HEAD
    }, [state.posts]);
=======
    }, [state.likedPostIds]);
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)

    const addComment = useCallback((postId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
        const newComment: Comment = { ...comment, id: Date.now().toString(), timestamp: 'Just now' };
        updateState(prev => ({
            ...prev,
            posts: prev.posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p),
        }));
        addXP(XP_REWARDS.comment_added, 'Comment added 💬');
    }, [updateState, addXP]);

    // ── Limits ──
    const resetDailyIfNewDay = useCallback((s: SocialState) => {
        const today = new Date().toISOString().slice(0, 10);
        if (s.lastUpdateDate !== today) {
            return { ...s, dailyAiCount: 0, dailyUploadCount: 0, lastUpdateDate: today };
        }
        return s;
    }, []);

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
        return allowed;
    }, [updateState, resetDailyIfNewDay]);

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

    // ── Views ──
    const recordView = useCallback(() => {
        updateState(prev => ({ ...prev, totalViews: prev.totalViews + 1 }));
    }, [updateState]);

    // ── Derived XP stats ──
    const level = Math.floor(state.xp / XP_PER_LEVEL) + 1;
    const xpInCurrentLevel = state.xp % XP_PER_LEVEL;
    const xpProgress = xpInCurrentLevel / XP_PER_LEVEL;
    const xpToNextLevel = XP_PER_LEVEL - xpInCurrentLevel;

    return (
        <SocialContext.Provider value={{
            ...state,
            addXP, level, xpToNextLevel, xpProgress,
            claimProPlan, followUser, unfollowUser, isFollowing,
            addPost, likePost, addComment, recordView,
            checkDailyLogin, showXpToast,
            recordAiMessage, recordUpload, togglePro,
            saveStudyHistory,
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
