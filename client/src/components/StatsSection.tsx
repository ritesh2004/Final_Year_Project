import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TemperatureChart } from "./charts/TemperatureChart";
import { HumidityChart } from "./charts/HumidityChart";
import { SolarRadiationChart } from "./charts/SolarRadiationChart";
import { WindSpeedChart } from "./charts/WindSpeedChart";
import { RainfallChart } from "./charts/RainfallChart";
import { PressureChart } from "./charts/PressureChart";
import { BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react";

export function StatsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-blue-900">
        <TrendingUp className="size-6" />
        <h2>Statistical Analysis</h2>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">
            <BarChart3 className="size-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="temperature">
            <LineChart className="size-4 mr-2" />
            Temperature
          </TabsTrigger>
          <TabsTrigger value="environmental">
            <PieChart className="size-4 mr-2" />
            Environmental
          </TabsTrigger>
          <TabsTrigger value="wind-rain">
            <TrendingUp className="size-4 mr-2" />
            Wind & Rain
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Temperature Trends (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <TemperatureChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Humidity Levels (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <HumidityChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="temperature" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Temperature Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <TemperatureChart detailed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environmental" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Solar Radiation (7 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <SolarRadiationChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Atmospheric Pressure (7 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <PressureChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wind-rain" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Wind Speed Variations</CardTitle>
              </CardHeader>
              <CardContent>
                <WindSpeedChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Rainfall Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <RainfallChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
