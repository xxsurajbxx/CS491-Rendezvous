import { Request, Response } from "express";
import { pool } from "./db";

export const getFriendRequestStatus = async (req: Request, res: Response): Promise<Response> => {
  const { userId1, userId2 } = req.query;

  if (!userId1 || !userId2) {
    return res.status(400).json({ status: "fail", message: "Missing userId1 or userId2" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT Status
       FROM Friends
       WHERE 
         (User1ID = ? AND User2ID = ?)
         OR 
         (User1ID = ? AND User2ID = ?)`,
      [userId1, userId2, userId2, userId1]
    );

    const result = rows as any[];

    if (result.length > 0) {
      return res.status(200).json({
        status: "success",
        friendStatus: result[0].Status,
      });
    } else {
      return res.status(200).json({
        status: "success",
        friendStatus: "None",
      });
    }
  } catch (error) {
    console.error("Error checking friend status:", error);
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
