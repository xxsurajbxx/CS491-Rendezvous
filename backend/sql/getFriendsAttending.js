require('dotenv').config({ path: '../../.env' });
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// function get to get the count of friends RSVPing for an event
const getFriendsAttending = async (eventId) => {
    const query = `
    SELECT
        e.EventID,
        e.Name AS EventName,
        COUNT(DISTINCT f.FriendID) AS FriendsAttending -- count unique friends attending
        FROM Events e
        JOIN RSVP r on e.EventID = r.EventID -- match rsvp entries for the event
        JOIN Friends f ON (f.User1ID = r.UserID or f.User2ID = r.UserID) -- find friends who rsvp'd
        WHERE e.EventID = ?
        GROUP BY e.EventID, e.Name;
        `;

        try {
            const [rows] = await pool.query(query, [eventId]);
            return rows.length ? rows[0] : { EventID: eventId, FriendsAttending: 0 };
        } catch (error) {
            console.error("Error fetching friends attending:", error.message);
            return null;
        }
    };

    // run the function for an example EventID (replace 1 with a real event ID)
getFriendsAttending(1).then((result) => {
    console.log("Friends Attending:", result);
    process.exit();
});