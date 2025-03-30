import { Request, Response } from "express";
import { pool } from "./db";

export const listRSVPs = async (req: Request, res: Response) => {
  const { userId, eventId } = req.query;

  if (!userId && !eventId) {
    return res.status(400).json({ status: "fail", message: "Provide userId or eventId" });
  }

  try {
    // mark rsvps as 'Over' if the event has already happened
    await pool.query(`
      UPDATE RSVP r
      JOIN Events e ON r.EventID = e.EventID
      SET r.Status = 'Over'
      WHERE e.startDateTime < NOW() AND r.Status = 'Attending'
    `);

    // query for attendees
    let query = `
      SELECT 
        r.RSVP_ID,
        r.Status,
        u.UserID,
        u.Name AS UserName,
        e.EventID,
        e.Name AS EventName,
        e.startDateTime AS EventDate,
        r.Timestamp AS RSVPTimestamp
      FROM RSVP r
      JOIN Users u ON r.UserID = u.UserID
      JOIN Events e ON r.EventID = e.EventID
      WHERE (r.Status = 'Attending' OR r.Status = 'Cancelled')
    `;

    const params: any[] = [];

    if (userId && eventId) {
      query += ` AND r.UserID = ? AND r.EventID = ?`;
      params.push(userId, eventId);
    } else if (userId) {
      query += ` AND r.UserID = ?`;
      params.push(userId);
    } else if (eventId) {
      query += ` AND r.EventID = ?`;
      params.push(eventId);
    }

    const [rows] = await pool.query(query, params);
    return res.status(200).json({ status: "success", data: rows });

  } catch (error) {
    console.error("Error listing RSVPs:", error);
    return res.status(500).json({ status: "fail", message: "Server error" });
  }
};