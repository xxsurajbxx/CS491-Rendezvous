import { Request, Response } from "express";
import axios from "axios";
import { pool } from "./db";

const ORS_KEY = process.env.ORS_KEY as string;

// helper to geocode user's address
const geocodeAddress = async (address: string): Promise<[number, number]> => {
    const response = await axios.get("https://api.openrouteservice.org/geocode/search", {
        params: {
            api_key: ORS_KEY,
            text: address,
        }
    });

    const features = response.data.features;
    if (!features || features.length === 0) {
        throw new Error("Address not found");
    }

    const [lng, lat] = features[0].geometry.coordinates;
    return [lng, lat];
};

export const getTravelInfo = async (req: Request, res: Response): Promise<Response> => {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
        return res.status(400).json({ status: "fail", message: "Missing userId or eventId" });
    }

    try {
        // getting user's address
        const [userRows] = await pool.query("SELECT Address FROM Users WHERE UserID = ?", [userId]);
        if (!Array.isArray(userRows) || userRows.length === 0) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }
        const userAddress = (userRows[0] as any).Address;

        // geocoding user's address
        const origin = await geocodeAddress(userAddress);

        // getting event lat/lon
        const [eventRows] = await pool.query(
            "SELECT Latitude, Longitude FROM Map WHERE EventID = ?", [eventId]
        );
        if (!Array.isArray(eventRows) || eventRows.length === 0) {
            return res.status(404).json({ status: "fail", message: "Event location not found" });
        }
        const destinationLat = (eventRows[0] as any).Latitude;
        const destinationLon = (eventRows[0] as any).Longitude;
        const destination: [number, number] = [destinationLon, destinationLat]; // [lng, lat]

        // calling openrouteservice for driving-car
        const drivingPromise = await axios.post(
            "https://api.openrouteservice.org/v2/matrix/driving-car",
            {
                locations: [origin, destination],
                metrics: ["distance", "duration"],
            },
            {
                headers: {
                    Authorization: ORS_KEY,
                    "Content-Type": "application/json",
                }
            }
        );

        // call openrouteservice for foot-walking
        const walkingPromise = axios.post(
            "https://api.openrouteservice.org/v2/matrix/foot-walking",
            {
                locations: [origin, destination],
                metrics: ["distance", "duration"],
            },
            {
                headers: {
                    Authorization: ORS_KEY,
                    "Content-Type": "application/json",
                }
            }
        );

        // wait for both calls to finish
        const [drivingResponse, walkingResponse] = await Promise.all([drivingPromise, walkingPromise]);

        const drivingData = drivingResponse.data;
        const walkingData = walkingResponse.data;

        return res.json({
            status: "success",
            driving: {
                distanceMeters: drivingData.distances[0][1],
                distanceMiles: (drivingData.distances[0][1] / 1609.34).toFixed(2),
                durationMinutes: (drivingData.durations[0][1] / 60).toFixed(1),
            },
            walking: {
                distanceMeters: walkingData.distances[0][1],
                distanceMiles: (walkingData.distances[0][1] / 1609.34).toFixed(2),
                durationMinutes: (walkingData.durations[0][1] / 60).toFixed(1),
            }
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ status: "fail", message: error.message || "Internal Server Error" });
    }
};
