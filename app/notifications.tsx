import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { useSocial } from '@/store/social';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const { notifications = [], markNotificationRead, deleteNotification } = useSocial();
  
  // Sort notifications by newest first
  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment': return 'card';
      case 'message': return 'chatbubbles';
      case 'system': return 'shield-checkmark';
      case 'community': return 'people';
      default: return 'notifications';
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isUnread = !item.read;
    return (
      <View style={[styles.notificationCard, { backgroundColor: colors.surface, borderLeftColor: isUnread ? colors.primary : 'transparent' }]}>
        <View style={[styles.iconWrapper, { backgroundColor: isDark ? '#2D2D2D' : '#F0F0F5' }]}>
          <Ionicons name={getIcon(item.type) as any} size={20} color={isUnread ? colors.primary : colors.textTertiary} />
        </View>
        <View style={styles.notifContent}>
          <View style={styles.notifHeader}>
            <Text style={[styles.notifTitle, { color: colors.text, fontWeight: isUnread ? '900' : '600' }]}>{item.title}</Text>
            <TouchableOpacity onPress={() => deleteNotification(item.id)}>
              <Ionicons name="close-circle-outline" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.notifMessage, { color: colors.textSecondary }]}>{item.message}</Text>
          {!item.read && (
             <TouchableOpacity onPress={() => markNotificationRead(item.id)} style={styles.markReadBtn}>
                <Text style={[styles.markReadText, { color: colors.primary }]}>Mark as read</Text>
             </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surfaceAlt }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={sortedNotifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={60} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>All caught up!</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderLeftWidth: 4,
    gap: Spacing.md,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifContent: {
    flex: 1,
    gap: 4,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifTitle: {
    fontSize: FontSize.md,
  },
  notifMessage: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  markReadBtn: {
    marginTop: 8,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});
