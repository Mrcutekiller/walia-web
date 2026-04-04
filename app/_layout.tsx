import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold, 
  Inter_800ExtraBold, 
  Inter_900Black,
  useFonts 
} from '@expo-google-fonts/inter';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { AuthProvider, useAuth } from '@/store/auth';
import { SocialProvider, XpToastContainer, useSocial } from '@/store/social';
import { ThemeProvider, useTheme } from '@/store/theme';
import { TokenProvider } from '@/store/tokens';
import { Colors } from '@/constants/theme';

// Keep the splash screen visible while we fetch resources
function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const [forceRender, setForceRender] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Absolute failsafe to ensure we eventually render app no matter what
    const timer = setTimeout(() => {
        setForceRender(true);
        SplashScreen.hideAsync().catch(() => {});
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const fontsReady = fontsLoaded || fontError || forceRender;

  // Handle routing based on auth state
  useEffect(() => {
    if (isLoading || !isMounted || !fontsReady) return;

    // Handle navigation when segment is root '/'
    const inAuth = segments[0] === '(auth)';
    const seg1 = segments[1] as string | undefined;
    const onNewUserScreen = seg1 === 'features' || seg1 === 'pricing';

    // To prevent infinite route loops, delay slightly or just rely on router replace
    if (!isAuthenticated && !inAuth && segments.length > 0) {
      if (String(segments[0]) !== '(auth)') {
        router.replace('/(auth)/welcome');
      }
    } else if (isAuthenticated && inAuth && !onNewUserScreen) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, isMounted, fontsReady]);

  // Handle hiding the splash screen
  useEffect(() => {
    if (!isLoading && isMounted && fontsReady) {
      SplashScreen.hideAsync().catch((e) => console.warn('SplashScreen hide warning:', e));
    }
  }, [isLoading, isMounted, fontsReady]);

  // Absolute fallback: always hide splash after 5 seconds no matter what
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!fontsReady) return null;

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

function InnerApp() {
  const { isDark } = useTheme();

  const CustomDefaultTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.primary,
      background: Colors.background,
      card: Colors.card,
      text: Colors.text,
      border: Colors.border,
      notification: Colors.accent,
    },
  };

  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: Colors.primary,
      background: Colors.primaryDark,
      card: Colors.darkSurface,
      text: Colors.textInverse,
      border: Colors.borderDark,
      notification: Colors.accent,
    },
  };

  return (
    <NavThemeProvider value={isDark ? CustomDarkTheme : CustomDefaultTheme}>
      <View style={{ flex: 1, backgroundColor: isDark ? Colors.primaryDark : Colors.background }}>
        <RootNavigator />
        <XpToastContainer />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </View>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SocialProvider>
          <TokenProvider>
            <InnerApp />
          </TokenProvider>
        </SocialProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
