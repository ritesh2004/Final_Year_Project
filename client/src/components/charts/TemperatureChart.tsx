import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

// Generate mock data for last 24 hours
const generateData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${i}:00`,
      temperature: 20 + Math.sin(i / 3) * 5 + Math.random() * 2,
      feels_like: 19 + Math.sin(i / 3) * 5 + Math.random() * 2
    });
  }
  return data;
};

interface TemperatureChartProps {
  detailed?: boolean;
}

export function TemperatureChart({ detailed = false }: TemperatureChartProps) {
  const data = generateData();

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
