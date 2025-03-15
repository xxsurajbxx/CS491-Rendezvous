import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { pool } from "./db";
import eventRoutes from "./eventRoutes";

dotenv.config({ path: __dirname + "/../../.env" });

const app = express();
const PORT = 5000;

// middleware
app.use(express.json());

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to MySQL successfully");
        connection.release();
    } catch (error) {
        console.error("Database connection failed:", error instanceof Error ? error.message : error);
        process.exit(1);
    }
};

testConnection();

app.use("/api/events", eventRoutes);

app.get("/", (req, res) => {
    res.send("server is running");
});

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});