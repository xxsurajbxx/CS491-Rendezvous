import axios from "axios";
import dotenv from "dotenv";
const mysql = require('mysql2');

dotenv.config();

const HASDATA_API_KEY = process.env.HASDATA_API_KEY;
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// fetches events from HASDATA Google SERP API based on given query
const fetchEvents = async (query) => {
    try {
        const encodedQuery = encodeURIComponent(query); // encode the query to make sure it's safe for use in API request url
        const response = await axios.get(`https://api.hasdata.com/scrape/google/events?q=${encodedQuery}`, {
            headers: {
                "x-api-key": HASDATA_API_KEY
            }
        });

        // return the response data if the request was successful
        return { status: "success", data: response.data };
    } catch (error) {
        // log error and return failure response
        console.error("Error fetching events:", error.message);
        return { status: "fail", message: "API request failed" };
    }
};
// test query
fetchEvents("concerts in Newark").then(console.log);