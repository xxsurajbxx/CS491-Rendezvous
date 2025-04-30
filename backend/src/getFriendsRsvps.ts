import { Request, Response } from "express";
import { pool } from "./db";

export const getFriendsRsvps = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.params;
  if (!userId) {
    return res
      .status(400)
      .json({ status: "fail", message: "Missing userId parameter" });
  }

  try {
    const query = `
      WITH FriendList AS (
        SELECT
          CASE 
            WHEN User1ID = ? THEN User2ID
            ELSE User1ID
          END AS friendId
        FROM Friends
        WHERE Status = 'Accepted'
          AND (User1ID = ? OR User2ID = ?)
      )
      SELECT
        e.EventID,
        e.Name AS EventName,
        e.StartDateTime,
        e.EndDateTime,
        e.Location,
        e.Description,
        u.Name AS FriendName,
        u.Email AS FriendEmail
      FROM RSVP r
      JOIN Events e ON r.EventID = e.EventID
      JOIN Users u ON r.UserID = u.UserID
      WHERE
        r.UserID IN (SELECT friendId FROM FriendList)
        AND (
          e.IsPublic = TRUE
          OR (
            e.IsPublic = FALSE
            AND e.HostUserID IN (SELECT friendId FROM FriendList)
          )
        );
    `;

    const [rows] = await pool.query(query, [userId, userId, userId]);
    return res.json({ status: "success", data: rows });
  } catch (err) {
    console.error("Error fetching friends' RSVPs:", err);
    return res
      .status(500)
      .json({ status: "fail", message: "Internal server error" });
  }
};