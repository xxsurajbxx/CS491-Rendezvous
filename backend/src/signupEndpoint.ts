import { pool } from "./db";
import jwt from "jsonwebtoken"; // run "npm install jsonwebtoken"
import bcrypt from "bcryptjs"; // run "npm install bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET as string;

interface SignupResponse {
    status: "success" | "fail";
    message: string;
}

export const registerUser = async (firstName: string, lastName: string, username: string, email: string, password: string, address: string): Promise<SignupResponse> => {
    try {
        const [emailCheck] = await pool.query("SELECT * FROM Users WHERE Email = ?", [email]);
        if (Array.isArray(emailCheck) && emailCheck.length > 0) {
          return { status: "fail", message: "Email is already registered" };
        }
    
        // check if username already exists
        const [usernameCheck] = await pool.query("SELECT * FROM Users WHERE Username = ?", [username]);
        if (Array.isArray(usernameCheck) && usernameCheck.length > 0) {
          return { status: "fail", message: "Username is already taken" };
        }

        // combining first and last name with a space
        const fullName = `${firstName} ${lastName}`.trim();

        // hashing password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // putting user into db
        await pool.query(
            "INSERT INTO Users (Name, Username, Email, HashedPassword, Address) VALUES (?, ?, ?, ?, ?)",
            [fullName, username, email, hashedPassword, address]
        );

        return { status: "success", message: "User registered successfully" };
    } catch (error) {
        console.error("Error registering user:", error);
        return { status: "fail", message: "Internal server error" };
    }
};