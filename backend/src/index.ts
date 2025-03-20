import express from "express";
import dotenv from "dotenv";
import authRoutes from "./authRoutes";
import { pool } from "./db"; // ensure pool creation is handled in ./db

dotenv.config({ path: __dirname + "/../../.env" });

const app = express();
const PORT = 5000;

// middleware
app.use(express.json());

// function to test the database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL successfully");
    connection.release();
  } catch (error) {
    console.error(
      "Database connection failed:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
};

testConnection();

// routes
app.use("/api", authRoutes);

// root route to check if server is running
app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
