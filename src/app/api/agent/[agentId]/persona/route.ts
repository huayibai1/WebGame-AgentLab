import { NextResponse } from 'next/server'
import { guidePersona, guideQuickPrompts } from '@/agents/guide/persona'

type RouteContext = {
  params: {
    agentId: string
  }
}

export async function GET(_request: Request, context: RouteContext) {
  if (context.params.agentId !== 'guide') {
    return NextResponse.json({ error: `Unsupported agent: ${context.params.agentId}` }, { status: 404 })
  }

  return NextResponse.json({
    persona: guidePersona,
    quickPrompts: guideQuickPrompts
  })
}

