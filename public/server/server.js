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

    const wordsPath = path.join(jsonDir, "words.json");
    const historyPath = path.join(jsonDir, "history.json");

    // Initialize history.json if missing
    try {
      await fs.access(historyPath);
    } catch {
      await fs.writeFile(historyPath, JSON.stringify([], null, 2));
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
    const { sentence } = req.body;
    if (!sentence) return res.status(400).json({ error: "Sentence required" });

    const filePath = path.join(jsonDir, "history.json");
    let history = [];

    try {
      const data = await fs.readFile(filePath, "utf8");
      history = JSON.parse(data);
    } catch (err) {
      console.log("Initializing new history file");
    }

    history.unshift(sentence);
    history = history.slice(0, 8);

    await fs.writeFile(filePath, JSON.stringify(history, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error("Error saving history:", err);
    res.status(500).json({ error: "Failed to save history" });
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
