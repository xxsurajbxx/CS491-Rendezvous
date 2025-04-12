import { Request, Response } from "express";
import { pool } from "./db";

export const inviteToCarpool = async (req: Request, res: Response) => {
    const { carpoolId } = req.params;
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(400).json({ status: "fail", message: "Missing userId" });
    }
  
    try {
      // Cceck current number of participants
      const [countRows] = await pool.query(
        `SELECT COUNT(*) AS count FROM CarpoolParticipants WHERE CarpoolID = ?`,
        [carpoolId]
      );
      const currentCount = (countRows as any)[0].count;
  
      if (currentCount >= 5) {
        return res.status(403).json({ status: "fail", message: "Carpool is full" });
      }
  
      // Add user
      await pool.query(
        `INSERT INTO CarpoolParticipants (CarpoolID, UserID) VALUES (?, ?)`,
        [carpoolId, userId]
      );
  
      res.status(200).json({ status: "success", message: "User invited to carpool" });
    } catch (error) {
      console.error("Error inviting user:", error);
      res.status(500).json({ status: "fail", message: "Internal server error" });
    }
  };
  