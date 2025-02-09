// server.js
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
app.use(
  cors({
    origin: ["https://gemini-clone-xi-navy.vercel.app/"], // Allow only this origin
    methods: ["GET", "POST"], // Restrict methods
  })
);

app.use(express.json());
require("dotenv").config(); // Load environment variables

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = message;

const result = await model.generateContent(prompt);
console.log(result.response.text());


res.json({ reply: result.response.text() });
  // try {
  //   const pp = message;
    
  //   // Initialize the GoogleGenerativeAI client with the API key
  //   const genAI = new GoogleGenerativeAI({
  //     apiKey: "AIzaSyD7aB7IF6NPB74izsMDaJi7h6kztKxgqRo"
  //   });

  //   // Create an instance of the generative model
  //   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  //   // The prompt for the generative model
  //   const prompt = pp;

  //   // Use await to get the result from the generateContent call
  //   const result = await model.generateContent({ prompt });

  //   // Accessing and formatting the response text
  //   const formattedResult = result.response.text
  //     .replace(/\n/g, '<br>')        // Convert new lines to <br>
  //     .replace(/(-\s)/g, '<li>')     // Convert bullet points to list items
  //     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Convert **text** to bold

  //   // Log the formatted response text
  //   console.log(formattedResult);

  //   // Send the formatted result as JSON
  //   res.json({ reply: formattedResult });

  // } catch (error) {
  //   console.error("Error generating content:", error);
  //   const errorMessage = "Error generating content";
  //   res.json({ reply: errorMessage });
  // }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
