import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { authenticateToken } from "./utilities.js";
import User from "./models/user.model.js";
import Note from "./models/note.model.js";

dotenv.config();
const app = express();

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

// Allow localhost for development as well as production Render URL
const allowedOrigins = [
  "https://notepad-24hm.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("CORS: origin not allowed"), false);
    },
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(console.error);

const cookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: 3600000 * 24 * 7, // 7 days
};

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Notepad API", status: "online" });
});

// REGISTER
app.post("/create-account", authLimiter, async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: true, message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: true, message: "Password must be at least 8 characters" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ error: true, message: "User already exists with this email" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashed,
    });

    const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("accessToken", token, cookieOptions);
    res.json({
      error: false,
      message: "Account created",
      accessToken: token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// LOGIN
app.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: true, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: true, message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: true, message: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("accessToken", token, cookieOptions);
    res.json({
      error: false,
      message: "Login successful",
      accessToken: token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
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

/* ===== NOTES ===== */

// ADD NOTE
app.post("/add-note", authenticateToken, async (req, res) => {
  try {
    const { title, content, tags, isPinned, color, isFavorite } = req.body;

    if (!title) {
      return res.status(400).json({ error: true, message: "Title is required" });
    }
    if (!content) {
      return res.status(400).json({ error: true, message: "Content is required" });
    }

    const note = await Note.create({
      title,
      content,
      tags: tags || [],
      isPinned: isPinned || false,
      color: color || "default",
      isFavorite: isFavorite || false,
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
app.put("/edit-note/:id", authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    if (req.body.title !== undefined) note.title = req.body.title;
    if (req.body.content !== undefined) note.content = req.body.content;
    if (req.body.tags !== undefined) note.tags = req.body.tags;
    if (req.body.isPinned !== undefined) note.isPinned = req.body.isPinned;
    if (req.body.color !== undefined) note.color = req.body.color;
    if (req.body.isFavorite !== undefined) note.isFavorite = req.body.isFavorite;
    if (req.body.isArchived !== undefined) note.isArchived = req.body.isArchived;

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
app.post("/duplicate-note/:id", authenticateToken, async (req, res) => {
  try {
    const originalNote = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!originalNote) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    const duplicated = await Note.create({
      title: `${originalNote.title} (Copy)`,
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
});

// Escape special regex characters to prevent ReDoS attacks
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// SEARCH NOTES
app.get("/search-notes", authenticateToken, async (req, res) => {
  try {
    const query = req.query.query || "";
    const safeQuery = escapeRegex(query);
    const notes = await Note.find({
      userId: req.user._id,
      $or: [
        { title: { $regex: safeQuery, $options: "i" } },
        { content: { $regex: safeQuery, $options: "i" } },
        { tags: { $regex: safeQuery, $options: "i" } },
      ],
    }).sort({ isPinned: -1, updatedOn: -1, createdOn: -1 });

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
app.put("/update-note-pinned/:id", authenticateToken, async (req, res) => {
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
    const notes = await Note.find({ userId: req.user._id }).sort({
      isPinned: -1,
      updatedOn: -1,
      createdOn: -1,
    });
    res.json({ error: false, notes });
  } catch (error) {
    console.error("Get all notes error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// DELETE NOTE
app.delete("/delete-note/:id", authenticateToken, async (req, res) => {
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

/* ===== SERVER ===== */
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
