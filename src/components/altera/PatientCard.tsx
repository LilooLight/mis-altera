'use client'

import { useState } from 'react'
import {
  ArrowLeft, Paperclip, Stethoscope, Activity, FlaskConical, ClipboardList,
  X, Download, Eye, Calendar, Clock, CheckCircle2, Search,
  FileText, FileSpreadsheet, Image as ImageIcon, FileVideo, LayoutGrid, List,
  AlertTriangle, AlertCircle, ScanLine, HeartPulse, Monitor, ChevronRight,
} from 'lucide-react'
import { TreatmentPlan } from '@/components/altera/TreatmentPlan'
import { DischargeEpicrisis } from '@/components/altera/DischargeEpicrisis'

// ─── Data ───────────────────────────────────────────────────────────────────

const labResults = [
  { name: 'Гемоглобин (Hb)', value: '128 г/л', norm: '120–140 г/л', status: 'normal' as const, date: '27.07.2026' },
  { name: 'Лейкоциты (WBC)', value: '5.8 × 10⁹/л', norm: '4.0–9.0 × 10⁹/л', status: 'normal' as const, date: '27.07.2026' },
  { name: 'СОЭ', value: '12 мм/ч', norm: '2–15 мм/ч', status: 'normal' as const, date: '27.07.2026' },
  { name: 'Глюкоза', value: '6.8 ммоль/л', norm: '4.1–5.9 ммоль/л', status: 'abnormal' as const, date: '27.07.2026' },
  { name: 'Холестерин общий', value: '5.4 ммоль/л', norm: '< 5.2 ммоль/л', status: 'warning' as const, date: '27.07.2026' },
  { name: 'АЛТ', value: '28 Ед/л', norm: '7–40 Ед/л', status: 'normal' as const, date: '27.07.2026' },
  { name: 'АСТ', value: '22 Ед/л', norm: '7–40 Ед/л', status: 'normal' as const, date: '27.07.2026' },
  { name: 'Креатинин', value: '88 мкмоль/л', norm: '44–97 мкмоль/л', status: 'normal' as const, date: '27.07.2026' },
  { name: 'Мочевина', value: '5.2 ммоль/л', norm: '2.5–6.4 ммоль/л', status: 'normal' as const, date: '25.07.2026' },
  { name: 'Тромбоциты', value: '245 × 10⁹/л', norm: '150–400 × 10⁹/л', status: 'normal' as const, date: '25.07.2026' },
]

const imagingResults = [
  { id: 1, type: 'xray' as const, name: 'Рентгенография поясничного отдела', date: '24.07.2026', doctor: 'Рентгенолог Петров А.В.', result: 'Умеренные дегенеративные изменения L4-L5. Умеренное снижение высоты межпозвонкового диска.', status: 'completed' as const, hasAttachment: true },
  { id: 2, type: 'ultrasound' as const, name: 'УЗИ органов брюшной полости', date: '22.07.2026', doctor: 'УЗ-специалист Ким Л.С.', result: 'Печень не увеличена. Желчный пузырь без особенностей. Поджелудочная железа в норме. Почки без патологий.', status: 'completed' as const, hasAttachment: true },
  { id: 3, type: 'ekg' as const, name: 'ЭКГ', date: '10.07.2026', doctor: 'Врач-терапевт Иванов И.М.', result: 'Синусовый ритм, ЧСС 72 в мин. ЭОС отклонена влево. Нарушений реполяризации не выявлено.', status: 'completed' as const, hasAttachment: true },
  { id: 4, type: 'ultrasound' as const, name: 'УЗИ сердца (ЭхоКГ)', date: '26.07.2026', doctor: 'Кардиолог Сидоров К.М.', result: 'Ожидается', status: 'pending' as const, hasAttachment: false },
]

const timeline = [
  { id: 1, date: '27.07.2026', time: '10:30', type: 'visit' as const, doctor: 'Иванов И.М. (терапевт)', complaints: 'Ноющая боль в пояснице. Усиление после физической нагрузки.', status: 'Пальпация L4-L5 болезненна, угол движения ограничен.', diagnosis: 'M54.5 — Боль в пояснице', dynamics: 'Умеренное улучшение на фоне грязелечения. Рекомендовано продолжение процедур.', attachments: [{ name: 'Рентген поясницы.pdf', type: 'pdf' as const }] },
  { id: 2, date: '26.07.2026', time: '14:00', type: 'procedure' as const, doctor: 'Медсестра (процедурный кабинет)', complaints: '', status: 'Грязевые аппликации на поясницу. Температура 42°C, 20 мин.', diagnosis: '', dynamics: 'Реакция умеренная, пациент переносит хорошо.', attachments: [] },
  { id: 3, date: '25.07.2026', time: '09:00', type: 'lab' as const, doctor: 'Лаборатория', complaints: '', status: 'ОАК, ОАМ, биохимия крови направлены.', diagnosis: '', dynamics: 'Результаты в пределах нормы, кроме глюкозы (6.8 ммоль/л).', attachments: [{ name: 'Анализ крови от 25.07.xlsx', type: 'xlsx' as const }] },
  { id: 4, date: '24.07.2026', time: '11:30', type: 'procedure' as const, doctor: 'Медсестра (водолечебница)', complaints: '', status: 'Подводный душ-массаж, 15 мин, давление 2.5 атм.', diagnosis: '', dynamics: 'Курс 10 процедур, переносимость хорошая.', attachments: [] },
  { id: 5, date: '22.07.2026', time: '10:00', type: 'visit' as const, doctor: 'Сидорова О.Н. (невролог)', complaints: 'Боль в пояснице, онемение правой руки.', status: 'Болезненность паравертебральных точек L4-S1. Тинель-симптом справа положительный.', diagnosis: 'M54.5 + M79.3 — Панникулит правого предплечья', dynamics: 'Диагноз подтверждён. Дополнительно назначен массаж правой руки.', attachments: [{ name: 'Заключение невролога.pdf', type: 'pdf' as const }, { name: 'ЭНМГ правой руки.pdf', type: 'pdf' as const }] },
  { id: 6, date: '10.07.2026', time: '09:00', type: 'visit' as const, doctor: 'Иванов И.М. (терапевт)', complaints: 'Боль в пояснице около 2 месяцев. Ухудшение после переохлаждения.', status: 'Общее состояние удовлетворительное. Кожные покровы чистые. Суставы без деформации.', diagnosis: 'M54.5 — Боль в пояснице', dynamics: 'Первичный осмотр. Назначено обследование. Сформирован план лечения.', attachments: [{ name: 'Справка от поликлиники.pdf', type: 'pdf' as const }] },
  { id: 7, date: '10.07.2026', time: '08:00', type: 'system' as const, doctor: 'Система', complaints: '', status: 'Поступление: приложены документы 3 шт. (направление, справки, результаты анализов).', diagnosis: '', dynamics: '', attachments: [{ name: 'Направление в санаторий.pdf', type: 'pdf' as const }, { name: 'Выписка из карты.pdf', type: 'pdf' as const }, { name: 'Анализы поликлиники.pdf', type: 'pdf' as const }] },
]

const documents = [
  { id: 1, name: 'Рентген поясницы.pdf', type: 'pdf' as const, uploadDate: '24.07.2026', eventDate: '24.07.2026', uploadedBy: 'Рентгенолог Петров А.В.', eventLabel: 'Исследование: Рентген' },
  { id: 2, name: 'Заключение невролога.pdf', type: 'pdf' as const, uploadDate: '22.07.2026', eventDate: '22.07.2026', uploadedBy: 'Невролог Сидорова О.Н.', eventLabel: 'Консультация: Невролог' },
  { id: 3, name: 'ЭНМГ правой руки.pdf', type: 'pdf' as const, uploadDate: '22.07.2026', eventDate: '22.07.2026', uploadedBy: 'Невролог Сидорова О.Н.', eventLabel: 'Исследование: ЭНМГ' },
  { id: 4, name: 'Анализ крови от 25.07.xlsx', type: 'xlsx' as const, uploadDate: '25.07.2026', eventDate: '25.07.2026', uploadedBy: 'Лаборатория', eventLabel: 'Анализы: ОАК + Биохимия' },
  { id: 5, name: 'Снимок УЗИ брюшной полости.jpg', type: 'image' as const, uploadDate: '22.07.2026', eventDate: '22.07.2026', uploadedBy: 'УЗ-специалист Ким Л.С.', eventLabel: 'Исследование: УЗИ' },
  { id: 6, name: 'ЭКГ от 10.07.pdf', type: 'pdf' as const, uploadDate: '10.07.2026', eventDate: '10.07.2026', uploadedBy: 'Терапевт Иванов И.М.', eventLabel: 'Исследование: ЭКГ' },
  { id: 7, name: 'Справка от поликлиники.pdf', type: 'pdf' as const, uploadDate: '10.07.2026', eventDate: '10.07.2026', uploadedBy: 'Система', eventLabel: 'Документы заезда' },
  { id: 8, name: 'Выписка из карты.pdf', type: 'pdf' as const, uploadDate: '10.07.2026', eventDate: '10.07.2026', uploadedBy: 'Система', eventLabel: 'Документы заезда' },
  { id: 9, name: 'Анализы поликлиники.pdf', type: 'pdf' as const, uploadDate: '10.07.2026', eventDate: '10.07.2026', uploadedBy: 'Система', eventLabel: 'Документы заезда' },
]

// ─── Types ──────────────────────────────────────────────────────────────────

type DocAttachment = { name: string; type: 'pdf' | 'xlsx' | 'image' | 'video' }
type TimelineEntry = (typeof timeline)[number]
type DocItem = (typeof documents)[number]
type MainTab = 'results' | 'history' | 'plan' | 'discharge'
type HistorySubTab = 'timeline' | 'documents'
type DocFilter = 'all' | 'imaging' | 'pdf' | 'video'
type DocViewMode = 'grid' | 'table'

// ─── Constants ──────────────────────────────────────────────────────────────

const mainTabs: { key: MainTab; label: string }[] = [
  { key: 'results', label: 'Результаты исследований' },
  { key: 'history', label: 'История' },
  { key: 'plan', label: 'План лечения' },
  { key: 'discharge', label: 'Выписка' },
]

const historySubTabs: { key: HistorySubTab; label: string }[] = [
  { key: 'timeline', label: 'Хронология приёмов' },
  { key: 'documents', label: 'Документы и медиа' },
]

const docFilters: { key: DocFilter; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'imaging', label: 'Снимки (УЗИ/Рентген)' },
  { key: 'pdf', label: 'PDF-выписки' },
  { key: 'video', label: 'Видео' },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

function getTimelineIcon(type: TimelineEntry['type']) {
  switch (type) {
    case 'visit': return <Stethoscope className="w-4 h-4" />
    case 'procedure': return <Activity className="w-4 h-4" />
    case 'lab': return <FlaskConical className="w-4 h-4" />
    case 'diagnosis': return <ClipboardList className="w-4 h-4" />
    case 'system': return <Monitor className="w-4 h-4" />
    default: return <FileText className="w-4 h-4" />
  }
}

function getTimelineLabel(type: TimelineEntry['type']) {
  switch (type) {
    case 'visit': return 'Приём'
    case 'procedure': return 'Процедура'
    case 'lab': return 'Анализы'
    case 'diagnosis': return 'Консультация'
    case 'system': return 'Системное событие'
    default: return 'Запись'
  }
}

function getImagingIcon(type: string) {
  switch (type) {
    case 'xray': return <ScanLine className="w-5 h-5" />
    case 'ultrasound': return <Monitor className="w-5 h-5" />
    case 'ekg': return <HeartPulse className="w-5 h-5" />
    default: return <Eye className="w-5 h-5" />
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

function getDocTypeBg(type: string) {
  switch (type) {
    case 'pdf': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    case 'xlsx': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
    case 'image': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    case 'video': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
  }
}

function filterDocuments(docs: DocItem[], filter: DocFilter): DocItem[] {
  if (filter === 'all') return docs
  if (filter === 'imaging') return docs.filter(d => d.eventLabel.toLowerCase().includes('узи') || d.eventLabel.toLowerCase().includes('рентген'))
  if (filter === 'pdf') return docs.filter(d => d.type === 'pdf')
  if (filter === 'video') return docs.filter(d => d.type === 'video')
  return docs
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'normal' | 'abnormal' | 'warning' }) {
  if (status === 'normal') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="w-3 h-3" />
        В норме
      </span>
    )
  }
  if (status === 'abnormal') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
        <AlertCircle className="w-3 h-3" />
        Отклонение
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
      <AlertTriangle className="w-3 h-3" />
      Внимание
    </span>
  )
}

function AttachmentLightbox({
  doc,
  onClose,
}: {
  doc: DocAttachment
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#151e2e] rounded-xl shadow-2xl border border-gray-200 dark:border-[#253041] w-full max-w-lg mx-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-sans pr-4">
            {doc.name}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File type icon + fake preview */}
        <div className={`w-full h-48 rounded-lg flex flex-col items-center justify-center gap-3 mb-4 ${getDocTypeBg(doc.type)}`}>
          <span className="opacity-60">
            {getDocTypeIcon(doc.type)}
          </span>
          <span className="text-xs uppercase tracking-wider font-medium opacity-60">
            {doc.type === 'xlsx' ? 'Таблица' : doc.type === 'pdf' ? 'PDF-документ' : doc.type === 'image' ? 'Изображение' : 'Видео'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-[#253041] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors"
          >
            Закрыть
          </button>
          <button
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[#c9a96e] text-white hover:bg-[#b89558] transition-colors"
          >
            <span className="inline-flex items-center gap-2">
              <Download className="w-4 h-4" />
              Скачать
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

function AttachmentButton({
  attachments,
  onOpen,
}: {
  attachments: DocAttachment[]
  onOpen: (doc: DocAttachment) => void
}) {
  if (attachments.length === 0) return null

  const label = attachments.length === 1
    ? `Приложено: ${attachments[0].name}`
    : `Приложено: ${attachments.length} файл(ов)`

  return (
    <div className="relative group">
      <button
        onClick={attachments.length === 1 ? () => onOpen(attachments[0]) : undefined}
        className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-[#c9a96e] hover:bg-[#c9a96e]/10 transition-colors"
        aria-label={label}
      >
        <Paperclip className="w-3.5 h-3.5" />
      </button>
      {/* Tooltip */}
      <div className="absolute right-0 top-full mt-1 px-3 py-1.5 rounded-md bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-lg">
        {label}
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function PatientCard() {
  const [activeTab, setActiveTab] = useState<MainTab>('results')
  const [historySubTab, setHistorySubTab] = useState<HistorySubTab>('timeline')
  const [docFilter, setDocFilter] = useState<DocFilter>('all')
  const [docViewMode, setDocViewMode] = useState<DocViewMode>('grid')
  const [docSearch, setDocSearch] = useState('')
  const [lightboxDoc, setLightboxDoc] = useState<DocAttachment | null>(null)

  const filteredDocs = filterDocuments(documents, docFilter).filter(d =>
    d.name.toLowerCase().includes(docSearch.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#0b1120]">
      {/* ── Patient Info Header ──────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#151e2e] border-b border-gray-200 dark:border-[#253041] px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Back + Avatar + FIO + Meta */}
          <div className="flex items-center gap-4">
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors mr-1">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-full bg-[#c9a96e]/10 dark:bg-[#c9a96e]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-[#c9a96e]">КВ</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-sans leading-tight">
                Козлов Виктор Сергеевич
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                54 года · № палаты <span className="font-medium text-gray-700 dark:text-gray-300">312</span>
              </p>
            </div>
          </div>

          {/* Diagnosis + Dates + Status */}
          <div className="lg:ml-auto flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#253041]">
              M54.5 — Боль в пояснице
            </span>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Заезд: 10.07.2026
              </span>
              <span className="text-gray-300 dark:text-[#253041]">—</span>
              <span className="inline-flex items-center gap-1">
                Выезд: 31.07.2026
              </span>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
              Лечится
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-[#253041]">
          <button className="px-4 py-2 text-sm font-medium rounded-lg bg-[#c9a96e] text-white hover:bg-[#b89558] transition-colors">
            Назначить процедуру
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-lg border border-[#c9a96e] text-[#c9a96e] hover:bg-[#c9a96e]/10 transition-colors">
            План лечения
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-[#253041] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors">
            Выписать
          </button>
        </div>
      </div>

      {/* ── Tab Bar ──────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#151e2e] border-b border-gray-200 dark:border-[#253041] px-6">
        <div className="flex gap-6">
          {mainTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative pb-3 pt-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'text-[#c9a96e]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c9a96e] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {/* ======== Tab 1: Research Results ======== */}
        {activeTab === 'results' && (
          <div className="p-6 space-y-8">
            {/* Lab Results Section */}
            <section>
              <h2 className="font-serif text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Лабораторные исследования
              </h2>
              <div className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-[#253041]">
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Название</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Значение</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Норма</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Статус</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Дата</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-[#253041]">
                      {labResults.map((row, i) => (
                        <tr key={i} className={
                          row.status === 'abnormal' ? 'bg-red-50/50 dark:bg-red-900/5' :
                          row.status === 'warning' ? 'bg-amber-50/50 dark:bg-amber-900/5' :
                          ''
                        }>
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{row.name}</td>
                          <td className={`px-4 py-3 font-mono text-sm whitespace-nowrap ${
                            row.status === 'abnormal' ? 'text-red-600 dark:text-red-400 font-semibold' :
                            row.status === 'warning' ? 'text-amber-600 dark:text-amber-400 font-medium' :
                            'text-gray-700 dark:text-gray-300'
                          }`}>
                            {row.value}
                          </td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs whitespace-nowrap">{row.norm}</td>
                          <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{row.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Imaging Results Section */}
            <section>
              <h2 className="font-serif text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Инструментальные исследования
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {imagingResults.map(item => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        item.status === 'completed'
                          ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                      }`}>
                        {getImagingIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {item.name}
                          </h3>
                          {item.status === 'completed' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                          )}
                          {item.status === 'pending' && (
                            <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {item.doctor} · {item.date}
                        </p>
                        <p className={`text-sm mt-2 leading-relaxed ${
                          item.status === 'pending'
                            ? 'text-amber-600 dark:text-amber-400 italic'
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {item.result}
                        </p>
                        {item.hasAttachment && (
                          <button
                            onClick={() => setLightboxDoc({ name: `${item.name}.pdf`, type: 'pdf' })}
                            className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-[#c9a96e] hover:text-[#b89558] transition-colors"
                          >
                            <Paperclip className="w-3 h-3" />
                            Открыть вложение
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ======== Tab 2: History ======== */}
        {activeTab === 'history' && (
          <div className="p-6">
            {/* Sub-tab toggle */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-[#1e293b] rounded-lg w-fit mb-6">
              {historySubTabs.map(sub => (
                <button
                  key={sub.key}
                  onClick={() => setHistorySubTab(sub.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    historySubTab === sub.key
                      ? 'bg-[#c9a96e]/10 text-[#c9a96e]'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* ── Sub-tab A: Timeline ── */}
            {historySubTab === 'timeline' && (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200 dark:bg-[#253041]" />

                <div className="space-y-6">
                  {timeline.map((entry, idx) => {
                    const prevEntry = timeline[idx - 1]
                    const showDate = !prevEntry || prevEntry.date !== entry.date

                    return (
                      <div key={entry.id} className="relative pl-12">
                        {/* Timeline dot */}
                        <div className={`absolute left-[14px] top-1 w-[13px] h-[13px] rounded-full border-2 ${
                          entry.type === 'system'
                            ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0b1120]'
                            : 'border-[#c9a96e] bg-[#c9a96e]/20 dark:bg-[#c9a96e]/10'
                        }`} />

                        {/* Date separator */}
                        {showDate && (
                          <div className="absolute -left-0 -top-3">
                            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-[#0b1120] px-1">
                              {entry.date}
                            </span>
                          </div>
                        )}

                        {/* Card */}
                        <div className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                                entry.type === 'system'
                                  ? 'bg-gray-100 dark:bg-[#1e293b] text-gray-500 dark:text-gray-400'
                                  : 'bg-[#c9a96e]/10 text-[#c9a96e]'
                              }`}>
                                {getTimelineIcon(entry.type)}
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {getTimelineLabel(entry.type)}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                  {entry.doctor}
                                </span>
                                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                                  {entry.time}
                                </span>
                              </div>
                            </div>
                            <AttachmentButton
                              attachments={entry.attachments}
                              onOpen={doc => setLightboxDoc(doc)}
                            />
                          </div>

                          {/* Clinical fields */}
                          <div className="mt-3 space-y-2 text-sm">
                            {entry.complaints && (
                              <div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Жалобы: </span>
                                <span className="text-gray-700 dark:text-gray-300">{entry.complaints}</span>
                              </div>
                            )}
                            {entry.status && (
                              <div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Объективный статус: </span>
                                <span className="text-gray-700 dark:text-gray-300">{entry.status}</span>
                              </div>
                            )}
                            {entry.diagnosis && (
                              <div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Диагноз: </span>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">{entry.diagnosis}</span>
                              </div>
                            )}
                            {entry.dynamics && (
                              <div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Динамика: </span>
                                <span className="text-gray-700 dark:text-gray-300">{entry.dynamics}</span>
                              </div>
                            )}
                          </div>

                          {/* Multiple attachment chips */}
                          {entry.attachments.length > 1 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {entry.attachments.map((att, aIdx) => (
                                <button
                                  key={aIdx}
                                  onClick={() => setLightboxDoc(att)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-[#1e293b] text-gray-600 dark:text-gray-300 hover:bg-[#c9a96e]/10 hover:text-[#c9a96e] transition-colors border border-gray-200 dark:border-[#253041]"
                                >
                                  <Paperclip className="w-3 h-3" />
                                  {att.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Sub-tab B: Documents & Media ── */}
            {historySubTab === 'documents' && (
              <div>
                {/* Filter bar */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                  <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-[#1e293b] rounded-lg">
                    {docFilters.map(f => (
                      <button
                        key={f.key}
                        onClick={() => setDocFilter(f.key)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                          docFilter === f.key
                            ? 'bg-[#c9a96e] text-white'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Поиск документов..."
                      value={docSearch}
                      onChange={e => setDocSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#253041] bg-white dark:bg-[#0d1424] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/30 focus:border-[#c9a96e]"
                    />
                  </div>

                  <div className="sm:ml-auto flex items-center gap-1 p-1 bg-gray-100 dark:bg-[#1e293b] rounded-lg">
                    <button
                      onClick={() => setDocViewMode('grid')}
                      className={`p-1.5 rounded-md transition-colors ${
                        docViewMode === 'grid'
                          ? 'bg-white dark:bg-[#151e2e] text-[#c9a96e] shadow-sm'
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDocViewMode('table')}
                      className={`p-1.5 rounded-md transition-colors ${
                        docViewMode === 'table'
                          ? 'bg-white dark:bg-[#151e2e] text-[#c9a96e] shadow-sm'
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Grid View */}
                {docViewMode === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDocs.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => setLightboxDoc({ name: doc.name, type: doc.type })}
                        className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-4 text-left hover:shadow-md hover:border-[#c9a96e]/30 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getDocTypeBg(doc.type)}`}>
                            {getDocTypeIcon(doc.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-[#c9a96e] transition-colors">
                              {doc.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {doc.eventLabel}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#253041] flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                          <span>Загрузил: {doc.uploadedBy}</span>
                          <span>{doc.eventDate}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Table View */}
                {docViewMode === 'table' && (
                  <div className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-[#253041]">
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Файл</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Тип</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Дата загрузки</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Дата события</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Загрузил</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-[#253041]">
                          {filteredDocs.map(doc => (
                            <tr
                              key={doc.id}
                              onClick={() => setLightboxDoc({ name: doc.name, type: doc.type })}
                              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1e293b]/50 transition-colors"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${getDocTypeBg(doc.type)}`}>
                                    {getDocTypeIcon(doc.type)}
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px]">{doc.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 uppercase text-xs">{doc.type}</td>
                              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{doc.uploadDate}</td>
                              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{doc.eventDate}</td>
                              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{doc.uploadedBy}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {filteredDocs.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Документы не найдены</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======== Tab 3: Treatment Plan ======== */}
        {activeTab === 'plan' && <TreatmentPlan />}

        {/* ======== Tab 4: Discharge ======== */}
        {activeTab === 'discharge' && <DischargeEpicrisis />}
      </div>

      {/* ── Lightbox Modal ───────────────────────────────────────────── */}
      {lightboxDoc && (
        <AttachmentLightbox
          doc={lightboxDoc}
          onClose={() => setLightboxDoc(null)}
        />
      )}
    </div>
  )
}