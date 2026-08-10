'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

const SPLASH_MESSAGES = [
  'Интеграция с CRM...',
  'Загрузка модуля расписания...',
  'Синхронизация справочников...',
  'Инициализация интерфейса...',
]

const SPLASH_DURATION = 6000

export default function LoginPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'splash' | 'login'>('splash')
  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const raw = elapsed / SPLASH_DURATION
      const eased = 1 - Math.pow(1 - Math.min(raw, 1), 3)
      setProgress(eased * 100)
      setMessageIndex(Math.min(Math.floor(eased * SPLASH_MESSAGES.length), SPLASH_MESSAGES.length - 1))
      if (elapsed >= SPLASH_DURATION) {
        clearInterval(interval)
        setPhase('login')
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (phase === 'login') {
      setTimeout(() => inputRef.current?.focus(), 400)
    }
  }, [phase])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push('/')
    }, 600)
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#161B22] transition-colors duration-500">
      {/* Biomorph blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#5ecece] opacity-[0.12] dark:opacity-[0.06] blur-[100px]"
          style={{ animation: 'biomorph-float 20s ease-in-out infinite 0s' }}
        />
        <div
          className="absolute top-1/3 -right-24 w-[400px] h-[400px] rounded-full bg-[#5ecece] opacity-[0.10] dark:opacity-[0.05] blur-[120px]"
          style={{ animation: 'biomorph-float 25s ease-in-out infinite -5s' }}
        />
        <div
          className="absolute -bottom-20 left-1/3 w-[450px] h-[450px] rounded-full bg-[#5ecece] opacity-[0.08] dark:opacity-[0.04] blur-[110px]"
          style={{ animation: 'biomorph-float 22s ease-in-out infinite -10s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-[#5ecece] opacity-[0.06] dark:opacity-[0.03] blur-[80px]"
          style={{ animation: 'biomorph-float 18s ease-in-out infinite -15s' }}
        />
      </div>

      {/* Left Panel */}
      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        {/* Logo */}
        <div
          className={`flex flex-col items-center transition-all duration-700 ease-out ${
            phase === 'splash'
              ? 'flex-1 justify-center'
              : 'pt-10 pb-0 justify-start'
          }`}
        >
          <img
            src="/mis-altera/logo-vertical.svg"
            alt="МИС Альтера"
            className={`transition-all duration-700 ease-out ${
              phase === 'splash'
                ? 'w-48 h-48'
                : 'w-28 h-28'
            }`}
          />
          <h1
            className={`font-serif text-[#5ecece] mt-4 transition-all duration-700 ease-out ${
              phase === 'splash'
                ? 'text-3xl font-bold'
                : 'text-xl font-semibold'
            }`}
          >
            Альтера
          </h1>
          <p
            className={`text-gray-500 dark:text-gray-400 mt-1 transition-all duration-700 ease-out ${
              phase === 'splash' ? 'text-sm' : 'text-xs'
            }`}
          >
            Медицинская информационная система
          </p>
        </div>

        {/* Splash progress bar */}
        <div
          className={`px-10 transition-all duration-700 ease-out ${
            phase === 'splash' ? 'mb-40' : 'mb-0 h-0 overflow-hidden opacity-0'
          }`}
        >
          <div className="w-full max-w-xs mx-auto">
            <div className="h-1 bg-gray-200 dark:bg-[#30363D] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5ecece] rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center animate-pulse">
              {SPLASH_MESSAGES[messageIndex]}
            </p>
          </div>
        </div>

        {/* Login form */}
        <div
          className={`flex-1 flex flex-col justify-center px-10 transition-all duration-700 ease-out ${
            phase === 'splash'
              ? 'opacity-0 translate-y-8'
              : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="glass-card rounded-2xl border border-gray-200 dark:border-[#373E47] p-8 max-w-sm mx-auto w-full">
            <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Вход в систему
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Введите данные для авторизации
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5"
                >
                  Имя пользователя или электронная почта
                </label>
                <input
                  ref={inputRef}
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-[#373E47] bg-gray-50 dark:bg-[#1C2128] px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#5ecece]/30 focus:border-[#5ecece] transition-colors"
                  placeholder="doctor@sanatory.ru"
                  autoComplete="username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5"
                >
                  Пароль
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-[#373E47] bg-gray-50 dark:bg-[#1C2128] px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#5ecece]/30 focus:border-[#5ecece] transition-colors"
                    placeholder="........"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-xl bg-[#5ecece] btn-enamel px-4 py-2.5 text-sm font-medium text-white hover:bg-[#4bb8b8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Вход...
                  </>
                ) : (
                  'Войти'
                )}
              </button>
            </form>

            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
              Забыли пароль?{' '}
              <button type="button" className="text-[#5ecece] hover:text-[#4bb8b8] transition-colors">
                Восстановить
              </button>
            </p>
          </div>

          {/* Footer */}
          <div
            className={`text-center pb-6 mt-6 transition-all duration-700 ease-out delay-300 ${
              phase === 'splash' ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Санаторий «Буревестник»
            </p>
            <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-1">
              {'© '}{new Date().getFullYear()} МИС Альтера. Все права защищены.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - illustration */}
      <div
        className="relative z-10 hidden lg:flex lg:w-[45%] items-center justify-center p-10 transition-all duration-700"
      >
        <div className="relative w-full h-full max-w-lg">
          <div className="glass-card rounded-2xl border border-gray-200 dark:border-[#373E47] overflow-hidden h-full flex flex-col">
            <img
              src="/mis-altera/splash-illustration.png"
              alt=""
              className="flex-1 object-cover w-full h-full"
            />
            <div className="p-6 bg-white/60 dark:bg-[#21262D]/60 backdrop-blur-md">
              <p className="font-serif text-lg font-semibold text-gray-900 dark:text-gray-100">
                Единая платформа
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Управление пациентами, расписанием и документацией в одном интерфейсе
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
