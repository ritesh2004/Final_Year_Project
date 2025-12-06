import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const generateData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${i}:00`,
      speed: 8 + Math.random() * 8,
      gusts: 12 + Math.random() * 10
    });
  }
  return data;
};

export function WindSpeedChart() {
  const data = generateData();

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
