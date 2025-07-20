const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root check
app.get("/", (req, res) => {
  res.send("🎵 YouTube Downloader API is live!");
});

// Get video info
app.get("/info", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing YouTube URL");

  exec(`yt-dlp --cookies ${path.join(__dirname, "cookies.txt")} -J "${url}"`, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr });
    try {
      const info = JSON.parse(stdout);
      res.json(info);
    } catch (parseErr) {
      res.status(500).json({ error: "Error parsing video info" });
    }
  });
});

// Download or Stream
app.get("/api/download", (req, res) => {
  const { url, format } = req.query;
  if (!url || !format) return res.status(400).send("Missing url or format");

  const mime = format === "mp3" ? "audio/mpeg" : "video/mp4";
  const ytdlpArgs = format === "mp3"
    ? '-f bestaudio --extract-audio --audio-format mp3'
    : '-f bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4';

  res.setHeader("Content-Type", mime);

  const command = `yt-dlp --cookies ${path.join(__dirname, "cookies.txt")} ${ytdlpArgs} -o - "${url}"`;
  const process = exec(command, { maxBuffer: 1024 * 1024 * 50 }); // 50MB stream

  process.stdout.pipe(res);
  process.stderr.on("data", data => console.error("Error:", data.toString()));
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
