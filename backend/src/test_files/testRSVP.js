fetch("http://localhost:8080/api/rsvp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: 4, eventId: 3 })
  })
    .then(res => res.json())
    .then(data => console.log("RSVP Response:", data))
    .catch(err => console.error("Error:", err));
  