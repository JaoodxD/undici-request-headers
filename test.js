'use strict'

import { createServer } from 'node:http'
import { request } from 'undici'
import assert from 'assert'
import test from 'node:test'

test('with plain object headers', async () => {
  const server = createServer((req, res) => {
    res.end(JSON.stringify(req.headers))
  })
  await server.listen(3000)

  try {
    const headers = {
      'random-header': 'hello world'
    }
    const res = await request('http://localhost:3000', { headers })
    const data = await body(res.body)

    console.log(data)
    assert.ok('random-header' in data)
  } finally {
    server.close()
  }
})

test('with headers via constructor', async () => {
  const server = createServer((req, res) => {
    res.end(JSON.stringify(req.headers))
  })
  await server.listen(3001)

  try {
    const headers = new Headers()
    headers.append('random-header', 'hello world')

    const res = await request('http://localhost:3001', { headers })
    const data = await body(res.body)
    console.log(data)
    assert.ok('random-header' in data)
  } finally {
    server.close()
  }
})

async function body (stream) {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  return JSON.parse(Buffer.concat(chunks).toString())
}
