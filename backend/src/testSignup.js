fetch("http://localhost:8080/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        firstName: "John",
        lastName: "Test3",
        email: "john3@test.com",
        password: "testpassword"
    })
})
.then(response => response.json())
.then(data => console.log("Signup Response:", data))
.catch(error => console.error("Error during signup:", error));