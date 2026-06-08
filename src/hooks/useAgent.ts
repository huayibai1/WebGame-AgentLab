'use client'

import { useCallback, useState } from 'react'
import type { AgentMessage, GuideAgentContext, GuideAgentReply } from '@/agents/_types'
import { runGuideAgent } from '@/agents/guide/agent'

type UseAgentOptions = {
  agentId: 'guide'
  initialMessages: AgentMessage[]
  fallbackContext: GuideAgentContext
  apiUrl?: string
}

type AgentApiResponse = {
  reply: GuideAgentReply
}

async function postAgentMessage(apiUrl: string, agentId: string, message: string) {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      agentId,
      message,
      context: {
        currentPath: window.location.pathname
      }
    })
  })

  if (!response.ok) {
    throw new Error(`Agent API failed with ${response.status}`)
  }

  return (await response.json()) as AgentApiResponse
}

export function useAgent({ agentId, initialMessages, fallbackContext, apiUrl = '/api/agent' }: UseAgentOptions) {
  const [messages, setMessages] = useState<AgentMessage[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      const now = Date.now()
      setMessages((current) => [
        ...current,
        {
          id: now,
          from: 'user',
          text: trimmed
        }
      ])
      setIsLoading(true)
      setError(null)

      try {
        const data = await postAgentMessage(apiUrl, agentId, trimmed)
        setMessages((current) => [
          ...current,
          {
            id: now + 1,
            from: agentId,
            text: data.reply.text,
            actions: data.reply.actions
          }
        ])
      } catch (caught) {
        const fallback = runGuideAgent(trimmed, {
          ...fallbackContext,
          currentPath: typeof window === 'undefined' ? fallbackContext.currentPath : window.location.pathname
        })
        setError(caught instanceof Error ? caught.message : 'Agent API failed')
        setMessages((current) => [
          ...current,
          {
            id: now + 1,
            from: agentId,
            text: `${fallback.text}（当前使用本地备用回复。）`,
            actions: fallback.actions
          }
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [agentId, apiUrl, fallbackContext, isLoading]
  )

  return {
    messages,
    isLoading,
    error,
    sendMessage
  }
}

