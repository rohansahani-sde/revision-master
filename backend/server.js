import express from 'express'

import axios from 'axios'
import cors from 'cors'

import dotenv from 'dotenv'
dotenv.config()


import lessonRoutes from './routes/lessonRoutes.js'
import authRoutes from './routes/authRoutes.js'
import { connectDB } from './database/connectDB.js';
import { checkAiLimit } from "./middleware/aiLimitMiddleware.js";
import requireAuth from './middleware/requireAuth.js'


const app = express();
app.use(cors());
app.use(express.json());

connectDB()


const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";



app.use('/api', lessonRoutes)
app.use('/api/auth', authRoutes)

// --- GEMINI API ROUTE ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.post("/generate", requireAuth, checkAiLimit, async (req, res) => {
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
