import { Request, Response } from "express";
import { pool } from "./db";

export const recommendFriends = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ 
        status: "fail", 
        message: "Missing userId" 
    });
  }

  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT u.UserID, u.Name, u.Username
      FROM Users u
      WHERE u.UserID IN (
        SELECT
          CASE
            WHEN f2.User1ID = f1.FriendID THEN f2.User2ID
            ELSE f2.User1ID
          END AS FriendOfFriend
        FROM (
          SELECT
            CASE
              WHEN f.User1ID = ? THEN f.User2ID
              ELSE f.User1ID
            END AS FriendID
          FROM Friends f
          WHERE (f.User1ID = ? OR f.User2ID = ?) AND f.Status = 'Accepted'
        ) AS f1
        JOIN Friends f2
          ON (f2.User1ID = f1.FriendID OR f2.User2ID = f1.FriendID)
        WHERE f2.Status = 'Accepted'
          AND ? NOT IN (f2.User1ID, f2.User2ID)
      )
      AND u.UserID != ?
      AND u.UserID NOT IN (
        SELECT 
          CASE
            WHEN f.User1ID = ? THEN f.User2ID
            ELSE f.User1ID
          END
        FROM Friends f
        WHERE f.User1ID = ? OR f.User2ID = ?
      )
      `,
      [userId, userId, userId, userId, userId, userId, userId, userId]
    );

    return res.status(200).json({ status: "success", recommendations: rows });
  } catch (error) {
    console.error("Error recommending friends:", error);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
