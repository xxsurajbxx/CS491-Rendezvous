import express from "express";
import { rsvpToEvent } from "./rsvpToEventEndpoint";
import { cancelRSVP } from "./rsvpCancelEndpoint";
import { listRSVPs } from "./rsvpListEndpoint";
import { getRsvpStatus } from "./getRSVPStatus";

const router = express.Router();

// rsvp to an event
router.post("/", async (req, res) => {
    await rsvpToEvent(req, res);
  });
  
  // cancel rsvp
  router.delete("/:userId/:eventId", async (req, res) => {
    await cancelRSVP(req, res);
  });
  
  // list rsvps
  router.get("/", async (req, res) => {
    await listRSVPs(req, res);
  });

  // get rsvp status
  router.get("/status/:userId/:eventId", async (req, res) => {
    await getRsvpStatus(req, res);
  });

export default router;
