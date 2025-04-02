import express from "express";
import { createEvent } from "./createEventsEndpoint";
import { getUserEventData } from "./getUserEventDataEndpoint";
import { searchEvents } from "./searchEventsEndpoint";


const router = express.Router();
// POST /api/events
router.post("/", async (req, res) => {
    await createEvent(req, res); 
});

// GET /api/events/user-events
router.get("/user-events", async (req, res) => {
    await getUserEventData(req, res);
});

// event searching
router.get("/search", async (req, res) => {
    await searchEvents(req, res);
  });
  
export default router;