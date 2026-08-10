'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

/* ═══════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════ */

const PROGRESS_MESSAGES = [
  'Выполняется интеграция с CRM...',
  'Загрузка модуля расписания...',
  'Синхронизация справочников...',
  'Проверка лицензии...',
  'Инициализация интерфейса...',
]

const SPLASH_DURATION = 10000 // 10 seconds
const MESSAGE_INTERVAL = SPLASH_DURATION / PROGRESS_MESSAGES.length // 2s each

/* ═══════════════════════════════════════════════════
   SVG LOGO (inline, 64×64 viewBox, fill #0CAE9B)
   ═══════════════════════════════════════════════════ */

function BrandLogo({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 cursor-pointer"
    >
      {/* Circle background */}
      <circle cx="32" cy="32" r="30" fill="#0CAE9B" fillOpacity="0.12" stroke="#0CAE9B" strokeWidth="1.5" />
      {/* Globe / sphere curved lines */}
      <ellipse cx="32" cy="32" rx="16" ry="22" stroke="#0CAE9B" strokeWidth="1.5" fill="none" />
      <path d="M16 26 Q32 22 48 26" stroke="#0CAE9B" strokeWidth="1.2" fill="none" />
      <path d="M16 32 Q32 28 48 32" stroke="#0CAE9B" strokeWidth="1.5" fill="none" />
      <path d="M16 38 Q32 34 48 38" stroke="#0CAE9B" strokeWidth="1.2" fill="none" />
      <line x1="32" y1="10" x2="32" y2="54" stroke="#0CAE9B" strokeWidth="1.5" />
      {/* Cross / medical symbol overlay */}
      <rect x="28" y="14" width="8" height="3" rx="1.5" fill="#0CAE9B" opacity="0.7" />
      <rect x="28" y="47" width="8" height="3" rx="1.5" fill="#0CAE9B" opacity="0.7" />
      <rect x="12" y="30.5" width="8" height="3" rx="1.5" fill="#0CAE9B" opacity="0.7" />
      <rect x="44" y="30.5" width="8" height="3" rx="1.5" fill="#0CAE9B" opacity="0.7" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */

export default function LoginPage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'ready'>('loading')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef<number>(0)
  const inputRef = useRef<HTMLInputElement>(null)

  /* ─── Progress animation ─── */
  const startProgress = useCallback(() => {
    setProgress(0)
    setMessageIndex(0)
    setPhase('loading')
    startRef.current = Date.now()

    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      const raw = elapsed / SPLASH_DURATION
      const pct = Math.min(raw * 100, 100)
      setProgress(pct)

      const msgIdx = Math.min(
        Math.floor(elapsed / MESSAGE_INTERVAL),
        PROGRESS_MESSAGES.length - 1
      )
      setMessageIndex(msgIdx)

      if (pct >= 100) {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = null
        setPhase('ready')
      }
    }, 50)
  }, [])

  useEffect(() => {
    setLoaded(true)
    startProgress()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startProgress])

  /* ─── Focus email input after form appears ─── */
  useEffect(() => {
    if (phase === 'ready') {
      const t = setTimeout(() => inputRef.current?.focus(), 500)
      return () => clearTimeout(t)
    }
  }, [phase])

  /* ─── Restart on logo click ─── */
  const handleLogoClick = () => {
    startProgress()
  }

  /* ─── Form submit ─── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      router.push('/')
    }, 600)
  }

  /* ─── Force light theme on auth page ─── */
  useEffect(() => {
    const html = document.documentElement
    html.classList.remove('dark')
    return () => {
      // Restore dark theme when leaving auth page
      html.classList.add('dark')
    }
  }, [])

  /* ─── Guard: prevent flash of unstyled content ─── */
  if (!loaded) return null

  return (
    <div className="auth-wrapper">
      {/* ── Background layers (fixed, decorative) ── */}
      {/* Semi-transparent photo bg */}
      <div className="auth-bg-image" />
      {/* Biomorph blobs */}
      <div className="biomorph-layer">
        <div className="biomorph-blob blob-1" />
        <div className="biomorph-blob blob-2" />
        <div className="biomorph-blob blob-3" />
      </div>
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* ── Main auth card ── */}
      <div className="auth-card">
        {/* ═══════════ LEFT PANEL ═══════════ */}
        <div className="auth-left">
          {/* ── Brand block ── */}
          <div className="brand-block">
            <div onClick={handleLogoClick}>
              <BrandLogo size={64} />
            </div>
            <h1 className="brand-name">Альтера</h1>
            <p className="brand-subtitle">
              текст
              <br />
              медицинская
              <br />
              информационная
              <br />
              система
            </p>
          </div>

          {/* ── Form area (hidden during loading) ── */}
          <div className="middle-area">
            <form
              className={`login-form ${phase === 'ready' ? 'form-visible' : ''}`}
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label htmlFor="login-email">Имя пользователя</label>
                <input
                  ref={inputRef}
                  id="login-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e-mail"
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Пароль</label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="........"
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="btn-login" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="spinner" />
                    Вход...
                  </span>
                ) : (
                  'Войти'
                )}
              </button>
            </form>
          </div>

          {/* ── Footer ── */}
          <div className="auth-footer">
            <p className="footer-org">Санаторий &laquo;Буревестник&raquo;</p>
            <p className="footer-legal">
              &copy; 1985&ndash;2026 ДРПО ГлавНИВЦ. Товарный знак &laquo;Альтера&raquo; зарегистрирован.
              <br />
              <a href="#" onClick={(e) => e.preventDefault()}>Свидетельство о регистрации</a>
              {' · '}
              <a href="#" onClick={(e) => e.preventDefault()}>Информация о лицензии</a>
            </p>
          </div>

          {/* ── Progress bar (hidden after loading) ── */}
          <div className={`progress-line ${phase === 'ready' ? 'progress-hidden' : ''}`}>
            <div className="progress-row">
              <span className="progress-label">Загрузка:</span>
              <span className="progress-status">{PROGRESS_MESSAGES[messageIndex]}</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="progress-percent">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* ═══════════ RIGHT PANEL (photo) ═══════════ */}
        <div className="auth-right">
          <div className="auth-right-overlay" />
        </div>
      </div>
    </div>
  )
}
