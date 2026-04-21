import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { db, storage } from '@/services/firebase';
import { useTheme } from '@/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const PAYMENT_METHODS = [
  { id: 'telebirr', name: 'Telebirr', icon: 'phone-portrait', account: '0980140287', label: 'Phone' },
  { id: 'cbe', name: 'CBE (Commercial Bank)', icon: 'business', account: '1000724852177', label: 'Account' }
];

export default function PaymentScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const { callbackUrl } = useLocalSearchParams();

  const [step, setStep] = useState(1); // 1: Method, 2: Upload, 3: Success
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setScreenshot(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!screenshot || !user) return;
    setUploading(true);

    try {
      // 1. Upload to Firebase Storage
      const response = await fetch(screenshot);
      const blob = await response.blob();
      const filename = `payment_proofs/${user.id}_${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      // 2. Save to Firestore
      await addDoc(collection(db, 'payments'), {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        method: selectedMethod.name,
        amount: '$12 / month',
        proofUrl: url,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      // 3. Create Notification
      await addDoc(collection(db, 'notifications'), {
        userId: user.id,
        title: 'Proof Uploaded',
        message: 'Your payment proof is being verified. This usually takes 1-2 hours.',
        type: 'payment',
        read: false,
        createdAt: serverTimestamp(),
      });

      setStep(3);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to upload proof. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFinish = () => {
    if (callbackUrl) {
      router.replace(callbackUrl as any);
    } else {
      router.replace('/(tabs)/profile');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()} style={[styles.backBtn, { backgroundColor: colors.surfaceAlt }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Secure Payment</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={[styles.title, { color: colors.text }]}>Choose Method</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Select your preferred Ethiopian payment method</Text>
              
              <View style={styles.methodsGrid}>
                {PAYMENT_METHODS.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    onPress={() => { setSelectedMethod(method); setStep(2); }}
                    style={[styles.methodCard, { backgroundColor: colors.surface, borderColor: colors.divider }]}
                  >
                    <View style={[styles.methodIcon, { backgroundColor: isDark ? '#2D2D2D' : '#F0F0F5' }]}>
                      <Ionicons name={method.icon as any} size={24} color={colors.primary} />
                    </View>
                    <Text style={[styles.methodName, { color: colors.text }]}>{method.name}</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 2 && selectedMethod && (
            <View style={styles.stepContainer}>
              <View style={[styles.instructionCard, { backgroundColor: colors.surface }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Payment Instructions</Text>
                  <View style={[styles.methodBadge, { backgroundColor: `${colors.primary}20` }]}>
                    <Text style={[styles.methodBadgeText, { color: colors.primary }]}>{selectedMethod.name}</Text>
                  </View>
                </View>
                
                <View style={styles.accountBox}>
                  <Text style={[styles.accountLabel, { color: colors.textSecondary }]}>{selectedMethod.label} Number</Text>
                  <Text style={[styles.accountValue, { color: colors.text }]}>{selectedMethod.account}</Text>
                  <Text style={[styles.nameLabel, { color: colors.textTertiary }]}>Account Name: <Text style={{ color: colors.text, fontWeight: 'bold' }}>Biruk</Text></Text>
                </View>

                <View style={styles.warningBox}>
                  <Ionicons name="information-circle" size={16} color={colors.primary} />
                  <Text style={[styles.warningText, { color: colors.textSecondary }]}>Please make the payment first, then upload the receipt screenshot below.</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={pickImage}
                style={[styles.uploadBox, { backgroundColor: colors.surface, borderStyle: 'dashed', borderColor: screenshot ? colors.primary : colors.divider }]}
              >
                {screenshot ? (
                  <Image source={{ uri: screenshot }} style={styles.previewImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Ionicons name="cloud-upload-outline" size={40} color={colors.textTertiary} />
                    <Text style={[styles.uploadText, { color: colors.textSecondary }]}>Tap to Upload Receipt</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!screenshot || uploading}
                onPress={handleUpload}
                style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: (!screenshot || uploading) ? 0.6 : 1 }]}
              >
                {uploading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Submit Proof</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View style={styles.successContainer}>
              <View style={[styles.successIcon, { backgroundColor: `${colors.success || '#4CAF50'}20` }]}>
                <Ionicons name="checkmark-circle" size={60} color={colors.success || '#4CAF50'} />
              </View>
              <Text style={[styles.successTitle, { color: colors.text }]}>Proof Submitted!</Text>
              <Text style={[styles.successDesc, { color: colors.textSecondary }]}>
                We received your payment receipt. Verification usually takes 1-2 hours. You'll be notified immediately.
              </Text>
              
              <TouchableOpacity onPress={handleFinish} style={[styles.finishBtn, { backgroundColor: colors.text }]}>
                <Text style={[styles.finishBtnText, { color: colors.background }]}>
                  {callbackUrl ? 'Continue Learning' : 'Back to Profile'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
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
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  stepContainer: {
    gap: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: FontSize.md,
    lineHeight: 22,
    marginTop: -8,
  },
  methodsGrid: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.md,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodName: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  instructionCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    gap: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  methodBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  methodBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
  },
  accountBox: {
    gap: 4,
  },
  accountLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  accountValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  nameLabel: {
    fontSize: FontSize.sm,
    marginTop: 4,
  },
  warningBox: {
    flexDirection: 'row',
    gap: 8,
    opacity: 0.8,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    fontStyle: 'italic',
  },
  uploadBox: {
    height: 200,
    borderRadius: BorderRadius.xxl,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  submitBtn: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: Spacing.lg,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
  },
  successDesc: {
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  finishBtn: {
    width: '100%',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  finishBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
