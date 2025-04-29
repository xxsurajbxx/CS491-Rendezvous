import { Request, Response } from "express";
import { pool } from "./db";

export const getUserCarpool = async (req: Request, res: Response): Promise<Response> => {
  const { userId, eventId } = req.params;
  if (!userId || !eventId) {
    return res.status(400).json({ status: "fail", message: "Missing userId or eventId" });
  }

  try {
    // find the one carpool that this user participates in for this event
    const [rows] = await pool.query(
      `SELECT 
         c.CarpoolID,
         c.EventID,
         c.HostUserID,
         u.Name   AS HostName,
         c.MaxSeats,
         c.AvailableSeats,
         c.Notes  AS Description
       FROM Carpools c
       JOIN CarpoolParticipants cp
         ON cp.CarpoolID = c.CarpoolID
       JOIN Users u
         ON u.UserID = c.HostUserID
       WHERE cp.UserID = ?
         AND c.EventID = ?
       LIMIT 1`,
      [userId, eventId]
    );

      const userCarpools = rows as any[];
      if (userCarpools.length === 0) {
          return res.json({ status: "success", carpool: null });
      }

      const carpool = userCarpools[0];

      // load participants for that carpool
      const [memberRows] = await pool.query(
          `SELECT
         cp.CarpoolID,
         u.UserID,
         u.Name AS UserName
       FROM CarpoolParticipants cp
       JOIN Users u ON u.UserID = cp.UserID
       WHERE cp.CarpoolID = ?`,
          [carpool.CarpoolID]
      );

      carpool.participants = (memberRows as any[]).map(r => ({
          CarpoolID: carpool.CarpoolID,
          UserID: r.UserID,
          UserName: r.UserName
      }));

    return res.json({ status: "success", carpool });
  } catch (err) {
    console.error("Error getting user carpool:", err);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
