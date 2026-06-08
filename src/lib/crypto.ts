import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'

function getEncryptionKey() {
  const configuredKey = process.env.APP_ENCRYPTION_KEY

  if (configuredKey) {
    const decoded = Buffer.from(configuredKey, 'base64')
    if (decoded.length === 32) return decoded

    if (configuredKey.length >= 32) {
      return crypto.createHash('sha256').update(configuredKey).digest()
    }
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('APP_ENCRYPTION_KEY is required in production')
  }

  return crypto.createHash('sha256').update('gameverse-ai-local-development-key').digest()
}

export function encryptSecret(value: string) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()

  return [iv, tag, encrypted].map((part) => part.toString('base64')).join('.')
}

export function decryptSecret(payload: string) {
  const [ivBase64, tagBase64, encryptedBase64] = payload.split('.')
  if (!ivBase64 || !tagBase64 || !encryptedBase64) {
    throw new Error('Invalid encrypted secret payload')
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), Buffer.from(ivBase64, 'base64'))
  decipher.setAuthTag(Buffer.from(tagBase64, 'base64'))

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, 'base64')),
    decipher.final()
  ]).toString('utf8')
}

export function maskSecret(value: string) {
  if (value.length <= 8) return '****'
  return `${value.slice(0, 3)}...${value.slice(-4)}`
}
