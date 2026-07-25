import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { resend } from "../utils/resend.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

// ─── Register ────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in register controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Forgot Password — Generate & Email OTP ───────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Respond generically to avoid email enumeration
      return res.status(200).json({ message: "If that email exists, an OTP has been sent." });
    }

    // Enforce resend cooldown: don't send another OTP within 60 seconds
    if (user.otpExpires && user.otpExpires > Date.now() + 9 * 60 * 1000) {
      return res.status(429).json({ message: "Please wait 60 seconds before requesting another OTP." });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before storing (never store plaintext OTPs)
    const otpHash = await bcrypt.hash(otp, 10);

    user.otpHash = otpHash;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save({ validateBeforeSave: false });

    // Send email via Resend
    await resend.emails.send({
      from: "Quick Notes <onboarding@resend.dev>",
      to: email,
      subject: "Your Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #1f2937; margin-bottom: 8px;">Password Reset</h2>
          <p style="color: #6b7280;">You requested a password reset for your Quick Notes account.</p>
          <p style="color: #6b7280;">Use the OTP below. It expires in <strong>10 minutes</strong>.</p>
          <div style="background:#f3f4f6; border-radius:8px; padding:24px; text-align:center; margin: 24px 0;">
            <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #111827;">${otp}</span>
          </div>
          <p style="color: #9ca3af; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("Error in forgotPassword controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await User.findOne({ email });
    if (!user || !user.otpHash || !user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Check expiry first
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Compare submitted OTP against stored hash
    const isValid = await bcrypt.compare(otp, user.otpHash);
    if (!isValid) {
      return res.status(400).json({ message: "Incorrect OTP." });
    }

    // OTP is valid — do NOT clear it yet (user still needs it to reset password)
    res.status(200).json({ message: "OTP verified." });
  } catch (error) {
    console.error("Error in verifyOtp controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ message: "Email, OTP, and new password are required." });
    }

    const user = await User.findOne({ email });
    if (!user || !user.otpHash || !user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const isValid = await bcrypt.compare(otp, user.otpHash);
    if (!isValid) {
      return res.status(400).json({ message: "Incorrect OTP." });
    }

    // Set new password (the pre-save hook will hash it automatically)
    user.password = password;
    user.otpHash = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error in resetPassword controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
