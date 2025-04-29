import { Request, Response } from "express";
import { pool } from "./db";

export const deleteEvent = async (req: Request, res: Response): Promise<Response> => {
  const { eventId, userId } = req.params;
  if (!eventId || !userId) {
    return res.status(400).json({ status: "fail", message: "Missing eventId or userId" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // make sure this user is the host
    const [evtRows]: any[] = await conn.query(
      `SELECT HostUserID FROM Events WHERE EventID = ?`,
      [eventId]
    );
    if (!evtRows.length || evtRows[0].HostUserID !== Number(userId)) {
      await conn.rollback();
      return res.status(403).json({ status: "fail", message: "Not authorized" });
    }

    // remove RSVPs
    await conn.query(
      `DELETE FROM RSVP WHERE EventID = ?`,
      [eventId]
    );

    // remove carpool participants for this event
    await conn.query(
      `DELETE cp
       FROM CarpoolParticipants cp
       JOIN Carpools c ON c.CarpoolID = cp.CarpoolID
       WHERE c.EventID = ?`,
      [eventId]
    );

    // remove carpools
    await conn.query(
      `DELETE FROM Carpools WHERE EventID = ?`,
      [eventId]
    );

    // remove map entries
    await conn.query(
      `DELETE FROM Map WHERE EventID = ?`,
      [eventId]
    );

    // remove the event itself
    await conn.query(
      `DELETE FROM Events WHERE EventID = ?`,
      [eventId]
    );

    await conn.commit();
    return res.json({ status: "success", message: "Event and all related data deleted" });

  } catch (err) {
    await conn.rollback();
    console.error("Error deleting event:", err);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  } finally {
    conn.release();
  }
};
