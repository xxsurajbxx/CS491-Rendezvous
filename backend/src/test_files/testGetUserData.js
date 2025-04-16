fetch("http://localhost:8080/api/user/19/data") // replace 2 with the logged-in user ID
  .then(response => response.json())
  .then(data => console.log("User Data:", data))
  .catch(error => console.error("Error:", error));
