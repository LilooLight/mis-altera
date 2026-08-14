'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import {
  LayoutGrid,
  List,
  Table2,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  MapPin,
} from 'lucide-react'
import { allPatients } from '@/data/patients'

interface PatientRegistryProps {
  onOpenPatient: (patient: { id: number; name: string; shortName: string; initials: string; room: string; hasNewAnalyses: boolean }) => void
}

type ViewMode = 'cards' | 'list' | 'table'
type FilterMode = 'my' | 'all'

interface Patient {
  id: number
  fio: string
  age: number
  diagnosis: string
  doctor: string
  room: string
  checkIn: string
  checkOut: string
  status: 'active' | 'completed'
  progress: number
  daysTotal: number
  overdue: boolean
  hasNewAnalyses: boolean
}

const patients: Patient[] = allPatients.map(p => ({
  id: p.profile.id,
  fio: p.profile.name,
  age: p.profile.age,
  diagnosis: p.profile.diagnosis,
  doctor: p.profile.doctor,
  room: p.profile.room === '—' ? 'Амб.' : p.profile.room,
  checkIn: p.profile.checkIn.split('.').reverse().join('-'),
  checkOut: p.profile.checkOut.split('.').reverse().join('-'),
  status: (p.profile.status === 'Выписан' || p.profile.status === 'Архив') ? 'completed' : 'active',
  progress: p.profile.daysElapsed,
  daysTotal: p.profile.daysTotal,
  overdue: p.profile.daysElapsed > p.profile.daysTotal,
  hasNewAnalyses: p.visits.length > 0 && p.visits.some(v => v.attachments.length > 0),
}))

const MY_DOCTOR = 'Иванов И.М.'

function getInitials(fio: string): string {
  const parts = fio.split(' ')
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function StatusBadge({ status, overdue }: { status: string; overdue: boolean }) {
  if (overdue) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/40">
        <AlertTriangle className="w-3 h-3" />
        Просрочено
      </span>
    )
  }
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600/40">
        <CheckCircle2 className="w-3 h-3" />
        Завершено
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
      <Clock className="w-3 h-3" />
      На лечении
    </span>
  )
}

function StatusDot({ status, overdue }: { status: string; overdue: boolean }) {
  if (overdue) {
    return <span className="w-2.5 h-2.5 rounded-full bg-red-500" title="Просрочено" />
  }
  if (status === 'completed') {
    return <span className="w-2.5 h-2.5 rounded-full bg-gray-400 dark:bg-gray-500" title="Завершено" />
  }
  return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="На лечении" />
}

function ProgressBar({ progress, daysTotal }: { progress: number; daysTotal: number }) {
  const pct = Math.min(Math.round((progress / daysTotal) * 100), 100)
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-gray-500 dark:text-gray-400">День {progress} из {daysTotal}</span>
        <span className="font-medium text-gray-700 dark:text-gray-300">{pct}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-700/50">
        <div
          className="h-full rounded-full bg-[#5ecece] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

type SortKey = 'fio' | 'age' | 'diagnosis' | 'doctor' | 'room' | 'checkIn' | 'checkOut'
type SortDir = 'asc' | 'desc'

export function PatientRegistry({ onOpenPatient }: PatientRegistryProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [filterMode, setFilterMode] = useState<FilterMode>('my')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('fio')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const searchRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const ITEMS_PER_PAGE = 5

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredPatients = useMemo(() => {
    let list = [...patients]
    if (filterMode === 'my') {
      list = list.filter(p => p.doctor === MY_DOCTOR)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p => p.fio.toLowerCase().includes(q))
    }
    return list
  }, [filterMode, searchQuery])

  const sortedPatients = useMemo(() => {
    const arr = [...filteredPatients]
    arr.sort((a, b) => {
      let va: string | number = a[sortKey]
      let vb: string | number = b[sortKey]
      if (typeof va === 'string') va = va.toLowerCase()
      if (typeof vb === 'string') vb = vb.toLowerCase()
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return arr
  }, [filteredPatients, sortKey, sortDir])

  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedPatients.slice(start, start + ITEMS_PER_PAGE)
  }, [sortedPatients, currentPage])

  const totalPages = Math.ceil(sortedPatients.length / ITEMS_PER_PAGE)

  const searchSuggestions = useMemo(() => {
    if (!searchFocused && !showSearchDropdown) return []
    if (!searchQuery.trim()) {
      return patients.slice(0, 4).map(p => p.fio)
    }
    const q = searchQuery.toLowerCase()
    return patients.filter(p => p.fio.toLowerCase().includes(q)).slice(0, 4).map(p => p.fio)
  }, [searchQuery, searchFocused, showSearchDropdown])

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function handleSearchSelect(name: string) {
    setSearchQuery(name)
    setShowSearchDropdown(false)
    setSearchFocused(false)
  }

  function handleOpenPatient(patient: Patient) {
    onOpenPatient({
      id: patient.id,
      name: patient.fio,
      shortName: patient.fio.split(' ').slice(0, 2).join(' '),
      initials: patient.fio.split(' ').map(n => n[0]).join('').slice(0, 2),
      room: patient.room,
      hasNewAnalyses: patient.hasNewAnalyses,
    })
  }

  const viewModes: { key: ViewMode; icon: typeof LayoutGrid; label: string }[] = [
    { key: 'cards', icon: LayoutGrid, label: 'Карточки' },
    { key: 'list', icon: List, label: 'Список' },
    { key: 'table', icon: Table2, label: 'Таблица' },
  ]

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
    return sortDir === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 text-[#5ecece]" />
      : <ChevronDown className="w-3.5 h-3.5 text-[#5ecece]" />
  }

  const tableColumns: { key: SortKey; label: string; sortable: boolean }[] = [
    { key: 'fio', label: 'ФИО', sortable: true },
    { key: 'age', label: 'Возраст', sortable: true },
    { key: 'diagnosis', label: 'Диагноз', sortable: true },
    { key: 'doctor', label: 'Лечащий врач', sortable: true },
    { key: 'room', label: 'Комната', sortable: true },
    { key: 'checkIn', label: 'Дата заезда', sortable: true },
    { key: 'checkOut', label: 'Дата выезда', sortable: true },
  ]

  return (
    <div className="space-y-6">
      {/* ====== HEADER ====== */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
            Реестр пациентов
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Управление списком пациентов и отслеживание лечения
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* View Switcher */}
          <div className="flex items-center bg-gray-100 dark:bg-[#30363D] rounded-lg p-0.5">
            {viewModes.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => { setViewMode(key); setCurrentPage(1) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  viewMode === key
                    ? 'bg-white dark:bg-[#21262D] text-[#5ecece] shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-label={label}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-[#30363D] rounded-lg p-0.5">
            <button
              onClick={() => { setFilterMode('my'); setCurrentPage(1) }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                filterMode === 'my'
                  ? 'bg-white dark:bg-[#21262D] text-[#5ecece] shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Мои пациенты
            </button>
            <button
              onClick={() => { setFilterMode('all'); setCurrentPage(1) }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-[#21262D] text-[#5ecece] shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Все пациенты санатория
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                onFocus={() => { setSearchFocused(true); setShowSearchDropdown(true) }}
                onBlur={() => setTimeout(() => { setSearchFocused(false); setShowSearchDropdown(false) }, 200) }
                placeholder="Поиск по ФИО..."
                className="w-full sm:w-64 pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#21262D] border border-gray-200 dark:border-[#373E47] rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5ecece]/40 focus:border-[#5ecece] transition-colors"
              />
            </div>

            {/* Search Dropdown */}
            {showSearchDropdown && searchSuggestions.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#30363D] border border-gray-200 dark:border-[#373E47] rounded-lg shadow-lg z-20 overflow-hidden"
              >
                {searchSuggestions.map((name) => (
                  <button
                    key={name}
                    onMouseDown={() => handleSearchSelect(name)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#373E47] transition-colors text-left"
                  >
                    <User className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====== RESULTS COUNT ====== */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Найдено пациентов: <span className="font-medium text-gray-700 dark:text-gray-300">{filteredPatients.length}</span>
        {filterMode === 'my' && (
          <span className="ml-2">· Врач: {MY_DOCTOR}</span>
        )}
      </div>

      {/* ====== CARDS VIEW ====== */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => handleOpenPatient(patient)}
              className="group relative bg-white dark:bg-[#21262D] border border-gray-200 dark:border-[#373E47] rounded-xl p-5 hover:shadow-lg hover:shadow-[#5ecece]/5 transition-all duration-200 hover:border-l-[#5ecece] cursor-pointer"
            >
              {patient.hasNewAnalyses && (
                <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-medium text-blue-700 dark:text-blue-400">Новые анализы</span>
                </span>
              )}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#5ecece]/10 border-2 border-[#5ecece]/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-[#5ecece]">
                    {getInitials(patient.fio)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                      {patient.fio}
                    </h3>
                    <div className="flex-shrink-0">
                      <StatusBadge status={patient.status} overdue={patient.overdue} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {patient.diagnosis.split(' — ')[0]}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span>Комната {patient.room}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <User className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span>{patient.doctor}</span>
                </div>
                <ProgressBar progress={patient.progress} daysTotal={patient.daysTotal} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ====== LIST VIEW ====== */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-[#21262D] border border-gray-200 dark:border-[#373E47] rounded-xl overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-[#373E47]">
            {filteredPatients.map((patient, idx) => (
              <div
                key={patient.id}
                onClick={() => handleOpenPatient(patient)}
                className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-[#30363D] ${
                  idx % 2 === 1 ? 'bg-gray-50/50 dark:bg-[#30363D]/30' : ''
                }`}
              >
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <StatusDot status={patient.status} overdue={patient.overdue} />
                  {patient.hasNewAnalyses && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" title="Новые анализы" />
                  )}
                </div>
                <div className="w-8 h-8 rounded-full bg-[#5ecece]/10 border border-[#5ecece]/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-semibold text-[#5ecece]">
                    {getInitials(patient.fio)}
                  </span>
                </div>
                <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-1 items-center">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {patient.fio}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{patient.age} лет</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-gray-600 dark:text-gray-300 truncate block">
                      {patient.diagnosis.split(' — ')[0]}
                    </span>
                  </div>
                  <div className="hidden lg:block">
                    <span className="text-xs text-gray-600 dark:text-gray-300">{patient.doctor}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">{patient.room}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 max-w-[180px]">
                  {patient.hasNewAnalyses && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Анализы
                    </span>
                  )}
                  <StatusBadge status={patient.status} overdue={patient.overdue} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====== TABLE VIEW ====== */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-[#21262D] border border-gray-200 dark:border-[#373E47] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#30363D] border-b border-gray-200 dark:border-[#373E47]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                    №
                  </th>
                  {tableColumns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                        col.sortable ? 'cursor-pointer hover:text-[#5ecece] dark:hover:text-[#5ecece] select-none' : ''
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {col.sortable && <SortIcon col={col.key} />}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#373E47]">
                {paginatedPatients.map((patient, idx) => (
                  <tr
                    key={patient.id}
                    onClick={() => handleOpenPatient(patient)}
                    className={`transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-[#30363D] cursor-pointer ${
                      idx % 2 === 1 ? 'bg-gray-50/30 dark:bg-[#30363D]/20' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500">
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {patient.fio}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {patient.age}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {patient.diagnosis}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {patient.doctor}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {patient.room}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {formatDate(patient.checkIn)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {formatDate(patient.checkOut)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {patient.hasNewAnalyses && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Новые анализы
                          </span>
                        )}
                        {patient.overdue && (
                          <StatusBadge status={patient.status} overdue={patient.overdue} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-[#373E47] bg-gray-50 dark:bg-[#30363D]">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Страница {currentPage} из {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border border-gray-200 dark:border-[#373E47] bg-white dark:bg-[#21262D] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#30363D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Назад
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded-md transition-colors ${
                      currentPage === page
                        ? 'bg-[#5ecece] text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#373E47]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border border-gray-200 dark:border-[#373E47] bg-white dark:bg-[#21262D] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#30363D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Далее
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====== EMPTY STATE ====== */}
      {filteredPatients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#30363D] flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Пациенты не найдены
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            Попробуйте изменить параметры поиска или переключить фильтр
          </p>
        </div>
      )}
    </div>
  )
}
