import { Request, Response } from "express";
import { pool } from "./db";

export const searchUsers = async (req: Request, res: Response): Promise<Response> => {
  const { query } = req.query;
  if (!query || typeof query !== "string") {
    return res
      .status(400)
      .json({ status: "fail", message: "Missing or invalid qquery parameter" });
  }

  // escape any regex-special characters
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  try {
    const [rows] = await pool.query(
      `SELECT
         UserID,
         Name,
         Username,
         Email
       FROM Users
       WHERE Name REGEXP ?
          OR Username REGEXP ?
       LIMIT 50`,
      [escaped, escaped]
    );

    return res.status(200).json({
        status: "success",
        data: rows
      });
    } catch (err) {
      console.error("Error searching users:", err);
      return res
        .status(500)
        .json({ status: "fail", message: "Internal server error" });
    }
  };