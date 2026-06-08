import { Navbar } from '@/components/layout/Navbar'
import { GomokuPrototype } from '@/games/gomoku/component'
import { gomokuConfig } from '@/games/gomoku/config'

export default function GomokuPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <Navbar />

      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="absolute inset-0 paper-grid opacity-70" />
        <div className="absolute inset-0 soft-noise opacity-45" />
        <div className="relative mx-auto max-w-7xl px-5 py-10 lg:py-12">
          <a href="/games" className="font-mono text-xs text-olive transition hover:text-ink">
            返回游戏入口
          </a>
          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase text-olive">{gomokuConfig.tagline}</p>
              <h1 className="mt-3 font-display text-5xl font-black leading-none text-ink sm:text-7xl">
                {gomokuConfig.name}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-graphite">{gomokuConfig.description}</p>
            </div>

            <aside className="border border-ink/10 bg-porcelain p-5 shadow-line">
              <p className="font-mono text-xs uppercase text-olive">prototype status</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="border border-ink/10 bg-paper p-3">
                  <p className="font-mono text-[10px] uppercase text-graphite">mode</p>
                  <p className="mt-1 font-display text-xl font-black text-ink">本地 AI</p>
                </div>
                <div className="border border-ink/10 bg-paper p-3">
                  <p className="font-mono text-[10px] uppercase text-graphite">board</p>
                  <p className="mt-1 font-display text-xl font-black text-ink">15 x 15</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-graphite">
                当前没有接入远程 API，AI 对手完全在浏览器本地计算。胜负结果、最后一步和胜利连线会在棋盘上直接反馈。
              </p>
            </aside>
          </div>
        </div>
      </section>

      <GomokuPrototype />
    </main>
  )
}

