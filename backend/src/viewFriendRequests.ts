import { Request, Response } from "express";
import { pool } from "./db";

export const viewFriendRequests = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const [requests] = await pool.query(
      `SELECT f.FriendID, u.UserID, u.Name, u.Email 
       FROM Friends f 
       JOIN Users u ON u.UserID = f.User1ID
       WHERE f.User2ID = ? AND f.Status = 'Pending'`,
      [userId]
    );

    res.json({ status: "success", data: requests });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};
