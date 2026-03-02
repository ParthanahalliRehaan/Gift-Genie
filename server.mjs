import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (works locally with .env, and on Render with dashboard vars)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Render sets PORT automatically

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serves your HTML/CSS/JS

// Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Configure OpenAI client
const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
});

// API endpoint
app.post("/api/gift-genie", async (req, res) => {
  try {
    const { prompt } = req.body;
    const messages = [
      {
        role: "system",
        content: `You are the Gift Genie!
          Make your gift suggestions thoughtful and practical.
          Your response must be under 100 words.
          Skip intros and conclusions.
          Only output gift suggestions.`,
      },
      { role: "user", content: prompt },
    ];

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
