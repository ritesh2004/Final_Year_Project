import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface WeatherCardProps {
  iconName: IoniconsName;
  label: string;
  value: number | string;
  unit: string;
  gradientColors: readonly [string, string];
  subtitle?: string;
}

export function WeatherCard({
  iconName,
  label,
  value,
  unit,
  gradientColors,
  subtitle,
}: WeatherCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <LinearGradient
        colors={[gradientColors[0], gradientColors[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconContainer}
      >
        <Ionicons name={iconName} size={24} color="#FFFFFF" />
      </LinearGradient>

      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: colors.subtitle }]}>{label}</Text>
        <View style={styles.valueRow}>
          <Text style={[styles.value, { color: colors.cardText }]}>
            {typeof value === 'number' ? value.toFixed(1) : value}
          </Text>
          <Text style={[styles.unit, { color: colors.subtitle }]}>{unit}</Text>
        </View>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.subtitle }]}>{subtitle}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.md + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm + 4,
  },
  textContainer: {
    gap: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '600',
  },
  unit: {
    fontSize: 14,
  },
  subtitle: {
    fontSize: 12,
  },
});
