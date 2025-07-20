const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Home route
app.get('/', (req, res) => {
  res.send('<h2>YT-DLP API is running</h2><p>Use <code>/info?url=</code> to fetch video data.</p>');
});

// Info route (metadata only)
app.get('/info', (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) return res.status(400).send({ error: 'Missing URL' });

  exec(`yt-dlp -J --no-warnings ${videoURL}`, (err, stdout, stderr) => {
    if (err) return res.status(500).send({ error: stderr || err.message });
    try {
      const info = JSON.parse(stdout);
      res.send(info);
    } catch (e) {
      res.status(500).send({ error: 'Failed to parse video info' });
    }
  });
});

// Stream or download route
app.get('/download', (req, res) => {
  const { url, format = 'mp4' } = req.query;
  if (!url) return res.status(400).send('Missing URL');

  const mime = format === 'mp3' ? 'audio/mpeg' : 'video/mp4';
  res.setHeader('Content-Type', mime);
  const cmd = `yt-dlp -f bestaudio[ext=m4a]+bestvideo[ext=mp4]/best -o - ${url}`;
  const process = exec(cmd);

  process.stdout.pipe(res);
  process.stderr.on('data', (data) => console.error(data.toString()));
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
