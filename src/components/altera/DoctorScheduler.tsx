'use client'

import { useState, useEffect } from 'react'
import {
  Clock,
  Play,
  Pause,
  Square,
  GripVertical,
  AlertTriangle,
  ChevronRight,
  Check,
  Circle,
  MapPin,
  User,
  Calendar,
  Bell,
  Plus,
  X,
  Stethoscope,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types & data                                                       */
/* ------------------------------------------------------------------ */

type AppointmentStatus =
  | 'completed'
  | 'current'
  | 'upcoming'
  | 'emergency'
  | 'free'
  | 'lunch'

interface AppointmentBlock {
  id: string
  /** minutes from 08:00 */
  startMin: number
  /** duration in minutes */
  duration: number
  patient: string
  procedure: string
  status: AppointmentStatus
  isDragging?: boolean
  isDropTarget?: boolean
  timeLabel: string
}

const HOUR_START = 8 // 08:00
const ROW_HEIGHT = 60 // px per hour
const TIMELINE_HOURS = 10 // 08:00 … 17:00 (10 labels)

const minutesToTop = (min: number) => (min / 60) * ROW_HEIGHT

const appointments: AppointmentBlock[] = [
  {
    id: 'a1',
    startMin: 0,
    duration: 30,
    patient: 'Петрова Анна С.',
    procedure: 'Очередной приём',
    status: 'completed',
    timeLabel: '08:00–08:30',
  },
  {
    id: 'a2',
    startMin: 30,
    duration: 30,
    patient: 'Козлов Дмитрий А.',
    procedure: 'Очередной приём',
    status: 'current',
    timeLabel: '08:30–09:00',
  },
  {
    id: 'a3',
    startMin: 60,
    duration: 30,
    patient: 'Волкова Марина Н.',
    procedure: 'Физиотерапия',
    status: 'upcoming',
    timeLabel: '09:00–09:30',
  },
  {
    id: 'free-0930',
    startMin: 90,
    duration: 30,
    patient: '— СВОБОДНО —',
    procedure: '',
    status: 'free',
    isDropTarget: true,
    timeLabel: '09:30–10:00',
  },
  {
    id: 'a5',
    startMin: 120,
    duration: 30,
    patient: 'Новиков Алексей В.',
    procedure: 'Консультация',
    status: 'upcoming',
    isDragging: true,
    timeLabel: '10:00–10:30',
  },
  {
    id: 'free-1030',
    startMin: 150,
    duration: 30,
    patient: '— СВОБОДНО —',
    procedure: '',
    status: 'free',
    timeLabel: '10:30–11:00',
  },
  {
    id: 'a7',
    startMin: 180,
    duration: 30,
    patient: 'Кузнецова Ольга А.',
    procedure: 'Повторный осмотр',
    status: 'upcoming',
    timeLabel: '11:00–11:30',
  },
  {
    id: 'lunch',
    startMin: 240,
    duration: 60,
    patient: '— ОБЕД —',
    procedure: 'Перерыв',
    status: 'lunch',
    timeLabel: '12:00–13:00',
  },
  {
    id: 'a9',
    startMin: 300,
    duration: 30,
    patient: 'Соколов Павел Д.',
    procedure: 'Процедура',
    status: 'upcoming',
    timeLabel: '13:00–13:30',
  },
  {
    id: 'a10',
    startMin: 360,
    duration: 30,
    patient: 'Морозов Игорь П.',
    procedure: 'Заключительный осмотр',
    status: 'upcoming',
    timeLabel: '14:00–14:30',
  },
  {
    id: 'free-1500',
    startMin: 420,
    duration: 30,
    patient: '— СВОБОДНО —',
    procedure: '',
    status: 'free',
    timeLabel: '15:00–15:30',
  },
  {
    id: 'a12',
    startMin: 480,
    duration: 30,
    patient: 'Смирнова Елена В.',
    procedure: 'Консультация',
    status: 'upcoming',
    timeLabel: '16:00–16:30',
  },
]

interface WardRoom {
  room: number
  patient: string
  diagnosis: string
  status: 'visited' | 'current' | 'waiting'
}

const wardRooms: WardRoom[] = [
  { room: 118, patient: 'Морозов Игорь П.', diagnosis: 'I25.1', status: 'visited' },
  { room: 215, patient: 'Козлов Дмитрий А.', diagnosis: 'I10', status: 'visited' },
  { room: 223, patient: 'Новиков Алексей В.', diagnosis: 'M17', status: 'visited' },
  { room: 307, patient: 'Волкова Марина Н.', diagnosis: 'M45', status: 'current' },
  { room: 314, patient: 'Петрова Анна С.', diagnosis: 'M54.5', status: 'waiting' },
  { room: 409, patient: 'Кузнецова Ольга А.', diagnosis: 'E78.5', status: 'waiting' },
  { room: 412, patient: 'Смирнова Елена В.', diagnosis: 'M79.3', status: 'waiting' },
]

/* ------------------------------------------------------------------ */
/*  Patient data for card opening                                      */
/* ------------------------------------------------------------------ */

const appointmentPatients: Record<string, { id: number; name: string; shortName: string; initials: string; room: string }> = {
  'petrova': { id: 1, name: 'Петрова Анна Сергеевна', shortName: 'Петрова А.С.', initials: 'ПА', room: '314' },
  'kozlov': { id: 2, name: 'Козлов Дмитрий Александрович', shortName: 'Козлов Д.А.', initials: 'КД', room: '215' },
  'volkova': { id: 3, name: 'Волкова Марина Николаевна', shortName: 'Волкова М.Н.', initials: 'ВМ', room: '307' },
  'novikov': { id: 4, name: 'Новиков Алексей Викторович', shortName: 'Новиков А.В.', initials: 'НА', room: '223' },
  'kuznetsova': { id: 5, name: 'Кузнецова Ольга Андреевна', shortName: 'Кузнецова О.А.', initials: 'КО', room: '409' },
  'sokolov': { id: 6, name: 'Соколов Павел Дмитриевич', shortName: 'Соколов П.Д.', initials: 'СП', room: '116' },
  'morozov': { id: 7, name: 'Морозов Игорь Петрович', shortName: 'Морозов И.П.', initials: 'МИ', room: '118' },
  'smirnova': { id: 8, name: 'Смирнова Елена Владимировна', shortName: 'Смирнова Е.В.', initials: 'СЕ', room: '412' },
}

/** Map appointment block IDs → patient key in appointmentPatients */
const appointmentToPatient: Record<string, string> = {
  'a1': 'petrova',
  'a2': 'kozlov',
  'a3': 'volkova',
  'a5': 'novikov',
  'a7': 'kuznetsova',
  'a9': 'sokolov',
  'a10': 'morozov',
  'a12': 'smirnova',
}

/* ------------------------------------------------------------------ */
/*  Props & Component                                                  */
/* ------------------------------------------------------------------ */

interface DoctorSchedulerProps {
  onOpenPatient: (patient: { id: number; name: string; shortName: string; initials: string; room: string; hasNewAnalyses: boolean }) => void
}

export function DoctorScheduler({ onOpenPatient }: DoctorSchedulerProps) {
  const [mode, setMode] = useState<'office' | 'ward'>('office')
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [emergencySlot, setEmergencySlot] = useState('')
  const [timerSeconds, setTimerSeconds] = useState(754) // 12:34
  const [dragConfirmVisible, setDragConfirmVisible] = useState(true)
  const [notifyPatient, setNotifyPatient] = useState(true)
  const [visitedWards, setVisitedWards] = useState([118, 215, 223])
  const [currentWard, setCurrentWard] = useState(307)

  /* Emergency modal form */
  const [emergencyFio, setEmergencyFio] = useState('')
  const [emergencyReason, setEmergencyReason] = useState('')

  /* Timer — count up every second */
  useEffect(() => {
    const id = window.setInterval(() => {
      setTimerSeconds((s) => s + 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const mm = String(Math.floor(timerSeconds / 60)).padStart(2, '0')
  const ss = String(timerSeconds % 60).padStart(2, '0')

  const openEmergency = (slot: string) => {
    setEmergencySlot(slot)
    setShowEmergencyModal(true)
  }

  const stats = {
    total: 8,
    done: 3,
    left: 5,
  }

  /* status → classes helper for appointment blocks */
  const blockClasses = (b: AppointmentBlock): string => {
    if (b.status === 'current') {
      return 'bg-[#5ecece]/15 dark:bg-[#5ecece]/20 border-l-[3px] border-[#5ecece] shadow-[0_0_0_1px_rgba(201,169,110,0.25),0_4px_14px_-2px_rgba(201,169,110,0.45)]'
    }
    if (b.status === 'completed') {
      return 'bg-emerald-500/20 dark:bg-emerald-900/20 border-l-2 border-emerald-500'
    }
    if (b.status === 'upcoming') {
      return 'bg-blue-500/15 dark:bg-blue-900/15 border-l-2 border-blue-500'
    }
    if (b.status === 'emergency') {
      return 'bg-red-500/15 dark:bg-red-900/15 border-l-2 border-red-500'
    }
    return ''
  }

  /* -------------------------------------------------------------- */
  /*  Office mode                                                   */
  /* -------------------------------------------------------------- */
  const renderOffice = () => (
    <div className="relative">
      {/* Timeline card */}
      <div className="bg-white dark:bg-[#21262D] rounded-xl border border-gray-200 dark:border-[#373E47] overflow-hidden">
        <div className="flex">
          {/* Time labels column */}
          <div className="w-16 shrink-0 border-r border-gray-200 dark:border-[#373E47] bg-gray-50 dark:bg-[#30363D]">
            {Array.from({ length: TIMELINE_HOURS }, (_, i) => {
              const h = HOUR_START + i
              return (
                <div
                  key={h}
                  className="h-[60px] px-2 pt-1 text-right text-[11px] font-mono font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-[#373E47]/60"
                >
                  {String(h).padStart(2, '0')}:00
                </div>
              )
            })}
          </div>

          {/* Timeline content */}
          <div
            className="relative flex-1"
            style={{ height: TIMELINE_HOURS * ROW_HEIGHT }}
          >
            {/* hour grid lines */}
            {Array.from({ length: TIMELINE_HOURS }, (_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-gray-100 dark:border-[#373E47]/60"
                style={{ top: i * ROW_HEIGHT }}
              />
            ))}

            {/* Lunch block (background, non-clickable, diagonal pattern) */}
            <div
              className="absolute left-2 right-2 rounded-md overflow-hidden border border-gray-200 dark:border-[#373E47] bg-gray-100 dark:bg-[#30363D]"
              style={{
                top: minutesToTop(240) + 2,
                height: 60 - 4,
                backgroundImage:
                  'repeating-linear-gradient(45deg, rgba(156,163,175,0.25) 0, rgba(156,163,175,0.25) 6px, transparent 6px, transparent 12px)',
              }}
            >
              <div className="w-full h-full flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
                <span className="text-xs font-semibold tracking-wider uppercase">
                  Обеденный перерыв
                </span>
              </div>
            </div>

            {/* Appointment + free-slot blocks */}
            {appointments.map((b) => {
              const top = minutesToTop(b.startMin) + 2
              const height = (b.duration / 60) * ROW_HEIGHT - 4

              /* Free slot (clickable) */
              if (b.status === 'free') {
                const isDrop = b.isDropTarget
                return (
                  <button
                    key={b.id}
                    onClick={() => openEmergency(b.timeLabel)}
                    style={{ top, height }}
                    className={`absolute left-2 right-2 rounded-md flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer group ${
                      isDrop
                        ? 'border-2 border-dashed border-[#5ecece] bg-[#5ecece]/5 animate-pulse'
                        : 'border-2 border-dashed border-transparent group-hover:border-[#5ecece]/50 group-hover:bg-[#5ecece]/5'
                    }`}
                  >
                    {isDrop ? (
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5ecece]">
                        <Plus className="w-3 h-3" />
                        Слот для переноса
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[11px] text-gray-300 dark:text-gray-600 group-hover:text-[#5ecece] transition-colors">
                        <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {b.patient}
                      </span>
                    )}
                  </button>
                )
              }

              /* Lunch — already rendered above, skip */
              if (b.status === 'lunch') return null

              /* Regular appointment block */
              const dragging = b.isDragging
              const patientKey = appointmentToPatient[b.id]
              const handleOpenPatient = () => {
                if (!patientKey) return
                const p = appointmentPatients[patientKey]
                if (p) onOpenPatient({ ...p, hasNewAnalyses: false })
              }
              return (
                <div
                  key={b.id}
                  style={{ top, height }}
                  onClick={handleOpenPatient}
                  className={`absolute left-2 right-2 rounded-md border border-gray-200 dark:border-[#373E47] px-2.5 py-1.5 cursor-pointer transition-all duration-200 ${blockClasses(
                    b,
                  )} ${
                    dragging
                      ? 'opacity-80 shadow-xl rotate-1 ring-2 ring-[#5ecece] z-20'
                      : 'hover:shadow-md hover:ring-2 hover:ring-[#5ecece]/30 hover:brightness-110'
                  }`}
                >
                  <div className="flex items-center gap-2 h-full">
                    <GripVertical className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />

                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      {/* current → pulsing dot */}
                      {b.status === 'current' && (
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                      )}
                      {b.status === 'completed' && (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs font-semibold truncate ${
                            b.status === 'current'
                              ? 'text-[#8a6f3a] dark:text-[#e6c98a]'
                              : b.status === 'completed'
                                ? 'text-emerald-700 dark:text-emerald-300'
                                : 'text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          {b.patient}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate flex items-center gap-1.5">
                          <span className="font-mono">{b.timeLabel}</span>
                          <span className="text-gray-300 dark:text-gray-600">·</span>
                          <span>{b.procedure}</span>
                        </p>
                      </div>
                    </div>

                    {b.status === 'current' && (
                      <span className="shrink-0 text-[10px] font-bold font-mono text-[#5ecece] bg-[#5ecece]/15 px-1.5 py-0.5 rounded">
                        {mm}:{ss}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Drag confirmation alert card — positioned near 09:30 drop target */}
            {dragConfirmVisible && (
              <div
                className="absolute z-30 w-72"
                style={{ top: minutesToTop(90) + 40, left: 'auto', right: 8 }}
              >
                <div className="bg-white dark:bg-[#21262D] rounded-lg border-2 border-[#5ecece] shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#5ecece]/10 dark:bg-[#5ecece]/15 border-b border-[#5ecece]/20">
                    <AlertTriangle className="w-4 h-4 text-[#5ecece]" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Перенести приём?
                    </span>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Из:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100 line-through opacity-60">
                        Новиков Алексей В. · 10:00
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <ChevronRight className="w-3 h-3 text-[#5ecece]" />
                      <span className="font-medium text-[#5ecece]">
                        Новиков Алексей В. → 09:30
                      </span>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer group">
                      <button
                        type="button"
                        onClick={() => setNotifyPatient((v) => !v)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          notifyPatient
                            ? 'bg-[#5ecece] border-[#5ecece]'
                            : 'bg-transparent border-gray-300 dark:border-[#373E47]'
                        }`}
                      >
                        {notifyPatient && <Check className="w-3 h-3 text-white" />}
                      </button>
                      <span className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                        <Bell className="w-3 h-3" />
                        Отправить уведомление пациенту?
                      </span>
                    </label>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setDragConfirmVisible(false)}
                        className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#30363D] rounded-md hover:bg-gray-200 dark:hover:bg-[#373E47] transition-colors"
                      >
                        Отменить
                      </button>
                      <button
                        onClick={() => setDragConfirmVisible(false)}
                        className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-[#5ecece] rounded-md hover:bg-[#4bb8b8] transition-colors"
                      >
                        Подтвердить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-gray-500 dark:text-gray-400 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#5ecece]/30 border-l-2 border-[#5ecece]" />
          <span>Текущий приём</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500/20 border-l-2 border-emerald-500" />
          <span>Завершён</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-blue-500/15 border-l-2 border-blue-500" />
          <span>Запланирован</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-500/15 border-l-2 border-red-500" />
          <span>Экстренный</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm border-2 border-dashed border-[#5ecece]" />
          <span>Свободный слот</span>
        </div>
      </div>
    </div>
  )

  /* -------------------------------------------------------------- */
  /*  Ward mode                                                     */
  /* -------------------------------------------------------------- */
  const renderWard = () => {
    const total = wardRooms.length
    const done = visitedWards.length
    const progress = Math.round((done / total) * 100)

    return (
      <div className="space-y-4">
        {/* Header bar with progress */}
        <div className="bg-white dark:bg-[#21262D] rounded-xl border border-gray-200 dark:border-[#373E47] p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Прогресс обхода
              </span>
              <span className="text-xs font-bold text-[#5ecece]">
                {done} из {total} палат осмотрено
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-[#30363D] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#5ecece] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#5ecece] text-white rounded-lg text-sm font-medium hover:bg-[#4bb8b8] transition-colors shrink-0">
            <Stethoscope className="w-4 h-4" />
            Начать обход
          </button>
        </div>

        {/* Rooms list */}
        <div className="bg-white dark:bg-[#21262D] rounded-xl border border-gray-200 dark:border-[#373E47] overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-[#373E47] bg-gray-50 dark:bg-[#30363D] grid grid-cols-12 gap-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <div className="col-span-2">Палата</div>
            <div className="col-span-5">Пациент</div>
            <div className="col-span-3">Диагноз (МКБ-10)</div>
            <div className="col-span-2 text-right">Статус</div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-[#373E47]/60">
            {wardRooms.map((r) => {
              const visited = visitedWards.includes(r.room)
              const isCurrent = r.room === currentWard
              const status: WardRoom['status'] = visited
                ? 'visited'
                : isCurrent
                  ? 'current'
                  : 'waiting'

              return (
                <button
                  key={r.room}
                  onClick={() => {
                    if (!visited) {
                      setCurrentWard(r.room)
                    }
                  }}
                  className={`w-full grid grid-cols-12 gap-3 px-4 py-3 items-center text-left transition-colors ${
                    isCurrent
                      ? 'bg-[#5ecece]/10 dark:bg-[#5ecece]/15'
                      : 'hover:bg-gray-50 dark:hover:bg-[#30363D]/60'
                  }`}
                >
                  {/* Room badge */}
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center justify-center min-w-[52px] px-2.5 py-1 rounded-md text-sm font-bold font-mono ${
                        isCurrent
                          ? 'bg-[#5ecece] text-white'
                          : visited
                            ? 'bg-emerald-500/15 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : 'bg-gray-100 dark:bg-[#30363D] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#373E47]'
                      }`}
                    >
                      {r.room}
                    </span>
                  </div>

                  {/* Patient */}
                  <div className="col-span-5 flex items-center gap-2 min-w-0">
                    <User className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {r.patient}
                    </span>
                  </div>

                  {/* Diagnosis */}
                  <div className="col-span-3">
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      {r.diagnosis}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    {status === 'visited' && (
                      <>
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 dark:bg-emerald-900/30 flex items-center justify-center">
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        </span>
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          осмотрен
                        </span>
                      </>
                    )}
                    {status === 'current' && (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5ecece] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5ecece]" />
                        </span>
                        <span className="text-[11px] font-semibold text-[#5ecece]">
                          текущий
                        </span>
                      </>
                    )}
                    {status === 'waiting' && (
                      <>
                        <Circle className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
                        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                          ожидает
                        </span>
                      </>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Ward footer actions */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-[#373E47] bg-gray-50/50 dark:bg-[#30363D]/40 flex items-center justify-between">
            <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              Отделение восстановительного лечения · 3-й этаж
            </p>
            <button
              onClick={() => {
                if (currentWard && !visitedWards.includes(currentWard)) {
                  setVisitedWards((w) => [...w, currentWard])
                  const next = wardRooms.find(
                    (r) =>
                      r.room !== currentWard && !visitedWards.includes(r.room),
                  )
                  if (next) setCurrentWard(next.room)
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#5ecece] rounded-md hover:bg-[#4bb8b8] transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Отметить палату {currentWard} осмотренной
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* -------------------------------------------------------------- */
  /*  Render                                                        */
  /* -------------------------------------------------------------- */
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Рабочее место врача</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#5ecece] font-medium">Мой день</span>
      </div>

      {/* Page header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
            Мой день
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Понедельник, 28 июля 2026
          </p>
        </div>

        {/* Mode switcher */}
        <div className="inline-flex items-center bg-gray-100 dark:bg-[#30363D] rounded-lg p-0.5 self-start">
          <button
            onClick={() => setMode('office')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              mode === 'office'
                ? 'bg-white dark:bg-[#21262D] text-[#5ecece] shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Кабинет
          </button>
          <button
            onClick={() => setMode('ward')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              mode === 'ward'
                ? 'bg-white dark:bg-[#21262D] text-[#5ecece] shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Обход палат
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#21262D] rounded-lg border border-gray-200 dark:border-[#373E47] px-4 py-3">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Сегодня
          </p>
          <p className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100 mt-0.5">
            {stats.total}{' '}
            <span className="text-xs font-sans font-normal text-gray-500 dark:text-gray-400">
              приёмов
            </span>
          </p>
        </div>
        <div className="bg-white dark:bg-[#21262D] rounded-lg border border-gray-200 dark:border-[#373E47] px-4 py-3">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Завершено
          </p>
          <p className="text-xl font-serif font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {stats.done}{' '}
            <span className="text-xs font-sans font-normal text-gray-500 dark:text-gray-400">
              приёмов
            </span>
          </p>
        </div>
        <div className="bg-white dark:bg-[#21262D] rounded-lg border border-gray-200 dark:border-[#373E47] px-4 py-3">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Осталось
          </p>
          <p className="text-xl font-serif font-bold text-[#5ecece] mt-0.5">
            {stats.left}{' '}
            <span className="text-xs font-sans font-normal text-gray-500 dark:text-gray-400">
              приёмов
            </span>
          </p>
        </div>
      </div>

      {/* Mode content */}
      {mode === 'office' ? renderOffice() : renderWard()}

      {/* ============================================================ */}
      {/*  Floating timer panel (current reception)                   */}
      {/* ============================================================ */}
      <div className="fixed bottom-4 right-4 z-40 w-72">
        <div className="bg-white dark:bg-[#21262D] rounded-xl border border-[#5ecece]/40 shadow-2xl overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#5ecece]/10 dark:bg-[#5ecece]/15 border-b border-[#5ecece]/20">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#5ecece]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Текущий приём
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
              08:30–09:00
            </span>
          </div>

          {/* body */}
          <div className="p-3 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#5ecece]/15 border border-[#5ecece]/30 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-[#5ecece]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  Козлов Дмитрий А.
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                  Очередной приём · каб. 204
                </p>
              </div>
            </div>

            {/* Timer display */}
            <div className="flex items-center justify-between bg-gray-50 dark:bg-[#30363D] rounded-lg px-3 py-2">
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                Длительность
              </span>
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-2xl font-bold font-mono text-gray-900 dark:text-gray-100 tabular-nums">
                  {mm}:{ss}
                </span>
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors">
                <Square className="w-3 h-3 fill-current" />
                Завершить
              </button>
              <button
                onClick={() => {
                  const p = appointmentPatients['kozlov']
                  if (p) onOpenPatient({ ...p, hasNewAnalyses: false })
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-[#5ecece] bg-[#5ecece]/10 border border-[#5ecece]/30 rounded-md hover:bg-[#5ecece]/20 transition-colors whitespace-nowrap"
              >
                Открыть карту
              </button>
              <button className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-900 dark:text-gray-100 bg-transparent border border-[#5ecece] rounded-md hover:bg-[#5ecece]/10 transition-colors">
                <Pause className="w-3 h-3" />
              </button>
              <button className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-900 dark:text-gray-100 bg-transparent border border-[#5ecece] rounded-md hover:bg-[#5ecece]/10 transition-colors">
                <X className="w-3 h-3" />
                Отменить
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Emergency reception modal                                  */}
      {/* ============================================================ */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEmergencyModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#21262D] rounded-xl border border-gray-200 dark:border-[#373E47] shadow-2xl">
            {/* header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#373E47]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-md bg-red-500/15 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </span>
                <h2 className="text-base font-serif font-bold text-gray-900 dark:text-gray-100">
                  Экстренный приём
                </h2>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#30363D] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#5ecece]/10 dark:bg-[#5ecece]/15 border border-[#5ecece]/20 rounded-lg">
                <Clock className="w-4 h-4 text-[#5ecece] shrink-0" />
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  Бронирование свободного слота{' '}
                  <span className="font-semibold text-[#5ecece]">
                    {emergencySlot}
                  </span>
                  . Будет создана задача для администратора.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ФИО пациента <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={emergencyFio}
                    onChange={(e) => setEmergencyFio(e.target.value)}
                    placeholder="Введите ФИО пациента..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#161B22] border border-gray-300 dark:border-[#373E47] rounded-lg text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#5ecece]/50 focus:border-[#5ecece]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Причина <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={emergencyReason}
                  onChange={(e) => setEmergencyReason(e.target.value)}
                  rows={3}
                  placeholder="Опишите причину экстренного приёма..."
                  className="w-full px-3 py-2.5 bg-white dark:bg-[#161B22] border border-gray-300 dark:border-[#373E47] rounded-lg text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#5ecece]/50 focus:border-[#5ecece] resize-none"
                />
              </div>

              <div className="flex items-start gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                <Bell className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                <p>
                  Пациенту будет отправлено push-уведомление. Администратор
                  получит задачу на оформление и подтверждение слота.
                </p>
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-[#373E47]">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#30363D] rounded-lg hover:bg-gray-200 dark:hover:bg-[#373E47] transition-colors"
              >
                Отмена
              </button>
              <button
                disabled={!emergencyFio.trim() || !emergencyReason.trim()}
                onClick={() => setShowEmergencyModal(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#5ecece] rounded-lg hover:bg-[#4bb8b8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Забронировать слот
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
