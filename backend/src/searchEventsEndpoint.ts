import { Request, Response } from "express";
import { pool } from "./db";
import fuzzysort from "fuzzysort"; // npm install fuzzysort

export const searchEvents = async (req: Request, res: Response): Promise<Response> => {
  const { query, userId } = req.params;

  if (!query || typeof query !== "string" || !userId) {
    return res.status(400).json({ status: "fail", message: "Missing or invalid query or userId" });
  }

  try {
    const [eventRows] = await pool.query(
      `SELECT 
          e.EventID, 
          e.Name, 
          e.startDateTime,
          e.endDateTime, 
          e.Location, 
          e.Description,
          e.IsPublic, 
          e.HostUserID,
          m.Latitude, 
          m.Longitude
        FROM Events e
        LEFT JOIN Map m ON e.EventID = m.EventID
        WHERE e.endDateTime > NOW()
          AND (
            e.IsPublic = 1
            OR e.HostUserID = ?
            OR (
              e.IsPublic = 0
              AND e.HostUserID IS NOT NULL
              AND EXISTS (
                SELECT 1
                FROM Friends f
                WHERE f.Status = 'Accepted'
                  AND (
                    (f.User1ID = e.HostUserID AND f.User2ID = ?)
                    OR
                    (f.User2ID = e.HostUserID AND f.User1ID = ?)
                  )
              )
            )
          )`,
      [userId, userId, userId]
    );

    const filtered = eventRows as any[];// telling typescript to treat it as a normal array of objects
                                  // because fuzzysort likes a plain list

    // fuzzy search on name, location, description, and starting time of event
    const results = fuzzysort.go(query, filtered, {
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
