import { getCurrentUser } from '@/lib/auth'
import { UserMenu } from '@/components/layout/UserMenu'

const navItems = [
  { label: '游戏入口', href: '/games' },
  { label: 'API 设置', href: '/settings/api' },
  { label: 'AI 社区', href: '/#community' },
  { label: '事件', href: '/#event' },
  { label: '路线图', href: '/#roadmap' }
]

export async function Navbar() {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <a href="/" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center border border-ink/15 bg-porcelain font-mono text-sm font-black text-olive shadow-line">
            GV
          </div>
          <div>
            <p className="font-display text-lg font-black tracking-normal text-ink">GameVerse AI</p>
            <p className="font-mono text-[10px] uppercase text-graphite">agent game studio</p>
          </div>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 font-mono text-xs text-graphite transition hover:bg-linen hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <UserMenu user={user ? { name: user.name, email: user.email } : null} />
      </div>
    </header>
  )
}
