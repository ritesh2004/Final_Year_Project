import { WeatherMetricCard } from "./WeatherMetricCard";
import { Thermometer, Droplets, Sun, Gauge, Wind, CloudRain } from "lucide-react";
import { useState, useEffect } from "react";

export function WeatherOverview() {
  const [weatherData, setWeatherData] = useState({
    temperature: 24.5,
    humidity: 65,
    solarRadiation: 850,
    pressure: 1013.25,
    windSpeed: 12.5,
    rainfall: 2.3
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherData(prev => ({
        temperature: +(prev.temperature + (Math.random() - 0.5) * 0.5).toFixed(1),
        humidity: Math.max(0, Math.min(100, +(prev.humidity + (Math.random() - 0.5) * 2).toFixed(0))),
        solarRadiation: Math.max(0, +(prev.solarRadiation + (Math.random() - 0.5) * 50).toFixed(0)),
        pressure: +(prev.pressure + (Math.random() - 0.5) * 0.5).toFixed(2),
        windSpeed: Math.max(0, +(prev.windSpeed + (Math.random() - 0.5) * 1).toFixed(1)),
        rainfall: Math.max(0, +(prev.rainfall + (Math.random() - 0.5) * 0.2).toFixed(1))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <WeatherMetricCard
        icon={<Thermometer className="size-6" />}
        title="Temperature"
        value={weatherData.temperature}
        unit="°C"
        color="bg-gradient-to-br from-orange-500 to-red-500"
      />
      <WeatherMetricCard
        icon={<Droplets className="size-6" />}
        title="Humidity"
        value={weatherData.humidity}
        unit="%"
        color="bg-gradient-to-br from-blue-500 to-cyan-500"
      />
      <WeatherMetricCard
        icon={<Sun className="size-6" />}
        title="Solar Radiation"
        value={weatherData.solarRadiation}
        unit="W/m²"
        color="bg-gradient-to-br from-yellow-500 to-orange-500"
      />
      <WeatherMetricCard
        icon={<Gauge className="size-6" />}
        title="Atmospheric Pressure"
        value={weatherData.pressure}
        unit="hPa"
        color="bg-gradient-to-br from-purple-500 to-indigo-500"
      />
      <WeatherMetricCard
        icon={<Wind className="size-6" />}
        title="Wind Speed"
        value={weatherData.windSpeed}
        unit="km/h"
        color="bg-gradient-to-br from-teal-500 to-green-500"
      />
      <WeatherMetricCard
        icon={<CloudRain className="size-6" />}
        title="Rainfall"
        value={weatherData.rainfall}
        unit="mm"
        color="bg-gradient-to-br from-indigo-500 to-blue-500"
      />
    </div>
  );
}
