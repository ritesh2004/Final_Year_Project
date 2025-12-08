import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { type SensorData, useSocketData } from "../../hooks/useSocketData";
import { useMemo } from "react";

interface TemperatureChartProps {
  detailed?: boolean;
}

export function TemperatureChart({ detailed = false }: TemperatureChartProps) {
  const { historicalData } = useSocketData();

  // Transform historical data for chart
  const data = useMemo(() => {
    return historicalData.map((item: SensorData, index: number) => {
      const date = new Date(item.timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      
      return {
        time: `${hours}:${minutes.toString().padStart(2, '0')}`,
        temperature: parseFloat(item.temperature.toFixed(2)),
        feels_like: parseFloat((item.temperature - 1).toFixed(2)), // Simplified estimation
        timestamp: item.timestamp
      };
    });
  }, [historicalData]);

  if (detailed) {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="temperature" stroke="#f97316" fill="#fb923c" fillOpacity={0.6} name="Temperature (°C)" />
          <Area type="monotone" dataKey="feels_like" stroke="#ea580c" fill="#fdba74" fillOpacity={0.3} name="Feels Like (°C)" />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} name="Temperature (°C)" />
      </LineChart>
    </ResponsiveContainer>
  );
}
