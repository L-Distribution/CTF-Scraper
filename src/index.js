const fetch = require('node-fetch')

const cookie = 'CENSORED'

function getChal(id) {
  return fetch(`https://ctf.hsctf.com/api/v1/challenges/${id}`, {
    headers: {
      'Cookie': 'session=' + cookie
    }
  }).then(res => res.json())
}

fetch('https://ctf.hsctf.com/api/v1/challenges', {
  headers: {
    'Cookie': 'session=' + cookie
  }
}).then(res => res.json()).then(res => {
  console.log(res)
  for (const chal of res.data) {
    getChal(chal.id).then(res => {
      console.log(res)
    })
  }
})