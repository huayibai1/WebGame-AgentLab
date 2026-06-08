import type { GameDefinition } from '@/games/_types'

export type AgentRole = 'guide'

export type AgentMessage = {
  id: number
  from: AgentRole | 'user'
  text: string
  actions?: AgentAction[]
}

export type AgentAction = {
  label: string
  href: string
}

export type GuideAgentContext = {
  games: GameDefinition[]
  currentEvent: {
    title: string
    description: string
    impact: string[]
    status: string
  }
  currentPath?: string
}

export type GuideAgentReply = {
  text: string
  actions: AgentAction[]
}

