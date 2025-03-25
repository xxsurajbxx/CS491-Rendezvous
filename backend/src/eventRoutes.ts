import express from "express";
import { createEvent } from "./createEventsEndpoint";

const router = express.Router();

router.post("/", async (req, res) => {
    await createEvent(req, res); 
});

export default router;