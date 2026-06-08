import { Navbar } from '@/components/layout/Navbar'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <Navbar />
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="absolute inset-0 paper-grid opacity-60" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-14">
          <div className="pt-4">
            <p className="font-mono text-xs uppercase text-olive">local verification</p>
            <h2 className="mt-4 max-w-2xl font-display text-5xl font-black leading-none text-ink">
              先创建账号，再进入游戏入口。
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-graphite">
              当前验证码会输出到本地服务器控制台。API 接入不是注册条件，之后需要时再到设置页配置。
            </p>
            <a href="/auth/login" className="mt-8 inline-flex font-mono text-xs text-olive transition hover:text-ink">
              已有账号，去登录
            </a>
          </div>
          <RegisterForm />
        </div>
      </section>
    </main>
  )
}
