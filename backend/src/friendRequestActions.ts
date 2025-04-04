import { Request, Response } from "express";
import { pool } from "./db";

export const respondToRequest = async (req: Request, res: Response): Promise<void> => {
  const { friendId } = req.params;
  const { action } = req.body; // "accept" or "reject"

  if (!["accept", "reject"].includes(action)) {
    res.status(400).json({ status: "fail", message: "Invalid action" });
    return;
  }

  try {
    if (action === "reject") {
      await pool.query(`DELETE FROM Friends WHERE FriendID = ?`, [friendId]);
      res.json({ status: "success", message: "Friend request rejected and removed" });
    } else {
      await pool.query(
        `UPDATE Friends SET Status = 'Accepted', Since = CURRENT_TIMESTAMP WHERE FriendID = ?`,
        [friendId]
      );
      res.json({ status: "success", message: "Friend request accepted" });
    }
  } catch (error) {
    console.error("Error updating friend request:", error);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};
