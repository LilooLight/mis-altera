#!/usr/bin/env node
/**
 * patch-visit-form.js — Переработка вкладки «Текущий осмотр» по отзывам врачей
 *
 * Изменения:
 * 1. MainTab: добавить 'history'
 * 2. mainTabs: добавить вкладку «История»
 * 3. PatientCard header: добавить возраст, пол, полный диагноз
 * 4. TabVisit: полная переработка — жалобы с шаблонами, объективные данные с подсветкой, заключение
 * 5. LeftPanel: удалить дублирование, заменить «Ближайшие мероприятия» на «Лист назначений», добавить лог осмотров
 * 6. TabHistory: новая вкладка с записями всех посещений
 */

const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, '..', 'src', 'components', 'altera', 'PatientCard.tsx')
let src = fs.readFileSync(FILE, 'utf-8')

// ═══════════════════════════════════════════════════════════════════════
// 1. Add 'history' to MainTab type
// ═══════════════════════════════════════════════════════════════════════

src = src.replace(
  "type MainTab = 'visit' | 'results' | 'prescriptions' | 'discharge'",
  "type MainTab = 'visit' | 'results' | 'prescriptions' | 'history' | 'discharge'"
)

// ═══════════════════════════════════════════════════════════════════════
// 2. Add 'history' tab to mainTabs (after prescriptions, before discharge)
// ═══════════════════════════════════════════════════════════════════════

src = src.replace(
  `  { key: 'prescriptions', label: 'Назначения', icon: ClipboardList },
  { key: 'discharge', label: 'Выписка', icon: FileSignature },`,
  `  { key: 'prescriptions', label: 'Назначения', icon: ClipboardList },
  { key: 'history', label: 'История', icon: Clock },
  { key: 'discharge', label: 'Выписка', icon: FileSignature },`
)

// ═══════════════════════════════════════════════════════════════════════
// 3. Enhance patientData — add gender
// ═══════════════════════════════════════════════════════════════════════

src = src.replace(
  `const patientData = {
  name: 'Козлов Виктор Сергеевич',
  age: 54,
  room: '312',`,
  `const patientData = {
  name: 'Козлов Виктор Сергеевич',
  age: 54,
  gender: 'М' as const,
  room: '312',`
)

// ═══════════════════════════════════════════════════════════════════════
// 4. Add complaint templates and previous vitals mock data
// ═══════════════════════════════════════════════════════════════════════

const COMPLAINT_TEMPLATES = `
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
`

// Insert after prescriptions array (line ~102)
src = src.replace(
  `const prescriptions = [`,
  COMPLAINT_TEMPLATES + `\nconst prescriptions = [`
)

// Add Wind import (needed for RR)
src = src.replace(
  `  FileText, FileSpreadsheet, Image as ImageIcon, FileVideo, LayoutGrid, List,`,
  `  FileText, FileSpreadsheet, Image as ImageIcon, FileVideo, LayoutGrid, List, Wind,`
)

// ═══════════════════════════════════════════════════════════════════════
// 5. Add visit history mock data
// ═══════════════════════════════════════════════════════════════════════

const VISIT_HISTORY = `
const visitHistory = [
  { id: 1, date: '27.07.2026', time: '10:30', type: 'Терапевт', doctor: 'Иванов И.М.', summary: 'Осмотр плановый. Жалобы на ноющую боль в пояснице. АД 130/85, пульс 78.' },
  { id: 2, date: '25.07.2026', time: '09:00', type: 'Невролог', doctor: 'Сидорова О.Н.', summary: 'Консультация. Рекомендована коррекция терапии.' },
  { id: 3, date: '24.07.2026', time: '14:00', type: 'Процедура', doctor: '', summary: 'Рентгенография поясничного отдела. Умеренные ДД L4-L5.' },
  { id: 4, date: '22.07.2026', time: '08:30', type: 'Терапевт', doctor: 'Иванов И.М.', summary: 'Осмотр. Динамика положительная. АД 140/90.' },
  { id: 5, date: '20.07.2026', time: '11:00', type: 'Процедура', doctor: '', summary: 'УЗИ брюшной полости. Без патологий.' },
  { id: 6, date: '18.07.2026', time: '10:00', type: 'Терапевт', doctor: 'Иванов И.М.', summary: 'Первичный осмотр. Жалобы на боль в пояснице, ограничение подвижности.' },
]
`

// Insert before imagingResults
src = src.replace(
  `const imagingResults = [`,
  VISIT_HISTORY + `\nconst imagingResults = [`
)

// ═══════════════════════════════════════════════════════════════════════
// 6. COMPLETELY REPLACE TabVisit component
// ═══════════════════════════════════════════════════════════════════════

const NEW_TAB_VISIT = `function TabVisit({ setActiveTab }: { setActiveTab: (t: MainTab) => void }) {
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
              {complaintTemplates.slice(0, 6).map tmpl => (
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
                  {complaintTemplates.slice(6).map tmpl => (
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
                  className={\`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors duration-200 \${
                    showPrevValues ? 'bg-accent-tiffany' : 'bg-gray-300 dark:bg-dark-border-subtle'
                  }\`}
                >
                  <span className={\`inline-block h-2.5 w-2.5 rounded-full bg-white shadow-sm transition-transform duration-200 \${
                    showPrevValues ? 'translate-x-3.5' : 'translate-x-0.5'
                  }\`} />
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
                  className={\`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany transition-colors \${
                    isVitalAbnormal('bp', objData.bp) ? 'border-red dark:border-red/50 bg-red-50 dark:bg-red-900/10 ring-1 ring-red/20' : 'border-gray-200 dark:border-dark-border-subtle'
                  }\`}
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
                  className={\`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany transition-colors \${
                    isVitalAbnormal('pulse', objData.pulse) ? 'border-red dark:border-red/50 bg-red-50 dark:bg-red-900/10 ring-1 ring-red/20' : 'border-gray-200 dark:border-dark-border-subtle'
                  }\`}
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
                  className={\`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany transition-colors \${
                    isVitalAbnormal('temp', objData.temp) ? 'border-red dark:border-red/50 bg-red-50 dark:bg-red-900/10 ring-1 ring-red/20' : 'border-gray-200 dark:border-dark-border-subtle'
                  }\`}
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
                  className={\`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany transition-colors \${
                    isVitalAbnormal('spo2', objData.spo2) ? 'border-red dark:border-red/50 bg-red-50 dark:bg-red-900/10 ring-1 ring-red/20' : 'border-gray-200 dark:border-dark-border-subtle'
                  }\`}
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
                  className={\`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany transition-colors \${
                    isVitalAbnormal('rr', objData.rr) ? 'border-red dark:border-red/50 bg-red-50 dark:bg-red-900/10 ring-1 ring-red/20' : 'border-gray-200 dark:border-dark-border-subtle'
                  }\`}
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
            Диета {'\\u00B9'}5, ЛФК, массаж (10), физио (12), бальнео (8)
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
}`

// Replace the entire TabVisit function
src = src.replace(
  /function TabVisit\(\{ setActiveTab \}: \{ setActiveTab: \(t: MainTab\) => void \}\) \{[\s\S]*?^\}/m,
  NEW_TAB_VISIT
)

// ═══════════════════════════════════════════════════════════════════════
// 7. Add TabHistory component (before MAIN COMPONENT section)
// ═══════════════════════════════════════════════════════════════════════

const TAB_HISTORY = `// ═══════════════════════════════════════════════════════════
// HISTORY TAB
// ═══════════════════════════════════════════════════════════════════════

function TabHistory() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const selected = selectedItem ? visitHistory.find(h => h.id === selectedItem) : null

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
            return (
              <button
                key={item.id}
                onClick={() => setSelectedItem(isSelected ? null : item.id)}
                className={\`w-full text-left glass-card rounded-xl border p-4 transition-all \${
                  isSelected
                    ? 'border-accent-tiffany bg-accent-tiffany/5 dark:bg-accent-tiffany/10 shadow-sm'
                    : 'border-gray-200 dark:border-dark-border-subtle hover:border-accent-tiffany/20'
                }\`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className={\`w-8 h-8 rounded-lg flex items-center justify-center \${typeColor}/10 text-\${typeColor.replace('bg-', '')}\`}>
                      {item.type === 'Терапевт' || item.type === 'Невролог' ? <Stethoscope className="w-4 h-4" /> :
                       item.type === 'Процедура' ? <Activity className="w-4 h-4" /> : <FlaskConical className="w-4 h-4" />}
                    </div>
                    <div className={\`w-1.5 h-1.5 rounded-full \${typeColor}\`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.type}</span>
                        {item.doctor && <span className="text-xs text-gray-500 dark:text-gray-400">— {item.doctor}</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 shrink-0">
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
          <div className="w-[320px] shrink-0 glass-card rounded-xl border border-gray-200 dark:border-dark-border-subtle p-4 sticky top-6 self-start">
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

`

// Insert before MAIN COMPONENT section
src = src.replace(
  '// ═══════════════════════════════════════════════════════════════════════\n// MAIN COMPONENT',
  TAB_HISTORY + '// ═══════════════════════════════════════════════════════════\n// MAIN COMPONENT'
)

// ═══════════════════════════════════════════════════════════════════════
// 8. Update LeftPanel — remove diagnosis block, replace events with compact处方
// ═══════════════════════════════════════════════════════════════════════

// Remove the Diagnosis section from LeftPanel
src = src.replace(
  `      {/* Diagnosis */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-dark-border">
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Диагноз</h4>
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{p.diagnosisFull}</p>
      </div>

      {/* Vitals */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-dark-border">
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2.5">Ключевые показатели</h4>`,
  `      {/* Vitals */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-dark-border">
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2.5">Ключевые показатели</h4>`
)

// Replace "Ближайшие мероприятия" section with "Лист назначений" compact
src = src.replace(
  `      {/* Today Events */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-dark-border">
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2.5">Ближайшие мероприятия</h4>
        <div className="space-y-2">
          {todayEvents.map((ev, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={\`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 \${getEventBg(ev.type)}\`}>
                {getEventIcon(ev.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-accent-tiffany">{ev.time}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300 truncate">{ev.label}</span>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{ev.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>`,
  `      {/* Лист назначений (compact) */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-dark-border">
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Лист назначений</h4>
        <button
          onClick={onGoToPrescriptions}
          className="w-full text-left text-xs text-gray-700 dark:text-gray-300 hover:text-accent-tiffany transition-colors leading-relaxed"
        >
          Диета {'\\u00B9'}5, ЛФК, массаж (10), физио (12), бальнео (8)
        </button>
      </div>`
)

// ═══════════════════════════════════════════════════════════════════════
// 9. Enhance header — add age, gender, full diagnosis
// ═══════════════════════════════════════════════════════════════════════

src = src.replace(
  `          <p className="text-xs text-gray-500 dark:text-gray-400">
            {patientData.diagnosis} · палата {patientData.room} · {patientData.doctor}
          </p>`,
  `          <p className="text-xs text-gray-500 dark:text-gray-400">
            {patientData.diagnosisFull}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
            {patientData.age} лет, {patientData.gender === 'М' ? 'муж.' : 'жен.'} · палата {patientData.room} · {patientData.doctor}
          </p>`
)

// ═══════════════════════════════════════════════════════════════════════
// 10. Add history tab rendering in main component
// ═══════════════════════════════════════════════════════════════════════

src = src.replace(
  `          {activeTab === 'prescriptions' && <TabPrescriptions onOpenProcedure={() => setShowProcedureModal(true)} />}
          {activeTab === 'discharge' && <DischargeEpicrisis />}`,
  `          {activeTab === 'prescriptions' && <TabPrescriptions onOpenProcedure={() => setShowProcedureModal(true)} />}
          {activeTab === 'history' && <TabHistory />}
          {activeTab === 'discharge' && <DischargeEpicrisis />}`
)

// ═══════════════════════════════════════════════════════════════════════
// Write back
// ═══════════════════════════════════════════════════════════════════════

fs.writeFileSync(FILE, src, 'utf-8')
console.log('✓ PatientCard.tsx patched successfully')
console.log('  - Added history tab')
console.log('  - Rewritten TabVisit with complaint templates, objective data, conclusion')
console.log('  - LeftPanel: removed diagnosis, replaced events with处方list')
console.log('  - Header: added age, gender, full diagnosis')
