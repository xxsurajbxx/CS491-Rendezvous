fetch("http://localhost:8080/api/friends/requests/count/5") // the number at the end is the user that is getting incoming friend requests
  .then(res => res.json())
  .then(data => console.log("Incoming request count:", data))
  .catch(err => console.error("Error:", err));
