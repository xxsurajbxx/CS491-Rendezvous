fetch("http://localhost:8080/api/events/user-events")
    .then(async response => {
        const text = await response.text();
        console.log("Raw Response:", text);

        try {
            const json = JSON.parse(text);
            console.log("Parsed JSON:", json);
        } catch (e) {
            console.error("Error: Response is not valid JSON");
        }
    })
    .catch(error => console.error("Fetch error:", error));
