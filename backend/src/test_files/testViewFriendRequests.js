fetch("http://localhost:8080/api/friends/requests/3") // replace the number at the end with the current user's ID
  .then(response => response.json())
  .then(data => console.log("Pending Friend Requests:", data))
  .catch(error => console.error("Error:", error));
