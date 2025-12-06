import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", radiation: 820 },
  { day: "Tue", radiation: 890 },
  { day: "Wed", radiation: 760 },
  { day: "Thu", radiation: 910 },
  { day: "Fri", radiation: 850 },
  { day: "Sat", radiation: 880 },
  { day: "Sun", radiation: 900 }
];

export function SolarRadiationChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="radiation" fill="#eab308" name="Solar Radiation (W/m²)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
