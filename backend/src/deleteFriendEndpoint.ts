import { Request, Response } from "express";
import { pool } from "./db";

export const deleteFriend = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { friendId } = req.params;

    if (!friendId) {
      return res.status(400).json({ status: "fail", message: "Missing friend ID" });
    }

    // delete the friendship
    const [result] = await pool.query("DELETE FROM Friends WHERE FriendID = ?", [friendId]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ status: "fail", message: "Friendship not found" });
    }

    return res.status(200).json({ status: "success", message: "Friend deleted successfully" });
  } catch (error) {
    console.error("Error deleting friend:", error);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
