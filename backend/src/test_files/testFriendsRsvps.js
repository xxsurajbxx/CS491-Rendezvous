fetch("http://localhost:8080/api/rsvp/friends/22/rsvps")
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    console.log("Friends' RSVPs:", JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error("Error fetching friends' RSVPs:", err.message);
  });
