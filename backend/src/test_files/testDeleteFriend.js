fetch("http://localhost:8080/api/friends/delete/1", { // replace number at the end with the friendship you want to delete
    method: "DELETE"
  })
    .then((res) => res.json())
    .then((data) => console.log("Delete Friend Response:", data))
    .catch((err) => console.error("Error:", err));
  