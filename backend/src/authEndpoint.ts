import { pool } from "./db";
import jwt from "jsonwebtoken"; // run "npm install jsonwebtoken"
import bcrypt from "bcryptjs"; // run "npm install bcryptjs"
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../../.env" });

const JWT_SECRET = process.env.JWT_SECRET as string;


interface AuthResponse {
    status: "success" | "fail";
    message?: string;
    token?: string;
}

// function to authenticate user login and generate a JWT
export const authenticateUser = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const [rows] = await pool.query("SELECT * FROM Users WHERE Email = ?", [email]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return { status: "fail", message: "User not found" };
        }

        const user: any = rows[0];

        const isMatch = await bcrypt.compare(password, user.HashedPassword);
        if (!isMatch) {
            return { status: "fail", message: "Invalid password" };
        }

        const token = jwt.sign(
            { userId: user.UserID, email: user.Email, name: user.Name },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return { status: "success", token };
    } catch (error) {
        console.error("Error authenticating user:", error instanceof Error ? error.message : error);
        return { status: "fail", message: "Internal server error" };
    }
};

authenticateUser("testuser@example.com", "testpassword").then(console.log);
