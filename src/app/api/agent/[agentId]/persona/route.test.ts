import { describe, expect, it } from 'vitest'
import { GET } from './route'

describe('/api/agent/[agentId]/persona', () => {
  it('returns the guide persona', async () => {
    const response = await GET(new Request('http://localhost/api/agent/guide/persona'), {
      params: { agentId: 'guide' }
    })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.persona.name).toBe('小玉')
    expect(data.quickPrompts).toContain('推荐一个游戏')
  })

  it('returns 404 for unsupported agents', async () => {
    const response = await GET(new Request('http://localhost/api/agent/other/persona'), {
      params: { agentId: 'other' }
    })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toContain('Unsupported agent')
  })
})

