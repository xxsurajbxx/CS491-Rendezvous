fetch("http://localhost:8080/api/carpool/1/members") // replace 1 with actual carpoolID
  .then(res => res.json())
  .then(data => console.log("Carpool Members:", data))
  .catch(err => console.error("Error:", err));
