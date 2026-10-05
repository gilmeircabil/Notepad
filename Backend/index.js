import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import crypto from "crypto";
import { authenticateToken } from "./utilities.js";
import User from "./models/user.model.js";
import Note from "./models/note.model.js";
import {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateNote,
  isValidObjectId,
  sanitizeSearchQuery,
} from "./validation.js";
import { sendPasswordResetEmail } from "./email.js";

dotenv.config();

// ── FAIL FAST ON MISSING SECRETS (Security playbook B7 / B9) ──
const REQUIRED_ENV = ["MONGO_URI", "ACCESS_TOKEN_SECRET"];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length) {
  console.error(`Missing required environment variables: ${missingEnv.join(", ")}`);
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === "production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const MAX_NOTES_PER_USER = parseInt(process.env.MAX_NOTES_PER_USER || "1000", 10);

const app = express();

// Render (and most PaaS hosts) sit behind a reverse proxy. Without this,
// every request appears to come from the proxy IP and all users would share
// a single rate-limit bucket.
app.set("trust proxy", parseInt(process.env.TRUST_PROXY_HOPS || "1", 10));
app.disable("x-powered-by");

// Security headers for the JSON API (CSP, HSTS, nosniff, frame protection…).
// CORP is relaxed because cross-origin access is governed by CORS below.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

// ── RATE LIMITING (Guardrails) ──────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_GLOBAL_MAX || "200", 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_AUTH_MAX || "20", 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, message: "Too many authentication attempts. Please wait 15 minutes." },
});

app.use(globalLimiter);

// Strict CORS allow-list. Localhost origins are only allowed outside production.
const allowedOrigins = [
  "https://notepad-24hm.onrender.com",
  process.env.FRONTEND_URL,
  ...(isProduction
    ? []
    : ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g. mobile apps, curl, Postman)
      // — these are not browsers, so they cannot ride on a victim's cookies.
      if (!origin) return callback(null, true);
      return callback(null, allowedOrigins.includes(origin));
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const cookieOptions = {
  httpOnly: true,
  sameSite: "none", // frontend and API are on different *.onrender.com sites
  secure: true,
  maxAge: 3600000 * 24 * 7, // 7 days
};

const signToken = (userId) =>
  jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: JWT_EXPIRES_IN,
  });

// Used so "unknown email" and "wrong password" take the same time to answer,
// preventing account enumeration through response timing.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("timing-equalizer-not-a-real-password", 10);

// Mask emails in logs (never log passwords or tokens).
const maskEmail = (email = "") => email.replace(/^(.).*(@.*)$/, "$1***$2");

const publicUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Notepad API", status: "online" });
});

// REGISTER
app.post("/create-account", authLimiter, async (req, res) => {
  try {
    const { error, value } = validateSignup(req.body);
    if (error) {
      return res.status(400).json({ error: true, message: error });
    }
    const { fullName, email, password } = value;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: true, message: "User already exists with this email" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashed,
    });

    console.info(`[auth] account created ${maskEmail(email)} ip=${req.ip}`);

    const token = signToken(user._id);
    res.cookie("accessToken", token, cookieOptions);
    res.json({
      error: false,
      message: "Account created",
      user: publicUser(user),
      accessToken: token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// LOGIN
app.post("/login", authLimiter, async (req, res) => {
  try {
    const { error, value } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({ error: true, message: error });
    }
    const { email, password } = value;

    const user = await User.findOne({ email });
    // Always run bcrypt so response time doesn't reveal whether the email exists.
    const match = await bcrypt.compare(password, user ? user.password : DUMMY_PASSWORD_HASH);

    if (!user || !match) {
      console.warn(`[auth] failed login ${maskEmail(email)} ip=${req.ip}`);
      // Same message for unknown email and wrong password (no user enumeration).
      return res.status(400).json({ error: true, message: "Invalid email or password" });
    }

    console.info(`[auth] login ${maskEmail(email)} ip=${req.ip}`);

    const token = signToken(user._id);
    res.cookie("accessToken", token, cookieOptions);
    res.json({
      error: false,
      message: "Login successful",
      user: publicUser(user),
      accessToken: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// LOGOUT
app.post("/logout", (req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.json({ error: false, message: "Logged out" });
});

// FORGOT PASSWORD (Generates secure 15-minute token & dispatches email)
app.post("/forgot-password", authLimiter, async (req, res) => {
  try {
    const { error, value } = validateForgotPassword(req.body);
    if (error) {
      return res.status(400).json({ error: true, message: error });
    }
    const { email } = value;

    const user = await User.findOne({ email });
    if (user) {
      // 32-byte cryptographic random token (64 hex characters)
      const rawToken = crypto.randomBytes(32).toString("hex");
      // Store SHA-256 hash in database
      const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      await user.save();

      const frontendBase = process.env.FRONTEND_URL || "https://notepad-24hm.onrender.com";
      const resetLink = `${frontendBase}/reset-password/${rawToken}`;

      await sendPasswordResetEmail({
        toEmail: user.email,
        resetLink,
        userName: user.fullName,
      });
    }

    // Always return generic success to avoid user enumeration
    res.json({
      error: false,
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// RESET PASSWORD (Verifies token and updates password)
app.post("/reset-password", authLimiter, async (req, res) => {
  try {
    const { error, value } = validateResetPassword(req.body);
    if (error) {
      return res.status(400).json({ error: true, message: error });
    }
    const { token, newPassword } = value;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Password reset link is invalid or has expired. Please request a new one.",
      });
    }

    // Hash new password with bcrypt
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    console.info(`[auth] password reset successful userId=${user._id} ip=${req.ip}`);

    res.json({
      error: false,
      message: "Your password has been successfully reset. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});


// AUTH CHECK
app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    res.json({ error: false, user });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// DELETE ACCOUNT (GDPR / Privacy compliance)
app.delete("/delete-account", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    // Purge all notes belonging to the user
    await Note.deleteMany({ userId });
    // Delete the user record
    const result = await User.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    console.info(`[auth] account deleted userId=${userId} ip=${req.ip}`);
    res.clearCookie("accessToken", cookieOptions);
    res.json({
      error: false,
      message: "Account and all associated notes deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

/* ===== NOTES ===== */

// Reject malformed note IDs early (avoids Mongoose CastError → 500).
const requireValidNoteId = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(404).json({ error: true, message: "Note not found" });
  }
  next();
};

// Per-user storage cap to limit abuse / database cost (playbook B13).
const enforceNoteLimit = async (req, res, next) => {
  try {
    const count = await Note.countDocuments({ userId: req.user._id });
    if (count >= MAX_NOTES_PER_USER) {
      return res.status(403).json({
        error: true,
        message: `Note limit reached (${MAX_NOTES_PER_USER}). Delete some notes to add more.`,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

// ADD NOTE
app.post("/add-note", authenticateToken, enforceNoteLimit, async (req, res) => {
  try {
    const { error, value } = validateNote(req.body);
    if (error) {
      return res.status(400).json({ error: true, message: error });
    }

    const note = await Note.create({
      title: value.title,
      content: value.content,
      tags: value.tags || [],
      isPinned: value.isPinned || false,
      color: value.color || "default",
      isFavorite: value.isFavorite || false,
      userId: req.user._id,
      createdOn: new Date(),
      updatedOn: new Date(),
    });

    res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    console.error("Add note error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// EDIT NOTE
app.put("/edit-note/:id", authenticateToken, requireValidNoteId, async (req, res) => {
  try {
    const { error, value } = validateNote(req.body, { partial: true });
    if (error) {
      return res.status(400).json({ error: true, message: error });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    // Only validated, allow-listed fields are applied.
    Object.assign(note, value);

    note.updatedOn = new Date();
    await note.save();

    res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error("Edit note error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// DUPLICATE NOTE
app.post(
  "/duplicate-note/:id",
  authenticateToken,
  requireValidNoteId,
  enforceNoteLimit,
  async (req, res) => {
    try {
      const originalNote = await Note.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

      if (!originalNote) {
        return res.status(404).json({ error: true, message: "Note not found" });
      }

      // Keep the copy within the title length limit.
      const copyTitle = `${originalNote.title} (Copy)`.slice(0, 200);

      const duplicated = await Note.create({
        title: copyTitle,
        content: originalNote.content,
        tags: originalNote.tags,
        isPinned: false,
        color: originalNote.color,
        isFavorite: originalNote.isFavorite,
        userId: req.user._id,
        createdOn: new Date(),
        updatedOn: new Date(),
      });

      res.json({
        error: false,
        note: duplicated,
        message: "Note duplicated successfully",
      });
    } catch (error) {
      console.error("Duplicate note error:", error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  }
);

// Escape special regex characters to prevent ReDoS attacks
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// SEARCH NOTES
app.get("/search-notes", authenticateToken, async (req, res) => {
  try {
    // sanitizeSearchQuery rejects arrays/objects (e.g. ?query[$ne]=x) and caps length.
    const query = sanitizeSearchQuery(req.query.query);
    const safeQuery = escapeRegex(query);
    const notes = await Note.find({
      userId: req.user._id,
      $or: [
        { title: { $regex: safeQuery, $options: "i" } },
        { content: { $regex: safeQuery, $options: "i" } },
        { tags: { $regex: safeQuery, $options: "i" } },
      ],
    })
      .sort({ isPinned: -1, updatedOn: -1, createdOn: -1 })
      .limit(MAX_NOTES_PER_USER);

    res.json({
      error: false,
      notes,
    });
  } catch (error) {
    console.error("Search notes error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// UPDATE PIN STATUS
app.put("/update-note-pinned/:id", authenticateToken, requireValidNoteId, async (req, res) => {
  const { isPinned } = req.body;
  const noteId = req.params.id;

  if (typeof isPinned !== "boolean") {
    return res.status(400).json({
      error: true,
      message: "isPinned must be a boolean value",
    });
  }

  try {
    const note = await Note.findOne({
      _id: noteId,
      userId: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    note.isPinned = isPinned;
    note.updatedOn = new Date();
    await note.save();

    res.json({
      error: false,
      note,
      message: isPinned ? "Note pinned successfully" : "Note unpinned successfully",
    });
  } catch (error) {
    console.error("Update pin error:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

// GET ALL NOTES
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id })
      .sort({
        isPinned: -1,
        updatedOn: -1,
        createdOn: -1,
      })
      .limit(MAX_NOTES_PER_USER);
    res.json({ error: false, notes });
  } catch (error) {
    console.error("Get all notes error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// DELETE NOTE
app.delete("/delete-note/:id", authenticateToken, requireValidNoteId, async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id, userId: req.user._id });
    res.json({
      error: false,
      message: "Note deleted",
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

/* ===== ERROR HANDLING ===== */

// Unknown routes → JSON 404 (instead of Express's HTML page).
app.use((req, res) => {
  res.status(404).json({ error: true, message: "Not found" });
});

// Global error handler — never leak stack traces or internals to the client.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: true, message: "Malformed JSON body" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: true, message: "Request body too large" });
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ error: true, message: "Internal server error" });
});

/* ===== SERVER ===== */
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => {
    // Don't run an API that can't reach its database.
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
