import { useState, useEffect, useCallback } from 'react';

export interface TemperaturePrediction {
  temp_max: number;
  temp_median: number;
  temp_min: number;
}

export interface RainfallPrediction {
  rain_probability: number;
  weather_class: string;
}

export interface MLPredictionState {
  temperature: TemperaturePrediction | null;
  rainfall: RainfallPrediction | null;
  predictionDate: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useMLPredictions() {
  const [state, setState] = useState<MLPredictionState>({
    temperature: null,
    rainfall: null,
    predictionDate: null,
    isLoading: true,
    error: null,
  });

  const fetchPredictions = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const [tempRes, rainRes] = await Promise.all([
        fetch('https://weather-ml-api-1.onrender.com/predict_temperature'),
        fetch('https://weather-ml-api-1.onrender.com/predict_rainfall')
      ]);

      if (!tempRes.ok || !rainRes.ok) {
        throw new Error('Failed to fetch predictions');
      }

      const tempData = await tempRes.json();
      const rainData = await rainRes.json();

      setState({
        temperature: tempData.prediction,
        rainfall: rainData.prediction,
        predictionDate: tempData.prediction_date, 
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'An unknown error occurred'
      }));
    }
  }, []);

  useEffect(() => {
    fetchPredictions();

    // Auto-refresh every 10 minutes (600000 ms)
    const intervalId = setInterval(fetchPredictions, 600000);

    return () => clearInterval(intervalId);
  }, [fetchPredictions]);

  return { ...state, refetch: fetchPredictions };
}
