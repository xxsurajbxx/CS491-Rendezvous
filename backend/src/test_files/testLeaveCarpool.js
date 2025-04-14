fetch("http://localhost:8080/api/carpool/leave", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: 18,
      carpoolId: 1
    })
  })
    .then(res => res.json())
    .then(data => console.log("Leave Carpool:", data))
    .catch(err => console.error("Error:", err));
  