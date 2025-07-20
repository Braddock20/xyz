const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/info", (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: "No URL provided" });

  const cmd = `yt-dlp --dump-json --cookies cookies.txt "${videoUrl}"`;
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr || error.message });
    }
    try {
      const info = JSON.parse(stdout);
      res.json(info);
    } catch (parseError) {
      res.status(500).json({ error: "Failed to parse video info" });
    }
  });
});

app.get("/download", (req, res) => {
  const videoUrl = req.query.url;
  const format = req.query.format || "mp3";
  if (!videoUrl) return res.status(400).json({ error: "No URL provided" });

  const fileFormat = format === "mp4" ? "mp4" : "bestaudio";
  const cmd = `yt-dlp -f ${fileFormat} --cookies cookies.txt -o - "${videoUrl}"`;

  const child = exec(cmd);
  res.setHeader("Content-Disposition", `inline; filename="output.${format}"`);
  child.stdout.pipe(res);
  child.stderr.on("data", (err) => console.error(err.toString()));
  child.on("error", () => res.status(500).json({ error: "Download failed" }));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
