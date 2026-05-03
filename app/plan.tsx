import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { db } from '@/services/firebase';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, query, where, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Simple native date helpers to replace date-fns
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};
const startOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    return new Date(d.setDate(diff));
};
const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DailyPlanScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  // Generate 14 days starting from this week's Monday
  const weekStart = startOfWeek(new Date());
  const weekDays = useMemo(() => Array.from({ length: 14 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.id)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const addTask = async () => {
    if (!newTask.trim() || !user) return;
    const taskTitle = newTask.trim();
    setNewTask('');
    try {
      await addDoc(collection(db, 'tasks'), {
        userId: user.id,
        title: taskTitle,
        completed: false,
        date: formatDate(selectedDate),
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, 'tasks', id), { completed: !completed });
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredTasks = useMemo(() => 
    tasks.filter(t => t.date === formatDate(selectedDate)),
    [tasks, selectedDate]
  );

  const completionRate = useMemo(() => {
    if (filteredTasks.length === 0) return 0;
    const completed = filteredTasks.filter(t => t.completed).length;
    return Math.round((completed / filteredTasks.length) * 100);
  }, [filteredTasks]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surfaceAlt }]}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Daily Plan</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Progress Card */}
        <View style={styles.progressContainer}>
            <LinearGradient
                colors={[colors.primary, '#6366F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressCard}
            >
                <View style={styles.progressTextContainer}>
                    <Text style={styles.progressLabel}>TODAY'S PROGRESS</Text>
                    <Text style={styles.progressValue}>{completionRate}%</Text>
                    <Text style={styles.progressQuote}>
                        {completionRate === 100 ? "Amazing work! 🚀" : completionRate > 50 ? "Almost there! 💪" : "Let's get started! 🔥"}
                    </Text>
                </View>
                <View style={styles.progressBarWrapper}>
                    <View style={[styles.progressBarBase, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <View style={[styles.progressBarFill, { width: `${completionRate}%` }]} />
                    </View>
                </View>
            </LinearGradient>
        </View>

        {/* Date Strip */}
        <View style={styles.dateStripContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateStrip}>
            {weekDays.map((date, i) => {
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, new Date());
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedDate(date)}
                  style={[
                    styles.dateCard,
                    { backgroundColor: isSelected ? colors.primary : isDark ? '#1F2937' : '#F3F4F6' },
                    isSelected && styles.dateCardActive
                  ]}
                >
                  <Text style={[styles.dateDay, { color: isSelected ? '#fff' : colors.textTertiary }]}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</Text>
                  <Text style={[styles.dateNum, { color: isSelected ? '#fff' : colors.text }]}>{date.getDate()}</Text>
                  {isToday && !isSelected && <View style={[styles.todayMarker, { backgroundColor: colors.primary }]} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Tasks Section */}
        <View style={styles.tasksBody}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {isSameDay(selectedDate, new Date()) ? "Today's Tasks" : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
            <TouchableOpacity style={[styles.filterBtn, { borderColor: colors.border }]}>
                <Ionicons name="options-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
          ) : (
            <FlatList
              data={filteredTasks}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={[styles.taskItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <TouchableOpacity 
                    onPress={() => toggleTask(item.id, item.completed)}
                    style={[styles.checkbox, { borderColor: item.completed ? '#10B981' : colors.divider, backgroundColor: item.completed ? '#10B981' : 'transparent' }]}
                  >
                    {item.completed && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </TouchableOpacity>
                  <View style={styles.taskContent}>
                    <Text style={[styles.taskTitle, { color: colors.text, textDecorationLine: item.completed ? 'line-through' : 'none', opacity: item.completed ? 0.4 : 1 }]}>
                        {item.title}
                    </Text>
                    <Text style={[styles.taskTime, { color: colors.textTertiary }]}>Added {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={18} color={isDark ? '#EF4444' : '#F87171'} />
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={styles.taskList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceAlt }]}>
                    <Ionicons name="list-outline" size={40} color={colors.textTertiary} />
                  </View>
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No tasks planned yet</Text>
                  <Text style={[styles.emptySubText, { color: colors.textTertiary }]}>Tap the input below to add one!</Text>
                </View>
              }
            />
          )}
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
            <TextInput
              value={newTask}
              onChangeText={setNewTask}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.textTertiary}
              style={[styles.input, { color: colors.text }]}
            />
            <TouchableOpacity onPress={addTask} style={[styles.addCircle, { backgroundColor: colors.primary }]}>
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  progressCard: {
    padding: 25,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTextContainer: {
    flex: 1,
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  progressValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    marginVertical: 2,
  },
  progressQuote: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.9,
  },
  progressBarWrapper: {
    width: 10,
    height: 80,
    marginLeft: 20,
  },
  progressBarBase: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  progressBarFill: {
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  dateStripContainer: {
    marginTop: 25,
  },
  dateStrip: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dateCard: {
    width: 65,
    height: 85,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCardActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  dateDay: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dateNum: {
    fontSize: 22,
    fontWeight: '900',
  },
  todayMarker: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 10,
  },
  tasksBody: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskList: {
    gap: 15,
    paddingBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
  },
  taskContent: {
    flex: 1,
    marginLeft: 15,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  taskTime: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20,
    borderTopWidth: 1,
    alignItems: 'center',
    gap: 15,
  },
  input: {
    flex: 1,
    height: 54,
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 20,
  },
  addCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '900',
  },
  emptySubText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
});
