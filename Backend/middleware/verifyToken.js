import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import userModel from "../models/userModel.js"; // Import User model

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyToken = async (req, res, next) => {
    
    try{

        const token = req.cookies.authToken || req.headers.authorization?.split(" ")[1];

        if(!token){

            console.log("Unauthenticated No Token Provided");
            return res.status(401).json({ success: false, message: "Unauthenticated - No token provided" });
        }

        console.log("Verifying Token:", token);

        try{

            // Attempt to verify as a Google OAuth token
            const googleUser = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = googleUser.getPayload();
            req.userId = payload.sub; // Google User ID (sub)
            req.isGoogleUser = true;

            console.log("Google User Verified:", req.userId);
            return next();
        } 
        
        catch(googleError){

            console.log("Not a Google token, trying JWT...");
        }

        // If not a Google token, verify JWT token
        const verified = jwt.verify(token, process.env.JWT_KEY);
        req.userId = verified.userId;
        req.isGoogleUser = false;

        console.log("JWT User Verified:", req.userId);
        next();
    } 
    
    catch(error){

        console.log("Error in verifyToken:", error);
        if(error.name === "TokenExpiredError"){

            console.log("Unauthorized Token expired")
            return res.status(401).json({ success: false, message: "Unauthorized - Token expired" });
        }

        console.log("Internal Sever Error");
        
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
