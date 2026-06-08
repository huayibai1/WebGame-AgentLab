import type { GameDefinition } from '@/games/_types'

type GameCardProps = {
  game: GameDefinition
}

const accentClass = {
  mint: 'border-olive/30 text-olive bg-moss/50',
  cyan: 'border-ink/15 text-ink bg-linen/70',
  magenta: 'border-clay/30 text-clay bg-[#f0ded0]'
}

export function GameCard({ game }: GameCardProps) {
  return (
    <article className="group relative overflow-hidden border border-ink/10 bg-porcelain p-4 shadow-line transition duration-300 hover:-translate-y-1 hover:border-olive/30 hover:shadow-soft">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ink/20 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div className={`grid h-16 w-16 shrink-0 place-items-center border font-mono text-xl font-black ${accentClass[game.accent]}`}>
          {game.icon}
        </div>
        <span className="border border-ink/10 bg-paper px-2 py-1 font-mono text-[10px] uppercase text-graphite">
          {game.players}
        </span>
      </div>

      <div className="mt-7">
        <p className="font-mono text-xs uppercase text-graphite">{game.tagline}</p>
        <h3 className="mt-1 font-display text-2xl font-black text-ink">{game.name}</h3>
        <p className="mt-3 min-h-16 text-sm leading-6 text-graphite">{game.description}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {game.tags.map((tag) => (
          <span key={tag} className="bg-linen px-2 py-1 font-mono text-[11px] text-graphite">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4">
        <span className="font-mono text-xs uppercase text-graphite">{game.status}</span>
        <a href={game.href} className="font-mono text-xs text-olive transition group-hover:text-ink">
          {game.status === 'prototype' ? '开始' : '查看计划'}
        </a>
      </div>
    </article>
  )
}
