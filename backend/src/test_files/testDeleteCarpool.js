fetch("http://localhost:8080/api/carpool/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      carpoolId: 1,  // replace with the actual CarpoolID
      userId: 19     // replace with the hostuserid of that carpool
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log("Delete Carpool Response:", data))
    .catch((err) => console.error("Error:", err));
  