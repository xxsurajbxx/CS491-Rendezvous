import { Request, Response } from "express";
import { pool } from "./db";

export const listRSVPs = async (req: Request, res: Response) => {
  const { userId, eventId } = req.query;

  if (!userId && !eventId) {
    return res.status(400).json({ status: "fail", message: "Provide userId or eventId" });
  }

  try {
    // query for attendees
    let query = `
      SELECT 
        r.RSVP_ID,
        u.UserID,
        u.Name AS UserName,
        e.EventID,
        e.Name AS EventName,
        e.startDateTime AS EventDate,
        r.Timestamp AS RSVPTimestamp,
        CASE
          WHEN NOW() < e.startDateTime THEN 'Upcoming'
          WHEN NOW() BETWEEN e.startDateTime AND e.endDateTime THEN 'Ongoing'
          WHEN NOW() > e.endDateTime THEN 'Over'
          ELSE 'Unknown'
        END AS RSVPStatus
      FROM RSVP r
      JOIN Users u ON r.UserID = u.UserID
      JOIN Events e ON r.EventID = e.EventID
      WHERE 1 = 1
    `;

    const params: any[] = [];


    if (userId && eventId && eventId !== 'null') {
      query += ` AND r.UserID = ? AND r.EventID = ?`;
      params.push(userId, eventId);
    } else if (userId && eventId === 'null') {
      query += ` AND r.UserID = ? AND r.EventID IS NULL`;
      params.push(userId);
    } else if (userId) {
      query += ` AND r.UserID = ?`;
      params.push(userId);
    } else if (eventId && eventId !== 'null') {
      query += ` AND r.EventID = ?`;
      params.push(eventId);
    } else if (eventId === 'null') {
      query += ` AND r.EventID IS NULL`;
    }

    const [rows] = await pool.query(query, params);
    return res.status(200).json({ status: "success", data: rows });

  } catch (error) {
    console.error("Error listing RSVPs:", error);
    return res.status(500).json({ status: "fail", message: "Server error" });
  }
};