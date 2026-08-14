#!/usr/bin/env node
/**
 * patch-patients-db.js — Wire PatientCard to shared patients DB, add allergy header, warnings
 *
 * Changes:
 * 1. Import getPatientById, allergyRestrictionMap from data/patients
 * 2. PatientCardProps: add patientId
 * 3. PatientCard: load data from DB, fallback to hardcoded patientData
 * 4. Add allergy/restriction badges in header (between name row and tab bar)
 * 5. Add AllergyWarningModal component
 * 6. NewAssignmentModal: check allergies before assigning
 * 7. Replace hardcoded data usage with DB data where possible
 */

const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, '..', 'src', 'components', 'altera', 'PatientCard.tsx')
let src = fs.readFileSync(FILE, 'utf-8')

// ═══════════════════════════════════════════════════════════════════════
// 1. Add import for data/patients
// ═══════════════════════════════════════════════════════════════════════

src = src.replace(
  `import { DischargeEpicrisis } from '@/components/altera/DischargeEpicrisis'`,
  `import { DischargeEpicrisis } from '@/components/altera/DischargeEpicrisis'\nimport { getPatientById, allergyRestrictionMap } from '@/data/patients'`
)

// Add ShieldAlert to imports (for allergy badge icon)
if (!src.includes('ShieldAlert')) {
  src = src.replace(
    `  Pencil, Trash2, ShieldAlert, AlertOctagon, Ban, Check,`,
    `  Pencil, Trash2, ShieldAlert, AlertOctagon, Ban, Check, ShieldCheck,`
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 2. Update PatientCardProps to accept patientId
// ═══════════════════════════════════════════════════════════════════════

src = src.replace(
  `export interface PatientCardProps {
  patient?: {
    id: number
    name: string
    shortName: string
    initials: string
    room: string
    hasNewAnalyses: boolean
  }
  onBack?: () => void
}`,
  `export interface PatientCardProps {
  patientId?: number
  patient?: {
    id: number
    name: string
    shortName: string
    initials: string
    room: string
    hasNewAnalyses: boolean
  }
  onBack?: () => void
}`
)

// ═══════════════════════════════════════════════════════════════════════
// 3. Add AllergyWarningModal component before MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

const ALLERGY_WARNING_MODAL = `// ═══════════════════════════════════════════════════════════════════════
// ALLERGY / RESTRICTION WARNING MODAL
// ═══════════════════════════════════════════════════════════════════════

function AllergyWarningModal({
  itemName,
  warnings,
  onClose,
  onConfirm,
}: {
  itemName: string
  warnings: { type: 'allergy' | 'restriction'; reason: string }[]
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card rounded-2xl shadow-2xl border border-red-200 dark:border-red-800/40 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-red-200 dark:border-red-800/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Предупреждение</h3>
        </div>
        <div className="px-6 py-5 space-y-3">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Пациенту противопоказано назначение <span className="font-semibold text-red-600 dark:text-red-400">{'\\u00AB'}{itemName}{'\\u00BB'}</span>.
          </p>
          <div className="space-y-2">
            {warnings.map((w, i) => (
              <div key={i} className={\`p-3 rounded-xl border flex items-start gap-2.5 \${
                w.type === 'allergy'
                  ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'
                  : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30'
              }\`}>
                {w.type === 'allergy' ? <AlertOctagon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                <div>
                  <p className={\`text-xs font-medium \${
                    w.type === 'allergy' ? 'text-red-700 dark:text-red-300' : 'text-amber-700 dark:text-amber-300'
                  }\`}>
                    {w.type === 'allergy' ? 'Аллергия' : 'Ограничение'}: {w.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            Вы можете отменить назначение или подтвердить его despite предупреждения.
          </p>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-border-subtle flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-dark-border-subtle text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
            Отменить
          </button>
          <button onClick={onConfirm} className="px-5 py-2.5 text-sm font-medium rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors">
            Назначить, несмотря на ограничение
          </button>
        </div>
      </div>
    </div>
  )
}

`

src = src.replace(
  '// ═══════════════════════════════════════════════════════════\n// MAIN COMPONENT',
  ALLERGY_WARNING_MODAL + '// ═══════════════════════════════════════════════════════════\n// MAIN COMPONENT'
)

// ═══════════════════════════════════════════════════════════════════════
// 4. Update PatientCard to accept patientId and load from DB
// ═══════════════════════════════════════════════════════════════════════

src = src.replace(
  `export function PatientCard({ onBack }: PatientCardProps) {
  const [activeTab, setActiveTab] = useState<MainTab>('visit')
  const [showProcedureModal, setShowProcedureModal] = useState(false)
  const [showDischargeModal, setShowDischargeModal] = useState(false)
  const [lightboxDoc, setLightboxDoc] = useState<DocAttachment | null>(null)
  const [patientStatus, setPatientStatus] = useState<string>(patientData.status)`,
  `export function PatientCard({ patientId, onBack }: PatientCardProps) {
  const [activeTab, setActiveTab] = useState<MainTab>('visit')
  const [showProcedureModal, setShowProcedureModal] = useState(false)
  const [showDischargeModal, setShowDischargeModal] = useState(false)
  const [lightboxDoc, setLightboxDoc] = useState<DocAttachment | null>(null)
  const [allergyWarning, setAllergyWarning] = useState<{ itemName: string; warnings: { type: 'allergy' | 'restriction'; reason: string }[]; onConfirm: () => void } | null>(null)

  // Load patient data from DB or fallback to hardcoded
  const dbPatient = patientId ? getPatientById(patientId) : undefined
  const pData = dbPatient?.profile ?? patientData
  const [patientStatus, setPatientStatus] = useState<string>(pData.status)

  // Allergies and restrictions from DB
  const allergies = dbPatient?.profile.allergies ?? []
  const restrictions = dbPatient?.profile.restrictions ?? []
  const diet = dbPatient?.profile.diet`
)

// ═══════════════════════════════════════════════════════════════════════
// 5. Replace hardcoded patientData references in header with pData
// ═══════════════════════════════════════════════════════════════════════

// Replace patientData.name → pData.name in header
src = src.replace(
  `            <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{patientData.name}</h1>`,
  `            <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{pData.name}</h1>`
)

src = src.replace(
  `            {patientData.diagnosisFull}`,
  `            {pData.diagnosisFull}`
)

src = src.replace(
  `            {patientData.age} лет, {patientData.gender === 'М' ? 'муж.' : 'жен.'} · палата {patientData.room} · {patientData.doctor}`,
  `            {pData.age} лет, {pData.gender === 'М' ? 'муж.' : 'жен.'}{pData.room !== '—' ? ' · палата ' + pData.room : ' · амбулаторный'} · {pData.doctor}`
)

src = src.replace(
  `          <span>{patientData.checkIn} → {patientData.checkOut}</span>`,
  `          <span>{pData.checkIn} → {pData.checkOut}</span>`
)

// Update status badge logic to use patientStatus (already from pData)
// Replace the second occurrence (in header badge)
const statusBadgeRegex = /patientStatus === 'Выписан'\s*\? 'bg-blue-50/g
src = src.replace(statusBadgeRegex, "patientStatus === 'Выписан' || patientStatus === 'Архив' ? 'bg-blue-50")

// ═══════════════════════════════════════════════════════════════════════
// 6. Add allergy/restriction block in header AFTER the meta row, BEFORE tab bar
// ═══════════════════════════════════════════════════════════════════════

const ALLERGY_HEADER_BLOCK = `
      {/* ── Allergies & Restrictions bar ── */}
      {(allergies.length > 0 || restrictions.length > 0 || diet) && (
        <div className="px-4 py-2 border-b border-gray-100 dark:border-dark-border/50 bg-white dark:bg-dark-card/50 flex items-center gap-2 flex-wrap">
          {allergies.map(a => (
            <span key={a} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-900/15 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30">
              <AlertOctagon className="w-3 h-3" />
              Аллергия: {a}
            </span>
          ))}
          {restrictions.map(r => (
            <span key={r} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-900/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">
              <ShieldAlert className="w-3 h-3" />
              {r}
            </span>
          ))}
          {diet && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-border">
              <ClipboardCheck className="w-3 h-3" />
              Диета: {diet}
            </span>
          )}
        </div>
      )}

`

src = src.replace(
  `      {/* ── Tab Bar (in the right content area) ── */}`,
  ALLERGY_HEADER_BLOCK + `      {/* ── Tab Bar (in the right content area) ── */}`
)

// ═══════════════════════════════════════════════════════════════════════
// 7. Update TabVisit to use DB data for previousVitals
// ═══════════════════════════════════════════════════════════════════════

// Replace the hardcoded previousVitals reference in TabVisit's right sidebar
// The TabVisit component uses `previousVitals` from the outer scope.
// We need to make it dynamic. The simplest approach: update the component to accept prop.
// But since TabVisit is internal, let's just check if we need to.

// Actually, TabVisit uses the global `previousVitals` constant. For DB patients we need
// to override it. Let's update the TabVisit component to use the DB data.

// For now, the global `previousVitals` will be used as fallback. The DB patient's
// previousVitals will be used when we pass them through. But since TabVisit doesn't
// take props for this, let me update it to accept a prop.

src = src.replace(
  `function TabVisit({ setActiveTab }: { setActiveTab: (t: MainTab) => void }) {`,
  `function TabVisit({ setActiveTab, prevVitals }: { setActiveTab: (t: MainTab) => void; prevVitals: typeof previousVitals }) {`
)

// Replace previousVitals references inside TabVisit with prevVitals prop
// This is tricky because previousVitals is used in the component AND in the global constants.
// We only want to replace inside TabVisit function.
// Let's do targeted replacements of the specific usages in TabVisit:

// In TabVisit, the pattern is `{previousVitals.bp}` etc.
src = src.replace(
  `              <span className="text-xs text-gray-500 dark:text-gray-400">Пред. значения</span>`,
  `              <span className="text-xs text-gray-500 dark:text-gray-400">Пред. значения</span>`,
)

// Replace `previousVitals.` with `prevVitals.` in TabVisit — targeted
// The occurrences are: previousVitals.bp, previousVitals.pulse, previousVitals.temp, previousVitals.spo2, previousVitals.rr, previousVitals.weight
const prevVitalsFields = ['bp', 'pulse', 'temp', 'spo2', 'rr', 'weight']
for (const field of prevVitalsFields) {
  // Only replace inside TabVisit (after its definition, before next component)
  // Since we're doing string replacements, let's be more precise
  src = src.replace(
    `pred.: {previousVitals.${field}}`,
    `pred.: {prevVitals.${field}}`
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 8. Update TabHistory to use DB visit data
// ═══════════════════════════════════════════════════════════════════════

// TabHistory uses the global `visitHistory` array. For DB patients, we need to use
// their visit data. Update to accept a prop.

src = src.replace(
  `function TabHistory({ onOpenLightbox }: { onOpenLightbox: (doc: DocAttachment) => void }) {
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const selected = selectedItem ? visitHistory.find(h => h.id === selectedItem) : null

  const hasAttachments = (item: typeof visitHistory[number]) => item.attachments && item.attachments.length > 0`,
  `function TabHistory({ onOpenLightbox, visits }: { onOpenLightbox: (doc: DocAttachment) => void; visits: typeof visitHistory }) {
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const selected = selectedItem ? visits.find(h => h.id === selectedItem) : null

  const hasAttachments = (item: typeof visitHistory[number]) => item.attachments && item.attachments.length > 0`
)

// Replace visitHistory.map with visits.map inside TabHistory
src = src.replace(
  `          {visitHistory.map(item => {`,
  `          {visits.map(item => {`
)

// Fix the type annotation for hasAttachments
src = src.replace(
  `  const hasAttachments = (item: typeof visitHistory[number]) => item.attachments && item.attachments.length > 0`,
  `  const hasAttachments = (item: typeof visits[number]) => item.attachments && item.attachments.length > 0`
)

// ═══════════════════════════════════════════════════════════════════════
// 9. Wire up the rendering to pass DB data
// ═══════════════════════════════════════════════════════════════════════

// Replace the content rendering to pass DB data
src = src.replace(
  `          {activeTab === 'visit' && <TabVisit setActiveTab={setActiveTab} />}`,
  `          {activeTab === 'visit' && <TabVisit setActiveTab={setActiveTab} prevVitals={dbPatient?.previousVitals ?? previousVitals} />}`
)

src = src.replace(
  `          {activeTab === 'history' && <TabHistory onOpenLightbox={setLightboxDoc} />}`,
  `          {activeTab === 'history' && <TabHistory onOpenLightbox={setLightboxDoc} visits={dbPatient?.visits ?? visitHistory} />}`
)

// ═══════════════════════════════════════════════════════════════════════
// 10. Add allergy warning to NewAssignmentModal
// ═══════════════════════════════════════════════════════════════════════

// Update NewAssignmentModal to accept patient allergies and show warning
src = src.replace(
  `function NewAssignmentModal({ onClose }: { onClose: () => void }) {`,
  `function NewAssignmentModal({ onClose, allergies, restrictions, onAssign }: { onClose: () => void; allergies: string[]; restrictions: string[]; onAssign: (item: string, params: Record<string, string>) => void }) {`
)

// Update the handleAssign function to check allergies
src = src.replace(
  `  function handleAssign() {
    // In production: API call
    console.log('New assignment:', { type: activeTab, item: selectedItem, frequency, duration, dosage, selectedTimeSlot, isPaid, comment })
    onClose()
  }`,
  `  function handleAssign() {
    if (!selectedItem) return
    // Check for allergy/restriction conflicts
    const globalWarnings = allergyRestrictionMap[selectedItem] ?? []
    const patientAllergyWarnings = allergies.filter(a =>
      selectedItem.toLowerCase().includes(a.toLowerCase())
    ).map(a => ({ type: 'allergy' as const, reason: a }))
    const patientRestrictionWarnings = restrictions.filter(r =>
      selectedItem.toLowerCase().includes(r.toLowerCase())
    ).map(r => ({ type: 'restriction' as const, reason: r }))
    const allWarnings = [...globalWarnings, ...patientAllergyWarnings, ...patientRestrictionWarnings]

    if (allWarnings.length > 0) {
      onAssign(selectedItem, { frequency, duration, dosage, selectedTimeSlot: selectedTimeSlot ?? '', comment })
      // We store the pending action for the parent to show warning
      console.log('Allergy warning for:', selectedItem, allWarnings)
      return
    }

    // No warnings — proceed
    onAssign(selectedItem, { frequency, duration, dosage, selectedTimeSlot: selectedTimeSlot ?? '', comment })
    onClose()
  }`
)

// ═══════════════════════════════════════════════════════════════════════
// 11. Wire up the NewAssignmentModal call in main component
// ═══════════════════════════════════════════════════════════════════════

// Add handler for assignment with allergy check
src = src.replace(
  `  function handleDischarge() {
    setPatientStatus('Выписан')
  }`,
  `  function handleDischarge() {
    setPatientStatus('Выписан')
  }

  function handleNewAssignment(itemName: string, params: Record<string, string>) {
    // Check for conflicts with patient allergies/restrictions
    const globalWarnings = allergyRestrictionMap[itemName] ?? []
    const patientAllergyWarnings = allergies.filter(a =>
      itemName.toLowerCase().includes(a.toLowerCase())
    ).map(a => ({ type: 'allergy' as const, reason: a }))
    const patientRestrictionWarnings = restrictions.filter(r =>
      itemName.toLowerCase().includes(r.toLowerCase())
    ).map(r => ({ type: 'restriction' as const, reason: r }))
    const allWarnings = [...globalWarnings, ...patientAllergyWarnings, ...patientRestrictionWarnings]

    if (allWarnings.length > 0) {
      setAllergyWarning({
        itemName,
        warnings: allWarnings,
        onConfirm: () => {
          console.log('Assigned despite warning:', { itemName, params })
          setAllergyWarning(null)
          setShowProcedureModal(false)
        },
      })
    } else {
      console.log('Assigned:', { itemName, params })
      setShowProcedureModal(false)
    }
  }`
)

// Update NewAssignmentModal rendering to pass props
src = src.replace(
  `      {showProcedureModal && <NewAssignmentModal onClose={() => setShowProcedureModal(false)} />}`,
  `      {showProcedureModal && <NewAssignmentModal onClose={() => setShowProcedureModal(false)} allergies={allergies} restrictions={restrictions} onAssign={handleNewAssignment} />}`
)

// Add allergy warning modal rendering
src = src.replace(
  `      {showDischargeModal && <DischargeModal onClose={() => setShowDischargeModal(false)} onDischarge={handleDischarge} />}`,
  `      {showDischargeModal && <DischargeModal onClose={() => setShowDischargeModal(false)} onDischarge={handleDischarge} />}
      {allergyWarning && <AllergyWarningModal itemName={allergyWarning.itemName} warnings={allergyWarning.warnings} onClose={() => setAllergyWarning(null)} onConfirm={allergyWarning.onConfirm} />}`
)

// ═══════════════════════════════════════════════════════════════════════
// 12. Update header initials to use pData
// ═══════════════════════════════════════════════════════════════════════

const pDataInitials = "const headerInitials = pData.name.split(' ').map(n => n[0]).join('').slice(0, 2)"
src = src.replace(
  `          <span className="text-xs font-semibold text-accent-tiffany">КВ</span>`,
  `          <span className="text-xs font-semibold text-accent-tiffany">{pData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>`
)

// ═══════════════════════════════════════════════════════════════════════
// Write back
// ═══════════════════════════════════════════════════════════════════════

fs.writeFileSync(FILE, src, 'utf-8')
console.log('✓ PatientCard.tsx patched with patients DB integration')
console.log('  - Added import for getPatientById, allergyRestrictionMap')
console.log('  - PatientCard accepts patientId prop')
console.log('  - Allergy/restriction badges in header')
console.log('  - AllergyWarningModal component')
console.log('  - NewAssignmentModal checks allergies')
console.log('  - TabVisit accepts prevVitals prop')
console.log('  - TabHistory accepts visits prop')
