'use client'

import { FormEvent, useState } from 'react'

type Step = 'profile' | 'verify' | 'done'

export function RegisterForm() {
  const [step, setStep] = useState<Step>('profile')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const response = await fetch('/api/auth/register/request-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })

    const data = await response.json()
    setLoading(false)

    if (!response.ok) {
      setError(data.error ?? '验证码生成失败')
      return
    }

    setMessage('验证码已经输出到 start-preview.bat 的服务器窗口。')
    setStep('verify')
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const response = await fetch('/api/auth/register/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    })

    const data = await response.json()
    setLoading(false)

    if (!response.ok) {
      setError(data.error ?? '验证失败')
      return
    }

    setStep('done')
    window.setTimeout(() => {
      window.location.href = '/games?registered=1'
    }, 700)
  }

  return (
    <div className="border border-ink/10 bg-porcelain p-6 shadow-line">
      <div className="mb-6 flex items-center justify-between border-b border-ink/10 pb-4">
        <div>
          <p className="font-mono text-xs uppercase text-olive">account</p>
          <h1 className="mt-2 font-display text-3xl font-black text-ink">创建账号</h1>
        </div>
        <span className="font-mono text-xs text-graphite">{step === 'profile' ? '1 / 2' : '2 / 2'}</span>
      </div>

      {step === 'profile' && (
        <form className="grid gap-4" onSubmit={requestCode}>
          <label className="grid gap-2">
            <span className="font-mono text-xs text-graphite">姓名</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="border border-ink/15 bg-paper px-3 py-3 text-sm outline-none transition focus:border-olive"
              placeholder="小玉"
            />
          </label>
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
              placeholder="至少 8 位"
              type="password"
            />
          </label>
          {error && <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button
            disabled={loading}
            className="border border-olive/30 bg-moss px-4 py-3 font-mono text-xs text-olive transition hover:border-ink/20 hover:bg-paper disabled:opacity-60"
          >
            {loading ? '正在生成验证码' : '生成本地验证码'}
          </button>
        </form>
      )}

      {step === 'verify' && (
        <form className="grid gap-4" onSubmit={verifyCode}>
          {message && <p className="border border-olive/20 bg-moss px-3 py-2 text-sm text-olive">{message}</p>}
          <label className="grid gap-2">
            <span className="font-mono text-xs text-graphite">6 位验证码</span>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="border border-ink/15 bg-paper px-3 py-3 font-mono text-lg tracking-[0.2em] outline-none transition focus:border-olive"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
            />
          </label>
          {error && <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              disabled={loading}
              className="border border-olive/30 bg-moss px-4 py-3 font-mono text-xs text-olive transition hover:border-ink/20 hover:bg-paper disabled:opacity-60"
            >
              {loading ? '正在验证' : '完成注册'}
            </button>
            <button
              type="button"
              onClick={() => setStep('profile')}
              className="border border-ink/10 bg-paper px-4 py-3 font-mono text-xs text-graphite transition hover:border-olive/30 hover:text-ink"
            >
              返回修改信息
            </button>
          </div>
        </form>
      )}

      {step === 'done' && (
        <p className="border border-olive/20 bg-moss px-3 py-2 text-sm text-olive">
          注册完成，正在进入游戏入口。
        </p>
      )}
    </div>
  )
}
