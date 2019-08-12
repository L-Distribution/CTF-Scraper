const fetch = require('node-fetch')
const https = require('https')

class CTFdScraper {
  constructor (url) {
    this.url = `${url}`
  }

  authenticate (options) {
    if (options.cookie) {
      this.cookie = options.cookie
    } else if (options.username) {
      // lmao implement this
    } else {
      // what are you doing
    }
  }

  fetchFromCTFd (path) {
    if (!this.cookie) return new Promise((resolve, reject) => reject(new Error("Not authenticated")))

    return fetch(`${this.url}/api/v1/${path}`, {
      headers: {
        'Cookie': 'session=' + this.cookie
      }
    }).then(res => res.json()).then(res => {
      if (res.success) return res.data
      else throw new Error(res.errors)
    })
  }

  getChal (id) {
    return this.fetchFromCTFd(`challenges/${id}`)
  }

  getChals () {
    return this.fetchFromCTFd('challenges').then(data =>
      Promise.all(data.map(chal => this.getChal(chal.id)))
    )
  }

  getFile (path) {
    return new Promise((resolve, reject) => {
      https.get(this.url + path, {
        headers: {
          'Cookie': 'session=' + this.cookie
        }
      }, resolve).on('error', e => {
        reject(new Error(e))
      })
    })
  }

}

module.exports = CTFdScraper
