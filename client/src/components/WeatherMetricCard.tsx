import { Card } from "./ui/card";
import type { ReactNode } from "react";

interface WeatherMetricCardProps {
  icon: ReactNode;
  title: string;
  value: number;
  unit: string;
  color: string;
}

export function WeatherMetricCard({ icon, title, value, unit, color }: WeatherMetricCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className={`${color} p-4 text-white`}>
        <div className="flex items-center justify-between mb-2">
          {icon}
          <span className="text-sm opacity-90">{title}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl">{value}</span>
          <span className="opacity-90">{unit}</span>
        </div>
      </div>
    </Card>
  );
}
