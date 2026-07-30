'use client'

import { useState } from 'react'
import {
  ChevronRight,
  FileText,
  Download,
  Eye,
  Clock,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Coins,
  Calendar,
  BadgeCheck,
  ChevronDown,
} from 'lucide-react'

interface LabResult {
  id: number
  name: string
  category: string
  date: string
  doctor: string
  status: 'normal' | 'warning' | 'critical' | 'pending'
  hasReport: boolean
  price: number
  isPaid: boolean
  isFree: boolean
}

const labResults: LabResult[] = [
  {
    id: 1,
    name: 'Общий анализ крови (ОАК)',
    category: 'Гематология',
    date: '13.05.2026',
    doctor: 'Козлова М.И.',
    status: 'normal',
    hasReport: true,
    price: 800,
    isPaid: true,
    isFree: false,
  },
  {
    id: 2,
    name: 'Биохимический анализ крови',
    category: 'Биохимия',
    date: '13.05.2026',
    doctor: 'Козлова М.И.',
    status: 'normal',
    hasReport: true,
    price: 1500,
    isPaid: true,
    isFree: false,
  },
  {
    id: 3,
    name: 'Общий анализ мочи',
    category: 'Урология',
    date: '13.05.2026',
    doctor: 'Козлова М.И.',
    status: 'warning',
    hasReport: true,
    price: 400,
    isPaid: true,
    isFree: false,
  },
  {
    id: 4,
    name: 'ЭКГ в покое',
    category: 'Функциональная диагностика',
    date: '14.05.2026',
    doctor: 'Смирнова Н.А.',
    status: 'normal',
    hasReport: true,
    price: 1200,
    isPaid: true,
    isFree: false,
  },
  {
    id: 5,
    name: 'Рентгенография поясничного отдела',
    category: 'Рентгенология',
    date: '10.05.2026',
    doctor: 'Волков Д.С.',
    status: 'normal',
    hasReport: true,
    price: 2000,
    isPaid: true,
    isFree: false,
  },
  {
    id: 6,
    name: 'УЗИ органов брюшной полости',
    category: 'УЗИ',
    date: '15.05.2026',
    doctor: 'Белова О.П.',
    status: 'pending',
    hasReport: false,
    price: 1800,
    isPaid: false,
    isFree: false,
  },
  {
    id: 7,
    name: 'Спирометрия',
    category: 'Пульмонология',
    date: '16.05.2026',
    doctor: 'Смирнова Н.А.',
    status: 'pending',
    hasReport: false,
    price: 900,
    isPaid: false,
    isFree: false,
  },
]

interface Conclusion {
  id: number
  title: string
  type: string
  date: string
  doctor: string
  summary: string
}

const conclusions: Conclusion[] = [
  {
    id: 1,
    title: 'Заключение по результатам ЭКГ',
    type: 'Кардиология',
    date: '14.05.2026',
    doctor: 'Смирнова Н.А.',
    summary: 'Ритм синусовый, правильный. ЧСС 72 уд/мин. ЭОС не отклонена. Pathology not detected.',
  },
  {
    id: 2,
    title: 'Описание рентгенограммы',
    type: 'Рентгенология',
    date: '10.05.2026',
    doctor: 'Волков Д.С.',
    summary: 'Умеренные дегенеративно-дистрофические изменения поясничного отдела позвоночника. Уменьшение высоты межпозвонковых дисков L4-L5, L5-S1. Костных разрастаний не выявлено.',
  },
]

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  normal: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    label: 'Норма',
    color: 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30',
  },
  warning: {
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    label: 'Отклонение',
    color: 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30',
  },
  critical: {
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: 'Критично',
    color: 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30',
  },
  pending: {
    icon: <Clock className="w-3.5 h-3.5" />,
    label: 'Ожидает',
    color: 'bg-gray-100 dark:bg-[#1e293b] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#253041]',
  },
}

type Section = 'lab' | 'conclusions'

export function AnalysesPage() {
  const [activeSection, setActiveSection] = useState<Section>('lab')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedLab, setExpandedLab] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Курортный комплекс</span>
        <ChevronRight className="w-3 h-3" />
        <span>Кабинет пациента</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#5ecece] font-medium">Анализы и заключения</span>
      </div>

      {/* Section tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1e293b] rounded-lg p-1">
          <button
            onClick={() => setActiveSection('lab')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeSection === 'lab'
                ? 'bg-white dark:bg-[#151e2e] text-[#5ecece] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Анализы
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-200 dark:bg-[#253041] text-gray-600 dark:text-gray-400">
              {labResults.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSection('conclusions')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeSection === 'conclusions'
                ? 'bg-white dark:bg-[#151e2e] text-[#5ecece] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Заключения
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-200 dark:bg-[#253041] text-gray-600 dark:text-gray-400">
              {conclusions.length}
            </span>
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск..."
            className="pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-[#0b1120] border border-gray-200 dark:border-[#253041] rounded-lg text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#5ecece]/50 focus:border-[#5ecece] w-48"
          />
        </div>
      </div>

      {/* Lab Results */}
      {activeSection === 'lab' && (
        <div className="space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-4">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Всего</span>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{labResults.length}</p>
            </div>
            <div className="bg-white dark:bg-[#151e2e] rounded-xl border border-emerald-200 dark:border-emerald-800/30 p-4">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Норма</span>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {labResults.filter(l => l.status === 'normal').length}
              </p>
            </div>
            <div className="bg-white dark:bg-[#151e2e] rounded-xl border border-amber-200 dark:border-amber-800/30 p-4">
              <span className="text-[11px] text-amber-600 dark:text-amber-400 uppercase tracking-wider">Отклонения</span>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {labResults.filter(l => l.status === 'warning').length}
              </p>
            </div>
            <div className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-4">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ожидает</span>
              <p className="text-2xl font-bold text-gray-500 dark:text-gray-400 mt-1">
                {labResults.filter(l => l.status === 'pending').length}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-gray-50 dark:bg-[#1e293b] border-b border-gray-200 dark:border-[#253041]">
              <div className="col-span-5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Исследование</div>
              <div className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Дата</div>
              <div className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Статус</div>
              <div className="col-span-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Цена</div>
              <div className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Действия</div>
            </div>

            {/* Table rows */}
            {labResults.map((lab) => (
              <div
                key={lab.id}
                className="grid grid-cols-12 gap-2 items-center px-5 py-3 border-b border-gray-100 dark:border-[#253041]/50 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-[#1e293b]/30 transition-colors cursor-pointer"
                onClick={() => setExpandedLab(expandedLab === lab.id ? null : lab.id)}
              >
                {/* Name + Category */}
                <div className="col-span-5 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{lab.name}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{lab.category} · {lab.doctor}</p>
                </div>

                {/* Date */}
                <div className="col-span-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{lab.date}</span>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${statusConfig[lab.status].color}`}>
                    {statusConfig[lab.status].icon}
                    {statusConfig[lab.status].label}
                  </span>
                </div>

                {/* Price */}
                <div className="col-span-1 text-right">
                  {lab.isFree ? (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Бесплатно</span>
                  ) : (
                    <div className="flex items-center justify-end gap-0.5">
                      <Coins className="w-3 h-3 text-[#5ecece]" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{lab.price.toLocaleString('ru-RU')}</span>
                    </div>
                  )}
                </div>

                {/* Payment + Actions */}
                <div className="col-span-2 flex items-center justify-end gap-1">
                  {!lab.isFree && !lab.isPaid && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">
                      Не оплачено
                    </span>
                  )}
                  {!lab.isFree && lab.isPaid && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
                      Оплачено
                    </span>
                  )}
                  {lab.hasReport && (
                    <button className="p-1.5 rounded-md text-gray-400 hover:text-[#5ecece] hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button className="p-1.5 rounded-md text-gray-400 hover:text-[#5ecece] hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${expandedLab === lab.id ? 'rotate-180' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conclusions */}
      {activeSection === 'conclusions' && (
        <div className="space-y-4">
          {conclusions.map((c) => (
            <div key={c.id} className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-5 hover:border-[#5ecece]/20 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <BadgeCheck className="w-4 h-4 text-[#5ecece]" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{c.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                    <span>{c.type}</span>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{c.date}</span>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <span>{c.doctor}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-md text-gray-400 hover:text-[#5ecece] hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-md text-gray-400 hover:text-[#5ecece] hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-[#0b1120] rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{c.summary}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
