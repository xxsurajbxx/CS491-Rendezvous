fetch("http://localhost:8080/api/carpool/1/remove/5", {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => console.log("Remove Member:", data))
    .catch(err => console.error("Error:", err));
  