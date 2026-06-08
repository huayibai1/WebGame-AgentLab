import { describe, expect, it } from 'vitest'
import { currentEvent } from '@/data/home'
import { games } from '@/data/games'
import { buildGuideWelcome, runGuideAgent } from './agent'

const context = {
  games,
  currentEvent
}

describe('Guide Agent', () => {
  it('builds starter messages with actions', () => {
    const welcome = buildGuideWelcome()

    expect(welcome).toHaveLength(2)
    expect(welcome[0].text).toContain('小玉')
    expect(welcome[0].actions[0].href).toBe('/games')
    expect(welcome[1].actions[0].href).toBe('/games/gomoku')
  })

  it('recommends the playable game', () => {
    const reply = runGuideAgent('推荐一个游戏', context)

    expect(reply.text).toContain('五子棋')
    expect(reply.actions.some((action) => action.href === '/games/gomoku')).toBe(true)
  })

  it('answers event questions from context', () => {
    const reply = runGuideAgent('现在有什么事件', context)

    expect(reply.text).toContain(currentEvent.title)
    expect(reply.actions[0].href).toBe('/#event')
  })

  it('explains the next development step', () => {
    const reply = runGuideAgent('下一步做什么', context)

    expect(reply.text).toContain('API/LLM')
    expect(reply.actions.some((action) => action.href === '/#roadmap')).toBe(true)
  })

  it('falls back to platform guidance', () => {
    const reply = runGuideAgent('随便聊聊', context)

    expect(reply.text).toContain('本地 Guide Agent')
    expect(reply.actions).toHaveLength(2)
  })
})

