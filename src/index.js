const os = require('os')
const uuidv4 = require('uuid/v4')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto');

const CTFdScraper = require('./scrapers/CTFdScraper')

function hashStream (stream) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    hash.setEncoding('hex')

    stream.pipe(hash)

    stream.on('end', () => {
      hash.end()

      resolve(hash.read())
    })

    hash.on('error', reject)
  })
}

async function fetchChals(ctf) {
  const scraper = new CTFdScraper(ctf.url)
  scraper.authenticate(ctf || {})

  let chals = await scraper.getChals()

  chals = chals.map(c => ({
    files: c.files || [],
    description: c.description || "",
    tags: c.tags || [],
    hints: c.hints || [],
    category: c.category || "",
    value: c.value || 0,
    name: c.name || "",
    raw: c
  }))


  return Promise.all(chals.map(async c => {
    const catDir = path.join("out", c.category)
    const chalDir = path.join(catDir, c.name)

    try {
      fs.mkdirSync(catDir)
    } catch {}
    try{
      fs.mkdirSync(chalDir)
    } catch {}

    const detailsPath = path.join(chalDir, "README.md")
    fs.writeFile(detailsPath, `# ${c.name} - ${c.value}\n\n${c.description}`, () => {})

    c.files = await Promise.all([...c.files.map(async f => {
      const filePath = path.join(chalDir, f.split("/")[3].split("?")[0])
      const file = fs.createWriteStream(filePath)

      const res = await scraper.getFile(f)
      res.pipe(file)

      // const hash = await hashStream(res)
      // return hash
    })])
  }))
}

try {
  fs.mkdirSync("out/")
} catch {}

fetchChals(require('../config/auth.json')).then().catch(console.error)