const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./models/User");
const Lesson = require("./models/Lesson");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://sahanirohan313_db_user:b023sNY0G3hgVQbS@cluster0.z7fpop0.mongodb.net/smart_revision?appName=Cluster0")
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// --- MIDDLEWARE ---
const requireAuth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// --- AUTHENTICATION ROUTES ---
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// --- USER LESSON ENDPOINTS ---
app.post("/api/lessons", requireAuth, async (req, res) => {
  try {
    const { topic, days, data } = req.body;
    const newLesson = new Lesson({
      userId: req.user._id,
      topic,
      days,
      data
    });
    const savedLesson = await newLesson.save();
    res.status(201).json(savedLesson);
  } catch (err) {
    res.status(500).json({ error: "Failed to save lesson plan" });
  }
});

app.get("/api/lessons", requireAuth, async (req, res) => {
  try {
    const lessons = await Lesson.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lesson history" });
  }
});

app.delete("/api/lessons/:id", requireAuth, async (req, res) => {
  try {
    const lesson = await Lesson.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!lesson) return res.status(404).json({ error: "Lesson not found or you are not authorized" });
    res.json({ message: "Lesson deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete lesson" });
  }
});


// --- GEMINI API ROUTE ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Error calling Gemini API:", err.response?.data || err.message);
    res.status(500).json({ error: err.toString() });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
