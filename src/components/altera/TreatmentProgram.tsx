'use client'

import { useState } from 'react'
import {
  Phone,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Star,
  User,
  BadgeCheck,
  TrendingUp,
} from 'lucide-react'

export function TreatmentProgram() {
  const [progress] = useState(27)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Курортный комплекс</span>
        <ChevronRight className="w-3 h-3" />
        <span>Кабинет пациента</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#5ecece] font-medium">Программа лечения</span>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#30363D] to-[#0f172a] dark:from-[#21262D] dark:to-[#161B22] p-6 lg:p-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5ecece] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#5ecece]/50 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
            Медицинский курорт
          </p>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-2">
            Санаторий Сочи УДП РФ
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5ecece]/15 border border-[#5ecece]/30">
              <Star className="w-3 h-3 text-[#5ecece]" />
              <span className="text-xs font-medium text-[#5ecece]">
                Программа: Восстановление опорно-двигательного аппарата
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">На лечении</span>
            </span>
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctor Card */}
        <div className="bg-white dark:bg-[#21262D] rounded-xl border border-gray-200 dark:border-[#373E47] p-6 hover:border-[#5ecece]/30 dark:hover:border-[#5ecece]/30 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#5ecece]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
                Лечащий врач
              </h2>
            </div>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-gray-100 dark:bg-[#30363D] text-gray-600 dark:text-gray-400">
              Каб. 204
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#5ecece]/10 border border-[#5ecece]/20 flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-[#5ecece]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100 mb-1">
                Петрова Елена Николаевна
              </h3>
              <div className="flex items-center gap-1.5 mb-3">
                <BadgeCheck className="w-3.5 h-3.5 text-[#5ecece]" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Врач-невролог, терапевт высшей категории
                </span>
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-[#5ecece] text-white dark:text-[#161B22] rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-[#4bb8b8] transition-colors">
                <Phone className="w-4 h-4" />
                Связаться с постом врача
              </button>
            </div>
          </div>
        </div>

        {/* Course Card */}
        <div className="bg-white dark:bg-[#21262D] rounded-xl border border-gray-200 dark:border-[#373E47] p-6 hover:border-[#5ecece]/30 dark:hover:border-[#5ecece]/30 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#5ecece]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
                Курс оздоровления
              </h2>
            </div>
            <button className="text-xs font-medium text-[#5ecece] hover:text-[#4bb8b8] flex items-center gap-1 transition-colors">
              График
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Dates */}
            <div>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Даты пребывания</span>
              <p className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                12 — 26 мая
              </p>
            </div>

            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-500 dark:text-gray-400">Прогресс лечения</span>
                <span className="text-xs font-bold text-[#5ecece]">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-[#30363D] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#5ecece] to-[#8edece] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                День 4 из 14 — Прошло 27%
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-[#30363D] rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="w-3 h-3 text-[#5ecece]" />
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">Назначено</span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">24</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">процедур</p>
              </div>
              <div className="bg-gray-50 dark:bg-[#30363D] rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Star className="w-3 h-3 text-emerald-500" />
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">Выполнено</span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">7</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">процедур</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white dark:bg-[#21262D] rounded-xl border border-gray-200 dark:border-[#373E47] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#373E47]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#5ecece]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Следующие назначения на сегодня
            </h2>
          </div>
          <button className="text-xs font-medium text-[#5ecece] hover:text-[#4bb8b8] flex items-center gap-1 transition-colors">
            Всё расписание
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-[#373E47]">
          {/* Appointment 1 */}
          <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#30363D]/50 transition-colors">
            <div className="w-14 h-14 rounded-lg bg-[#5ecece]/10 dark:bg-[#5ecece]/15 flex flex-col items-center justify-center shrink-0">
              <span className="text-lg font-bold text-[#5ecece] leading-none">15:30</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-0.5">
                Грязевые аппликации
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Грязелечебница, кабина №8
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-[#30363D] shrink-0">
              <MapPin className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                Корпус 1
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">Оплачено</span>
            </div>
          </div>

          {/* Appointment 2 */}
          <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#30363D]/50 transition-colors">
            <div className="w-14 h-14 rounded-lg bg-[#5ecece]/10 dark:bg-[#5ecece]/15 flex flex-col items-center justify-center shrink-0">
              <span className="text-lg font-bold text-[#5ecece] leading-none">17:00</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-0.5">
                Приём мануальной терапии
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Кабинет мануальной терапии, №4
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-[#30363D] shrink-0">
              <MapPin className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                Корпус 2
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">Ожидает</span>
            </div>
          </div>

          {/* Appointment 3 */}
          <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#30363D]/50 transition-colors">
            <div className="w-14 h-14 rounded-lg bg-[#5ecece]/10 dark:bg-[#5ecece]/15 flex flex-col items-center justify-center shrink-0">
              <span className="text-lg font-bold text-[#5ecece] leading-none">18:30</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-0.5">
                Питьевой бювет (минеральная вода)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Режим дня — приём минеральной воды
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-[#30363D] shrink-0">
              <MapPin className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                Холл
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-[#30363D] border border-gray-200 dark:border-[#373E47] shrink-0">
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Бесплатно</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
