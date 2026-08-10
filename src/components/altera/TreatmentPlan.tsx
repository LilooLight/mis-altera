'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Pill, User, Activity, Plus, Search, Calendar, Clock, ChevronLeft, ChevronRight,
  Check, X, AlertTriangle, Coins, GripVertical, Stethoscope, Edit2, RotateCcw,
  Trash2, FileText, Play,
} from 'lucide-react'

// ===================== DATA =====================

const MEDICATIONS = [
  { name: 'Нимесулид 100мг', category: 'НПВС' },
  { name: 'Мелоксикам 15мг', category: 'НПВС' },
  { name: 'Панциртонин 500мг', category: 'Хондропротектор' },
]

const PROCEDURES = [
  { name: 'Грязевые аппликации', price: 1200 },
  { name: 'Подводный душ-массаж', price: 900 },
  { name: 'Парафино-озокеритовые аппликации', price: 800 },
  { name: 'Электростимуляция', price: 600 },
  { name: 'Ультразвуковая терапия', price: 700 },
  { name: 'Лечебный массаж', price: 1500 },
]

const SPECIALISTS = [
  { name: 'Иванов И.М.', role: 'Терапевт' },
  { name: 'Сидорова О.Н.', role: 'Невролог' },
  { name: 'Козлов А.П.', role: 'Кардиолог' },
  { name: 'Фёдорова Е.В.', role: 'Физиотерапевт' },
]

const FREQUENCY_OPTIONS = ['1 раз/день', '2 раза/день', '3 раза/день']

const TIME_SLOTS = {
  morning: ['08:00', '09:00', '10:00', '11:00'],
  afternoon: ['13:00', '14:00', '15:00', '16:00'],
}

const SPECIALIST_OCCUPIED = ['09:00', '11:00', '14:00', '16:00']
const PROCEDURE_OCCUPIED = ['08:00', '10:00', '13:00', '15:00']

interface CalendarAppointment {
  id: number
  day: number
  label: string
  type: 'medication' | 'specialist' | 'procedure'
  status: 'completed' | 'pending' | 'cancelled' | 'unpaid'
  isPaid: boolean
  isTimeAgreed: boolean
  time?: string
  cost?: number
}

const CALENDAR_APPOINTMENTS: CalendarAppointment[] = [
  { id: 1, day: 1, label: 'Нимесулид', type: 'medication', status: 'completed', isPaid: false, isTimeAgreed: true, cost: 0 },
  { id: 2, day: 1, label: 'Терапевт', type: 'specialist', status: 'completed', isPaid: false, isTimeAgreed: true, time: '09:00' },
  { id: 3, day: 2, label: 'Грязевые аппл.', type: 'procedure', status: 'completed', isPaid: true, isTimeAgreed: true, time: '10:00', cost: 1200 },
  { id: 4, day: 3, label: 'Мелоксикам', type: 'medication', status: 'completed', isPaid: false, isTimeAgreed: true, cost: 0 },
  { id: 5, day: 3, label: 'Массаж', type: 'procedure', status: 'completed', isPaid: true, isTimeAgreed: true, time: '14:00', cost: 1500 },
  { id: 6, day: 5, label: 'Невролог', type: 'specialist', status: 'completed', isPaid: false, isTimeAgreed: true, time: '11:00' },
  { id: 7, day: 6, label: 'Электростимуляция', type: 'procedure', status: 'unpaid', isPaid: false, isTimeAgreed: true, time: '10:00', cost: 600 },
  { id: 8, day: 7, label: 'Нимесулид', type: 'medication', status: 'completed', isPaid: false, isTimeAgreed: true, cost: 0 },
  { id: 9, day: 8, label: 'Грязевые аппл.', type: 'procedure', status: 'pending', isPaid: false, isTimeAgreed: false, cost: 1200 },
  { id: 10, day: 9, label: 'Кардиолог', type: 'specialist', status: 'pending', isPaid: false, isTimeAgreed: false },
  { id: 11, day: 10, label: 'Панциртонин', type: 'medication', status: 'completed', isPaid: false, isTimeAgreed: true, cost: 0 },
  { id: 12, day: 10, label: 'Массаж', type: 'procedure', status: 'unpaid', isPaid: false, isTimeAgreed: true, time: '15:00', cost: 1500 },
  { id: 13, day: 12, label: 'Нимесулид', type: 'medication', status: 'completed', isPaid: false, isTimeAgreed: true, cost: 0 },
  { id: 14, day: 13, label: 'Терапевт', type: 'specialist', status: 'cancelled', isPaid: false, isTimeAgreed: true, time: '09:00' },
  { id: 15, day: 14, label: 'Душ-массаж', type: 'procedure', status: 'completed', isPaid: true, isTimeAgreed: true, time: '13:00', cost: 900 },
  { id: 16, day: 15, label: 'Грязевые аппл.', type: 'procedure', status: 'pending', isPaid: false, isTimeAgreed: false, cost: 1200 },
  { id: 17, day: 16, label: 'Нимесулид', type: 'medication', status: 'completed', isPaid: false, isTimeAgreed: true, cost: 0 },
  { id: 18, day: 17, label: 'Массаж', type: 'procedure', status: 'completed', isPaid: true, isTimeAgreed: true, time: '14:00', cost: 1500 },
  { id: 19, day: 20, label: 'УЗ-терапия', type: 'procedure', status: 'unpaid', isPaid: false, isTimeAgreed: true, time: '11:00', cost: 700 },
  { id: 20, day: 22, label: 'Невролог', type: 'specialist', status: 'pending', isPaid: false, isTimeAgreed: false },
  { id: 21, day: 24, label: 'Панциртонин', type: 'medication', status: 'completed', isPaid: false, isTimeAgreed: true, cost: 0 },
]

// July 2026: 1st = Wednesday (index 2 in Mon-based week)
const JULY_2026_FIRST_DOW = 2
const DAYS_IN_MONTH = 31
const DAYS_IN_PREV_MONTH = 30

function buildCalendarDays() {
  const days: { day: number; isCurrentMonth: boolean }[] = []
  for (let i = JULY_2026_FIRST_DOW - 1; i >= 0; i--) {
    days.push({ day: DAYS_IN_PREV_MONTH - i, isCurrentMonth: false })
  }
  for (let d = 1; d <= DAYS_IN_MONTH; d++) {
    days.push({ day: d, isCurrentMonth: true })
  }
  const remaining = 35 - days.length
  for (let d = 1; d <= remaining; d++) {
    days.push({ day: d, isCurrentMonth: false })
  }
  return days
}

const CALENDAR_DAYS = buildCalendarDays()
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

// ===================== COMPONENT =====================

export function TreatmentPlan() {
  const [activeTab, setActiveTab] = useState<'medication' | 'specialist' | 'procedure'>('medication')
  const [medicationSearch, setMedicationSearch] = useState('')
  const [procedureSearch, setProcedureSearch] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [isPaid, setIsPaid] = useState(true)
  const [showManagementModal, setShowManagementModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showBackdateModal, setShowBackdateModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [backdateReason, setBackdateReason] = useState('')
  const [selectedSpecialist, setSelectedSpecialist] = useState('')
  const [selectedMedication, setSelectedMedication] = useState('')
  const [selectedProcedure, setSelectedProcedure] = useState<{ name: string; price: number } | null>(null)
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [duration, setDuration] = useState('')
  const [comment, setComment] = useState('')
  const [showMedDropdown, setShowMedDropdown] = useState(false)
  const [showProcDropdown, setShowProcDropdown] = useState(false)
  const [showSpecDropdown, setShowSpecDropdown] = useState(false)
  const [draggingId, setDraggingId] = useState<number | null>(5)
  const [dropTargetDay, setDropTargetDay] = useState<number | null>(20)
  const [modalAppointment, setModalAppointment] = useState<CalendarAppointment | null>(null)

  const medDropdownRef = useRef<HTMLDivElement>(null)
  const procDropdownRef = useRef<HTMLDivElement>(null)
  const specDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (medDropdownRef.current && !medDropdownRef.current.contains(e.target as Node)) {
        setShowMedDropdown(false)
      }
      if (procDropdownRef.current && !procDropdownRef.current.contains(e.target as Node)) {
        setShowProcDropdown(false)
      }
      if (specDropdownRef.current && !specDropdownRef.current.contains(e.target as Node)) {
        setShowSpecDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filteredMedications = MEDICATIONS.filter((m) =>
    m.name.toLowerCase().includes(medicationSearch.toLowerCase()) ||
    m.category.toLowerCase().includes(medicationSearch.toLowerCase())
  )

  const filteredProcedures = PROCEDURES.filter((p) =>
    p.name.toLowerCase().includes(procedureSearch.toLowerCase())
  )

  function getAppointmentsForDay(day: number): CalendarAppointment[] {
    return CALENDAR_APPOINTMENTS.filter((a) => a.day === day)
  }

  function hasUnpaidAppointments(day: number): boolean {
    return CALENDAR_APPOINTMENTS.some((a) => a.day === day && a.status === 'unpaid')
  }

  function openManagementModal(appointment: CalendarAppointment) {
    setModalAppointment(appointment)
    setShowManagementModal(true)
  }

  function getAppointmentChipColor(appointment: CalendarAppointment): string {
    if (appointment.status === 'cancelled') {
      return 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 line-through opacity-50'
    }
    if (!appointment.isTimeAgreed) {
      return 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600'
    }
    if (appointment.status === 'completed') {
      if (appointment.type === 'medication') return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
      if (appointment.type === 'specialist') return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    }
    if (appointment.status === 'unpaid') {
      return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
    }
    if (appointment.type === 'medication') return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
    if (appointment.type === 'specialist') return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
  }

  function handleDragStart(e: React.DragEvent, id: number) {
    setDraggingId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragEnd() {
    setDraggingId(null)
  }

  function handleDragOver(e: React.DragEvent, day: number) {
    e.preventDefault()
    setDropTargetDay(day)
  }

  function handleDragLeave() {
    setDropTargetDay(null)
  }

  function handleDrop(e: React.DragEvent, day: number) {
    e.preventDefault()
    setDropTargetDay(null)
    if (day < 25) {
      setShowBackdateModal(true)
    }
  }

  function renderTimeSlotGrid(occupiedSlots: string[]) {
    return (
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Утро</p>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.morning.map((slot) => {
              const occupied = occupiedSlots.includes(slot)
              const isSelected = selectedSlot === slot
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={occupied}
                  onClick={() => setSelectedSlot(isSelected ? null : slot)}
                  className={
                    occupied
                      ? 'px-3 py-2 rounded-lg text-xs bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : isSelected
                        ? 'px-3 py-2 rounded-lg text-xs bg-[#5ecece] text-white font-medium shadow-sm'
                        : 'px-3 py-2 rounded-lg text-xs bg-white dark:bg-[#30363D] border border-gray-200 dark:border-[#373E47] text-gray-700 dark:text-gray-300 hover:border-[#5ecece] hover:text-[#5ecece] transition-colors cursor-pointer'
                  }
                >
                  <Clock className="inline-block w-3 h-3 mr-1" />
                  {slot}
                </button>
              )
            })}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">День</p>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.afternoon.map((slot) => {
              const occupied = occupiedSlots.includes(slot)
              const isSelected = selectedSlot === slot
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={occupied}
                  onClick={() => setSelectedSlot(isSelected ? null : slot)}
                  className={
                    occupied
                      ? 'px-3 py-2 rounded-lg text-xs bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : isSelected
                        ? 'px-3 py-2 rounded-lg text-xs bg-[#5ecece] text-white font-medium shadow-sm'
                        : 'px-3 py-2 rounded-lg text-xs bg-white dark:bg-[#30363D] border border-gray-200 dark:border-[#373E47] text-gray-700 dark:text-gray-300 hover:border-[#5ecece] hover:text-[#5ecece] transition-colors cursor-pointer'
                  }
                >
                  <Clock className="inline-block w-3 h-3 mr-1" />
                  {slot}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  function getModalAppointmentTitle(appt: CalendarAppointment): string {
    const titles: Record<string, string> = {
      'Грязевые аппл.': 'Грязевые аппликации на поясницу',
      'Массаж': 'Лечебный массаж спины',
      'Душ-массаж': 'Подводный душ-массаж',
      'УЗ-терапия': 'Ультразвуковая терапия',
      'Электростимуляция': 'Электростимуляция мышц спины',
      'Нимесулид': 'Нимесулид 100мг',
      'Мелоксикам': 'Мелоксикам 15мг',
      'Панциртонин': 'Панциртонин 500мг',
      'Терапевт': 'Приём терапевта',
      'Невролог': 'Приём невролога',
      'Кардиолог': 'Приём кардиолога',
    }
    return titles[appt.label] || appt.label
  }

  function getModalAppointmentComment(appt: CalendarAppointment): string {
    if (appt.type === 'medication') return 'Принимать после еды, запивая водой'
    if (appt.type === 'specialist') return 'Консультация по результатам обследования'
    return 'Курс из 10 процедур, область поясницы'
  }

  function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      completed: 'Выполнено',
      cancelled: 'Отменено',
      unpaid: 'Не оплачено',
      pending: 'Ожидание',
    }
    return labels[status] || status
  }

  return (
    <div className="space-y-6">
      {/* ===================== PART 1: CONSTRUCTOR ===================== */}
      <section className="bg-white dark:bg-[#21262D] rounded-2xl border border-gray-200 dark:border-[#373E47] overflow-hidden">
        {/* Constructor Header */}
        <div className="p-4 border-b border-gray-200 dark:border-[#373E47]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100">
              Конструктор назначений
            </h2>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5ecece] text-white text-sm font-medium hover:bg-[#4bb8b8] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добавить назначение
            </button>
          </div>

          {/* Type Tabs */}
          <div className="inline-flex rounded-lg bg-gray-100 dark:bg-[#30363D] p-1 gap-1">
            <button
              type="button"
              onClick={() => { setActiveTab('medication'); setSelectedSlot(null) }}
              className={
                activeTab === 'medication'
                  ? 'inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white dark:bg-[#21262D] text-[#5ecece] text-sm font-medium shadow-sm transition-all'
                  : 'inline-flex items-center gap-2 px-4 py-2 rounded-md text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-gray-700 dark:hover:text-gray-300 transition-colors'
              }
            >
              <Pill className="w-4 h-4" />
              Лекарство
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('specialist'); setSelectedSlot(null) }}
              className={
                activeTab === 'specialist'
                  ? 'inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white dark:bg-[#21262D] text-[#5ecece] text-sm font-medium shadow-sm transition-all'
                  : 'inline-flex items-center gap-2 px-4 py-2 rounded-md text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-gray-700 dark:hover:text-gray-300 transition-colors'
              }
            >
              <User className="w-4 h-4" />
              Специалист
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('procedure'); setSelectedSlot(null) }}
              className={
                activeTab === 'procedure'
                  ? 'inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white dark:bg-[#21262D] text-[#5ecece] text-sm font-medium shadow-sm transition-all'
                  : 'inline-flex items-center gap-2 px-4 py-2 rounded-md text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-gray-700 dark:hover:text-gray-300 transition-colors'
              }
            >
              <Activity className="w-4 h-4" />
              Процедура
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {/* ---- TAB 1: Лекарство ---- */}
          {activeTab === 'medication' && (
            <div className="space-y-4">
              <div className="relative" ref={medDropdownRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={medicationSearch}
                    onChange={(e) => { setMedicationSearch(e.target.value); setShowMedDropdown(true) }}
                    onFocus={() => setShowMedDropdown(true)}
                    placeholder="Поиск препарата..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-[#373E47] bg-white dark:bg-[#30363D] text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#5ecece] focus:ring-1 focus:ring-[#5ecece]/30 transition-colors"
                  />
                </div>
                {showMedDropdown && filteredMedications.length > 0 && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-[#30363D] border border-gray-200 dark:border-[#373E47] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredMedications.map((med) => (
                      <button
                        key={med.name}
                        type="button"
                        onClick={() => {
                          setSelectedMedication(med.name)
                          setMedicationSearch(med.name)
                          setShowMedDropdown(false)
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-[#373E47] transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <Pill className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-gray-900 dark:text-gray-100">{med.name}</span>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-[#5ecece]">{med.category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Дозировка
                  </label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="100 мг"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-[#373E47] bg-white dark:bg-[#30363D] text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#5ecece] focus:ring-1 focus:ring-[#5ecece]/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Кратность
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-[#373E47] bg-white dark:bg-[#30363D] text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#5ecece] focus:ring-1 focus:ring-[#5ecece]/30 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Выберите...</option>
                    {FREQUENCY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Длительность курса
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="14 дней"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-[#373E47] bg-white dark:bg-[#30363D] text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#5ecece] focus:ring-1 focus:ring-[#5ecece]/30 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${!isPaid ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                    Бесплатно
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isPaid}
                    onClick={() => setIsPaid(!isPaid)}
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent shadow-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ecece]/50 cursor-pointer ${
                      isPaid ? 'bg-[#5ecece]' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        isPaid ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <span className={`text-sm ${isPaid ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                    Платно
                  </span>
                </div>
                {isPaid && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Coins className="w-4 h-4 text-[#5ecece]" />
                    <span>Цена: <span className="font-semibold text-gray-900 dark:text-gray-100">350 ₽</span></span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Комментарий
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  placeholder="Дополнительные указания..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-[#373E47] bg-white dark:bg-[#30363D] text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#5ecece] focus:ring-1 focus:ring-[#5ecece]/30 transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5ecece] text-white text-sm font-medium hover:bg-[#4bb8b8] transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Добавить в план
                </button>
              </div>
            </div>
          )}

          {/* ---- TAB 2: Специалист ---- */}
          {activeTab === 'specialist' && (
            <div className="space-y-4">
              <div className="relative" ref={specDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Выбор специалиста
                </label>
                <button
                  type="button"
                  onClick={() => setShowSpecDropdown(!showSpecDropdown)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-[#373E47] bg-white dark:bg-[#30363D] text-left text-sm flex items-center justify-between focus:outline-none focus:border-[#5ecece] focus:ring-1 focus:ring-[#5ecece]/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span className={selectedSpecialist ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                      {selectedSpecialist || 'Выбор специалиста'}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${showSpecDropdown ? 'rotate-90' : ''}`} />
                </button>
                {showSpecDropdown && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-[#30363D] border border-gray-200 dark:border-[#373E47] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {SPECIALISTS.map((spec) => (
                      <button
                        key={spec.name}
                        type="button"
                        onClick={() => {
                          setSelectedSpecialist(`${spec.name} — ${spec.role}`)
                          setShowSpecDropdown(false)
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-[#373E47] transition-colors flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-gray-900 dark:text-gray-100">
                          {spec.name} — {spec.role}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Комментарий
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  placeholder="Цель визита, жалобы..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-[#373E47] bg-white dark:bg-[#30363D] text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#5ecece] focus:ring-1 focus:ring-[#5ecece]/30 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Clock className="inline-block w-4 h-4 mr-1.5" />
                  Доступное время
                </label>
                {renderTimeSlotGrid(SPECIALIST_OCCUPIED)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <Calendar className="inline-block w-4 h-4 mr-1.5" />
                  Выбор даты
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-200 dark:border-[#373E47] bg-white dark:bg-[#30363D] text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#5ecece] focus:ring-1 focus:ring-[#5ecece]/30 transition-colors"
                />
              </div>

              {!selectedDate && !selectedSlot && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                    Требует согласования времени
                  </span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5ecece] text-white text-sm font-medium hover:bg-[#4bb8b8] transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Добавить в план
                </button>
              </div>
            </div>
          )}

          {/* ---- TAB 3: Процедура ---- */}
          {activeTab === 'procedure' && (
            <div className="space-y-4">
              <div className="relative" ref={procDropdownRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={procedureSearch}
                    onChange={(e) => { setProcedureSearch(e.target.value); setShowProcDropdown(true) }}
                    onFocus={() => setShowProcDropdown(true)}
                    placeholder="Поиск процедуры..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-[#373E47] bg-white dark:bg-[#30363D] text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#5ecece] focus:ring-1 focus:ring-[#5ecece]/30 transition-colors"
                  />
                </div>
                {showProcDropdown && filteredProcedures.length > 0 && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-[#30363D] border border-gray-200 dark:border-[#373E47] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredProcedures.map((proc) => (
                      <button
                        key={proc.name}
                        type="button"
                        onClick={() => {
                          setSelectedProcedure(proc)
                          setProcedureSearch(proc.name)
                          setShowProcDropdown(false)
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-[#373E47] transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-gray-900 dark:text-gray-100">{proc.name}</span>
                        </div>
                        <span className="text-xs font-medium text-[#5ecece]">
                          {proc.price.toLocaleString('ru-RU')} ₽
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedProcedure && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#30363D] border border-gray-200 dark:border-[#373E47] space-y-4">
                  <div className="flex items-center gap-3">
                    <Coins className="w-5 h-5 text-[#5ecece]" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Стоимость</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {selectedProcedure.price.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${!isPaid ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                      Бесплатно
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isPaid}
                      onClick={() => setIsPaid(!isPaid)}
                      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent shadow-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ecece]/50 cursor-pointer ${
                        isPaid ? 'bg-[#5ecece]' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          isPaid ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    <span className={`text-sm ${isPaid ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                      Платно
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <Clock className="inline-block w-4 h-4 mr-1.5" />
                      Доступность оборудования
                    </label>
                    {renderTimeSlotGrid(PROCEDURE_OCCUPIED)}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      <Calendar className="inline-block w-4 h-4 mr-1.5" />
                      Выбор даты
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-200 dark:border-[#373E47] bg-white dark:bg-[#30363D] text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#5ecece] focus:ring-1 focus:ring-[#5ecece]/30 transition-colors"
                    />
                  </div>

                  {!selectedDate && !selectedSlot && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                        Требует согласования времени
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5ecece] text-white text-sm font-medium hover:bg-[#4bb8b8] transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Добавить в план
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===================== PART 2: CALENDAR ===================== */}
      <section className="bg-white dark:bg-[#21262D] rounded-2xl border border-gray-200 dark:border-[#373E47] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-[#373E47]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100">
              План-график назначений — Июль 2026
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 rounded-lg border border-gray-200 dark:border-[#373E47] hover:bg-gray-50 dark:hover:bg-[#30363D] transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <span className="px-3 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#30363D] rounded-lg border border-gray-200 dark:border-[#373E47]">
                Июль 2026
              </span>
              <button
                type="button"
                className="p-2 rounded-lg border border-gray-200 dark:border-[#373E47] hover:bg-gray-50 dark:hover:bg-[#30363D] transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              Выполнено
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
              Назначено, время не согласовано
            </div>
            <div className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[#5ecece]" />
              Платное
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded border-2 border-orange-500" />
              Не оплачено
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-[#373E47] rounded-xl overflow-hidden border border-gray-200 dark:border-[#373E47]">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="bg-gray-100 dark:bg-[#30363D] py-2.5 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}

            {CALENDAR_DAYS.map((cell, idx) => {
              const dayAppointments = cell.isCurrentMonth
                ? getAppointmentsForDay(cell.day)
                : []
              const hasUnpaid = cell.isCurrentMonth && hasUnpaidAppointments(cell.day)
              const isDropTarget = dropTargetDay === cell.day

              return (
                <div
                  key={idx}
                  className={
                    `bg-white dark:bg-[#21262D] min-h-[100px] p-2 transition-colors ${
                      !cell.isCurrentMonth
                        ? 'bg-gray-50 dark:bg-[#161B22]/50'
                        : isDropTarget
                          ? 'bg-[#5ecece]/5 dark:bg-[#5ecece]/10 border-2 border-dashed border-[#5ecece]'
                          : hasUnpaid
                            ? 'border-t-2 border-t-red-400 dark:border-t-orange-500'
                            : ''
                    }`
                  }
                  onDragOver={(e) => cell.isCurrentMonth && handleDragOver(e, cell.day)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => cell.isCurrentMonth && handleDrop(e, cell.day)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-medium ${
                        !cell.isCurrentMonth
                          ? 'text-gray-300 dark:text-gray-600'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {cell.day}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {dayAppointments.map((appt) => {
                      const isDragging = draggingId === appt.id
                      return (
                        <button
                          key={appt.id}
                          type="button"
                          draggable
                          onDragStart={(e) => handleDragStart(e, appt.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => openManagementModal(appt)}
                          className={
                            `w-full text-left px-1.5 py-1 rounded text-[10px] leading-tight truncate flex items-center gap-1 transition-all ${
                              getAppointmentChipColor(appt)
                            } ${
                              isDragging
                                ? 'opacity-80 shadow-lg scale-105 cursor-grabbing z-10 relative'
                                : 'cursor-grab hover:opacity-80'
                            } ${
                              appt.status !== 'cancelled' ? 'hover:ring-1 hover:ring-[#5ecece]/30' : ''
                            }`
                          }
                        >
                          {isDragging && <GripVertical className="w-2.5 h-2.5 shrink-0" />}
                          {appt.status === 'completed' && !isDragging && (
                            <Check className="w-2.5 h-2.5 shrink-0 text-green-600 dark:text-green-400" />
                          )}
                          {appt.isPaid && appt.status !== 'cancelled' && !isDragging && (
                            <Coins className="w-2.5 h-2.5 shrink-0 text-[#5ecece]" />
                          )}
                          {appt.label}
                          {appt.time && !isDragging && (
                            <span className="ml-auto text-[9px] opacity-60 shrink-0">{appt.time}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-2 mt-3 text-xs text-gray-400 dark:text-gray-500">
            <GripVertical className="w-3.5 h-3.5" />
            <span>Перетащите назначение для изменения даты</span>
          </div>
        </div>
      </section>

      {/* ===================== MODAL 1: Управление назначением ===================== */}
      {showManagementModal && modalAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowManagementModal(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-white dark:bg-[#21262D] rounded-2xl border border-gray-200 dark:border-[#373E47] shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100">
                Управление назначением
              </h3>
              <button
                type="button"
                onClick={() => setShowManagementModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#30363D] transition-colors"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {getModalAppointmentTitle(modalAppointment)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Назначил: Иванов И.М., {modalAppointment.day}.07.2026
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    modalAppointment.status === 'completed'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : modalAppointment.status === 'cancelled'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        : modalAppointment.status === 'unpaid'
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {modalAppointment.status === 'completed' && <Check className="w-3 h-3 mr-1" />}
                  {modalAppointment.status === 'cancelled' && <X className="w-3 h-3 mr-1" />}
                  {getStatusLabel(modalAppointment.status)}
                </span>

                {modalAppointment.isPaid && modalAppointment.status !== 'cancelled' && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    <Check className="w-3 h-3 mr-1" />
                    Оплачено
                  </span>
                )}

                {!modalAppointment.isPaid && modalAppointment.status === 'unpaid' && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                    <Coins className="w-3 h-3 mr-1" />
                    Не оплачено
                  </span>
                )}

                {!modalAppointment.isTimeAgreed && modalAppointment.status !== 'cancelled' && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600">
                    <Clock className="w-3 h-3 mr-1" />
                    Время не согласовано
                  </span>
                )}
              </div>

              {modalAppointment.cost !== undefined && modalAppointment.cost > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Coins className="w-4 h-4 text-[#5ecece]" />
                  <span>
                    Стоимость:{' '}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {modalAppointment.cost.toLocaleString('ru-RU')} ₽
                    </span>
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Комментарий
                </label>
                <div className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#161B22] border border-gray-100 dark:border-[#373E47] text-sm text-gray-600 dark:text-gray-400">
                  {getModalAppointmentComment(modalAppointment)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Корректировать время
              </button>

              {modalAppointment.status !== 'completed' && modalAppointment.status !== 'cancelled' && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Отметить выполненным
                </button>
              )}

              {modalAppointment.status !== 'cancelled' && (
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelModal(true)
                    setShowManagementModal(false)
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Отменить
                </button>
              )}

              {modalAppointment.status === 'cancelled' && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Вернуть в план
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL 2: Причина отмены ===================== */}
      {showCancelModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={() => setShowCancelModal(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-white dark:bg-[#21262D] rounded-2xl border border-gray-200 dark:border-[#373E47] shadow-2xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100">
                Указать причину отмены
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Отмена назначения будет зафиксирована в журнале аудита
            </p>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Причина <span className="text-red-500">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                placeholder="Укажите причину отмены..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-[#373E47] bg-white dark:bg-[#30363D] text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/30 transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false)
                  setCancelReason('')
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#30363D] transition-colors"
              >
                Закрыть
              </button>
              <button
                type="button"
                disabled={cancelReason.trim() === ''}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  cancelReason.trim() === ''
                    ? 'bg-red-300 dark:bg-red-900/40 text-red-200 dark:text-red-500/50 opacity-50 pointer-events-none cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Отменить назначение
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL 3: Внесение записи задним числом ===================== */}
      {showBackdateModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={() => setShowBackdateModal(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-white dark:bg-[#21262D] rounded-2xl border border-gray-200 dark:border-[#373E47] shadow-2xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100">
                Внимание: прошедшая дата
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Вы перемещаете назначение на 20.07.2026 (прошедшая дата). Укажите причину внесения записи задним числом.
            </p>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Причина <span className="text-red-500">*</span>
              </label>
              <textarea
                value={backdateReason}
                onChange={(e) => setBackdateReason(e.target.value)}
                rows={3}
                placeholder="Укажите причину..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-[#373E47] bg-white dark:bg-[#30363D] text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowBackdateModal(false)
                  setBackdateReason('')
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#30363D] transition-colors"
              >
                Отменить
              </button>
              <button
                type="button"
                disabled={backdateReason.trim() === ''}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  backdateReason.trim() === ''
                    ? 'bg-amber-300 dark:bg-amber-900/40 text-amber-200 dark:text-amber-500/50 opacity-50 pointer-events-none cursor-not-allowed'
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
