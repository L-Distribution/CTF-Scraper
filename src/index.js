const CTFdScraper = require('./scrapers/CTFdScraper.js')

const scraper = new CTFdScraper("https://ctf.hsctf.com")
scraper.authenticate(require('../config/auth.json'))

scraper.getChals()
