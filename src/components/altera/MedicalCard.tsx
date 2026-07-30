'use client'

import { useState } from 'react'
import {
  ChevronRight,
  FileText,
  Paperclip,
  Download,
  Eye,
  Plus,
  Clock,
  User,
  Filter,
  Search,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Stethoscope,
} from 'lucide-react'

type TabType = 'chronology' | 'documents'

interface ChronologyEntry {
  id: number
  date: string
  time: string
  type: 'visit' | 'procedure' | 'lab' | 'note' | 'diagnosis'
  title: string
  doctor: string
  description: string
  hasAttachment?: boolean
  attachmentName?: string
}

interface Document {
  id: number
  name: string
  type: 'pdf' | 'image' | 'lab-result'
  date: string
  size: string
  linkedDate?: string
  description: string
}

const chronologyData: ChronologyEntry[] = [
  {
    id: 1,
    date: '15.05.2026',
    time: '09:30',
    type: 'visit',
    title: 'Приём лечащего врача',
    doctor: 'Петрова Е.Н.',
    description: 'Осмотр пациента. Жалобы на ноющую боль в поясничном отделе позвоночника. Назначены грязевые аппликации и массаж. Рекомендовано продолжение ЛФК. Состояние удовлетворительное.',
    hasAttachment: true,
    attachmentName: 'Назначения_15_05.pdf',
  },
  {
    id: 2,
    date: '14.05.2026',
    time: '10:00',
    type: 'procedure',
    title: 'Грязевые аппликации на поясницу',
    doctor: 'Сидорова А.В.',
    description: 'Процедура пройдена без осложнений. Температура грязи 40°C, экспозиция 20 минут. Пациент отмечает уменьшение болевого синдрома.',
  },
  {
    id: 3,
    date: '13.05.2026',
    time: '14:00',
    type: 'lab',
    title: 'Результаты анализов крови',
    doctor: 'Козлова М.И.',
    description: 'Общий анализ крови: Hb 135 г/л, лейкоциты 5.8×10⁹/л, СОЭ 8 мм/ч. Биохимия: глюкоза 5.2 ммоль/л, холестерин 5.1 ммоль/л. Показатели в пределах нормы.',
    hasAttachment: true,
    attachmentName: 'Анализ_крови_13_05.pdf',
  },
  {
    id: 4,
    date: '12.05.2026',
    time: '11:00',
    type: 'visit',
    title: 'Первичный приём. Постановка на учёт',
    doctor: 'Петрова Е.Н.',
    description: 'Пациент Иванов И.М., 58 лет. Диагноз: остеохондроз поясничного отдела позвоночника, хронический рецидивирующий. Назначена программа восстановления опорно-двигательного аппарата на 14 дней.',
    hasAttachment: true,
    attachmentName: 'Карта_постановки.pdf',
  },
  {
    id: 5,
    date: '12.05.2026',
    time: '08:30',
    type: 'diagnosis',
    title: 'Диагноз основного заболевания',
    doctor: 'Петрова Е.Н.',
    description: 'МКБ-10: M54.5 — Боль в нижней части спины. Сопутствующий: I10 — Эссенциальная гипертензия.',
  },
]

const documentsData: Document[] = [
  { id: 1, name: 'Назначения_15_05.pdf', type: 'pdf', date: '15.05.2026', size: '245 КБ', linkedDate: '15.05.2026', description: 'Назначения лечащего врача' },
  { id: 2, name: 'Анализ_крови_13_05.pdf', type: 'lab-result', date: '13.05.2026', size: '1.2 МБ', linkedDate: '13.05.2026', description: 'Общий и биохимический анализ крови' },
  { id: 3, name: 'Карта_постановки.pdf', type: 'pdf', date: '12.05.2026', size: '380 КБ', linkedDate: '12.05.2026', description: 'Карта первичного осмотра и постановки на учёт' },
  { id: 4, name: 'Рентген_поясница.jpg', type: 'image', date: '10.05.2026', size: '4.8 МБ', linkedDate: '12.05.2026', description: 'Рентгенограмма поясничного отдела позвоночника' },
  { id: 5, name: 'Справка_медицинская.pdf', type: 'pdf', date: '08.05.2026', size: '156 КБ', linkedDate: undefined, description: 'Медицинская справка из поликлиники' },
  { id: 6, name: 'Результаты_анализов_поликлиника.pdf', type: 'lab-result', date: '05.05.2026', size: '1.29 МБ', linkedDate: undefined, description: 'Предварительные анализы из поликлиники' },
]

const typeIcons: Record<string, React.ReactNode> = {
  visit: <Stethoscope className="w-4 h-4" />,
  procedure: <CheckCircle2 className="w-4 h-4" />,
  lab: <FileText className="w-4 h-4" />,
  note: <AlertCircle className="w-4 h-4" />,
  diagnosis: <XCircle className="w-4 h-4" />,
}

const typeColors: Record<string, string> = {
  visit: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  procedure: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  lab: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  note: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  diagnosis: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
}

export function MedicalCard() {
  const [activeTab, setActiveTab] = useState<TabType>('chronology')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Курортный комплекс</span>
        <ChevronRight className="w-3 h-3" />
        <span>Кабинет пациента</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#5ecece] font-medium">Медицинская карта</span>
      </div>

      {/* Patient Header */}
      <div className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#5ecece]/10 border border-[#5ecece]/20 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-[#5ecece]" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100">
                Иванов Иван Михайлович
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500 dark:text-gray-400">58 лет</span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Мужской</span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Корпус 2, № 314</span>
              </div>
            </div>
          </div>
          <div className="md:ml-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              На лечении
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-[#1e293b] text-gray-600 dark:text-gray-400 font-medium">
              С 12.05.2026
            </span>
          </div>
        </div>

        {/* Quick diagnosis */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#253041]">
          <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Основной диагноз</p>
          <p className="text-sm text-gray-900 dark:text-gray-100">
            <span className="font-mono text-[#5ecece] mr-1.5">M54.5</span>
            Боль в нижней части спины · Хронический остеохондроз поясничного отдела
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1e293b] rounded-lg p-1">
          <button
            onClick={() => setActiveTab('chronology')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'chronology'
                ? 'bg-white dark:bg-[#151e2e] text-[#5ecece] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Хронология
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'documents'
                ? 'bg-white dark:bg-[#151e2e] text-[#5ecece] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Документы
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-200 dark:bg-[#253041] text-gray-600 dark:text-gray-400">
              {documentsData.length}
            </span>
          </button>
        </div>

        {activeTab === 'chronology' && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск записей..."
                className="pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-[#0b1120] border border-gray-200 dark:border-[#253041] rounded-lg text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#5ecece]/50 focus:border-[#5ecece] w-48"
              />
            </div>
          </div>
        )}
      </div>

      {/* Chronology Tab */}
      {activeTab === 'chronology' && (
        <div className="space-y-4">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200 dark:bg-[#253041]" />

            {chronologyData.map((entry, idx) => (
              <div key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Timeline dot */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-white dark:bg-[#151e2e] border-2 border-gray-200 dark:border-[#253041] flex items-center justify-center shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${typeColors[entry.type]}`}>
                    {typeIcons[entry.type]}
                  </div>
                </div>

                {/* Content card */}
                <div className="flex-1 bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-4 hover:border-[#5ecece]/20 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {entry.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{entry.date}, {entry.time}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                          <User className="w-3 h-3" />
                          <span>{entry.doctor}</span>
                        </div>
                      </div>
                    </div>
                    {entry.hasAttachment && (
                      <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#5ecece]/10 text-[#5ecece] text-[11px] font-medium hover:bg-[#5ecece]/20 transition-colors shrink-0">
                        <Paperclip className="w-3 h-3" />
                        <span className="hidden sm:inline">{entry.attachmentName}</span>
                        <span className="sm:hidden">Файл</span>
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {entry.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-3">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-[#1e293b] text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#253041] transition-colors">
                <Filter className="w-3 h-3" />
                Фильтр
              </button>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {documentsData.length} документов
              </span>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#5ecece] text-white text-xs font-medium hover:bg-[#4bb8b8] transition-colors">
              <Plus className="w-3 h-3" />
              Загрузить документ
            </button>
          </div>

          {/* Documents list */}
          <div className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] divide-y divide-gray-200 dark:divide-[#253041]">
            {documentsData.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-[#1e293b]/30 transition-colors"
              >
                {/* File icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  doc.type === 'pdf' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                  doc.type === 'image' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                  'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                }`}>
                  <FileText className="w-5 h-5" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {doc.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">{doc.size}</span>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">{doc.date}</span>
                    {doc.linkedDate && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">·</span>
                        <span className="flex items-center gap-0.5 text-[11px] text-[#5ecece]">
                          <Paperclip className="w-2.5 h-2.5" />
                          Привязан к {doc.linkedDate}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{doc.description}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors" title="Просмотр">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors" title="Скачать">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
