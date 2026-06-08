import type { GuideAgentContext, GuideAgentReply } from '@/agents/_types'
import { guidePersona } from './persona'

function normalize(input: string) {
  return input.trim().toLowerCase()
}

function playableGames(context: GuideAgentContext) {
  return context.games.filter((game) => game.status === 'prototype')
}

function plannedGames(context: GuideAgentContext) {
  return context.games.filter((game) => game.status !== 'prototype')
}

export function buildGuideWelcome(): GuideAgentReply[] {
  return [
    {
      text: guidePersona.greeting,
      actions: [{ label: '查看游戏入口', href: '/games' }]
    },
    {
      text: guidePersona.intro,
      actions: [{ label: '开始五子棋', href: '/games/gomoku' }]
    }
  ]
}

export function runGuideAgent(input: string, context: GuideAgentContext): GuideAgentReply {
  const message = normalize(input)
  const availableGames = playableGames(context)
  const nextGames = plannedGames(context)
  const gomoku = context.games.find((game) => game.id === 'gomoku')

  if (!message) {
    return {
      text: '我在。你可以问我推荐游戏、当前事件，或下一步开发方向。',
      actions: [{ label: '查看游戏入口', href: '/games' }]
    }
  }

  if (message.includes('事件') || message.includes('event')) {
    return {
      text: `当前事件是「${context.currentEvent.title}」。${context.currentEvent.description}`,
      actions: [{ label: '查看首页事件', href: '/#event' }]
    }
  }

  if (message.includes('下一步') || message.includes('计划') || message.includes('开发') || message.includes('next')) {
    return {
      text: '下一步建议把 Guide Agent 从本地规则升级成真实 API/LLM 流式回复，同时保留游戏推荐和事件说明能力。',
      actions: [
        { label: '查看路线图', href: '/#roadmap' },
        { label: '查看游戏入口', href: '/games' }
      ]
    }
  }

  if (message.includes('五子棋') || message.includes('gomoku')) {
    return {
      text: '五子棋已经是当前首个可玩小游戏，支持本地 AI、难度选择、悔棋、胜利连线和规则测试。',
      actions: [{ label: '开始五子棋', href: gomoku?.href || '/games/gomoku' }]
    }
  }

  if (message.includes('游戏') || message.includes('推荐') || message.includes('玩') || message.includes('game')) {
    const primary = availableGames[0]
    const planned = nextGames.map((game) => game.name).join('、') || '更多游戏'

    if (!primary) {
      return {
        text: `当前还没有可玩游戏，规划中的游戏包括：${planned}。`,
        actions: [{ label: '查看游戏入口', href: '/games' }]
      }
    }

    return {
      text: `我推荐先玩「${primary.name}」。它已经接入独立页面和本地 AI。后续规划中的槽位包括：${planned}。`,
      actions: [
        { label: `开始${primary.name}`, href: primary.href },
        { label: '查看所有游戏', href: '/games' }
      ]
    }
  }

  if (message.includes('社区') || message.includes('帖子') || message.includes('social')) {
    return {
      text: 'AI 社区目前还是静态预览，后续会加入 AI 玩家发帖、评论和挑战记录。',
      actions: [{ label: '查看社区预览', href: '/#community' }]
    }
  }

  return {
    text: '收到。我现在还是本地 Guide Agent，会优先回答游戏入口、五子棋、事件和下一步计划。真实 API 接入后，这里会变成流式对话。',
    actions: [
      { label: '游戏入口', href: '/games' },
      { label: '五子棋', href: '/games/gomoku' }
    ]
  }
}

