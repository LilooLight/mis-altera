'use client'

import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Coins,
  AlertTriangle,
  Plus,
  CalendarDays,
  X,
  Shield,
  Search,
  User,
} from 'lucide-react'

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

interface CalendarDay {
  day: number
  month: number
  isCurrentMonth: boolean
  isToday: boolean
  hasAppointments: boolean
  appointmentCount?: number
  hasUnpaid?: boolean
}

function generateCalendar(): CalendarDay[][] {
  const weeks: CalendarDay[][] = []
  // Simplified calendar for demo
  const days: CalendarDay[] = []
  for (let i = 0; i < 35; i++) {
    const day = i - 3
    days.push({
      day: day > 0 && day <= 31 ? day : day > 31 ? day - 31 : 31 + day,
      month: day > 0 ? 5 : 4,
      isCurrentMonth: day > 0 && day <= 31,
      isToday: day === 15,
      hasAppointments: [3, 5, 8, 10, 12, 14, 15, 17, 19, 22, 24, 26].includes(day),
      appointmentCount: [15, 22, 24].includes(day) ? 3 : 1,
      hasUnpaid: [8, 17].includes(day),
    })
  }
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  return weeks
}

interface Appointment {
  id: number
  time: string
  procedure: string
  location: string
  doctor: string
  price: number
  isPaid: boolean
  isFree: boolean
  status: 'upcoming' | 'completed' | 'cancelled'
}

const sampleAppointments: Appointment[] = [
  { id: 1, time: '08:00', procedure: 'ЛФК — утренняя гимнастика', location: 'Спортзал, корпус 1', doctor: 'Сидорова А.В.', price: 0, isPaid: true, isFree: true, status: 'completed' },
  { id: 2, time: '09:30', procedure: 'Ингаляция минеральной водой', location: 'Физиокабинет №3', doctor: 'Козлова М.И.', price: 1200, isPaid: true, isFree: false, status: 'completed' },
  { id: 3, time: '11:00', procedure: 'Грязевые аппликации', location: 'Грязелечебница, каб. 8', doctor: 'Петрова Е.Н.', price: 1800, isPaid: true, isFree: false, status: 'completed' },
  { id: 4, time: '14:00', procedure: 'Подводный душ-массаж', location: 'Водолечебница, каб. 2', doctor: 'Иванов П.С.', price: 2500, isPaid: false, isFree: false, status: 'upcoming' },
  { id: 5, time: '15:30', procedure: 'Электросон', location: 'Физиокабинет №5', doctor: 'Козлова М.И.', price: 1500, isPaid: false, isFree: false, status: 'upcoming' },
  { id: 6, time: '17:00', procedure: 'Приём мануальной терапии', location: 'Каб. мануальной терапии', doctor: 'Петрова Е.Н.', price: 3200, isPaid: true, isFree: false, status: 'upcoming' },
  { id: 7, time: '18:30', procedure: 'Питьевой бювет', location: 'Холл главного корпуса', doctor: '—', price: 0, isPaid: true, isFree: true, status: 'upcoming' },
]

export function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(15)
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [showBuilderModal, setShowBuilderModal] = useState(false)
  const [auditReason, setAuditReason] = useState('')
  const [builderSearch, setBuilderSearch] = useState('')
  const [isFree, setIsFree] = useState(false)
  const calendarWeeks = generateCalendar()

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Курортный комплекс</span>
        <ChevronRight className="w-3 h-3" />
        <span>Кабинет пациента</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#5ecece] font-medium">Расписание процедур</span>
      </div>

      {/* Calendar + Timeline Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar Card */}
        <div className="xl:col-span-1 bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#5ecece]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
                Май 2026
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#1e293b] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#1e293b] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className="text-center text-[11px] font-medium text-gray-500 dark:text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="space-y-1">
            {calendarWeeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1">
                {week.map((d, di) => (
                  <button
                    key={di}
                    onClick={() => d.isCurrentMonth && setSelectedDate(d.day)}
                    className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all duration-200 ${
                      !d.isCurrentMonth
                        ? 'text-gray-300 dark:text-gray-700'
                        : d.isToday && d.day === selectedDate
                          ? 'bg-[#5ecece] text-white font-bold shadow-md'
                          : d.day === selectedDate
                            ? 'bg-[#5ecece]/15 dark:bg-[#5ecece]/20 text-[#5ecece] font-bold ring-1 ring-[#5ecece]/30'
                            : d.isToday
                              ? 'bg-gray-100 dark:bg-[#1e293b] text-gray-900 dark:text-gray-100 font-medium ring-1 ring-[#5ecece]/30'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e293b]'
                    }`}
                  >
                    <span>{d.day}</span>
                    {d.hasAppointments && d.isCurrentMonth && (
                      <div className="flex gap-0.5 mt-0.5">
                        <span className={`w-1 h-1 rounded-full ${d.hasUnpaid ? 'bg-amber-500' : 'bg-[#5ecece]'}`} />
                        {d.appointmentCount && d.appointmentCount > 1 && (
                          <span className="w-1 h-1 rounded-full bg-[#5ecece]" />
                        )}
                        {d.appointmentCount && d.appointmentCount > 2 && (
                          <span className="w-1 h-1 rounded-full bg-[#5ecece]" />
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#253041] flex items-center gap-4 text-[11px] text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <Coins className="w-3 h-3 text-[#5ecece]" />
              <span>Платная</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span>Не оплачено</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Бесплатно</span>
            </div>
          </div>
        </div>

        {/* Appointments Timeline */}
        <div className="xl:col-span-2 space-y-4">
          {/* Date Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100">
                15 мая, четверг
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                День 4 курса · 7 назначений
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowAuditModal(true)} className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-[#253041] transition-colors border border-gray-200 dark:border-[#253041]">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Отменить</span>
              </button>
              <button onClick={() => setShowBuilderModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#5ecece] text-white rounded-lg text-sm font-medium hover:bg-[#4bb8b8] transition-colors">
                <Plus className="w-4 h-4" />
                Назначить
              </button>
            </div>
          </div>

          {/* Appointments List */}
          <div className="space-y-2">
            {sampleAppointments.map((apt) => (
              <div
                key={apt.id}
                className={`bg-white dark:bg-[#151e2e] rounded-xl border transition-all duration-200 ${
                  apt.status === 'cancelled'
                    ? 'border-gray-200 dark:border-[#253041] opacity-60'
                    : 'border-gray-200 dark:border-[#253041] hover:border-[#5ecece]/30 dark:hover:border-[#5ecece]/30'
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Time block */}
                  <div className="w-16 shrink-0 text-center">
                    <span className="text-lg font-bold text-[#5ecece]">{apt.time}</span>
                  </div>

                  {/* Vertical line */}
                  <div className={`w-0.5 h-12 rounded-full ${apt.status === 'completed' ? 'bg-emerald-500/30' : apt.status === 'cancelled' ? 'bg-gray-300 dark:bg-gray-600' : 'bg-[#5ecece]/30'}`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-semibold text-gray-900 dark:text-gray-100 ${apt.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                      {apt.procedure}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{apt.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{apt.doctor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Payment Status */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {!apt.isFree && (
                      <div className="flex items-center gap-1">
                        <Coins className="w-3 h-3 text-[#5ecece]" />
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {apt.price.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    )}
                    {apt.isFree && (
                      <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Бесплатно</span>
                    )}
                    {!apt.isFree && apt.isPaid && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        Оплачено
                      </span>
                    )}
                    {!apt.isFree && !apt.isPaid && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">
                        <span className="w-1 h-1 rounded-full bg-amber-500" />
                        Не оплачено
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ====== AUDIT MODAL ====== */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAuditModal(false)} />
          {/* Modal */}
          <div className="relative w-full max-w-lg bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#253041]">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-serif font-bold text-gray-900 dark:text-gray-100">
                  Аудит: отмена / перенос назначения
                </h2>
              </div>
              <button onClick={() => setShowAuditModal(false)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Изменения в расписании требуют указания причины. Запись будет сохранена в аудит-логе.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Тип действия <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-3 py-2.5 bg-white dark:bg-[#0b1120] border border-gray-300 dark:border-[#253041] rounded-lg text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#5ecece]/50 focus:border-[#5ecece]">
                  <option>Отмена назначения</option>
                  <option>Перенос на другую дату</option>
                  <option>Перенос на прошлое (корректировка)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Назначение <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-3 py-2.5 bg-white dark:bg-[#0b1120] border border-gray-300 dark:border-[#253041] rounded-lg text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#5ecece]/50 focus:border-[#5ecece]">
                  <option>Грязевые аппликации — 15.05, 11:00</option>
                  <option>Подводный душ-массаж — 15.05, 14:00</option>
                  <option>Электросон — 15.05, 15:30</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Причина <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={auditReason}
                  onChange={(e) => setAuditReason(e.target.value)}
                  rows={3}
                  placeholder="Укажите причину отмены или переноса..."
                  className="w-full px-3 py-2.5 bg-white dark:bg-[#0b1120] border border-gray-300 dark:border-[#253041] rounded-lg text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#5ecece]/50 focus:border-[#5ecece] resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-[#253041]">
              <button onClick={() => setShowAuditModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#1e293b] rounded-lg hover:bg-gray-200 dark:hover:bg-[#253041] transition-colors">
                Отмена
              </button>
              <button
                disabled={!auditReason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-[#5ecece] rounded-lg hover:bg-[#4bb8b8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Подтвердить и записать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== APPOINTMENT BUILDER MODAL ====== */}
      {showBuilderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBuilderModal(false)} />
          {/* Modal */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#253041]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#5ecece]" />
                <h2 className="text-base font-serif font-bold text-gray-900 dark:text-gray-100">
                  Конструктор назначений
                </h2>
              </div>
              <button onClick={() => setShowBuilderModal(false)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Service search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Поиск услуги</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={builderSearch}
                    onChange={(e) => setBuilderSearch(e.target.value)}
                    placeholder="Начните вводить название процедуры..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0b1120] border border-gray-300 dark:border-[#253041] rounded-lg text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#5ecece]/50 focus:border-[#5ecece]"
                  />
                </div>
              </div>

              {/* Selected services table */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Выбранные услуги</label>
                <div className="bg-gray-50 dark:bg-[#0b1120] rounded-lg border border-gray-200 dark:border-[#253041] divide-y divide-gray-200 dark:divide-[#253041]">
                  {/* Service row 1 */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Грязевые аппликации (поясница)</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">Грязелечебница, каб. 8 · 20 мин</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-[#5ecece]" />
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">1 800 ₽</span>
                    </div>
                    <button className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {/* Service row 2 */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Подводный душ-массаж</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">Водолечебница, каб. 2 · 15 мин</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-[#5ecece]" />
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">2 500 ₽</span>
                    </div>
                    <button className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing toggle */}
              <div className="flex items-center justify-between bg-gray-50 dark:bg-[#0b1120] rounded-lg border border-gray-200 dark:border-[#253041] p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Тип оплаты</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    При неоплате будет создана задача для администратора
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFree(false)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      !isFree ? 'bg-[#5ecece] text-white' : 'bg-white dark:bg-[#151e2e] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#253041]'
                    }`}>
                    <span className="flex items-center gap-1"><Coins className="w-3 h-3" /> Платно</span>
                  </button>
                  <button
                    onClick={() => setIsFree(true)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      isFree ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-[#151e2e] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#253041]'
                    }`}>
                    Бесплатно
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#5ecece]/10 dark:bg-[#5ecece]/15 rounded-lg border border-[#5ecece]/20">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Итого:</span>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-[#5ecece]" />
                  <span className="text-lg font-bold text-[#5ecece]">4 300 ₽</span>
                </div>
              </div>

              {/* Note about admin task */}
              <div className="flex items-start gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                <p>Дата и время назначаются администратором. Врач назначает только перечень услуг.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-[#253041]">
              <button onClick={() => setShowBuilderModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#1e293b] rounded-lg hover:bg-gray-200 dark:hover:bg-[#253041] transition-colors">
                Отмена
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-[#5ecece] rounded-lg hover:bg-[#4bb8b8] transition-colors">
                Назначить услуги
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
