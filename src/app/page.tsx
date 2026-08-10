'use client'

import { useState, useCallback } from 'react'
import { Search, X, MessageSquare, Palette } from 'lucide-react'
import { Header } from '@/components/altera/Header'
import { PatientRegistry } from '@/components/altera/PatientRegistry'
import { PatientCard } from '@/components/altera/PatientCard'
import { DoctorScheduler } from '@/components/altera/DoctorScheduler'
import Dashboard from '@/components/altera/Dashboard'
import { UIKitPage } from '@/components/altera/UIKitPage'
import { MessengerPage } from '@/components/altera/MessengerPage'
import { StubPage } from '@/components/altera/StubPage'

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */

type Role = 'doctor' | 'patient' | 'admin'

interface PatientInfo {
  id: number
  name: string
  shortName: string
  initials: string
  room: string
  hasNewAnalyses: boolean
}

interface SystemTab {
  id: string
  type: 'system'
  label: string
  icon: string
}

interface PatientTab {
  id: string
  type: 'patient'
  label: string
  room: string
  initials: string
  patientId: number
}

type Tab = SystemTab | PatientTab

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */

export const PATIENTS: PatientInfo[] = [
  { id: 1, name: 'Петрова Анна Сергеевна', shortName: 'Петрова А.С.', initials: 'ПА', room: '314', hasNewAnalyses: true },
  { id: 2, name: 'Козлов Дмитрий Александрович', shortName: 'Козлов Д.А.', initials: 'КД', room: '215', hasNewAnalyses: false },
  { id: 3, name: 'Волкова Марина Николаевна', shortName: 'Волкова М.Н.', initials: 'ВМ', room: '307', hasNewAnalyses: true },
  { id: 4, name: 'Новиков Алексей Викторович', shortName: 'Новиков А.В.', initials: 'НА', room: '223', hasNewAnalyses: false },
  { id: 5, name: 'Кузнецова Ольга Андреевна', shortName: 'Кузнецова О.А.', initials: 'КО', room: '409', hasNewAnalyses: false },
  { id: 6, name: 'Соколов Павел Дмитриевич', shortName: 'Соколов П.Д.', initials: 'СП', room: '116', hasNewAnalyses: true },
  { id: 7, name: 'Смирнова Елена Владимировна', shortName: 'Смирнова Е.В.', initials: 'СЕ', room: '412', hasNewAnalyses: false },
  { id: 8, name: 'Морозов Игорь Петрович', shortName: 'Морозов И.П.', initials: 'МИ', room: '118', hasNewAnalyses: false },
]

const INITIAL_TABS: Tab[] = [
  { id: 'dashboard', type: 'system', label: 'Рабочий стол', icon: '🏠' },
  { id: 'registry', type: 'system', label: 'Реестр', icon: '📋' },
]

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */

export default function Home() {
  const [role, setRole] = useState<Role>('doctor')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tabs, setTabs] = useState<Tab[]>(INITIAL_TABS)
  const [activeTabId, setActiveTabId] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  /* ─── Tab Management ─── */

  const openPatient = useCallback((patient: PatientInfo) => {
    const tabId = `patient-${patient.id}`
    setTabs(prev => {
      if (!prev.find(t => t.id === tabId)) {
        return [...prev, {
          id: tabId, type: 'patient' as const,
          label: patient.shortName, room: patient.room,
          initials: patient.initials, patientId: patient.id,
        }]
      }
      return prev
    })
    setActiveTabId(tabId)
  }, [])

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const idx = prev.findIndex(t => t.id === tabId)
      const filtered = prev.filter(t => t.id !== tabId)
      if (activeTabId === tabId) {
        const newIdx = Math.max(0, Math.min(idx, filtered.length - 1))
        setActiveTabId(filtered[newIdx]?.id || 'dashboard')
      }
      return filtered
    })
  }, [activeTabId])

  const openToolTab = useCallback((toolId: string, label: string) => {
    if (!tabs.find(t => t.id === toolId)) {
      setTabs(prev => [...prev, { id: toolId, type: 'system' as const, label, icon: label === 'UI-Kit' ? '🎨' : '💬' }])
    }
    setActiveTabId(toolId)
  }, [tabs])

  /* ─── Search ─── */

  const searchResults = searchQuery.length >= 2
    ? PATIENTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : []

  const handleSearchSelect = (patient: PatientInfo) => {
    openPatient(patient)
    setSearchQuery('')
    setSearchFocused(false)
  }

  /* ─── Active tab info ─── */

  const activeTab = tabs.find(t => t.id === activeTabId)
  const isSystemTab = activeTab?.type === 'system'
  const isPatientTab = activeTab?.type === 'patient'
  const tabLabel = activeTab?.label || ''

  const breadcrumbText = isPatientTab
    ? `МИС Альтера / ${tabLabel} / № ${(activeTab as PatientTab)?.room}`
    : `МИС Альтера / ${tabLabel}`

  /* ─── Render: Patient / Admin Stub ─── */

  if (role !== 'doctor') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120]">
          <Header currentRole={role} onRoleChange={setRole} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <StubPage role={role} onSwitchToDoctor={() => setRole('doctor')} />
        </div>
    )
  }

  /* ─── Render: Doctor Workspace ─── */

  const patientTabs = tabs.filter(t => t.type === 'patient')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120] transition-colors duration-300">
        {/* ═══ HEADER ═══ */}
        <Header currentRole={role} onRoleChange={setRole} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* ═══ TAB BAR ═══ */}
        <div className="flex items-center border-b border-gray-200 dark:border-[#253041] bg-white dark:bg-[#0f1729] overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId
            const isClosable = tab.type === 'patient' || (tab.type === 'system' && tab.id !== 'dashboard' && tab.id !== 'registry')

            return (
              <div
                key={tab.id}
                className={`group flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap cursor-pointer border-b-2 transition-colors select-none shrink-0 ${
                  isActive
                    ? 'border-[#5ecece] text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#0b1120]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a2538]'
                }`}
                onClick={() => setActiveTabId(tab.id)}
              >
                <span className="text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.type === 'patient' && (
                  <span className={`text-[10px] px-1 py-px rounded font-medium ${
                    isActive ? 'bg-gray-200 dark:bg-[#253041] text-gray-600 dark:text-gray-400' : 'bg-gray-100 dark:bg-[#1e293b] text-gray-400 dark:text-gray-500'
                  }`}>
                    {(tab as PatientTab).room}
                  </span>
                )}
                {isClosable && (
                  <button
                    onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}
                    className={`ml-1 p-0.5 rounded transition-colors ${
                      isActive
                        ? 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#253041]'
                        : 'text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#253041]'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* ═══ MAIN LAYOUT ═══ */}
        <div className="flex" style={{ height: 'calc(100vh - 56px - 42px)' }}>

          {/* ═══ SIDEBAR ═══ */}
          <aside className={`${sidebarOpen ? 'w-60' : 'w-14'} bg-white dark:bg-[#0f1729] border-r border-gray-200 dark:border-[#253041] flex flex-col transition-all duration-300 overflow-hidden shrink-0`}>
            {/* Quick Search */}
            <div className="p-3 border-b border-gray-200 dark:border-[#253041]">
              {sidebarOpen && (
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    placeholder="Быстрый поиск..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-[#1e293b] border border-gray-200 dark:border-[#253041] rounded-md text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#5ecece]/40 focus:border-[#5ecece] transition-colors"
                  />
                  {searchFocused && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#151e2e] border border-gray-200 dark:border-[#253041] rounded-lg shadow-lg z-50 overflow-hidden">
                      {searchResults.map((p) => (
                        <button
                          key={p.id}
                          onMouseDown={() => handleSearchSelect(p)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors"
                        >
                          <div className="w-7 h-7 rounded-full bg-[#5ecece]/15 border border-[#5ecece]/30 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-[#5ecece]">{p.initials}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{p.shortName}</div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">№ {p.room}</div>
                          </div>
                          {p.hasNewAnalyses && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {!sidebarOpen && (
                <button className="w-full flex justify-center p-1.5 text-gray-400 hover:text-[#5ecece] transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sidebar Nav */}
            <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
              {sidebarOpen && (
                <div className="px-3 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Инструменты</span>
                </div>
              )}
              {[
                { id: 'scheduler', label: 'Шедулер', icon: '⏱️' },
                { id: 'uikit', label: 'UI-Kit', icon: '🎨' },
                { id: 'messenger', label: 'Мессенджер', icon: '💬' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => openToolTab(item.id, item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-all group ${
                    activeTabId === item.id
                      ? 'bg-[#5ecece]/10 dark:bg-[#5ecece]/15 text-[#5ecece]'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e293b] hover:text-gray-900 dark:hover:text-gray-200'
                  } ${!sidebarOpen ? 'justify-center' : ''}`}
                >
                  <span className="text-sm shrink-0">{item.icon}</span>
                  {sidebarOpen && (
                    <>
                      <span className="text-sm font-medium truncate">{item.label}</span>
                      {item.id === 'messenger' && (
                        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-[#253041] text-gray-500 dark:text-gray-400 font-medium">MVP</span>
                      )}
                      {item.id === 'scheduler' && (
                        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-[#253041] text-gray-500 dark:text-gray-400 font-medium">PRO</span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </nav>

            {/* Exit */}
            <div className="p-2 border-t border-gray-200 dark:border-[#253041]">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                <span className="text-sm shrink-0">🚪</span>
                {sidebarOpen && <span className="text-xs font-medium">Выход</span>}
              </button>
            </div>
          </aside>

          {/* ═══ CONTENT AREA ═══ */}
          <main className="flex-1 overflow-y-auto">
            {/* Breadcrumb */}
            <div className="sticky top-0 z-10 bg-gray-50/80 dark:bg-[#0b1120]/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-[#253041]/50 px-6 py-2">
              <div className="flex items-center gap-2 text-xs">
                {breadcrumbText.split(' / ').map((part, i, arr) => (
                  <span key={i} className={i === arr.length - 1 ? 'text-[#5ecece] font-medium' : 'text-gray-400 dark:text-gray-500'}>
                    {part}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* System tabs: render only active */}
              {activeTabId === 'dashboard' && <Dashboard onOpenPatient={openPatient} onOpenRegistry={() => setActiveTabId('registry')} />}
              {activeTabId === 'scheduler' && <DoctorScheduler onOpenPatient={openPatient} />}
              {activeTabId === 'registry' && <PatientRegistry onOpenPatient={openPatient} />}
              {activeTabId === 'uikit' && <UIKitPage />}
              {activeTabId === 'messenger' && <MessengerPage />}

              {/* Patient tabs: render ALL, hide inactive (preserves sub-tab state) */}
              {patientTabs.map((tab) => (
                <div key={tab.id} className={tab.id === activeTabId ? '' : 'hidden'}>
                  <PatientCard onBack={() => closeTab(tab.id)} />
                </div>
              ))}
            </div>
          </main>
        </div>
    </div>
  )
}
