import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (res, userId) => {

    const token = jwt.sign({ userId }, process.env.JWT_KEY, { expiresIn: '2d' });
    console.log("Token Generated is:", token);
    res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 2 * 24 * 60 * 60 * 1000,
        path: "/", 
    });

    return token;
}

export default generateTokenAndSetCookie;
