const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Path to your cookies.txt
const cookiesPath = path.join(__dirname, 'cookies.txt');

app.use(cors());

app.get('/', (req, res) => {
  res.send('🎧 YouTube API is live with cookies support!');
});

app.get('/info', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Missing ?url parameter' });

  try {
    const output = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      cookies: cookiesPath,
      addHeader: [
        'referer:youtube.com',
        'user-agent:Mozilla/5.0'
      ]
    });

    res.json(output);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
