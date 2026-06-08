'use client'

export function LogoutButton() {
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  return (
    <button
      onClick={logout}
      className="border border-ink/10 bg-paper px-3 py-2 font-mono text-xs text-graphite transition hover:border-olive/30 hover:text-ink"
    >
      退出登录
    </button>
  )
}
