import { Request, Response } from "express";
import { pool } from "./db";

export const getUserData = async (req: Request, res: Response): Promise<void> => {
  const profileUserId = req.params.userId
  const viewerId = req.params.viewerId

  if (!profileUserId) {
    res.status(400).json({ 
      status: "fail", 
      message: "Missing userId" 
    });
  }
  if (!viewerId) {
    res.status(400).json({ 
      status: "fail", 
      message: "Missing viewerId" 
    });
  }

  try {
    // getting user data
    const [userRows] = await pool.query("SELECT UserID, Name, Username, Email, Address, Description FROM Users WHERE UserID = ?", [profileUserId]);
    if (!Array.isArray(userRows) || userRows.length === 0) {
      res.status(404).json({ status: "fail", message: "User not found" });
      return;
    }

    const user = userRows[0];

    // get friend user IDs
    const [friendIdRows] = await pool.query(
      `SELECT 
         CASE 
           WHEN f.User1ID = ? THEN f.User2ID 
           ELSE f.User1ID 
         END AS FriendID
       FROM Friends f
       WHERE (f.User1ID = ? OR f.User2ID = ?) AND f.Status = 'Accepted'`,
      [profileUserId, profileUserId, profileUserId]
    );

    const friendIds = new Set((friendIdRows as any[]).map(row => row.FriendID));
    friendIds.add(Number(profileUserId)); // include the user themself

    // getting RSVPd events where host is user/friend or event is public
    const [eventRows] = await pool.query(`
      SELECT 
        e.EventID,
        e.Name AS EventName,
        e.startDateTime,
        e.endDateTime,
        r.Timestamp AS RSVPTimestamp,
        CASE
          WHEN NOW() < e.startDateTime THEN 'Upcoming'
          WHEN NOW() >= e.startDateTime AND NOW() <= e.endDateTime THEN 'Ongoing'
          WHEN NOW() > e.endDateTime THEN 'Over'
          ELSE 'Unknown'
        END AS EventState
      FROM RSVP r
       JOIN Events e ON r.EventID = e.EventID
       WHERE r.UserID = ? -- profile's rsvps
         AND (
           e.IsPublic = 1 -- all public events
           OR e.HostUserID = ?  -- private events the viewer hosts
          OR EXISTS (                               -- private events where viewer is an accepted friend
            SELECT 1
            FROM Friends f
            WHERE f.Status = 'Accepted'
              AND (
                (f.User1ID = e.HostUserID AND f.User2ID = ?)
                OR
                (f.User2ID = e.HostUserID AND f.User1ID = ?)
              )
          )
        )`,
      [profileUserId, viewerId, viewerId, viewerId]
    );

    // getting friends
    const [friendRows] = await pool.query(`
        SELECT 
          f.FriendID,
          u.UserID,
          u.Name,
          u.Username,
          u.Email,
          u.Address,
          f.Since
        FROM Friends f
        JOIN Users u ON (u.UserID = f.User1ID OR u.UserID = f.User2ID)
        WHERE (f.User1ID = ? OR f.User2ID = ?)
          AND f.Status = 'Accepted'
          AND u.UserID != ?
      `, [profileUserId, profileUserId, profileUserId]);

    res.json({
      status: "success",
      data: {
        user,
        events: eventRows,
        friends: friendRows
      }
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
