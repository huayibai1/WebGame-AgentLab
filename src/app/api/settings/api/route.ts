import { NextResponse } from 'next/server'
import { requireCurrentUser } from '@/lib/auth'
import { encryptSecret, maskSecret } from '@/lib/crypto'
import { prisma } from '@/lib/prisma'
import { readString } from '@/lib/validation'

const PROVIDERS = new Set(['openai', 'compatible'])

type ApiSettingsBody = {
  provider?: unknown
  baseUrl?: unknown
  model?: unknown
  apiKey?: unknown
  enabled?: unknown
}

export async function GET() {
  try {
    const user = await requireCurrentUser()
    const settings = await prisma.userApiSetting.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({
      settings: settings.map((setting) => ({
        provider: setting.provider,
        baseUrl: setting.baseUrl,
        model: setting.model,
        apiKeyHint: setting.apiKeyHint,
        enabled: setting.enabled,
        updatedAt: setting.updatedAt
      }))
    })
  } catch {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }
}

export async function POST(request: Request) {
  let body: ApiSettingsBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求格式不正确' }, { status: 400 })
  }

  let user

  try {
    user = await requireCurrentUser()
  } catch {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  const provider = readString(body.provider) || 'openai'
  const baseUrl = readString(body.baseUrl)
  const model = readString(body.model)
  const apiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : ''
  const enabled = Boolean(body.enabled)

  if (!PROVIDERS.has(provider)) {
    return NextResponse.json({ error: '暂不支持该 API 类型' }, { status: 400 })
  }

  if (enabled && !apiKey) {
    const existing = await prisma.userApiSetting.findUnique({
      where: {
        userId_provider: {
          userId: user.id,
          provider
        }
      }
    })

    if (!existing?.encryptedApiKey) {
      return NextResponse.json({ error: '启用 API 调用前需要填写 API Key' }, { status: 400 })
    }
  }

  const encryptedApiKey = apiKey ? encryptSecret(apiKey) : undefined
  const apiKeyHint = apiKey ? maskSecret(apiKey) : undefined

  const setting = await prisma.userApiSetting.upsert({
    where: {
      userId_provider: {
        userId: user.id,
        provider
      }
    },
    create: {
      userId: user.id,
      provider,
      baseUrl: baseUrl || null,
      model: model || null,
      encryptedApiKey: encryptedApiKey ?? null,
      apiKeyHint: apiKeyHint ?? null,
      enabled
    },
    update: {
      baseUrl: baseUrl || null,
      model: model || null,
      ...(encryptedApiKey ? { encryptedApiKey, apiKeyHint } : {}),
      enabled
    }
  })

  return NextResponse.json({
    ok: true,
    setting: {
      provider: setting.provider,
      baseUrl: setting.baseUrl,
      model: setting.model,
      apiKeyHint: setting.apiKeyHint,
      enabled: setting.enabled
    }
  })
}
