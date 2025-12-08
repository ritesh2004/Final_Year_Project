import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { type SensorData, useSocketData } from "../../hooks/useSocketData";
import { useMemo } from "react";

export function SolarRadiationChart() {
  const { historicalData } = useSocketData();

  const data = useMemo(() => {
    return historicalData.map((item: SensorData, index: number) => {
      const date = new Date(item.timestamp);
      // const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      return {
        time: `${date}`,
        radiation: parseFloat(item.radiation.toFixed(2))
      };
    });
  }, [historicalData]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="radiation" fill="#eab308" name="Solar Radiation (W/m²)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
