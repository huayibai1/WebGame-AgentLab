import { LoginForm } from '@/components/auth/LoginForm'
import { Navbar } from '@/components/layout/Navbar'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <Navbar />
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="absolute inset-0 paper-grid opacity-60" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-14">
          <div className="pt-4">
            <p className="font-mono text-xs uppercase text-olive">welcome back</p>
            <h2 className="mt-4 max-w-2xl font-display text-5xl font-black leading-none text-ink">
              登录后直接进入游戏入口。
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-graphite">
              API 接入是可选功能。没有配置 API 时，平台会继续使用本地小玉逻辑和已完成的小游戏功能。
            </p>
            <a href="/auth/register" className="mt-8 inline-flex font-mono text-xs text-olive transition hover:text-ink">
              没有账号，去注册
            </a>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  )
}
