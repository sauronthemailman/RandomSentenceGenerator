const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;
const WORDS_FILE = path.join(__dirname, "words.json");

// Middleware
app.use(cors());
app.use(express.json());

// Load initial words data
let wordsData = {};
try {
  wordsData = JSON.parse(fs.readFileSync(WORDS_FILE, "utf8"));
} catch (err) {
  console.error("Error loading words.json:", err);
  wordsData = {
    Subject: { Nouns: [], Pronouns: [] },
    Predicate: { Verbs: [], "Helping Verbs": [] },
    Object: { "Direct Objects": [], "Indirect Objects": [] },
  };
}

// API Endpoints

// Get all words
app.get("/api/words", (req, res) => {
  res.json(wordsData);
});

// Add a new word
app.post("/api/words", (req, res) => {
  const { word, category } = req.body;

  if (!word || !category) {
    return res.status(400).json({ error: "Word and category are required" });
  }

  // Find the group for the category
  const group = Object.keys(wordsData).find((group) =>
    Object.keys(wordsData[group]).includes(category)
  );

  if (!group) {
    return res.status(400).json({ error: "Invalid category" });
  }

  // Add the word if it doesn't exist
  if (!wordsData[group][category].includes(word)) {
    wordsData[group][category].push(word);

    // Save to file
    fs.writeFile(WORDS_FILE, JSON.stringify(wordsData, null, 2), (err) => {
      if (err) {
        console.error("Error saving words:", err);
        return res.status(500).json({ error: "Failed to save word" });
      }
      res.json({ success: true, word, category });
    });
  } else {
    res.status(400).json({ error: "Word already exists in this category" });
  }
});

// Delete a word
app.delete("/api/words", (req, res) => {
  const { word } = req.body;

  if (!word) {
    return res.status(400).json({ error: "Word is required" });
  }

  let deleted = false;

  // Search through all categories
  for (const group of Object.keys(wordsData)) {
    for (const category of Object.keys(wordsData[group])) {
      const index = wordsData[group][category].indexOf(word);
      if (index !== -1) {
        wordsData[group][category].splice(index, 1);
        deleted = true;
      }
    }
  }

  if (deleted) {
    fs.writeFile(WORDS_FILE, JSON.stringify(wordsData, null, 2), (err) => {
      if (err) {
        console.error("Error saving words:", err);
        return res.status(500).json({ error: "Failed to save changes" });
      }
      res.json({ success: true, word });
    });
  } else {
    res.status(404).json({ error: "Word not found" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
