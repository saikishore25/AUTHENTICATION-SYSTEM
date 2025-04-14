import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userModel from "./models/userModel.js"; // Adjust the path to your User model
import generateTokenAndSetCookie from "./utils/generateTokenAndSetCookie.js";


passport.use(

    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `https://authentication-system-backend-sand.vercel.app/api/auth/google/callback`,
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
              let user = await userModel.findOne({ email: profile.emails[0].value });
          
              if (user) {
                
                console.log("✅ Existing Google user logging in:", user.email);
                return done(null, user);
              }
          
              user = new userModel({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                isVerified: true,
              });
          
              await user.save();
              console.log("✅ New Google user saved:", user); // ✅ Add this
              return done(null, user);
            } catch (error) {
              console.error("❌ Error in GoogleStrategy:", error); // ❗ Add this
              return done(error, null);
            }
          }
          
    )
);

  

passport.serializeUser((user, done) => {
    
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {

    try{

        const user = await userModel.findById(id);
        done(null, user);
    } 
    
    catch(error){

        done(error, null);
    }
});

export default passport;