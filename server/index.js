import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config({ path: './.env' });


const app = express();
app.use(cors());
app.use(express.json());

// -------------------------
//       MAIN API ROUTE
// -------------------------
app.post("/generate", async (req, res) => {
  try {
    const { messages, max_tokens, temperature } = req.body;

    console.log("\n🔥 Incoming Request");
    console.log("Messages:", messages);
    console.log("Max Tokens:", max_tokens);
    console.log("Temperature:", temperature);
    console.log("API Key Loaded:", process.env.GROQ_API_KEY ? "YES" : "NO");

    // Send request to Groq
    console.log("🌐 Sending request to Groq API...");

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

    console.log("📩 Groq API Response:", data);

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
app.listen(4000, () => {
  console.log("🚀 Server running on http://localhost:4000");
});
