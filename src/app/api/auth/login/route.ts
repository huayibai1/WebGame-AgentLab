import { NextResponse } from 'next/server'
import { createSession, normalizeEmail } from '@/lib/auth'
import { verifyPassword } from '@/lib/password'
import { prisma } from '@/lib/prisma'
import { isValidEmail, readString } from '@/lib/validation'

type LoginBody = {
  email?: unknown
  password?: unknown
}

export async function POST(request: Request) {
  let body: LoginBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求格式不正确' }, { status: 400 })
  }

  const email = normalizeEmail(readString(body.email))
  const password = typeof body.password === 'string' ? body.password : ''

  if (!isValidEmail(email) || !password) {
    return NextResponse.json({ error: '邮箱或密码不正确' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: '邮箱或密码不正确' }, { status: 401 })
  }

  if (!user.emailVerified) {
    return NextResponse.json({ error: '邮箱尚未验证，请先完成注册验证码验证' }, { status: 403 })
  }

  await createSession(user.id)

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  })
}
