'use client'

import { Stethoscope } from 'lucide-react'

interface StubPageProps {
  role: 'patient' | 'admin'
  onSwitchToDoctor: () => void
}

const roleConfig: Record<string, { title: string; subtitle: string; description: string }> = {
  patient: {
    title: 'Личный кабинет пациента',
    subtitle: 'Раздел находится в разработке',
    description: 'В будущих версиях здесь будет доступна личная медицинская карта, расписание процедур, результаты анализов и обмен сообщениями с лечащим врачом.',
  },
  admin: {
    title: 'Панель администратора',
    subtitle: 'Раздел находится в разработке',
    description: 'В будущих версиях здесь будет доступно управление расписанием, учёт финансовых операций, мониторинг загруженности и отчётность санатория.',
  },
}

export function StubPage({ role, onSwitchToDoctor }: StubPageProps) {
  const config = roleConfig[role]

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="max-w-md w-full mx-6 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#c9a96e] flex items-center justify-center shadow-lg shadow-[#c9a96e]/20">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Brand */}
        <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-1">
          МИС Практика
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Медицинская информационная система санатория
        </p>

        {/* Card */}
        <div className="bg-white dark:bg-[#151e2e] rounded-2xl border border-gray-200 dark:border-[#253041] p-8 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#c9a96e]/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">{role === 'patient' ? '🏥' : '⚙️'}</span>
          </div>
          <h2 className="text-lg font-serif font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {config.title}
          </h2>
          <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-3">
            {config.subtitle}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {config.description}
          </p>

          {/* Switch to doctor */}
          <button
            onClick={onSwitchToDoctor}
            className="mt-6 w-full px-4 py-2.5 bg-[#c9a96e] text-white text-sm font-medium rounded-lg hover:bg-[#b89558] transition-colors"
          >
            Перейти в рабочий стол врача
          </button>
        </div>

        {/* Version */}
        <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-6">
          Санаторий v 0.2 — Прототип MVP
        </p>
      </div>
    </div>
  )
}
