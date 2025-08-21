import dotenv from "dotenv";
dotenv.config();

import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export const sendMail = async ({ email, emailType, userId }) => {
  try {
    // Generate a hashed token
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    // Update user with token and expiry
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyEmailToken: hashedToken,
          verifyEmailTokenExpiry: new Date(Date.now() + 3600000), // Expires in 1 hour
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgetPasswordToken: hashedToken,
          forgetPasswordTokenExpiry: new Date(Date.now() + 3600000), // Expires in 1 hour
        },
      });
    }

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Common URL
    const actionURL = `${process.env.CLIENT_URL}${
      emailType === "VERIFY" ? "/auth/verify-email" : "/auth/reset-password"
    }?accessToken=${hashedToken}`;

    // HTML Email Template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${
            emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password"
          }</title>
          <style>
            @media only screen and (max-width: 600px) {
              body {
                padding: 20px !important;
              }
              .container {
                padding: 4px !important;
              }
            }
          </style>
        </head>
        <body style="margin: 0; font-family: monospace, sans-serif; padding: 10px; background: oklch(27.4% 0.006 286.033); color: #fff;">
          <div style="max-width: 600px; margin: auto; border: 1px solid #fff; padding: 4px;" class="container">
            <div style="padding: 40px; border: 1px solid #fff;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h2>${
                  emailType === "VERIFY"
                    ? "Welcome to Our Community 🎉"
                    : "Reset Your Password 🔐"
                }</h2>
              </div>

              <p style="font-size: 16px;">
                ${
                  emailType === "VERIFY"
                    ? "Thanks for signing up! Please confirm your email address to get started."
                    : "We received a renote to reset your password. Don’t worry, it happens!"
                }
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a
                  href="${actionURL}"
                  class="button"
                  style="
                    border: 1px solid #fff;
                    padding: 2.5% 0;
                    color: #fff;
                    text-decoration: none;
                    font-weight: bold;
                    display: inline-block;
                    min-width: 200px;
                  "
                >
                    ${
                      emailType === "VERIFY" ? "Verify Email" : "Reset Password"
                    }
                </a>
              </div>

              <p style="font-size: 12px; color: #aaa; margin-top: 40px;">
                If you didn’t renote this, you can safely ignore this email.
              </p>

              <div style="margin-top: 40px; margin-bottom: 30px; font-size: 14px; color: #fff;">
                Warm wishes,<br />
                <strong>Support Team, Note Explorer </strong>
              </div>
              <div style="text-align: center; font-size: 12px; color: #aaa; padding-top: 15px;">
                © 2025 Note Explorer All rights reserved.
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send the email
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject:
        emailType === "VERIFY"
          ? "🎉 Just One Step Away - Verify Your Email Now!"
          : "🔐 Reset Your Password Securely - Action Required!",
      html: htmlTemplate,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.error("Error sending the mail: ", error.message);
    throw new Error(error.message);
  }
};
