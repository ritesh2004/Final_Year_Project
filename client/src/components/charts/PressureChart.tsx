import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { type SensorData, useSocketData } from "../../hooks/useSocketData";
import { useMemo } from "react";

export function PressureChart() {
  const { historicalData } = useSocketData();

  const data = useMemo(() => {
    return historicalData.map((item: SensorData) => {
      const date = new Date(item.timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      
      return {
        time: `${hours}:${minutes.toString().padStart(2, '0')}`,
        pressure: parseFloat(item.atmosphericPressure.toFixed(2))
      };
    });
  }, [historicalData]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={[1008, 1020]} />
        <Tooltip />
        <Line type="monotone" dataKey="pressure" stroke="#8b5cf6" strokeWidth={2} name="Pressure (hPa)" />
      </LineChart>
    </ResponsiveContainer>
  );
}
