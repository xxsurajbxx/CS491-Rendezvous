import { Request, Response } from "express";
import { pool } from "./db";

export const findFriendCarpool = async (req: Request, res: Response) => {
  const { userId, eventId } = req.params;

  if (!userId || !eventId) {
    return res.status(400).json({ status: "fail", message: "Missing userId or eventId" });
  }

  try {
    // get all friends of userId
    const [friendRows] = await pool.query(
      `SELECT 
         CASE 
           WHEN f.User1ID = ? THEN f.User2ID 
           ELSE f.User1ID 
         END AS FriendID
       FROM Friends f
       WHERE (f.User1ID = ? OR f.User2ID = ?) AND f.Status = 'Accepted'`,
      [userId, userId, userId]
    );

    const friendIds = (friendRows as any[]).map(row => row.FriendID);
    if (friendIds.length === 0) {
      return res.status(200).json({ status: "success", message: "No friends found", carpool: null });
    }

    // get carpool from this event that any friend is a part of
    const placeholders = friendIds.map(() => '?').join(',');
    const [carpoolRows] = await pool.query(
        `SELECT 
           DISTINCT c.CarpoolID,
           c.EventID,
           c.HostUserID,
           u.Name AS HostName,
           c.AvailableSeats,
           c.Notes as Description,
           fMatch.UserID AS FriendUserID,
           fMatch.Name AS FriendName
         FROM Carpools c
         JOIN CarpoolParticipants cp ON cp.CarpoolID = c.CarpoolID
         JOIN Users u ON u.UserID = c.HostUserID
         JOIN Users fMatch ON fMatch.UserID = cp.UserID
         WHERE c.EventID = ?
           AND cp.UserID IN (${placeholders})
         LIMIT 1`,
        [eventId, ...friendIds]
      );

    if ((carpoolRows as any[]).length === 0) {
      return res.status(200).json({ status: "success", message: "No friend carpools found", carpool: null });
    }

    // just return the first friend carpool found
    const friendCarpool = (carpoolRows as any[])[0];

    res.status(200).json({ status: "success", carpool: friendCarpool });

  } catch (error) {
    console.error("Error finding friend's carpool:", error);
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
