'use client'

import { FormEvent, useState } from 'react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()
    setLoading(false)

    if (!response.ok) {
      setError(data.error ?? '登录失败')
      return
    }

    window.location.href = '/games?login=1'
  }

  return (
    <form className="grid gap-4 border border-ink/10 bg-porcelain p-6 shadow-line" onSubmit={login}>
      <div className="mb-2 border-b border-ink/10 pb-4">
        <p className="font-mono text-xs uppercase text-olive">session</p>
        <h1 className="mt-2 font-display text-3xl font-black text-ink">登录</h1>
      </div>
      <label className="grid gap-2">
        <span className="font-mono text-xs text-graphite">邮箱</span>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="border border-ink/15 bg-paper px-3 py-3 text-sm outline-none transition focus:border-olive"
          placeholder="you@example.com"
          type="email"
        />
      </label>
      <label className="grid gap-2">
        <span className="font-mono text-xs text-graphite">密码</span>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="border border-ink/15 bg-paper px-3 py-3 text-sm outline-none transition focus:border-olive"
          placeholder="你的账号密码"
          type="password"
        />
      </label>
      {error && <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button
        disabled={loading}
        className="border border-olive/30 bg-moss px-4 py-3 font-mono text-xs text-olive transition hover:border-ink/20 hover:bg-paper disabled:opacity-60"
      >
        {loading ? '正在登录' : '登录'}
      </button>
      <a href="/settings/api" className="text-center font-mono text-xs text-graphite transition hover:text-ink">
        需要时再配置 API
      </a>
    </form>
  )
}
