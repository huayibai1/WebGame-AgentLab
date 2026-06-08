import { GuidePanel } from '@/components/agent/GuidePanel'
import { GameCard } from '@/components/games/GameCard'
import { CommunityPreview } from '@/components/home/CommunityPreview'
import { EventPreview } from '@/components/home/EventPreview'
import { RoadmapStrip } from '@/components/home/RoadmapStrip'
import { Navbar } from '@/components/layout/Navbar'
import { games, platformStats } from '@/data/games'
import { communityPosts, currentEvent, roadmap } from '@/data/home'

export default function HomePage() {
  const playableGames = games.filter((game) => game.status === 'prototype')

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Navbar />

      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="absolute inset-0 paper-grid opacity-70" />
        <div className="absolute inset-0 soft-noise opacity-45" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1fr_360px] lg:py-16">
          <div>
            <p className="font-mono text-xs uppercase text-olive">Phase 1 / platform lobby</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-black leading-none text-ink sm:text-7xl">
              AI 小游戏平台的第一层大厅。
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-graphite">
              GameVerse AI 先把平台骨架、游戏入口和导游面板搭起来。当前只开放五子棋，首页负责总览，具体游玩进入独立游戏页面。
            </p>

            <div className="mt-9 grid max-w-xl grid-cols-3 border border-ink/10 bg-porcelain shadow-line">
              {platformStats.map((stat) => (
                <div key={stat.label} className="border-r border-ink/10 p-4 last:border-r-0">
                  <p className="font-display text-3xl font-black text-olive">{stat.value}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase text-graphite">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/games"
                className="border border-olive/30 bg-moss px-4 py-3 font-mono text-xs text-olive transition hover:border-ink/20 hover:bg-porcelain hover:text-ink"
              >
                进入游戏入口
              </a>
              <a
                href="/games/gomoku"
                className="border border-ink/10 bg-porcelain px-4 py-3 font-mono text-xs text-graphite transition hover:border-olive/30 hover:text-ink"
              >
                直接开始五子棋
              </a>
            </div>
          </div>

          <GuidePanel />
        </div>
      </section>

      <RoadmapStrip items={roadmap} />

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase text-olive">game entrance</p>
            <h2 className="mt-2 font-display text-3xl font-black text-ink">当前游戏入口</h2>
          </div>
          <p className="hidden max-w-sm text-right font-mono text-xs leading-5 text-graphite sm:block">
            the lobby links to game pages instead of embedding boards
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
          {playableGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
          <aside className="border border-ink/10 bg-porcelain p-5 shadow-line">
            <p className="font-mono text-xs uppercase text-olive">structure</p>
            <h3 className="mt-3 font-display text-2xl font-black text-ink">首页不再承载棋盘</h3>
            <p className="mt-3 text-sm leading-6 text-graphite">
              游戏统一放进独立路由。后续增加小游戏时，首页只展示入口和状态，不会变成堆叠 demo 的长页面。
            </p>
            <a href="/games" className="mt-6 inline-flex font-mono text-xs text-olive transition hover:text-ink">
              查看游戏入口
            </a>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-10">
        <EventPreview event={currentEvent} />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14">
        <CommunityPreview posts={communityPosts} />
      </section>
    </main>
  )
}

