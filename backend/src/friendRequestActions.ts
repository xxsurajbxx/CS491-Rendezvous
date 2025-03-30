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
    const status = action === "accept" ? "Accepted" : "Rejected";

    await pool.query(
      `UPDATE Friends SET Status = ?, Since = CURRENT_TIMESTAMP WHERE FriendID = ?`,
      [status, friendId]
    );

    res.json({ status: "success", message: `Friend request ${status.toLowerCase()}` });
  } catch (error) {
    console.error("Error updating friend request:", error);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};
