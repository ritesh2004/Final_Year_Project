import db from "../db/index";
import { Request, Response } from "express";
import { sensorDataTable } from "../db/schema";
import { desc, and, gte, lte } from "drizzle-orm";

const fetchSensorData = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.params.limit as string) || 100;
        const { from, to } = req.params as { from?: string; to?: string };

        if (limit > 1000) {
            return res.status(400).json({ message: "Limit cannot be greater than 1000" });
        }

        let query;

        if (from && to) {
            query = db.select().from(sensorDataTable).orderBy(desc(sensorDataTable.timestamp)).limit(limit).where(and(gte(sensorDataTable.timestamp, new Date(from)), lte(sensorDataTable.timestamp, new Date(to))));
        }
        else if (from) {
            query = db.select().from(sensorDataTable).orderBy(desc(sensorDataTable.timestamp)).limit(limit).where(gte(sensorDataTable.timestamp, new Date(from)));
        }
        else if (to) {
            query = db.select().from(sensorDataTable).orderBy(desc(sensorDataTable.timestamp)).limit(limit).where(lte(sensorDataTable.timestamp, new Date(to)));
        }
        else {
            query = db.select()
                .from(sensorDataTable)
                .orderBy(desc(sensorDataTable.timestamp))
                .limit(limit);
        }

        const sensorData = await query!;
        res.status(200).json(sensorData);
    } catch (error) {
        console.error("Error fetching sensor data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export {
    fetchSensorData
}