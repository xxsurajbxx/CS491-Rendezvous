import { Request, Response } from "express";
import { pool } from "./db";
import fuzzysort from "fuzzysort"; // npm install fuzzysort

export const searchEvents = async (req: Request, res: Response): Promise<Response> => {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ status: "fail", message: "Missing or invalid query parameter" });
  }

  try {
    const [raw] = await pool.query(
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
       WHERE e.HostUserID IS NOT NULL
       AND e.endDateTime > NOW()`
    );

    const events = raw as any[]; // telling typescript to treat it as a normal array of objects
                                  // because fuzzysort likes a plain list

    // fuzzy search on name, location, description, and starting time of event
    const results = fuzzysort.go(query, events, {
      keys: ["Name", "Location", "Description", "startDateTime"],
      threshold: -1000,
    });

    const matchedEvents = results.map((r: any) => r.obj);

    return res.status(200).json({ status: "success", data: matchedEvents });
  } catch (error) {
    console.error("Error performing search:", error);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
