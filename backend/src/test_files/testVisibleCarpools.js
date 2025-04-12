fetch("http://localhost:8080/api/carpool/visible/18") // replace 19 with logged-in user ID
  .then(res => res.json())
  .then(data => console.log("Visible Carpools:", data))
  .catch(err => console.error("Error:", err));
