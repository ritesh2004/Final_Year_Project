import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface SensorData {
  id: number;
  temperature: number;
  humidity: number;
  windspeed: number;
  atmosphericPressure: number;
  radiation: number;
  rainfall: number;
  timestamp: string;
}

interface UseSocketDataReturn {
  currentData: Partial<SensorData> | null;
  historicalData: SensorData[];
  isConnected: boolean;
  isLoading: boolean;
}

/**
 * Hook to connect to the weather sensor server via WebSocket (socket.io).
 * Adapted from client/src/hooks/useSocketData.ts for React Native.
 *
 * @param serverUrl - WebSocket server URL (default: http://localhost:8080).
 *   On a physical device, use your machine's LAN IP instead.
 */
export const useSocketData = (
  serverUrl: string = 'https://finalyr.ritesh-pramanik.me',
): UseSocketDataReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [currentData, setCurrentData] = useState<Partial<SensorData> | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(serverUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      // Request historical data (last 100 records)
      socket.emit('get-historical-data', { limit: 100 });
      setIsLoading(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Receive historical data
    socket.on('sensorData', (data: SensorData[]) => {
      console.log('Received historical data:', data.length, 'records');
      // Sort by timestamp ascending (oldest first)
      const sortedData = [...data].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
      setHistoricalData(sortedData);
      setIsLoading(false);
    });

    // Receive real-time sensor data
    socket.on('new-sensor-data', (data: any) => {
      console.log('Received new sensor data:', data);

      try {
        // Parse the message if it's a JSON string
        const parsedData =
          typeof data.message === 'string' ? JSON.parse(data.message) : data.message;

        const newSensorData: SensorData = {
          id: Date.now(),
          temperature: parseFloat(parsedData.temperature) || 0,
          humidity: parseFloat(parsedData.humidity) || 0,
          windspeed: parseFloat(parsedData.windspeed) || 0,
          atmosphericPressure: parseFloat(parsedData.atmosphericPressure) || 0,
          radiation: parseFloat(parsedData.radiation) || 0,
          rainfall: parseFloat(parsedData.rainfall) || 0,
          timestamp: new Date().toISOString(),
        };

        // Update current data
        setCurrentData(newSensorData);

        // Add to historical data array
        setHistoricalData((prev) => [...prev, newSensorData]);
      } catch (error) {
        console.log('Error parsing sensor data:', error);
      }
    });

    socket.on('connect_error', (error) => {
      console.log('Connection error:', error);
      setIsLoading(false);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [serverUrl]);

  return {
    currentData,
    historicalData,
    isConnected,
    isLoading,
  };
};
