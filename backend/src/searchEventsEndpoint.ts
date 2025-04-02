import { Request, Response } from "express";
import { pool } from "./db";

export const searchEvents = async (req: Request, res: Response): Promise<Response> => {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ status: "fail", message: "Missing or invalid query parameter" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT 
          e.EventID, 
          e.Name, 
          e.startDateTime,
          e.endDateTime, 
          e.Location, 
          e.Description, 
          m.Latitude, 
          m.Longitude
       FROM Events e
       LEFT JOIN Map m ON e.EventID = m.EventID
       WHERE e.Name LIKE CONCAT('%', ?, '%')
         AND e.HostUserID IS NOT NULL`,
      [query]
    );

    return res.status(200).json({ status: "success", data: rows });
  } catch (error) {
    console.error("Error searching events:", error);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
