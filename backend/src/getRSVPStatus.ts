import { Request, Response } from "express";
import { pool } from "./db";

export const getRsvpStatus = async (req: Request, res: Response): Promise<Response> => {
  const { userId, eventId } = req.params;
  if (!userId || !eventId) {
    return res.status(400).json({ status: "fail", message: "Missing userId or eventId" });
  }

  try {
    // simple existence check on the rsvps table
    const [rows] = await pool.query(
      `SELECT 1
       FROM RSVP
       WHERE UserID = ? AND EventID = ?
       LIMIT 1`,
      [userId, eventId]
    );

    const isRsvped = Array.isArray(rows) && (rows as any[]).length > 0;
    return res.json({ status: "success", rsvped: isRsvped });
  } catch (err) {
    console.error("Error checking RSVP status:", err);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
