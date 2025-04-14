fetch("http://localhost:8080/api/carpool/1/invite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: 5 // replace with actual userID
    })
  })
    .then(res => res.json())
    .then(data => console.log("Invite Member:", data))
    .catch(err => console.error("Error:", err));
  