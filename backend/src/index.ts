import express from "express";
import dotenv from "dotenv";
import authRoutes from "./authRoutes";
import eventRoutes from "./eventRoutes";
import friendRoutes from "./friendRoutes";
import rsvpRoutes from "./rsvpRoutes";
import carpoolRoutes from "./carpoolRoutes";
import userDataRoutes from "./userDataRoutes";
import emailRoutes from "./emailRoutes";
import transportRoutes from "./transportRoutes"
import { pool } from "./db"; // ensure pool creation is handled in ./db
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
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
app.use("/api/friends", friendRoutes);
app.use("/api/rsvp", rsvpRoutes);
app.use("/api/carpool", carpoolRoutes);
app.use("/api", userDataRoutes);
app.use("/api/verify", emailRoutes);
app.use("/api/transport", transportRoutes);

// root route to check if server is running
app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
