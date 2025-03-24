fetch("http://localhost:5000/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        firstName: "John",
        lastName: "Test",
        email: "john2@test.com",
        password: "testpassword"
    })
})
.then(response => response.json())
.then(data => console.log("Signup Response:", data))
.catch(error => console.error("Error during signup:", error));
