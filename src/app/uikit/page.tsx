'use client'

import { useState } from 'react'
import {
  Search,
  ChevronDown,
  Bell,
  Download,
  Eye,
  UserPlus,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Filter,
  Star,
  Settings,
  Stethoscope,
  MoreHorizontal,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Reusable small helpers                                            */
/* ------------------------------------------------------------------ */

function DemoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-[#253041] bg-white dark:bg-[#151e2e] p-4 flex flex-col gap-3">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{title}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function UIKitReferencePage() {
  const [switchOn, setSwitchOn] = useState(true)
  const [toggleChecked, setToggleChecked] = useState(true)
  const [radio, setRadio] = useState('option1')
  const [segment, setSegment] = useState<'mine' | 'all' | 'pending'>('mine')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120]">
      {/* ── Header bar ── */}
      <header className="border-b border-gray-200 dark:border-[#253041] bg-white dark:bg-[#151e2e]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#5ecece]/15 flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-[#5ecece]" />
            </div>
            <div>
              <h1 className="text-sm font-serif font-bold text-gray-900 dark:text-gray-100">UI-Kit</h1>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">Санаторий «Буревестник» · МИС Альтера</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5ecece]/10 text-[#5ecece] font-medium">v 0.2</span>
        </div>
      </header>

      {/* ── Content grid ── */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* ───────── 1. Типографика ───────── */}
          <DemoCard title="Типографика">
            <div className="w-full flex flex-col gap-1">
              <p className="font-serif text-xl font-bold text-gray-900 dark:text-gray-100">Заголовок H1</p>
              <p className="font-serif text-base font-semibold text-gray-900 dark:text-gray-100">Заголовок H2</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Заголовок H3</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Основной текст — 14px, Geist Sans</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Вспомогательный текст — 12px</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">Микро-текст — 10px, label / caption</p>
              <p className="text-xs font-mono text-gray-500 dark:text-gray-400">Моноширинный — font-mono</p>
            </div>
          </DemoCard>

          {/* ───────── 2. Кнопки ───────── */}
          <DemoCard title="Кнопки">
            <button className="rounded-lg bg-[#5ecece] px-4 py-2 text-sm font-medium text-white hover:bg-[#4bb8b8] transition-colors">
              Основная
            </button>
            <button className="rounded-lg border border-[#5ecece] text-gray-900 dark:text-gray-100 px-4 py-2 text-sm font-medium hover:bg-[#5ecece]/10 transition-colors">
              Контурная
            </button>
            <button className="rounded-lg bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-[#253041] transition-colors">
              Вторичная
            </button>
            <button className="rounded-lg text-gray-500 dark:text-gray-400 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">
              Призрак
            </button>
            <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors">
              Опасная
            </button>
            <button className="rounded-lg bg-gray-200 dark:bg-[#253041] px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed" disabled>
              Disabled
            </button>
          </DemoCard>

          {/* ───────── 3. Кнопки с иконками ───────── */}
          <DemoCard title="Кнопки с иконками">
            <button className="flex items-center gap-2 rounded-lg bg-[#5ecece] px-4 py-2 text-sm font-medium text-white hover:bg-[#4bb8b8] transition-colors">
              <UserPlus className="w-4 h-4" /> Назначить
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-[#5ecece] text-gray-900 dark:text-gray-100 px-4 py-2 text-sm font-medium hover:bg-[#5ecece]/10 transition-colors">
              <Download className="w-4 h-4" /> Скачать
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-[#253041] transition-colors">
              <Eye className="w-4 h-4" /> Просмотр
            </button>
            <button className="p-2 rounded-lg border border-[#5ecece] text-gray-900 dark:text-gray-100 hover:bg-[#5ecece]/10 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
              <XCircle className="w-4 h-4" />
            </button>
          </DemoCard>

          {/* ───────── 4. Бейджи / Теги ───────── */}
          <DemoCard title="Бейджи и теги">
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
              Завершено
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
              В процессе
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
              Задолженность
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
              Частично
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400">
              Новое
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
              Специалист
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#5ecece]/15 text-[#5ecece]">
              PRO
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-[#253041] text-gray-500 dark:text-gray-400">
              MVP
            </span>
            {/* Notification dots */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5ecece] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#5ecece]" />
            </span>
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              3
            </span>
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#5ecece] px-1 text-[10px] font-semibold text-white">
              5
            </span>
          </DemoCard>

          {/* ───────── 5. Поля ввода ───────── */}
          <DemoCard title="Поля ввода">
            <div className="w-full flex flex-col gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по ФИО или палате..."
                  className="w-full rounded-lg border border-gray-200 dark:border-[#253041] bg-gray-50 dark:bg-[#0d1424] py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#5ecece] focus:ring-1 focus:ring-[#5ecece] transition-colors"
                />
              </div>
              <div className="relative">
                <select className="w-full appearance-none rounded-lg border border-gray-200 dark:border-[#253041] bg-gray-50 dark:bg-[#0d1424] py-2 pl-3 pr-8 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-[#5ecece] focus:ring-1 focus:ring-[#5ecece] transition-colors">
                  <option>Все специальности</option>
                  <option>Терапевт</option>
                  <option>Невролог</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <textarea
                placeholder="Комментарий..."
                rows={2}
                className="w-full rounded-lg border border-gray-200 dark:border-[#253041] bg-gray-50 dark:bg-[#0d1424] py-2 px-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#5ecece] focus:ring-1 focus:ring-[#5ecece] transition-colors resize-none"
              />
            </div>
          </DemoCard>

          {/* ───────── 6. Сегмент-контрол ───────── */}
          <DemoCard title="Сегмент-контрол">
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-[#253041] p-0.5 bg-gray-50 dark:bg-[#0d1424]">
              {([
                { key: 'mine' as const, label: 'Мои' },
                { key: 'all' as const, label: 'Все' },
                { key: 'pending' as const, label: 'К заполнению', badge: 3 },
              ]).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setSegment(item.key)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    segment === item.key
                      ? 'bg-[#5ecece] text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                      segment === item.key
                        ? 'bg-white/20 text-white'
                        : 'bg-[#5ecece]/15 text-[#5ecece]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {/* Role switcher variant */}
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-[#253041] p-0.5 bg-gray-50 dark:bg-[#0d1424]">
              {['Пациент', 'Врач', 'Админ'].map((role) => (
                <button
                  key={role}
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  {role}
                </button>
              ))}
            </div>
          </DemoCard>

          {/* ───────── 7. Переключатели ───────── */}
          <DemoCard title="Переключатели (Switch)">
            <div className="w-full flex flex-col gap-3">
              {[
                { label: 'Согласие пациента', state: switchOn, setter: setSwitchOn },
                { label: 'Email-уведомления', state: toggleChecked, setter: setToggleChecked },
              ].map((item) => (
                <label key={item.label} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                  <button
                    role="switch"
                    aria-checked={item.state}
                    onClick={() => item.setter(!item.state)}
                    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                      item.state ? 'bg-[#5ecece]' : 'bg-gray-300 dark:bg-[#253041]'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
                      item.state ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </label>
              ))}
              <label className="flex items-center justify-between cursor-not-allowed opacity-50">
                <span className="text-sm text-gray-500 dark:text-gray-400">Заблокировано</span>
                <button
                  role="switch"
                  aria-checked={false}
                  disabled
                  className="relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent bg-gray-300 dark:bg-[#253041]"
                >
                  <span className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 translate-x-0" />
                </button>
              </label>
            </div>
          </DemoCard>

          {/* ───────── 8. Радиокнопки ───────── */}
          <DemoCard title="Радиокнопки">
            <div className="w-full flex flex-col gap-2">
              {[
                { value: 'option1', label: 'Очередной приём' },
                { value: 'option2', label: 'Повторный приём' },
                { value: 'option3', label: 'Консультация' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                  <button
                    onClick={() => setRadio(opt.value)}
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      radio === opt.value
                        ? 'border-[#5ecece]'
                        : 'border-gray-300 dark:border-[#253041] group-hover:border-gray-400 dark:group-hover:border-gray-500'
                    }`}
                  >
                    {radio === opt.value && (
                      <span className="h-2 w-2 rounded-full bg-[#5ecece]" />
                    )}
                  </button>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                </label>
              ))}
            </div>
          </DemoCard>

          {/* ───────── 9. Чекбоксы ───────── */}
          <DemoCard title="Чекбоксы">
            <div className="w-full flex flex-col gap-2">
              {['Анализы крови', 'Анализы мочи', 'Флюорография'].map((item, i) => (
                <label key={item} className="flex items-center gap-2.5 cursor-pointer group">
                  <button
                    className={`h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      i === 0
                        ? 'border-[#5ecece] bg-[#5ecece]'
                        : i === 1
                          ? 'border-[#5ecece] bg-[#5ecece]'
                          : 'border-gray-300 dark:border-[#253041] group-hover:border-gray-400 dark:group-hover:border-gray-500'
                    }`}
                  >
                    {i < 2 && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </button>
                  <span className={`text-sm ${i < 2 ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>{item}</span>
                </label>
              ))}
            </div>
          </DemoCard>

          {/* ───────── 10. Алерты / Баннеры ───────── */}
          <DemoCard title="Алерты и баннеры">
            <div className="w-full flex flex-col gap-2">
              <div className="flex items-start gap-2.5 rounded-lg bg-sky-50 dark:bg-sky-900/10 border border-sky-200 dark:border-sky-800/30 px-3 py-2">
                <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <p className="text-xs text-sky-700 dark:text-sky-300">У пациента есть новые анализы</p>
              </div>
              <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 px-3 py-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300">Форма приёма заполнена не полностью</p>
              </div>
              <div className="flex items-start gap-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 px-3 py-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-700 dark:text-emerald-300">Назначения сохранены</p>
              </div>
              <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 px-3 py-2">
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 dark:text-red-300">Не удалось сохранить данные</p>
              </div>
            </div>
          </DemoCard>

          {/* ───────── 11. Прогресс-бар ───────── */}
          <DemoCard title="Прогресс и метрики">
            <div className="w-full flex flex-col gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Программа лечения</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">86%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-[#253041] overflow-hidden">
                  <div className="h-full rounded-full bg-[#5ecece]" style={{ width: '86%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Лаборатория</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">40%</span>
                </div>
                <div className="w-full h-1 rounded-full bg-gray-200 dark:bg-[#253041] overflow-hidden">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: '40%' }} />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Завершено
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse" /> Текущий
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-block h-2 w-2 rounded-full bg-sky-500" /> Ожидание
                </span>
              </div>
            </div>
          </DemoCard>

          {/* ───────── 12. Строка реестра ───────── */}
          <DemoCard title="Строка реестра">
            <div className="w-full">
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-[#253041] bg-gray-50/50 dark:bg-[#0d1424]/50 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors group">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5ecece]/15 text-xs font-semibold text-[#5ecece]">ПА</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">Петрова А.С.</span>
                    <span className="shrink-0 h-2 w-2 rounded-full bg-sky-500" title="Новые анализы" />
                    <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">Частично</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">M54.5 — Боль в пояснице · пал. 314</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <div className="w-16 h-1 rounded-full bg-gray-200 dark:bg-[#253041] overflow-hidden">
                    <div className="h-full rounded-full bg-[#5ecece]" style={{ width: '86%' }} />
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 w-6 text-right">86%</span>
                </div>
                <button className="shrink-0 rounded-md border border-[#5ecece] px-2.5 py-1 text-xs font-medium text-gray-900 dark:text-gray-100 hover:bg-[#5ecece]/10 transition-colors opacity-0 group-hover:opacity-100">
                  Открыть
                </button>
              </div>
            </div>
          </DemoCard>

          {/* ───────── 13. Строка расписания ───────── */}
          <DemoCard title="Строка расписания">
            <div className="w-full">
              <div className="flex items-center gap-3 rounded-lg bg-[#5ecece]/8 border border-[#5ecece]/20 px-3 py-2.5 mb-2">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <span className="shrink-0 w-20 text-xs font-mono text-gray-500 dark:text-gray-400">08:30–09:00</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">Козлов Дмитрий А.</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">Очередной приём</p>
                </div>
                <button className="shrink-0 rounded-lg bg-[#5ecece] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#4bb8b8] transition-colors">
                  Начать приём
                </button>
              </div>
              <div className="flex items-center gap-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1e293b] px-3 py-2">
                <span className="inline-block h-2 w-2 rounded-full bg-sky-500 shrink-0" />
                <span className="shrink-0 w-20 text-xs font-mono text-gray-500 dark:text-gray-400">09:30–10:00</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">Новиков Алексей В.</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">Очередной приём</p>
                </div>
                <button className="shrink-0 p-1 rounded-md text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#253041] transition-colors">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </DemoCard>

          {/* ───────── 14. Контекстное меню ───────── */}
          <DemoCard title="Контекстное меню">
            <div className="w-full flex justify-end">
              <div className="rounded-lg border border-gray-200 dark:border-[#253041] bg-white dark:bg-[#0d1424] shadow-lg py-1 w-44">
                {[
                  { icon: <Clock className="w-3.5 h-3.5" />, label: 'Перенести' },
                  { icon: <XCircle className="w-3.5 h-3.5" />, label: 'Отменить' },
                  { icon: <UserPlus className="w-3.5 h-3.5" />, label: 'Назначить на другого' },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors"
                  >
                    <span className="text-gray-400 dark:text-gray-500">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </DemoCard>

          {/* ───────── 15. Аватар ───────── */}
          <DemoCard title="Аватар и идентификация">
            <div className="w-full flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5ecece] text-sm font-bold text-white">ИИ</div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Иванов И.М.</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Терапевт · Корпус 2</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5ecece]/15 ring-2 ring-[#5ecece]/30 text-xs font-semibold text-[#5ecece]">ПА</div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400">КД</div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20 text-xs font-semibold text-amber-600 dark:text-amber-400">ВМ</div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/20 text-xs font-semibold text-sky-600 dark:text-sky-400">НА</div>
            </div>
          </DemoCard>

          {/* ───────── 16. Навигация ───────── */}
          <DemoCard title="Навигация">
            <div className="w-full flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 dark:text-gray-500">МИС Альтера</span>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <span className="text-gray-400 dark:text-gray-500">Пациенты</span>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <span className="text-[#5ecece] font-medium">Петрова А.С.</span>
              </div>
              <div className="flex items-center border-b border-gray-200 dark:border-[#253041] -mx-4 px-4">
                {[
                  { label: 'Рабочий стол', active: false },
                  { label: 'Реестр', active: true },
                  { label: 'Шедулер', active: false },
                ].map((tab) => (
                  <div
                    key={tab.label}
                    className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                      tab.active
                        ? 'border-[#5ecece] text-gray-900 dark:text-gray-100'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-[#253041] px-2.5 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">
                  <Filter className="w-3 h-3" /> Фильтр
                </button>
                <button className="flex items-center gap-1.5 rounded-md border border-[#5ecece] px-2.5 py-1 text-xs font-medium text-gray-900 dark:text-gray-100 hover:bg-[#5ecece]/10 transition-colors">
                  <Star className="w-3 h-3" /> Избранное
                </button>
              </div>
            </div>
          </DemoCard>

          {/* ───────── 17. Карточка виджета ───────── */}
          <DemoCard title="Карточка виджета">
            <div className="w-full rounded-lg border border-gray-200 dark:border-[#253041] bg-gray-50/50 dark:bg-[#0d1424]/50 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#5ecece]" />
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Мой день</span>
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">7 августа 2026</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>7 приёмов · 2 завершено</span>
              </div>
            </div>
          </DemoCard>

          {/* ───────── 18. Цветовая палитра ───────── */}
          <DemoCard title="Цветовая палитра">
            <div className="w-full grid grid-cols-5 gap-2">
              {[
                { color: '#5ecece', name: 'Тиффани' },
                { color: '#4bb8b8', name: 'Тёмный' },
                { color: '#0b1120', name: 'Фон' },
                { color: '#151e2e', name: 'Карточка' },
                { color: '#253041', name: 'Бордер' },
                { color: '#1e293b', name: 'Хедер' },
                { color: '#10b981', name: 'Успех' },
                { color: '#f59e0b', name: 'Внимание' },
                { color: '#ef4444', name: 'Ошибка' },
                { color: '#3b82f6', name: 'Инфо' },
              ].map((swatch) => (
                <div key={swatch.color} className="flex flex-col items-center gap-1">
                  <div
                    className="w-full aspect-square rounded-lg border border-gray-200 dark:border-[#253041]"
                    style={{ backgroundColor: swatch.color }}
                  />
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 text-center leading-tight">{swatch.name}</span>
                </div>
              ))}
            </div>
          </DemoCard>

        </div>

        {/* ── Footer ── */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-[#253041] flex items-center justify-between">
          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            МИС Альтера · UI-Kit · Санаторий «Буревестник»
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            Акцент: <span className="font-mono">#5ecece</span> · Тёмная тема: <span className="font-mono">#0b1120</span>
          </p>
        </div>
      </div>
    </div>
  )
}
