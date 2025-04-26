import { Request, Response } from "express";
import { pool } from "./db";
import axios from "axios";

const TICKETMASTER_KEY = process.env.TICKETMASTER_KEY as string;

export const scrapeTicketmasterEvents = async (req: Request, res: Response): Promise<Response> => {
  if (!TICKETMASTER_KEY) {
    console.error("Missing TICKETMASTER_KEY");
    return res.status(500).json({ status: "fail", message: "Missing Ticketmaster API key" });
  }

  let inserted = 0;
  let skipped = 0;
  let page = 0;
  const size = 200; // max allowed by Ticketmaster
  try {
    while (true) {
      console.log(`Fetching page ${page}...`);
    const response = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events.json`, 
      {
        params: {
          apikey: TICKETMASTER_KEY,
          stateCode: "NJ", 
          size,
          page,
          sort: "date,asc"
        }
      }
    );

    const events = response.data._embedded?.events || [];
    if (events.length === 0) {
      console.log("No more events found.");
      break;
    }
    console.log(`Found ${events.length} events`);



    for (const event of events) {
      const externalEventId = event.id;
      const name = event.name;
      const startDateTimeRaw = event.dates?.start?.dateTime || null;
      const endDateTimeRaw = event.dates?.end?.dateTime || null;
      const venue = event._embedded?.venues?.[0];
      const ticketmasterLink = event.url || null;

      // skip if missing necessary fields
      if (!name || !startDateTimeRaw || !ticketmasterLink) {
        console.log(`Skipping incomplete or inactive event: ${name || "Unnamed Event"}`);
        skipped++;
        continue;
      }

      // format start date
      const startDateTime = startDateTimeRaw.replace("T", " ").replace("Z", "");
      const eventDate = new Date(startDateTime);
      const now = new Date();
      if (eventDate < now) {
        console.log(`Skipping past event: ${name}`);
        skipped++;
        continue;
      }

      // dynamically building address
      const addressParts = [];
      if (venue?.address?.line1) addressParts.push(venue.address.line1);
      if (venue?.city?.name) addressParts.push(venue.city.name);
      if (venue?.state?.stateCode) addressParts.push(venue.state.stateCode);
      if (venue?.postalCode) addressParts.push(venue.postalCode);

      const location = addressParts.join(", ") || "Unknown Location";
      const description = event.info || '';
      const image = event.images?.[0]?.url || null;


      // check if event already exists
      const [existing] = await pool.query(
        `SELECT 1 FROM Events WHERE TicketmasterLink = ?`,
        [ticketmasterLink]
      );

      if (Array.isArray(existing) && existing.length > 0) {
        console.log(`Skipping duplicate event: ${name}`);
        skipped++;
        continue;
      }

      const [eventResult]: any = await pool.query(
        `INSERT INTO Events 
         (Name, startDateTime, endDateTime, Location, TicketmasterLink, Description, Image, IsPublic, UserCreated, HostUserID)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          startDateTime,
          endDateTimeRaw ? endDateTimeRaw.replace("T", " ").replace("Z", "") : null,
          location,
          ticketmasterLink,
          description,
          image,
          1,  // ispublic = true
          0,  // usercreated = false
          null // hostuserid null for scraped events
        ]
      );

      const insertedEventId = eventResult.insertId;

      // insert into map table
      const latitude = venue?.location?.latitude;
      const longitude = venue?.location?.longitude;

      if (latitude && longitude) {
        await pool.query(
          `INSERT INTO Map (EventID, Latitude, Longitude) VALUES (?, ?, ?)`,
          [insertedEventId, latitude, longitude]
        );
      }

      console.log(`Inserted event: ${name}`);
      inserted++;
    }
    page++;
  }

    return res.status(200).json({
      status: "success",
      message: `Scraping complete. Inserted: ${inserted}, Skipped: ${skipped}`
    });

  } catch (error) {
    console.error("Error scraping Ticketmaster events:", error);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};