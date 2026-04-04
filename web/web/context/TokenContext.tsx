'use client';

/**
 * TokenContext — AI usage token system for web
 * Free: 50 tokens/day, Pro: Unlimited
 * Syncs with Firestore, resets daily
 */
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, increment, updateDoc } from 'firebase/firestore';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// ─── Token costs per feature ──────────────────────────────────────────────────
export const TOKEN_COSTS: Record<string, number> = {
    ai_chat: 1,
    summarizer: 3,
    quiz_maker: 3,
    flashcards: 3,
    image_scanner: 5,
    code_assistant: 2,
    translator: 2,
    grammar_pro: 2,
    citations: 2,
};

export type TokenFeature = keyof typeof TOKEN_COSTS;

export const FREE_DAILY_TOKENS = 100;
export const PRO_DAILY_TOKENS = 999999;

// ─── Types ────────────────────────────────────────────────────────────────────
interface TokenContextType {
    tokensUsed: number;
    dailyLimit: number;
    tokensRemaining: number;
    isPro: boolean;
    tokenDisplay: string;
    consumeTokens: (feature: string) => boolean;
    canAfford: (feature: string) => boolean;
    rewardTokens: (amount: number) => void;
}

const TokenCtx = createContext<TokenContextType>({
    tokensUsed: 0,
    dailyLimit: FREE_DAILY_TOKENS,
    tokensRemaining: FREE_DAILY_TOKENS,
    isPro: false,
    tokenDisplay: `${FREE_DAILY_TOKENS}/${FREE_DAILY_TOKENS}`,
    consumeTokens: () => true,
    canAfford: () => true,
    rewardTokens: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────
export function TokenProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [tokensUsed, setTokensUsed] = useState(0);

    const isPro = user?.isPro || false;

    // Sync tokens from user (already live via AuthContext onSnapshot)
    useEffect(() => {
        if (!user) return;
        const today = new Date().toISOString().slice(0, 10);
        const savedDate = user.lastTokenResetDate || '';

        if (savedDate !== today) {
            // Reset for new day
            setTokensUsed(0);
            updateDoc(doc(db, 'users', user.id), {
                tokensUsed: 0,
                lastTokenResetDate: today,
            }).catch(() => { });
        } else {
            setTokensUsed(user.tokensUsed || 0);
        }
    }, [user]);

    const dailyLimit = isPro ? PRO_DAILY_TOKENS : FREE_DAILY_TOKENS;
    const tokensRemaining = Math.max(0, dailyLimit - tokensUsed);
    const tokenDisplay = isPro ? '∞' : `${tokensRemaining}/${dailyLimit}`;

    const canAfford = useCallback((feature: string) => {
        if (isPro) return true;
        const cost = TOKEN_COSTS[feature] || 1;
        return tokensRemaining >= cost;
    }, [isPro, tokensRemaining]);

    const consumeTokens = useCallback((feature: string): boolean => {
        const cost = TOKEN_COSTS[feature] || 1;

        if (!isPro && tokensRemaining < cost) {
            return false;
        }

        if (!isPro && user) {
            const newUsed = tokensUsed + cost;
            setTokensUsed(newUsed);
            updateDoc(doc(db, 'users', user.id), {
                tokensUsed: increment(cost),
            }).catch(() => { });
        }

        return true;
    }, [isPro, tokensRemaining, tokensUsed, user]);

    const rewardTokens = useCallback((amount: number) => {
        if (!user || isPro) return;
        const newUsed = Math.max(0, tokensUsed - amount);
        setTokensUsed(newUsed);
        updateDoc(doc(db, 'users', user.id), {
            tokensUsed: increment(-amount),
        }).catch(() => { });
    }, [isPro, tokensUsed, user]);

    const value = useMemo(() => ({
        tokensUsed, dailyLimit, tokensRemaining, isPro, tokenDisplay, consumeTokens, canAfford, rewardTokens,
    }), [tokensUsed, dailyLimit, tokensRemaining, isPro, tokenDisplay, consumeTokens, canAfford, rewardTokens]);

    return <TokenCtx.Provider value={value}>{children}</TokenCtx.Provider>;
}

export function useTokens() {
    return useContext(TokenCtx);
}
