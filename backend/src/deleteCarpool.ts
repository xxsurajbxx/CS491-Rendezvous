import { Request, Response } from "express";
import { pool } from "./db";

export const deleteCarpool = async (req: Request, res: Response): Promise<void> => {
  const { carpoolId, userId } = req.body;

  if (!carpoolId || !userId) {
    res.status(400).json({ status: "fail", message: "Missing carpoolId or userId" });
    return;
  }

  try {
    // check if user is the host
    const [rows] = await pool.query(
      "SELECT * FROM Carpools WHERE CarpoolID = ? AND HostUserID = ?",
      [carpoolId, userId]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(403).json({ status: "fail", message: "Not authorized to delete this carpool" });
      return;
    }

    // delete participants first due to foreign key constraints
    await pool.query("DELETE FROM CarpoolParticipants WHERE CarpoolID = ?", [carpoolId]);

    // delete carpool itself
    await pool.query("DELETE FROM Carpools WHERE CarpoolID = ?", [carpoolId]);

    res.json({ status: "success", message: "Carpool deleted" });
  } catch (error) {
    console.error("Error deleting carpool:", error);
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
