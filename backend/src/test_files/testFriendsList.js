fetch("http://localhost:8080/api/friends/all/2") // replace the number at the end with the logged-in user ID
  .then(response => response.json())
  .then(data => console.log("Friends List:", data))
  .catch(error => console.error("Error:", error));
