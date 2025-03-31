const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Path configuration
const projectRoot = path.join(__dirname, "..");
const publicDir = projectRoot;
const jsonDir = path.join(publicDir, "json");

// Middleware
app.use(express.json());
app.use(express.static(publicDir));

// API Endpoints

// Get all words
app.get("/api/words", async (req, res) => {
  try {
    const data = await fs.readFile(path.join(jsonDir, "words.json"), "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error loading words:", err);
    res.status(500).json({ error: "Failed to load words data" });
  }
});

// Get history
app.get("/api/history", async (req, res) => {
  try {
    const data = await fs.readFile(path.join(jsonDir, "history.json"), "utf8");
    let history = JSON.parse(data);

    // Convert old string format to object format if needed
    history = history.map((item) => {
      if (typeof item === "string") {
        return {
          id: Date.now(),
          sentence: item,
          timestamp: new Date().toISOString(),
        };
      }
      return item;
    });

    res.json(history);
  } catch (err) {
    console.error("Error loading history:", err);
    res.status(500).json({ error: "Failed to load history data" });
  }
});

// Save to history
app.post("/api/history", async (req, res) => {
  try {
    let { sentence } = req.body;
    if (!sentence) return res.status(400).json({ error: "Sentence required" });

    // Format sentence
    sentence = sentence.trim();
    if (!sentence.endsWith(".")) sentence += ".";
    sentence = sentence.replace(/\.\s*/g, ".\n");

    const filePath = path.join(jsonDir, "history.json");
    let history = [];

    try {
      const data = await fs.readFile(filePath, "utf8");
      history = JSON.parse(data);
    } catch (err) {
      console.error("Error reading history file:", err);
      return res.status(500).json({ error: "Failed to load history" });
    }

    // Add new entry
    history.unshift({
      id: Date.now(),
      sentence,
      timestamp: new Date().toISOString(),
    });

    // Limit to 8 items
    history = history.slice(0, 8);
    await fs.writeFile(filePath, JSON.stringify(history, null, 2));

    res.json({ success: true });
  } catch (err) {
    console.error("Error saving history:", err);
    res.status(500).json({ error: "Failed to save history" });
  }
});

// Add word
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

    // Check for duplicate
    if (words[group][category].includes(word)) {
      return res.status(400).json({ error: "Word already exists" });
    }

    // Add word
    words[group][category].push(word);
    await fs.writeFile(filePath, JSON.stringify(words, null, 2));

    res.json({ success: true });
  } catch (err) {
    console.error("Error adding word:", err);
    res.status(500).json({ error: "Failed to add word" });
  }
});

// Delete word
app.delete("/api/words", async (req, res) => {
  try {
    const { word } = req.body;
    if (!word) return res.status(400).json({ error: "Word is required" });

    const filePath = path.join(jsonDir, "words.json");
    const data = await fs.readFile(filePath, "utf8");
    const words = JSON.parse(data);
    let deleted = false;

    // Search through all categories
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

// Serve index.html for all other routes
app.get("*", (req, res) => {
  const indexPath = path.resolve(publicDir, "index.html");
  fs.access(indexPath)
    .then(() => res.sendFile(indexPath))
    .catch((err) => {
      console.error("Could not find index.html:", err);
      res.status(404).send("Could not find index.html");
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
