fetch("http://localhost:8080/api/update-profile/17", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "john updated",
      address: "", // leave fields empty if you dont want to change them
      description: "new new new new", // or you can leave it to what its currently set to and it wont change it because it detects
      currentPassword: "",
      newPassword: ""
    })
  })
    .then(res => res.json())
    .then(data => console.log("Profile Update Response:", data))
    .catch(err => console.error("Error:", err));
  