import { Request, Response } from "express";
import { pool } from "./db";

export const cancelRSVP = async (req: Request, res: Response) => {
  const { userId, eventId } = req.body;

  if (!userId || !eventId) {
    return res.status(400).json({ status: "fail", message: "Missing userId or eventId" });
  }

  try {
    await pool.query(
      `UPDATE RSVP SET Status = 'Cancelled' WHERE UserID = ? AND EventID = ?;`,
      [userId, eventId]
    );

    return res.status(200).json({ status: "success", message: "RSVP canceled" });
  } catch (error) {
    console.error("Error canceling RSVP:", error);
    return res.status(500).json({ status: "fail", message: "Server error" });
  }
};
