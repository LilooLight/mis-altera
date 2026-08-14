'use client'

import { useState } from 'react'
import {
  ArrowLeft, Paperclip, Stethoscope, Activity, FlaskConical, ClipboardList,
  X, Download, Eye, Calendar, Clock, CheckCircle2, Search,
  FileText, FileSpreadsheet, Image as ImageIcon, FileVideo, LayoutGrid, List, Wind,
  AlertTriangle, AlertCircle, ScanLine, HeartPulse, Monitor,
  Plus, Pill, Syringe, Thermometer, Droplets, Scale, BedDouble,
  UserRound, ClipboardCheck, FileSignature, ChevronRight,
  Pencil, Trash2, ShieldAlert, AlertOctagon, Ban, Check,
} from 'lucide-react'
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

type MainTab = 'visit' | 'results' | 'prescriptions' | 'history' | 'discharge'
type DocAttachment = { name: string; type: 'pdf' | 'xlsx' | 'image' | 'video' }

// ═══════════════════════════════════════════════════════════════════════
// Mock Data — keyed by patient features, uses the first patient as default
// ═══════════════════════════════════════════════════════════════════════

const patientData = {
  name: 'Козлов Виктор Сергеевич',
  age: 54,
  gender: 'М' as const,
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


const complaintTemplates = [
  'Головная боль', 'Боль в пояснице', 'Боль в суставах', 'Кашель сухой',
  'Одышка при нагрузке', 'Слабость', 'Тошнота', 'Бессонница',
  'Онемение конечностей', 'Головокружение', 'Боль в груди', 'Повышение АД',
]

const previousVitals = {
  bp: '130/85', pulse: '78', temp: '36.8', spo2: '97', rr: '16', weight: '82',
}

const vitalsRanges = {
  bp: { warn: '140/90', unit: 'мм рт.ст.', icon: HeartPulse },
  pulse: { min: 60, max: 100, unit: 'уд/мин', icon: Activity },
  temp: { min: 36.0, max: 37.2, unit: '°C', icon: Thermometer },
  spo2: { min: 95, max: 100, unit: '%', icon: Droplets },
  rr: { min: 12, max: 20, unit: 'в мин', icon: Wind },
  weight: { min: 0, max: 0, unit: 'кг', icon: Scale },
}

const prescriptions = [
  { id: 1, name: 'Грязевые аппликации', type: 'procedure' as const, schedule: 'Ежедневно', days: '10/15', status: 'active' as const },
  { id: 2, name: 'Подводный душ-массаж', type: 'procedure' as const, schedule: 'Пн, Ср, Пт', days: '7/12', status: 'active' as const },
  { id: 3, name: 'Электростимуляция', type: 'procedure' as const, schedule: 'Пн, Ср, Пт', days: '4/10', status: 'active' as const },
  { id: 4, name: 'Нимесан 100мг', type: 'medication' as const, schedule: '2 раза в день', days: '—', status: 'active' as const },
  { id: 5, name: 'Мильгамма', type: 'medication' as const, schedule: '1 раз в день (в/м)', days: '5/10', status: 'active' as const },
  { id: 6, name: 'L-карнитин', type: 'medication' as const, schedule: '1 раз в день', days: '—', status: 'active' as const },
  { id: 7, name: 'Рентген поясницы', type: 'analysis' as const, schedule: 'Выполнено 24.07', days: '✓', status: 'completed' as const },
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
  { key: 'history', label: 'История', icon: Clock },
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
// NEW ASSIGNMENT MODAL — Full constructor based on TreatmentPlan
// ═══════════════════════════════════════════════════════════════════════

const ASSIGNMENT_MEDICATIONS = [
  { name: 'Нимесулид 100мг', category: 'НПВС' },
  { name: 'Мелоксикам 15мг', category: 'НПВС' },
  { name: 'Панциртонин 500мг', category: 'Хондропротектор' },
  { name: 'L-карнитин', category: 'Метаболическое' },
  { name: 'Мильгамма', category: 'Витамины группы B' },
]

const ASSIGNMENT_PROCEDURES = [
  { name: 'Грязевые аппликации', category: 'Бальнеология', duration: '20 мин', isPaid: false, price: null },
  { name: 'Подводный душ-массаж', category: 'Гидротерапия', duration: '15 мин', isPaid: false, price: null },
  { name: 'Электростимуляция', category: 'Физиотерапия', duration: '15 мин', isPaid: false, price: null },
  { name: 'Магнитотерапия', category: 'Физиотерапия', duration: '20 мин', isPaid: false, price: null },
  { name: 'УВТ поясницы', category: 'Физиотерапия', duration: '10 мин', isPaid: true, price: '2 500 ₽' },
  { name: 'Инфракрасная сауна', category: 'Термолечение', duration: '30 мин', isPaid: true, price: '1 800 ₽' },
  { name: 'Лазеротерапия поясницы', category: 'Физиотерапия', duration: '15 мин', isPaid: true, price: '1 500 ₽' },
  { name: 'Криотерапия', category: 'Физиотерапия', duration: '10 мин', isPaid: false, price: null },
]

const ASSIGNMENT_SPECIALISTS = [
  { name: 'Иванов И.М.', role: 'Терапевт' },
  { name: 'Сидорова О.Н.', role: 'Невролог' },
  { name: 'Козлов А.П.', role: 'Кардиолог' },
  { name: 'Фёдорова Е.В.', role: 'Физиотерапевт' },
]

const ASSIGNMENT_ANALYSES = [
  { name: 'ОАК (общий анализ крови)', category: 'Лаборатория' },
  { name: 'Биохимия крови (глюкоза, холестерин)', category: 'Лаборатория' },
  { name: 'ОАМ (общий анализ мочи)', category: 'Лаборатория' },
  { name: 'ЭКГ', category: 'Инструментальное' },
  { name: 'УЗИ органов брюшной полости', category: 'Инструментальное' },
  { name: 'Рентгенография', category: 'Инструментальное' },
]

const FREQUENCY_OPTIONS = ['1 раз/день', '2 раза/день', '3 раза/день', '1 раз/неделю', 'По мере необходимости']

type AssignmentType = 'medication' | 'procedure' | 'specialist' | 'analysis'

const assignmentTypeTabs: { key: AssignmentType; label: string; icon: typeof Pill }[] = [
  { key: 'medication', label: 'Лекарство', icon: Pill },
  { key: 'procedure', label: 'Процедура', icon: Activity },
  { key: 'specialist', label: 'Консультация', icon: UserRound },
  { key: 'analysis', label: 'Исследование', icon: FlaskConical },
]

function NewAssignmentModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<AssignmentType>('medication')
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  // Common fields
  const [frequency, setFrequency] = useState(FREQUENCY_OPTIONS[0])
  const [duration, setDuration] = useState('')
  const [comment, setComment] = useState('')

  // Medication-specific
  const [dosage, setDosage] = useState('')

  // Procedure/specialist-specific
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')

  // Selected item details
  const selectedProc = selectedItem ? ASSIGNMENT_PROCEDURES.find(p => p.name === selectedItem) : null
  const showTimeSlots = activeTab === 'procedure' || activeTab === 'specialist'
  const showDosage = activeTab === 'medication'
  const showPayment = activeTab === 'procedure' && selectedProc?.isPaid

  function getCatalogForType(type: AssignmentType) {
    switch (type) {
      case 'medication': return ASSIGNMENT_MEDICATIONS.map(m => ({ name: m.name, sub: m.category }))
      case 'procedure': return ASSIGNMENT_PROCEDURES.map(p => ({ name: p.name, sub: `${p.category} · ${p.duration}${p.isPaid ? ' · ' + p.price : ''}` }))
      case 'specialist': return ASSIGNMENT_SPECIALISTS.map(s => ({ name: s.name, sub: s.role }))
      case 'analysis': return ASSIGNMENT_ANALYSES.map(a => ({ name: a.name, sub: a.category }))
    }
  }

  const catalog = getCatalogForType(activeTab)
  const filtered = catalog.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.sub.toLowerCase().includes(search.toLowerCase())
  )

  function handleAssign() {
    // In production: API call
    console.log('New assignment:', { type: activeTab, item: selectedItem, frequency, duration, dosage, selectedTimeSlot, isPaid, comment })
    onClose()
  }

  const canAssign = selectedItem !== null && (activeTab === 'medication' || selectedTimeSlot !== null || selectedItem !== null)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-border-subtle w-full max-w-3xl mx-4 max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border-subtle flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Новое назначение</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Выберите тип и заполните параметры</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Tabs */}
        <div className="px-6 pt-4 shrink-0">
          <div className="inline-flex rounded-xl bg-gray-100 dark:bg-dark-surface p-1 gap-1">
            {assignmentTypeTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSelectedItem(null); setSelectedTimeSlot(null); setSearch('') }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-white dark:bg-dark-card text-accent-tiffany shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content area: scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Catalog selection */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Каталог</h4>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text" placeholder={`Поиск ${activeTab === 'medication' ? 'препарата' : activeTab === 'specialist' ? 'специалиста' : activeTab === 'analysis' ? 'исследования' : 'процедуры'}...`}
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany"
                />
              </div>

              {/* Catalog items */}
              <div className="space-y-1.5 max-h-[250px] overflow-y-auto rounded-xl border border-gray-200 dark:border-dark-border-subtle">
                {filtered.map(item => {
                  const isSelected = selectedItem === item.name
                  return (
                    <button
                      key={item.name}
                      onClick={() => { setSelectedItem(isSelected ? null : item.name); setSelectedTimeSlot(null) }}
                      className={`w-full text-left px-4 py-3 transition-colors ${
                        isSelected
                          ? 'bg-accent-tiffany/5 border-l-2 border-accent-tiffany'
                          : 'hover:bg-gray-50 dark:hover:bg-dark-surface/50 border-l-2 border-transparent'
                      }`}
                    >
                      <p className={`text-sm font-medium ${isSelected ? 'text-accent-tiffany' : 'text-gray-900 dark:text-gray-100'}`}>{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.sub}</p>
                    </button>
                  )
                })}
                {filtered.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">Ничего не найдено</div>
                )}
              </div>
            </div>

            {/* RIGHT: Parameters */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Параметры назначения</h4>

              {!selectedItem && (
                <div className="p-6 rounded-xl border border-dashed border-gray-300 dark:border-dark-border text-center">
                  <ClipboardList className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">Выберите элемент из каталога</p>
                </div>
              )}

              {selectedItem && (
                <>
                  {/* Selected item summary */}
                  <div className="p-3 rounded-xl bg-accent-tiffany/5 dark:bg-accent-tiffany/10 border border-accent-tiffany/20 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getEventBg(activeTab === 'medication' ? 'visit' : activeTab === 'specialist' ? 'visit' : activeTab)}`}>
                      {getRxTypeIcon(activeTab)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedItem}</p>
                      {selectedProc?.isPaid && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 mt-0.5">
                          Платно: {selectedProc.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dosage (medication only) */}
                  {showDosage && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Дозировка</label>
                      <input
                        type="text" placeholder="например, 100 мг" value={dosage}
                        onChange={e => setDosage(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany"
                      />
                    </div>
                  )}

                  {/* Frequency */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Частота</label>
                    <div className="flex flex-wrap gap-1.5">
                      {FREQUENCY_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setFrequency(opt)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            frequency === opt
                              ? 'bg-accent-tiffany/10 text-accent-tiffany border border-accent-tiffany/30'
                              : 'bg-gray-50 dark:bg-dark-surface text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-dark-border hover:text-gray-700 dark:hover:text-gray-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Длительность курса</label>
                    <input
                      type="text" placeholder="например, 10 дней" value={duration}
                      onChange={e => setDuration(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany"
                    />
                  </div>

                  {/* Time slot selection (procedure / specialist) */}
                  {showTimeSlots && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Время</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map(slot => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTimeSlot(selectedTimeSlot === slot ? null : slot)}
                            className={`px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                              selectedTimeSlot === slot
                                ? 'bg-accent-tiffany text-white shadow-sm'
                                : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border-subtle text-gray-600 dark:text-gray-300 hover:border-accent-tiffany hover:text-accent-tiffany'
                            }`}
                          >
                            <Clock className="inline-block w-3 h-3 mr-0.5" />
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment toggle (paid procedures) */}
                  {showPayment && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber" />
                        <span className="text-sm text-amber-800 dark:text-amber-300 font-medium">Оплачено</span>
                      </div>
                      <button
                        role="switch" aria-checked={isPaid}
                        onClick={() => setIsPaid(!isPaid)}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
                          isPaid ? 'bg-accent-tiffany' : 'bg-gray-300 dark:bg-dark-border-subtle'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          isPaid ? 'translate-x-4.5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  )}

                  {/* Comment */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Комментарий</label>
                    <textarea
                      rows={2} placeholder="Примечание к назначению…" value={comment}
                      onChange={e => setComment(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany resize-none"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-border-subtle flex items-center justify-between shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-dark-border-subtle text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
            Отмена
          </button>
          <button
            disabled={!canAssign}
            onClick={handleAssign}
            className={`px-5 py-2.5 text-sm font-medium rounded-xl btn-enamel text-white transition-all ${
              canAssign
                ? 'bg-accent-tiffany hover:bg-accent-tiffany-dark cursor-pointer'
                : 'bg-gray-300 dark:bg-dark-surface text-gray-500 cursor-not-allowed'
            }`}
          >
            Назначить
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

      {/* Лист назначений (compact) */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-dark-border">
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Лист назначений</h4>
        <button
          onClick={onGoToPrescriptions}
          className="w-full text-left text-xs text-gray-700 dark:text-gray-300 hover:text-accent-tiffany transition-colors leading-relaxed"
        >
          Диета {'\u00B9'}5, ЛФК, массаж (10), физио (12), бальнео (8)
        </button>
      </div>

      {/* Action buttons */}
      <div className="px-5 py-4 border-t border-gray-100 dark:border-dark-border space-y-2 sticky bottom-0 bg-white dark:bg-dark-card">
        <button
          onClick={onOpenProcedure}
          className="w-full px-4 py-2.5 text-sm font-medium rounded-xl btn-enamel bg-accent-tiffany text-white hover:bg-accent-tiffany-dark transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Новое назначение
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
  const [complaints, setComplaints] = useState('')
  const [showObjective, setShowObjective] = useState(false)
  const [showPrevValues, setShowPrevValues] = useState(true)
  const [showConclusion, setShowConclusion] = useState(false)

  // Objective data fields
  const [objData, setObjData] = useState({ bp: '', pulse: '', temp: '', spo2: '', rr: '', weight: '' })
  const [conclusion, setConclusion] = useState('Состояние удовлетворительное, динамика положительная.')

  // Check if all objective fields have values → show conclusion
  const allObjFilled = Object.values(objData).every(v => v.trim() !== '')

  // Validate individual vital
  function isVitalAbnormal(key: string, value: string): boolean {
    if (!value.trim()) return false
    if (key === 'bp') {
      const parts = value.split('/').map(Number)
      if (parts.length === 2) return parts[0] > 140 || parts[1] > 90
    }
    const num = parseFloat(value)
    const range = vitalsRanges[key as keyof typeof vitalsRanges]
    if (range && 'min' in range && 'max' in range && range.min > 0) {
      return num < range.min || num > (range.max as number)
    }
    return false
  }

  function handleSave() {
    console.log('Visit saved:', { complaints, objData, conclusion })
  }

  function handleSaveAndGoToPrescriptions() {
    handleSave()
    setActiveTab('prescriptions')
  }

  return (
    <div className="flex gap-6 p-6 h-full">
      {/* ── RIGHT: Main form area (~70%) ── */}
      <div className="flex-1 min-w-0 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-base font-semibold text-gray-900 dark:text-gray-100">Осмотр пациента</h2>
          <span className="text-xs text-gray-400 dark:text-gray-500">27.07.2026</span>
        </div>

        {/* Block 1: Жалобы */}
        <div className="glass-card rounded-xl border border-gray-200 dark:border-dark-border-subtle p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-accent-tiffany" /> Жалобы
            </h3>
          </div>

          {/* Previous value hint */}
          {showPrevValues && previousVitals.bp && (
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">
              Предыдущий дневник: «Ноющая боль в пояснице, усиливается при ходьбе. Онемение левой стопы.»
            </p>
          )}

          {/* Template dropdown */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">Шаблон:</span>
            <div className="flex flex-wrap gap-1.5">
              {complaintTemplates.slice(0, 6).map(tmpl => (
                <button
                  key={tmpl}
                  onClick={() => setComplaints(prev => prev ? prev + ', ' + tmpl : tmpl)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 dark:border-dark-border-subtle text-gray-600 dark:text-gray-400 hover:border-accent-tiffany/30 hover:text-accent-tiffany hover:bg-accent-tiffany/5 transition-colors"
                >
                  {tmpl}
                </button>
              ))}
              <div className="relative group">
                <button className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 dark:border-dark-border-subtle text-gray-500 dark:text-gray-400 hover:border-accent-tiffany/30 transition-colors">
                  Ещё...
                </button>
                <div className="absolute top-full left-0 mt-1 z-10 hidden group-hover:flex flex-wrap gap-1 p-2 rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-card shadow-lg min-w-[200px]">
                  {complaintTemplates.slice(6).map(tmpl => (
                    <button
                      key={tmpl}
                      onClick={() => setComplaints(prev => prev ? prev + ', ' + tmpl : tmpl)}
                      className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 dark:border-dark-border-subtle text-gray-600 dark:text-gray-400 hover:text-accent-tiffany hover:border-accent-tiffany/30 transition-colors"
                    >
                      {tmpl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <textarea
            value={complaints}
            onChange={e => setComplaints(e.target.value)}
            placeholder="Опишите текущие жалобы..."
            rows={3}
            className="w-full rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-surface px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany resize-y"
          />
        </div>

        {/* Block 2: Объективные данные (expandable) */}
        {!showObjective ? (
          <button
            onClick={() => setShowObjective(true)}
            className="w-full glass-card rounded-xl border border-dashed border-gray-300 dark:border-dark-border px-4 py-4 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-accent-tiffany/30 hover:text-accent-tiffany hover:bg-accent-tiffany/5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Добавить объективные данные
          </button>
        ) : (
          <div className="glass-card rounded-xl border border-gray-200 dark:border-dark-border-subtle p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent-tiffany" /> Объективные данные
              </h3>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xs text-gray-500 dark:text-gray-400">Пред. значения</span>
                <button
                  role="switch" aria-checked={showPrevValues}
                  onClick={() => setShowPrevValues(!showPrevValues)}
                  className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors duration-200 ${
                    showPrevValues ? 'bg-accent-tiffany' : 'bg-gray-300 dark:bg-dark-border-subtle'
                  }`}
                >
                  <span className={`inline-block h-2.5 w-2.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    showPrevValues ? 'translate-x-3.5' : 'translate-x-0.5'
                  }`} />
                </button>
              </label>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {/* АД */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <HeartPulse className="w-3.5 h-3.5" /> АД
                  <span className="text-gray-400">мм рт.ст.</span>
                </label>
                <input
                  type="text" placeholder="120/80" value={objData.bp}
                  onChange={e => setObjData(d => ({ ...d, bp: e.target.value }))}
                  className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany transition-colors ${
                    isVitalAbnormal('bp', objData.bp) ? 'border-red dark:border-red/50 bg-red-50 dark:bg-red-900/10 ring-1 ring-red/20' : 'border-gray-200 dark:border-dark-border-subtle'
                  }`}
                />
                {showPrevValues && <p className="text-[10px] text-gray-400">пред.: {previousVitals.bp}</p>}
                {isVitalAbnormal('bp', objData.bp) && <p className="text-[10px] text-red font-medium">{'>'}140/90 — повышено!</p>}
              </div>

              {/* Пульс */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Activity className="w-3.5 h-3.5" /> Пульс
                  <span className="text-gray-400">уд/мин</span>
                </label>
                <input
                  type="text" placeholder="72" value={objData.pulse}
                  onChange={e => setObjData(d => ({ ...d, pulse: e.target.value }))}
                  className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany transition-colors ${
                    isVitalAbnormal('pulse', objData.pulse) ? 'border-red dark:border-red/50 bg-red-50 dark:bg-red-900/10 ring-1 ring-red/20' : 'border-gray-200 dark:border-dark-border-subtle'
                  }`}
                />
                {showPrevValues && <p className="text-[10px] text-gray-400">пред.: {previousVitals.pulse}</p>}
                {isVitalAbnormal('pulse', objData.pulse) && <p className="text-[10px] text-red font-medium">Вне нормы 60–100</p>}
              </div>

              {/* Температура */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Thermometer className="w-3.5 h-3.5" /> Температура
                  <span className="text-gray-400">°C</span>
                </label>
                <input
                  type="text" placeholder="36.6" value={objData.temp}
                  onChange={e => setObjData(d => ({ ...d, temp: e.target.value }))}
                  className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany transition-colors ${
                    isVitalAbnormal('temp', objData.temp) ? 'border-red dark:border-red/50 bg-red-50 dark:bg-red-900/10 ring-1 ring-red/20' : 'border-gray-200 dark:border-dark-border-subtle'
                  }`}
                />
                {showPrevValues && <p className="text-[10px] text-gray-400">пред.: {previousVitals.temp}</p>}
                {isVitalAbnormal('temp', objData.temp) && <p className="text-[10px] text-red font-medium">Вне нормы 36.0–37.2</p>}
              </div>

              {/* СпО2 */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Droplets className="w-3.5 h-3.5" /> СпО2
                  <span className="text-gray-400">%</span>
                </label>
                <input
                  type="text" placeholder="98" value={objData.spo2}
                  onChange={e => setObjData(d => ({ ...d, spo2: e.target.value }))}
                  className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany transition-colors ${
                    isVitalAbnormal('spo2', objData.spo2) ? 'border-red dark:border-red/50 bg-red-50 dark:bg-red-900/10 ring-1 ring-red/20' : 'border-gray-200 dark:border-dark-border-subtle'
                  }`}
                />
                {showPrevValues && <p className="text-[10px] text-gray-400">пред.: {previousVitals.spo2}</p>}
                {isVitalAbnormal('spo2', objData.spo2) && <p className="text-[10px] text-red font-medium">{'<'}95 — гипоксия!</p>}
              </div>

              {/* ЧДД */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Wind className="w-3.5 h-3.5" /> ЧДД
                  <span className="text-gray-400">в мин</span>
                </label>
                <input
                  type="text" placeholder="16" value={objData.rr}
                  onChange={e => setObjData(d => ({ ...d, rr: e.target.value }))}
                  className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany transition-colors ${
                    isVitalAbnormal('rr', objData.rr) ? 'border-red dark:border-red/50 bg-red-50 dark:bg-red-900/10 ring-1 ring-red/20' : 'border-gray-200 dark:border-dark-border-subtle'
                  }`}
                />
                {showPrevValues && <p className="text-[10px] text-gray-400">пред.: {previousVitals.rr}</p>}
                {isVitalAbnormal('rr', objData.rr) && <p className="text-[10px] text-red font-medium">Вне нормы 12–20</p>}
              </div>

              {/* Вес */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Scale className="w-3.5 h-3.5" /> Вес
                  <span className="text-gray-400">кг</span>
                </label>
                <input
                  type="text" placeholder="82" value={objData.weight}
                  onChange={e => setObjData(d => ({ ...d, weight: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany transition-colors"
                />
                {showPrevValues && <p className="text-[10px] text-gray-400">пред.: {previousVitals.weight}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Block 3: Заключение (auto-appears when objective data filled) */}
        {showObjective && allObjFilled && (
          <div className="glass-card rounded-xl border border-gray-200 dark:border-dark-border-subtle p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent-tiffany" /> Заключение
            </h3>
            <textarea
              value={conclusion}
              onChange={e => setConclusion(e.target.value)}
              placeholder="Клиническое заключение..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-surface px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany resize-y"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-dark-border-subtle">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-sm font-medium rounded-xl btn-enamel bg-accent-tiffany text-white hover:bg-accent-tiffany-dark transition-colors"
          >
            Сохранить осмотр
          </button>
          <button
            onClick={handleSaveAndGoToPrescriptions}
            className="px-5 py-2.5 text-sm font-medium rounded-xl border border-accent-tiffany text-gray-900 dark:text-gray-100 hover:bg-accent-tiffany/10 transition-colors"
          >
            Сохранить и перейти к назначениям
          </button>
        </div>
      </div>

      {/* ── LEFT: Sidebar (~30%) ── */}
      <div className="w-[280px] shrink-0 space-y-4">
        {/* Лист назначений (свернутый) */}
        <div className="glass-card rounded-xl border border-gray-200 dark:border-dark-border-subtle p-3">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Лист назначений</h4>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className="w-full text-left text-xs text-gray-700 dark:text-gray-300 hover:text-accent-tiffany transition-colors leading-relaxed"
          >
            Диета {'\u00B9'}5, ЛФК, массаж (10), физио (12), бальнео (8)
          </button>
        </div>

        {/* Показатели предыдущего осмотра */}
        <div className="glass-card rounded-xl border border-gray-200 dark:border-dark-border-subtle p-3 space-y-2">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Предыдущий осмотр</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-dark-surface">
              <span className="text-gray-500 dark:text-gray-400">АД</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{previousVitals.bp}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-dark-surface">
              <span className="text-gray-500 dark:text-gray-400">Пульс</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{previousVitals.pulse}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-dark-surface">
              <span className="text-gray-500 dark:text-gray-400">Темп.</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{previousVitals.temp}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-dark-surface">
              <span className="text-gray-500 dark:text-gray-400">СпО2</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{previousVitals.spo2}</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">27.07.2026, 10:30 — Иванов И.М.</p>
        </div>

        {/* Лог предыдущих осмотров */}
        <div className="glass-card rounded-xl border border-gray-200 dark:border-dark-border-subtle p-3">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Лог осмотров</h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {visitHistory.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab('history')}
                className="w-full text-left group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-tiffany shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{item.date}</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">{item.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate group-hover:text-accent-tiffany transition-colors">
                      {item.type}: {item.summary.slice(0, 40)}...
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
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


const visitHistory = [
  { id: 1, date: '27.07.2026', time: '10:30', type: 'Терапевт', doctor: 'Иванов И.М.', summary: 'Осмотр плановый. Жалобы на ноющую боль в пояснице. АД 130/85, пульс 78.',
    attachments: [] },
  { id: 2, date: '25.07.2026', time: '09:00', type: 'Невролог', doctor: 'Сидорова О.Н.', summary: 'Консультация. Рекомендована коррекция терапии.',
    attachments: [
      { name: 'Заключение невролога_Сидорова_25.07.pdf', type: 'pdf' as const },
    ] },
  { id: 3, date: '24.07.2026', time: '14:00', type: 'Процедура', doctor: 'Петров А.В.', summary: 'Рентгенография поясничного отдела. Умеренные ДД L4-L5.',
    attachments: [
      { name: 'Рентген_поясница_24.07.dicom', type: 'image' as const },
      { name: 'Заключение_рентгенолог_Петров.pdf', type: 'pdf' as const },
    ] },
  { id: 4, date: '22.07.2026', time: '08:30', type: 'Терапевт', doctor: 'Иванов И.М.', summary: 'Осмотр. Динамика положительная. АД 140/90.',
    attachments: [
      { name: 'ОАК_22.07.2026.pdf', type: 'pdf' as const },
      { name: 'Биохимия_глюкоза_холестерин.xlsx', type: 'xlsx' as const },
    ] },
  { id: 5, date: '20.07.2026', time: '11:00', type: 'Процедура', doctor: 'Ким Л.С.', summary: 'УЗИ брюшной полости. Без патологий.',
    attachments: [
      { name: 'УЗИ_брюшная_полость_протокол.pdf', type: 'pdf' as const },
      { name: 'УЗИ_снимки_20.07.png', type: 'image' as const },
    ] },
  { id: 6, date: '18.07.2026', time: '10:00', type: 'Терапевт', doctor: 'Иванов И.М.', summary: 'Первичный осмотр. Жалобы на боль в пояснице, ограничение подвижности.',
    attachments: [
      { name: 'Направление_в_санаторий_№2847.pdf', type: 'pdf' as const },
      { name: 'Выписка_из_карты_стационара.pdf', type: 'pdf' as const },
      { name: 'МРТ_поясница_10.07.dicom', type: 'image' as const },
      { name: 'ЭКГ_входное_10.07.pdf', type: 'pdf' as const },
      { name: 'ОАК_ОАМ_входные.xlsx', type: 'xlsx' as const },
    ] },
]

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

// ═══════════════════════════════════════════════════════════
// HISTORY TAB
// ═══════════════════════════════════════════════════════════════════════

function TabHistory({ onOpenLightbox }: { onOpenLightbox: (doc: DocAttachment) => void }) {
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const selected = selectedItem ? visitHistory.find(h => h.id === selectedItem) : null

  const hasAttachments = (item: typeof visitHistory[number]) => item.attachments && item.attachments.length > 0

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-base font-semibold text-gray-900 dark:text-gray-100">История посещений</h2>
        <span className="text-xs text-gray-400 dark:text-gray-500">{visitHistory.length} записей</span>
      </div>

      <div className="flex gap-6">
        {/* Timeline */}
        <div className="flex-1 space-y-3">
          {visitHistory.map(item => {
            const isSelected = selectedItem === item.id
            const typeColor = item.type === 'Терапевт' ? 'bg-accent-tiffany' : item.type === 'Невролог' ? 'bg-purple' : item.type === 'Процедура' ? 'bg-amber' : 'bg-blue'
            const attached = hasAttachments(item)
            return (
              <button
                key={item.id}
                onClick={() => setSelectedItem(isSelected ? null : item.id)}
                className={`w-full text-left glass-card rounded-xl border p-4 transition-all ${
                  isSelected
                    ? 'border-accent-tiffany bg-accent-tiffany/5 dark:bg-accent-tiffany/10 shadow-sm'
                    : 'border-gray-200 dark:border-dark-border-subtle hover:border-accent-tiffany/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColor}/10 text-${typeColor.replace('bg-', '')}`}>
                      {item.type === 'Терапевт' || item.type === 'Невролог' ? <Stethoscope className="w-4 h-4" /> :
                       item.type === 'Процедура' ? <Activity className="w-4 h-4" /> : <FlaskConical className="w-4 h-4" />}
                    </div>
                    <div className={`w-1.5 h-1.5 rounded-full ${typeColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.type}</span>
                        {item.doctor && <span className="text-xs text-gray-500 dark:text-gray-400">— {item.doctor}</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 shrink-0">
                        {attached && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent-tiffany/10 text-accent-tiffany" title={`${item.attachments.length} влож.`}>
                            <Paperclip className="w-3 h-3" />
                            <span>{item.attachments.length}</span>
                          </span>
                        )}
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{item.summary}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-[360px] shrink-0 glass-card rounded-xl border border-gray-200 dark:border-dark-border-subtle p-4 sticky top-6 self-start">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Подробности</h3>
              <button onClick={() => setSelectedItem(null)} className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Дата и время</span>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selected.date}, {selected.time}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Тип</span>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selected.type}</p>
              </div>
              {selected.doctor && (
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Врач</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selected.doctor}</p>
                </div>
              )}
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Описание</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selected.summary}</p>
              </div>

              {/* ── Attachments section ── */}
              {hasAttachments(selected) && (
                <div className="pt-3 border-t border-gray-200 dark:border-dark-border-subtle">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Paperclip className="w-3.5 h-3.5 text-accent-tiffany" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Вложения ({selected.attachments.length})
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {selected.attachments.map((doc, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-200 dark:border-dark-border-subtle hover:border-accent-tiffany/30 transition-colors group ${getDocTypeBg(doc.type)}`}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white dark:bg-dark-card/50">
                          {getDocTypeIcon(doc.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{doc.name}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            {doc.type === 'pdf' ? 'PDF' : doc.type === 'xlsx' ? 'Excel' : doc.type === 'image' ? 'Изображение' : 'Видео'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => onOpenLightbox(doc)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-accent-tiffany hover:bg-accent-tiffany/10 transition-colors"
                            title="Предпросмотр"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className="p-1.5 rounded-md text-gray-400 hover:text-accent-tiffany hover:bg-accent-tiffany/10 transition-colors"
                            title="Скачать"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-gray-200 dark:border-dark-border-subtle">
                <button className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-accent-tiffany text-accent-tiffany hover:bg-accent-tiffany/10 transition-colors">
                  Открыть полный отчёт
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export function PatientCard({ onBack }: PatientCardProps) {
  const [activeTab, setActiveTab] = useState<MainTab>('visit')
  const [showProcedureModal, setShowProcedureModal] = useState(false)
  const [showDischargeModal, setShowDischargeModal] = useState(false)
  const [lightboxDoc, setLightboxDoc] = useState<DocAttachment | null>(null)
  const [patientStatus, setPatientStatus] = useState<string>(patientData.status)



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
            {patientData.diagnosisFull}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
            {patientData.age} лет, {patientData.gender === 'М' ? 'муж.' : 'жен.'} · палата {patientData.room} · {patientData.doctor}
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
          {activeTab === 'history' && <TabHistory onOpenLightbox={setLightboxDoc} />}
          {activeTab === 'discharge' && <DischargeEpicrisis />}
        </div>
      </div>

      {/* ── Modals ── */}
      {showProcedureModal && <NewAssignmentModal onClose={() => setShowProcedureModal(false)} />}
      {showDischargeModal && <DischargeModal onClose={() => setShowDischargeModal(false)} onDischarge={handleDischarge} />}
      {lightboxDoc && <AttachmentLightbox doc={lightboxDoc} onClose={() => setLightboxDoc(null)} />}
    </div>
  )
}
