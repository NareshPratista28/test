import express from "express";
import { getUsers, getUserById, registerUser, loginUser } from "../controllers/user.js";


const router = express.Router();

router.get("/pengguna", getUsers);

router.get("/pengguna/:id", getUserById);

router.post("/register", registerUser);

router.post("/login", loginUser);

export default router
