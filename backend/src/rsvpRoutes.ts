import express from "express";
import { rsvpToEvent } from "./rsvpToEventEndpoint";
import { cancelRSVP } from "./rsvpCancelEndpoint";
import { listRSVPs } from "./rsvpListEndpoint";
import { getRsvpStatus } from "./getRSVPStatus";
import { getFriendsRsvps } from "./getFriendsRsvps";

const router = express.Router();

// rsvp to an event
router.post("/", async (req, res) => {
  await rsvpToEvent(req, res);
});

// cancel rsvp
router.delete("/:userId/:eventId", async (req, res) => {
  await cancelRSVP(req, res);
});

// list all rsvps
router.get("/", async (req, res) => {
  await listRSVPs(req, res);
});

// get rsvp status for one user/event
router.get("/status/:userId/:eventId", async (req, res) => {
  await getRsvpStatus(req, res);
});

// get all rsvps made by friends of a user, newest first
router.get("/friends/:userId/rsvps", async (req, res) => {
  await getFriendsRsvps(req, res);
});

export default router;
