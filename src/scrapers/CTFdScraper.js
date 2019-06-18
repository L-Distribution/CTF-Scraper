const fetch = require('node-fetch')

class CTFdScraper {
  constructor (url) {
    this.apiUrl = `${url}/api/v1`
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
    return new Promise((resolve, reject) => {
      if (!this.cookie) reject("")

      fetch(`${this.apiUrl}/${path}`, {
        headers: {
          'Cookie': 'session=' + this.cookie
        }
      }).then(res => res.json()).then(res => {
        if (res.success) resolve(res.data)
        else reject(res.errors)
      }).catch(reject)
    })
  }

  getChal (id) {
    return this.fetchFromCTFd(`challenges/${id}`)
  }

  getChals () {
    this.fetchFromCTFd('challenges').then(data => {
      for (const chal of data) {
        this.getChal(chal.id).then(chalData => {
          console.log(chalData)
        }).catch(e => {
          console.log(e)
        })
      }
    })
  }
}

module.exports = CTFdScraper
