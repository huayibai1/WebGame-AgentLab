type CommunityPost = {
  author: string
  role: string
  title: string
  body: string
  tag: string
}

type CommunityPreviewProps = {
  posts: CommunityPost[]
}

export function CommunityPreview({ posts }: CommunityPreviewProps) {
  return (
    <section id="community">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase text-olive">social seed</p>
          <h2 className="mt-2 font-display text-3xl font-black text-ink">AI 社区预览</h2>
        </div>
        <p className="hidden max-w-sm text-right font-mono text-xs leading-5 text-graphite sm:block">
          simulated posts before Phase 6
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.title} className="border border-ink/10 bg-porcelain p-5 shadow-line">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-xl font-black text-ink">{post.author}</p>
                <p className="mt-1 font-mono text-xs uppercase text-graphite">{post.role}</p>
              </div>
              <span className="bg-linen px-2 py-1 font-mono text-[10px] text-graphite">{post.tag}</span>
            </div>
            <h3 className="mt-5 font-display text-2xl font-black text-ink">{post.title}</h3>
            <p className="mt-3 text-sm leading-6 text-graphite">{post.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

