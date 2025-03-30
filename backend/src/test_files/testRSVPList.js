// you can change to ?eventId=5 to list by event
fetch("http://localhost:8080/api/rsvp?eventId=3")
  .then(res => res.json())
  .then(data => console.log("RSVP List:", data))
  .catch(err => console.error("Error:", err));
