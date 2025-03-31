const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Calculate the correct paths based on your file structure
const projectRoot = path.join(__dirname, ".."); // Goes up from /server to /final
const publicDir = projectRoot;
const jsonDir = path.join(publicDir, "json");

// Debug path resolution
console.log("__dirname:", __dirname);
console.log("projectRoot:", projectRoot);
console.log("publicDir:", publicDir);
console.log("jsonDir:", jsonDir);

// Middleware
app.use(express.json());
app.use(express.static(publicDir));

// Initialize JSON files if they don't exist
async function initializeFiles() {
  try {
    await fs.mkdir(jsonDir, { recursive: true });

    const historyPath = path.join(jsonDir, "history.json");
    const wordsPath = path.join(jsonDir, "words.json");

    // Initialize history.json if missing or invalid
    try {
      const data = await fs.readFile(historyPath, "utf8");
      JSON.parse(data); // Just validate it's valid JSON
    } catch {
      await fs.writeFile(historyPath, JSON.stringify([], null, 2));
    }

    // Initialize words.json if missing or invalid
    try {
      const data = await fs.readFile(wordsPath, "utf8");
      JSON.parse(data);
    } catch {
      const defaultWords = {
        Subject: {
          Nouns: ["dog", "teacher", "car"],
          Pronouns: ["he", "she", "it"],
        },
        Predicate: {
          Verbs: ["eats", "teaches", "drives"],
          "Helping Verbs": ["is", "are", "was"],
        },
        Object: {
          "Direct Objects": ["apple", "lesson", "road"],
          "Indirect Objects": ["him", "her", "us"],
        },
        Complement: {
          "Subject Complements": ["happy", "tired", "excited"],
          "Object Complements": ["delicious", "boring", "dangerous"],
        },
        Modifiers: {
          Articles: ["the", "a", "an"],
          Demonstratives: ["this", "that", "these"],
          Possessives: ["my", "your", "his"],
          Quantifiers: ["some", "any", "few"],
          Adjectives: ["big", "small", "tall"],
        },
      };
      await fs.writeFile(wordsPath, JSON.stringify(defaultWords, null, 2));
    }
  } catch (err) {
    console.error("Could not initialize files:", err);
  }
}

// API Endpoints
app.get("/api/words", async (req, res) => {
  try {
    const data = await fs.readFile(path.join(jsonDir, "words.json"), "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error loading words:", err);
    res.status(500).json({ error: "Failed to load words data" });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const data = await fs.readFile(path.join(jsonDir, "history.json"), "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error loading history:", err);
    res.status(500).json({ error: "Failed to load history data" });
  }
});

app.post("/api/history", async (req, res) => {
  try {
    let { sentence } = req.body;
    if (!sentence) return res.status(400).json({ error: "Sentence required" });

    // Normalize line breaks and ensure period at end
    sentence = sentence.trim();
    if (!sentence.endsWith(".")) {
      sentence += ".";
    }
    sentence = sentence.replace(/\.\s*/g, ".\n"); // Add line break after each period

    const filePath = path.join(jsonDir, "history.json");
    let history = [];

    try {
      const data = await fs.readFile(filePath, "utf8");
      history = JSON.parse(data);
    } catch (err) {
      console.log("Initializing new history file");
    }

    // Add new entry
    history.unshift({
      id: Date.now(),
      sentence: sentence,
      timestamp: new Date().toISOString(),
    });

    // Limit to 8 items and write with pretty formatting
    history = history.slice(0, 8);
    await fs.writeFile(filePath, JSON.stringify(history, null, 2) + "\n"); // Add final newline

    res.json({ success: true });
  } catch (err) {
    console.error("Error saving history:", err);
    res.status(500).json({ error: "Failed to save history" });
  }
});

// Add word endpoint
app.post("/api/words", async (req, res) => {
  try {
    const { word, group, category } = req.body;
    if (!word || !group || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const filePath = path.join(jsonDir, "words.json");
    const data = await fs.readFile(filePath, "utf8");
    const words = JSON.parse(data);

    // Initialize if not exists
    if (!words[group]) words[group] = {};
    if (!words[group][category]) words[group][category] = [];

    // Check if word already exists
    if (words[group][category].includes(word)) {
      return res.status(400).json({ error: "Word already exists" });
    }

    // Add the word
    words[group][category].push(word);
    await fs.writeFile(filePath, JSON.stringify(words, null, 2));

    res.json({ success: true });
  } catch (err) {
    console.error("Error adding word:", err);
    res.status(500).json({ error: "Failed to add word" });
  }
});

// Delete word endpoint
app.delete("/api/words", async (req, res) => {
  try {
    const { word } = req.body;
    if (!word) {
      return res.status(400).json({ error: "Word is required" });
    }

    const filePath = path.join(jsonDir, "words.json");
    const data = await fs.readFile(filePath, "utf8");
    const words = JSON.parse(data);
    let deleted = false;

    // Search through all categories and delete the word
    for (const group of Object.values(words)) {
      for (const category of Object.values(group)) {
        const index = category.indexOf(word);
        if (index !== -1) {
          category.splice(index, 1);
          deleted = true;
        }
      }
    }

    if (deleted) {
      await fs.writeFile(filePath, JSON.stringify(words, null, 2));
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Word not found" });
    }
  } catch (err) {
    console.error("Error deleting word:", err);
    res.status(500).json({ error: "Failed to delete word" });
  }
});

// Serve the HTML file directly (no automatic path joining)
app.get("*", (req, res) => {
  // This is the key fix: directly use the absolute path to index.html
  const indexPath = path.resolve(publicDir, "index.html");
  console.log("Trying to serve:", indexPath);

  // Check if the file exists before serving it
  fs.access(indexPath)
    .then(() => {
      res.sendFile(indexPath);
    })
    .catch((err) => {
      console.error("Could not find index.html:", err);
      res
        .status(404)
        .send(
          "Could not find index.html. Make sure it exists at: " + indexPath
        );
    });
});

// Start server
initializeFiles()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
