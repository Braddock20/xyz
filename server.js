const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const cookiesPath = path.join(__dirname, 'cookies.txt');

app.get('/', (req, res) => {
  res.send(`<h1>✅ YouTube Downloader API with Cookies</h1>`);
});

app.get('/info', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const info = await youtubedl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true,
      cookies: cookiesPath
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
    cookies: cookiesPath
  });

  res.setHeader('Content-Disposition', `attachment; filename="video.${format || 'mp4'}"`);
  res.setHeader('Content-Type', format === 'mp3' ? 'audio/mpeg' : 'video/mp4');

  ytdlStream.stdout.pipe(res);
});
