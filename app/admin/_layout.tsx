import { useAuth } from '@/store/auth';
import { useTheme } from '@/store/theme';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AdminLayout() {
    const { user } = useAuth();
    const router = useRouter();
    const { isDark } = useTheme();

    useEffect(() => {
        if (user && !user.isAdmin) {
            router.replace('/(tabs)/profile');
        }
    }, [user]);

    if (!user?.isAdmin) return null;

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: isDark ? '#121212' : '#FFFFFF' },
                headerTintColor: isDark ? '#FFFFFF' : '#000000',
                headerTitleStyle: { fontWeight: '900' },
                contentStyle: { backgroundColor: isDark ? '#000000' : '#F9FAFB' }
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Admin Overview', headerLargeTitle: true }} />
            <Stack.Screen name="users" options={{ title: 'User Management' }} />
            <Stack.Screen name="payments" options={{ title: 'Payments' }} />
            <Stack.Screen name="notifications" options={{ title: 'Broadcasts' }} />
            <Stack.Screen name="support" options={{ title: 'Support Inbox' }} />
            <Stack.Screen name="settings" options={{ title: 'Global Settings' }} />
        </Stack>
    );
}
