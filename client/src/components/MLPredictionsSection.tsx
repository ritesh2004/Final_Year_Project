import { useMLPredictions } from '../hooks/useMLPredictions';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Brain, Thermometer, Droplets, RefreshCw, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from './ui/button';

export function MLPredictionsSection() {
  const { temperature, rainfall, predictionDate, isLoading, error, refetch } = useMLPredictions();

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between text-blue-900">
        <div className="flex items-center gap-2">
          <Brain className="size-6" />
          <h2 className="text-xl font-medium">AI / ML Predictions</h2>
        </div>
        <div className="flex items-center gap-4">
          {predictionDate && (
            <span className="text-sm text-gray-500 bg-white/50 px-3 py-1 rounded-full border border-blue-100 backdrop-blur-sm shadow-sm">
              Date: {predictionDate}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={isLoading}
            className="gap-2 bg-white/50 backdrop-blur-sm border-blue-200 hover:bg-blue-50 text-blue-700"
          >
            <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="flex flex-col items-center justify-center py-8 text-red-600 gap-4">
            <AlertCircle className="size-8" />
            <p>{error}</p>
            <Button variant="outline" onClick={refetch}>Try Again</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Temperature Prediction Card */}
          <Card className="overflow-hidden border-orange-100 hover:shadow-lg transition-all hover:-translate-y-0.5 duration-300">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Thermometer className="size-32 rotate-12 transform" />
              </div>

              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-white/90 text-sm font-medium tracking-wide uppercase flex items-center gap-2">
                  <Thermometer className="size-4" />
                  Temperature Forecast
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {isLoading || !temperature ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-16 bg-white/20 rounded-xl w-1/2"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-white/20 rounded-xl"></div>
                      <div className="h-20 bg-white/20 rounded-xl"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between h-full">

                    <div className='ml-6 p-4'>
                      <p className="text-white/80 text-sm">
                        Expected Temperature
                      </p>

                      <div className="flex items-end mt-2">
                        <span className="text-6xl font-bold leading-none">
                          {temperature.temp_median}°C
                        </span>

                        {/* <span className="text-2xl ml-1 mb-1">
                          °C
                        </span> */}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">

                      <div className="rounded-2xl bg-white/15 backdrop-blur-sm p-4 border border-white/20">
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <ArrowDown className="w-4 h-4" />
                          Minimum
                        </div>

                        <div className="text-2xl font-semibold mt-2">
                          {temperature.temp_min}°C
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white/15 backdrop-blur-sm p-4 border border-white/20">
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <ArrowUp className="w-4 h-4" />
                          Maximum
                        </div>

                        <div className="text-2xl font-semibold mt-2">
                          {temperature.temp_max}°C
                        </div>
                      </div>

                    </div>

                  </div>
                )}
              </CardContent>
            </div>
          </Card>

          {/* Rainfall Prediction Card */}
          <Card className="overflow-hidden border-indigo-100 hover:shadow-lg transition-all hover:-translate-y-0.5 duration-300">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 text-white h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Droplets className="size-32 -rotate-12 transform" />
              </div>

              <CardHeader className="mb-6">
                <CardTitle className="text-white/90 text-sm font-medium tracking-wide uppercase flex items-center gap-2">
                  <Droplets className="size-4" />
                  Rainfall Probability
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {isLoading || !rainfall ? (
                  <div className="animate-pulse flex justify-center py-8">
                    <div className="w-32 h-32 rounded-full border-4 border-white/20"></div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">

                    <div className="relative w-36 h-36">

                      <svg
                        className="absolute inset-0 -rotate-90"
                        width="144"
                        height="144"
                      >
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          fill="none"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="10"
                        />

                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          fill="none"
                          stroke="white"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={377}
                          strokeDashoffset={
                            377 - (377 * rainfall.rain_probability) / 100
                          }
                          className="transition-all duration-1000"
                        />
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold">
                          {rainfall.rain_probability}%
                        </span>
                      </div>

                    </div>

                    <div className="mt-6 text-center">

                      <div className="text-white/70 text-sm">
                        Weather Status
                      </div>

                      <div className="mt-2 inline-flex rounded-full bg-white/20 px-5 py-5 font-semibold">
                        {rainfall.weather_class}
                      </div>

                    </div>

                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
