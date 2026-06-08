type EventPreviewProps = {
  event: {
    title: string
    type: string
    description: string
    impact: string[]
    status: string
  }
}

export function EventPreview({ event }: EventPreviewProps) {
  return (
    <section id="event" className="border border-ink/10 bg-porcelain p-5 shadow-line">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase text-olive">current event</p>
          <h2 className="mt-2 font-display text-3xl font-black text-ink">{event.title}</h2>
        </div>
        <span className="border border-ink/10 bg-paper px-2 py-1 font-mono text-[10px] uppercase text-graphite">
          {event.status}
        </span>
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-6 text-graphite">{event.description}</p>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {event.impact.map((item) => (
          <div key={item} className="border border-ink/10 bg-paper p-3 font-mono text-xs text-graphite">
            {item}
          </div>
        ))}
      </div>
    </section>
  )
}

