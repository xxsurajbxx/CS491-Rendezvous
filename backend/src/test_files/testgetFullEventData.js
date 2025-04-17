const eventId = 20;

fetch(`http://localhost:8080/api/events/${eventId}/full`)
  .then(async response => {
    const text = await response.text();
    console.log("Raw Response:", text);

    try {
      const json = JSON.parse(text);
      console.log("Parsed JSON:", JSON.stringify(json, null, 2));
    } catch (e) {
      console.error("Error: Response is not valid JSON");
    }
  })
  .catch(error => console.error("Fetch error:", error));
