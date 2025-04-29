import { Request, Response } from "express";
import { pool } from "./db";

export const getFullEventData = async (req: Request, res: Response): Promise<Response> => {
  const { eventId, userId } = req.params;

  // make sure eventId is provided
  if (!eventId || !userId) {
    return res.status(400).json({ status: "fail", message: "Missing eventId or userid" });
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
         e.HostUserID,
         e.TicketmasterLink,
         m.Latitude, 
         m.Longitude,
         CASE
           WHEN NOW() < e.startDateTime THEN 'Upcoming'
           WHEN NOW() BETWEEN e.startDateTime AND e.endDateTime THEN 'Ongoing'
           WHEN NOW() > e.endDateTime THEN 'Over'
           ELSE 'Unknown'
         END AS EventState
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

    // if private, check if user is friends with hpst
    if (!event.IsPublic && Number(userId) !== event.HostUserID) {
      const [friendCheck] = await pool.query(
        `SELECT 1 FROM Friends
         WHERE Status = 'Accepted'
         AND (
           (User1ID = ? AND User2ID = ?)
           OR
           (User1ID = ? AND User2ID = ?)
         )`,
        [userId, event.HostUserID, event.HostUserID, userId]
      );

      if ((friendCheck as any[]).length === 0) {
        return res.status(403).json({
          status: "fail",
          message: "This is a private event. You must be friends with the host."
        });
      }
    }
    // get host user info
    let hostInfo = null;
    if (event.HostUserID) {
      const [hostRows] = await pool.query(
        `SELECT UserID, Name, Username, Email, Address, Description
             FROM Users
             WHERE UserID = ?`,
        [event.HostUserID]
      );
      if (Array.isArray(hostRows) && hostRows.length > 0) {
        hostInfo = hostRows[0];
      }
    }

    // get list of friend IDs
    const [friendRows] = await pool.query(
      `SELECT 
           CASE 
             WHEN User1ID = ? THEN User2ID 
             ELSE User1ID 
           END AS FriendID
         FROM Friends
         WHERE (User1ID = ? OR User2ID = ?) AND Status = 'Accepted'`,
      [userId, userId, userId]
    );

    const friendIds = (friendRows as any[]).map(row => row.FriendID);
    friendIds.push(Number(userId)); // include self

    const placeholders = friendIds.map(() => '?').join(',');

    // get RSVPs for user and their friends
    const [rsvpRows] = await pool.query(
      `SELECT 
         r.RSVP_ID,
         u.UserID,
         u.Name AS UserName,
         r.Timestamp AS RSVPTimestamp,
        CASE
            WHEN NOW() < e.startDateTime THEN 'Upcoming'
            WHEN NOW() BETWEEN e.startDateTime AND e.endDateTime THEN 'Ongoing'
            WHEN NOW() > e.endDateTime THEN 'Over'
            ELSE 'Unknown'
          END AS EventState
        FROM RSVP r
        JOIN Users u ON r.UserID = u.UserID
        JOIN Events e ON r.EventID = e.EventID
        WHERE r.EventID = ?
     AND r.UserID IN (${placeholders})`,
      [eventId, ...friendIds]
    );

    const rsvps = rsvpRows as any[];

    // get carpools created or joined by user or friends
    const [carpoolRows] = await pool.query(
      `SELECT DISTINCT
         c.CarpoolID,
         c.EventID,
         c.HostUserID,
         u.Name AS HostName,
         c.MaxSeats,
         c.AvailableSeats,
         c.Notes AS Description
       FROM Carpools c
       JOIN Users u ON u.UserID = c.HostUserID
       LEFT JOIN CarpoolParticipants cp ON cp.CarpoolID = c.CarpoolID
       WHERE c.EventID = ?
         AND (
           c.HostUserID IN (${placeholders})
           OR cp.UserID IN (${placeholders})
         )`,
      [eventId, ...friendIds, ...friendIds]
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
      host: hostInfo,
      rsvps,
      carpools
    });

  } catch (error) {
    console.error("Error fetching full event data:", error);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
