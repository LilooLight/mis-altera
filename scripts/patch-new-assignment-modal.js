#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════
// patch-new-assignment-modal.js
// 1. Remove old ProcedureModal
// 2. Add NewAssignmentModal (based on TreatmentPlan constructor)
// 3. Rename button "Назначить процедуру" → "Новое назначение"
// 4. Clean up unused imports + compatibility data
// ═══════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const fp = path.join(__dirname, '..', 'src', 'components', 'altera', 'PatientCard.tsx');
let s = fs.readFileSync(fp, 'utf-8');

// ── 1. Remove procedureCatalog, compatibilityRules, and all old ProcedureModal ──
// Find and remove: from "const procedureCatalog" to the end of "function ProcedureModal...}"
// This is complex — let's do targeted replacements

// Remove procedureCatalog block
s = s.replace(
  /const procedureCatalog = \[[\s\S]*?\n\]\n/,
  ''
);

// Remove compatibilityRules block
s = s.replace(
  /const compatibilityRules[\s\S]*?^}\n/,
  ''
);

// ── 2. Remove old ProcedureModal function entirely ──
// From "function ProcedureModal({ onClose, onAssign }" to the closing "}"
// This function is quite long and has nested template literals, so let's use markers
const procModalStart = s.indexOf('function ProcedureModal({ onClose, onAssign }');
if (procModalStart !== -1) {
  // Find matching closing brace — count braces
  let depth = 0;
  let pos = procModalStart;
  let end = -1;
  for (let i = pos; i < s.length; i++) {
    if (s[i] === '{') depth++;
    if (s[i] === '}') depth--;
    if (depth === 0 && i > pos + 10) {
      end = i + 1;
      break;
    }
  }
  if (end !== -1) {
    s = s.substring(0, procModalStart) + s.substring(end);
  }
}

// ── 3. Remove compatibility checking logic from imports if ShieldAlert, AlertOctagon, Ban are unused elsewhere
// Actually they might be used in DischargeModal still. Let's check.
// Keep them for now — they're used in DischargeModal warning.

// ── 4. Add NewAssignmentModal after DischargeModal's closing ──
const newAssignmentModal = `// ═══════════════════════════════════════════════════════════════════════
// NEW ASSIGNMENT MODAL — Full constructor based on TreatmentPlan
// ═══════════════════════════════════════════════════════════════════════

const ASSIGNMENT_MEDICATIONS = [
  { name: 'Нимесулид 100мг', category: 'НПВС' },
  { name: 'Мелоксикам 15мг', category: 'НПВС' },
  { name: 'Панциртонин 500мг', category: 'Хондропротектор' },
  { name: 'L-карнитин', category: 'Метаболическое' },
  { name: 'Мильгамма', category: 'Витамины группы B' },
]

const ASSIGNMENT_PROCEDURES = [
  { name: 'Грязевые аппликации', category: 'Бальнеология', duration: '20 мин', isPaid: false, price: null },
  { name: 'Подводный душ-массаж', category: 'Гидротерапия', duration: '15 мин', isPaid: false, price: null },
  { name: 'Электростимуляция', category: 'Физиотерапия', duration: '15 мин', isPaid: false, price: null },
  { name: 'Магнитотерапия', category: 'Физиотерапия', duration: '20 мин', isPaid: false, price: null },
  { name: 'УВТ поясницы', category: 'Физиотерапия', duration: '10 мин', isPaid: true, price: '2 500 ₽' },
  { name: 'Инфракрасная сауна', category: 'Термолечение', duration: '30 мин', isPaid: true, price: '1 800 ₽' },
  { name: 'Лазеротерапия поясницы', category: 'Физиотерапия', duration: '15 мин', isPaid: true, price: '1 500 ₽' },
  { name: 'Криотерапия', category: 'Физиотерапия', duration: '10 мин', isPaid: false, price: null },
]

const ASSIGNMENT_SPECIALISTS = [
  { name: 'Иванов И.М.', role: 'Терапевт' },
  { name: 'Сидорова О.Н.', role: 'Невролог' },
  { name: 'Козлов А.П.', role: 'Кардиолог' },
  { name: 'Фёдорова Е.В.', role: 'Физиотерапевт' },
]

const ASSIGNMENT_ANALYSES = [
  { name: 'ОАК (общий анализ крови)', category: 'Лаборатория' },
  { name: 'Биохимия крови (глюкоза, холестерин)', category: 'Лаборатория' },
  { name: 'ОАМ (общий анализ мочи)', category: 'Лаборатория' },
  { name: 'ЭКГ', category: 'Инструментальное' },
  { name: 'УЗИ органов брюшной полости', category: 'Инструментальное' },
  { name: 'Рентгенография', category: 'Инструментальное' },
]

const FREQUENCY_OPTIONS = ['1 раз/день', '2 раза/день', '3 раза/день', '1 раз/неделю', 'По мере необходимости']

type AssignmentType = 'medication' | 'procedure' | 'specialist' | 'analysis'

const assignmentTypeTabs: { key: AssignmentType; label: string; icon: typeof Pill }[] = [
  { key: 'medication', label: 'Лекарство', icon: Pill },
  { key: 'procedure', label: 'Процедура', icon: Activity },
  { key: 'specialist', label: 'Консультация', icon: UserRound },
  { key: 'analysis', label: 'Исследование', icon: FlaskConical },
]

function NewAssignmentModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<AssignmentType>('medication')
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  // Common fields
  const [frequency, setFrequency] = useState(FREQUENCY_OPTIONS[0])
  const [duration, setDuration] = useState('')
  const [comment, setComment] = useState('')

  // Medication-specific
  const [dosage, setDosage] = useState('')

  // Procedure/specialist-specific
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')

  // Selected item details
  const selectedProc = selectedItem ? ASSIGNMENT_PROCEDURES.find(p => p.name === selectedItem) : null
  const showTimeSlots = activeTab === 'procedure' || activeTab === 'specialist'
  const showDosage = activeTab === 'medication'
  const showPayment = activeTab === 'procedure' && selectedProc?.isPaid

  function getCatalogForType(type: AssignmentType) {
    switch (type) {
      case 'medication': return ASSIGNMENT_MEDICATIONS.map(m => ({ name: m.name, sub: m.category }))
      case 'procedure': return ASSIGNMENT_PROCEDURES.map(p => ({ name: p.name, sub: \`\${p.category} · \${p.duration}\${p.isPaid ? ' · ' + p.price : ''}\` }))
      case 'specialist': return ASSIGNMENT_SPECIALISTS.map(s => ({ name: s.name, sub: s.role }))
      case 'analysis': return ASSIGNMENT_ANALYSES.map(a => ({ name: a.name, sub: a.category }))
    }
  }

  const catalog = getCatalogForType(activeTab)
  const filtered = catalog.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.sub.toLowerCase().includes(search.toLowerCase())
  )

  function handleAssign() {
    // In production: API call
    console.log('New assignment:', { type: activeTab, item: selectedItem, frequency, duration, dosage, selectedTimeSlot, isPaid, comment })
    onClose()
  }

  const canAssign = selectedItem !== null && (activeTab === 'medication' || selectedTimeSlot !== null || selectedItem !== null)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-border-subtle w-full max-w-3xl mx-4 max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border-subtle flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Новое назначение</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Выберите тип и заполните параметры</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Tabs */}
        <div className="px-6 pt-4 shrink-0">
          <div className="inline-flex rounded-xl bg-gray-100 dark:bg-dark-surface p-1 gap-1">
            {assignmentTypeTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSelectedItem(null); setSelectedTimeSlot(null); setSearch('') }}
                className={\`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all \${
                  activeTab === tab.key
                    ? 'bg-white dark:bg-dark-card text-accent-tiffany shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }\`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content area: scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Catalog selection */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Каталог</h4>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text" placeholder={\`Поиск \${activeTab === 'medication' ? 'препарата' : activeTab === 'specialist' ? 'специалиста' : activeTab === 'analysis' ? 'исследования' : 'процедуры'}...\`}
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany"
                />
              </div>

              {/* Catalog items */}
              <div className="space-y-1.5 max-h-[250px] overflow-y-auto rounded-xl border border-gray-200 dark:border-dark-border-subtle">
                {filtered.map(item => {
                  const isSelected = selectedItem === item.name
                  return (
                    <button
                      key={item.name}
                      onClick={() => { setSelectedItem(isSelected ? null : item.name); setSelectedTimeSlot(null) }}
                      className={\`w-full text-left px-4 py-3 transition-colors \${
                        isSelected
                          ? 'bg-accent-tiffany/5 border-l-2 border-accent-tiffany'
                          : 'hover:bg-gray-50 dark:hover:bg-dark-surface/50 border-l-2 border-transparent'
                      }\`}
                    >
                      <p className={\`text-sm font-medium \${isSelected ? 'text-accent-tiffany' : 'text-gray-900 dark:text-gray-100'}\`}>{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.sub}</p>
                    </button>
                  )
                })}
                {filtered.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">Ничего не найдено</div>
                )}
              </div>
            </div>

            {/* RIGHT: Parameters */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Параметры назначения</h4>

              {!selectedItem && (
                <div className="p-6 rounded-xl border border-dashed border-gray-300 dark:border-dark-border text-center">
                  <ClipboardList className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">Выберите элемент из каталога</p>
                </div>
              )}

              {selectedItem && (
                <>
                  {/* Selected item summary */}
                  <div className="p-3 rounded-xl bg-accent-tiffany/5 dark:bg-accent-tiffany/10 border border-accent-tiffany/20 flex items-center gap-3">
                    <div className={\`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 \${getEventBg(activeTab === 'medication' ? 'visit' : activeTab === 'specialist' ? 'visit' : activeTab)}\`}>
                      {getRxTypeIcon(activeTab)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedItem}</p>
                      {selectedProc?.isPaid && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 mt-0.5">
                          Платно: {selectedProc.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dosage (medication only) */}
                  {showDosage && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Дозировка</label>
                      <input
                        type="text" placeholder="например, 100 мг" value={dosage}
                        onChange={e => setDosage(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany"
                      />
                    </div>
                  )}

                  {/* Frequency */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Частота</label>
                    <div className="flex flex-wrap gap-1.5">
                      {FREQUENCY_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setFrequency(opt)}
                          className={\`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors \${
                            frequency === opt
                              ? 'bg-accent-tiffany/10 text-accent-tiffany border border-accent-tiffany/30'
                              : 'bg-gray-50 dark:bg-dark-surface text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-dark-border hover:text-gray-700 dark:hover:text-gray-300'
                          }\`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Длительность курса</label>
                    <input
                      type="text" placeholder="например, 10 дней" value={duration}
                      onChange={e => setDuration(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany"
                    />
                  </div>

                  {/* Time slot selection (procedure / specialist) */}
                  {showTimeSlots && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Время</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map(slot => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTimeSlot(selectedTimeSlot === slot ? null : slot)}
                            className={\`px-2 py-2 rounded-lg text-xs font-medium transition-colors \${
                              selectedTimeSlot === slot
                                ? 'bg-accent-tiffany text-white shadow-sm'
                                : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border-subtle text-gray-600 dark:text-gray-300 hover:border-accent-tiffany hover:text-accent-tiffany'
                            }\`}
                          >
                            <Clock className="inline-block w-3 h-3 mr-0.5" />
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment toggle (paid procedures) */}
                  {showPayment && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber" />
                        <span className="text-sm text-amber-800 dark:text-amber-300 font-medium">Оплачено</span>
                      </div>
                      <button
                        role="switch" aria-checked={isPaid}
                        onClick={() => setIsPaid(!isPaid)}
                        className={\`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 \${
                          isPaid ? 'bg-accent-tiffany' : 'bg-gray-300 dark:bg-dark-border-subtle'
                        }\`}
                      >
                        <span className={\`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 \${
                          isPaid ? 'translate-x-4.5' : 'translate-x-0.5'
                        }\`} />
                      </button>
                    </div>
                  )}

                  {/* Comment */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Комментарий</label>
                    <textarea
                      rows={2} placeholder="Примечание к назначению…" value={comment}
                      onChange={e => setComment(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany resize-none"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-border-subtle flex items-center justify-between shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-dark-border-subtle text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
            Отмена
          </button>
          <button
            disabled={!canAssign}
            onClick={handleAssign}
            className={\`px-5 py-2.5 text-sm font-medium rounded-xl btn-enamel text-white transition-all \${
              canAssign
                ? 'bg-accent-tiffany hover:bg-accent-tiffany-dark cursor-pointer'
                : 'bg-gray-300 dark:bg-dark-surface text-gray-500 cursor-not-allowed'
            }\`}
          >
            Назначить
          </button>
        </div>
      </div>
    </div>
  )
}

`;

// Insert NewAssignmentModal before the LEFT PANEL section
const leftPanelMarker = '// ═══════════════════════════════════════════════════════════════════════\n// LEFT PANEL';
s = s.replace(leftPanelMarker, newAssignmentModal + leftPanelMarker);

// ── 5. Update modal call from ProcedureModal to NewAssignmentModal ──
s = s.replace(
  '{showProcedureModal && <ProcedureModal onClose={() => setShowProcedureModal(false)} onAssign={handleAssignProcedure} />}',
  '{showProcedureModal && <NewAssignmentModal onClose={() => setShowProcedureModal(false)} />}'
);

// ── 6. Rename button text ──
s = s.replace(
  '<Plus className="w-4 h-4" /> Назначить процедуру',
  '<Plus className="w-4 h-4" /> Новое назначение'
);

// ── 7. Remove unused handleAssignProcedure function ──
s = s.replace(
  /  function handleAssignProcedure\(procId: number\) \{[\s\S]*?^  \}/m,
  ''
);

// ── 8. Remove unused TreatmentPlan import ──
s = s.replace(
  "import { TreatmentPlan } from '@/components/altera/TreatmentPlan'\n",
  ''
);

// ── Write result ──
fs.writeFileSync(fp, s, 'utf-8');
console.log('✅ PatientCard.tsx patched: NewAssignmentModal replacing ProcedureModal');
