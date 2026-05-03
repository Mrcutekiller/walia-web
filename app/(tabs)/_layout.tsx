import { useTheme } from '@/store/theme';
import { useAuth } from '@/store/auth';
import { useSocial } from '@/store/social';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_CONFIG: Record<string, { icon: string; label: string }> = {
  ai: { icon: 'sparkles', label: 'AI' },
  chat: { icon: 'chatbubbles', label: 'Chat' },
  community: { icon: 'people', label: 'Community' },
  calendar: { icon: 'calendar', label: 'Calendar' },
  profile: { icon: 'person', label: 'Profile' },
};

function FloatingTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { isPro } = useSocial();
  const router = useRouter();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  if (isKeyboardVisible) return null;

  const visibleRoutes = state.routes.filter(
    (r: any) => TAB_CONFIG[r.name] !== undefined
  );

  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);

  useEffect(() => {
    if (isDesktop) setIsSidebarOpen(true);
    else setIsSidebarOpen(false);
  }, [isDesktop]);

  if (Platform.OS === 'web') {
    return (
      <>
        {!isDesktop && (
          <TouchableOpacity 
            style={[styles.hamburgerBtn, { backgroundColor: isDark ? '#1E293B' : '#FFF', borderColor: isDark ? '#334155' : '#E2E8F0' }]}
            onPress={() => setIsSidebarOpen(true)}
          >
            <Ionicons name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
        )}

        {!isDesktop && isSidebarOpen && (
          <TouchableOpacity 
            style={styles.mobileOverlay}
            activeOpacity={1}
            onPress={() => setIsSidebarOpen(false)}
          />
        )}

        <View style={[styles.webSidebar, { 
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
          borderRightColor: isDark ? '#1E293B' : '#E2E8F0',
          transform: [{ translateX: isDesktop ? 0 : (isSidebarOpen ? 0 : -260) }],
          shadowOpacity: !isDesktop && isSidebarOpen ? 0.3 : 0,
        }]}>
          <View style={styles.webHeader}>
              <View style={styles.webHeaderRow}>
                  <View style={styles.webLogoInner}>
                      <Image source={require('../../assets/images/walia-logo.png')} style={{width: 28, height: 28}} resizeMode="contain" />
                      <Text style={[styles.webLogoText, { color: colors.text }]}>Walia AI</Text>
                  </View>
                  <TouchableOpacity onPress={toggleTheme} style={[styles.themeBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                      <Ionicons name={isDark ? "sunny" : "moon"} size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
              </View>
              
              {!isPro && (
                  <TouchableOpacity onPress={() => router.push('/pro')} style={[styles.upgradeBtn, { backgroundColor: colors.primary }]}>
                      <Ionicons name="sparkles" size={14} color="#FFF" />
                      <Text style={styles.upgradeBtnText}>Upgrade to Pro</Text>
                  </TouchableOpacity>
              )}
          </View>

          <View style={styles.webNav}>
            {visibleRoutes.map((route: any) => {
              const config = TAB_CONFIG[route.name];
              const isFocused = state.routes[state.index]?.name === route.name;

              const onPress = () => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
                if (!isDesktop) setIsSidebarOpen(false);
              };

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  style={[
                    styles.webNavItem,
                    isFocused && { backgroundColor: colors.primary }
                  ]}
                >
                  <Ionicons 
                    name={isFocused ? config.icon as any : `${config.icon}-outline` as any} 
                    size={20} 
                    color={isFocused ? '#FFF' : colors.textSecondary} 
                  />
                  <Text style={[
                    styles.webNavText,
                    { color: isFocused ? '#FFF' : colors.textSecondary, fontWeight: isFocused ? '700' : '500' }
                  ]}>
                    {config.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          
          <View style={{ flex: 1 }} />
          
          <TouchableOpacity 
              onPress={() => { router.push('/profile'); if (!isDesktop) setIsSidebarOpen(false); }} 
              style={[styles.webProfile, { borderTopColor: isDark ? '#1E293B' : '#E2E8F0' }]}
          >
              {user?.photoURL ? (
                  <Image source={{ uri: user.photoURL }} style={styles.avatarImg} />
              ) : (
                  <View style={[styles.avatarFallback, { backgroundColor: colors.primary }]}>
                      <Text style={styles.avatarFallbackText}>{user?.name?.charAt(0) || 'U'}</Text>
                  </View>
              )}
              <View style={styles.profileInfo}>
                  <Text style={[styles.profileName, { color: colors.text }]} numberOfLines={1}>{user?.name || 'User'}</Text>
                  <Text style={[styles.profilePlan, { color: colors.textSecondary }]}>{isPro ? 'Pro Member' : 'Free Plan'}</Text>
              </View>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 8 }]}>
      <View style={[
        styles.tabBar,
        {
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.97)' : 'rgba(255, 255, 255, 0.97)',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
          shadowColor: isDark ? '#6366F1' : '#000',
        }
      ]}>
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
              style={[
                styles.tabItem,
                isFocused && [styles.tabItemActive, { backgroundColor: '#6366F1' }]
              ]}
              activeOpacity={0.8}
            >
              {isFocused ? (
                <View style={styles.activeContent}>
                  <Ionicons name={config.icon as any} size={17} color="#FFF" />
                  <Text style={styles.activeLabel}>{config.label}</Text>
                </View>
              ) : (
                <View style={styles.inactiveWrap}>
                  <Ionicons
                    name={`${config.icon}-outline` as any}
                    size={22}
                    color={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ 
        headerShown: false,
        sceneStyle: isDesktop ? { paddingLeft: 240 } : undefined
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="ai" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="community" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 40,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: '91%',
    gap: 6,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 26,
    minHeight: 50,
  },
  tabItemActive: {
    flex: 2.2,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  inactiveWrap: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
  },
  activeLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -0.2,
  },
  // Web Sidebar Styles
  hamburgerBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 90,
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mobileOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 95,
  },
  webSidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 240,
    borderRightWidth: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowRadius: 20,
    elevation: 10,
  },
  webHeader: {
    marginBottom: 30,
  },
  webHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  webLogoInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  webLogoText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  themeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
  },
  upgradeBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  webProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
    marginTop: 16,
  },
  avatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  avatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  profilePlan: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  webNav: {
    gap: 8,
  },
  webNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  webNavText: {
    fontSize: 15,
  },
});
