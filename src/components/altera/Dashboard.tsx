'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Calendar,
  MapPin,
  Search,
  ArrowRight,
  MoreHorizontal,
  UserPlus,
  Clock,
  X,
  FileText,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface Patient {
  id: number
  fio: string
  shortName: string
  initials: string
  age: number
  diagnosis: string
  room: string
  doctor: string
  progress: number
  daysLeft: number
  totalDays: number
  paymentStatus: 'paid' | 'partial' | 'debt'
  hasNewAnalyses: boolean
  needsCompletion?: boolean  // «К заполнению» flag
}

interface Appointment {
  id: string
  time: string
  patient: string
  procedure: string
  status: 'completed' | 'current' | 'upcoming'
  patientId: number
}

interface DashboardProps {
  onOpenPatient: (patient: {
    id: number
    name: string
    shortName: string
    initials: string
    room: string
    hasNewAnalyses: boolean
  }) => void
  onOpenRegistry: () => void
}

type FilterMode = 'mine' | 'all' | 'pending'

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const todayAppointments: Appointment[] = [
  { id: 'a1', time: '08:00\u201308:30', patient: 'Петрова Анна С.', procedure: 'Очередной приём', status: 'completed', patientId: 1 },
  { id: 'a2', time: '08:30\u201309:00', patient: 'Козлов Дмитрий А.', procedure: 'Очередной приём', status: 'current', patientId: 2 },
  { id: 'a3', time: '09:30\u201310:00', patient: 'Новиков Алексей В.', procedure: 'Очередной приём', status: 'upcoming', patientId: 4 },
  { id: 'a4', time: '10:30\u201311:00', patient: 'Соколов Павел Д.', procedure: 'Консультация', status: 'upcoming', patientId: 6 },
  { id: 'a5', time: '11:00\u201311:30', patient: 'Волкова Марина Н.', procedure: 'Очередной приём', status: 'upcoming', patientId: 3 },
  { id: 'a6', time: '14:00\u201314:30', patient: 'Кузнецова Ольга А.', procedure: 'Очередной приём', status: 'upcoming', patientId: 5 },
  { id: 'a7', time: '15:00\u201315:30', patient: 'Смирнова Елена В.', procedure: 'Очередной приём', status: 'upcoming', patientId: 7 },
]

const patients: Patient[] = [
  { id: 1, fio: 'Петрова Анна Сергеевна', shortName: 'Петрова А.С.', initials: 'ПА', age: 45, diagnosis: 'M54.5 — Боль в пояснице', room: '314', doctor: 'Иванов И.М.', progress: 86, daysLeft: 2, totalDays: 14, paymentStatus: 'paid' as const, hasNewAnalyses: true, needsCompletion: true },
  { id: 2, fio: 'Козлов Дмитрий Александрович', shortName: 'Козлов Д.А.', initials: 'КД', age: 58, diagnosis: 'I10 — Эссенциальная гипертензия', room: '215', doctor: 'Иванов И.М.', progress: 100, daysLeft: 0, totalDays: 10, paymentStatus: 'debt' as const, hasNewAnalyses: false, needsCompletion: true },
  { id: 3, fio: 'Волкова Марина Николаевна', shortName: 'Волкова М.Н.', initials: 'ВМ', age: 38, diagnosis: 'M79.3 — Панникулит', room: '307', doctor: 'Сидорова О.Н.', progress: 100, daysLeft: 0, totalDays: 7, paymentStatus: 'paid' as const, hasNewAnalyses: true, needsCompletion: true },
  { id: 4, fio: 'Новиков Алексей Викторович', shortName: 'Новиков А.В.', initials: 'НА', age: 62, diagnosis: 'I10 — Гипертензия', room: '223', doctor: 'Иванов И.М.', progress: 40, daysLeft: 8, totalDays: 14, paymentStatus: 'paid' as const, hasNewAnalyses: false },
  { id: 5, fio: 'Кузнецова Ольга Андреевна', shortName: 'Кузнецова О.А.', initials: 'КО', age: 52, diagnosis: 'K29.5 — Хронический гастрит', room: '409', doctor: 'Иванов И.М.', progress: 50, daysLeft: 7, totalDays: 14, paymentStatus: 'partial' as const, hasNewAnalyses: false },
  { id: 6, fio: 'Соколов Павел Дмитриевич', shortName: 'Соколов П.Д.', initials: 'СП', age: 63, diagnosis: 'M79.1 — Миалгия', room: '116', doctor: 'Иванов И.М.', progress: 30, daysLeft: 10, totalDays: 14, paymentStatus: 'paid' as const, hasNewAnalyses: true },
  { id: 7, fio: 'Смирнова Елена Владимировна', shortName: 'Смирнова Е.В.', initials: 'СЕ', age: 48, diagnosis: 'G43 — Мигрень', room: '412', doctor: 'Иванов И.М.', progress: 60, daysLeft: 5, totalDays: 10, paymentStatus: 'paid' as const, hasNewAnalyses: false },
  { id: 8, fio: 'Морозов Игорь Петрович', shortName: 'Морозов И.П.', initials: 'МИ', age: 55, diagnosis: 'M17 — Гонартроз', room: '118', doctor: 'Сидорова О.Н.', progress: 70, daysLeft: 4, totalDays: 14, paymentStatus: 'debt' as const, hasNewAnalyses: false },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function getRussianDate(): string {
  const now = new Date()
  const months = [
    'января', 'февраля', 'марта',
    'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября',
    'октября', 'ноября', 'декабря',
  ]
  const days = [
    'воскресенье', 'понедельник', 'вторник',
    'среда', 'четверг', 'пятница', 'суббота',
  ]
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${days[now.getDay()]}`
}

function daysLabel(days: number, total: number): string {
  if (days > 0) return `${days} из ${total} дн.`
  if (days === 0) return 'последний день'
  return `выписан`
}

function PaymentBadge({ status }: { status: Patient['paymentStatus'] }) {
  if (status === 'paid') return null
  const cfg = status === 'debt'
    ? { label: 'Задолженность', cls: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' }
    : { label: 'Частично', cls: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' }
  return <span className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${cfg.cls}`}>{cfg.label}</span>
}

function openPatient(p: Patient, cb: DashboardProps['onOpenPatient']) {
  cb({ id: p.id, name: p.fio, shortName: p.shortName, initials: p.initials, room: p.room, hasNewAnalyses: p.hasNewAnalyses })
}

/* ------------------------------------------------------------------ */
/*  Status dot                                                        */
/* ------------------------------------------------------------------ */

function StatusDot({ status }: { status: Appointment['status'] }) {
  const colors: Record<Appointment['status'], string> = {
    completed: 'bg-emerald-500',
    current: 'bg-amber-400 animate-pulse',
    upcoming: 'bg-sky-500',
  }
  return <span className={`inline-block h-2 w-2 rounded-full shrink-0 ${colors[status]}`} />
}

/* ------------------------------------------------------------------ */
/*  Context Menu                                                       */
/* ------------------------------------------------------------------ */

/* popup-меню для строки события */
function EventContextMenu({
  onClose,
  onOpenPatient,
}: {
  onClose: () => void
  onOpenPatient?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1 z-30 w-48 rounded-xl border border-gray-200 dark:border-[#373E47] bg-white dark:bg-[#21262D]/90 backdrop-blur-sm shadow-lg py-1"
    >
      {[
        { icon: <FileText className="w-3.5 h-3.5" />, label: 'Открыть карту пациента', action: onOpenPatient, accent: true },
        { icon: <Clock className="w-3.5 h-3.5" />, label: 'Перенести' },
        { icon: <X className="w-3.5 h-3.5" />, label: 'Отменить' },
        { icon: <UserPlus className="w-3.5 h-3.5" />, label: 'Назначить на другого' },
      ].map((item) => (
        <button
          key={item.label}
          onClick={(e) => { e.stopPropagation(); item.action?.(); onClose() }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors ${
            item.accent
              ? 'text-[#5ecece] hover:bg-[#5ecece]/5'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#30363D]'
          }`}
        >
          <span className={item.accent ? 'text-[#5ecece]' : 'text-gray-400 dark:text-gray-500'}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function Dashboard({ onOpenPatient, onOpenRegistry }: DashboardProps) {
  const [filterMode, setFilterMode] = useState<FilterMode>('mine')
  const [searchQuery, setSearchQuery] = useState('')
  const [contextMenuId, setContextMenuId] = useState<string | null>(null)

  /* ---------- derived ---------- */

  const completedCount = todayAppointments.filter((a) => a.status === 'completed').length
  const pendingCount = patients.filter(p => p.needsCompletion).length

  const filteredPatients = patients
    .filter((p) => {
      if (filterMode === 'mine') return p.doctor === 'Иванов И.М.'
      if (filterMode === 'pending') return p.needsCompletion
      return true
    })
    .filter(
      (p) =>
        !searchQuery ||
        p.fio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.room.includes(searchQuery),
    )
    .slice(0, 5)

  const toggleMenu = useCallback((id: string) => {
    setContextMenuId(prev => prev === id ? null : id)
  }, [])

  /* ================================================================ */
  /*  Widget — Мой день (с интегрированным «Следующим приёмом»)        */
  /* ================================================================ */

  const currentAppt = todayAppointments.find((a) => a.status === 'current')
  const currentPatient = currentAppt ? patients.find((p) => p.id === currentAppt.patientId) : null

  const widgetDay = (
    <div className="glass-card rounded-xl border border-gray-200 dark:border-[#373E47] p-5 flex flex-col gap-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#5ecece]" />
          <span className="text-sm font-bold font-serif text-gray-900 dark:text-gray-100">Мой день</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{getRussianDate()}</span>
      </div>

      {/* appointment list */}
      <ul className="flex flex-col gap-0.5 max-h-[420px] overflow-y-auto">
        {todayAppointments.map((appt) => {
          const patient = patients.find((p) => p.id === appt.patientId)
          const isCurrent = appt.status === 'current'
          const isMenuOpen = contextMenuId === appt.id

          return (
            <li
              key={appt.id}
              className={`relative rounded-xl transition-colors ${
                isCurrent
                  ? 'bg-[#5ecece]/8 border border-[#5ecece]/20 glow-accent'
                  : 'hover:bg-gray-50 dark:hover:bg-[#30363D]'
              } ${appt.status === 'completed' ? 'opacity-50' : ''}`}
            >
              {/* ── Active appointment (expanded row) ── */}
              {isCurrent && currentPatient ? (
                <div className="px-3 py-3">
                  {/* top: time + status */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusDot status={appt.status} />
                      <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{appt.time}</span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">Текущий</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleMenu(appt.id) }}
                      className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#373E47] transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* patient info */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{currentPatient.fio}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {currentPatient.diagnosis}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                          <MapPin className="h-3 w-3" />Палата {currentPatient.room}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {currentPatient.age} лет
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); openPatient(currentPatient, onOpenPatient) }}
                      className="shrink-0 rounded-xl bg-[#5ecece] btn-enamel px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4bb8b8]"
                    >
                      Начать приём
                    </button>
                  </div>

                  {/* context menu */}
                  {isMenuOpen && (
                    <EventContextMenu
                      onClose={() => setContextMenuId(null)}
                      onOpenPatient={() => openPatient(currentPatient!, onOpenPatient)}
                    />
                  )}
                </div>
              ) : (
                /* ── Regular appointment row ── */
                <div
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer"
                  onClick={(e) => {
                    if (contextMenuId === appt.id) {
                      setContextMenuId(null)
                      return
                    }
                    // open context menu on click (not patient card)
                    toggleMenu(appt.id)
                  }}
                >
                  <StatusDot status={appt.status} />

                  <span className="shrink-0 w-24 text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {appt.time}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className={`truncate text-sm ${
                      appt.status === 'completed'
                        ? 'text-gray-500 dark:text-gray-400 line-through'
                        : 'font-medium text-gray-900 dark:text-gray-100'
                    }`}>
                      {appt.patient}
                    </p>
                    <p className="truncate text-xs text-gray-400 dark:text-gray-500">{appt.procedure}</p>
                  </div>

                  {/* three-dot menu trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleMenu(appt.id)
                    }}
                    className="shrink-0 p-1 rounded-lg text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#373E47] transition-colors opacity-0 group-hover:opacity-100 hover:opacity-100"
                    style={{ opacity: contextMenuId === appt.id ? 1 : undefined }}
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>

                  {/* context menu */}
                  {isMenuOpen && (
                    <EventContextMenu
                      onClose={() => setContextMenuId(null)}
                      onOpenPatient={patient ? () => openPatient(patient, onOpenPatient) : undefined}
                    />
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {/* summary */}
      <p className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-[#373E47] pt-3">
        {todayAppointments.length} приёмов, {completedCount} завершено
      </p>
    </div>
  )

  /* ================================================================ */
  /*  Widget — Реестр пациентов (Мои / Все / К заполнению)              */
  /* ================================================================ */

  const filterButtons: { key: FilterMode; label: string; badge?: number }[] = [
    { key: 'mine', label: 'Мои' },
    { key: 'all', label: 'Все' },
    { key: 'pending', label: 'К заполнению', badge: pendingCount },
  ]

  const widgetRegistry = (
    <div className="glass-card rounded-xl border border-gray-200 dark:border-[#373E47] p-5 flex flex-col gap-4">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-gray-100">Пациенты</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {filterMode === 'pending'
              ? `С незаполненными формами`
              : filterMode === 'mine'
                ? 'Закреплённые за вами'
                : 'Все пациенты санатория'}
          </p>
        </div>
        <button
          onClick={onOpenRegistry}
          className="flex items-center gap-1 text-sm font-medium text-[#5ecece] hover:text-[#4bb8b8] transition-colors"
        >
          Все пациенты <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* toolbar: filter + search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* 3-state filter */}
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 dark:border-[#373E47] p-0.5">
          {filterButtons.map((fb) => (
            <button
              key={fb.key}
              onClick={() => setFilterMode(fb.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                filterMode === fb.key
                  ? 'bg-[#5ecece] btn-enamel text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {fb.label}
              {fb.badge !== undefined && fb.badge > 0 && (
                <span className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                  filterMode === fb.key
                    ? 'bg-white/20 text-white'
                    : 'bg-[#5ecece]/15 text-[#5ecece]'
                }`}>
                  {fb.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по ФИО или палате..."
            className="w-full rounded-xl border border-gray-200 dark:border-[#373E47] bg-gray-50 dark:bg-[#1C2128] py-1.5 pl-8 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#5ecece] focus:ring-1 focus:ring-[#5ecece] transition-colors"
          />
        </div>
      </div>

      {/* patient list (row view) */}
      <div className="flex flex-col gap-2">
        {filteredPatients.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
            Нет пациентов в этой категории
          </p>
        )}
        {filteredPatients.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-[#373E47] bg-gray-50/50 dark:bg-[#1C2128]/50 px-3 py-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-[#30363D] hover:shadow-sm group"
          >
            {/* avatar */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5ecece]/15 text-xs font-semibold text-[#5ecece]">
              {p.initials}
            </div>

            {/* info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {p.shortName}
                </span>
                {p.hasNewAnalyses && (
                  <span className="shrink-0 h-2 w-2 rounded-full bg-sky-500" title="Новые анализы" />
                )}
                <PaymentBadge status={p.paymentStatus} />
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {p.diagnosis} · пал. {p.room}
                </p>
              </div>
            </div>

            {/* progress mini */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <div className="w-16 h-1 rounded-full bg-gray-200 dark:bg-[#373E47] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#5ecece] transition-all"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 w-6 text-right">{p.progress}%</span>
            </div>

            {/* open button */}
            <button
              onClick={() => openPatient(p, onOpenPatient)}
              className="shrink-0 rounded-lg border border-[#5ecece] px-2.5 py-1 text-xs font-medium text-gray-900 dark:text-gray-100 transition-colors hover:bg-[#5ecece]/10 opacity-0 group-hover:opacity-100"
            >
              Открыть
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Мой день — 2 cols */}
      <div className="lg:col-span-2">
        {widgetDay}
      </div>

      {/* Реестр пациентов — 3 cols */}
      <div className="lg:col-span-3">
        {widgetRegistry}
      </div>
    </div>
  )
}
