import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./DB/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "./passport.js";
import "./passport.js";

const app = express();
const PORT = process.env.PORT || 4001;

connectDB();

// ✅ CORS middleware first
app.use(cors({
  origin: "https://authentication-system-frontend-taupe.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors({
  origin: "https://authentication-system-frontend-taupe.vercel.app",
  credentials: true,
}));

// ✅ THEN the rest
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "none",
    secure: true
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("API IS WORKING");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server Started on Port: ${PORT}`);
});
