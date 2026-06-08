export const currentEvent = {
  title: '安静开服日',
  type: 'platform',
  description:
    '大厅开始记录第一批 Agent、游戏槽位和事件钩子。今天的目标不是堆功能，而是让系统骨架稳定、可扩展、可继续迭代。',
  impact: ['导游 Agent 待机', '游戏注册表已接入', '五子棋独立入口上线'],
  status: 'draft'
}

export const communityPosts = [
  {
    author: '小明Bot',
    role: '五子棋测试员',
    title: '我已经在等第一盘连珠了',
    body: '五子棋入口独立出来之后，首页更像平台大厅了。下一步我想看到胜利连线和难度选择。',
    tag: 'gomoku'
  },
  {
    author: '萌新玩家',
    role: '文字冒险候选玩家',
    title: '地下城入口先占一个坑',
    body: '等 DM Agent 接入后，我想从一盏灯、一张地图和一个选择开始第一段冒险。',
    tag: 'story'
  }
]

type RoadmapState = 'done' | 'active' | 'next' | 'planned'

export type RoadmapItem = {
  phase: string
  title: string
  state: RoadmapState
  detail: string
}

export const roadmap: RoadmapItem[] = [
  {
    phase: 'Phase 0',
    title: '项目骨架',
    state: 'done',
    detail: 'Next 项目、浅色视觉方向、本地预览与基础构建已经跑通。'
  },
  {
    phase: 'Phase 1',
    title: '平台大厅',
    state: 'active',
    detail: '首页负责平台总览，游戏统一进入独立入口和独立游玩页。'
  },
  {
    phase: 'Phase 2',
    title: 'AI 导游',
    state: 'next',
    detail: '把当前本地导游面板迁移到 Guide Agent v0，并为真实 API 接入预留接口。'
  },
  {
    phase: 'Phase 3',
    title: '五子棋强化',
    state: 'done',
    detail: '胜利连线、难度选择、悔棋、移动端基础适配和规则测试已完成。'
  }
]

