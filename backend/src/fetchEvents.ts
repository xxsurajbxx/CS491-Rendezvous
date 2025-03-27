import axios from "axios";
const HASDATA_API_KEY = process.env.HASDATA_API_KEY as string;

interface FetchEventsResponse {
  status: "success" | "fail";
  data?: any;
  message?: string;
}

// fetches events from HASDATA Google SERP API based on given query
export const fetchEvents = async (query: string): Promise<FetchEventsResponse> => {
  try {
    const encodedQuery = encodeURIComponent(query); // encode the query to make sure it's safe for use in API request url
    const response = await axios.get(
      `https://api.hasdata.com/scrape/google/events?q=${encodedQuery}`,
      {
        headers: {
          "x-api-key": HASDATA_API_KEY,
        },
      }
    );
    // return the response data if the request was successful
    return { status: "success", data: response.data };
  } catch (error) {
    console.error("Error fetching events:", error instanceof Error ? error.message : error);
    return { status: "fail", message: "API request failed" };
  }
};

// test query
fetchEvents("concerts in Newark").then(console.log);