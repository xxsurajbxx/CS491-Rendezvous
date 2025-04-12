fetch("http://localhost:8080/api/update-profile/18", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "johnupdatedtest2",
      address: "", // leave fields empty if you dont want to change them
      description: "test", // or you can leave it to what its currently set to and it wont change it because it detects
      currentPassword: "",
      newPassword: ""
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Profile Update Response:", data);
      if (data.token) {
        console.log("New JWT Token:", data.token);
      }
    })
    .catch(err => console.error("Error:", err));
  