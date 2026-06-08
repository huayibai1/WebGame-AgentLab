'use client'

import { FormEvent, useEffect, useState } from 'react'

type SavedSetting = {
  provider: string
  baseUrl: string | null
  model: string | null
  apiKeyHint: string | null
  enabled: boolean
}

export function ApiSettingsForm() {
  const [provider, setProvider] = useState('openai')
  const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1')
  const [model, setModel] = useState('gpt-4o-mini')
  const [apiKey, setApiKey] = useState('')
  const [enabled, setEnabled] = useState(false)
  const [saved, setSaved] = useState<SavedSetting | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/settings/api')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const setting = data?.settings?.[0] as SavedSetting | undefined
        if (!setting) return

        setSaved(setting)
        setProvider(setting.provider)
        setBaseUrl(setting.baseUrl ?? '')
        setModel(setting.model ?? '')
        setEnabled(setting.enabled)
      })
      .catch(() => undefined)
  }, [])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const response = await fetch('/api/settings/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, baseUrl, model, apiKey, enabled })
    })

    const data = await response.json()
    setLoading(false)

    if (!response.ok) {
      setError(data.error ?? '保存失败')
      return
    }

    setSaved(data.setting)
    setApiKey('')
    setMessage(enabled ? 'API 设置已保存。后续会让小玉优先读取这里的配置。' : '已保存为本地模式，不需要 API Key。')
  }

  return (
    <form className="grid gap-5 border border-ink/10 bg-porcelain p-6 shadow-line" onSubmit={save}>
      <div className="border-b border-ink/10 pb-4">
        <p className="font-mono text-xs uppercase text-olive">api access</p>
        <h1 className="mt-2 font-display text-3xl font-black text-ink">API 接入设置</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="font-mono text-xs text-graphite">服务类型</span>
          <select
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
            className="border border-ink/15 bg-paper px-3 py-3 text-sm outline-none transition focus:border-olive"
          >
            <option value="openai">OpenAI</option>
            <option value="compatible">兼容 OpenAI 的服务</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="font-mono text-xs text-graphite">模型</span>
          <input
            value={model}
            onChange={(event) => setModel(event.target.value)}
            className="border border-ink/15 bg-paper px-3 py-3 text-sm outline-none transition focus:border-olive"
            placeholder="gpt-4o-mini"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="font-mono text-xs text-graphite">Base URL</span>
        <input
          value={baseUrl}
          onChange={(event) => setBaseUrl(event.target.value)}
          className="border border-ink/15 bg-paper px-3 py-3 text-sm outline-none transition focus:border-olive"
          placeholder="https://api.openai.com/v1"
        />
      </label>

      <label className="grid gap-2">
        <span className="font-mono text-xs text-graphite">API Key</span>
        <input
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          className="border border-ink/15 bg-paper px-3 py-3 text-sm outline-none transition focus:border-olive"
          placeholder={saved?.apiKeyHint ? `已保存：${saved.apiKeyHint}` : 'sk-...'}
          type="password"
        />
        <span className="text-xs leading-5 text-graphite">
          可留空。只有打开“启用 API 调用”时才需要填写。
        </span>
      </label>

      <label className="flex items-center justify-between gap-4 border border-ink/10 bg-paper px-3 py-3">
        <span>
          <span className="block font-mono text-xs text-graphite">启用 API 调用</span>
          <span className="mt-1 block text-sm text-graphite">关闭时继续使用本地小玉逻辑。</span>
        </span>
        <input
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
          className="h-5 w-5 accent-[#53624b]"
          type="checkbox"
        />
      </label>

      {error && <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {message && <p className="border border-olive/20 bg-moss px-3 py-2 text-sm text-olive">{message}</p>}

      <button
        disabled={loading}
        className="border border-olive/30 bg-moss px-4 py-3 font-mono text-xs text-olive transition hover:border-ink/20 hover:bg-paper disabled:opacity-60"
      >
        {loading ? '正在保存' : '保存 API 设置'}
      </button>
      <a
        href="/games"
        className="text-center font-mono text-xs text-graphite transition hover:text-ink"
      >
        不保存 API，返回游戏入口
      </a>
    </form>
  )
}
