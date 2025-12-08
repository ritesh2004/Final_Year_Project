import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import client from './utils/mqtt-server';
import { sensorDataTable } from './db/schema';
import { storeSensorData } from './utils/store-data';
import { SocketServer } from './socket/socketServer';
import { createServer } from 'http';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000');

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('Server is healthy');
});

// Create HTTP server
const httpServer = createServer(app);
// Initialize Socket Server
const socketServer = new SocketServer(httpServer);
const io = socketServer.getIoInstance();

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

    // Optionally, emit the new data to connected Socket.io clients
    io.emit('new-sensor-data', { topic, message: message.toString() });
});

// Subscribe to some sensor data topics
client.subscribe('sensor/data');

// Start the server

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});