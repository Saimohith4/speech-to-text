const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const { createClient } = require("@deepgram/sdk");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.json()); 
const upload = multer({ dest: "uploads/" });


const db = new Database("transcripts.db");

// 🧱 Create users table (for SignUp / SignIn)
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`).run();

// 🧱 Create transcripts table
db.prepare(`
  CREATE TABLE IF NOT EXISTS transcripts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();


const deepgram = createClient("b9ca06c6fa4826dae5df82f23088f972dc77bcd3");


app.get("/", (req, res) => {
  res.send("🎤 Deepgram Speech-to-Text Backend with Authentication ✅");
});



// 🧩 SIGN UP
app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;
  try {
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, password);
    res.json({ success: true, message: "Account created successfully!" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Username already exists" });
  }
});

// 🧩 SIGN IN
app.post("/api/signin", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
  if (user) {
    res.json({ success: true, userId: user.id });
  } else {
    res.status(401).json({ success: false, message: "Invalid username or password" });
  }
});



// =============================================================
app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    console.log("🎧 Received audio:", req.file.path);
    const audioFile = fs.readFileSync(req.file.path);

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioFile,
      {
        mimetype: "audio/webm",
        model: "nova-2",
        smart_format: true,
      }
    );

    if (error) {
      console.error("❌ Deepgram error:", error);
      return res.status(500).json({ error: "Deepgram transcription failed." });
    }

    const transcript = result.results.channels[0].alternatives[0].transcript;

 
    db.prepare("INSERT INTO transcripts (text) VALUES (?)").run(transcript);

    res.json({ transcript });
    fs.unlink(req.file.path, () => {});
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Server failed to transcribe audio." });
  }
});



// =============================================================
app.get("/api/history", (req, res) => {
  const rows = db.prepare("SELECT * FROM transcripts ORDER BY id DESC").all();
  res.json(rows);
});

app.delete("/api/history", (req, res) => {
  try {
    db.prepare("DELETE FROM transcripts").run();
    res.json({ message: "All transcripts deleted successfully." });
  } catch (error) {
    console.error("❌ Failed to delete transcripts:", error);
    res.status(500).json({ error: "Failed to delete transcripts." });
  }
});



// =============================================================
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
