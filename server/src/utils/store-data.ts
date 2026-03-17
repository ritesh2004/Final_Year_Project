import { sensorDataTable } from "../db/schema";
import db from "../db/index";

export async function storeSensorData({
    topic, message
}: {
    topic: string;
    message: string;
}) {
    try {
        const data = JSON.parse(message);
        
        // Validate and sanitize the data
        const sensorData: any = {
            temperature: isValidNumber(data.temperature) ? data.temperature : null,
            humidity: isValidNumber(data.humidity) ? data.humidity : null,
            windspeed: isValidNumber(data.windspeed) ? data.windspeed : null,
            atmosphericPressure: isValidNumber(data.atmosphericPressure) ? data.atmosphericPressure : null,
            radiation: isValidNumber(data.radiation) ? data.radiation : null,
        };
        
        // Check if at least one field has valid data
        if (Object.values(sensorData).every(val => val === null)) {
            console.warn('Received sensor data with no valid numeric values:', message);
            return;
        }
        
        await db.insert(sensorDataTable).values(sensorData);
    } catch (error) {
        console.error('Error storing sensor data:', error instanceof Error ? error.message : error);
        console.error('Malformed message received:', message);
        // Don't rethrow - just log and continue
    }
}

// Helper function to validate numbers (exclude NaN, Infinity, etc.)
function isValidNumber(value: any): boolean {
    return typeof value === 'number' || typeof value === 'string' && isFinite(Number(value));
}