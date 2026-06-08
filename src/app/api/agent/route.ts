import { NextResponse } from 'next/server'
import { runGuideAgent } from '@/agents/guide/agent'
import { currentEvent } from '@/data/home'
import { games } from '@/data/games'

type AgentRequestBody = {
  agentId?: string
  message?: string
  context?: {
    currentPath?: string
  }
}

export async function POST(request: Request) {
  let body: AgentRequestBody

  try {
    const rawBody = await request.text()
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (body.agentId && body.agentId !== 'guide') {
    return NextResponse.json({ error: `Unsupported agent: ${body.agentId}` }, { status: 400 })
  }

  const message = typeof body.message === 'string' ? body.message : ''
  const reply = runGuideAgent(message, {
    games,
    currentEvent,
    currentPath: body.context?.currentPath
  })

  return NextResponse.json({
    agentId: 'guide',
    reply
  })
}
