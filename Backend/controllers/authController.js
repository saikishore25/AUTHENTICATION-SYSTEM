import express from "express"
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateVerificationCode from "../utils/generateVerificationCode.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail,sendPasswordResetEmail , sendResetSuccessEmail } from "../nodemailer/nodemailerConfig.js";

export const signup = async(req, res)=>{

    const {email, password, name} = req.body;
    console.log(email, password, name)

    try{

        if(!email || !password || !name){

            console.log("All Fields are Required");
            return res.json({success:false, message:"All Fields are Required"});      

        }
        
        const userAlreadyExists = await userModel.findOne({email});
       
        
        if(userAlreadyExists){

            console.log("User Already Exists");
            return res.status(400).json({success:false, message: "User Already Exists"});

        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = generateVerificationCode();

        console.log(verificationCode)
        const user = new userModel({

            email: email,
            password: hashedPassword,
            name: name,
            verificationCode: verificationCode,
            verificationCodeExpiresAt: Date.now() + 15* 60* 1000

        })


        await user.save();
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationCode);
        
        console.log("User Created Sucessfully");
        res.status(201).json({

            success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
        })

    }

    catch(error){

        console.log("Failed to Create an User");
        return res.status(400).json({success:false, message: error.message});

    }
    
}


export const verifyEmail = async(req, res)=>{

    const {code} = req.body;

    try{

        const user = await userModel.findOne({

            verificationCode: code,
            verificationCodeExpiresAt:{$gt:Date.now()}

        })

        if(!user){

            console.log("Invalid or Expired Verification Code")
            return res.status(400).json({success: false, message: "Invalid or Expired Verification Code"});

        }

        user.isVerified = true,
        user.verificationCode = undefined,
        user.verificationCodeExpiresAt = undefined
        await user.save()

        await sendWelcomeEmail(user.email, user.name);

        console.log("Email Verified Sucessfully");
        res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},

		});
    }

    catch(error){

        console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });

    }

    

}


export const login = async(req, res)=>{

    const {email, password} = req.body;
    console.log(email, password);
    
    try{

        const user = await userModel.findOne({email});

        if(!user){

            console.log("Invalid credentials")
            return res.status(400).json({ success: false, message: "Invalid credentials" });

        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){

            console.log("Enter Wrong Password while logging in");
            return res.status(400).json({ success: false, message: "Wrong Password" });

        }

        const authToken = generateTokenAndSetCookie(res, user._id);
        console.log(authToken)

        user.lastLogin = Date.now();
        

        await user.save();

        console.log("User Logged in Successfully");
        return res.status(200).json({

            success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			}
        
        });
        


    }

    catch(error){

        console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });

    }


}


export const forgotPassword = async(req, res) => {
    
    const { email } = req.body;

    try{
        const user = await userModel.findOne({ email });

        if(!user){
            
            console.log("User Not Found");
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Generate a reset token
        const resetCode = crypto.randomBytes(20).toString("hex"); // Generate a random token
        const resetCodeExpiresAt = Date.now() + 2 * 60 * 60 * 1000; // Set expiration time (1 hour)

        // Update user with the reset code and expiration
        user.resetPasswordCode = resetCode;
        user.resetPasswordCodeExpires = resetCodeExpiresAt;

        await user.save();

        await sendPasswordResetEmail(user.email, `https://authentication-system-frontend-taupe.vercel.app/reset-password/${resetCode}`);

        res.status(200).json({ success: true, message: "Password reset link sent to your email" });

    } 
    
    catch(error){

        console.log("Error in forgotPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};



export const resetPassword = async (req, res)=>{

    try{

        const {code} = req.params;
        const {password} = req.body;

        const user = await  userModel.findOne({

            resetPasswordCode : code,
            resetPasswordCodeExpires : { $gt: Date.now()}

        })

        if(!user){

            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordCode = undefined;
		user.resetPasswordCodeExpires = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		return res.status(200).json({ success: true, message: "Password reset successful" });

    }

    catch(error){

        console.log("Error in resetPassword ", error);
		return res.status(400).json({ success: false, message: error.message });

    }

}

export const logout = async (req, res) => {
    
    try{

        res.clearCookie("authToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });

        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } 
    
    catch(error){

        console.error("Error in Logging Out", error);
        return res.status(500).json({ success: false, message: "Logout Failed" });
    }
};

export const checkAuth = async (req, res) => {
    
    try{

        if(!req.userId){

            console.log("Unauthorized Access Not Allowed")
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        console.log("User ID:", req.userId);

        // Check user by `_id` (JWT User) or `googleId` (Google OAuth User)
        const user = await userModel.findOne({
            $or: [{ _id: req.isGoogleUser ? null : req.userId }, { googleId: req.isGoogleUser ? req.userId : null }]
        }).select("-password");

        if(!user){

            console.log("User Not Found")
            return res.status(400).json({ success: false, message: "User not found" });
        }

        console.log("User found:", user);
        return res.status(200).json({ success: true, user });
    } 
    
    catch(error){

        console.error("Error in checkAuth:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};





export const googleAuth = async (req, res) => {
    
    try{

        if(!req.user){

            console.log("User Not Found")
            return res.status(401).json({ message: "Google authentication failed" });
        }

        console.log("Request.user._id", req.user._id);
        const token = generateTokenAndSetCookie(res, req.user._id);
        console.log(token)

        // Redirect to frontend with JWT token
        res.redirect(`http://localhost:5173/dashboard`);
    } 
    
    catch(error){
        
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

