import express from "express";
import { getUserData } from "./getUserData";
import { getUserHostedEventData } from "./getUserHostedEvents";
import { getUserEventAttendees } from "./getUserHostedEventsAttendees";

const router = express.Router();
// user data
router.get("/user/:userId/viewer/:viewerId/data", getUserData);

// hosted events
router.get("/user/:userId/events", async (req, res) => {
    req.query.userId = req.params.userId;
    await getUserHostedEventData(req, res);
  });

// attendees for hosted events
router.get("/user/:userId/attendees", async (req, res) => {
    req.query.userId = req.params.userId;
    await getUserEventAttendees(req, res);
  });


export default router;
