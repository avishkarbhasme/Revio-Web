import Support from "../models/support.model.js";
import nodemailer from "nodemailer";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"; // make sure this exists

// Configure your Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // your Gmail address
    pass: process.env.GMAIL_PASS, // your Gmail App Password
  },
});

const createSupportRequest = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    throw new ApiError({ message: "All fields are required" });
  }

  // Save support request in DB
  const supportRequest = await Support.create({ name, email, subject, message });

  // Prepare email to send to your Gmail
  const mailOptions = {
    from: `"${name}" <${email}>`, // sender info
    to: process.env.GMAIL_USER,   // your Gmail
    subject: `Support Request: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });

  return res.status(200).json(
    new ApiResponse({
      message: "Support request submitted successfully",
      data: supportRequest,
    })
  );
});

export { createSupportRequest };
