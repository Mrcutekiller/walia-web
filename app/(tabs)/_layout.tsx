import { useTheme } from '@/store/theme';
import { useAuth } from '@/store/auth';
import { useSocial } from '@/store/social';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, Platform, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_CONFIG: Record<string, { icon: string; label: string; activeColor: string }> = {
  ai: { icon: 'sparkles', label: 'AI Chat', activeColor: '#000' },
  chat: { icon: 'chatbubbles', label: 'Messages', activeColor: '#000' },
  community: { icon: 'people', label: 'Community', activeColor: '#000' },
  calendar: { icon: 'calendar', label: 'Calendar', activeColor: '#000' },
  profile: { icon: 'person', label: 'Profile', activeColor: '#000' },
};

function AnimatedTabItem({ route, isFocused, onPress, config, colors, isDark }: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1.05 : 1,
      tension: 180,
      friction: 12,
      useNativeDriver: true,
    }).start();
    Animated.timing(opacityAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabItem}
      activeOpacity={0.85}
    >
      <Animated.View style={[styles.tabItemInner, { transform: [{ scale: scaleAnim }] }]}>
        {isFocused ? (
          <View style={[styles.activeTab, { backgroundColor: isDark ? '#FFF' : '#000' }]}>
            <Ionicons name={config.icon as any} size={16} color={isDark ? '#000' : '#FFF'} />
            <Text style={[styles.activeLabel, { color: isDark ? '#000' : '#FFF' }]}>{config.label}</Text>
          </View>
        ) : (
          <View style={styles.inactiveTab}>
            <Ionicons
              name={`${config.icon}-outline` as any}
              size={22}
              color={isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.32)'}
            />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

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

  // ── Web Desktop Sidebar ──
  if (Platform.OS === 'web') {
    return (
      <>
        {/* Hamburger (mobile web) */}
        {!isDesktop && (
          <TouchableOpacity
            style={[styles.hamburgerBtn, {
              backgroundColor: isDark ? '#1a1a2e' : '#FFFFFF',
              borderColor: isDark ? '#2d2d4e' : '#E5E7EB',
            }]}
            onPress={() => setIsSidebarOpen(true)}
          >
            <Ionicons name="menu" size={22} color={colors.text} />
          </TouchableOpacity>
        )}

        {/* Mobile Overlay */}
        {!isDesktop && isSidebarOpen && (
          <TouchableOpacity
            style={styles.mobileOverlay}
            activeOpacity={1}
            onPress={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <View style={[styles.webSidebar, {
          backgroundColor: isDark ? '#09090F' : '#FFFFFF',
          borderRightColor: isDark ? 'rgba(255,255,255,0.06)' : '#F0F0F5',
          transform: [{ translateX: isDesktop ? 0 : (isSidebarOpen ? 0 : -260) }],
          shadowOpacity: !isDesktop && isSidebarOpen ? 0.25 : 0,
        }]}>

          {/* ── Header ── */}
          <View style={styles.sidebarHeader}>
            <View style={styles.logoRow}>
              <View style={[styles.logoIconBox, { backgroundColor: isDark ? '#FFF' : '#000' }]}>
                <Image
                  source={require('../../assets/images/walia-logo.png')}
                  style={{ width: 22, height: 22 }}
                  resizeMode="contain"
                  tintColor={isDark ? '#000' : '#FFF'}
                />
              </View>
              <View>
                <Text style={[styles.logoTitle, { color: colors.text }]}>Walia AI</Text>
                <Text style={[styles.logoSub, { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)' }]}>Intelligence</Text>
              </View>
            </View>

            {/* Theme toggle */}
            <TouchableOpacity
              onPress={toggleTheme}
              style={[styles.themeBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }]}
            >
              <Ionicons name={isDark ? 'sunny' : 'moon'} size={15} color={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'} />
            </TouchableOpacity>
          </View>

          {/* Upgrade banner */}
          {!isPro && (
            <TouchableOpacity
              onPress={() => { router.push('/pro' as any); if (!isDesktop) setIsSidebarOpen(false); }}
              style={[styles.upgradeBanner]}
            >
              <View style={styles.upgradeBannerInner}>
                <Ionicons name="sparkles" size={13} color="#FFF" />
                <Text style={styles.upgradeBannerText}>Upgrade to Pro</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* ── Nav Links ── */}
          <View style={styles.navSection}>
            <Text style={[styles.navLabel, { color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)' }]}>MENU</Text>
            <View style={[styles.navDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F0F0F5' }]} />
          </View>

          <View style={styles.navItems}>
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
                    styles.navItem,
                    isFocused && { backgroundColor: isDark ? '#FFF' : '#000' }
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.navIconBox,
                    isFocused
                      ? { backgroundColor: 'rgba(255,255,255,0.2)' }
                      : { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
                  ]}>
                    <Ionicons
                      name={isFocused ? config.icon as any : `${config.icon}-outline` as any}
                      size={17}
                      color={isFocused ? (isDark ? '#000' : '#FFF') : (isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)')}
                    />
                  </View>
                  <Text style={[
                    styles.navItemText,
                    {
                      color: isFocused ? (isDark ? '#000' : '#FFF') : (isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.6)'),
                      fontWeight: isFocused ? '800' : '600',
                    }
                  ]}>
                    {config.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* ── User Profile ── */}
          <TouchableOpacity
            onPress={() => { router.push('/profile' as any); if (!isDesktop) setIsSidebarOpen(false); }}
            style={[styles.userCard, {
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F7F8FA',
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#EBEBF0',
            }]}
          >
            <View style={styles.userAvatarWrap}>
              {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.userAvatar} />
              ) : (
                <View style={[styles.userAvatarFallback, { backgroundColor: isDark ? '#FFF' : '#000' }]}>
                  <Text style={[styles.userAvatarText, { color: isDark ? '#000' : '#FFF' }]}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                </View>
              )}
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
                {user?.name || 'User'}
              </Text>
              <Text style={[styles.userPlan, { color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }]}>
                {isPro ? '✦ Pro Member' : 'Free Plan'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  // ── Mobile Tab Bar ──
  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 4 }]}>
      <View style={[
        styles.tabBar,
        {
          backgroundColor: isDark ? 'rgba(9, 9, 15, 0.96)' : 'rgba(255, 255, 255, 0.97)',
          borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
        }
      ]}>
        {visibleRoutes.map((route: any) => {
          const config = TAB_CONFIG[route.name];
          const isFocused = state.routes[state.index]?.name === route.name;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <AnimatedTabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={onPress}
              config={config}
              colors={colors}
              isDark={isDark}
            />
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
        sceneStyle: isDesktop ? { paddingLeft: 240 } : undefined,
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
  // ── Mobile ──
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
    borderRadius: 48,
    paddingVertical: 7,
    paddingHorizontal: 8,
    alignItems: 'center',
    width: '90%',
    gap: 4,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.14,
    shadowRadius: 40,
    elevation: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 32,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  activeLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -0.2,
  },
  inactiveTab: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Web Sidebar ──
  hamburgerBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 90,
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  mobileOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 95,
  },
  webSidebar: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 240,
    borderRightWidth: 1,
    paddingTop: 28,
    paddingHorizontal: 14,
    paddingBottom: 20,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 0 },
    shadowRadius: 24,
    elevation: 12,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoTitle: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 20,
  },
  logoSub: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  themeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeBanner: {
    borderRadius: 14,
    marginBottom: 18,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  upgradeBannerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 11,
  },
  upgradeBannerText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  navSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  navLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  navDivider: {
    flex: 1,
    height: 1,
  },
  navItems: {
    gap: 3,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  navIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemText: {
    fontSize: 14,
    letterSpacing: -0.2,
  },
  // User card
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 11,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 12,
  },
  userAvatarWrap: {
    position: 'relative',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 11,
  },
  userAvatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 14,
    fontWeight: '900',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 1,
  },
  userPlan: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
