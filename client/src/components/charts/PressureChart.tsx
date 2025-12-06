import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", pressure: 1013.2 },
  { day: "Tue", pressure: 1012.8 },
  { day: "Wed", pressure: 1014.1 },
  { day: "Thu", pressure: 1013.5 },
  { day: "Fri", pressure: 1012.9 },
  { day: "Sat", pressure: 1014.3 },
  { day: "Sun", pressure: 1013.7 }
];

export function PressureChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis domain={[1012, 1015]} />
        <Tooltip />
        <Line type="monotone" dataKey="pressure" stroke="#8b5cf6" strokeWidth={2} name="Pressure (hPa)" />
      </LineChart>
    </ResponsiveContainer>
  );
}
