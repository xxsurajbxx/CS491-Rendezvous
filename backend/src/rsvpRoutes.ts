import express from "express";
import { rsvpToEvent } from "./rsvpToEventEndpoint";
import { cancelRSVP } from "./rsvpCancelEndpoint";
import { listRSVPs } from "./rsvpListEndpoint";

const router = express.Router();

// rsvp to an event
router.post("/", async (req, res) => {
    await rsvpToEvent(req, res);
  });
  
  // cancel rsvp
  router.delete("/", async (req, res) => {
    await cancelRSVP(req, res);
  });
  
  // list rsvps
  router.get("/", async (req, res) => {
    await listRSVPs(req, res);
  });

export default router;
