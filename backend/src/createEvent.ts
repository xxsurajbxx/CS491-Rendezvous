import { Request, Response } from "express";
import { pool } from "./db";

// function to create an event
export const createEvent = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, startDateTime, endDateTime, location, hostUserID, ticketmasterLink, description, image, isPublic } = req.body;

        // validate required fields
        if (!name || !startDateTime || !location || !hostUserID) {
            return res.status(400).json({ status: "fail", message: "Missing required fields" });
        }

        // insert into the database
        const [result] = await pool.query(
            `INSERT INTO Events (Name, startDateTime, endDateTime, Location, HostUserID, TicketmasterLink, Description, Image, IsPublic) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                startDateTime,
                endDateTime || null, // Allow null if not provided
                location,
                hostUserID,
                ticketmasterLink || null,
                description || null,
                image || null,
                isPublic ?? true
            ]
        );

        return res.status(201).json({
            status: "success",
            message: "Event created successfully",
            eventID: (result as any).insertId,
        });

    } catch (error) {
        console.error("Error creating event:", error);
        return res.status(500).json({ status: "fail", message: "Internal server error" });
    }
};
