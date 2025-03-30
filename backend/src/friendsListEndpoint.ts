import { Request, Response } from "express";
import { pool } from "./db";

export const getFriends = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const [friends] = await pool.query(
      `SELECT 
        u.UserID, u.Name, u.Email, f.Since 
       FROM Friends f 
       JOIN Users u ON (u.UserID = f.User1ID OR u.UserID = f.User2ID)
       WHERE (f.User1ID = ? OR f.User2ID = ?) 
         AND f.Status = 'Accepted' 
         AND u.UserID != ?`,
      [userId, userId, userId]
    );

    res.json({ status: "success", data: friends });
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};
