import express from "express";
import { offerCarpool } from "./offerCarpool";
import { getVisibleCarpools } from "./getVisibleCarpools";
import { joinCarpool } from "./joinCarpool";
import { leaveCarpool } from "./leaveCarpool";
import { viewCarpoolMembers } from "./viewCarpoolMembers";
import { removeFromCarpool } from "./removeFromCarpool";
import { deleteCarpool } from "./deleteCarpool";
import { findFriendCarpool } from "./findFriendCarpool";
import { getUserCarpool } from "./getUserCarpool";
import { getOfferedCarpool } from "./getOfferedCarpool";

const router = express.Router();

// offer
router.post("/offer", async (req, res) => {
  await offerCarpool(req, res);
});

// visible offers for a user
router.get("/visible/:userId", async (req, res) => {
    await getVisibleCarpools(req, res);
  });

// j oin a carpool
router.post("/join", async (req, res) => {
    await joinCarpool(req, res);
  });

  // leave a carpool
router.post("/leave", async (req, res) => {
    await leaveCarpool(req, res);
  });

// view members of a carpool
router.get("/:carpoolId/members", async (req, res) => {
    await viewCarpoolMembers(req, res);
  });

// remove user from carpool
router.delete("/:carpoolId/remove/:userId", async (req, res) => {
    await removeFromCarpool(req, res);
  });

// delete carpool
router.delete("/delete", async (req, res) => {
    await deleteCarpool(req, res);
  });

// find a friend's carpool for a specific event
router.get("/friends/:userId/event/:eventId", async (req, res) => {
  await findFriendCarpool(req, res);
});

// find a user's carpool for a specific event
router.get("/my/:userId/:eventId", async (req, res) => {
  await getUserCarpool(req, res);
});

// get offered carpools
router.get("/offered/:userId/:eventId", async (req, res) => {
  await getOfferedCarpool(req, res);
});

export default router;
