import { Request, Response } from "express";
import { pool } from "./db";

export const getOfferedCarpool = async (req: Request, res: Response): Promise<Response> => {
  const { userId, eventId } = req.params;
  if (!userId || !eventId) {
    return res.status(400).json({ status: "fail", message: "Missing userId or eventId" });
  }

  try {
    // find the carpool where this user is the host for this event
    const [rows] = await pool.query(
      `SELECT
         c.CarpoolID,
         c.EventID,
         c.HostUserID,
         u.Name       AS HostName,
         c.MaxSeats,
         c.AvailableSeats,
         c.Notes      AS Description
       FROM Carpools c
       JOIN Users u ON u.UserID = c.HostUserID
       WHERE c.HostUserID = ? 
         AND c.EventID    = ?
       LIMIT 1`,
      [userId, eventId]
    );


    const carpool = Array.isArray(rows) && rows.length > 0
      ? (rows as any[])[0]
      : null;

    const hosting = carpool !== null;
    return res.json({ status: "success", hosting, carpool });
  } catch (err) {
    console.error("Error getting offered carpool:", err);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
