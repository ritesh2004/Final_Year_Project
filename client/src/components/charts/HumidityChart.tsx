import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { type SensorData, useSocketData } from "../../hooks/useSocketData";
import { useMemo } from "react";

export function HumidityChart() {
  const { historicalData } = useSocketData();

  const data = useMemo(() => {
    return historicalData.map((item: SensorData) => {
      const date = new Date(item.timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      
      return {
        time: `${hours}:${minutes.toString().padStart(2, '0')}`,
        humidity: parseFloat(item.humidity.toFixed(2))
      };
    });
  }, [historicalData]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fill="#60a5fa" fillOpacity={0.6} name="Humidity (%)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
