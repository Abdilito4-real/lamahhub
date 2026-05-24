import http from 'http'

const body = JSON.stringify({ reference: 'test' })

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/submissions/checkin',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  },
}

const req = http.request(options, (res) => {
  let data = ''
  res.on('data', (chunk) => {
    data += chunk
  })
  res.on('end', () => {
    console.log('status', res.statusCode)
    console.log('headers', res.headers)
    console.log('body', data)
  })
})

req.on('error', (err) => {
  console.error('request error', err)
  process.exit(1)
})

req.write(body)
req.end()
