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
          callbackURL: "http://localhost:3001/api/auth/google/callback",
          scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
          try {
              let user = await userModel.findOne({ email: profile.emails[0].value });

              if (user) {
                  // If user exists but doesn't have a googleId, update the record
                  if (!user.googleId) {
                      user.googleId = profile.id;
                      await user.save();
                  }
              } 
              else {
                  // Create a new user if email is not found
                  user = new userModel({
                      googleId: profile.id,
                      name: profile.displayName,
                      email: profile.emails[0].value,
                      isVerified:true
                  });
                  await user.save();
              }

              console.log("User from Passport.js", user)

              
              return done(null, user); // Send user & token to frontend
          } 
          
          catch (error){

              return done(error, null);
          }

      }
  )
);

  

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
      const user = await userModel.findById(id);
      done(null, user);
  } catch (error) {
      done(error, null);
  }
});

export default passport;