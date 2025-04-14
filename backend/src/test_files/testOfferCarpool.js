fetch("http://localhost:8080/api/carpool/offer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: 19,         // replace with the host user ID
      eventId: 20,        // replace with the event ID
      maxSeats: 4,
      notes: "leaving from newark. i have 3 open seats"
    })
  })
    .then(res => res.json())
    .then(data => console.log("Offer Carpool Response:", data))
    .catch(err => console.error("Error:", err));
  