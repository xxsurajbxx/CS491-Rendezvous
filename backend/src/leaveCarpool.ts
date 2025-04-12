import { Request, Response } from "express";
import { pool } from "./db";

export const leaveCarpool = async (req: Request, res: Response): Promise<void> => {
  const { carpoolId, userId } = req.body;

  if (!carpoolId || !userId) {
    res.status(400).json({ status: "fail", message: "Missing carpoolId or userId" });
    return;
  }

  try {
    // check if user is part of the carpool
    const [existing] = await pool.query(
      "SELECT * FROM CarpoolParticipants WHERE CarpoolID = ? AND UserID = ?",
      [carpoolId, userId]
    );

    if (!Array.isArray(existing) || existing.length === 0) {
      res.status(404).json({ status: "fail", message: "User not part of this carpool" });
      return;
    }

    // remove the participant
    await pool.query(
      "DELETE FROM CarpoolParticipants WHERE CarpoolID = ? AND UserID = ?",
      [carpoolId, userId]
    );

    // increment the available seat count
    await pool.query(
      "UPDATE Carpools SET AvailableSeats = AvailableSeats + 1 WHERE CarpoolID = ?",
      [carpoolId]
    );

    res.json({ status: "success", message: "Left carpool" });
  } catch (error) {
    console.error("Error leaving carpool:", error);
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
