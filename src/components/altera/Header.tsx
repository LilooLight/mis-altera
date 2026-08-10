'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Menu } from 'lucide-react'
import { useState, useEffect } from 'react'

interface HeaderProps {
  currentRole: 'patient' | 'doctor' | 'admin'
  onRoleChange: (role: 'patient' | 'doctor' | 'admin') => void
  onToggleSidebar: () => void
}

export function Header({ currentRole, onRoleChange, onToggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const roleLabels: Record<string, string> = {
    patient: 'Личный кабинет пациента',
    doctor: 'Рабочее место врача',
    admin: 'Панель администратора',
  }

  return (
    <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-4 lg:px-6 bg-white dark:bg-[#0d1424] border-b border-gray-200 dark:border-[#253041] transition-colors duration-300">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <img
          src="/mis-altera/logo.svg"
          alt="МИС Альтера"
          className="h-7 w-auto shrink-0"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Role switcher */}
        <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-[#1e293b] rounded-md p-0.5">
          {(['patient', 'doctor', 'admin'] as const).map((role) => (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all duration-200 ${
                currentRole === role
                  ? 'bg-[#5ecece] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {role === 'patient' ? 'Пациент' : role === 'doctor' ? 'Врач' : 'Админ'}
            </button>
          ))}
        </div>

        {/* Current section label */}
        <div className="hidden lg:block text-xs text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-[#253041] pl-3">
          {roleLabels[currentRole]}
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors"
          aria-label="Toggle theme"
        >
          {!mounted ? (
            <div className="w-4 h-4" />
          ) : theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-[#5ecece]/10 border border-[#5ecece]/30 flex items-center justify-center">
          <span className="text-xs font-semibold text-[#5ecece]">ИИ</span>
        </div>
      </div>
    </header>
  )
}
