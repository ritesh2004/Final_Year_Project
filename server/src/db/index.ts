import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from 'mysql2/promise';

const pool : any = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    connectionLimit: 5
})

const db = drizzle({
    client: pool
});

export default db;