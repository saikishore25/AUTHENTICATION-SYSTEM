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

app.use(cors({origin: [`https://authentication-system-frontend-taupe.vercel.app`],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowing all methods
    allowedHeaders: ["Content-Type", "Authorization"], credentials: true}))
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false ,
    cookie: {
        sameSite: "none", // Allow cross-site cookies
        secure: true // Only send cookies over HTTPS
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/favicon.ico', (req, res) => res.status(204));
app.get("/", (req, res)=>{

    res.send("API IS WORKING");

})

app.use("/api/auth", authRoutes);

app.listen(PORT, ()=>{

    console.log(`Server Started on Port: ${PORT}`);

})

// export default app;