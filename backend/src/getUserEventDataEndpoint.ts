import { Request, Response } from "express";
import { pool } from "./db";

export const getUserEventData = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.params;

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
       WHERE e.endDateTime > NOW()
         AND (
           e.IsPublic = 1
           OR e.HostUserID = ?
           OR (
             e.IsPublic = 0
             AND e.HostUserID IS NOT NULL
             AND EXISTS (
               SELECT 1
               FROM Friends f
               WHERE f.Status = 'Accepted'
                 AND (
                   (f.User1ID = e.HostUserID AND f.User2ID = ?)
                   OR
                   (f.User2ID = e.HostUserID AND f.User1ID = ?)
                 )
             )
           )
         )
       ORDER BY e.startDateTime ASC`,
       [userId, userId, userId, userId]
    );

    return res.status(200).json({
      status: "success",
      events: rows,
    });
  } catch (error) {
    console.error("Error fetching all events:", error);
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};