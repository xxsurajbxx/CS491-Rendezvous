import { Request, Response } from "express";
import { pool } from "./db";

export const addFriend = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId, friendId } = req.body;

      if (!userId || !friendId) {
        return res.status(400).json({ status: "fail", message: "Missing User ID or Friend ID"});
      }

      // check if theyre already friends

      const [existing] = await pool.query(
        `SELECT * FROM Friends WHERE (User1ID = ? AND User2ID = ?) OR (User1ID = ? AND User2ID = ?)`,
        [userId, friendId, friendId, userId]
      );

      if (Array.isArray(existing) && existing.length > 0) {
        return res.status(409).json({ status: "fail", message: "Friend request already exists or users are already friends" });
      }

      // insert new friendship (pending)
      await pool.query(
        "INSERT INTO Friends (User1ID, User2ID, Status) VALUES (?, ?, 'Pending')",
        [userId, friendId]
      );

      return res.status(201).json({ status: "success", message: "Friend request sent" });

    } catch (error) {
        console.error("Error adding friend:", error);
        return res.status(500).json({ status: "fail", message: "Internal server error" });
    }
    };