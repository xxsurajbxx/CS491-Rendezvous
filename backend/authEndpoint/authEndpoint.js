const mysql = require("mysql2");
const jwt = require("jsonwebtoken"); // run "npm install jsonwebtoken"
const bcrypt = require("bcryptjs"); // run "npm install bcryptjs"
require("dotenv").config({ path: "../../.env"});

const JWT_SECRET = process.env.JWT_SECRET;

const connection = mysql.createConnection({
    host: process.env.DB_HOST,     
    port: process.env.DB_PORT,       
    user: process.env.DB_USER,       
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME 
});

// function to authenticate user login and generate a JWT
const authenticateUser = async (email, password) => {
    try {
        const [rows] = await connection.promise().query("SELECT * FROM Users WHERE Email = ?", [email]); // query database for user by email
    
        // check if user exists
    if (rows.length === 0) {
        return { status: "fail", message: "User not found"};
    }
    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.HashedPassword);
    if (!isMatch) {
        return { status: "fail", message: "Invalid password"};
    }

    const token = jwt.sign(
        { userId: user.UserID, email: user.Email, name: user.Name},
        JWT_SECRET,
        { expiresIn: "1h"}
    );

    return { status: "success", token };
    } catch (error) {
        console.error("error authenticating user:", error.message);
        return { status: "fail", message: "internal server error" };
    }
};

authenticateUser("testuser@example.com", "testpassword").then(console.log);
