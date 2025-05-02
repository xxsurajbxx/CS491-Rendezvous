import { Request, Response } from "express";
import { pool } from "./db";

export const getUserHostedEventData = async (req: Request, res: Response): Promise<Response> => {
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
          e.Name, 
          e.startDateTime,
          e.endDateTime, 
          e.Location, 
          e.Description,
          e.IsPublic, 
          e.HostUserID,
          m.Latitude, 
          m.Longitude
       FROM Events e
       LEFT JOIN Map m ON e.EventID = m.EventID
       WHERE e.HostUserID = ?
       `,
      [userId]
    );

    return res.status(200).json({
      status: "success",
      events: rows,
    });
  } catch (error) {
    console.error("Error fetching user-created events:", error);
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};