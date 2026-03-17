import { WeatherMetricCard } from "./WeatherMetricCard";
import { Thermometer, Droplets, Sun, Gauge, Wind, CloudRain } from "lucide-react";
import { useSocketData } from "../hooks/useSocketData";

export function WeatherOverview() {
  const { currentData } = useSocketData();

  const weatherData = {
    temperature: currentData?.temperature ?? 0,
    humidity: currentData?.humidity ?? 0,
    solarRadiation: currentData?.radiation ?? 0,
    pressure: currentData?.atmosphericPressure ?? 0,
    windSpeed: currentData?.windspeed ?? 0,
    rainfall: currentData?.rainfall ?? 0
  };

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
        unit="Lux"
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
