import { Request, Response } from "express";
import { pool } from "./db";

export const getUserEventAttendees = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      status: "fail",
      message: "Missing userId",
    });
  }

  try {
    const [rows] = await pool.query(
      `SELECT 
          e.EventID,
          e.Name AS EventName,
          e.startDateTime,
          e.endDateTime,
          r.RSVP_ID,
          r.Status AS RSVPStatus,
          r.Timestamp AS RSVPTimestamp,
          u.UserID,
          u.Name AS UserName,
          u.Username,
          u.Email
       FROM Events e
       JOIN RSVP r ON e.EventID = r.EventID
       JOIN Users u ON r.UserID = u.UserID
       WHERE e.HostUserID = ?`,
      [userId]
    );

    return res.status(200).json({
      status: "success",
      attendees: rows,
    });
  } catch (error) {
    console.error("Error fetching attendees for hosted events:", error);
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
