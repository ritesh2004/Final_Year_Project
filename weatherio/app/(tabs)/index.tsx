import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WeatherCard } from '@/components/WeatherCard';
import { useSocketData } from '@/hooks/useSocketData';
import { Colors, WeatherGradients, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { currentData, isConnected, isLoading } = useSocketData();

  const weatherData = {
    temperature: currentData?.temperature ?? 0,
    humidity: currentData?.humidity ?? 0,
    windSpeed: currentData?.windspeed ?? 0,
    atmosphericPressure: currentData?.atmosphericPressure ?? 0,
    solarRadiation: currentData?.radiation ?? 0,
    rainfall: currentData?.rainfall ?? 0, 
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: Spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.headerGradientStart, colors.headerGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}
      >
        {/* Location Row */}
        <View style={styles.locationRow}>
          <View style={styles.locationLeft}>
            <Ionicons name="location-outline" size={18} color="#FFFFFFDD" />
            <Text style={styles.locationText}>Weather Station</Text>
          </View>
          <View style={styles.statusBadge}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isConnected ? '#22C55E' : '#EF4444' },
              ]}
            />
            <Text style={styles.statusText}>
              {isConnected ? 'Live' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Temperature Display */}
        <View style={styles.temperatureContainer}>
          <View style={styles.tempRow}>
            <Text style={styles.tempValue}>
              {weatherData.temperature.toFixed(1)}
            </Text>
            <Text style={styles.tempUnit}>°C</Text>
          </View>
          <View style={styles.trendRow}>
            <Ionicons name="trending-up" size={16} color="#FFFFFFCC" />
            <Text style={styles.trendText}>
              {isLoading ? 'Connecting...' : 'Real-time data'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Weather Stats Grid */}
      <View style={styles.cardsSection}>
        <View style={styles.cardsGrid}>
          <View style={styles.cardWrapper}>
            <WeatherCard
              iconName="thermometer-outline"
              label="Temperature"
              value={weatherData.temperature}
              unit="°C"
              gradientColors={WeatherGradients.temperature}
            />
          </View>
          <View style={styles.cardWrapper}>
            <WeatherCard
              iconName="water-outline"
              label="Humidity"
              value={weatherData.humidity}
              unit="%"
              gradientColors={WeatherGradients.humidity}
            />
          </View>
          <View style={styles.cardWrapper}>
            <WeatherCard
              iconName="speedometer-outline"
              label="Wind Speed"
              value={weatherData.windSpeed}
              unit="km/h"
              gradientColors={WeatherGradients.windSpeed}
            />
          </View>
          <View style={styles.cardWrapper}>
            <WeatherCard
              iconName="scale-outline"
              label="Pressure"
              value={weatherData.atmosphericPressure}
              unit="hPa"
              gradientColors={WeatherGradients.cloudCoverage}
            />
          </View>
          <View style={styles.cardWrapper}>
            <WeatherCard
              iconName="sunny-outline"
              label="Solar Radiation"
              value={weatherData.solarRadiation}
              unit="Lumens"
              gradientColors={WeatherGradients.solarRadiation}
            />
          </View>
          <View style={styles.cardWrapper}>
            <WeatherCard
              iconName="rainy-outline"
              label="Precipitation"
              value={weatherData.rainfall}
              unit="mm"
              gradientColors={WeatherGradients.precipitation}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl + Spacing.md,
    borderBottomLeftRadius: BorderRadius.xxl + 8,
    borderBottomRightRadius: BorderRadius.xxl + 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#FFFFFFDD',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.lg,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFFCC',
    fontWeight: '500',
  },
  temperatureContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginBottom: Spacing.sm,
  },
  tempValue: {
    fontSize: 72,
    fontWeight: '200',
    color: '#FFFFFF',
  },
  tempUnit: {
    fontSize: 28,
    fontWeight: '200',
    color: '#FFFFFF',
    marginTop: 8,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendText: {
    fontSize: 14,
    color: '#FFFFFFCC',
  },
  cardsSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: -Spacing.lg,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  cardWrapper: {
    width: '47%',
    flexGrow: 1,
  },
});
