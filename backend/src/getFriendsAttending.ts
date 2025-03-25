import { pool } from "./db";

interface FriendsAttendingResult {
    EventID: number;
    EventName?: string;
    FriendsAttending: number;
  }

// function get to get the count of friends RSVPing for an event
const getFriendsAttending = async (eventId: number): Promise<FriendsAttendingResult | null> => {
    const query = `
      SELECT
        e.EventID,
        e.Name AS EventName,
        COUNT(DISTINCT f.FriendID) AS FriendsAttending
      FROM Events e
      JOIN RSVP r ON e.EventID = r.EventID
      JOIN Friends f ON (f.User1ID = r.UserID OR f.User2ID = r.UserID)
      WHERE e.EventID = ?
      GROUP BY e.EventID, e.Name;
    `;
  
    try {
      const [rows] = await pool.query(query, [eventId]);
      const result = Array.isArray(rows) && rows.length > 0 ? (rows[0] as FriendsAttendingResult) : null;
      return result ?? { EventID: eventId, FriendsAttending: 0 };
    } catch (error: any) {
      console.error("Error fetching friends attending:", error.message);
      return null;
    }
  };

    // run the function for an example EventID (replace 1 with a real event ID)
    getFriendsAttending(1).then((result) => {
        console.log("Friends Attending:", result);
        process.exit();
      });