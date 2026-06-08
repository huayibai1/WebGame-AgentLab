import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

export function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function hashVerificationCode(email: string, code: string, purpose: string) {
  return bcrypt.hash(`${email.toLowerCase()}:${purpose}:${code}`, SALT_ROUNDS)
}

export function verifyVerificationCode(email: string, code: string, purpose: string, hash: string) {
  return bcrypt.compare(`${email.toLowerCase()}:${purpose}:${code}`, hash)
}
