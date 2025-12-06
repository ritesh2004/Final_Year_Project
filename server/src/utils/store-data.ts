import { sensorDataTable } from "../db/schema";
import db from "../db/index";

export async function storeSensorData({
    topic, message
}: {
    topic: string;
    message: string;
}) {
    const data = JSON.parse(message);
    const sensorData: any = {
        temperature: data.temperature,
        humidity: data.humidity,
        windspeed: data.windspeed,
        atmosphericPressure: data.atmosphericPressure,
        radiation: data.radiation,
    };
    await db.insert(sensorDataTable).values(sensorData);
}