import { Request, Response } from "express";
import { pool } from "./db";

export const getUserEventData = async (req: Request, res: Response): Promise<Response> => {
  try {
    const [rows] = await pool.query(
        `SELECT 
            e.EventID, 
            e.Name, 
            e.startDateTime, 
            e.Location, 
            e.Description, 
            m.Latitude, 
            m.Longitude
         FROM Events e
         LEFT JOIN Map m ON e.EventID = m.EventID
         WHERE e.HostUserID IS NOT NULL`
      );
    return res.status(200).json({
      status: "success",
      events: rows,
    });
  } catch (error) {
    console.error("Error fetching user-created events:", error);
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};