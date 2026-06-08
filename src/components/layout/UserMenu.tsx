'use client'

import { LogOut, Settings, UserRound, UsersRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type UserMenuProps = {
  user: {
    name: string
    email: string
  } | null
}

function getInitial(name: string, email: string) {
  const source = name.trim() || email.trim()
  return source.slice(0, 1).toUpperCase()
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  async function switchAccount() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/auth/login'
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <a
          href="/auth/login"
          className="hidden border border-ink/10 bg-paper px-3 py-2 font-mono text-xs text-graphite transition hover:border-olive/30 hover:text-ink sm:inline-flex"
        >
          登录
        </a>
        <a
          href="/auth/register"
          className="border border-ink/15 bg-porcelain px-3 py-2 font-mono text-xs text-olive transition hover:border-olive/40 hover:bg-moss"
        >
          注册
        </a>
      </div>
    )
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 items-center gap-2 border border-ink/15 bg-porcelain px-2 pr-3 text-left shadow-line transition hover:border-olive/40 hover:bg-moss"
      >
        <span className="grid h-7 w-7 place-items-center border border-olive/30 bg-moss font-mono text-xs font-black text-olive">
          {getInitial(user.name, user.email)}
        </span>
        <span className="hidden max-w-28 truncate font-mono text-xs text-ink sm:block">{user.name}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-64 border border-ink/10 bg-porcelain p-2 shadow-line"
        >
          <div className="border-b border-ink/10 px-3 py-3">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            <p className="mt-1 truncate font-mono text-xs text-graphite">{user.email}</p>
          </div>
          <a
            href="/settings/api"
            role="menuitem"
            className="mt-2 flex items-center gap-2 px-3 py-2 text-sm text-graphite transition hover:bg-paper hover:text-ink"
          >
            <Settings className="h-4 w-4" />
            设置
          </a>
          <button
            role="menuitem"
            onClick={switchAccount}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-graphite transition hover:bg-paper hover:text-ink"
          >
            <UsersRound className="h-4 w-4" />
            切换账号
          </button>
          <button
            role="menuitem"
            onClick={logout}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-graphite transition hover:bg-paper hover:text-ink"
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </button>
          <div className="mt-2 border-t border-ink/10 px-3 py-3 text-xs leading-5 text-graphite">
            <UserRound className="mb-2 h-4 w-4 text-olive" />
            当前账号会保持登录 14 天，除非你主动退出。
          </div>
        </div>
      )}
    </div>
  )
}
