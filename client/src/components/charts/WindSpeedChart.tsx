import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { type SensorData, useSocketData } from "../../hooks/useSocketData";
import { useMemo } from "react";

export function WindSpeedChart() {
  const { historicalData } = useSocketData();

  const data = useMemo(() => {
    return historicalData.map((item: SensorData) => {
      const date = new Date(item.timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      
      return {
        time: `${hours}:${minutes.toString().padStart(2, '0')}`,
        speed: parseFloat(item.windspeed.toFixed(2)),
        gusts: parseFloat((item.windspeed * 1.3).toFixed(2))
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
        <Area type="monotone" dataKey="speed" stroke="#14b8a6" fill="#2dd4bf" fillOpacity={0.6} name="Wind Speed (km/h)" />
        <Area type="monotone" dataKey="gusts" stroke="#0d9488" fill="#5eead4" fillOpacity={0.3} name="Gusts (km/h)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
