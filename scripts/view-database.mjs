import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const databaseUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: databaseUrl })
})

function printSection(title) {
  console.log('')
  console.log(`=== ${title} ===`)
}

try {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      sessions: true,
      apiSettings: true,
      codes: {
        orderBy: { createdAt: 'desc' },
        take: 3
      }
    }
  })

  printSection('Database')
  console.log(`URL: ${databaseUrl}`)
  console.log(`Users: ${users.length}`)

  printSection('Users')
  if (users.length === 0) {
    console.log('No users found.')
  }

  for (const user of users) {
    console.log(`- ${user.name} <${user.email}>`)
    console.log(`  id: ${user.id}`)
    console.log(`  verified: ${user.emailVerified}`)
    console.log(`  created: ${user.createdAt.toISOString()}`)
    console.log(`  sessions: ${user.sessions.length}`)
    console.log(`  api settings: ${user.apiSettings.length}`)

    for (const setting of user.apiSettings) {
      console.log(
        `    ${setting.provider}: enabled=${setting.enabled}, model=${setting.model ?? '-'}, key=${setting.apiKeyHint ?? '-'}`
      )
    }

    for (const code of user.codes) {
      console.log(
        `    code ${code.purpose}: used=${Boolean(code.usedAt)}, expires=${code.expiresAt.toISOString()}`
      )
    }
  }
} finally {
  await prisma.$disconnect()
}
