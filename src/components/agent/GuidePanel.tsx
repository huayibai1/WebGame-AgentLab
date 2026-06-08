'use client'

import { FormEvent, useMemo, useState } from 'react'
import type { AgentMessage } from '@/agents/_types'
import { buildGuideWelcome } from '@/agents/guide/agent'
import { guidePersona, guideQuickPrompts } from '@/agents/guide/persona'
import { currentEvent } from '@/data/home'
import { games } from '@/data/games'
import { useAgent } from '@/hooks/useAgent'

function createStarterMessages(): AgentMessage[] {
  return buildGuideWelcome().map((reply, index) => ({
    id: index + 1,
    from: 'guide',
    text: reply.text,
    actions: reply.actions
  }))
}

export function GuidePanel() {
  const [draft, setDraft] = useState('')
  const initialMessages = useMemo(() => createStarterMessages(), [])
  const fallbackContext = useMemo(() => ({ games, currentEvent }), [])
  const { messages, isLoading, error, sendMessage } = useAgent({
    agentId: 'guide',
    initialMessages,
    fallbackContext
  })

  function submitMessage(text: string) {
    void sendMessage(text)
    setDraft('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    submitMessage(draft)
  }

  return (
    <aside className="border border-ink/10 bg-porcelain p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 border border-ink/15 bg-paper">
          <div className="absolute inset-2 border border-olive/30" />
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-olive" />
        </div>
        <div>
          <p className="font-display text-xl font-black text-ink">{guidePersona.name}</p>
          <p className="font-mono text-xs uppercase text-graphite">{guidePersona.title}</p>
        </div>
      </div>

      <div className="mt-5 h-72 space-y-3 overflow-y-auto border-y border-ink/10 py-4 pr-1">
        {messages.map((message) => (
          <div key={message.id} className={message.from === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={
                message.from === 'user'
                  ? 'max-w-[85%] bg-ink px-3 py-2 font-mono text-xs leading-5 text-porcelain'
                  : 'max-w-[85%] bg-paper px-3 py-2 font-mono text-xs leading-5 text-graphite'
              }
            >
              <p>{message.text}</p>
              {message.actions && message.actions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.actions.map((action) => (
                    <a
                      key={`${message.id}-${action.href}-${action.label}`}
                      href={action.href}
                      className="border border-olive/20 bg-porcelain px-2 py-1 font-mono text-[10px] text-olive transition hover:border-ink/20 hover:text-ink"
                    >
                      {action.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <p className="max-w-[85%] bg-paper px-3 py-2 font-mono text-xs leading-5 text-graphite">小玉正在整理回复...</p>
          </div>
        )}
      </div>

      {error && <p className="mt-3 font-mono text-[10px] text-clay">API 暂不可用，已切换本地备用回复。</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {guideQuickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => submitMessage(prompt)}
            disabled={isLoading}
            className="border border-ink/10 bg-paper px-2 py-1 font-mono text-[11px] text-graphite transition hover:border-olive/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-45"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="问小玉..."
          disabled={isLoading}
          className="min-w-0 flex-1 border border-ink/10 bg-paper px-3 py-2 font-mono text-xs text-ink outline-none transition placeholder:text-graphite/70 focus:border-olive/40 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-olive px-3 py-2 font-mono text-xs text-porcelain transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          发送
        </button>
      </form>
    </aside>
  )
}

