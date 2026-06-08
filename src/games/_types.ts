export type GameStatus = 'prototype' | 'planned'

export type GameAccent = 'mint' | 'cyan' | 'magenta'

export type GameDefinition = {
  id: string
  name: string
  tagline: string
  description: string
  href: string
  accent: GameAccent
  icon: string
  players: string
  status: GameStatus
  tags: string[]
}
