'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Printer,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Coins,
  ChevronDown,
  X,
  Shield,
  Clock,
  Send,
} from 'lucide-react'

const epicrisisPreviewStandard = `ЭПИКРИЗ № 1247/2026
Санаторий «Сочи УДП РФ»

Пациент: Петрова Анна Сергеевна, 45 лет
Заезд: 10.07.2026 | Выписка: 31.07.2026
Лечащий врач: Иванов И.М.

Основной диагноз: M54.5 — Боль в пояснице
Сопутствующий: M79.3 — Панникулит правого предплечья

Жалобы при поступлении: Ноющая боль в поясничной области, усиливающаяся после физической нагрузки. Длительность — более 2 лет.

Проведённое лечение:
- Грязевые аппликации на поясницу — 8/10 процедур
- Подводный душ-массаж — 8/8 процедур
- Лечебный массаж — 4/5 процедур
- Нимесулид 100мг — курс 18/21 дней
- Консультация невролога — 1/1

Рекомендации: Продолжить амбулаторное лечение. Повторный курс санаторно-курортного лечения через 6 месяцев.`

const epicrisisPreviewExtended = `ЭПИКРИЗ № 1247/2026
Санаторий «Сочи УДП РФ»

Пациент: Петрова Анна Сергеевна, 45 лет
Заезд: 10.07.2026 | Выписка: 31.07.2026
Лечащий врач: Иванов И.М.

Основной диагноз: M54.5 — Боль в пояснице
Сопутствующий: M79.3 — Панникулит правого предплечья

Жалобы при поступлении: Ноющая боль в поясничной области, усиливающаяся после физической нагрузки. Длительность — более 2 лет.

Данные объективного осмотра:
Поясничный отдел: болезненность паравертебральных точек L4-L5, ограничение сгибания до 70°. Симптомы натяжения отрицательные. Неврологический статус: чувствительность сохранена, рефлексы D=S.

Лабораторные данные:
- ОАК (15.07.2026): Hb 128 г/л, Лейк. 6.2×10⁹/л, СОЭ 12 мм/ч
- Биохимия (16.07.2026): С-РБ 4.2 мг/л, АСТ 24 Ед/л, АЛТ 28 Ед/л
- Мочевая кислота: 280 мкмоль/л

Проведённое лечение:
- Грязевые аппликации на поясницу — 8/10 процедур
- Подводный душ-массаж — 8/8 процедур
- Лечебный массаж — 4/5 процедур
- Нимесулид 100мг — курс 18/21 дней
- Консультация невролога — 1/1

Заключение консультанта (невролог, 20.07.2026):
Корешковых синдромов не выявлено. Рекомендовано продолжение консервативной терапии, ношение корсета при физической нагрузке.

Рекомендации: Продолжить амбулаторное лечение у невролога по месту жительства. Повторный курс санаторно-курортного лечения через 6 месяцев. Контроль ОАК через 1 месяц.`

const epicrisisPreviewMinimal = `ЭПИКРИЗ № 1247/2026
Санаторий «Сочи УДП РФ»

Пациент: Петрова Анна Сергеевна, 45 лет
Диагноз: M54.5 — Боль в пояснице

Рекомендации: Продолжить амбулаторное лечение. Повторный курс санаторно-курортного лечения через 6 месяцев.`

const templateOptions = [
  { value: 'standard', label: 'Стандартный' },
  { value: 'extended', label: 'Расширенный' },
  { value: 'minimal', label: 'Минимальный' },
]

interface TreatmentRow {
  name: string
  planned: string
  completed: string
  cost: string
  status: 'completed' | 'partial'
}

const treatmentData: TreatmentRow[] = [
  { name: 'Грязевые аппликации', planned: '10', completed: '8', cost: '1 200 ₽/шт', status: 'partial' },
  { name: 'Подводный душ-массаж', planned: '8', completed: '8', cost: '900 ₽/шт', status: 'completed' },
  { name: 'Лечебный массаж', planned: '5', completed: '4', cost: '1 500 ₽/шт', status: 'partial' },
  { name: 'Нимесулид 100мг', planned: '21 дн', completed: '18 дн', cost: '350 ₽', status: 'completed' },
  { name: 'Консультация невролога', planned: '1', completed: '1', cost: '800 ₽', status: 'completed' },
]

export function DischargeEpicrisis() {
  const [selectedTemplate, setSelectedTemplate] = useState('standard')
  const [hasDebt, setHasDebt] = useState(true)
  const [showDischargeModal, setShowDischargeModal] = useState(false)
  const [dischargeConfirmed, setDischargeConfirmed] = useState(false)
  const [dischargeReason, setDischargeReason] = useState('')
  const [showPdfPreview, setShowPdfPreview] = useState(true)

  const epicrisisText =
    selectedTemplate === 'standard'
      ? epicrisisPreviewStandard
      : selectedTemplate === 'extended'
        ? epicrisisPreviewExtended
        : epicrisisPreviewMinimal

  const totalPlanned = 10 + 8 + 5 + 21 + 1
  const totalCompleted = 8 + 8 + 4 + 18 + 1
  const totalRemaining = totalPlanned - totalCompleted

  const canConfirmDischarge = dischargeConfirmed && dischargeReason.trim().length > 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#161B22] pb-8">
      {/* Page Header */}
      <header className="bg-white dark:bg-[#21262D] border-b border-gray-200 dark:border-[#373E47]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <button
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#5ecece] dark:hover:text-[#5ecece] transition-colors mb-4"
              type="button"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Назад к карте пациента</span>
            </button>

            <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
              Выписка пациента
            </h1>

            <div className="flex items-center gap-3 mt-3 p-3 bg-gray-50 dark:bg-[#30363D] rounded-lg">
              <div className="w-10 h-10 rounded-full bg-[#5ecece] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                ПА
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <span className="font-medium text-gray-900 dark:text-gray-100">Петрова Анна Сергеевна</span>
                {', 45 лет · Корпус 2, № 314 · Дней: 12 из 14 · Диагноз: M54.5'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Section 1 — Generate Epicrisis & Section 2 — Financial Status Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section 1 — Generate Epicrisis */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#21262D] rounded-xl border border-gray-200 dark:border-[#373E47] p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-[#5ecece]/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#5ecece]" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100">
                    Формирование эпикриза
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Выберите шаблон и сформируйте документ
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Шаблон эпикриза
                </label>
                <div className="relative">
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full bg-white dark:bg-[#1C2128] border border-gray-200 dark:border-[#373E47] rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5ecece]/30 focus:border-[#5ecece] transition-colors"
                  >
                    {templateOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Template descriptions */}
              <div className="mb-5 p-3 bg-gray-50 dark:bg-[#30363D] rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedTemplate === 'standard' &&
                    'Краткий эпикриз с основными данными о лечении, диагнозе и рекомендациях'}
                  {selectedTemplate === 'extended' &&
                    'Полный эпикриз со всеми процедурами, результатами анализов и заключениями консультантов'}
                  {selectedTemplate === 'minimal' &&
                    'Минимальный эпикриз: только диагноз и рекомендации'}
                </p>
              </div>

              {/* Preview area */}
              {showPdfPreview && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Предпросмотр
                    </span>
                    <button
                      onClick={() => setShowPdfPreview(false)}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                      type="button"
                    >
                      Свернуть
                    </button>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#1C2128] border border-gray-200 dark:border-[#373E47] rounded-lg p-4 max-h-80 overflow-y-auto">
                    <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                      {epicrisisText}
                    </pre>
                  </div>
                </div>
              )}

              {!showPdfPreview && (
                <button
                  onClick={() => setShowPdfPreview(true)}
                  className="mb-5 text-sm text-[#5ecece] hover:text-[#4bb8b8] dark:hover:text-[#5ecece] transition-colors"
                  type="button"
                >
                  Показать предпросмотр
                </button>
              )}

              {/* Generate button */}
              <button
                className="inline-flex items-center gap-2.5 bg-[#5ecece] hover:bg-[#4bb8b8] text-white px-6 py-3 rounded-lg font-medium text-sm transition-colors shadow-sm"
                type="button"
              >
                <Printer className="w-4 h-4" />
                Сформировать и распечатать эпикриз
              </button>
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                PDF будет сгенерирован и открыт для печати
              </p>
            </div>
          </div>

          {/* Section 2 — Financial Status Widget */}
          <div className="lg:col-span-1">
            {hasDebt ? (
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                      Задолженность обнаружена
                    </h3>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-amber-700 dark:text-amber-300">3 400 ₽</span>
                </div>

                <p className="text-sm text-amber-800 dark:text-amber-200/80 mb-4 leading-relaxed">
                  У пациента имеется задолженность по платным услугам на сумму 3 400 руб. Рекомендуется предупредить пациента перед выпиской.
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <Coins className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-amber-800 dark:text-amber-200/70">
                      Грязевые аппликации × 2 — 2 400 ₽
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Coins className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-amber-800 dark:text-amber-200/70">
                      Лечебный массаж × 1 — 1 000 ₽
                    </span>
                  </div>
                </div>

                <button
                  className="inline-flex items-center gap-2 border border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center"
                  type="button"
                >
                  <Send className="w-4 h-4" />
                  Отправить напоминание пациенту
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                      Финансовый статус
                    </h3>
                  </div>
                </div>

                <p className="text-base font-semibold text-emerald-800 dark:text-emerald-200 mb-1">
                  Финансовых задолженностей нет
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-300/70">
                  Все платные услуги оплачены
                </p>
              </div>
            )}

            {/* Toggle link for demo */}
            <button
              onClick={() => setHasDebt(!hasDebt)}
              className="mt-3 block mx-auto text-xs text-gray-400 dark:text-gray-500 hover:text-[#5ecece] dark:hover:text-[#5ecece] transition-colors underline underline-offset-2"
              type="button"
            >
              Показать/скрыть долг
            </button>
          </div>
        </div>

        {/* Section 3 — Discharge Summary Table */}
        <section>
          <div className="bg-white dark:bg-[#21262D] rounded-xl border border-gray-200 dark:border-[#373E47] overflow-hidden">
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#5ecece]/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#5ecece]" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100">
                    Итоги лечения
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Статус выполнения назначений
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#30363D]">
                    <th className="text-left px-6 py-3 font-medium text-gray-600 dark:text-gray-300">
                      Назначение
                    </th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                      Кол-во
                    </th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                      Выполнено
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                      Стоимость
                    </th>
                    <th className="text-center px-6 py-3 font-medium text-gray-600 dark:text-gray-300">
                      Статус
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#373E47]">
                  {treatmentData.map((row, index) => (
                    <tr
                      key={index}
                      className="bg-white dark:bg-[#21262D] hover:bg-gray-50 dark:hover:bg-[#1a2536] transition-colors"
                    >
                      <td className="px-6 py-3.5 text-gray-900 dark:text-gray-100 font-medium">
                        {row.name}
                      </td>
                      <td className="px-4 py-3.5 text-center text-gray-600 dark:text-gray-300">
                        {row.planned}
                      </td>
                      <td className="px-4 py-3.5 text-center text-gray-600 dark:text-gray-300">
                        {row.completed}
                      </td>
                      <td className="px-4 py-3.5 text-right text-gray-600 dark:text-gray-300">
                        {row.cost}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        {row.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Выполнено
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/30">
                            <AlertTriangle className="w-3 h-3" />
                            Частично
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 dark:bg-[#30363D]">
                    <td
                      colSpan={5}
                      className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300 font-medium"
                    >
                      Итого назначено: {totalPlanned} | Выполнено: {totalCompleted} | Остаток:{' '}
                      {totalRemaining}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* Section 4 — Forced Discharge */}
        <section>
          <div className="bg-white dark:bg-[#21262D] rounded-xl border border-red-200 dark:border-red-900/30 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-red-500 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-base font-serif font-bold text-gray-900 dark:text-gray-100">
                    Принудительная выписка
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Прервать текущий курс лечения и выписать пациента
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDischargeModal(true)}
                className="inline-flex items-center gap-2 border border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
                type="button"
              >
                <AlertTriangle className="w-4 h-4" />
                Принудительная выписка
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Modal — Forced Discharge */}
      {showDischargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowDischargeModal(false)
              setDischargeConfirmed(false)
              setDischargeReason('')
            }}
          />

          {/* Modal card */}
          <div className="relative bg-white dark:bg-[#21262D] rounded-2xl border border-gray-200 dark:border-[#373E47] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100">
                    Принудительная выписка пациента
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowDischargeModal(false)
                    setDischargeConfirmed(false)
                    setDischargeReason('')
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#30363D] transition-colors"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Warning text */}
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-4 mb-5">
                <p className="text-sm text-red-800 dark:text-red-200/80 leading-relaxed">
                  Данное действие прервёт текущий курс лечения пациента. Все невыполненные назначения будут отмечены как отменённые.
                </p>
              </div>

              {/* Checkbox */}
              <label className="flex items-start gap-3 mb-5 cursor-pointer group">
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={dischargeConfirmed}
                    onChange={(e) => setDischargeConfirmed(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-[#373E47] text-red-600 focus:ring-red-500/20 dark:bg-[#1C2128] cursor-pointer accent-red-600"
                  />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Я подтверждаю ответственность за досрочное прекращение лечения
                </span>
              </label>

              {/* Reason textarea */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Причина ручного обхода{' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={dischargeReason}
                  onChange={(e) => setDischargeReason(e.target.value)}
                  rows={3}
                  placeholder="Укажите причину принудительной выписки..."
                  className="w-full bg-white dark:bg-[#1C2128] border border-gray-200 dark:border-[#373E47] rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors resize-none"
                />
              </div>

              {/* Preview of what will happen */}
              <div className="bg-gray-50 dark:bg-[#30363D] rounded-lg p-3 mb-6">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Будет создана задача для администратора о досрочной выписке
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDischargeModal(false)
                    setDischargeConfirmed(false)
                    setDischargeReason('')
                  }}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#30363D] hover:bg-gray-200 dark:hover:bg-[#373E47] transition-colors"
                  type="button"
                >
                  Отмена
                </button>
                <button
                  disabled={!canConfirmDischarge}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    canConfirmDischarge
                      ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                      : 'bg-red-600/50 text-white/50 cursor-not-allowed'
                  }`}
                  type="button"
                >
                  Подтвердить выписку
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
