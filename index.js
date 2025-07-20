import express from 'express'
import { ytv, yta } from './y2mate.js'

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('✅ YouTube Downloader API is running.')
})

app.get('/ytv', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'Missing URL' })
  try {
    const result = await ytv(url)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch video info', details: err.message })
  }
})

app.get('/yta', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'Missing URL' })
  try {
    const result = await yta(url)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audio info', details: err.message })
  }
})

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
