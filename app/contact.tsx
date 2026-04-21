import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ContactScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Black/white theme colors - consistent with Home page
  const theme = {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#444444',
    textTertiary: '#888888',
    surface: '#F5F5F5',
    surfaceAlt: '#EEEEEE',
    primary: '#000000',
    border: '#E0E0E0',
  };

  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setSent(true);
    setTimeout(() => {
        setSent(false);
        setForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <SafeAreaView style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.surfaceAlt }]}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Contact Us</Text>
            <View style={{ width: 44 }} />
          </SafeAreaView>

          <View style={styles.content}>
            <Text style={[styles.heroText, { color: theme.text }]}>We'd love to hear from you.</Text>
            <Text style={[styles.subText, { color: theme.textSecondary }]}>Whether you have a question about features, pricing, or anything else, our team is ready to answer.</Text>

            {/* Quick Contact Chips */}
            <View style={styles.chips}>
              <TouchableOpacity style={[styles.chip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Ionicons name="mail" size={16} color={theme.primary} />
                <Text style={[styles.chipText, { color: theme.text }]}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.chip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Ionicons name="send" size={16} color={theme.primary} />
                <Text style={[styles.chipText, { color: theme.text }]}>Telegram</Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textTertiary }]}>FULL NAME</Text>
                <TextInput 
                  style={[styles.input, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border }]}
                  placeholder="Biruk Fikru"
                  placeholderTextColor={theme.textTertiary}
                  value={form.name}
                  onChangeText={(t) => setForm(f => ({ ...f, name: t }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textTertiary }]}>EMAIL ADDRESS</Text>
                <TextInput 
                  style={[styles.input, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border }]}
                  placeholder="biruk@walia.com"
                  placeholderTextColor={theme.textTertiary}
                  keyboardType="email-address"
                  value={form.email}
                  onChangeText={(t) => setForm(f => ({ ...f, email: t }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textTertiary }]}>MESSAGE</Text>
                <TextInput 
                  style={[styles.input, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border, height: 120, textAlignVertical: 'top' }]}
                  placeholder="How can we help?"
                  placeholderTextColor={theme.textTertiary}
                  multiline
                  value={form.message}
                  onChangeText={(t) => setForm(f => ({ ...f, message: t }))}
                />
              </View>

              <TouchableOpacity 
                disabled={loading || sent}
                onPress={handleSend}
                style={[styles.sendBtn, { backgroundColor: sent ? '#10B981' : theme.primary }]}
              >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : sent ? (
                    <View style={styles.btnContent}>
                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                        <Text style={styles.sendBtnText}>Sent Successfully</Text>
                    </View>
                ) : (
                    <View style={styles.btnContent}>
                        <Text style={styles.sendBtnText}>Send Message</Text>
                        <Ionicons name="send" size={18} color="#fff" />
                    </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  content: { padding: 25 },
  heroText: { fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  subText: { fontSize: 16, marginTop: 10, lineHeight: 24, fontWeight: '500' },
  chips: { flexDirection: 'row', gap: 10, marginTop: 25 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 14, fontWeight: '700' },
  form: { marginTop: 40, gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginLeft: 5 },
  input: { paddingHorizontal: 20, paddingVertical: 15, borderRadius: 20, borderWidth: 1, fontSize: 16, fontWeight: '600' },
  sendBtn: { height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  btnContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sendBtnText: { color: '#fff', fontSize: 18, fontWeight: '900' },
});
