import { describe, expect, it } from 'vitest'
import { POST } from './route'

function jsonRequest(body: unknown) {
  return new Request('http://localhost/api/agent', {
    method: 'POST',
    body: JSON.stringify(body)
  })
}

describe('/api/agent', () => {
  it('returns a guide reply', async () => {
    const response = await POST(jsonRequest({ agentId: 'guide', message: '推荐一个游戏' }))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.agentId).toBe('guide')
    expect(data.reply.text).toContain('五子棋')
    expect(data.reply.actions.some((action: { href: string }) => action.href === '/games/gomoku')).toBe(true)
  })

  it('rejects unsupported agents', async () => {
    const response = await POST(jsonRequest({ agentId: 'unknown', message: 'hello' }))
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('Unsupported agent')
  })

  it('rejects invalid json', async () => {
    const response = await POST(
      new Request('http://localhost/api/agent', {
        method: 'POST',
        body: '{bad json'
      })
    )
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid JSON body')
  })
})

