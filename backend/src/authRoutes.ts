import express, { Request, Response } from "express";
import { authenticateUser } from "./authEndpoint";

const router = express.Router();

interface LoginRequestBody {
    email: string;
    password: string;
}

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

export default router;