/**
 * Theme constants for the weather app.
 * Colors, gradients, fonts, and spacing - matching weather_web design.
 */

import { Platform } from 'react-native';

const tintColorLight = '#3B82F6'; // blue-500
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F0F4FF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    cardText: '#1F2937',
    subtitle: '#6B7280',
    headerGradientStart: '#3B82F6',
    headerGradientEnd: '#7C3AED',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#1E1E1E',
    cardText: '#F9FAFB',
    subtitle: '#9CA3AF',
    headerGradientStart: '#1E3A8A',
    headerGradientEnd: '#581C87',
  },
};

/** Gradient color pairs for weather metric cards (matching weather_web) */
export const WeatherGradients = {
  temperature: ['#FB923C', '#EF4444'] as const,   // orange-400 → red-500
  humidity: ['#60A5FA', '#06B6D4'] as const,       // blue-400 → cyan-500
  windSpeed: ['#2DD4BF', '#22C55E'] as const,      // teal-400 → green-500
  cloudCoverage: ['#9CA3AF', '#64748B'] as const,  // gray-400 → slate-500
  solarRadiation: ['#FACC15', '#F59E0B'] as const, // yellow-400 → amber-500
  precipitation: ['#818CF8', '#3B82F6'] as const,  // indigo-400 → blue-500
  prediction: ['#C084FC', '#EC4899'] as const,     // purple-400 → pink-500
  notification: ['#3B82F6', '#7C3AED'] as const,   // blue-500 → purple-600
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};
