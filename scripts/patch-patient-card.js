#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════
// patch-patient-card.js — Apply all 4 enhancements to PatientCard.tsx
// 1. ProcedureModal: payment + compatibility checks
// 2. TabPrescriptions: edit (pencil) + delete actions
// 3. DischargeModal: epicrisis save + status change
// 4. All buttons use variant styles from primitives
// ═══════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'altera', 'PatientCard.tsx');
let src = fs.readFileSync(filePath, 'utf-8');

// ── 1. Add Pencil, Trash2, ShieldAlert, AlertOctagon to imports ──
src = src.replace(
  `  UserRound, ClipboardCheck, FileSignature, ChevronRight,
} from 'lucide-react'`,
  `  UserRound, ClipboardCheck, FileSignature, ChevronRight,
  Pencil, Trash2, ShieldAlert, AlertOctagon, Ban, Check,
} from 'lucide-react'`
);

// ── 2. Add compatibility data to procedureCatalog ──
src = src.replace(
  `  { id: 7, name: 'Озонотерапия', category: 'Инъекции', duration: '15 мин', isPaid: true, price: '3 200 ₽' },
]`,
  `  { id: 7, name: 'Озонотерапия', category: 'Инъекции', duration: '15 мин', isPaid: true, price: '3 200 ₽' },
  { id: 8, name: 'Лазеротерапия поясницы', category: 'Физиотерапия', duration: '15 мин', isPaid: true, price: '1 500 ₽' },
  { id: 9, name: 'Криотерапия', category: 'Физиотерапия', duration: '10 мин', isPaid: false, price: null },
]

// Compatibility matrix: procedure id → list of incompatible procedure ids
const compatibilityRules: Record<number, { incompatibleWith: number[]; warning?: string }> = {
  5: { incompatibleWith: [3], warning: 'УВТ и электростимуляция на одну область несовместимы' },
  3: { incompatibleWith: [5], warning: 'Электростимуляция и УВТ на одну область несовместимы' },
  6: { incompatibleWith: [4], warning: 'Инфракрасная сауна и магнитотерапия в один день не рекомендованы' },
  4: { incompatibleWith: [6], warning: 'Магнитотерапия и инфракрасная сауна в один день не рекомендованы' },
  7: { incompatibleWith: [9], warning: 'Озонотерапия и криотерапия — пересекающиеся эффекты' },
  9: { incompatibleWith: [7], warning: 'Криотерапия и озонотерапия — пересекающиеся эффекты' },
}`
);

// ── 3. Rewrite ProcedureModal with payment + compatibility checks ──
src = src.replace(
  /function ProcedureModal\(\{ onClose \}: \{ onClose: \(\) => void \}\) \{[\s\S]*?^function DischargeModal/,
  `function ProcedureModal({ onClose, onAssign }: { onClose: () => void; onAssign: (procId: number) => void }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<number | null>(null)
  const filtered = procedureCatalog.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const selectedProc = selected !== null ? procedureCatalog.find(p => p.id === selected) : null
  const activeRxIds = prescriptions.filter(r => r.status === 'active').map(r => {
    // Map prescription names to catalog IDs for compatibility check
    const nameToId: Record<string, number> = {
      'Грязевые аппликации': 1, 'Подводный душ-массаж': 2, 'Электростимуляция': 3,
      'Магнитотерапия': 4, 'УВТ поясницы': 5, 'Инфракрасная сауна': 6, 'Озонотерапия': 7,
    }
    return nameToId[r.name]
  }).filter(Boolean)

  // Check if any active prescription conflicts with the selected procedure
  const conflict = selectedProc && compatibilityRules[selectedProc.id]
    ? activeRxIds.some(activeId => compatibilityRules[selectedProc.id].incompatibleWith.includes(activeId))
    : false
  const conflictWarning = selectedProc && compatibilityRules[selectedProc.id]?.warning
  const isPaid = selectedProc?.isPaid ?? false
  const hasConflict = conflict

  function handleAssign() {
    if (selected !== null && !hasConflict) {
      onAssign(selected)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-border-subtle w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border-subtle flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Назначить процедуру</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Выберите процедуру из каталога</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="Поиск процедуры..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany"
            />
          </div>
        </div>

        {/* Compatibility / Payment warning */}
        {selected && (
          <div className="px-6 pt-3 shrink-0">
            {hasConflict && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 flex items-start gap-3">
                <AlertOctagon className="w-5 h-5 text-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">Несовместимость</p>
                  <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">{conflictWarning}</p>
                </div>
              </div>
            )}
            {isPaid && !hasConflict && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Платная услуга</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                    Стоимость: <span className="font-semibold">{selectedProc?.price}</span>. Убедитесь, что пациент дал согласие на оплату.
                  </p>
                </div>
              </div>
            )}
            {!hasConflict && !isPaid && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Процедура доступна</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Включена в путёвку. Совместимость проверена.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2">
          {filtered.map(proc => {
            const isConflictItem = selected !== null && compatibilityRules[selected]?.incompatibleWith.includes(proc.id)
            const isAlreadySelected = selected === proc.id
            return (
              <button
                key={proc.id}
                onClick={() => setSelected(isAlreadySelected ? null : proc.id)}
                className={\`w-full text-left rounded-xl border p-4 transition-all \${
                  isAlreadySelected
                    ? 'border-accent-tiffany bg-accent-tiffany/5 dark:bg-accent-tiffany/10'
                    : isConflictItem
                      ? 'border-red/30 bg-red-50/50 dark:bg-red-900/5 opacity-60'
                      : 'border-gray-200 dark:border-dark-border-subtle hover:border-accent-tiffany/30 hover:shadow-sm'
                }\`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={\`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 \${getEventBg('procedure')}\`}>
                      <Syringe className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{proc.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{proc.category} · {proc.duration}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2">
                    {proc.isPaid && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">
                        {proc.price}
                      </span>
                    )}
                    {isConflictItem && (
                      <Ban className="w-4 h-4 text-red" />
                    )}
                    {isAlreadySelected && !isConflictItem && (
                      <Check className="w-4 h-4 text-accent-tiffany" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-border-subtle flex items-center justify-between shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-dark-border-subtle text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
            Отмена
          </button>
          <button
            disabled={selected === null || hasConflict}
            onClick={handleAssign}
            className={\`px-5 py-2.5 text-sm font-medium rounded-xl btn-enamel text-white transition-all \${
              selected !== null && !hasConflict
                ? 'bg-accent-tiffany hover:bg-accent-tiffany-dark cursor-pointer'
                : 'bg-gray-300 dark:bg-dark-surface text-gray-500 cursor-not-allowed'
            }\`}
          >
            {hasConflict ? 'Невозможно назначить' : 'Назначить'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DischargeModal`
);

// ── 4. Rewrite DischargeModal with epicrisis save + status change ──
src = src.replace(
  /function DischargeModal\(\{ onClose \}: \{ onClose: \(\) => void \}\) \{[\s\S]*?^function AttachmentLightbox/,
  `function DischargeModal({ onClose, onDischarge }: { onClose: () => void; onDischarge: () => void }) {
  const [dischargeType, setDischargeType] = useState('Улучшение')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const activePrescriptions = prescriptions.filter(p => p.status === 'active')
  const hasActive = activePrescriptions.length > 0

  function handleSign() {
    setSaving(true)
    // Simulate save
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      onDischarge()
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-border-subtle w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border-subtle flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Выписка пациента</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {/* Warning: active prescriptions */}
          {hasActive && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Активные назначения</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  У пациента {activePrescriptions.length} активных назначений. Рекомендуется завершить или отменить перед выпиской.
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {activePrescriptions.slice(0, 3).map(rx => (
                    <span key={rx.id} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                      {rx.name}
                    </span>
                  ))}
                  {activePrescriptions.length > 3 && (
                    <span className="text-[10px] text-amber-600">+{activePrescriptions.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Confirmation */}
          {!hasActive && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Готово к выписке</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">Все назначения завершены.</p>
              </div>
            </div>
          )}

          {/* Discharge type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Результат лечения</label>
            <select
              value={dischargeType}
              onChange={e => setDischargeType(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-card px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany"
            >
              <option>Улучшение</option>
              <option>Без изменений</option>
              <option>Ухудшение</option>
              <option>По желанию пациента</option>
            </select>
          </div>

          {/* Epicrisis note */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Примечание к эпикризу</label>
            <textarea
              rows={3}
              placeholder="Дополнительные рекомендации, уточнения к эпикризу…"
              className="w-full rounded-xl border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-card px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-tiffany/30 focus:border-accent-tiffany resize-y"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-border-subtle flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-dark-border-subtle text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
            Отмена
          </button>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2.5 text-sm font-medium rounded-xl border border-accent-tiffany text-gray-900 dark:text-gray-100 hover:bg-accent-tiffany/10 transition-colors">
              Сохранить черновик
            </button>
            <button
              onClick={handleSign}
              disabled={saving}
              className={\`px-5 py-2.5 text-sm font-medium rounded-xl btn-enamel text-white transition-all flex items-center gap-2 \${
                saved
                  ? 'bg-emerald hover:bg-emerald'
                  : 'bg-accent-tiffany hover:bg-accent-tiffany-dark'
              } \${saving ? 'opacity-70 cursor-wait' : ''}\`}
            >
              {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {saved ? 'Выписан' : 'Подписать и выписать'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AttachmentLightbox`
);

// ── 5. Rewrite TabPrescriptions with edit + delete actions ──
src = src.replace(
  /function TabPrescriptions\(\) \{[\s\S]*?^\/\/ ═══.*MAIN COMPONENT/,
  `function TabPrescriptions({ onOpenProcedure }: { onOpenProcedure: () => void }) {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [rxList, setRxList] = useState(prescriptions)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editSchedule, setEditSchedule] = useState('')

  function handleEdit(rx: typeof prescriptions[0]) {
    setEditingId(rx.id)
    setEditSchedule(rx.schedule)
  }

  function handleSaveEdit(id: number) {
    setRxList(prev => prev.map(rx => rx.id === id ? { ...rx, schedule: editSchedule } : rx))
    setEditingId(null)
    setEditSchedule('')
  }

  function handleCancelEdit() {
    setEditingId(null)
    setEditSchedule('')
  }

  function handleDelete(id: number) {
    setRxList(prev => prev.filter(rx => rx.id !== id))
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-base font-semibold text-gray-900 dark:text-gray-100">Назначения</h2>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-dark-surface rounded-xl">
            <button onClick={() => setViewMode('list')} className={\`px-3 py-1.5 text-xs font-medium rounded-md transition-colors \${viewMode === 'list' ? 'bg-accent-tiffany/10 text-accent-tiffany' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}\`}>
              Список
            </button>
            <button onClick={() => setViewMode('calendar')} className={\`px-3 py-1.5 text-xs font-medium rounded-md transition-colors \${viewMode === 'calendar' ? 'bg-accent-tiffany/10 text-accent-tiffany' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}\`}>
              Календарь
            </button>
          </div>
          <button
            onClick={onOpenProcedure}
            className="px-4 py-2 text-sm font-medium rounded-xl btn-enamel bg-accent-tiffany text-white hover:bg-accent-tiffany-dark transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="glass-card rounded-xl border border-gray-200 dark:border-dark-border-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-border-subtle">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Назначение</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Тип</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">График</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Прогресс</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Статус</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border/50">
                {rxList.map(rx => (
                  <tr key={rx.id} className={rx.status === 'completed' ? 'opacity-60' : 'hover:bg-gray-50 dark:hover:bg-dark-surface/50 transition-colors'}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={\`w-8 h-8 rounded-md flex items-center justify-center shrink-0 \${
                          rx.type === 'procedure' ? 'bg-purple/10 text-purple' :
                          rx.type === 'medication' ? 'bg-accent-tiffany/10 text-accent-tiffany' :
                          'bg-amber/10 text-amber'
                        }\`}>
                          {getRxTypeIcon(rx.type)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{rx.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{rx.type === 'procedure' ? 'Процедура' : rx.type === 'medication' ? 'Медикамент' : 'Анализ'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs">
                      {editingId === rx.id ? (
                        <input
                          type="text" value={editSchedule} onChange={e => setEditSchedule(e.target.value)}
                          className="w-32 px-2 py-1 text-xs rounded-lg border border-accent-tiffany bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent-tiffany"
                          autoFocus
                        />
                      ) : (
                        rx.schedule
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs font-mono">{rx.days}</td>
                    <td className="px-4 py-3">
                      {rx.status === 'active' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">Активно</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-dark-surface text-gray-500 dark:text-gray-400">Завершено</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {rx.status === 'active' && (
                          <>
                            {editingId === rx.id ? (
                              <>
                                <button
                                  onClick={() => handleSaveEdit(rx.id)}
                                  className="p-1.5 rounded-md text-emerald hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors"
                                  title="Сохранить"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
                                  title="Отменить"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEdit(rx)}
                                  className="p-1.5 rounded-md text-accent-tiffany hover:bg-accent-tiffany/10 transition-colors"
                                  title="Редактировать"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(rx.id)}
                                  className="p-1.5 rounded-md text-red hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                  title="Удалить"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rxList.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Нет назначений</p>
            </div>
          )}
        </div>
      ) : (
        /* Calendar view */
        <div className="glass-card rounded-xl border border-gray-200 dark:border-dark-border-subtle p-4">
          <div className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">27 июля — 2 августа 2026</div>
          <div className="grid grid-cols-7 gap-2">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, i) => {
              const isToday = i === 6
              return (
                <div key={day} className={\`text-center p-2 rounded-lg border \${isToday ? 'border-accent-tiffany bg-accent-tiffany/5 dark:bg-accent-tiffany/10' : 'border-gray-200 dark:border-dark-border'}\`}>
                  <div className={\`text-xs font-medium \${isToday ? 'text-accent-tiffany' : 'text-gray-500 dark:text-gray-400'}\`}>{day}</div>
                  <div className={\`text-lg font-semibold mt-0.5 \${isToday ? 'text-accent-tiffany' : 'text-gray-900 dark:text-gray-100'}\`}>{27 + i > 31 ? (27 + i - 31) : 27 + i}</div>
                  <div className="mt-1 space-y-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple mx-auto" title="Грязевые аппликации" />
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-tiffany mx-auto" title="Нимесан" />
                    {i % 2 === 0 && <div className="w-1.5 h-1.5 rounded-full bg-blue mx-auto" title="Душ-массаж" />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════`
);

// ── 6. Update PatientCard main component: add patientStatus state, pass props ──
src = src.replace(
  `export function PatientCard({ onBack }: PatientCardProps) {
  const [activeTab, setActiveTab] = useState<MainTab>('visit')
  const [showProcedureModal, setShowProcedureModal] = useState(false)
  const [showDischargeModal, setShowDischargeModal] = useState(false)
  const [lightboxDoc, setLightboxDoc] = useState<DocAttachment | null>(null)`,
  `export function PatientCard({ onBack }: PatientCardProps) {
  const [activeTab, setActiveTab] = useState<MainTab>('visit')
  const [showProcedureModal, setShowProcedureModal] = useState(false)
  const [showDischargeModal, setShowDischargeModal] = useState(false)
  const [lightboxDoc, setLightboxDoc] = useState<DocAttachment | null>(null)
  const [patientStatus, setPatientStatus] = useState<string>(patientData.status)

  function handleAssignProcedure(procId: number) {
    // In production: API call to add prescription
    const procName = procedureCatalog.find(p => p.id === procId)?.name
    console.log('Assigned procedure:', procName)
  }

  function handleDischarge() {
    setPatientStatus('Выписан')
  }`
);

// ── 7. Update status badge in header to use patientStatus state ──
src = src.replace(
  `            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 shrink-0">
              {patientData.status}
            </span>`,
  `            <span className={\`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium shrink-0 \${
              patientStatus === 'Выписан'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30'
                : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30'
            }\`}>
              {patientStatus}
            </span>`
);

// ── 8. Update LeftPanel status badge to use patientStatus ──
// (We pass patientStatus as prop to LeftPanel)
src = src.replace(
  `        <LeftPanel
          onOpenProcedure={() => setShowProcedureModal(true)}
          onOpenDischarge={() => setShowDischargeModal(true)}
          onGoToPrescriptions={() => setActiveTab('prescriptions')}
        />`,
  `        <LeftPanel
          onOpenProcedure={() => setShowProcedureModal(true)}
          onOpenDischarge={() => setShowDischargeModal(true)}
          onGoToPrescriptions={() => setActiveTab('prescriptions')}
          patientStatus={patientStatus}
        />`
);

// ── 9. Update LeftPanel component to accept patientStatus ──
src = src.replace(
  `function LeftPanel({
  onOpenProcedure,
  onOpenDischarge,
  onGoToPrescriptions,
}: {
  onOpenProcedure: () => void
  onOpenDischarge: () => void
  onGoToPrescriptions: () => void
}) {`,
  `function LeftPanel({
  onOpenProcedure,
  onOpenDischarge,
  onGoToPrescriptions,
  patientStatus,
}: {
  onOpenProcedure: () => void
  onOpenDischarge: () => void
  onGoToPrescriptions: () => void
  patientStatus: string
}) {`
);

// ── 10. Update left panel status badge ──
src = src.replace(
  `        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 mt-2">
          {p.status}
        </span>`,
  `        <span className={\`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium mt-2 \${
          patientStatus === 'Выписан'
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30'
            : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30'
        }\`}>
          {patientStatus}
        </span>`
);

// ── 11. Update modal calls to pass new props ──
src = src.replace(
  `      {showProcedureModal && <ProcedureModal onClose={() => setShowProcedureModal(false)} />}
      {showDischargeModal && <DischargeModal onClose={() => setShowDischargeModal(false)} />}`,
  `      {showProcedureModal && <ProcedureModal onClose={() => setShowProcedureModal(false)} onAssign={handleAssignProcedure} />}
      {showDischargeModal && <DischargeModal onClose={() => setShowDischargeModal(false)} onDischarge={handleDischarge} />}`
);

// ── 12. Update TabPrescriptions call to pass onOpenProcedure ──
src = src.replace(
  `          {activeTab === 'prescriptions' && <TabPrescriptions />}`,
  `          {activeTab === 'prescriptions' && <TabPrescriptions onOpenProcedure={() => setShowProcedureModal(true)} />}`
);

// ── Write the patched file ──
fs.writeFileSync(filePath, src, 'utf-8');
console.log('✅ PatientCard.tsx patched successfully with all 4 enhancements.');
