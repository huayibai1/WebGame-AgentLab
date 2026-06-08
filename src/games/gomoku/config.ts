import type { GameDefinition } from '../_types'

export const gomokuConfig: GameDefinition = {
  id: 'gomoku',
  name: '五子棋',
  tagline: '本地 AI 对弈',
  description: '当前首个可玩小游戏。玩家执黑先手，小宇执白，用本地启发式算法完成攻防。',
  href: '/games/gomoku',
  accent: 'mint',
  icon: '05',
  players: '1vAI',
  status: 'prototype',
  tags: ['棋类', '策略', '已可玩']
}
