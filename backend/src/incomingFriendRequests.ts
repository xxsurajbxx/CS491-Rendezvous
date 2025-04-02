import { Request, Response } from "express";
import { pool } from "./db";

export const countIncomingFriendRequests = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const [results] = await pool.query(
      `SELECT 
         f.FriendID,
         u.UserID AS SenderID,
         u.Name AS SenderName,
         u.Email AS SenderEmail
       FROM Friends f
       JOIN Users u ON f.User1ID = u.UserID
       WHERE f.User2ID = ? AND f.Status = 'Pending'`,
      [userId]
    );

    return res.status(200).json({
      status: "success",
      count: Array.isArray(results) ? results.length : 0,
      requests: results,
    });
  } catch (error) {
    console.error("Error fetching incoming request details:", error);
    return res.status(500).json({ status: "fail", message: "Server error" });
  }
};
