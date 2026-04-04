export const Colors = {
  primary: '#000000',
  primaryLight: '#1A1A1A',
  primaryDark: '#0A0A0A',
  secondary: '#FF6B6B',
  accent: '#6C63FF',
  accentLight: '#8B85FF',
  success: '#2ED573',
  warning: '#FFA502',
  error: '#FF4757',

  background: '#FFFFFF',
  backgroundAlt: '#F5F5F5',
  surface: '#EEEEEE',
  surfaceAlt: '#E5E5E5',
  darkSurface: '#141414',
  card: '#FFFFFF',

  text: '#0A0A0A',
  textSecondary: '#444444',
  textTertiary: '#888888',
  textInverse: '#FFFFFF',

  border: '#E0E0E0',
  borderDark: '#2D2D2D',
  borderLight: '#F5F5F5',
  divider: '#F0F0F5',

  sent: '#000000',
  received: '#F5F5F5',

  overlay: 'rgba(0,0,0,0.55)',
  shadow: 'rgba(0,0,0,0.06)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  gutter: 16,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  pill: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 40,
};

export const FontWeight = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
  heavy: '900' as const,
  black: '900' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
};
