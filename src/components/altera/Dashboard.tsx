'use client'

import { useState } from 'react'
import {
  Clock,
  Calendar,
  MapPin,
  FileText,
  Search,
  ArrowRight,
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
  { id: 1, fio: 'Петрова Анна Сергеевна', shortName: 'Петрова А.С.', initials: 'ПА', age: 45, diagnosis: 'M54.5 — Боль в пояснице', room: '314', doctor: 'Иванов И.М.', progress: 86, daysLeft: 2, totalDays: 14, paymentStatus: 'paid' as const, hasNewAnalyses: true },
  { id: 2, fio: 'Козлов Дмитрий Александрович', shortName: 'Козлов Д.А.', initials: 'КД', age: 58, diagnosis: 'I10 — Эссенциальная гипертензия', room: '215', doctor: 'Иванов И.М.', progress: 100, daysLeft: 0, totalDays: 10, paymentStatus: 'debt' as const, hasNewAnalyses: false },
  { id: 3, fio: 'Волкова Марина Николаевна', shortName: 'Волкова М.Н.', initials: 'ВМ', age: 38, diagnosis: 'M79.3 — Панникулит', room: '307', doctor: 'Сидорова О.Н.', progress: 100, daysLeft: 0, totalDays: 7, paymentStatus: 'paid' as const, hasNewAnalyses: true },
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
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function Dashboard({ onOpenPatient, onOpenRegistry }: DashboardProps) {
  const [filterMode, setFilterMode] = useState<'mine' | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  /* ---------- derived ---------- */

  const currentAppt = todayAppointments.find((a) => a.status === 'current')
  const nextPatient = currentAppt ? patients.find((p) => p.id === currentAppt.patientId) : null

  const completedCount = todayAppointments.filter((a) => a.status === 'completed').length

  const filteredPatients = patients
    .filter((p) => (filterMode === 'mine' ? p.doctor === 'Иванов И.М.' : true))
    .filter(
      (p) =>
        !searchQuery ||
        p.fio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.room.includes(searchQuery),
    )
    .slice(0, 5)

  /* ================================================================ */
  /*  Widget 1 — Следующий приём                                     */
  /* ================================================================ */

  const widgetNext = (
    <div className="rounded-xl border border-gray-200 dark:border-[#253041] bg-white dark:bg-[#151e2e] border-l-4 border-l-[#5ecece] p-5 flex flex-col gap-4 md:col-span-1">
      {/* header */}
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-[#5ecece]" />
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Следующий приём</span>
      </div>

      {nextPatient ? (
        <>
          {/* time */}
          <p className="font-serif text-2xl text-[#5ecece]">08:30</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Приём идёт</p>

          {/* patient info */}
          <div className="flex flex-col gap-1">
            <span className="text-base font-medium text-gray-900 dark:text-gray-100">{nextPatient.fio}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{nextPatient.age} лет · {nextPatient.diagnosis}</span>
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="h-3 w-3" />Палата {nextPatient.room}
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={() => openPatient(nextPatient, onOpenPatient)}
            className="mt-auto w-full rounded-lg bg-[#5ecece] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4bb8b8]"
          >
            Начать приём
          </button>
        </>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">Нет ближайших приёмов</p>
      )}
    </div>
  )

  /* ================================================================ */
  /*  Widget 2 — Мой день                                              */
  /* ================================================================ */

  const widgetDay = (
    <div className="rounded-xl border border-gray-200 dark:border-[#253041] bg-white dark:bg-[#151e2e] p-5 flex flex-col gap-4 md:col-span-2">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#5ecece]" />
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Мой день</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{getRussianDate()}</span>
      </div>

      {/* list */}
      <ul className="flex flex-col gap-1 max-h-80 overflow-y-auto">
        {todayAppointments.map((appt) => {
          const patient = patients.find((p) => p.id === appt.patientId)
          const isCurrent = appt.status === 'current'
          return (
            <li
              key={appt.id}
              onClick={() => patient && openPatient(patient, onOpenPatient)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors text-sm ${
                isCurrent
                  ? 'bg-[#5ecece]/10'
                  : 'hover:bg-gray-100 dark:hover:bg-[#1e293b]'
              } ${appt.status === 'completed' ? 'opacity-60' : ''}`}
            >
              <StatusDot status={appt.status} />

              <span className="shrink-0 w-28 text-xs text-gray-500 dark:text-gray-400 font-mono">
                {appt.time}
              </span>

              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-gray-900 dark:text-gray-100">{appt.patient}</p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{appt.procedure}</p>
              </div>
            </li>
          )
        })}
      </ul>

      {/* summary */}
      <p className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-[#253041] pt-3">
        {todayAppointments.length} приёмов сегодня, {completedCount} завершено
      </p>
    </div>
  )

  /* ================================================================ */
  /*  Widget 3 — К заполнению                                           */
  /* ================================================================ */

  const toCompleteItems = [
    { id: 't1', patient: 'Козлов Д.А.', label: 'Эпикриз', timeAgo: '2 дня назад' },
    { id: 't2', patient: 'Петрова А.С.', label: 'Заключение приёма', timeAgo: 'вчера' },
    { id: 't3', patient: 'Волкова М.Н.', label: 'Результаты анализов', timeAgo: 'вчера' },
  ]

  const widgetToComplete = (
    <div className="rounded-xl border border-gray-200 dark:border-[#253041] bg-white dark:bg-[#151e2e] p-5 flex flex-col gap-3 md:col-span-1">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#5ecece]" />
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">К заполнению</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5ecece]/15 text-[11px] font-semibold text-[#5ecece]">
            {toCompleteItems.length}
          </span>
        </div>
      </div>

      {/* list */}
      <ul className="flex flex-col gap-1">
        {toCompleteItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-[#1e293b]"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.patient}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.label}</p>
            </div>
            <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">{item.timeAgo}</span>
          </li>
        ))}
      </ul>

      {/* show all link */}
      <button
        className="flex items-center gap-1 text-sm font-medium text-[#5ecece] hover:text-[#4bb8b8] transition-colors mt-auto"
      >
        Показать все <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )

  /* ================================================================ */
  /*  Widget 4 — Реестр пациентов                                      */
  /* ================================================================ */

  const patientRow = (p: Patient) => (
    <div
      key={p.id}
      className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-[#253041] bg-white dark:bg-[#151e2e] p-4 transition-colors hover:shadow-sm"
    >
      {/* avatar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5ecece]/15 text-sm font-semibold text-[#5ecece]">
        {p.initials}
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
            {p.shortName}
          </span>
          {p.hasNewAnalyses && (
            <span className="shrink-0 h-2 w-2 rounded-full bg-sky-500" title="Новые анализы" />
          )}
          <PaymentBadge status={p.paymentStatus} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {p.diagnosis} · пал. {p.room} · {p.age} лет
        </p>

        {/* progress bar + days */}
        <div className="flex items-center gap-3 mt-1.5">
          <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-[#253041] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#5ecece] transition-all"
              style={{ width: `${p.progress}%` }}
            />
          </div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 shrink-0">
            {p.progress}% · {daysLabel(p.daysLeft, p.totalDays)}
          </span>
        </div>
      </div>

      {/* open button */}
      <button
        onClick={() => openPatient(p, onOpenPatient)}
        className="shrink-0 rounded-lg border border-gray-300 dark:border-[#253041] px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-[#1e293b]"
      >
        Открыть
      </button>
    </div>
  )

  const widgetRegistry = (
    <div className="rounded-xl border border-gray-200 dark:border-[#253041] bg-white dark:bg-[#151e2e] p-5 flex flex-col gap-4">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-gray-100">Реестр пациентов</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Все пациенты за вами</p>
        </div>
        <button
          onClick={onOpenRegistry}
          className="flex items-center gap-1 text-sm font-medium text-[#5ecece] hover:text-[#4bb8b8] transition-colors"
        >
          Все пациенты <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* filter */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 dark:border-[#253041] p-0.5">
            <button
              onClick={() => setFilterMode('mine')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                filterMode === 'mine'
                  ? 'bg-[#5ecece] text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Мои
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                filterMode === 'all'
                  ? 'bg-[#5ecece] text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Все
            </button>
          </div>
        </div>

        {/* search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по ФИО или номеру палаты..."
            className="w-full rounded-md border border-gray-200 dark:border-[#253041] bg-gray-50 dark:bg-[#0d1424] py-1.5 pl-8 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#5ecece] focus:ring-1 focus:ring-[#5ecece] transition-colors"
          />
        </div>
      </div>

      {/* patient list */}
      <div className="flex flex-col gap-3">{filteredPatients.map(patientRow)}</div>
    </div>
  )

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {widgetNext}
        {widgetDay}
        {widgetToComplete}
      </div>
      {widgetRegistry}
    </div>
  )
}
