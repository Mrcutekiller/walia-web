/**
 * TokenStore — AI usage token system
 * Free: 50 tokens/day, Pro: Unlimited
 * Tokens reset daily at midnight (client-side check)
 */
import { auth, db } from '@/services/firebase';
import { doc, increment, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

// ─── Token costs per feature ──────────────────────────────────────────────────
export const TOKEN_COSTS = {
    ai_chat: 1,
    summarizer: 3,
    quiz_maker: 3,
    flashcards: 3,
    image_scanner: 5,
    code_assistant: 2,
    translator: 2,
    grammar_pro: 2,
    citations: 2,
} as const;

export type TokenFeature = keyof typeof TOKEN_COSTS;

export const FREE_DAILY_TOKENS = 100;
export const PRO_DAILY_TOKENS = 999999; // effectively unlimited

// ─── Types ────────────────────────────────────────────────────────────────────
interface TokenContextType {
    tokensUsed: number;
    dailyLimit: number;
    tokensRemaining: number;
    isPro: boolean;
    tokenDisplay: string; // "42/50" or "∞"
    consumeTokens: (feature: TokenFeature) => boolean;
    canAfford: (feature: TokenFeature) => boolean;
    rewardTokens: (amount: number, reason: string) => void;
}

const TokenContext = createContext<TokenContextType>({
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
    const [tokensUsed, setTokensUsed] = useState(0);
    const [isPro, setIsPro] = useState(false);
    const [lastResetDate, setLastResetDate] = useState('');

    // Sync from Firestore
    useEffect(() => {
        if (!auth.currentUser) return;
        
        const fallbackTimer = setTimeout(() => {
            console.warn('TokenProvider sync timeout, using defaults');
        }, 5000);

        const unsub = onSnapshot(doc(db, 'users', auth.currentUser.uid), (snap) => {
            clearTimeout(fallbackTimer);
            if (snap.exists()) {
                const data = snap.data();
                setIsPro(data.isPro || false);

                // Check daily reset
                const today = new Date().toISOString().slice(0, 10);
                const savedDate = data.lastTokenResetDate || '';

                if (savedDate !== today) {
                    // Reset tokens for new day
                    setTokensUsed(0);
                    setLastResetDate(today);
                    updateDoc(doc(db, 'users', auth.currentUser!.uid), {
                        tokensUsed: 0,
                        lastTokenResetDate: today,
                    }).catch(() => { });
                } else {
                    setTokensUsed(data.tokensUsed || 0);
                    setLastResetDate(savedDate);
                }
            }
        }, (error) => {
            clearTimeout(fallbackTimer);
            console.warn('TokenProvider sync error:', error);
        });
        return () => {
            clearTimeout(fallbackTimer);
            unsub();
        };
    }, [auth.currentUser]);

    const dailyLimit = isPro ? PRO_DAILY_TOKENS : FREE_DAILY_TOKENS;
    const tokensRemaining = Math.max(0, dailyLimit - tokensUsed);

    const tokenDisplay = isPro ? '∞' : `${tokensRemaining}/${dailyLimit}`;

    const canAfford = useCallback((feature: TokenFeature) => {
        if (isPro) return true;
        return tokensRemaining >= TOKEN_COSTS[feature];
    }, [isPro, tokensRemaining]);

    const consumeTokens = useCallback((feature: TokenFeature): boolean => {
        const cost = TOKEN_COSTS[feature];

        if (!isPro && tokensRemaining < cost) {
            Alert.alert(
                '🪙 Out of Tokens',
                `This action costs ${cost} token${cost > 1 ? 's' : ''}. You have ${tokensRemaining} left today.\n\nUpgrade to Pro for unlimited tokens!`,
                [
                    { text: 'OK', style: 'cancel' },
                ]
            );
            return false;
        }

        // Deduct tokens
        if (!isPro && auth.currentUser) {
            const newUsed = tokensUsed + cost;
            setTokensUsed(newUsed);
            updateDoc(doc(db, 'users', auth.currentUser.uid), {
                tokensUsed: increment(cost),
            }).catch(() => { });
        }

        return true;
    }, [isPro, tokensRemaining, tokensUsed]);

    const rewardTokens = useCallback((amount: number, reason: string) => {
        if (!auth.currentUser || isPro) return;
        const newUsed = Math.max(0, tokensUsed - amount); // rewarding decreases 'used' to give more
        setTokensUsed(newUsed);
        updateDoc(doc(db, 'users', auth.currentUser.uid), {
            tokensUsed: increment(-amount), // decrease used sum -> increases remaining
        }).catch(() => { });
        Alert.alert('🎉 Bonus Tokens!', `You received +${amount} tokens for:\n${reason}`);
    }, [isPro, tokensUsed]);

    return (
        <TokenContext.Provider value={{
            tokensUsed,
            dailyLimit,
            tokensRemaining,
            isPro,
            tokenDisplay,
            consumeTokens,
            canAfford,
            rewardTokens,
        }}>
            {children}
        </TokenContext.Provider>
    );
}

export function useTokens() {
    return useContext(TokenContext);
}
