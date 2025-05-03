import { pool } from "./db";
import jwt from "jsonwebtoken"; // run "npm install jsonwebtoken"
import bcrypt from "bcryptjs"; // run "npm install bcryptjs"


const JWT_SECRET = process.env.JWT_SECRET as string;


interface AuthResponse {
    status: "success" | "fail";
    message?: string;
    token?: string;
}

// function to authenticate user login and generate a JWT
export const authenticateUser = async (email: string, password: string, existingToken?: string): Promise<AuthResponse> => {
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

        let expiresIn: jwt.SignOptions["expiresIn"] = "1h";

        if (existingToken) {
            const decoded = jwt.decode(existingToken) as { exp?: number } | null;
            const now = Math.floor(Date.now() / 1000);
      
            if (decoded?.exp && decoded.exp > now) {
              const remainingTime = decoded.exp - now;
              expiresIn = `${remainingTime}s`;
            }
          }

        const token = jwt.sign(
            { userId: user.UserID, email: user.Email, name: user.Name, address: user.Address, verified: user.IsVerified },
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
