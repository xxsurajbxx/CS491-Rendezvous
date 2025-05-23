import express from "express";
import { createEvent } from "./createEventsEndpoint";
import { getUserEventData } from "./getUserEventDataEndpoint";
import { searchEvents } from "./searchEventsEndpoint";
import { getFullEventData } from "./getFullEventData";
import { scrapeTicketmasterEvents } from "./fetchTicketmasterEvents";
import { deleteEvent } from "./deleteEvent";
import { getRecommendedEvents } from "./getRecommendedEvents";


const router = express.Router();
// POST /api/events
router.post("/", async (req, res) => {
    await createEvent(req, res); 
});

// GET /api/events/user-events
router.get("/user-events/:userId", async (req, res) => {
    await getUserEventData(req, res);
});

// event searching
router.post("/search", async (req, res) => {
    await searchEvents(req, res);
  });

// full event data
router.get("/full/:eventId/:userId", async (req, res) => {
    await getFullEventData(req, res);
  });

  // admin scrape Ticketmaster events
router.post("/scrape-ticketmaster", async (req, res) => {
  await scrapeTicketmasterEvents(req, res);
});

  // delete event
router.delete("/:eventId/:userId", async (req, res) => {
  await deleteEvent(req, res);
});

// recommended events sorting
router.get("/recommended/:userId", async (req, res) => {
  await getRecommendedEvents(req, res);
});
  
export default router;