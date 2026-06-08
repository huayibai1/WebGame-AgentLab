import { GameCard } from '@/components/games/GameCard'
import { Navbar } from '@/components/layout/Navbar'
import { games } from '@/data/games'
import { getGameById } from '@/games/_registry'

type GamesPageProps = {
  searchParams?: {
    login?: string
    registered?: string
  }
}

export default function GamesPage({ searchParams }: GamesPageProps) {
  const playableGame = getGameById('gomoku')
  const plannedGames = games.filter((game) => game.status !== 'prototype')
  const authMessage =
    searchParams?.registered === '1'
      ? '注册成功，已为你登录。'
      : searchParams?.login === '1'
        ? '登录成功，欢迎回来。'
        : ''

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Navbar />

      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="absolute inset-0 paper-grid opacity-70" />
        <div className="absolute inset-0 soft-noise opacity-45" />
        <div className="relative mx-auto max-w-7xl px-5 py-12 lg:py-16">
          {authMessage && (
            <div className="mb-6 inline-flex border border-olive/20 bg-moss px-4 py-3 text-sm text-olive shadow-line">
              {authMessage}
            </div>
          )}
          <p className="font-mono text-xs uppercase text-olive">game entrance</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <h1 className="max-w-4xl font-display text-5xl font-black leading-none text-ink sm:text-7xl">
                游戏从这里进入。
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-graphite">
                GameVerse AI 当前先开放五子棋。首页保留平台概览，具体小游戏统一从游戏入口进入，方便后续继续扩展文字冒险、猜谜和更多玩法。
              </p>
            </div>

            <div className="border border-ink/10 bg-porcelain p-5 shadow-line">
              <p className="font-mono text-xs uppercase text-olive">available now</p>
              <p className="mt-3 font-display text-4xl font-black text-ink">01</p>
              <p className="mt-2 text-sm leading-6 text-graphite">
                一个可玩入口已经接入注册表。后续新增游戏时，只需要补充配置、页面和组件。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase text-olive">playable</p>
            <h2 className="mt-2 font-display text-3xl font-black text-ink">当前可玩</h2>
          </div>
          <p className="hidden max-w-sm text-right font-mono text-xs leading-5 text-graphite sm:block">
            click the card to enter the game page
          </p>
        </div>

        {playableGame && (
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
            <GameCard game={playableGame} />
            <aside className="border border-ink/10 bg-porcelain p-5 shadow-line">
              <p className="font-mono text-xs uppercase text-olive">entry note</p>
              <h3 className="mt-3 font-display text-2xl font-black text-ink">五子棋已从首页移出</h3>
              <p className="mt-3 text-sm leading-6 text-graphite">
                棋盘现在只在独立游玩页出现。这样首页不会被单个小游戏占据，平台结构也更清楚。
              </p>
              <a
                href={playableGame.href}
                className="mt-6 inline-flex border border-olive/30 bg-moss px-4 py-2 font-mono text-xs text-olive transition hover:border-ink/20 hover:bg-porcelain hover:text-ink"
              >
                进入五子棋
              </a>
            </aside>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14">
        <div className="mb-5">
          <p className="font-mono text-xs uppercase text-olive">next slots</p>
          <h2 className="mt-2 font-display text-3xl font-black text-ink">后续游戏槽位</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {plannedGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </main>
  )
}
