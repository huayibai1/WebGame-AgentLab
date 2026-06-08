import { NextResponse } from 'next/server'
import { createVerificationCode, normalizeEmail } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import { hashPassword, hashVerificationCode } from '@/lib/password'
import { prisma } from '@/lib/prisma'
import { isStrongEnoughPassword, isValidEmail, readString } from '@/lib/validation'

const CODE_TTL_MINUTES = 10

type RegisterRequestBody = {
  email?: unknown
  name?: unknown
  password?: unknown
}

export async function POST(request: Request) {
  let body: RegisterRequestBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求格式不正确' }, { status: 400 })
  }

  const email = normalizeEmail(readString(body.email))
  const name = readString(body.name)
  const password = typeof body.password === 'string' ? body.password : ''

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: '请输入有效邮箱' }, { status: 400 })
  }

  if (name.length < 2 || name.length > 24) {
    return NextResponse.json({ error: '姓名需要 2 到 24 个字符' }, { status: 400 })
  }

  if (!isStrongEnoughPassword(password)) {
    return NextResponse.json({ error: '密码至少需要 8 位' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing?.emailVerified) {
    return NextResponse.json({ error: '该邮箱已经注册，请直接登录' }, { status: 409 })
  }

  const passwordHash = await hashPassword(password)
  const user =
    existing ??
    (await prisma.user.create({
      data: {
        email,
        name,
        passwordHash
      }
    }))

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        name,
        passwordHash
      }
    })
  }

  await prisma.emailVerificationCode.updateMany({
    where: {
      email,
      purpose: 'register',
      usedAt: null
    },
    data: {
      usedAt: new Date()
    }
  })

  const code = createVerificationCode()
  const codeHash = await hashVerificationCode(email, code, 'register')
  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000)

  await prisma.emailVerificationCode.create({
    data: {
      email,
      codeHash,
      purpose: 'register',
      expiresAt,
      userId: user.id
    }
  })

  await sendVerificationEmail({
    to: email,
    name,
    code,
    purpose: 'register',
    expiresInMinutes: CODE_TTL_MINUTES
  })

  return NextResponse.json({
    ok: true,
    message: '验证码已经生成，请在服务器控制台查看'
  })
}
