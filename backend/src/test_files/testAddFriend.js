fetch("http://localhost:8080/api/friends/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: 15,       // replace with a valid UserID
      friendId: 14      // replace with a valid FriendID
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Response:", data))
    .catch((error) => console.error("Error:", error));
  