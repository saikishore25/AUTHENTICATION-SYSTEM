import nodemailer from 'nodemailer';
import {VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE} from "./emailTemplates.js";
import dotenv from "dotenv";
dotenv.config();
// Create a transporter using your email service
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail', or use 'SMTP' for custom services
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASSWORD,  // your email password or app-specific password
  },
  port: 587,
  secure: false

});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Connected Successfully!");
  }
});
// Function to send the email
export const sendVerificationEmail = async (email, verificationToken) => {
  
  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD)

  try{
    const info = await transporter.sendMail({
      from: `UI-DX <UI-DX-email@gmail.com>`, // sender address
      to: email, // recipient address
      subject: 'Verify Your Email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace(`{verificationCode}`, verificationToken) , // email content (HTML)
    });

    console.log('Email sent:', info.response);
  } 
  
  catch (error) {
    console.log('Error sending email:', error);
  }
};


export const sendWelcomeEmail = async(email, name) =>{

    try{

      const info = await transporter.sendMail({

        from: `UI-DX <UI-DX-email@gmail.com>`,
        to: email,
        subject: `Welcome Email`,
        html: WELCOME_EMAIL

      });

      console.log("Email Sent:", info.response);

    }

    catch(error){

      console.log('Error sending email:', error);

    }
}


export const sendPasswordResetEmail = async (email, resetURL) => {
  
  try{

    const info = await transporter.sendMail({

      from: `UI-DX <UI-DX-email@gmail.com>`,
      to: email,
      subject: `Reset Your Password`,
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL )

    });

    console.log("Email Sent:", info.response);

  }

  catch(error){

    console.log('Error sending email:', error);

  }
};


export const sendResetSuccessEmail = async (email) =>{

  try{

    const info = await transporter.sendMail({

      from: `UI-DX <UI-DX-email@gmail.com>`,
      to: email,
      subject: `Password Reset Success`,
      html: PASSWORD_RESET_SUCCESS_TEMPLATE

    });

    console.log("Email Sent:", info.response);

  }

  catch(error){

    console.log('Error sending email:', error);

  }

}