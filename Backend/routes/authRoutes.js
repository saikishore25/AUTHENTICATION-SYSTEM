import express from "express";
import passport from "passport";
import {signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth, googleAuth} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/verify-email", verifyEmail)
router.post("/login", login)
router.post("/forgot-password", forgotPassword);
router.post("/logout", logout);
router.post("/reset-password/:code", resetPassword);
router.get("/check-auth", verifyToken, checkAuth);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] })); 

router.get(
"/google/callback",
passport.authenticate("google", { session: false, failureRedirect: "/login" }),
googleAuth
);


  
export default router;
