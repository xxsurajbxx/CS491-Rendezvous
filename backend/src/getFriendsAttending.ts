import { Request, Response } from "express";
import { pool } from "./db";

export const getFriendsAttending = async (req: Request, res: Response) => {
  const { userId, eventId } = req.query;

  if (!userId || !eventId) {
    return res.status(400).json({ status: "fail", message: "Missing userId or eventId" });
  }

  try {
    const query = `
      SELECT 
        e.EventID,
        e.Name AS EventName,
        u.UserID,
        u.Name,
        u.Username,
        u.Email
      FROM Events e
      JOIN RSVP r ON e.EventID = r.EventID
      JOIN Users u ON r.UserID = u.UserID
      JOIN Friends f ON (
          (f.User1ID = ? AND f.User2ID = u.UserID)
          OR
          (f.User2ID = ? AND f.User1ID = u.UserID)
      )
      WHERE e.EventID = ?
        AND r.Status = 'Attending'
        AND f.Status = 'Accepted'
    `;

    const [rows] = await pool.query(query, [userId, userId, eventId]);

    res.status(200).json({
      status: "success",
      eventId: Number(eventId),
      friends: rows
    });

  } catch (error) {
    console.error("Error fetching friends attending:", error);
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};