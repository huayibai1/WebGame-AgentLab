import crypto from 'crypto'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export const SESSION_COOKIE_NAME = 'gameverse_session'
const SESSION_DAYS = 14

function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function createVerificationCode() {
  return crypto.randomInt(100000, 1000000).toString()
}

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)

  await prisma.session.create({
    data: {
      tokenHash: sha256(token),
      userId,
      expiresAt
    }
  })

  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt
  })
}

export async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { tokenHash: sha256(token) },
    include: { user: true }
  })

  if (!session || session.expiresAt <= new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => undefined)
    }
    return null
  }

  return session.user
}

export async function requireCurrentUser() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function destroyCurrentSession() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: sha256(token) } })
  }

  cookies().delete(SESSION_COOKIE_NAME)
}
