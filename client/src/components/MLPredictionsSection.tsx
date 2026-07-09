import { useMLPredictions } from '../hooks/useMLPredictions';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Brain, Thermometer, Droplets, RefreshCw, AlertCircle, ArrowUp, ArrowDown, Activity } from 'lucide-react';
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
                    <div className="h-12 bg-white/20 rounded w-1/2"></div>
                    <div className="h-4 bg-white/20 rounded w-3/4"></div>
                  </div>
                ) : (
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-end border-b border-white/20 pb-4">
                      <div>
                        <div className="text-white/80 text-sm mb-1 flex items-center gap-1"><Activity className="size-3"/> Median Expected</div>
                        <div className="text-4xl font-bold flex items-baseline gap-1">
                          {temperature.temp_median}
                          <span className="text-xl text-white/80 font-normal">°C</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                        <div className="text-white/80 text-xs mb-1 flex items-center gap-1"><ArrowDown className="size-3 text-blue-200"/> Minimum</div>
                        <div className="text-xl font-semibold flex items-baseline gap-1">
                          {temperature.temp_min}<span className="text-sm font-normal opacity-80">°C</span>
                        </div>
                      </div>
                      <div className="bg-black/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                        <div className="text-white/80 text-xs mb-1 flex items-center gap-1"><ArrowUp className="size-3 text-orange-200"/> Maximum</div>
                        <div className="text-xl font-semibold flex items-baseline gap-1">
                          {temperature.temp_max}<span className="text-sm font-normal opacity-80">°C</span>
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
              
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-white/90 text-sm font-medium tracking-wide uppercase flex items-center gap-2">
                  <Droplets className="size-4" />
                  Rainfall Probability
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 flex items-center justify-between h-[calc(100%-3rem)]">
                {isLoading || !rainfall ? (
                   <div className="animate-pulse flex items-center justify-between w-full">
                     <div className="size-28 rounded-full border-4 border-white/20"></div>
                     <div className="h-8 bg-white/20 rounded w-1/3"></div>
                   </div>
                ) : (
                  <>
                    <div className="relative flex items-center justify-center size-32 z-10">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-white/20" />
                        <circle 
                          cx="64" 
                          cy="64" 
                          r="56" 
                          fill="transparent" 
                          stroke="currentColor" 
                          strokeWidth="8" 
                          strokeDasharray={`${2 * Math.PI * 56}`} 
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - rainfall.rain_probability / 100)}`} 
                          className="text-white drop-shadow-md transition-all duration-1000 ease-out" 
                        />
                      </svg>
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold tracking-tighter">{Math.round(rainfall.rain_probability)}%</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end z-10">
                      <div className="text-white/80 text-sm mb-2 text-right">Weather Status</div>
                      <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full font-medium shadow-sm">
                        {rainfall.weather_class}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
