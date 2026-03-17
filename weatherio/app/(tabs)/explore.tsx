import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NotificationCard } from '@/components/NotificationCard';
import { Colors, WeatherGradients, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface NotificationItem {
  id: string;
  type: 'alert' | 'warning' | 'info';
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  message: string;
  time: string;
  gradientColors: readonly [string, string];
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const notifications: NotificationItem[] = [
    {
      id: '1',
      type: 'alert',
      iconName: 'warning-outline',
      title: 'Heat Warning',
      message: 'High temperatures expected tomorrow. Stay hydrated!',
      time: '1 hour ago',
      gradientColors: WeatherGradients.temperature,
    },
    {
      id: '2',
      type: 'warning',
      iconName: 'rainy-outline',
      title: 'Rain Alert',
      message: 'Light precipitation expected this evening around 6 PM.',
      time: '3 hours ago',
      gradientColors: WeatherGradients.humidity,
    },
    {
      id: '3',
      type: 'info',
      iconName: 'flag-outline',
      title: 'Wind Advisory',
      message: 'Strong winds up to 25 mph expected this afternoon.',
      time: '5 hours ago',
      gradientColors: WeatherGradients.windSpeed,
    },
    {
      id: '4',
      type: 'info',
      iconName: 'sunny-outline',
      title: 'UV Index High',
      message: 'UV index will reach 9 today. Wear sunscreen!',
      time: 'Yesterday',
      gradientColors: WeatherGradients.solarRadiation,
    },
    {
      id: '5',
      type: 'info',
      iconName: 'thermometer-outline',
      title: 'Temperature Drop',
      message: 'Expect a 10°C temperature drop over the weekend.',
      time: '2 days ago',
      gradientColors: WeatherGradients.prediction,
    },
  ];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: Spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.headerSection, { paddingTop: insets.top + Spacing.lg }]}>
        <View style={styles.headerRow}>
          <LinearGradient
            colors={[
              colors.headerGradientStart,
              colors.headerGradientEnd,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerIcon}
          >
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </LinearGradient>
          <View>
            <Text style={[styles.headerTitle, { color: colors.cardText }]}>
              Notifications
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.subtitle }]}>
              Stay updated with weather alerts
            </Text>
          </View>
        </View>
      </View>

      {/* Notifications List */}
      <View style={styles.listSection}>
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            iconName={notification.iconName}
            title={notification.title}
            message={notification.message}
            time={notification.time}
            gradientColors={notification.gradientColors}
          />
        ))}
      </View>

      {/* Empty State */}
      {notifications.length === 0 && (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
            <Ionicons name="notifications-off-outline" size={40} color={colors.subtitle} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.cardText }]}>
            No Notifications
          </Text>
          <Text style={[styles.emptyMessage, { color: colors.subtitle }]}>
            You're all caught up!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  listSection: {
    paddingHorizontal: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl + Spacing.md,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  emptyMessage: {
    fontSize: 14,
  },
});
