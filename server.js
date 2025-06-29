// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const RAPID_API_KEY = process.env.RAPID_API_KEY; // Place in .env

app.post("/api/generate-lesson", async (req, res) => {
  const { prompt } = req.body;

  try {
    const apiRes = await fetch("https://generate-text-ai-gemini.p.rapidapi.com/api/v1/text", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "generate-text-ai-gemini.p.rapidapi.com",
        "x-rapidapi-key": RAPID_API_KEY,
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await apiRes.json();
    console.log("RapidAPI status:", apiRes.status);
    console.log("RapidAPI response:", data);

    res.status(apiRes.status).json(data);
  } catch (err) {
    console.error("API request failed:", err);
    res.status(500).json({ error: "Failed to connect to Gemini API" });
  }
});

app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});
