import { Request, Response } from "express";
import { pool } from "./db";

export const offerCarpool = async (req: Request, res: Response): Promise<void> => {
  const { userId, eventId, maxSeats, notes } = req.body;

  if (!userId || !eventId || !maxSeats) {
    res.status(400).json({ status: "fail", message: "Missing userId, eventId, or maxSeats" });
    return;
  }

  try {
    // check if user already offered a carpool for this event
    const [existing] = await pool.query(
      `SELECT * FROM Carpools WHERE HostUserID = ? AND EventID = ?`,
      [userId, eventId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      res.status(409).json({ status: "fail", message: "You already offered a carpool for this event" });
      return;
    }

    // insert carpool offer
    const [result] = await pool.query(
      `INSERT INTO Carpools (HostUserID, EventID, MaxSeats, AvailableSeats, Notes) VALUES (?, ?, ?, ?, ?)`,
      [userId, eventId, maxSeats, maxSeats - 1, notes || null]
    );

    const carpoolId = (result as any).insertId;

    // automatically add host as a participant
    await pool.query(
      `INSERT INTO CarpoolParticipants (CarpoolID, UserID) VALUES (?, ?)`,
      [carpoolId, userId]
    );

    // automatically RSVP the host for the event
    await pool.query(
      `INSERT IGNORE INTO RSVP (UserID, EventID) VALUES (?, ?)`,
      [userId, eventId]
    );

    res.status(201).json({ status: "success", message: "Carpool offer created" });
  } catch (error) {
    console.error("Error offering carpool:", error);
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
