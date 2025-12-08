import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { type SensorData, useSocketData } from "../../hooks/useSocketData";
import { useMemo } from "react";

export function RainfallChart() {
  const { historicalData } = useSocketData();

  const data = useMemo(() => {
    return historicalData.map((item: SensorData) => {
      const date = new Date(item.timestamp);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      return {
        day: dayOfWeek,
        rainfall: 0 // Rainfall data not in sensor schema, keeping placeholder
      };
    });
  }, [historicalData]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="rainfall" fill="#6366f1" name="Rainfall (mm)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
