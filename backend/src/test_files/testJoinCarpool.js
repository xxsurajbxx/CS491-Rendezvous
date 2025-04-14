fetch("http://localhost:8080/api/carpool/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: 18,
      carpoolId: 2
    })
  })
    .then(res => res.json())
    .then(data => console.log("Join Carpool:", data))
    .catch(err => console.error("Error:", err));
  