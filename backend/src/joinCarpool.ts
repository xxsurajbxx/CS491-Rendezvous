import { Request, Response } from "express";
import { pool } from "./db";

export const joinCarpool = async (req: Request, res: Response): Promise<void> => {
  const { carpoolId, userId } = req.body;

  if (!carpoolId || !userId) {
    res.status(400).json({ status: "fail", message: "Missing carpoolId or userId" });
    return;
  }

  try {
    // check if carpool exists and has available seats
    const [carpoolRows] = await pool.query(
      "SELECT AvailableSeats FROM Carpools WHERE CarpoolID = ?",
      [carpoolId]
    );

    if (!Array.isArray(carpoolRows) || carpoolRows.length === 0) {
      res.status(404).json({ status: "fail", message: "Carpool not found" });
      return;
    }

    const availableSeats = (carpoolRows as any)[0].AvailableSeats;

    if (availableSeats <= 0) {
      res.status(403).json({ status: "fail", message: "Carpool is full" });
      return;
    }

    // check if user already joined
    const [alreadyJoined] = await pool.query(
      "SELECT * FROM CarpoolParticipants WHERE CarpoolID = ? AND UserID = ?",
      [carpoolId, userId]
    );

    if (Array.isArray(alreadyJoined) && alreadyJoined.length > 0) {
      res.status(409).json({ status: "fail", message: "Already joined this carpool" });
      return;
    }

    // add participant
    await pool.query(
      "INSERT INTO CarpoolParticipants (CarpoolID, UserID) VALUES (?, ?)",
      [carpoolId, userId]
    );

    // decrement available seats
    await pool.query(
      "UPDATE Carpools SET AvailableSeats = AvailableSeats - 1 WHERE CarpoolID = ?",
      [carpoolId]
    );

    res.status(201).json({ status: "success", message: "Joined carpool" });
  } catch (error) {
    console.error("Error joining carpool:", error);
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
