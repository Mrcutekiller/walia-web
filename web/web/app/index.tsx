import { useAuth } from '@/store/auth';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#0A0A18', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#6C63FF" />
            </View>
        );
    }

    return <Redirect href={isAuthenticated ? "/(tabs)" : "/(auth)/welcome"} />;
}
