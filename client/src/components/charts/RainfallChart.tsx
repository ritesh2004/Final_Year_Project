import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", rainfall: 2.3 },
  { day: "Tue", rainfall: 0.5 },
  { day: "Wed", rainfall: 5.2 },
  { day: "Thu", rainfall: 1.8 },
  { day: "Fri", rainfall: 0.2 },
  { day: "Sat", rainfall: 3.6 },
  { day: "Sun", rainfall: 2.1 }
];

export function RainfallChart() {
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
