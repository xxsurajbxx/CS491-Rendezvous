import express from "express";
import dotenv from "dotenv";
import authRoutes from "./authRoutes";
import eventRoutes from "./eventRoutes";
import { pool } from "./db"; // ensure pool creation is handled in ./db
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend requests
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// middleware
app.use(express.json());

// function to test the database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL successfully");
    connection.release();
  } catch (error) {
    console.log(error);
    /*
    console.error(
      "Database connection failed:",
      error instanceof Error ? error.message : error
    );
    */
    process.exit(1);
  }
};

testConnection();

// routes
app.use("/api", authRoutes);
app.use("/api/events", eventRoutes);

// root route to check if server is running
app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
