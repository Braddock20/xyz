const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send(`
    <h1>✅ YouTube Downloader API</h1>
    <p>Use <code>/info?url=</code> to get video metadata.</p>
    <p>Use <code>/download?url=&format=mp3|mp4</code> to stream audio/video.</p>
  `);
});

app.get('/info', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const info = await youtubedl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true,
    });
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/download', (req, res) => {
  const { url, format } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  const ytdlStream = youtubedl.raw(url, {
    format: format === 'mp3' ? 'bestaudio' : 'bestvideo+bestaudio',
    output: '-',
  });

  res.setHeader('Content-Disposition', `attachment; filename="video.${format || 'mp4'}"`);
  res.setHeader('Content-Type', format === 'mp3' ? 'audio/mpeg' : 'video/mp4');

  ytdlStream.stdout.pipe(res);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
