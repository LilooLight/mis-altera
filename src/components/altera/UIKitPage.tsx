'use client'

import { useState, useEffect } from 'react'
import {
  Stethoscope, Heart, CalendarDays, FileText, ClipboardList, MessageSquare,
  Activity, Clock, MapPin, Coins, AlertTriangle, CheckCircle2, XCircle,
  Search, Filter, Plus, Edit2, Trash2, Download, Eye, Paperclip,
  User, Shield, ChevronLeft, ChevronRight, Menu, Sun, Moon,
  X, Check, CheckCircle, Circle, Printer, Settings, Bell, Star, Play,
} from 'lucide-react'

const sections = [
  { id: 'colors', label: 'Цветовая палитра' },
  { id: 'typography', label: 'Типографика' },
  { id: 'buttons', label: 'Кнопки' },
  { id: 'inputs', label: 'Поля ввода' },
  { id: 'tables', label: 'Таблицы' },
  { id: 'cards', label: 'Карточки' },
  { id: 'modals', label: 'Модальные окна' },
  { id: 'badges', label: 'Теги статуса' },
  { id: 'icons', label: 'Иконки' },
  { id: 'navigation', label: 'Навигация' },
]

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-3 p-3 bg-gray-900 dark:bg-black/40 rounded-lg text-[11px] font-mono text-gray-300 overflow-x-auto leading-relaxed whitespace-pre-wrap break-all">
      <code>{code}</code>
    </pre>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100">{children}</h2>
      <div className="mt-2 h-0.5 w-16 bg-[#5ecece] rounded-full" />
    </div>
  )
}

function ComponentDemo({ title, children, code }: { title: string; children: React.ReactNode; code: string }) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{title}</h3>
      <div className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-6">
        {children}
      </div>
      <CodeBlock code={code} />
    </div>
  )
}

function ColorSwatch({ color, label, hex }: { color: string; label: string; hex: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-full h-16 rounded-lg ${color} border border-gray-200 dark:border-[#253041]`} />
      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 text-center">{label}</span>
      <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500">{hex}</span>
    </div>
  )
}

export function UIKitPage() {
  const [activeSection, setActiveSection] = useState('colors')
  const [toggleOn, setToggleOn] = useState(true)
  const [checkboxChecked, setCheckboxChecked] = useState(false)

  useEffect(() => {
    const el = document.getElementById(activeSection)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [activeSection])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120]">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-[#253041] bg-white dark:bg-[#0f1729] px-6 py-6">
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">UI-Kit МИС Практика</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
          Дизайн-система Санаторий v 0.2. Скопируйте классы Tailwind для использования в C#-компонентах (TwButton, TwDataGrid и т.д.)
        </p>
        {/* Reference card */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-gray-50 dark:bg-[#1e293b] rounded-lg px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Serif</span>
            <p className="text-sm font-serif text-gray-700 dark:text-gray-200 mt-0.5">Playfair Display</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#1e293b] rounded-lg px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Sans</span>
            <p className="text-sm font-sans text-gray-700 dark:text-gray-200 mt-0.5">Geist / Inter</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#1e293b] rounded-lg px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Accent</span>
            <p className="text-sm text-[#5ecece] font-medium mt-0.5">#C9A96E (Gold)</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#1e293b] rounded-lg px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Spacing</span>
            <p className="text-sm text-gray-700 dark:text-gray-200 mt-0.5">4px increments</p>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Nav */}
        <aside className="w-56 sticky top-0 h-screen bg-white dark:bg-[#0f1729] border-r border-gray-200 dark:border-[#253041] overflow-y-auto shrink-0">
          <div className="px-4 pt-4 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Секции</span>
          </div>
          <nav className="px-2 space-y-0.5">
            {sections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-all text-sm ${
                  activeSection === s.id
                    ? 'bg-[#5ecece]/10 dark:bg-[#5ecece]/15 text-[#5ecece] border-l-2 border-[#5ecece]'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e293b]'
                }`}
              >
                <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 w-4 text-right">{String(i + 1).padStart(2, '0')}</span>
                <span className="truncate text-[13px]">{s.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 max-w-5xl space-y-16">

          {/* ─── 1. COLORS ─── */}
          <section id="colors">
            <SectionTitle>Цветовая палитра</SectionTitle>

            <ComponentDemo title="Фоны (Background)" code={`/* Page */\nbg-gray-50               /* Light page */\ndark:bg-[#0b1120]        /* Dark page */\n\n/* Cards */\nbg-white                 /* Light card */\ndark:bg-[#151e2e]        /* Dark card */\ndark:bg-[#1e293b]        /* Dark table/header */\n\n/* Header */\nbg-white                 /* Light header */\ndark:bg-[#0d1424]        /* Dark header */\ndark:bg-[#0f1729]        /* Dark sidebar */`}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <ColorSwatch color="bg-white" label="Card (L)" hex="#FFFFFF" />
                <ColorSwatch color="bg-gray-50" label="Page (L)" hex="#F9FAFB" />
                <ColorSwatch color="bg-[#0b1120]" label="Page (D)" hex="#0B1120" />
                <ColorSwatch color="bg-[#151e2e]" label="Card (D)" hex="#151E2E" />
                <ColorSwatch color="bg-[#1e293b]" label="Header (D)" hex="#1E293B" />
                <ColorSwatch color="bg-[#0d1424]" label="Sidebar (D)" hex="#0D1424" />
              </div>
            </ComponentDemo>

            <ComponentDemo title="Рамки (Borders)" code={`border-gray-200          /* Light borders */\ndark:border-[#253041]    /* Dark borders */\nborder-[#5ecece]         /* Accent border */`}>
              <div className="grid grid-cols-3 gap-3">
                <div className="h-12 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-gray-500">gray-200</span>
                </div>
                <div className="h-12 rounded-lg border-2 border-[#253041] flex items-center justify-center">
                  <span className="text-[10px] font-mono text-gray-400">#253041</span>
                </div>
                <div className="h-12 rounded-lg border-2 border-[#5ecece] flex items-center justify-center">
                  <span className="text-[10px] font-mono text-[#5ecece]">#5ecece</span>
                </div>
              </div>
            </ComponentDemo>

            <ComponentDemo title="Текст (Text)" code={`text-gray-900             /* Heading (L) */\ntext-gray-600             /* Body (L) */\ntext-gray-500             /* Muted (L) */\ndark:text-gray-100        /* Heading (D) */\ndark:text-gray-300        /* Body (D) */\ndark:text-gray-400        /* Muted (D) */\ntext-[#5ecece]            /* Accent text */`}>
              <div className="space-y-3">
                <p className="text-gray-900 dark:text-gray-100 font-semibold">text-gray-900 dark:text-gray-100 — Заголовок</p>
                <p className="text-gray-600 dark:text-gray-300">text-gray-600 dark:text-gray-300 — Основной текст</p>
                <p className="text-gray-500 dark:text-gray-400">text-gray-500 dark:text-gray-400 — Вспомогательный</p>
                <p className="text-[#5ecece] font-medium">text-[#5ecece] — Акцентный текст</p>
              </div>
            </ComponentDemo>

            <ComponentDemo title="Акцент и Статусы" code={`bg-[#5ecece]             /* Accent (Gold) */\nbg-emerald-500           /* Success */\nbg-amber-500              /* Warning */\nbg-red-500                /* Error/Cancel */\nbg-blue-500               /* Info */\nbg-purple-500             /* Lab/Specialist */`}>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                <ColorSwatch color="bg-[#5ecece]" label="Accent" hex="#C9A96E" />
                <ColorSwatch color="bg-emerald-500" label="Success" hex="#10B981" />
                <ColorSwatch color="bg-amber-500" label="Warning" hex="#F59E0B" />
                <ColorSwatch color="bg-red-500" label="Error" hex="#EF4444" />
                <ColorSwatch color="bg-blue-500" label="Info" hex="#3B82F6" />
                <ColorSwatch color="bg-purple-500" label="Specialist" hex="#A855F7" />
              </div>
            </ComponentDemo>
          </section>

          {/* ─── 2. TYPOGRAPHY ─── */}
          <section id="typography">
            <SectionTitle>Типографика</SectionTitle>

            <ComponentDemo title="Заголовки — font-serif (Playfair Display)" code={`<h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">\n<h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">\n<h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100">`}>
              <div className="space-y-4">
                <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">Заголовок H1 — text-3xl font-serif font-bold</h1>
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">Заголовок H2 — text-2xl font-serif font-bold</h2>
                <h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100">Заголовок H3 — text-xl font-serif font-semibold</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-serif italic text-[#5ecece]">Моё</span>
                  <span className="text-xl font-serif text-gray-900 dark:text-gray-100">здоровье</span>
                </div>
                <p className="text-[10px]">↑ font-serif italic text-[#5ecece] — брендовый стиль</p>
              </div>
            </ComponentDemo>

            <ComponentDemo title="Текст — font-sans (Geist/Inter)" code={`<p className="text-sm text-gray-600 dark:text-gray-300">\n<p className="text-base font-medium text-gray-900 dark:text-gray-100">\n<p className="text-xs text-gray-500 dark:text-gray-400">`}>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">text-sm text-gray-600 dark:text-gray-300 — Основной текст интерфейса</p>
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">text-base font-medium — Средний текст с выделением</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">text-xs text-gray-500 dark:text-gray-400 — Вспомогательный / лейбл</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">text-[10px] font-bold uppercase tracking-wider — ЗАГОЛОВОК СЕКЦИИ</p>
              </div>
            </ComponentDemo>

            <ComponentDemo title="Моноширинный (font-mono)" code={`<span className="font-mono text-sm text-gray-500">`}>
              <div className="space-y-2">
                <span className="font-mono text-sm text-gray-500 dark:text-gray-400">font-mono text-sm — 00</span>
                <span className="font-mono text-xs text-gray-400 dark:text-gray-500">font-mono text-xs — item.id</span>
              </div>
            </ComponentDemo>
          </section>

          {/* ─── 3. BUTTONS ─── */}
          <section id="buttons">
            <SectionTitle>Кнопки</SectionTitle>

            <div className="space-y-8">
              <ComponentDemo title="Primary" code={`<button className="px-4 py-2 bg-[#5ecece] text-white text-sm font-medium rounded-lg hover:bg-[#4bb8b8] transition-colors">\n  Сохранить\n</button>`}>
                <button className="px-4 py-2 bg-[#5ecece] text-white text-sm font-medium rounded-lg hover:bg-[#4bb8b8] transition-colors">Сохранить</button>
              </ComponentDemo>

              <ComponentDemo title="Secondary" code={`<button className="px-4 py-2 bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-[#253041] transition-colors">\n  Отмена\n</button>`}>
                <button className="px-4 py-2 bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-[#253041] transition-colors">Отмена</button>
              </ComponentDemo>

              <ComponentDemo title="Outline (Accent)" code={`<button className="px-4 py-2 border border-[#5ecece] text-[#5ecece] text-sm font-medium rounded-lg hover:bg-[#5ecece]/10 transition-colors">\n  Добавить назначение\n</button>`}>
                <button className="px-4 py-2 border border-[#5ecece] text-[#5ecece] text-sm font-medium rounded-lg hover:bg-[#5ecece]/10 transition-colors">Добавить назначение</button>
              </ComponentDemo>

              <ComponentDemo title="Danger" code={`<button className="px-4 py-2 border border-red-500 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">\n  Отменить\n</button>`}>
                <button className="px-4 py-2 border border-red-500 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">Отменить</button>
              </ComponentDemo>

              <ComponentDemo title="Ghost" code={`<button className="px-4 py-2 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">\n  Ещё\n</button>`}>
                <button className="px-4 py-2 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">Ещё</button>
              </ComponentDemo>

              <ComponentDemo title="Icon Button" code={`<button className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">\n  <Settings className="w-5 h-5" />\n</button>`}>
                <div className="flex gap-3">
                  <button className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors"><Settings className="w-5 h-5" /></button>
                  <button className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors"><Bell className="w-5 h-5" /></button>
                  <button className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors"><Download className="w-5 h-5" /></button>
                </div>
              </ComponentDemo>

              <ComponentDemo title="Disabled" code={`<button disabled className="px-4 py-2 bg-[#5ecece]/50 text-white/50 text-sm font-medium rounded-lg cursor-not-allowed">\n  Недоступно\n</button>`}>
                <button disabled className="px-4 py-2 bg-[#5ecece]/50 text-white/50 text-sm font-medium rounded-lg cursor-not-allowed">Недоступно</button>
              </ComponentDemo>

              <ComponentDemo title="Small" code={`<button className="px-3 py-1 text-xs font-medium rounded-md bg-[#5ecece] text-white hover:bg-[#4bb8b8] transition-colors">\n  Маленькая\n</button>`}>
                <button className="px-3 py-1 text-xs font-medium rounded-md bg-[#5ecece] text-white hover:bg-[#4bb8b8] transition-colors">Маленькая</button>
              </ComponentDemo>
            </div>
          </section>

          {/* ─── 4. INPUTS ─── */}
          <section id="inputs">
            <SectionTitle>Поля ввода</SectionTitle>

            <ComponentDemo title="Text Input" code={`<input className="w-full px-3 py-2 bg-white dark:bg-[#0d1424] border border-gray-200 dark:border-[#253041] rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5ecece]/30 focus:border-[#5ecece] transition-colors" placeholder="Введите текст..." />`}>
              <input className="w-full px-3 py-2 bg-white dark:bg-[#0d1424] border border-gray-200 dark:border-[#253041] rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5ecece]/30 focus:border-[#5ecece] transition-colors" placeholder="Введите текст..." />
            </ComponentDemo>

            <ComponentDemo title="Search Input (with icon)" code={`<div className="relative">\n  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />\n  <input className="w-full pl-10 pr-3 py-2 bg-white dark:bg-[#0d1424] border border-gray-200 dark:border-[#253041] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5ecece]/30 focus:border-[#5ecece]" placeholder="Поиск..." />\n</div>`}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input className="w-full pl-10 pr-3 py-2 bg-white dark:bg-[#0d1424] border border-gray-200 dark:border-[#253041] rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5ecece]/30 focus:border-[#5ecece] transition-colors" placeholder="Поиск по ФИО..." />
              </div>
            </ComponentDemo>

            <ComponentDemo title="Textarea" code={`<textarea className="w-full px-3 py-2 bg-white dark:bg-[#0d1424] border border-gray-200 dark:border-[#253041] rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#5ecece]/30 focus:border-[#5ecece]" placeholder="Описание..." />`}>
              <textarea className="w-full px-3 py-2 bg-white dark:bg-[#0d1424] border border-gray-200 dark:border-[#253041] rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#5ecece]/30 focus:border-[#5ecece] transition-colors" placeholder="Опишите жалобы пациента..." />
            </ComponentDemo>

            <ComponentDemo title="Select / Dropdown" code={`<select className="w-full px-3 py-2 bg-white dark:bg-[#0d1424] border border-gray-200 dark:border-[#253041] rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5ecece]/30 focus:border-[#5ecece]">`}>
              <select className="w-full px-3 py-2 bg-white dark:bg-[#0d1424] border border-gray-200 dark:border-[#253041] rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5ecece]/30 focus:border-[#5ecece]">
                <option>Выберите специалиста...</option>
                <option>Иванов И.М. — Терапевт</option>
                <option>Сидорова О.Н. — Невролог</option>
                <option>Козлов А.П. — Кардиолог</option>
              </select>
            </ComponentDemo>

            <ComponentDemo title="Checkbox" code={`<label className="flex items-center gap-3 cursor-pointer">\n  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-[#253041] text-[#5ecece] focus:ring-[#5ecece]/30" />\n  <span className="text-sm text-gray-700 dark:text-gray-300">Я согласен</span>\n</label>`}>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={checkboxChecked} onChange={(e) => setCheckboxChecked(e.target.checked)} className="w-4 h-4 rounded border-gray-300 dark:border-[#253041] text-[#5ecece] focus:ring-[#5ecece]/30 accent-[#5ecece]" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Я подтверждаю ответственность</span>
                </label>
              </div>
            </ComponentDemo>

            <ComponentDemo title="Toggle / Switch" code={`/* On */\nbg-[#5ecece]\n\n/* Off */\nbg-gray-300 dark:bg-[#253041]`}>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setToggleOn(!toggleOn)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${toggleOn ? 'bg-[#5ecece]' : 'bg-gray-300 dark:bg-[#253041]'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${toggleOn ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">{toggleOn ? 'Платно' : 'Бесплатно'}</span>
              </div>
            </ComponentDemo>
          </section>

          {/* ─── 5. TABLES ─── */}
          <section id="tables">
            <SectionTitle>Таблицы</SectionTitle>

            <ComponentDemo title="Data Table" code={`<div className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] overflow-hidden">\n  <table className="w-full">\n    <thead>\n      <tr className="bg-gray-50 dark:bg-[#1e293b]">\n        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">...</th>\n      </tr>\n    </thead>\n    <tbody className="divide-y divide-gray-100 dark:divide-[#253041]/50">\n      <tr className="hover:bg-gray-50/50 dark:hover:bg-[#1e293b]/30 transition-colors">...</tr>\n    </tbody>\n  </table>\n</div>`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#1e293b]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">№</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Пациент</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Диагноз</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Комната</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Статус</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#253041]/50">
                    <tr className="hover:bg-gray-50/50 dark:hover:bg-[#1e293b]/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">01</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">Петрова А.С.</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">M54.5</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">314</td>
                      <td className="px-4 py-3"><span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30"><Check className="w-3 h-3" />На лечении</span></td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 dark:hover:bg-[#1e293b]/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">02</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">Козлов Д.А.</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">I10</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">215</td>
                      <td className="px-4 py-3"><span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30"><AlertTriangle className="w-3 h-3" />Просрочено</span></td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 dark:hover:bg-[#1e293b]/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">03</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">Смирнова Е.В.</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">M79.3</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">412</td>
                      <td className="px-4 py-3"><span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-gray-100 dark:bg-[#1e293b] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#253041]"><CheckCircle2 className="w-3 h-3" />Завершено</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ComponentDemo>
          </section>

          {/* ─── 6. CARDS ─── */}
          <section id="cards">
            <SectionTitle>Карточки</SectionTitle>

            <ComponentDemo title="Standard Card" code={`<div className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-6">\n  <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-gray-100">...</h3>\n  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">...</p>\n</div>`}>
              <div className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-6">
                <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-gray-100">Заголовок карточки</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Содержимое карточки с подробным описанием элемента интерфейса.</p>
                <div className="flex gap-2 mt-4">
                  <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#5ecece] text-white hover:bg-[#4bb8b8]">Действие</button>
                  <button className="px-3 py-1.5 text-xs font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e293b]">Закрыть</button>
                </div>
              </div>
            </ComponentDemo>

            <ComponentDemo title="Card with Gold Left Border (hover)" code={`<div className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-6 hover:border-l-4 hover:border-l-[#5ecece] hover:shadow-md transition-all">`}>
              <div className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-6 hover:border-l-4 hover:border-l-[#5ecece] hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#5ecece]/15 border border-[#5ecece]/30 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#5ecece]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Петрова Анна Сергеевна</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">M54.5 — Боль в пояснице · № 314</p>
                  </div>
                </div>
              </div>
            </ComponentDemo>

            <ComponentDemo title="Stats Cards Row" code={`<div className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-4">\n  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Label</span>\n  <span className="block text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">24</span>\n</div>`}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Всего пациентов', value: '24', color: 'text-gray-900 dark:text-gray-100' },
                  { label: 'На лечении', value: '18', color: 'text-emerald-600 dark:text-emerald-400' },
                  { label: 'Просрочено', value: '2', color: 'text-red-600 dark:text-red-400' },
                  { label: 'Завершено', value: '4', color: 'text-gray-500 dark:text-gray-400' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{stat.label}</span>
                    <span className={`block text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </ComponentDemo>
          </section>

          {/* ─── 7. MODALS ─── */}
          <section id="modals">
            <SectionTitle>Модальные окна</SectionTitle>

            <ComponentDemo title="Modal Card Template" code={`/* Overlay */\n<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">\n\n/* Card */\n<div className="bg-white dark:bg-[#151e2e] rounded-2xl border border-gray-200 dark:border-[#253041] shadow-2xl max-w-md w-full mx-4">`}>
              <div className="bg-white dark:bg-[#151e2e] rounded-2xl border border-gray-200 dark:border-[#253041] shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#253041]">
                  <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-gray-100">Заголовок модала</h3>
                  <button className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {/* Body */}
                <div className="p-4 space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Содержимое модального окна. Описание действия и предупреждения для пользователя.</p>
                  <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 dark:text-amber-400">Предупреждение о последствиях действия.</p>
                    </div>
                  </div>
                </div>
                {/* Footer */}
                <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-[#253041]">
                  <button className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">Отмена</button>
                  <button className="px-4 py-2 text-sm font-medium rounded-lg bg-[#5ecece] text-white hover:bg-[#4bb8b8] transition-colors">Подтвердить</button>
                </div>
              </div>
            </ComponentDemo>

            <ComponentDemo title="Audit Modal (required reason)" code={`{/* Required field pattern */}\n<button disabled={!reason.trim()} className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">`}>
              <div className="bg-white dark:bg-[#151e2e] rounded-2xl border border-gray-200 dark:border-[#253041] shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#253041]">
                  <h3 className="text-lg font-serif font-semibold text-red-600 dark:text-red-400">Указать причину отмены</h3>
                  <X className="w-4 h-4 text-gray-400" />
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Отмена назначения будет зафиксирована в журнале аудита.</p>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Причина <span className="text-red-500">*</span></label>
                    <textarea className="w-full px-3 py-2 bg-white dark:bg-[#0d1424] border border-gray-200 dark:border-[#253041] rounded-lg text-sm placeholder:text-gray-400 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500" placeholder="Укажите причину..." />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-[#253041]">
                  <button className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-400">Закрыть</button>
                  <button disabled className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">Отменить назначение</button>
                </div>
              </div>
            </ComponentDemo>
          </section>

          {/* ─── 8. BADGES ─── */}
          <section id="badges">
            <SectionTitle>Теги статуса</SectionTitle>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: 'Выполнено', cls: 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30', Icon: Check },
                { label: 'Ожидает', cls: 'bg-gray-100 dark:bg-[#1e293b] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#253041]', Icon: Clock },
                { label: 'Ожидает оплаты', cls: 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/30', Icon: AlertTriangle },
                { label: 'Просрочено', cls: 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/30', Icon: AlertTriangle },
                { label: 'Отменено', cls: 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/30', Icon: XCircle },
                { label: 'На лечении', cls: 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30', Icon: CheckCircle2 },
                { label: 'Бесплатно', cls: 'bg-gray-100 dark:bg-[#1e293b] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#253041]', Icon: Check },
                { label: 'Оплачено', cls: 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30', Icon: Check },
              ].map((badge) => (
                <div key={badge.label} className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border ${badge.cls}`}>
                    <badge.Icon className="w-3.5 h-3.5" />
                    {badge.label}
                  </span>
                  <CodeBlock code={`className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border\n  ${badge.cls}"`} />
                </div>
              ))}
            </div>
          </section>

          {/* ─── 9. ICONS ─── */}
          <section id="icons">
            <SectionTitle>Иконки</SectionTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Все иконки из библиотеки lucide-react. Импорт: {'`import { IconName } from \'lucide-react\'`'}</p>

            <ComponentDemo title="Навигация и Действия" code={`import { Stethoscope, Heart, CalendarDays, FileText, ClipboardList, MessageSquare, Activity, Clock, Search, Filter, Plus, Edit2, Trash2, Download, Eye, Paperclip, User, Shield, X, Check } from 'lucide-react'`}>
              <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-12 gap-4">
                {[
                  { Icon: Stethoscope, name: 'Stethoscope' },
                  { Icon: Heart, name: 'Heart' },
                  { Icon: CalendarDays, name: 'CalendarDays' },
                  { Icon: FileText, name: 'FileText' },
                  { Icon: ClipboardList, name: 'ClipboardList' },
                  { Icon: MessageSquare, name: 'MessageSquare' },
                  { Icon: Activity, name: 'Activity' },
                  { Icon: Clock, name: 'Clock' },
                  { Icon: Search, name: 'Search' },
                  { Icon: Filter, name: 'Filter' },
                  { Icon: Plus, name: 'Plus' },
                  { Icon: Edit2, name: 'Edit2' },
                ].map(({ Icon, name }) => (
                  <div key={name} className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#1e293b] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500 text-center leading-tight">{name}</span>
                  </div>
                ))}
              </div>
            </ComponentDemo>

            <ComponentDemo title="Статусы и Системные">
              <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-12 gap-4">
                {[
                  { Icon: Trash2, name: 'Trash2' },
                  { Icon: Download, name: 'Download' },
                  { Icon: Eye, name: 'Eye' },
                  { Icon: Paperclip, name: 'Paperclip' },
                  { Icon: User, name: 'User' },
                  { Icon: Shield, name: 'Shield' },
                  { Icon: MapPin, name: 'MapPin' },
                  { Icon: Coins, name: 'Coins' },
                  { Icon: Check, name: 'Check' },
                  { Icon: X, name: 'X' },
                  { Icon: CheckCircle2, name: 'CheckCircle2' },
                  { Icon: XCircle, name: 'XCircle' },
                ].map(({ Icon, name }) => (
                  <div key={name} className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#1e293b] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500 text-center leading-tight">{name}</span>
                  </div>
                ))}
              </div>
            </ComponentDemo>
          </section>

          {/* ─── 10. NAVIGATION ─── */}
          <section id="navigation">
            <SectionTitle>Навигация</SectionTitle>

            <ComponentDemo title="Tab Navigation" code={`<div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1e293b] rounded-lg p-1">\n  <button className="px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-[#151e2e] text-[#5ecece] shadow-sm">Active</button>\n  <button className="px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400">Inactive</button>\n</div>`}>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1e293b] rounded-lg p-1">
                <button className="px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-[#151e2e] text-[#5ecece] shadow-sm">Хронология</button>
                <button className="px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400">Документы <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-200 dark:bg-[#253041]">6</span></button>
                <button className="px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400">План лечения</button>
              </div>
            </ComponentDemo>

            <ComponentDemo title="Sidebar Nav Item (Active)" code={`<button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md\n  bg-[#5ecece]/10 dark:bg-[#5ecece]/15 text-[#5ecece] border-l-2 border-[#5ecece]">`}>
              <div className="max-w-[220px]">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md bg-[#5ecece]/10 dark:bg-[#5ecece]/15 text-[#5ecece] border-l-2 border-[#5ecece]">
                  <span className="text-[10px] font-mono text-gray-400 w-4 text-right">01</span>
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">Программа лечения</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e293b] border-l-2 border-transparent mt-0.5">
                  <span className="text-[10px] font-mono text-gray-400 w-4 text-right">02</span>
                  <CalendarDays className="w-5 h-5" />
                  <span className="text-sm font-medium">Расписание</span>
                </button>
              </div>
            </ComponentDemo>

            <ComponentDemo title="View Switcher" code={`<div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1e293b] rounded-lg p-0.5">\n  <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-[#151e2e] text-[#5ecece] shadow-sm">Card</button>\n  ...\n</div>`}>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1e293b] rounded-lg p-0.5">
                {['Карточки', 'Список', 'Таблица'].map((v, i) => (
                  <button key={v} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${i === 0 ? 'bg-white dark:bg-[#151e2e] text-[#5ecece] shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}>{v}</button>
                ))}
              </div>
            </ComponentDemo>

            <ComponentDemo title="Breadcrumb" code={`<div className="flex items-center gap-2 text-sm">\n  <span className="text-gray-400 dark:text-gray-500">МИС Практика</span>\n  <span className="text-gray-300 dark:text-gray-600">/</span>\n  <span className="text-[#5ecece] font-medium">Текущий раздел</span>\n</div>`}>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 dark:text-gray-500">МИС Практика</span>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <span className="text-[#5ecece] font-medium">Реестр пациентов</span>
              </div>
            </ComponentDemo>
          </section>

          <div className="h-16" />
        </main>
      </div>
    </div>
  )
}
