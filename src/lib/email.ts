export type VerificationEmailInput = {
  to: string
  name: string
  code: string
  purpose: 'register'
  expiresInMinutes: number
}

export const devVerificationCodes = new Map<string, string>()

export async function sendVerificationEmail(input: VerificationEmailInput) {
  const mode = process.env.EMAIL_DELIVERY_MODE ?? 'console'

  if (mode !== 'console') {
    throw new Error(`Unsupported EMAIL_DELIVERY_MODE: ${mode}`)
  }

  if (process.env.NODE_ENV !== 'production') {
    devVerificationCodes.set(`${input.to.toLowerCase()}:${input.purpose}`, input.code)
  }

  console.info(
    [
      '',
      '===== GameVerse AI 本地验证码 =====',
      `邮箱: ${input.to}`,
      `姓名: ${input.name}`,
      `用途: ${input.purpose}`,
      `验证码: ${input.code}`,
      `有效期: ${input.expiresInMinutes} 分钟`,
      '=================================',
      ''
    ].join('\n')
  )
}
