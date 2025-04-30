import { Request, Response } from "express";
import { pool } from "./db";

export const getRecommendedEvents = async (req: Request, res: Response): Promise<Response> => {
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
          m.Longitude,
          (
            SELECT COUNT(*) 
            FROM RSVP r
            WHERE r.EventID = e.EventID
              AND r.UserID IN (
                SELECT 
                  CASE WHEN f.User1ID = ? THEN f.User2ID ELSE f.User1ID END
                FROM Friends f
                WHERE (f.User1ID = ? OR f.User2ID = ?)
                  AND f.Status = 'Accepted'
              )
          ) AS friendCount
       FROM Events e
       LEFT JOIN Map m ON m.EventID = e.EventID
       WHERE e.endDateTime > NOW()
         AND (
           e.IsPublic = 1
           OR e.HostUserID = ?
           OR (
             e.IsPublic = 0
             AND e.HostUserID IS NOT NULL
             AND EXISTS (
               SELECT 1
               FROM Friends f2
               WHERE f2.Status = 'Accepted'
                 AND (
                   (f2.User1ID = e.HostUserID AND f2.User2ID = ?)
                   OR
                   (f2.User2ID = e.HostUserID AND f2.User1ID = ?)
                 )
             )
           )
         )
       ORDER BY friendCount DESC, e.startDateTime ASC`,
      [userId, userId, userId, userId, userId, userId]
    );

    return res.status(200).json({ status: "success", events: rows });
  } catch (error) {
    console.error("Error fetching recommended events:", error);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
