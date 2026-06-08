import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { Navbar } from '@/components/layout/Navbar'
import { ApiSettingsForm } from '@/components/settings/ApiSettingsForm'
import { getCurrentUser } from '@/lib/auth'

export default async function ApiSettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Navbar />
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="absolute inset-0 paper-grid opacity-60" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_520px] lg:py-14">
          <div className="pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-xs uppercase text-olive">signed in</p>
              <LogoutButton />
            </div>
            <h2 className="mt-4 max-w-2xl font-display text-5xl font-black leading-none text-ink">
              {user.name} 的平台配置
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-graphite">
              API 设置是可选项。没有配置时，小玉继续使用本地规则回复；配置并启用后，后续会接入真实模型调用。
            </p>
            <a
              href="/games"
              className="mt-8 inline-flex border border-ink/10 bg-porcelain px-4 py-3 font-mono text-xs text-graphite transition hover:border-olive/30 hover:text-ink"
            >
              暂不接入 API，进入游戏入口
            </a>
          </div>
          <ApiSettingsForm />
        </div>
      </section>
    </main>
  )
}
