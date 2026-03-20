import { FontSize } from '@/constants/theme';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_CONFIG: Record<string, { icon: string; label: string }> = {
  ai: { icon: 'sparkles', label: 'AI' },
  chat: { icon: 'chatbubbles', label: 'Chat' },
  tools: { icon: 'grid', label: 'Tools' },
  calendar: { icon: 'calendar', label: 'Calendar' },
  profile: { icon: 'person', label: 'Profile' },
};

function FloatingTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (isKeyboardVisible) return null;

  const visibleRoutes = state.routes.filter(
    (r: any) => TAB_CONFIG[r.name] !== undefined
  );

  const barBg = isDark ? '#121212' : '#FFFFFF';
  const activeBg = isDark ? '#FFFFFF' : '#000000';
  const activeText = isDark ? '#000000' : '#FFFFFF';
  const inactiveIcon = isDark ? 'rgba(255,255,255,0.5)' : '#9CA3AF';

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom + 8 }]}>
      <View style={[styles.tabBar, { backgroundColor: barBg, borderWidth: isDark ? 0 : 1, borderColor: '#E5E7EB' }]}>
        {visibleRoutes.map((route: any) => {
          const config = TAB_CONFIG[route.name];
          const isFocused = state.routes[state.index]?.name === route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.tabItem, isFocused && [styles.tabItemActive, { backgroundColor: activeBg }]]}
              activeOpacity={0.8}
            >
              {isFocused ? (
                <View style={styles.activeContent}>
                  <Ionicons name={config.icon as any} size={18} color={activeText} />
                  <Text style={[styles.activeLabel, { color: activeText }]}>{config.label}</Text>
                </View>
              ) : (
                <Ionicons name={`${config.icon}-outline` as any} size={22} color={inactiveIcon} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="ai" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="tools" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: '88%',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 40,
    minHeight: 44,
  },
  tabItemActive: {
    flex: 1.8,
  },
  activeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeLabel: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
