import type { GameDefinition } from './_types'
import { gomokuConfig } from './gomoku/config'

export const gameRegistry: GameDefinition[] = [
  gomokuConfig,
  {
    id: 'text-adventure',
    name: 'Signal Dungeon',
    tagline: '文字冒险',
    description: '计划中的分支叙事游戏，将由 DM Agent 推进场景和选择。',
    href: '/games',
    accent: 'cyan',
    icon: 'DM',
    players: 'Solo',
    status: 'planned',
    tags: ['叙事', 'Agent', '规划中']
  },
  {
    id: 'quiz',
    name: 'Riddle Relay',
    tagline: 'AI 猜谜',
    description: '计划中的生成谜题玩法，后续会加入评分、提示和动态难度。',
    href: '/games',
    accent: 'magenta',
    icon: 'Q?',
    players: '1vAI',
    status: 'planned',
    tags: ['解谜', '生成', '规划中']
  }
]

export function getGameById(id: string) {
  return gameRegistry.find((game) => game.id === id)
}

