import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./DB/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "./passport.js";
import "./passport.js"



const app = express();

const PORT = process.env.PORT || 4001;

connectDB();

app.use(cors({origin: `http://localhost:5173`, credentials: true}))
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res)=>{

    res.send("Hello World");

})

app.use("/api/auth", authRoutes);

app.listen(PORT, ()=>{

    console.log(`Server Started on Port: ${PORT}`);

})

