import express from 'express'
import { getUserProfile, loginUser, registerUser } from '../controller/userController.js'
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authMiddleware, getUserProfile);

export default userRouter;