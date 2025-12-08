import {Server} from "socket.io";
import { Server as HttpServer } from "http";
import { sensorDataTable } from "../db/schema";
import db from "../db/index";
import { Socket } from "socket.io";
import { desc } from "drizzle-orm";

export class SocketServer {
    private io: Server;

    constructor(httpServer: HttpServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        this.io.on("connection", (socket) => {
            console.log(`New client connected: ${socket.id}`);

            socket.on("get-historical-data", this.fetchSensorData.bind(this, socket));
        });
    }

    private async fetchSensorData(socket: Socket, data: { limit: number }) {
        // Simulate fetching data from sensors
        
        const sensorData = await db.select().from(sensorDataTable).orderBy(desc(sensorDataTable.timestamp)).limit(data.limit);
        socket.emit("sensorData", sensorData);
    }

    public getIoInstance(): Server {
        return this.io;
    }
}