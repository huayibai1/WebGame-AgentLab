export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isStrongEnoughPassword(password: string) {
  return password.length >= 8
}

export function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}
