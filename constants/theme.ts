// Design System - Finance App
export const lightColors = {
  // Paleta Principal
  cyan: '#1AEDE7',
  royalBlue: '#1A6DED',
  skyBlue: '#1AB0ED',
  mintGreen: '#58F4BB',
  lightCyan: '#1ACBED',
  softBlue: '#69C7ED',
  
  // Semântica
  primary: '#1A6DED',
  secondary: '#1AEDE7',
  success: '#58F4BB',
  warning: '#FFA726',
  danger: '#EF5350',
  blue: '#1A6DED',
  
  // Backgrounds
  background: '#F8FAFB',
  surface: '#FFFFFF',
  surfaceLight: '#F5F9FC',
  surfaceElevated: '#FFFFFF',
  
  // Text
  textPrimary: '#1A1F36',
  textSecondary: '#697386',
  textSubtle: '#9DA8B6',
  textWhite: '#FFFFFF',
  
  // Borders
  border: '#E3E8EE',
  borderLight: '#F0F4F8',
  
  // Gradients
  gradientBlue: ['#1A6DED', '#1AEDE7'],
  gradientCyan: ['#1AEDE7', '#58F4BB'],
  gradientSky: ['#69C7ED', '#1ACBED'],
  gradientIncome: ['#58F4BB', '#1AEDE7'],
  gradientExpense: ['#1A6DED', '#69C7ED'],
};

export const darkColors = {
  // Paleta Principal (mantém as mesmas cores vibrantes)
  cyan: '#1AEDE7',
  royalBlue: '#1A6DED',
  skyBlue: '#1AB0ED',
  mintGreen: '#58F4BB',
  lightCyan: '#1ACBED',
  softBlue: '#69C7ED',
  
  // Semântica
  primary: '#1A6DED',
  secondary: '#1AEDE7',
  success: '#58F4BB',
  warning: '#FFA726',
  danger: '#EF5350',
  blue: '#1A6DED',
  
  // Backgrounds - Dark Mode
  background: '#0A0E1A',
  surface: '#141B2E',
  surfaceLight: '#1E2742',
  surfaceElevated: '#232D47',
  
  // Text - Dark Mode
  textPrimary: '#FFFFFF',
  textSecondary: '#B4BFCD',
  textSubtle: '#8592A6',
  textWhite: '#FFFFFF',
  
  // Borders - Dark Mode
  border: '#2A3550',
  borderLight: '#1E2742',
  
  // Gradients (mantém os mesmos)
  gradientBlue: ['#1A6DED', '#1AEDE7'],
  gradientCyan: ['#1AEDE7', '#58F4BB'],
  gradientSky: ['#69C7ED', '#1ACBED'],
  gradientIncome: ['#58F4BB', '#1AEDE7'],
  gradientExpense: ['#1A6DED', '#69C7ED'],
};

// Cores padrão (light mode) para compatibilidade
export const colors = lightColors;

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  captionMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};
