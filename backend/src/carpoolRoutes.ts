import express from "express";
import { offerCarpool } from "./offerCarpool";
import { getVisibleCarpools } from "./getVisibleCarpools";
import { joinCarpool } from "./joinCarpool";
import { leaveCarpool } from "./leaveCarpool";
import { viewCarpoolMembers } from "./viewCarpoolMembers";
import { removeFromCarpool } from "./removeFromCarpool";
import { deleteCarpool } from "./deleteCarpool";

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
export default router;
