/**
 * TokenStore — AI usage token system (Offline-First via AsyncStorage)
 * Free Plan limits:
 * - AI Chat Messages: 20
 * - Study Plans / Calendar: 5
 * - AI Tool Uses: 10
 * - Image Uploads: 5
 * - Community Posts: 3
 * Pro: Unlimited
 * Tokens reset daily at midnight
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useSocial } from './social';

export const FREE_LIMITS = {
    ai_chat: 20,
    study_plans: 5,
    ai_tools: 10,
    image_uploads: 5,
    community_posts: 3,
} as const;

export type TokenFeature = keyof typeof FREE_LIMITS;

interface TokenContextType {
    usage: Record<TokenFeature, number>;
    getRemaining: (feature: TokenFeature) => number;
    canAfford: (feature: TokenFeature) => boolean;
    consumeTokens: (feature: TokenFeature) => boolean;
}

const TokenContext = createContext<TokenContextType>({
    usage: { ai_chat: 0, study_plans: 0, ai_tools: 0, image_uploads: 0, community_posts: 0 },
    getRemaining: () => 0,
    canAfford: () => true,
    consumeTokens: () => true,
});

export function TokenProvider({ children }: { children: React.ReactNode }) {
    const { isPro } = useSocial();
    const [usage, setUsage] = useState<Record<TokenFeature, number>>({
        ai_chat: 0,
        study_plans: 0,
        ai_tools: 0,
        image_uploads: 0,
        community_posts: 0,
    });

    useEffect(() => {
        const loadUsage = async () => {
            try {
                const today = new Date().toISOString().slice(0, 10);
                const storedDate = await AsyncStorage.getItem('walia_usage_date');
                if (storedDate !== today) {
                    await AsyncStorage.setItem('walia_usage_date', today);
                    await AsyncStorage.removeItem('walia_usage_counts');
                } else {
                    const counts = await AsyncStorage.getItem('walia_usage_counts');
                    if (counts) {
                        setUsage(JSON.parse(counts));
                    }
                }
            } catch (e) {
                console.error('Failed to load token usage', e);
            }
        };
        loadUsage();
    }, []);

    const getRemaining = useCallback((feature: TokenFeature) => {
        if (isPro) return 999999;
        return Math.max(0, FREE_LIMITS[feature] - (usage[feature] || 0));
    }, [isPro, usage]);

    const canAfford = useCallback((feature: TokenFeature) => {
        return getRemaining(feature) > 0;
    }, [getRemaining]);

    const consumeTokens = useCallback((feature: TokenFeature): boolean => {
        if (!canAfford(feature)) {
            Alert.alert(
                '🔒 Limit Reached',
                `You've used all your free ${feature.replace('_', ' ')} for today.\n\nUpgrade to Pro for unlimited access!`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Upgrade to Pro' }
                ]
            );
            return false;
        }

        if (isPro) return true;

        const newUsage = { ...usage, [feature]: (usage[feature] || 0) + 1 };
        setUsage(newUsage);
        AsyncStorage.setItem('walia_usage_counts', JSON.stringify(newUsage)).catch(console.error);

        return true;
    }, [canAfford, isPro, usage]);

    return (
        <TokenContext.Provider value={{
            usage,
            getRemaining,
            canAfford,
            consumeTokens,
        }}>
            {children}
        </TokenContext.Provider>
    );
}

export function useTokens() {
    return useContext(TokenContext);
}
