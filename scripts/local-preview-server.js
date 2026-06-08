const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const port = Number(process.env.PORT || 5173)

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.ico': 'image/x-icon'
}

function resolveRequestPath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0])
  const routeMap = {
    '/': 'preview.html',
    '/games': 'games.html',
    '/games/': 'games.html',
    '/games/gomoku': 'gomoku.html',
    '/games/gomoku/': 'gomoku.html'
  }
  const relativePath = routeMap[cleanPath] || cleanPath.replace(/^\/+/, '')
  const filePath = path.resolve(root, relativePath)

  if (!filePath.startsWith(root)) {
    return null
  }

  return filePath
}

const server = http.createServer((request, response) => {
  const filePath = resolveRequestPath(request.url || '/')

  if (!filePath) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Forbidden')
    return
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('Not found')
      return
    }

    const ext = path.extname(filePath).toLowerCase()
    response.writeHead(200, {
      'Content-Type': contentTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    })
    response.end(content)
  })
})

server.listen(port, '127.0.0.1', () => {
  console.log(`GameVerse AI preview is running at http://localhost:${port}/`)
  console.log('Press Ctrl+C to stop the server.')
})
