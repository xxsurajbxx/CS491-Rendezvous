import { Request, Response } from "express";
import { pool } from "./db";

export const getFullEventData = async (req: Request, res: Response): Promise<Response> => {
  const { eventId } = req.params;

  // make sure eventId is provided
  if (!eventId) {
    return res.status(400).json({ status: "fail", message: "Missing eventId" });
  }

  try {
    // get event info
    const [eventRows] = await pool.query(
      `SELECT 
         e.EventID, 
         e.Name, 
         e.startDateTime, 
         e.endDateTime, 
         e.Location, 
         e.Description, 
         e.IsPublic,
         m.Latitude, 
         m.Longitude
       FROM Events e
       LEFT JOIN Map m ON e.EventID = m.EventID
       WHERE e.EventID = ?`,
      [eventId]
    );

    const eventResult = eventRows as any[];
    if (eventResult.length === 0) {
      return res.status(404).json({ status: "fail", message: "Event not found" });
    }

    const event = eventResult[0];

    // get RSVP list
    const [rsvpRows] = await pool.query(
      `SELECT 
         r.RSVP_ID,
         r.Status,
         u.UserID,
         u.Name AS UserName
       FROM RSVP r
       JOIN Users u ON r.UserID = u.UserID
       WHERE r.EventID = ? AND (r.Status = 'Attending' OR r.Status = 'Cancelled')`,
      [eventId]
    );

    const rsvps = rsvpRows as any[];

    // get carpools for the event
    const [carpoolRows] = await pool.query(
      `SELECT 
         c.CarpoolID,
         c.EventID,
         c.HostUserID,
         u.Name AS HostName
       FROM Carpools c
       JOIN Users u ON u.UserID = c.HostUserID
       WHERE c.EventID = ?`,
      [eventId]
    );

    const carpools = carpoolRows as any[];

    // get carpool participants
    const [participantRows] = await pool.query(
        `SELECT 
           cp.CarpoolID,
           u.UserID,
           u.Name AS UserName
         FROM CarpoolParticipants cp
         JOIN Users u ON u.UserID = cp.UserID
         WHERE cp.CarpoolID IN (
           SELECT CarpoolID FROM Carpools WHERE EventID = ?
         )`,
        [eventId]
      );
  
      const participants = participantRows as any[];
  
      // attach participants to each carpool
      for (const carpool of carpools) {
        carpool.participants = participants.filter(p => p.CarpoolID === carpool.CarpoolID);
      }

    return res.status(200).json({
      event,
      rsvps,
      carpools
    });

  } catch (error) {
    console.error("Error fetching full event data:", error);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
