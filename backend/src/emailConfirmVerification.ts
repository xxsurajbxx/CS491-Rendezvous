import { Request, Response } from "express";
import { pool } from "./db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const confirmVerificationCode = async (req: Request, res: Response) => {
    const { userId, code } = req.body;
  
    if (!userId || !code) {
      return res.status(400).json({ status: "fail", message: "Missing userId or code" });
    }
  
    try {
      const [rows] = await pool.query(
        `SELECT * FROM EmailVerifications 
         WHERE UserID = ? AND Code = ? AND Used = false AND ExpiresAt > NOW() 
         ORDER BY CreatedAt DESC LIMIT 1`,
        [userId, code]
      );
  
      const result = rows as any[];
  
      if (result.length === 0) {
        return res.status(400).json({ status: "fail", message: "Invalid or expired code" });
      }
  
      // mark as used
      await pool.query(`UPDATE EmailVerifications SET Used = true WHERE VerificationID = ?`, [result[0].VerificationID]);
  
      // mark user as verified
      await pool.query(`UPDATE Users SET IsVerified = true WHERE UserID = ?`, [userId]);

      // get user info to include in JWT
      const [userRows] = await pool.query(
        `SELECT UserID, Email, Name, Address FROM Users WHERE UserID = ?`,
        [userId]
      );
      const user = (userRows as any[])[0];

      //generate updated jwt
      const token = jwt.sign(
        { userId: user.UserID, email: user.Email, name: user.Name, address: user.Address, verified: true },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

  
      return res.status(200).json({ status: "success", message: "Email verified", token });
  
    } catch (error) {
      console.error("Error confirming code:", error);
      return res.status(500).json({ status: "fail", message: "Internal server error" });
    }
  };
  