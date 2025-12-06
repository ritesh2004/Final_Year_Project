import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import db from './db/index';
import client from './utils/mqtt-server';
import { sensorDataTable } from './db/schema';
import { storeSensorData } from './utils/store-data';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000');

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Initialize MQTT client
client.on('connect', () => {
    console.log('MQTT Client connected');
});

client.on('error', (error) => {
    console.log('MQTT Error:', error);
});

client.on('message', async (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);
    // Here you can parse the message and store it in the database using `db`
    // Example: await db.insert(sensorDataTable).values({ ...parsedData });
    await storeSensorData({ topic, message: message.toString() });
});

// Subscribe to some sensor data topics
client.subscribe('sensor/data');

// Start the server

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});