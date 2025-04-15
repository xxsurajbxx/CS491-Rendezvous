import { Request, Response } from "express";
import { pool } from "./db";

export const getUserData = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ status: "fail", message: "Missing userId" });
    return;
  }

  try {
    // getting user data
    const [userRows] = await pool.query("SELECT UserID, Name, Username, Email, Address, Description FROM Users WHERE UserID = ?", [userId]);
    if (!Array.isArray(userRows) || userRows.length === 0) {
      res.status(404).json({ status: "fail", message: "User not found" });
      return;
    }

    const user = userRows[0];

    // getting RSVPd events
    const [eventRows] = await pool.query(`
      SELECT 
        e.EventID,
        e.Name AS EventName,
        e.startDateTime,
        r.Status AS RSVPStatus,
        r.Timestamp AS RSVPTimestamp
      FROM RSVP r
      JOIN Events e ON r.EventID = e.EventID
      WHERE r.UserID = ?
    `, [userId]);

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
      `, [userId, userId, userId]);

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
