'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTheme } from 'next-themes'

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
   BRAND LOGO — external SVG, theme-aware (light/dark variants)
   ═══════════════════════════════════════════════════ */

function BrandLogo({ height = 160, dark = false }: { height?: number; dark?: boolean }) {
  return (
    <img
      src={dark ? '/mis-altera/logo-vert-text-dark.svg' : '/mis-altera/logo-vert-text.svg'}
      alt="Альтера — медицинская информационная система"
      height={height}
      className="shrink-0 cursor-pointer object-contain"
      draggable={false}
    />
  )
}

/* ═══════════════════════════════════════════════════
   CREDENTIALS BLOCK (shared between phases)
   ═══════════════════════════════════════════════════ */

function CredentialsBlock() {
  return (
    <>
      <p className="footer-org">Санаторий &laquo;Буревестник&raquo;</p>
      <p className="footer-legal">
        &copy; 1985&ndash;2026 ДРПО ГлавНИВЦ. Товарный знак &laquo;Альтера&raquo; зарегистрирован.
        <br />
        <a href="#" onClick={(e) => e.preventDefault()}>Свидетельство о регистрации</a>
        {' · '}
        <a href="#" onClick={(e) => e.preventDefault()}>Информация о лицензии</a>
      </p>
    </>
  )
}

/* ═══════════════════════════════════════════════════
   PHASE 1: SPLASH / LOGIN SCREEN
   Theme-aware: respects the user's chosen theme instead
   of forcing light/dark.
   ═══════════════════════════════════════════════════ */

function AuthScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
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
      onAuthenticated()
    }, 600)
  }

  /* ─── Guard: prevent flash of unstyled content ─── */
  if (!loaded) return null

  return (
    <div className={`auth-wrapper ${isDark ? 'auth-wrapper--dark' : 'auth-wrapper--light'}`}>
      {/* ── Background layers (fixed, decorative) ── */}
      <div className="auth-bg-image" />
      <div className="auth-bg-image-dark" />
      <div className="biomorph-layer">
        <div className="biomorph-blob blob-1" />
        <div className="biomorph-blob blob-2" />
        <div className="biomorph-blob blob-3" />
      </div>
      <div className="noise-overlay" />

      {/* ── Main auth card ── */}
      <div className={`auth-card ${isDark ? 'auth-card--dark' : 'auth-card--light'}`}>
        {/* ═══════════ LEFT PANEL ═══════════ */}
        <div className="auth-left">

          {/* ── Brand block (always at top) ── */}
          <div className="brand-block">
            <div onClick={handleLogoClick}>
              <BrandLogo height={160} dark={isDark} />
            </div>
          </div>

          {/* ═══════ SPLASH PHASE ═══════ */}
          <div className={`splash-body ${phase === 'ready' ? 'splash-done' : ''}`}>
            <div className="splash-credentials">
              <CredentialsBlock />
            </div>

            {/* Progress bar */}
            <div className="progress-line">
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

          {/* ═══════ LOGIN PHASE ═══════ */}
          <div className={`login-body ${phase === 'ready' ? 'login-visible' : ''}`}>
            <div className="login-form-wrapper">
              <form className="login-form" onSubmit={handleSubmit}>
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

            <div className="login-footer">
              <CredentialsBlock />
            </div>
          </div>
        </div>

        {/* ═══════════ RIGHT PANEL (photo) ═══════════ */}
        <div className="auth-right" />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   DASHBOARD IMPORTS
   ═══════════════════════════════════════════════════ */

import { Search, X, User, Settings, LogOut, ChevronDown, Stethoscope, UserCog, Shield } from 'lucide-react'
import { Header } from '@/components/altera/Header'
import { PatientRegistry } from '@/components/altera/PatientRegistry'
import { PatientCard } from '@/components/altera/PatientCard'
import { DoctorScheduler } from '@/components/altera/DoctorScheduler'
import Dashboard from '@/components/altera/Dashboard'
import { UIKitPage } from '@/components/altera/UIKitPage'
import { MessengerPage } from '@/components/altera/MessengerPage'
import { StubPage } from '@/components/altera/StubPage'

/* ─── Types ─── */

type Role = 'doctor' | 'patient' | 'admin'

interface PatientInfo {
  id: number
  name: string
  shortName: string
  initials: string
  room: string
  hasNewAnalyses: boolean
}

interface SystemTab {
  id: string
  type: 'system'
  label: string
  icon: string
}

interface PatientTab {
  id: string
  type: 'patient'
  label: string
  room: string
  initials: string
  patientId: number
}

type Tab = SystemTab | PatientTab

/* ─── Data ─── */

export const PATIENTS: PatientInfo[] = [
  { id: 1, name: 'Петрова Анна Сергеевна', shortName: 'Петрова А.С.', initials: 'ПА', room: '314', hasNewAnalyses: true },
  { id: 2, name: 'Козлов Дмитрий Александрович', shortName: 'Козлов Д.А.', initials: 'КД', room: '215', hasNewAnalyses: false },
  { id: 3, name: 'Волкова Марина Николаевна', shortName: 'Волкова М.Н.', initials: 'ВМ', room: '307', hasNewAnalyses: true },
  { id: 4, name: 'Новиков Алексей Викторович', shortName: 'Новиков А.В.', initials: 'НА', room: '223', hasNewAnalyses: false },
  { id: 5, name: 'Кузнецова Ольга Андреевна', shortName: 'Кузнецова О.А.', initials: 'КО', room: '409', hasNewAnalyses: false },
  { id: 6, name: 'Соколов Павел Дмитриевич', shortName: 'Соколов П.Д.', initials: 'СП', room: '116', hasNewAnalyses: true },
  { id: 7, name: 'Смирнова Елена Владимировна', shortName: 'Смирнова Е.В.', initials: 'СЕ', room: '412', hasNewAnalyses: false },
  { id: 8, name: 'Морозов Игорь Петрович', shortName: 'Морозов И.П.', initials: 'МИ', room: '118', hasNewAnalyses: false },
]

const INITIAL_TABS: Tab[] = [
  { id: 'dashboard', type: 'system', label: 'Рабочий стол', icon: '🏠' },
  { id: 'registry', type: 'system', label: 'Реестр', icon: '📋' },
]

/* ═══════════════════════════════════════════════════
   PHASE 2: DOCTOR DASHBOARD
   ═══════════════════════════════════════════════════ */

function DoctorDashboard({ onLogout }: { onLogout: () => void }) {
  const [role, setRole] = useState<Role>('doctor')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tabs, setTabs] = useState<Tab[]>(INITIAL_TABS)
  const [activeTabId, setActiveTabId] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [patientBackTarget, setPatientBackTarget] = useState<string>('dashboard')
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  /* ─── Tab Management ─── */

  const openPatient = useCallback((patient: PatientInfo) => {
    const tabId = `patient-${patient.id}`
    setPatientBackTarget(prev => {
      if (activeTabId !== tabId) return activeTabId
      return prev
    })
    setTabs(prev => {
      if (!prev.find(t => t.id === tabId)) {
        return [...prev, {
          id: tabId, type: 'patient' as const,
          label: patient.shortName, room: patient.room,
          initials: patient.initials, patientId: patient.id,
        }]
      }
      return prev
    })
    setActiveTabId(tabId)
  }, [activeTabId])

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const idx = prev.findIndex(t => t.id === tabId)
      const filtered = prev.filter(t => t.id !== tabId)
      if (activeTabId === tabId) {
        const newIdx = Math.max(0, Math.min(idx, filtered.length - 1))
        setActiveTabId(filtered[newIdx]?.id || 'dashboard')
      }
      return filtered
    })
  }, [activeTabId])

  const openToolTab = useCallback((toolId: string, label: string) => {
    if (!tabs.find(t => t.id === toolId)) {
      setTabs(prev => [...prev, { id: toolId, type: 'system' as const, label, icon: label === 'UI-Kit' ? '🎨' : '💬' }])
    }
    setActiveTabId(toolId)
  }, [tabs])

  /* ─── Search ─── */

  const searchResults = searchQuery.length >= 2
    ? PATIENTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : []

  const handleSearchSelect = (patient: PatientInfo) => {
    openPatient(patient)
    setSearchQuery('')
    setSearchFocused(false)
  }

  /* ─── Active tab info ─── */

  const activeTab = tabs.find(t => t.id === activeTabId)
  const isPatientTab = activeTab?.type === 'patient'
  const tabLabel = activeTab?.label || ''

  const breadcrumbText = isPatientTab
    ? `МИС Альтера / ${tabLabel} / № ${(activeTab as PatientTab)?.room}`
    : `МИС Альтера / ${tabLabel}`

  /* ─── Close user menu on outside click ─── */
  useEffect(() => {
    if (!userMenuOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.user-menu-container')) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [userMenuOpen])

  /* ─── Render: Patient / Admin Stub ─── */

  if (role !== 'doctor') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#161B22]">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <StubPage role={role} onSwitchToDoctor={() => setRole('doctor')} />
      </div>
    )
  }

  /* ─── Render: Doctor Workspace ─── */

  const patientTabs = tabs.filter(t => t.type === 'patient')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#161B22] transition-colors duration-300">
      {/* ═══ HEADER ═══ */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* ═══ TAB BAR ═══ */}
      <div className="glass-card flex items-center border-b border-gray-200 dark:border-[#373E47] overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId
          const isClosable = tab.type === 'patient' || (tab.type === 'system' && tab.id !== 'dashboard' && tab.id !== 'registry')

          return (
            <div
              key={tab.id}
              className={`group flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap cursor-pointer border-b-2 transition-colors select-none shrink-0 ${
                isActive
                  ? 'border-[#5ecece] text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#161B22]'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#21262D]'
              }`}
              onClick={() => setActiveTabId(tab.id)}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.type === 'patient' && (
                <span className={`text-[10px] px-1 py-px rounded font-medium ${
                  isActive ? 'bg-gray-200 dark:bg-[#373E47] text-gray-600 dark:text-gray-400' : 'bg-gray-100 dark:bg-[#30363D] text-gray-400 dark:text-gray-500'
                }`}>
                  {(tab as PatientTab).room}
                </span>
              )}
              {isClosable && (
                <button
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}
                  className={`ml-1 p-0.5 rounded transition-colors ${
                    isActive
                      ? 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#373E47]'
                      : 'text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#373E47]'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* ═══ MAIN LAYOUT ═══ */}
      <div className="flex" style={{ height: 'calc(100vh - 56px - 42px)' }}>

        {/* ═══ SIDEBAR ═══ */}
        <aside className={`glass-card ${sidebarOpen ? 'w-60' : 'w-14'} border-r border-gray-200 dark:border-[#373E47] flex flex-col transition-all duration-300 overflow-hidden shrink-0`}>
          {/* Quick Search */}
          <div className="p-3 border-b border-gray-200 dark:border-[#373E47]">
            {sidebarOpen && (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  placeholder="Быстрый поиск..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-[#30363D] border border-gray-200 dark:border-[#373E47] rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#5ecece]/40 focus:border-[#5ecece] transition-colors"
                />
                {searchFocused && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#21262D] border border-gray-200 dark:border-[#373E47] rounded-xl shadow-lg z-50 overflow-hidden">
                    {searchResults.map((p) => (
                      <button
                        key={p.id}
                        onMouseDown={() => handleSearchSelect(p)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-[#30363D] transition-colors"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#5ecece]/15 border border-[#5ecece]/30 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-[#5ecece]">{p.initials}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{p.shortName}</div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400">№ {p.room}</div>
                        </div>
                        {p.hasNewAnalyses && (
                          <span className="ml-auto w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {!sidebarOpen && (
              <button className="w-full flex justify-center p-1.5 text-gray-400 hover:text-[#5ecece] transition-colors">
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sidebar Nav */}
          <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
            {sidebarOpen && (
              <div className="px-3 py-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Инструменты</span>
              </div>
            )}
            {[
              { id: 'scheduler', label: 'Шедулер', icon: '⏱️' },
              { id: 'uikit', label: 'UI-Kit', icon: '🎨' },
              { id: 'messenger', label: 'Мессенджер', icon: '💬' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => openToolTab(item.id, item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all group ${
                  activeTabId === item.id
                    ? 'bg-[#5ecece]/10 dark:bg-[#5ecece]/15 text-[#5ecece]'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#30363D] hover:text-gray-900 dark:hover:text-gray-200'
                } ${!sidebarOpen ? 'justify-center' : ''}`}
              >
                <span className="text-sm shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span className="text-sm font-medium truncate">{item.label}</span>
                    {item.id === 'messenger' && (
                      <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-[#373E47] text-gray-500 dark:text-gray-400 font-medium">MVP</span>
                    )}
                    {item.id === 'scheduler' && (
                      <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-[#373E47] text-gray-500 dark:text-gray-400 font-medium">PRO</span>
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>

          {/* ═══ USER MENU (bottom of sidebar) ═══ */}
          <div className="p-2 border-t border-gray-200 dark:border-[#373E47] user-menu-container relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#30363D] transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
            >
              <div className="w-7 h-7 rounded-full bg-[#5ecece]/15 border border-[#5ecece]/30 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-[#5ecece]">ИИ</span>
              </div>
              {sidebarOpen && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-xs font-medium truncate">Иванов И.А.</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">Терапевт</div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            {/* Dropdown */}
            {userMenuOpen && sidebarOpen && (
              <div className="absolute bottom-full left-2 right-2 mb-1 bg-white dark:bg-[#21262D] border border-gray-200 dark:border-[#373E47] rounded-xl shadow-lg overflow-hidden z-50">
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-[#30363D] transition-colors"
                >
                  <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Мой профиль</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-[#30363D] transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Настройки</span>
                </button>
                <div className="border-t border-gray-100 dark:border-[#373E47]" />
                {/* Role switcher */}
                <div className="px-3 pt-2 pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Роль</span>
                </div>
                {([
                  { role: 'doctor' as Role, label: 'Врач', icon: Stethoscope },
                  { role: 'patient' as Role, label: 'Пациент', icon: UserCog },
                  { role: 'admin' as Role, label: 'Администратор', icon: Shield },
                ]).map(({ role: r, label, icon: Icon }) => (
                  <button
                    key={r}
                    onClick={() => { setRole(r); setUserMenuOpen(false) }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                      role === r
                        ? 'bg-[#5ecece]/10 text-[#5ecece]'
                        : 'hover:bg-gray-50 dark:hover:bg-[#30363D]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${role === r ? 'text-[#5ecece]' : 'text-gray-500 dark:text-gray-400'}`} />
                    <span className={`text-xs font-medium ${role === r ? 'text-[#5ecece]' : 'text-gray-700 dark:text-gray-300'}`}>{label}</span>
                    {role === r && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#5ecece]" />
                    )}
                  </button>
                ))}
                <div className="border-t border-gray-100 dark:border-[#373E47]" />
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">Выход</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ═══ CONTENT AREA ═══ */}
        <main className="flex-1 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="sticky top-0 z-10 bg-gray-50/80 dark:bg-[#161B22]/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-[#373E47]/50 px-6 py-2">
            <div className="flex items-center gap-2 text-xs">
              {breadcrumbText.split(' / ').map((part, i, arr) => (
                <span key={i} className={i === arr.length - 1 ? 'text-[#5ecece] font-medium' : 'text-gray-400 dark:text-gray-500'}>
                  {part}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTabId === 'dashboard' && <Dashboard onOpenPatient={openPatient} onOpenRegistry={() => setActiveTabId('registry')} />}
            {activeTabId === 'scheduler' && <DoctorScheduler onOpenPatient={openPatient} />}
            {activeTabId === 'registry' && <PatientRegistry onOpenPatient={openPatient} />}
            {activeTabId === 'uikit' && <UIKitPage />}
            {activeTabId === 'messenger' && <MessengerPage />}

            {patientTabs.map((tab) => (
              <div key={tab.id} className={tab.id === activeTabId ? '' : 'hidden'}>
                <PatientCard onBack={() => setActiveTabId(patientBackTarget)} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   MAIN APP — ORCHESTRATOR
   Controls the unified flow:
     auth (splash → login) → dashboard
   Theme is synchronized: auth screen reads the
   user's theme preference and applies matching styles.
   ═══════════════════════════════════════════════════ */

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  const handleAuthenticated = useCallback(() => {
    setTransitioning(true)
    setTimeout(() => {
      setAuthenticated(true)
      setTransitioning(false)
    }, 400)
  }, [])

  const handleLogout = useCallback(() => {
    setTransitioning(true)
    setTimeout(() => {
      setAuthenticated(false)
      setTransitioning(false)
    }, 400)
  }, [])

  if (transitioning) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900 dark:bg-gray-100 flex items-center justify-center fade-out-splash">
        <span className="spinner-large" />
      </div>
    )
  }

  if (!authenticated) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />
  }

  return <DoctorDashboard onLogout={handleLogout} />
}
