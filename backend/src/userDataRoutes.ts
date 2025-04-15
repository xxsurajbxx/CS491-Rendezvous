import express from "express";
import { getUserData } from "./getUserData";

const router = express.Router();
router.get("/user/:userId/data", getUserData);

export default router;
