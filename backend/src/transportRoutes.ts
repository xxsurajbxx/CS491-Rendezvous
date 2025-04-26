import express from "express";
import { getTravelInfo } from "./transportationTime";

const router = express.Router();

// transportation times for driving and walking
router.post("/getTravelInfo", async (req, res) => {
    await getTravelInfo(req, res);
});
  
export default router;