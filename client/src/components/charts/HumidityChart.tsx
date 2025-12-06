import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const generateData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${i}:00`,
      humidity: 60 + Math.sin(i / 4) * 15 + Math.random() * 5
    });
  }
  return data;
};

export function HumidityChart() {
  const data = generateData();

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
