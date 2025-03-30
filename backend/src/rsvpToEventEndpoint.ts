import { Request, Response } from "express";
import { pool } from "./db";

export const rsvpToEvent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({ status: "fail", message: "Missing userId or eventId" });
    }

    // check if rsvp already exist
    const [existing] = await pool.query(
      "SELECT * FROM RSVP WHERE UserID = ? AND EventID = ?",
      [userId, eventId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return res.status(409).json({ status: "fail", message: "Already RSVPed to this event" });
    }

    // insert new rsvp
    await pool.query(
      "INSERT INTO RSVP (UserID, EventID) VALUES (?, ?)",
      [userId, eventId]
    );

    return res.status(201).json({ status: "success", message: "RSVP recorded" });

  } catch (error) {
    console.error("Error RSVPing:", error);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
