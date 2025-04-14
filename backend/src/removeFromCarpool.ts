import { Request, Response } from "express";
import { pool } from "./db";

export const removeFromCarpool = async (req: Request, res: Response) => {
    const { carpoolId, userId } = req.params;
  
    try {
      await pool.query(
        `DELETE FROM CarpoolParticipants WHERE CarpoolID = ? AND UserID = ?`,
        [carpoolId, userId]
      );
  
      res.status(200).json({ status: "success", message: "User removed from carpool" });
    } catch (error) {
      console.error("Error removing user:", error);
      res.status(500).json({ status: "fail", message: "Internal server error" });
    }
  };
  