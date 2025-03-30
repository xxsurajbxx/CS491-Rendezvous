fetch("http://localhost:8080/api/friends/respond/2", { // replace number at the end with the friend id
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      friendId: 1, // replace with actual FriendID
      action: "accept" // or "reject"
    })
  })
    .then(response => response.json())
    .then(data => console.log("Friend Request Response:", data))
    .catch(error => console.error("Error:", error));
  