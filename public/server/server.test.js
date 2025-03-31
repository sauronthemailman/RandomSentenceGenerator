// public/server/server.test.js
const request = require("supertest");
const fs = require("fs").promises;
const path = require("path");
const app = require("./server"); 
const jsonDir = path.join(__dirname, "..", "json");
const wordsPath = path.join(jsonDir, "word.json"); 
const historyPath = path.join(jsonDir, "History.json"); 

//Function to reset test files
async function resetTestFiles() {
  const initialWords = {
    group1: {
      nouns: ["cat", "dog"],
      verbs: ["run", "jump"],
    },
    group2: {
      adjectives: ["happy", "sad"],
    },
  };

  const initialHistory = [
    {
      id: 1,
      sentence: "Test sentence 1.",
      timestamp: "2023-01-01T00:00:00.000Z",
    },
    {
      id: 2,
      sentence: "Test sentence 2.",
      timestamp: "2023-01-02T00:00:00.000Z",
    },
  ];

  await fs.writeFile(wordsPath, JSON.stringify(initialWords));
  await fs.writeFile(historyPath, JSON.stringify(initialHistory));
}

describe("Random Sentence Generator API Tests", () => {
  beforeAll(async () => {
    await resetTestFiles();
  });

  afterEach(async () => {
    await resetTestFiles();
  });

  // Test GET /api/words
  describe("GET /api/words", () => {
    test("should return all words with status 200", async () => {
      const response = await request(app)
        .get("/api/words")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toHaveProperty("group1");
      expect(response.body.group1).toHaveProperty("nouns");
      expect(response.body.group1.nouns).toContain("cat");
    });

    test("should return 500 if words file is missing", async () => {
      await fs.unlink(wordsPath);
      await request(app).get("/api/words").expect(500);
    });
  });

  // Test GET /api/history
  describe("GET /api/history", () => {
    test("should return history with status 200", async () => {
      const response = await request(app)
        .get("/api/history")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty("sentence");
      expect(response.body[0]).toHaveProperty("timestamp");
    });

    test("should convert old string format to object format", async () => {
      await fs.writeFile(historyPath, JSON.stringify(["old sentence"]));

      const response = await request(app).get("/api/history").expect(200);

      expect(typeof response.body[0]).toBe("object");
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("sentence");
    });

    test("should return 500 if history file is missing", async () => {
      await fs.unlink(historyPath);
      await request(app).get("/api/history").expect(500);
    });
  });

  // Test POST /api/history
  describe("POST /api/history", () => {
    test("should add a new sentence to history with status 200", async () => {
      const newSentence = "This is a new test sentence";
      const response = await request(app)
        .post("/api/history")
        .send({ sentence: newSentence })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify sentence was added
      const historyData = await fs.readFile(historyPath, "utf8");
      const history = JSON.parse(historyData);
      expect(history[0].sentence).toContain(newSentence);
    });

    test("should format the sentence correctly", async () => {
      const testSentence = "test sentence  ";
      await request(app).post("/api/history").send({ sentence: testSentence });

      const historyData = await fs.readFile(historyPath, "utf8");
      const history = JSON.parse(historyData);
      expect(history[0].sentence).toMatch(/\.\n?$/);
    });

    test("should limit history to 8 items", async () => {
      // Fill history with 9 items
      const longHistory = Array(9)
        .fill()
        .map((_, i) => ({
          id: i,
          sentence: `Sentence ${i}`,
          timestamp: new Date().toISOString(),
        }));
      await fs.writeFile(historyPath, JSON.stringify(longHistory));

      // Add one more
      await request(app)
        .post("/api/history")
        .send({ sentence: "New sentence" });

      const historyData = await fs.readFile(historyPath, "utf8");
      const history = JSON.parse(historyData);
      expect(history.length).toBe(8);
    });

    test("should return 400 if sentence is missing", async () => {
      await request(app).post("/api/history").send({}).expect(400);
    });
  });

  // Test POST /api/words
  describe("POST /api/words", () => {
    test("should add a new word with status 200", async () => {
      const newWord = { word: "bird", group: "group1", category: "nouns" };
      const response = await request(app)
        .post("/api/words")
        .send(newWord)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify word added
      const wordsData = await fs.readFile(wordsPath, "utf8");
      const words = JSON.parse(wordsData);
      expect(words.group1.nouns).toContain("bird");
    });

    test("should initialize group/category if not exists", async () => {
      const newWord = { word: "swim", group: "group1", category: "verbs" };
      await request(app).post("/api/words").send(newWord);

      const wordsData = await fs.readFile(wordsPath, "utf8");
      const words = JSON.parse(wordsData);
      expect(words.group1.verbs).toContain("swim");
    });

    test("should return 400 if word already exists", async () => {
      const existingWord = { word: "cat", group: "group1", category: "nouns" };
      await request(app).post("/api/words").send(existingWord).expect(400);
    });

    test("should return 400 if required fields are missing", async () => {
      await request(app).post("/api/words").send({ word: "test" }).expect(400);
    });
  });

  // Test DELETE /api/words
  describe("DELETE /api/words", () => {
    test("should delete an existing word with status 200", async () => {
      const wordToDelete = { word: "cat" };
      const response = await request(app)
        .delete("/api/words")
        .send(wordToDelete)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify word deleted
      const wordsData = await fs.readFile(wordsPath, "utf8");
      const words = JSON.parse(wordsData);
      expect(words.group1.nouns).not.toContain("cat");
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

  // Test fallback 
  describe("GET * (fallback)", () => {
    test("should serve index.html for unknown routes", async () => {
      await request(app)
        .get("/unknown-route")
        .expect(200)
        .expect("Content-Type", /html/);
    });

    test("should return 404 if index.html is missing", async () => {
      const indexPath = path.join(__dirname, "..", "..", "index.html");
      try {
        await fs.rename(indexPath, indexPath + ".bak");
        await request(app).get("/unknown-route").expect(404);
      } finally {
        // Restore the file
        await fs.rename(indexPath + ".bak", indexPath);
      }
    });
  });
});
