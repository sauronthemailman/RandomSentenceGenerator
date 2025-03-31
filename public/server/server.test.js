const request = require("supertest");
const fs = require("fs").promises;
const path = require("path");
const app = require("./server");

describe("Random Sentence Generator API Tests", () => {
  const jsonDir = path.join(__dirname, "..", "..", "json");
  const wordsPath = path.join(jsonDir, "words.json");
  const historyPath = path.join(jsonDir, "history.json");
  const indexPath = path.join(__dirname, "..", "..", "index.html");

  // Backup original files
  let originalWords, originalHistory;

  beforeAll(async () => {
    try {
      await fs.mkdir(jsonDir, { recursive: true });

      // Backup existing files or create basic structure if they don't exist
      try {
        originalWords = await fs.readFile(wordsPath, "utf8");
      } catch {
        originalWords = JSON.stringify({});
        await fs.writeFile(wordsPath, originalWords);
      }

      try {
        originalHistory = await fs.readFile(historyPath, "utf8");
      } catch {
        originalHistory = JSON.stringify([]);
        await fs.writeFile(historyPath, originalHistory);
      }
    } catch (err) {
      console.error("Setup error:", err);
      throw err;
    }
  });

  afterAll(async () => {
    // Restore original files
    try {
      await fs.writeFile(wordsPath, originalWords);
      await fs.writeFile(historyPath, originalHistory);
    } catch (err) {
      console.error("Cleanup error:", err);
    }
  });

  describe("GET /api/words", () => {
    test("should return words data with status 200", async () => {
      const response = await request(app).get("/api/words").expect(200);

      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return 500 if words file is missing", async () => {
      await fs.rename(wordsPath, wordsPath + ".bak");

      await request(app).get("/api/words").expect(500);

      await fs.rename(wordsPath + ".bak", wordsPath);
    });
  });

  describe("GET /api/history", () => {
    test("should return history with status 200", async () => {
      const response = await request(app).get("/api/history").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test("should convert old string format to object format", async () => {
      // Temporarily write old format data
      await fs.writeFile(historyPath, JSON.stringify(["Old sentence"]));

      const response = await request(app).get("/api/history").expect(200);

      expect(typeof response.body[0]).toBe("object");
      expect(response.body[0]).toHaveProperty("sentence");

      // Restore original data
      await fs.writeFile(historyPath, originalHistory);
    });

    test("should return 500 if history file is missing", async () => {
      await fs.rename(historyPath, historyPath + ".bak");

      await request(app).get("/api/history").expect(500);

      await fs.rename(historyPath + ".bak", historyPath);
    });
  });

  describe("POST /api/history", () => {
    test("should add a new sentence to history with status 200", async () => {
      const newSentence = { sentence: "New test sentence" };
      await request(app).post("/api/history").send(newSentence).expect(200);

      const historyData = await fs.readFile(historyPath, "utf8");
      const history = JSON.parse(historyData);
      expect(history[0].sentence).toMatch(/New test sentence\./);
    });

    test("should format the sentence correctly", async () => {
      const testSentence = { sentence: "Test sentence" };
      await request(app).post("/api/history").send(testSentence);

      const historyData = await fs.readFile(historyPath, "utf8");
      const history = JSON.parse(historyData);
      expect(history[0].sentence).toMatch(/Test sentence\.\n/);
    });

    test("should limit history to 8 items", async () => {
      // Clear history first
      await fs.writeFile(historyPath, JSON.stringify([]));

      // Add enough items to test the limit
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post("/api/history")
          .send({ sentence: `Sentence ${i}` });
      }

      const historyData = await fs.readFile(historyPath, "utf8");
      const history = JSON.parse(historyData);
      expect(history.length).toBe(8);
    });

    test("should return 400 if sentence is missing", async () => {
      await request(app).post("/api/history").send({}).expect(400);
    });
  });

  describe("POST /api/words", () => {
    beforeEach(async () => {
      // Start with clean words data for these tests
      await fs.writeFile(
        wordsPath,
        JSON.stringify({
          TestGroup: {
            TestCategory: ["existingWord"],
          },
        })
      );
    });

    test("should add a new word with status 200", async () => {
      const newWord = {
        word: "newWord",
        group: "TestGroup",
        category: "TestCategory",
      };
      await request(app).post("/api/words").send(newWord).expect(200);

      const wordsData = await fs.readFile(wordsPath, "utf8");
      const words = JSON.parse(wordsData);
      expect(words.TestGroup.TestCategory).toContain("newWord");
    });

    test("should initialize group/category if not exists", async () => {
      const newWord = {
        word: "swim",
        group: "NewGroup",
        category: "NewCategory",
      };
      await request(app).post("/api/words").send(newWord).expect(200);

      const wordsData = await fs.readFile(wordsPath, "utf8");
      const words = JSON.parse(wordsData);
      expect(words.NewGroup.NewCategory).toContain("swim");
    });

    test("should return 400 if word already exists", async () => {
      const existingWord = {
        word: "existingWord",
        group: "TestGroup",
        category: "TestCategory",
      };
      await request(app).post("/api/words").send(existingWord).expect(400);
    });

    test("should return 400 if required fields are missing", async () => {
      await request(app).post("/api/words").send({ word: "test" }).expect(400);
    });
  });

  describe("DELETE /api/words", () => {
    beforeEach(async () => {
      // Start with clean words data for these tests
      await fs.writeFile(
        wordsPath,
        JSON.stringify({
          TestGroup: {
            TestCategory: ["wordToDelete", "wordToKeep"],
          },
        })
      );
    });

    test("should delete an existing word with status 200", async () => {
      await request(app)
        .delete("/api/words")
        .send({ word: "wordToDelete" })
        .expect(200);

      const wordsData = await fs.readFile(wordsPath, "utf8");
      const words = JSON.parse(wordsData);
      expect(words.TestGroup.TestCategory).not.toContain("wordToDelete");
      expect(words.TestGroup.TestCategory).toContain("wordToKeep");
    });

    test("should return 404 if word not found", async () => {
      await request(app)
        .delete("/api/words")
        .send({ word: "nonexistent" })
        .expect(404);
    });

    test("should return 400 if word is missing", async () => {
      await request(app).delete("/api/words").send({}).expect(400);
    });
  });

  describe("GET * (fallback)", () => {
    test("should serve index.html for unknown routes", async () => {
      await request(app)
        .get("/nonexistent")
        .expect(200)
        .expect("Content-Type", /html/);
    });

    test("should return 404 if index.html is missing", async () => {
      try {
        // Temporarily rename index.html
        await fs.rename(indexPath, indexPath + ".bak");

        await request(app).get("/nonexistent").expect(404);
      } finally {
        // Restore the file if it exists
        try {
          await fs.rename(indexPath + ".bak", indexPath);
        } catch (err) {
          if (err.code !== "ENOENT") throw err;
        }
      }
    });
  });
});
