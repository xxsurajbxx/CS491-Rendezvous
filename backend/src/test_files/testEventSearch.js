fetch("http://localhost:8080/api/events/search?query=shoprite", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
    .then(response => response.json())
    .then(data => console.log("Search Results:", data))
    .catch(error => console.error("Error:", error));
  