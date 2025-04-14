// src/getVisibleCarpools.ts

import { Request, Response } from "express";
import { pool } from "./db";

export const getVisibleCarpools = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ status: "fail", message: "Missing userId" });
  }

  try {
        // get list of friends for the requesting user
    const [friendRows] = await pool.query(
      `SELECT 
        CASE 
          WHEN User1ID = ? THEN User2ID 
          ELSE User1ID 
        END AS FriendID
       FROM Friends 
       WHERE (User1ID = ? OR User2ID = ?) AND Status = 'Accepted'`,
      [userId, userId, userId]
    );

    const friendIds = (friendRows as any[]).map(row => row.FriendID);
    friendIds.push(Number(userId)); // include the user themself

    if (friendIds.length === 0) {
      return res.status(200).json({ status: "success", data: [] });
    }

    const placeholders = friendIds.map(() => '?').join(',');
    const [carpools] = await pool.query(
      `SELECT DISTINCT c.CarpoolID, c.EventID, c.HostUserID, u.Name AS HostName
       FROM Carpools c
       JOIN Users u ON u.UserID = c.HostUserID
       LEFT JOIN CarpoolParticipants cp ON c.CarpoolID = cp.CarpoolID
       WHERE c.HostUserID IN (${placeholders}) OR cp.UserID IN (${placeholders})`,
      [...friendIds, ...friendIds]
    );

    res.status(200).json({ status: "success", data: carpools });
  } catch (error) {
    console.error("Error fetching visible carpools:", error);
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
