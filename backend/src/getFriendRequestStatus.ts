import { Request, Response } from "express";
import { pool } from "./db";

export const getFriendRequestStatus = async (req: Request, res: Response): Promise<Response> => {
  const { userId1, userId2 } = req.query;

  if (!userId1 || !userId2) {
    return res.status(400).json({ status: "fail", message: "Missing userId1 or userId2" });
  }

  try {
    // get friendship record and join both users to grab their usernames
    const [rows] = await pool.query(
      `SELECT f.FriendID, f.User1ID, f.User2ID, f.Status, u1.Username AS User1Username, u2.Username AS User2Username
       FROM Friends f
       JOIN Users u1 on f.User1ID = u1.UserID
       JOIN Users u2 on f.User2ID = u2.UserID
       WHERE 
         (f.User1ID = ? AND f.User2ID = ?)
         OR 
         (f.User1ID = ? AND f.User2ID = ?)`,
      [userId1, userId2, userId2, userId1]
    );

        const result = rows as any[];

        // no relationship found between the users
        if (result.length === 0) {
            return res.status(200).json({
                status: "success",
                friendStatus: "Add Friend",
            });
        }

        // destructuring friend data
        const {
            FriendID,
            User1ID,
            User2ID,
            Status,
            User1Username,
            User2Username,
        } = result[0];

        const uid1 = Number(userId1);
        const uid2 = Number(userId2);
        let friendStatus = "Unknown";

        // status specific logic
        if (Status === "Accepted") {
            friendStatus = "Unfriend";
        } else if (Status === "Pending") {
            if (User1ID === uid2 && User2ID === uid1) {
                // the other user sent the request
                friendStatus = "Accept Friend Request";
            } else if (User1ID === uid1 && User2ID === uid2) {
                // you sent the request
                friendStatus = "Pending";
            }
        }
        // return final result with relationship info
        return res.status(200).json({
            status: Status, // actual DB status
            friendStatus,  // used for UI
            friendId: FriendID,
            fromUser: User1Username,
            toUser: User2Username,
        });

    } catch (error) {
        console.error("Error checking friend status:", error);
        return res.status(500).json({
            status: "fail",
            message: "Internal server error",
        });
    }
};