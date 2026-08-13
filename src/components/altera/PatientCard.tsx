'use client'

import { useState } from 'react'
import {
  ArrowLeft, Paperclip, Stethoscope, Activity, FlaskConical, ClipboardList,
  X, Download, Eye, Calendar, Clock, CheckCircle2, Search,
  FileText, FileSpreadsheet, Image as ImageIcon, FileVideo, LayoutGrid, List,
  AlertTriangle, AlertCircle, ScanLine, HeartPulse, Monitor,
  Plus, Pill, Syringe, Thermometer, Droplets, Scale, BedDouble,
  UserRound, ClipboardCheck, FileSignature, ChevronRight,
  Pencil, Trash2, ShieldAlert, AlertOctagon, Ban, Check,
} from 'lucide-react'
import { TreatmentPlan } from '@/components/altera/TreatmentPlan'
import { DischargeEpicrisis } from '@/components/altera/DischargeEpicrisis'

// ═══════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════

export interface PatientCardProps {
  patient?: {
    id: number
    name: string
    shortName: string
    initials: string
    room: string
    hasNewAnalyses: boolean
  }
  onBack?: () => void
}

type MainTab = 'visit' | 'results' | 'prescriptions' | 'discharge'
type DocAttachment = { name: string; type: 'pdf' | 'xlsx' | 'image' | 'video' }

// ═══════════════════════════════════════════════════════════════════════
// Mock Data — keyed by patient features, uses the first patient as default
// ═══════════════════════════════════════════════════════════════════════

const patientData = {
  name: 'Козлов Виктор Сергеевич',
  age: 54,
  room: '312',
  checkIn: '10.07.2026',
  checkOut: '31.07.2026',
  daysElapsed: 17,
  daysTotal: 21,
  diagnosis: 'M54.5 — Боль в пояснице',
  diagnosisFull: 'M54.5 — Люмбагия. Дегенеративно-дистрофические изменения поясничного отдела позвоночника. Умеренный болевой синдром.',
  status: 'Лечится' as const,
  doctor: 'Иванов И.М.',
}

const vitals = [
  { label: 'АД', value: '130/85', unit: 'мм рт.ст.', status: 'warning' as const, icon: HeartPulse },
  { label: 'Температура', value: '36.8', unit: '°C', status: 'normal' as const, icon: Thermometer },
  { label: 'СпО2', value: '97', unit: '%', status: 'normal' as const, icon: Droplets },
  { label: 'Пульс', value: '78', unit: 'уд/мин', status: 'normal' as const, icon: Activity },
  { label: 'Вес', value: '82', unit: 'кг', status: 'normal' as const, icon: Scale },
]

const todayEvents = [
  { time: '08:00', type: 'procedure' as const, label: 'Грязевые аппликации на поясницу', location: 'Процедурный кабинет №2' },
  { time: '09:30', type: 'lab' as const, label: 'Контроль ОАК, глюкоза крови', location: 'Лаборатория' },
  { time: '11:00', type: 'visit' as const, label: 'Осмотр терапевта', location: 'Кабинет №315' },
  { time: '14:00', type: 'procedure' as const, label: 'Подводный душ-массаж', location: 'Водолечебница' },
  { time: '16:00', type: 'procedure' as const, label: 'Электростимуляция поясницы', location: 'Физиотерапия' },
]

const labResults = [
  { group: 'Биохимия', items: [
    { name: 'Глюкоза', value: '6.8 ммоль/л', norm: '4.1–5.9', status: 'abnormal' as const },
    { name: 'Холестерин общий', value: '5.4 ммоль/л', norm: '< 5.2', status: 'warning' as const },
    { name: 'АЛТ', value: '28 Ед/л', norm: '7–40', status: 'normal' as const },
    { name: 'АСТ', value: '22 Ед/л', norm: '7–40', status: 'normal' as const },
    { name: 'Креатинин', value: '88 мкмоль/л', norm: '44–97', status: 'normal' as const },
    { name: 'Мочевина', value: '5.2 ммоль/л', norm: '2.5–6.4', status: 'normal' as const },
  ]},
  { group: 'Гематология', items: [
    { name: 'Гемоглобин (Hb)', value: '128 г/л', norm: '120–140', status: 'normal' as const },
    { name: 'Лейкоциты (WBC)', value: '5.8 × 10⁹/л', norm: '4.0–9.0', status: 'normal' as const },
    { name: 'СОЭ', value: '12 мм/ч', norm: '2–15', status: 'normal' as const },
    { name: 'Тромбоциты', value: '245 × 10⁹/л', norm: '150–400', status: 'normal' as const },
  ]},
  { group: 'ЭКГ', items: [
    { name: 'Ритм', value: 'Синусовый', norm: 'Синусовый', status: 'normal' as const },
    { name: 'ЧСС', value: '72 уд/мин', norm: '60–100', status: 'normal' as const },
  ]},
  { group: 'УЗИ', items: [
    { name: 'УЗИ брюшной полости', value: 'Без патологий', norm: '—', status: 'normal' as const },
    { name: 'ЭхоКГ', value: 'Ожидается', norm: '—', status: 'warning' as const },
  ]},
]

const prescriptions = [
  { id: 1, name: 'Грязевые аппликации', type: 'procedure' as const, schedule: 'Ежедневно', days: '10/15', status: 'active' as const },
  { id: 2, name: 'Подводный душ-массаж', type: 'procedure' as const, schedule: 'Пн, Ср, Пт', days: '7/12', status: 'active' as const },
  { id: 3, name: 'Электростимуляция', type: 'procedure' as const, schedule: 'Пн, Ср, Пт', days: '4/10', status: 'active' as const },
  { id: 4, name: 'Нимесан 100мг', type: 'medication' as const, schedule: '2 раза в день', days: '—', status: 'active' as const },
  { id: 5, name: 'Мильгамма', type: 'medication' as const, schedule: '1 раз в день (в/м)', days: '5/10', status: 'active' as const },
  { id: 6, name: 'L-карнитин', type: 'medication' as const, schedule: '1 раз в день', days: '—', status: 'active' as const },
  { id: 7, name: 'Рентген поясницы', type: 'analysis' as const, schedule: 'Выполнено 24.07', days: '✓', status: 'completed' as const },
]

const procedureCatalog = [
  { id: 1, name: 'Грязевые аппликации', category: 'Бальнеология', duration: '20 мин', isPaid: false, price: null },
  { id: 2, name: 'Подводный душ-массаж', category: 'Гидротерапия', duration: '15 мин', isPaid: false, price: null },
  { id: 3, name: 'Электростимуляция', category: 'Физиотерапия', duration: '15 мин', isPaid: false, price: null },
  { id: 4, name: 'Магнитотерапия', category: 'Физиотерапия', duration: '20 мин', isPaid: false, price: null },
  { id: 5, name: 'УВТ поясницы', category: 'Физиотерапия', duration: '10 мин', isPaid: true, price: '2 500 ₽' },
  { id: 6, name: 'Инфракрасная сауна', category: 'Термолечение', duration: '30 мин', isPaid: true, price: '1 800 ₽' },
  { id: 7, name: 'Озонотерапия', category: 'Инъекции', duration: '15 мин', isPaid: true, price: '3 200 ₽' },
  { id: 8, name: 'Лазеротерапия поясницы', category: 'Физиотерапия', duration: '15 мин', isPaid: true, price: '1 500 ₽' },
  { id: 9, name: 'Криотерапия', category: 'Физиотерапия', duration: '10 мин', isPaid: false, price: null },
]

// Compatibility matrix: procedure id → list of incompatible procedure ids
const compatibilityRules: Record<number, { incompatibleWith: number[]; warning?: string }> = {
  5: { incompatibleWith: [3], warning: 'УВТ и электростимуляция на одну область несовместимы' },
  3: { incompatibleWith: [5], warning: 'Электростимуляция и УВТ на одну область несовместимы' },
  6: { incompatibleWith: [4], warning: 'Инфракрасная сауна и магнитотерапия в один день не рекомендованы' },
  4: { incompatibleWith: [6], warning: 'Магнитотерапия и инфракрасная сауна в один день не рекомендованы' },
  7: { incompatibleWith: [9], warning: 'Озонотерапия и криотерапия — пересекающиеся эффекты' },
  9: { incompatibleWith: [7], warning: 'Криотерапия и озонотерапия — пересекающиеся эффекты' },
}

// ═══════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════

const mainTabs: { key: MainTab; label: string; icon: typeof Stethoscope }[] = [
  { key: 'visit', label: 'Форма приёма', icon: Stethoscope },
  { key: 'results', label: 'Результаты', icon: FlaskConical },
  { key: 'prescriptions', label: 'Назначения', icon: ClipboardList },
  { key: 'discharge', label: 'Выписка', icon: FileSignature },
]

// ═══════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════

function StatusDot({ status }: { status: 'normal' | 'abnormal' | 'warning' }) {
  const colors = {
    normal: 'bg-green',
    abnormal: 'bg-red',
    warning: 'bg-amber',
  }
  return <span className={`w-2 h-2 rounded-full ${colors[status]}`} />
}

function StatusBadge({ status }: { status: 'normal' | 'abnormal' | 'warning' }) {
  if (status === 'normal') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="w-3 h-3" /> В норме
      </span>
    )
  }
  if (status === 'abnormal') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
        <AlertCircle className="w-3 h-3" /> Отклонение
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
      <AlertTriangle className="w-3 h-3" /> Внимание
    </span>
  )
}

function getEventIcon(type: string) {
  switch (type) {
    case 'visit': return <Stethoscope className="w-3.5 h-3.5" />
    case 'procedure': return <Activity className="w-3.5 h-3.5" />
    case 'lab': return <FlaskConical className="w-3.5 h-3.5" />
    default: return <Clock className="w-3.5 h-3.5" />
  }
}

function getEventBg(type: string) {
  switch (type) {
    case 'visit': return 'bg-accent-tiffany/10 text-accent-tiffany'
    case 'procedure': return 'bg-purple/10 text-purple'
    case 'lab': return 'bg-amber/10 text-amber'
    default: return 'bg-gray-100 dark:bg-dark-surface text-gray-500'
  }
}

function getRxTypeIcon(type: string) {
  switch (type) {
    case 'procedure': return <Syringe className="w-4 h-4" />
    case 'medication': return <Pill className="w-4 h-4" />
    case 'analysis': return <FlaskConical className="w-4 h-4" />
    default: return <ClipboardList className="w-4 h-4" />
  }
}

function getDocTypeBg(type: string) {
  switch (type) {
    case 'pdf': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    case 'xlsx': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
    case 'image': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    case 'video': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
  }
}

function getDocTypeIcon(type: string) {
  switch (type) {
    case 'pdf': return <FileText className="w-6 h-6" />
    case 'xlsx': return <FileSpreadsheet className="w-6 h-6" />
    case 'image': return <ImageIcon className="w-6 h-6" />
    case 'video': return <FileVideo className="w-6 h-6" />
    default: return <FileText className="w-6 h-6" />
  }
}

// ═══════════════════════════════════════════════════════════════════════
// Sub-components: Modals
// ═══════════════════════════════════════════════════════════════════════

function ProcedureModal({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<number | null>(null)
  const filtered = procedureCatalog.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-border-subtle w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border-subtle flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Назначить процедуру</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Выберите процедуру из каталога</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="Поиск процедуры..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2">
          {filtered.map(proc => (
            <button
              key={proc.id}
              onClick={() => setSelected(selected === proc.id ? null : proc.id)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                selected === proc.id
                  ? 'border-accent-tiffany bg-accent-tiffany/5 dark:bg-accent-tiffany/10'
                  : 'border-gray-200 dark:border-dark-border-subtle hover:border-accent-tiffany/30 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getEventBg('procedure')}`}>
                    <Syringe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{proc.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{proc.category} · {proc.duration}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {proc.isPaid && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">
                      Платно: {proc.price}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-border-subtle flex items-center justify-between shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-dark-border-subtle text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
            Отмена
          </button>
          <button
            disabled={selected === null}
            onClick={onClose}
            className={`px-5 py-2.5 text-sm font-medium rounded-xl btn-enamel text-white transition-all ${
              selected !== null ? 'bg-accent-tiffany hover:bg-accent-tiffany-dark cursor-pointer' : 'bg-gray-300 dark:bg-dark-surface text-gray-500 cursor-not-allowed'
            }`}
          >
            Назначить
          </button>
        </div>
      </div>
    </div>
  )
}

function DischargeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-border-subtle w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border-subtle flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Выписка пациента</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Подтверждение выписки</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                После подписания эпикриза пациент будет выписан. Убедитесь, что все назначения завершены.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Тип выписки</label>
            <select className="w-full rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-card px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany">
              <option>Улучшение</option>
              <option>Без изменений</option>
              <option>Ухудшение</option>
              <option>По желанию пациента</option>
            </select>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-border-subtle flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-dark-border-subtle text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
            Отмена
          </button>
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium rounded-xl btn-enamel bg-accent-tiffany text-white hover:bg-accent-tiffany-dark transition-colors">
            Подписать и закрыть
          </button>
        </div>
      </div>
    </div>
  )
}

function AttachmentLightbox({ doc, onClose }: { doc: DocAttachment; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card rounded-xl shadow-2xl border border-gray-200 dark:border-dark-border-subtle w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pr-4">{doc.name}</h3>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className={`w-full h-48 rounded-lg flex flex-col items-center justify-center gap-3 mb-4 ${getDocTypeBg(doc.type)}`}>
          <span className="opacity-60">{getDocTypeIcon(doc.type)}</span>
          <span className="text-xs uppercase tracking-wider font-medium opacity-60">
            {doc.type === 'xlsx' ? 'Таблица' : doc.type === 'pdf' ? 'PDF-документ' : doc.type === 'image' ? 'Изображение' : 'Видео'}
          </span>
        </div>
        <div className="flex items-center gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl border border-accent-tiffany text-gray-900 dark:text-gray-100 hover:bg-accent-tiffany/10 transition-colors">
            Закрыть
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-xl btn-enamel bg-accent-tiffany text-white hover:bg-accent-tiffany-dark transition-colors">
            <span className="inline-flex items-center gap-2"><Download className="w-4 h-4" />Скачать</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// LEFT PANEL
// ═══════════════════════════════════════════════════════════════════════

function LeftPanel({
  onOpenProcedure,
  onOpenDischarge,
  onGoToPrescriptions,
  patientStatus,
}: {
  onOpenProcedure: () => void
  onOpenDischarge: () => void
  onGoToPrescriptions: () => void
  patientStatus: string
}) {
  const p = patientData
  const initials = p.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <aside className="w-[300px] shrink-0 border-r border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-card overflow-y-auto">
      {/* Back button */}
      <div className="px-4 pt-4 pb-2">
        {/* empty space — back button is in the parent header */}
      </div>

      {/* Avatar + FIO + meta */}
      <div className="px-5 pb-4 text-center">
        <div className="w-16 h-16 rounded-full bg-accent-tiffany/10 dark:bg-accent-tiffany/20 flex items-center justify-center mx-auto border-2 border-accent-tiffany/20">
          <span className="text-lg font-semibold text-accent-tiffany">{initials}</span>
        </div>
        <h2 className="mt-3 text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight">{p.name}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {p.age} лет · <span className="inline-flex items-center gap-1"><BedDouble className="w-3 h-3" /> палата {p.room}</span>
        </p>
        <div className="flex items-center justify-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{p.checkIn}</span>
          <span className="text-gray-300 dark:text-dark-border">→</span>
          <span>{p.checkOut}</span>
        </div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-dark-border overflow-hidden">
            <div className="h-full rounded-full bg-accent-tiffany transition-all" style={{ width: `${(p.daysElapsed / p.daysTotal) * 100}%` }} />
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 shrink-0">{p.daysElapsed}/{p.daysTotal} дн.</span>
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium mt-2 ${
          patientStatus === 'Выписан'
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30'
            : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30'
        }`}>
          {patientStatus}
        </span>
      </div>

      {/* Diagnosis */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-dark-border">
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Диагноз</h4>
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{p.diagnosisFull}</p>
      </div>

      {/* Vitals */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-dark-border">
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2.5">Ключевые показатели</h4>
        <div className="space-y-2">
          {vitals.map(v => (
            <div key={v.label} className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                v.status === 'normal' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
                v.status === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
              }`}>
                <v.icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{v.label}</span>
                  <StatusDot status={v.status} />
                </div>
                <span className={`text-sm font-semibold ${
                  v.status === 'normal' ? 'text-gray-900 dark:text-gray-100' :
                  v.status === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {v.value} <span className="text-xs font-normal text-gray-400">{v.unit}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">Последний осмотр: 27.07.2026, 10:30</p>
      </div>

      {/* Today Events */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-dark-border">
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2.5">Ближайшие мероприятия</h4>
        <div className="space-y-2">
          {todayEvents.map((ev, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${getEventBg(ev.type)}`}>
                {getEventIcon(ev.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-accent-tiffany">{ev.time}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300 truncate">{ev.label}</span>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{ev.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-5 py-4 border-t border-gray-100 dark:border-dark-border space-y-2 sticky bottom-0 bg-white dark:bg-dark-card">
        <button
          onClick={onOpenProcedure}
          className="w-full px-4 py-2.5 text-sm font-medium rounded-xl btn-enamel bg-accent-tiffany text-white hover:bg-accent-tiffany-dark transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Назначить процедуру
        </button>
        <button
          onClick={onGoToPrescriptions}
          className="w-full px-4 py-2 text-sm font-medium rounded-xl border border-accent-tiffany text-gray-900 dark:text-gray-100 hover:bg-accent-tiffany/10 transition-colors flex items-center justify-center gap-2"
        >
          <ClipboardCheck className="w-4 h-4" /> План лечения
        </button>
        <button
          onClick={onOpenDischarge}
          className="w-full px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-dark-border-subtle text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red/30 hover:text-red dark:hover:text-red-400 transition-colors flex items-center justify-center gap-2"
        >
          <FileSignature className="w-4 h-4" /> Выписать
        </button>
      </div>
    </aside>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// RIGHT PANEL — TABS
// ═══════════════════════════════════════════════════════════════════════

function TabVisit({ setActiveTab }: { setActiveTab: (t: MainTab) => void }) {
  const [visitData, setVisitData] = useState({ complaints: '', examination: '', conclusion: '', fillLater: false })

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-base font-semibold text-gray-900 dark:text-gray-100">Осмотр пациента</h2>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <span className="text-sm text-gray-500 dark:text-gray-400">Заполнить позднее</span>
          <button
            role="switch" aria-checked={visitData.fillLater}
            onClick={() => setVisitData(d => ({ ...d, fillLater: !d.fillLater }))}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
              visitData.fillLater ? 'bg-amber-500' : 'bg-gray-300 dark:bg-dark-border-subtle'
            }`}
          >
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              visitData.fillLater ? 'translate-x-4.5' : 'translate-x-0.5'
            }`} />
          </button>
        </label>
      </div>

      {visitData.fillLater && (
        <div className="mb-6 rounded-lg border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10 px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Отложенное заполнение</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Форма будет добавлена в список «К заполнению».</p>
          </div>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Жалобы пациента</label>
          <textarea
            value={visitData.complaints} onChange={e => setVisitData(d => ({ ...d, complaints: e.target.value }))}
            placeholder="Опишите текущие жалобы…" rows={3}
            className="w-full rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-surface px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Объективный статус</label>
          <textarea
            value={visitData.examination} onChange={e => setVisitData(d => ({ ...d, examination: e.target.value }))}
            placeholder="Кожные покровы, ЧДД, АД, пульс…" rows={4}
            className="w-full rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-surface px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Клиническое заключение</label>
          <textarea
            value={visitData.conclusion} onChange={e => setVisitData(d => ({ ...d, conclusion: e.target.value }))}
            placeholder="Заключение по результатам осмотра…" rows={4}
            className="w-full rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-surface px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany resize-y"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-dark-border-subtle">
        <button
          onClick={() => setActiveTab('results')}
          className="px-5 py-2.5 text-sm font-medium rounded-xl btn-enamel bg-accent-tiffany text-white hover:bg-accent-tiffany-dark transition-colors"
        >
          {visitData.fillLater ? 'Сохранить и закрыть' : 'Сохранить осмотр'}
        </button>
        {!visitData.fillLater && (
          <button
            onClick={() => setActiveTab('prescriptions')}
            className="px-5 py-2.5 text-sm font-medium rounded-xl border border-accent-tiffany text-gray-900 dark:text-gray-100 hover:bg-accent-tiffany/10 transition-colors"
          >
            Сохранить и активировать назначения
          </button>
        )}
        <button className="px-5 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-dark-border-subtle text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
          Отмена
        </button>
      </div>
    </div>
  )
}

function TabResults({ onOpenLightbox }: { onOpenLightbox: (doc: DocAttachment) => void }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-base font-semibold text-gray-900 dark:text-gray-100">Результаты анализов</h2>
        <button className="px-4 py-2 text-sm font-medium rounded-xl btn-enamel bg-accent-tiffany text-white hover:bg-accent-tiffany-dark transition-colors inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Добавить результат
        </button>
      </div>

      {labResults.map(group => (
        <section key={group.group}>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-accent-tiffany" />
            {group.group}
          </h3>
          <div className="glass-card rounded-xl border border-gray-200 dark:border-dark-border-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-dark-border-subtle">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Показатель</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Значение</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Референс</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border/50">
                  {group.items.map((row, i) => (
                    <tr key={i} className={row.status === 'abnormal' ? 'bg-red-50/50 dark:bg-red-900/5' : row.status === 'warning' ? 'bg-amber-50/50 dark:bg-amber-900/5' : ''}>
                      <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{row.name}</td>
                      <td className={`px-4 py-2.5 font-mono text-sm whitespace-nowrap ${
                        row.status === 'abnormal' ? 'text-red-600 dark:text-red-400 font-semibold' :
                        row.status === 'warning' ? 'text-amber-600 dark:text-amber-400 font-medium' :
                        'text-gray-700 dark:text-gray-300'
                      }`}>{row.value}</td>
                      <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400 font-mono text-xs whitespace-nowrap">{row.norm}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ))}

      {/* Imaging section (compact) */}
      <section>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-accent-tiffany" />
          Инструментальные исследования
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {imagingResults.map(item => (
            <div key={item.id} className="glass-card rounded-xl border border-gray-200 dark:border-dark-border-subtle p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  item.status === 'completed'
                    ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                }`}>
                  {item.type === 'xray' ? <ScanLine className="w-4 h-4" /> : item.type === 'ultrasound' ? <Monitor className="w-4 h-4" /> : <HeartPulse className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</h4>
                    {item.status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <Clock className="w-4 h-4 text-amber-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.doctor} · {item.date}</p>
                  <p className={`text-sm mt-1.5 leading-relaxed ${item.status === 'pending' ? 'text-amber-600 dark:text-amber-400 italic' : 'text-gray-600 dark:text-gray-300'}`}>{item.result}</p>
                  {item.hasAttachment && (
                    <button onClick={() => onOpenLightbox({ name: `${item.name}.pdf`, type: 'pdf' })} className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-accent-tiffany hover:text-accent-tiffany-dark transition-colors">
                      <Paperclip className="w-3 h-3" /> Вложение
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const imagingResults = [
  { id: 1, type: 'xray' as const, name: 'Рентгенография поясничного отдела', date: '24.07.2026', doctor: 'Петров А.В.', result: 'Умеренные дегенеративные изменения L4-L5.', status: 'completed' as const, hasAttachment: true },
  { id: 2, type: 'ultrasound' as const, name: 'УЗИ органов брюшной полости', date: '22.07.2026', doctor: 'Ким Л.С.', result: 'Без патологий.', status: 'completed' as const, hasAttachment: true },
  { id: 3, type: 'ekg' as const, name: 'ЭКГ', date: '10.07.2026', doctor: 'Иванов И.М.', result: 'Синусовый ритм, ЧСС 72.', status: 'completed' as const, hasAttachment: true },
  { id: 4, type: 'ultrasound' as const, name: 'УЗИ сердца (ЭхоКГ)', date: '26.07.2026', doctor: 'Сидоров К.М.', result: 'Ожидается', status: 'pending' as const, hasAttachment: false },
]

function TabPrescriptions() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-base font-semibold text-gray-900 dark:text-gray-100">Назначения</h2>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-dark-surface rounded-xl">
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === 'list' ? 'bg-accent-tiffany/10 text-accent-tiffany' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              Список
            </button>
            <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-accent-tiffany/10 text-accent-tiffany' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              Календарь
            </button>
          </div>
          <button className="px-4 py-2 text-sm font-medium rounded-xl btn-enamel bg-accent-tiffany text-white hover:bg-accent-tiffany-dark transition-colors inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="glass-card rounded-xl border border-gray-200 dark:border-dark-border-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-border-subtle">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Назначение</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Тип</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">График</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Прогресс</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border/50">
                {prescriptions.map(rx => (
                  <tr key={rx.id} className={rx.status === 'completed' ? 'opacity-60' : 'hover:bg-gray-50 dark:hover:bg-dark-surface/50 transition-colors'}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                          rx.type === 'procedure' ? 'bg-purple/10 text-purple' :
                          rx.type === 'medication' ? 'bg-accent-tiffany/10 text-accent-tiffany' :
                          'bg-amber/10 text-amber'
                        }`}>
                          {getRxTypeIcon(rx.type)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{rx.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs capitalize">{rx.type === 'procedure' ? 'Процедура' : rx.type === 'medication' ? 'Медикамент' : 'Анализ'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs">{rx.schedule}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs font-mono">{rx.days}</td>
                    <td className="px-4 py-3">
                      {rx.status === 'active' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">Активно</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-dark-surface text-gray-500 dark:text-gray-400">Завершено</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Calendar view: simplified week view */
        <div className="glass-card rounded-xl border border-gray-200 dark:border-dark-border-subtle p-4">
          <div className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">27 июля — 2 августа 2026</div>
          <div className="grid grid-cols-7 gap-2">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, i) => {
              const isToday = i === 6 // Sunday = today in this mock
              return (
                <div key={day} className={`text-center p-2 rounded-lg border ${isToday ? 'border-accent-tiffany bg-accent-tiffany/5 dark:bg-accent-tiffany/10' : 'border-gray-200 dark:border-dark-border'}`}>
                  <div className={`text-xs font-medium ${isToday ? 'text-accent-tiffany' : 'text-gray-500 dark:text-gray-400'}`}>{day}</div>
                  <div className={`text-lg font-semibold mt-0.5 ${isToday ? 'text-accent-tiffany' : 'text-gray-900 dark:text-gray-100'}`}>{27 + i > 31 ? (27 + i - 31) : 27 + i}</div>
                  <div className="mt-1 space-y-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple mx-auto" title="Грязевые аппликации" />
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-tiffany mx-auto" title="Нимесан" />
                    {i % 2 === 0 && <div className="w-1.5 h-1.5 rounded-full bg-blue mx-auto" title="Душ-массаж" />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export function PatientCard({ onBack }: PatientCardProps) {
  const [activeTab, setActiveTab] = useState<MainTab>('visit')
  const [showProcedureModal, setShowProcedureModal] = useState(false)
  const [showDischargeModal, setShowDischargeModal] = useState(false)
  const [lightboxDoc, setLightboxDoc] = useState<DocAttachment | null>(null)
  const [patientStatus, setPatientStatus] = useState<string>(patientData.status)

  function handleAssignProcedure(procId: number) {
    // In production: API call to add prescription
    const procName = procedureCatalog.find(p => p.id === procId)?.name
    console.log('Assigned procedure:', procName)
  }

  function handleDischarge() {
    setPatientStatus('Выписан')
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-dark-bg">
      {/* ── Top Header (narrow, with back + patient name + status) ── */}
      <div className="glass-card border-b border-gray-200 dark:border-dark-border-subtle px-4 py-2.5 flex items-center gap-3 shrink-0">
        <button onClick={onBack} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-accent-tiffany/10 dark:bg-accent-tiffany/20 flex items-center justify-center shrink-0 border border-accent-tiffany/20">
          <span className="text-xs font-semibold text-accent-tiffany">КВ</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{patientData.name}</h1>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium shrink-0 ${
              patientStatus === 'Выписан'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30'
                : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30'
            }`}>
              {patientStatus}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {patientData.diagnosis} · палата {patientData.room} · {patientData.doctor}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 shrink-0">
          <Calendar className="w-3.5 h-3.5" />
          <span>{patientData.checkIn} → {patientData.checkOut}</span>
        </div>
      </div>

      {/* ── Tab Bar (in the right content area) ── */}
      <div className="glass-card border-b border-gray-200 dark:border-dark-border-subtle px-6 shrink-0">
        <div className="flex gap-1">
          {mainTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'text-accent-tiffany'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-tiffany rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content: Left Panel + Right Content ── */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar — fixed width, scrollable */}
        <LeftPanel
          onOpenProcedure={() => setShowProcedureModal(true)}
          onOpenDischarge={() => setShowDischargeModal(true)}
          onGoToPrescriptions={() => setActiveTab('prescriptions')}
          patientStatus={patientStatus}
        />

        {/* Right content — scrollable */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'visit' && <TabVisit setActiveTab={setActiveTab} />}
          {activeTab === 'results' && <TabResults onOpenLightbox={setLightboxDoc} />}
          {activeTab === 'prescriptions' && <TabPrescriptions onOpenProcedure={() => setShowProcedureModal(true)} />}
          {activeTab === 'discharge' && <DischargeEpicrisis />}
        </div>
      </div>

      {/* ── Modals ── */}
      {showProcedureModal && <ProcedureModal onClose={() => setShowProcedureModal(false)} onAssign={handleAssignProcedure} />}
      {showDischargeModal && <DischargeModal onClose={() => setShowDischargeModal(false)} onDischarge={handleDischarge} />}
      {lightboxDoc && <AttachmentLightbox doc={lightboxDoc} onClose={() => setLightboxDoc(null)} />}
    </div>
  )
}
