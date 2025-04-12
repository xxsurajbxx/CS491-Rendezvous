import { Request, Response } from "express";
import { pool } from "./db";

export const viewCarpoolMembers = async (req: Request, res: Response) => {
  const { carpoolId } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT u.UserID, u.Name, u.Email
       FROM CarpoolParticipants cp
       JOIN Users u ON cp.UserID = u.UserID
       WHERE cp.CarpoolID = ?`,
      [carpoolId]
    );

    res.status(200).json({ status: "success", data: rows });
  } catch (error) {
    console.error("Error fetching carpool members:", error);
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
