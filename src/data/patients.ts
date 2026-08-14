/**
 * patients.ts — Unified patient database for MIS Altera prototype
 * All 7 patients with profiles, allergies, restrictions, visits, prescriptions, vitals
 */

export interface PatientProfile {
  id: number
  name: string
  age: number
  gender: 'М' | 'Ж'
  room: string
  checkIn: string   // DD.MM.YYYY
  checkOut: string
  daysElapsed: number
  daysTotal: number
  diagnosis: string
  diagnosisFull: string
  status: 'Лечится' | 'Готовится к выписке' | 'Выписан' | 'Архив' | 'Амбулаторный' | 'Просрочено'
  doctor: string
  allergies: string[]
  restrictions: string[]
  diet?: string
}

export interface DocAttachment {
  name: string
  type: 'pdf' | 'xlsx' | 'image' | 'video'
}

export interface VisitEntry {
  id: number
  date: string
  time: string
  type: string   // 'Терапевт' | 'Невролог' | 'Кардиолог' | 'Процедура' | 'Исследование'
  doctor: string
  summary: string
  attachments: DocAttachment[]
}

export interface PrescriptionEntry {
  id: number
  name: string
  type: 'procedure' | 'medication' | 'analysis' | 'consultation'
  schedule: string
  days: string    // 'done/total' or '—' or '✓'
  status: 'active' | 'completed'
  isPaid?: boolean
  paymentRequired?: boolean
  paymentDone?: boolean
}

export interface VitalEntry {
  label: string
  value: string
  unit: string
  status: 'normal' | 'warning' | 'abnormal'
}

export interface LabGroup {
  group: string
  items: { name: string; value: string; norm: string; status: 'normal' | 'abnormal' | 'warning' }[]
}

export interface PatientData {
  profile: PatientProfile
  vitals: VitalEntry[]
  visits: VisitEntry[]
  prescriptions: PrescriptionEntry[]
  labResults: LabGroup[]
  previousVitals: { bp: string; pulse: string; temp: string; spo2: string; rr: string; weight: string }
  epicrisisDraft?: string
}

// ═══════════════════════════════════════════════════════════════════════
// PATIENT 1 — Петров И.А. (new, no visits, no prescriptions)
// ═══════════════════════════════════════════════════════════════════════

const patient1: PatientData = {
  profile: {
    id: 1, name: 'Петров Иван Алексеевич', age: 45, gender: 'М',
    room: '314', checkIn: '01.08.2026', checkOut: '15.08.2026',
    daysElapsed: 0, daysTotal: 14,
    diagnosis: 'M54.5 — Боль в пояснице',
    diagnosisFull: 'M54.5 — Люмбагия. Дегенеративно-дистрофические изменения поясничного отдела позвоночника.',
    status: 'Лечится', doctor: 'Иванов И.М.',
    allergies: [],
    restrictions: [],
  },
  vitals: [],
  visits: [],
  prescriptions: [],
  labResults: [],
  previousVitals: { bp: '', pulse: '', temp: '', spo2: '', rr: '', weight: '' },
}

// ═══════════════════════════════════════════════════════════════════════
// PATIENT 2 — Сидорова Е.В. (allergies: пенициллин, restriction: горячие ванны)
// ═══════════════════════════════════════════════════════════════════════

const patient2: PatientData = {
  profile: {
    id: 2, name: 'Сидорова Елена Викторовна', age: 52, gender: 'Ж',
    room: '215', checkIn: '05.08.2026', checkOut: '25.08.2026',
    daysElapsed: 10, daysTotal: 20,
    diagnosis: 'I10 — Эссенциальная гипертензия',
    diagnosisFull: 'I10 — Эссенциальная (первичная) гипертензия. Гипертоническая болезнь II стадии, риск 3.',
    status: 'Лечится', doctor: 'Сидорова О.Н.',
    allergies: ['Пенициллин'],
    restrictions: ['Горячие ванны', 'Криотерапия'],
    diet: 'Стол №10',
  },
  vitals: [
    { label: 'АД', value: '145/92', unit: 'мм рт.ст.', status: 'warning' },
    { label: 'Температура', value: '36.6', unit: '°C', status: 'normal' },
    { label: 'СпО2', value: '98', unit: '%', status: 'normal' },
    { label: 'Пульс', value: '74', unit: 'уд/мин', status: 'normal' },
    { label: 'Вес', value: '71', unit: 'кг', status: 'normal' },
  ],
  visits: [
    { id: 1, date: '10.08.2026', time: '09:00', type: 'Терапевт', doctor: 'Сидорова О.Н.', summary: 'Осмотр. АД 145/92, пульс 74. Жалобы на головную боль. Коррекция терапии.', attachments: [] },
    { id: 2, date: '07.08.2026', time: '11:00', type: 'Кардиолог', doctor: 'Козлов А.П.', summary: 'Консультация. Рекомендовано: ЭКГ, ЭхоКГ.', attachments: [
      { name: 'Заключение_кардиолога_Козлов.pdf', type: 'pdf' },
    ] },
    { id: 3, date: '05.08.2026', time: '10:00', type: 'Терапевт', doctor: 'Сидорова О.Н.', summary: 'Первичный осмотр. АД 150/95. Назначен план лечения.', attachments: [
      { name: 'Направление_в_санаторий.pdf', type: 'pdf' },
      { name: 'Выписка_из_карты.pdf', type: 'pdf' },
      { name: 'ЭКГ_входное.pdf', type: 'pdf' },
    ] },
  ],
  prescriptions: [
    { id: 1, name: 'ЛФК', type: 'procedure', schedule: 'Ежедневно', days: '6/12', status: 'active' },
    { id: 2, name: 'Массаж воротниковой зоны', type: 'procedure', schedule: 'Пн, Ср, Пт', days: '4/8', status: 'active' },
    { id: 3, name: 'Грязелечение', type: 'procedure', schedule: 'Вт, Чт', days: '3/8', status: 'active', isPaid: true, paymentRequired: true, paymentDone: false },
    { id: 4, name: 'Эналаприл 5мг', type: 'medication', schedule: '1 раз/день', days: '—', status: 'active' },
    { id: 5, name: 'Аспаркам', type: 'medication', schedule: '2 раза/день', days: '—', status: 'active' },
    { id: 6, name: 'ЭКГ контрольное', type: 'analysis', schedule: 'Выполнено 12.08', days: '✓', status: 'completed' },
  ],
  labResults: [
    { group: 'Биохимия', items: [
      { name: 'Глюкоза', value: '5.2 ммоль/л', norm: '4.1–5.9', status: 'normal' },
      { name: 'Холестерин общий', value: '6.1 ммоль/л', norm: '< 5.2', status: 'abnormal' },
      { name: 'Калий', value: '4.2 ммоль/л', norm: '3.5–5.1', status: 'normal' },
    ] },
    { group: 'Гематология', items: [
      { name: 'Гемоглобин', value: '125 г/л', norm: '120–140', status: 'normal' },
      { name: 'Лейкоциты', value: '6.2 × 10⁹/л', norm: '4.0–9.0', status: 'normal' },
    ] },
  ],
  previousVitals: { bp: '145/92', pulse: '74', temp: '36.6', spo2: '98', rr: '16', weight: '71' },
}

// ═══════════════════════════════════════════════════════════════════════
// PATIENT 3 — Козлов Д.П. (ready for discharge, has epicrisis draft)
// ═══════════════════════════════════════════════════════════════════════

const patient3: PatientData = {
  profile: {
    id: 3, name: 'Козлов Дмитрий Петрович', age: 58, gender: 'М',
    room: '409', checkIn: '14.07.2026', checkOut: '03.08.2026',
    daysElapsed: 20, daysTotal: 20,
    diagnosis: 'E78.5 — Дислипидемия',
    diagnosisFull: 'E78.5 — Гиперлипидемия смешанного типа. Повышенный уровень холестерина и триглицеридов.',
    status: 'Готовится к выписке', doctor: 'Сидорова О.Н.',
    allergies: [],
    restrictions: [],
    diet: 'Стол №10',
  },
  vitals: [
    { label: 'АД', value: '125/80', unit: 'мм рт.ст.', status: 'normal' },
    { label: 'Температура', value: '36.7', unit: '°C', status: 'normal' },
    { label: 'СпО2', value: '96', unit: '%', status: 'normal' },
    { label: 'Пульс', value: '68', unit: 'уд/мин', status: 'normal' },
    { label: 'Вес', value: '91', unit: 'кг', status: 'normal' },
  ],
  visits: [
    { id: 1, date: '02.08.2026', time: '10:00', type: 'Терапевт', doctor: 'Сидорова О.Н.', summary: 'Предвыписной осмотр. Состояние стабильное. Холестерин снизился с 7.2 до 5.8.', attachments: [] },
    { id: 2, date: '28.07.2026', time: '09:30', type: 'Терапевт', doctor: 'Сидорова О.Н.', summary: 'Осмотр. Динамика положительная. Продолжить лечение.', attachments: [
      { name: 'Биохимия_контроль_28.07.xlsx', type: 'xlsx' },
    ] },
    { id: 3, date: '14.07.2026', time: '10:00', type: 'Терапевт', doctor: 'Сидорова О.Н.', summary: 'Вступительный осмотр. Холестерин 7.2, триглицериды 2.8.', attachments: [
      { name: 'Направление_в_санаторий.pdf', type: 'pdf' },
      { name: 'Липидограмма_входная.xlsx', type: 'xlsx' },
    ] },
  ],
  prescriptions: [
    { id: 1, name: 'ЛФК (группа)', type: 'procedure', schedule: 'Ежедневно', days: '18/18', status: 'completed' },
    { id: 2, name: 'Массаж', type: 'procedure', schedule: 'Пн, Ср, Пт', days: '8/8', status: 'completed' },
    { id: 3, name: 'Фитотерапия', type: 'procedure', schedule: 'Ежедневно', days: '18/18', status: 'completed' },
    { id: 4, name: 'Розувастатин 20мг', type: 'medication', schedule: '1 раз/день (вечер)', days: '—', status: 'active' },
    { id: 5, name: 'Омега-3', type: 'medication', schedule: '2 раза/день', days: '—', status: 'active' },
  ],
  labResults: [
    { group: 'Биохимия', items: [
      { name: 'Холестерин общий', value: '5.8 ммоль/л', norm: '< 5.2', status: 'warning' },
      { name: 'ЛПНП', value: '3.8 ммоль/л', norm: '< 3.0', status: 'warning' },
      { name: 'Триглицериды', value: '1.9 ммоль/л', norm: '< 1.7', status: 'warning' },
    ] },
  ],
  previousVitals: { bp: '125/80', pulse: '68', temp: '36.7', spo2: '96', rr: '15', weight: '91' },
  epicrisisDraft: 'Пациент Козлов Д.П. находился на лечении с 14.07 по 03.08.2026 с диагнозом E78.5 — Дислипидемия смешанного типа. Проведено лечение: диетотерапия стол №10, ЛФК, массаж, фитотерапия. На фоне терапии отмечена положительная динамика: уровень холестерина снизился с 7.2 до 5.8 ммоль/л. Рекомендовано продолжить приём розувастатина 20мг, контроль липидограммы через 1 месяц.',
}

// ═══════════════════════════════════════════════════════════════════════
// PATIENT 4 — Смирнова О.Н. (discharged / archive)
// ═══════════════════════════════════════════════════════════════════════

const patient4: PatientData = {
  profile: {
    id: 4, name: 'Смирнова Ольга Николаевна', age: 61, gender: 'Ж',
    room: '223', checkIn: '08.07.2026', checkOut: '30.07.2026',
    daysElapsed: 22, daysTotal: 22,
    diagnosis: 'M17 — Гонартроз',
    diagnosisFull: 'M17 — Первичный гонартроз обоих коленных суставов, II стадия. Хронический болевой синдром.',
    status: 'Выписан', doctor: 'Иванов И.М.',
    allergies: [],
    restrictions: [],
  },
  vitals: [
    { label: 'АД', value: '128/82', unit: 'мм рт.ст.', status: 'normal' },
    { label: 'Температура', value: '36.5', unit: '°C', status: 'normal' },
    { label: 'СпО2', value: '97', unit: '%', status: 'normal' },
    { label: 'Пульс', value: '70', unit: 'уд/мин', status: 'normal' },
    { label: 'Вес', value: '78', unit: 'кг', status: 'normal' },
  ],
  visits: [
    { id: 1, date: '29.07.2026', time: '10:00', type: 'Терапевт', doctor: 'Иванов И.М.', summary: 'Выписной осмотр. Болевой синдром купирован. Рекомендовано продолжение ЛФК амбулаторно.', attachments: [
      { name: 'Эпикриз_Смирнова.pdf', type: 'pdf' },
    ] },
    { id: 2, date: '22.07.2026', time: '09:00', type: 'Невролог', doctor: 'Сидорова О.Н.', summary: 'Консультация. Рекомендована магнитотерапия на коленные суставы.', attachments: [] },
    { id: 3, date: '15.07.2026', time: '11:00', type: 'Процедура', doctor: 'Фёдорова Е.В.', summary: 'УЗИ коленных суставов. Признаки остеоартроза, выпот минимальный.', attachments: [
      { name: 'УЗИ_коленей_протокол.pdf', type: 'pdf' },
      { name: 'УЗИ_колено_правое.png', type: 'image' },
    ] },
    { id: 4, date: '08.07.2026', time: '10:00', type: 'Терапевт', doctor: 'Иванов И.М.', summary: 'Первичный осмотр. Жалобы на боли в обоих коленях, хруст.', attachments: [
      { name: 'Направление.pdf', type: 'pdf' },
      { name: 'Рентген_коленей.pdf', type: 'image' },
    ] },
  ],
  prescriptions: [
    { id: 1, name: 'ЛФК суставная гимнастика', type: 'procedure', schedule: 'Ежедневно', days: '20/20', status: 'completed' },
    { id: 2, name: 'Магнитотерапия коленей', type: 'procedure', schedule: 'Пн, Ср, Пт', days: '8/8', status: 'completed' },
    { id: 3, name: 'Фонофорез гидрокортизона', type: 'procedure', schedule: 'Вт, Чт', days: '6/6', status: 'completed' },
    { id: 4, name: 'Нимесулид 100мг', type: 'medication', schedule: '2 раза/день', days: '14/14', status: 'completed' },
  ],
  labResults: [
    { group: 'Гематология', items: [
      { name: 'Гемоглобин', value: '118 г/л', norm: '120–140', status: 'warning' },
      { name: 'СОЭ', value: '18 мм/ч', norm: '2–15', status: 'warning' },
    ] },
  ],
  previousVitals: { bp: '128/82', pulse: '70', temp: '36.5', spo2: '97', rr: '16', weight: '78' },
}

// ═══════════════════════════════════════════════════════════════════════
// PATIENT 5 — Иванов М.С. (ambulatory / employee, allergy: aspirin)
// ═══════════════════════════════════════════════════════════════════════

const patient5: PatientData = {
  profile: {
    id: 5, name: 'Иванов Михаил Сергеевич', age: 34, gender: 'М',
    room: '—', checkIn: '10.08.2026', checkOut: '10.08.2026',
    daysElapsed: 0, daysTotal: 1,
    diagnosis: 'J06.9 — ОРВИ',
    diagnosisFull: 'J06.9 — Острая респираторная вирусная инфекция. Лёгкое течение.',
    status: 'Амбулаторный', doctor: 'Иванов И.М.',
    allergies: ['Аспирин', 'Ибупрофен'],
    restrictions: [],
  },
  vitals: [
    { label: 'АД', value: '118/75', unit: 'мм рт.ст.', status: 'normal' },
    { label: 'Температура', value: '37.4', unit: '°C', status: 'warning' },
    { label: 'СпО2', value: '98', unit: '%', status: 'normal' },
    { label: 'Пульс', value: '82', unit: 'уд/мин', status: 'normal' },
    { label: 'Вес', value: '75', unit: 'кг', status: 'normal' },
  ],
  visits: [
    { id: 1, date: '10.08.2026', time: '14:00', type: 'Терапевт', doctor: 'Иванов И.М.', summary: 'Обращение по поводу ОРВИ. Температура 37.4, насморк, кашель. Справка выдана.', attachments: [
      { name: 'Справка_для_работы.pdf', type: 'pdf' },
    ] },
  ],
  prescriptions: [
    { id: 1, name: 'Парацетамол 500мг', type: 'medication', schedule: 'По мере необходимости', days: '—', status: 'active' },
    { id: 2, name: 'Витамин С', type: 'medication', schedule: '1 раз/день', days: '—', status: 'active' },
  ],
  labResults: [],
  previousVitals: { bp: '118/75', pulse: '82', temp: '37.4', spo2: '98', rr: '18', weight: '75' },
}

// ═══════════════════════════════════════════════════════════════════════
// PATIENT 6 — Воронова А.А. (overdue, conflict, allergy: iodine, restriction: mud)
// ═══════════════════════════════════════════════════════════════════════

const patient6: PatientData = {
  profile: {
    id: 6, name: 'Воронова Анна Андреевна', age: 49, gender: 'Ж',
    room: '118', checkIn: '20.06.2026', checkOut: '10.07.2026',
    daysElapsed: 21, daysTotal: 20,
    diagnosis: 'G43 — Мигрень',
    diagnosisFull: 'G43.9 — Мигрень без ауры. Частота приступов 3–4 раза в месяц. Хроническая мигрень.',
    status: 'Просрочено', doctor: 'Сидорова О.Н.',
    allergies: ['Йод'],
    restrictions: ['Грязевые аппликации'],
  },
  vitals: [
    { label: 'АД', value: '135/88', unit: 'мм рт.ст.', status: 'warning' },
    { label: 'Температура', value: '36.9', unit: '°C', status: 'normal' },
    { label: 'СпО2', value: '97', unit: '%', status: 'normal' },
    { label: 'Пульс', value: '80', unit: 'уд/мин', status: 'normal' },
    { label: 'Вес', value: '64', unit: 'кг', status: 'normal' },
  ],
  visits: [
    { id: 1, date: '08.07.2026', time: '10:00', type: 'Терапевт', doctor: 'Сидорова О.Н.', summary: 'Осмотр. Частота приступов снизилась до 1–2 в неделю. Необходимо продление лечения.', attachments: [] },
    { id: 2, date: '04.07.2026', time: '09:00', type: 'Невролог', doctor: 'Сидорова О.Н.', summary: 'Конфликт назначений: магнитотерапия и электростимуляция в один день. Перенести.', attachments: [
      { name: 'Заключение_невролога.pdf', type: 'pdf' },
    ] },
    { id: 3, date: '20.06.2026', time: '10:00', type: 'Терапевт', doctor: 'Сидорова О.Н.', summary: 'Первичный осмотр. Мигрень, 3–4 приступа в месяц. Назначен план.', attachments: [
      { name: 'Направление.pdf', type: 'pdf' },
      { name: 'МРТ_головного_мозга.png', type: 'image' },
    ] },
  ],
  prescriptions: [
    { id: 1, name: 'Магнитотерапия', type: 'procedure', schedule: 'Пн, Ср, Пт', days: '9/12', status: 'active' },
    { id: 2, name: 'Электростимуляция шейной области', type: 'procedure', schedule: 'Вт, Чт', days: '8/10', status: 'active' }, // CONFLICT with #1 on same day
    { id: 3, name: 'Ароматерапия', type: 'procedure', schedule: 'Ежедневно', days: '18/20', status: 'active' },
    { id: 4, name: 'Суматриптан 50мг', type: 'medication', schedule: 'По потребности', days: '—', status: 'active' },
    { id: 5, name: 'Вальпроевая кислота 500мг', type: 'medication', schedule: '2 раза/день', days: '—', status: 'active' },
  ],
  labResults: [
    { group: 'Биохимия', items: [
      { name: 'Глюкоза', value: '5.0 ммоль/л', norm: '4.1–5.9', status: 'normal' },
    ] },
  ],
  previousVitals: { bp: '135/88', pulse: '80', temp: '36.9', spo2: '97', rr: '16', weight: '64' },
}

// ═══════════════════════════════════════════════════════════════════════
// PATIENT 7 — Зайцев П.Р. (unpaid procedure: Магнитотерапия)
// ═══════════════════════════════════════════════════════════════════════

const patient7: PatientData = {
  profile: {
    id: 7, name: 'Зайцев Павел Романович', age: 55, gender: 'М',
    room: '116', checkIn: '01.08.2026', checkOut: '20.08.2026',
    daysElapsed: 3, daysTotal: 19,
    diagnosis: 'M79.1 — Миалгия',
    diagnosisFull: 'M79.1 — Миалгия. Хронический болевой синдром в мышцах спины и шеи.',
    status: 'Лечится', doctor: 'Иванов И.М.',
    allergies: [],
    restrictions: [],
  },
  vitals: [
    { label: 'АД', value: '132/84', unit: 'мм рт.ст.', status: 'normal' },
    { label: 'Температура', value: '36.8', unit: '°C', status: 'normal' },
    { label: 'СпО2', value: '98', unit: '%', status: 'normal' },
    { label: 'Пульс', value: '72', unit: 'уд/мин', status: 'normal' },
    { label: 'Вес', value: '85', unit: 'кг', status: 'normal' },
  ],
  visits: [
    { id: 1, date: '12.08.2026', time: '09:30', type: 'Терапевт', doctor: 'Иванов И.М.', summary: 'Осмотр. Боль в мышцах спины уменьшилась. Продолжить физиотерапию.', attachments: [] },
    { id: 2, date: '05.08.2026', time: '10:00', type: 'Невролог', doctor: 'Сидорова О.Н.', summary: 'Консультация. Рекомендована магнитотерапия, массаж.', attachments: [
      { name: 'Заключение_невролога_Сидорова.pdf', type: 'pdf' },
    ] },
  ],
  prescriptions: [
    { id: 1, name: 'Магнитотерапия', type: 'procedure', schedule: 'Пн, Ср, Пт', days: '2/10', status: 'active', isPaid: true, paymentRequired: true, paymentDone: false },
    { id: 2, name: 'Массаж спины', type: 'procedure', schedule: 'Вт, Чт', days: '1/8', status: 'active' },
    { id: 3, name: 'Тензорный пластырь', type: 'medication', schedule: '1 раз/день', days: '—', status: 'active' },
    { id: 4, name: 'Мелоксикам 15мг', type: 'medication', schedule: '1 раз/день', days: '—', status: 'active' },
  ],
  labResults: [
    { group: 'Гематология', items: [
      { name: 'Гемоглобин', value: '140 г/л', norm: '130–160', status: 'normal' },
      { name: 'СОЭ', value: '8 мм/ч', norm: '2–15', status: 'normal' },
    ] },
  ],
  previousVitals: { bp: '132/84', pulse: '72', temp: '36.8', spo2: '98', rr: '16', weight: '85' },
}

// ═══════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════

export const allPatients: PatientData[] = [patient1, patient2, patient3, patient4, patient5, patient6, patient7]

export function getPatientById(id: number): PatientData | undefined {
  return allPatients.find(p => p.profile.id === id)
}

/** Compatibility rules: catalog item name → restricted by allergy/restriction */
export const allergyRestrictionMap: Record<string, { type: 'allergy' | 'restriction'; reason: string }[]> = {
  // Patient-specific checks done via patient profile, but catalog-level warnings:
  'Ампициллин':     [{ type: 'allergy', reason: 'Пенициллин (кросс-реактивность)' }],
  'Амоксициллин':   [{ type: 'allergy', reason: 'Пенициллин (кросс-реактивность)' }],
  'Ацетилсалициловая кислота': [{ type: 'allergy', reason: 'Аспирин' }],
  'Ибупрофен':      [{ type: 'allergy', reason: 'Ибупрофен / НПВС-кросс' }],
  'Грязевые аппликации': [{ type: 'restriction', reason: 'Противопоказаны грязевые аппликации' }],
  'Инфракрасная сауна':  [{ type: 'restriction', reason: 'Противопоказаны горячие ванны' }],
  'Криотерапия':         [{ type: 'restriction', reason: 'Противопоказана криотерапия' }],
}
