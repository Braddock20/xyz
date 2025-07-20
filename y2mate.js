import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

async function ytv(yutub) {
  const post = (url, formdata) =>
    fetch(url, {
      method: 'POST',
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: new URLSearchParams(Object.entries(formdata)),
    })

  const ytIdRegex =
    /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/

  const ytId = ytIdRegex.exec(yutub)
  if (!ytId) throw new Error('Invalid YouTube URL')
  const url = 'https://youtu.be/' + ytId[1]

  const res = await post('https://www.y2mate.com/mates/en68/analyze/ajax', {
    url,
    q_auto: 0,
    ajax: 1,
  })

  const mela = await res.json()
  const $ = cheerio.load(mela.result)

  const thumb = $('.thumbnail.cover > a > img').attr('src')
  const title = $('.thumbnail.cover > div > b').text()
  const quality = $('#mp4 > table > tbody > tr:nth-child(4) > td:nth-child(3) > a').attr('data-fquality')
  const tipe = $('#mp4 > table > tbody > tr:nth-child(3) > td:nth-child(3) > a').attr('data-ftype')
  const output = `${title}.${tipe}`
  const size = $('#mp4 > table > tbody > tr:nth-child(2) > td:nth-child(2)').text()
  const id = /var k__id = "(.*?)"/.exec(mela.result)[1]

  const res2 = await post('https://www.y2mate.com/mates/en68/convert', {
    type: 'youtube',
    _id: id,
    v_id: ytId[1],
    ajax: '1',
    token: '',
    ftype: tipe,
    fquality: quality,
  })

  const meme = await res2.json()
  const supp = cheerio.load(meme.result)
  const link = supp('div').find('a').attr('href')

  return { thumb, title, quality, tipe, size, output, link }
}

async function yta(yutub) {
  const post = (url, formdata) =>
    fetch(url, {
      method: 'POST',
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: new URLSearchParams(Object.entries(formdata)),
    })

  const ytIdRegex =
    /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/

  const ytId = ytIdRegex.exec(yutub)
  if (!ytId) throw new Error('Invalid YouTube URL')
  const url = 'https://youtu.be/' + ytId[1]

  const res = await post('https://www.y2mate.com/mates/en68/analyze/ajax', {
    url,
    q_auto: 0,
    ajax: 1,
  })

  const mela = await res.json()
  const $ = cheerio.load(mela.result)

  const thumb = $('.thumbnail.cover > a > img').attr('src')
  const title = $('.thumbnail.cover > div > b').text()
  const size = $('#mp3 > table > tbody > tr > td:nth-child(2)').text()
  const tipe = $('#mp3 > table > tbody > tr > td:nth-child(3) > a').attr('data-ftype')
  const quality = $('#mp3 > table > tbody > tr > td:nth-child(3) > a').attr('data-fquality')
  const output = `${title}.${tipe}`
  const id = /var k__id = "(.*?)"/.exec(mela.result)[1]

  const res2 = await post('https://www.y2mate.com/mates/en68/convert', {
    type: 'youtube',
    _id: id,
    v_id: ytId[1],
    ajax: '1',
    token: '',
    ftype: tipe,
    fquality: quality,
  })

  const meme = await res2.json()
  const supp = cheerio.load(meme.result)
  const link = supp('div').find('a').attr('href')

  return { thumb, title, quality, tipe, size, output, link }
}

export { ytv, yta }
