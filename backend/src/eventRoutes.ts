import express from "express";
import { createEvent } from "./createEvent";

const router = express.Router();

router.post("/", async (req, res) => {
    await createEvent(req, res); 
});

export default router;
