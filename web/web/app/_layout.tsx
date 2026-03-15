import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/store/auth';
import { SocialProvider, XpToastContainer, useSocial } from '@/store/social';
import { ThemeProvider, useTheme } from '@/store/theme';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { checkDailyLogin } = useSocial();
  const segments = useSegments();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle routing based on auth state
  useEffect(() => {
    if (isLoading || !isMounted) return;

    const inAuth = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/welcome');
    } else if (isAuthenticated && inAuth) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, isMounted]);

  // Handle hiding the splash screen
  useEffect(() => {
    if (!isLoading && isMounted) {
      SplashScreen.hideAsync();
    }
  }, [isLoading, isMounted]);

  // Check daily login XP on app open
  useEffect(() => {
    if (isAuthenticated) {
      checkDailyLogin();
    }
  }, [isAuthenticated]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="chat/group/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="chat/new" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="community/index" options={{ headerShown: false }} />
      <Stack.Screen name="community/post/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="community/new-post" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="ai/index" options={{ headerShown: false }} />
      <Stack.Screen name="ai/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="tools/summarize" options={{ headerShown: false }} />
      <Stack.Screen name="tools/quiz" options={{ headerShown: false }} />
      <Stack.Screen name="tools/flashcard" options={{ headerShown: false }} />
      <Stack.Screen name="tools/notes" options={{ headerShown: false }} />
      <Stack.Screen name="calendar/add" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
      <Stack.Screen name="profile/settings" options={{ headerShown: false }} />
      <Stack.Screen name="profile/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="pro" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
}

function InnerApp() {
  const { isDark } = useTheme();
  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <RootNavigator />
        <XpToastContainer />
      </View>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SocialProvider>
          <InnerApp />
        </SocialProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
