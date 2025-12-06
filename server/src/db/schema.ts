import { float, int, mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core';

export const sensorDataTable = mysqlTable('sensor_data', {
    id: serial('id').primaryKey(),
    temperature: float('temperature').default(0),
    humidity: float('humidity').default(0),
    windspeed: float('wind_speed').default(0),
    atmosphericPressure: float('atmospheric_pressure').default(0),
    radiation: float('radiation').default(0),
    timestamp: timestamp('timestamp').defaultNow(),
});
