fetch("http://localhost:8080/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        name: "NJIT Hackathon 2025",
        startDateTime: "2025-06-01 09:00:00",
        endDateTime: "2025-06-01 21:00:00",
        location: "Newark, NJ",
        hostUserID: 1,
        ticketmasterLink: "https://example.com/hackathon2025",
        description: "Annual coding hackathon event",
        image: "x",
        isPublic: true
    })
})
.then(response => response.json())
.then(data => console.log("Response:", data))
.catch(error => console.error("Error:", error));
