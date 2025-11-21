import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------
//       MAIN API ROUTE
// -------------------------
app.post("/api/generate", async (req, res) => {
  try {
    const { messages, max_tokens, temperature } = req.body;

    console.log("\n🔥 Incoming Request");
    console.log("Messages:", messages);
    console.log("Max Tokens:", max_tokens);
    console.log("Temperature:", temperature);
    console.log("API Key Loaded:", process.env.GROQ_API_KEY ? "YES" : "NO");

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages,
          max_tokens,
          temperature
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: data.error || "Groq API returned an error"
      });
    }

    res.json(data);

  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------------
//       START SERVER
// -------------------------
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
