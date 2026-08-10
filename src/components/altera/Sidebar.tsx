'use client'

import {
  Activity,
  CalendarDays,
  FileText,
  ClipboardList,
  MessageSquare,
  Heart,
  LogOut,
  ChevronLeft,
} from 'lucide-react'
import type { PageKey } from '@/app/page'

interface SidebarProps {
  activePage: PageKey
  onPageChange: (page: PageKey) => void
  isOpen: boolean
  currentRole: 'patient' | 'doctor' | 'admin'
}

interface NavItem {
  id: PageKey
  label: string
  icon: React.ReactNode
  badge?: string
}

export function Sidebar({ activePage, onPageChange, isOpen, currentRole }: SidebarProps) {
  const patientNav: NavItem[] = [
    { id: 'treatment', label: 'Программа лечения', icon: <Heart className="w-5 h-5" /> },
    { id: 'schedule', label: 'Расписание процедур', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'medical-card', label: 'Медицинская карта', icon: <FileText className="w-5 h-5" /> },
    { id: 'analyses', label: 'Анализы и заключения', icon: <ClipboardList className="w-5 h-5" /> },
    { id: 'messenger', label: 'Сообщения', icon: <MessageSquare className="w-5 h-5" />, badge: '2' },
  ]

  const doctorNav: NavItem[] = [
    { id: 'treatment', label: 'Приём пациента', icon: <Activity className="w-5 h-5" /> },
    { id: 'schedule', label: 'Календарь назначений', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'medical-card', label: 'Медицинские карты', icon: <FileText className="w-5 h-5" /> },
    { id: 'analyses', label: 'Анализы и заключения', icon: <ClipboardList className="w-5 h-5" /> },
    { id: 'messenger', label: 'Сообщения', icon: <MessageSquare className="w-5 h-5" />, badge: '5' },
  ]

  const adminNav: NavItem[] = [
    { id: 'schedule', label: 'Управление расписанием', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'treatment', label: 'Назначения и услуги', icon: <Activity className="w-5 h-5" /> },
    { id: 'analyses', label: 'Отчёты и аналитика', icon: <ClipboardList className="w-5 h-5" /> },
    { id: 'medical-card', label: 'Архив карт', icon: <FileText className="w-5 h-5" /> },
    { id: 'messenger', label: 'Задачи', icon: <MessageSquare className="w-5 h-5" />, badge: '3' },
  ]

  const navItems = currentRole === 'patient' ? patientNav : currentRole === 'doctor' ? doctorNav : adminNav

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-16'
      } sticky top-14 h-[calc(100vh-56px)] bg-white dark:bg-[#161B22] border-r border-gray-200 dark:border-[#373E47] flex flex-col transition-all duration-300 overflow-hidden shrink-0`}
    >
      {/* User info */}
      <div className="p-4 border-b border-gray-200 dark:border-[#373E47]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#5ecece]/15 border border-[#5ecece]/30 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-[#5ecece]">ИИ</span>
          </div>
          {isOpen && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                Иванов И.М.
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                Корпус 2, № 314
              </span>
            </div>
          )}
        </div>
        {isOpen && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xl font-serif italic text-[#5ecece]">Моё</span>
            <span className="text-xl font-serif text-gray-900 dark:text-gray-100">здоровье</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all duration-200 group relative ${
              activePage === item.id
                ? 'bg-[#5ecece]/10 dark:bg-[#5ecece]/15 text-[#5ecece] border-l-2 border-[#5ecece]'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#30363D] hover:text-gray-900 dark:hover:text-gray-200 border-l-2 border-transparent'
            } ${!isOpen ? 'justify-center px-0' : ''}`}
            title={!isOpen ? item.label : undefined}
          >
            {isOpen && (
              <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 w-4 text-right shrink-0">
                {String(idx + 1).padStart(2, '0')}
              </span>
            )}
            <span className={`shrink-0 ${activePage === item.id ? 'text-[#5ecece]' : 'group-hover:text-[#5ecece]/70'}`}>
              {item.icon}
            </span>
            {isOpen && (
              <span className="text-sm font-medium truncate">{item.label}</span>
            )}
            {item.badge && isOpen && (
              <span className="ml-auto w-5 h-5 rounded-full bg-[#5ecece] text-white text-[10px] font-bold flex items-center justify-center">
                {item.badge}
              </span>
            )}
            {!isOpen && item.badge && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#5ecece] text-white text-[8px] font-bold flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-[#373E47]">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors">
          <LogOut className="w-4 h-4 shrink-0" />
          {isOpen && <span className="text-xs font-medium">Выход</span>}
        </button>
      </div>
    </aside>
  )
}
