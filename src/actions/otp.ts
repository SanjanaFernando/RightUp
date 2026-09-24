"use server";

import nodemailer from "nodemailer";
import { connectToDatabase } from "@/lib/mongodb";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { setSessionCookie } from "@/lib/auth";
import { OAuth2Client } from "google-auth-library";
import { ActionResponse } from "@/actions/auth";

// ─── Nodemailer Transport ────────────────────────────────────────────────────
// Uses Gmail SMTP. Set SMTP_USER and SMTP_PASS in .env.local.
// For Gmail: enable "App Passwords" under your Google account security settings.
function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/** Generate a random 6-digit OTP */
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── Send OTP ────────────────────────────────────────────────────────────────
export async function sendOtpAction(email: string): Promise<ActionResponse> {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    await connectToDatabase();

    // Check if email is already registered
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert: replace any existing OTP for this email
    await Otp.findOneAndUpdate(
      { email: email.toLowerCase() },
      { code, expiresAt, verified: false },
      { upsert: true, new: true }
    );

    const transporter = createTransport();
    await transporter.sendMail({
      from: `"RightUp" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your RightUp verification code",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#070B12;color:#f3f4f6;padding:40px;border-radius:16px;border:1px solid rgba(255,255,255,0.1)">
          <h1 style="font-size:24px;font-weight:700;margin:0 0 8px;color:#fff">Email Verification</h1>
          <p style="color:#9ca3af;margin:0 0 32px">Enter the code below to verify your email address and continue creating your RightUp account.</p>
          <div style="font-size:48px;font-weight:800;letter-spacing:12px;color:#00DC82;text-align:center;padding:24px;background:rgba(0,220,130,0.08);border-radius:12px;border:1px solid rgba(0,220,130,0.2);margin-bottom:32px">
            ${code}
          </div>
          <p style="color:#6b7280;font-size:13px;margin:0">This code expires in <strong style="color:#d1d5db">10 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return { success: true, message: "Verification code sent! Please check your inbox." };
  } catch (error: any) {
    console.error("OTP send error:", error);
    return { success: false, error: "Failed to send verification email. Please try again." };
  }
}

// ─── Verify OTP ──────────────────────────────────────────────────────────────
export async function verifyOtpAction(
  email: string,
  code: string
): Promise<ActionResponse> {
  if (!email || !code) {
    return { success: false, error: "Email and verification code are required." };
  }

  try {
    await connectToDatabase();

    const record = await Otp.findOne({ email: email.toLowerCase() });
    if (!record) {
      return { success: false, error: "No verification code found for this email. Please request a new one." };
    }
    if (record.expiresAt < new Date()) {
      return { success: false, error: "Verification code has expired. Please request a new one." };
    }
    if (record.code !== code.trim()) {
      return { success: false, error: "Incorrect verification code. Please try again." };
    }

    // Mark as verified
    await Otp.findOneAndUpdate({ email: email.toLowerCase() }, { verified: true });

    return { success: true, message: "Email verified successfully!" };
  } catch (error: any) {
    console.error("OTP verify error:", error);
    return { success: false, error: "Verification failed. Please try again." };
  }
}

// ─── Google OAuth Sign In / Register ────────────────────────────────────────
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export async function googleAuthAction(idToken: string): Promise<ActionResponse> {
  if (!GOOGLE_CLIENT_ID) {
    return { success: false, error: "Google authentication is not configured." };
  }

  try {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return { success: false, error: "Invalid Google token." };
    }

    await connectToDatabase();

    const normalizedEmail = payload.email.toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Auto-register via Google — no password needed
      const nameParts = (payload.name || "").split(" ");
      user = await User.create({
        email: normalizedEmail,
        firstName: nameParts[0] || "User",
        lastName: nameParts.slice(1).join(" ") || "",
        avatar: payload.picture || "",
        // Google users have no password — store a placeholder
        password: `google_oauth_${payload.sub}`,
        termsAccepted: true,
        role: "user",
      });
    }

    await setSessionCookie({
      userId: user._id.toString(),
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
    });

    return {
      success: true,
      message: "Signed in with Google!",
      data: {
        userId: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatar,
      },
    };
  } catch (error: any) {
    console.error("Google auth error:", error);
    return { success: false, error: "Google authentication failed. Please try again." };
  }
}
