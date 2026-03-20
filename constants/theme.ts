export const Colors = {
  primary: '#000000',
  primaryLight: '#262626',
  primaryDark: '#000000',
  secondary: '#FFFFFF',
  accent: '#000000',
  success: '#4ADE80',
  warning: '#F59E0B',
  error: '#EF4444',

  background: '#000000',
  surface: '#111111',
  surfaceAlt: '#1A1A1A',
  card: '#111111',

  text: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textTertiary: '#71717A',
  textInverse: '#000000',

  border: 'rgba(255,255,255,0.1)',
  borderLight: 'rgba(255,255,255,0.05)',
  divider: 'rgba(255,255,255,0.1)',

  sent: '#FFFFFF',
  received: '#262626',

  overlay: 'rgba(0,0,0,0.7)',
  shadow: 'rgba(0,0,0,0.3)',
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
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
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
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
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
