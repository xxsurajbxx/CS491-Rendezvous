import { Request, Response } from "express";
import { pool } from "./db";

export const cancelRSVP = async (req: Request, res: Response): Promise<void> => {
  const { userId, eventId } = req.params;
  if (!userId || !eventId) {
    res.status(400).json({ status: "fail", message: "Missing userId or eventId" });
    return;
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // delete from RSVPs
    await conn.query(
      `DELETE FROM RSVP WHERE UserID = ? AND EventID = ?`,
      [userId, eventId]
    );

    // find any carpools for this event where this user is a participant
    const [parts]: any[] = await conn.query(
      `SELECT cp.CarpoolID, c.HostUserID
       FROM CarpoolParticipants cp
       JOIN Carpools c ON c.CarpoolID = cp.CarpoolID
       WHERE cp.UserID = ? AND c.EventID = ?`,
      [userId, eventId]
    );

    for (const { CarpoolID, HostUserID } of parts) {
      if (Number(HostUserID) === Number(userId)) {
        // if they’re the host, delete the entire carpool
        await conn.query(
          `DELETE FROM CarpoolParticipants WHERE CarpoolID = ?`,
          [CarpoolID]
        );
        await conn.query(
          `DELETE FROM Carpools WHERE CarpoolID = ?`,
          [CarpoolID]
        );
      } else {
        // otherwise just remove the participant + free up a seat
        await conn.query(
          `DELETE FROM CarpoolParticipants WHERE CarpoolID = ? AND UserID = ?`,
          [CarpoolID, userId]
        );
        await conn.query(
          `UPDATE Carpools SET AvailableSeats = AvailableSeats + 1 WHERE CarpoolID = ?`,
          [CarpoolID]
        );
      }
    }

    await conn.commit();
    res.json({ status: "success", message: "RSVP canceled and carpool updated" });
  } catch (err) {
    await conn.rollback();
    console.error("Error canceling RSVP and cleaning carpools:", err);
    res.status(500).json({ status: "fail", message: "Internal server error" });
  } finally {
    conn.release();
  }
};