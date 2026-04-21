import { useAuth } from '@/store/auth';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useState } from 'react';

export default function Index() {
    const { isAuthenticated, isLoading } = useAuth();
    const [hasSeenIntro, setHasSeenIntro] = useState<boolean | null>(null);

    useEffect(() => {
        const checkIntroStatus = async () => {
            try {
                const seen = await AsyncStorage.getItem('has_seen_intro');
                setHasSeenIntro(seen === 'true');
            } catch (e) {
                setHasSeenIntro(false);
            }
        };
        checkIntroStatus();
    }, []);

    if (isLoading || hasSeenIntro === null) {
        return (
            <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (isAuthenticated) {
        return <Redirect href="/(tabs)/ai" />;
    }

    if (!hasSeenIntro) {
        return <Redirect href="/intro" as any />;
    }

    return <Redirect href="/(auth)/welcome" />;
}