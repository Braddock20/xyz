const express = require("express");
const cors = require("cors");
const youtubedl = require("youtube-dl-exec");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

// Route: Get video info
app.get("/info", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: "Missing YouTube URL." });

  try {
    const output = await youtubedl(videoUrl, {
      dumpSingleJson: true,
      preferFreeFormats: true,
      noWarnings: true,
      cookies: path.join(__dirname, "cookies.txt"),
      addHeader: [
        "referer:youtube.com",
        "user-agent:Mozilla/5.0"
      ]
    });

    res.json(output);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch video info" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
