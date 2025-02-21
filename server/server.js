// server.js
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

app.use(
  cors({
    origin: "https://gemini-clone-xi-navy.vercel.app",
    methods: ["GET", "POST"],
  })
);


app.use(express.json());
require("dotenv").config(); // Load environment variables

const genAI = new GoogleGenerativeAI("AIzaSyD7aB7IF6NPB74izsMDaJi7h6kztKxgqRo");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

let conversationHistory = []; // Store past messages

app.post("/chat", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Message cannot be empty" });

    // Add user message to history
    conversationHistory.push({ role: "user", text: message });

    // Keep only the last 5 exchanges to limit history
    if (conversationHistory.length > 10) {
        conversationHistory.shift(); // Remove the oldest entry
    }

    // Prepare prompt with history
    const formattedHistory = conversationHistory
        .map(entry => `${entry.role === "user" ? "User: " : ""}${entry.text}`)
        .join("\n");

    try {
        const result = await model.generateContent(formattedHistory);
        const botReply = result.response.text().trim();

        // Add AI response to history
        conversationHistory.push({ role: "bot", text: botReply });

        res.json({ reply: botReply });
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).json({ reply: "Sorry, an error occurred while processing your request." });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
