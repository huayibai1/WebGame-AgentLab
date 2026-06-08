import type { RoadmapItem } from '@/data/home'

type RoadmapStripProps = {
  items: RoadmapItem[]
}

const stateStyle = {
  done: 'bg-moss text-olive',
  active: 'bg-ink text-porcelain',
  next: 'bg-linen text-ink',
  planned: 'bg-paper text-graphite'
}

export function RoadmapStrip({ items }: RoadmapStripProps) {
  return (
    <section id="roadmap" className="border-y border-ink/10 bg-linen/60">
      <div className="mx-auto grid max-w-7xl gap-3 px-5 py-7 md:grid-cols-4">
        {items.map((item) => (
          <article key={item.phase} className="bg-porcelain p-4 shadow-line">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-xs uppercase text-graphite">{item.phase}</p>
              <span className={`px-2 py-1 font-mono text-[10px] uppercase ${stateStyle[item.state]}`}>{item.state}</span>
            </div>
            <h3 className="mt-4 font-display text-xl font-black text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-graphite">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
