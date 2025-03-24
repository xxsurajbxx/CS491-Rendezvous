import express, { Request, Response } from "express";
import { authenticateUser } from "./authEndpoint";
import { registerUser } from "./signupEndpoint";

const router = express.Router();

interface LoginRequestBody {
    email: string;
    password: string;
}

interface SignupRequestBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

// login
router.post("/login", async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ status: "fail", message: "Missing email or password" });
        return;
    }

    const result = await authenticateUser(email, password);

    if (result.status === "success") {
        res.status(200).json({ message: "Logged in successfully!", token: result.token });
    } else {
        res.status(401).json(result); // Return failure response
    }
});

//signup
router.post("/signup", async (req: Request<{}, {}, SignupRequestBody>, res: Response): Promise<void> => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        res.status(400).json({ status: "fail", message: "Missing name, email, or password" });
        return;
    }

    const result = await registerUser(firstName, lastName, email, password);

    if (result.status === "success") {
        res.status(201).json({ message: result.message });
    } else {
        res.status(400).json(result);
    }
});

export default router;