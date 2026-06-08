import { NextResponse } from 'next/server'
import { createSession, normalizeEmail } from '@/lib/auth'
import { verifyVerificationCode } from '@/lib/password'
import { prisma } from '@/lib/prisma'
import { isValidEmail, readString } from '@/lib/validation'

type VerifyRegisterBody = {
  email?: unknown
  code?: unknown
}

export async function POST(request: Request) {
  let body: VerifyRegisterBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求格式不正确' }, { status: 400 })
  }

  const email = normalizeEmail(readString(body.email))
  const code = readString(body.code)

  if (!isValidEmail(email) || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: '邮箱或验证码不正确' }, { status: 400 })
  }

  const verification = await prisma.emailVerificationCode.findFirst({
    where: {
      email,
      purpose: 'register',
      usedAt: null
    },
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  })

  if (!verification || !verification.user) {
    return NextResponse.json({ error: '验证码不存在或已失效' }, { status: 400 })
  }

  if (verification.expiresAt <= new Date()) {
    return NextResponse.json({ error: '验证码已过期，请重新获取' }, { status: 400 })
  }

  const valid = await verifyVerificationCode(email, code, 'register', verification.codeHash)

  if (!valid) {
    return NextResponse.json({ error: '验证码不正确' }, { status: 400 })
  }

  await prisma.$transaction([
    prisma.emailVerificationCode.update({
      where: { id: verification.id },
      data: { usedAt: new Date() }
    }),
    prisma.user.update({
      where: { id: verification.user.id },
      data: { emailVerified: true }
    })
  ])

  await createSession(verification.user.id)

  return NextResponse.json({
    ok: true,
    user: {
      id: verification.user.id,
      email: verification.user.email,
      name: verification.user.name
    }
  })
}
