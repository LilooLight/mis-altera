'use client'

import { useState, useRef, useEffect } from 'react'
import {
  ChevronRight,
  Paperclip,
  Send,
  Phone,
  Video,
  MoreVertical,
  FileText,
  Image as ImageIcon,
  Download,
  Check,
  CheckCheck,
  Search,
  Plus,
  Clock,
} from 'lucide-react'

interface Message {
  id: number
  senderId: 'patient' | 'doctor'
  senderName: string
  text: string
  time: string
  attachment?: {
    type: 'pdf' | 'image'
    name: string
    size: string
    url?: string
  }
  isRead: boolean
}

interface Patient {
  id: number
  name: string
  room: string
  lastMessage: string
  lastMessageTime: string
  unread: number
  isActive: boolean
  avatar: string
  status: 'online' | 'offline'
}

const patients: Patient[] = [
  { id: 1, name: 'Анна Иванова', room: 'Корпус 1, № 215', lastMessage: 'Спасибо!', lastMessageTime: '08:21', unread: 0, isActive: true, avatar: 'АИ', status: 'online' },
  { id: 2, name: 'Мария Петрова', room: 'Корпус 2, № 108', lastMessage: 'Спасибо за рецепт!', lastMessageTime: 'Вчера', unread: 1, isActive: true, avatar: 'МП', status: 'offline' },
  { id: 3, name: 'Алексей Сидоров', room: 'Корпус 1, № 412', lastMessage: 'Когда будут анализы?', lastMessageTime: 'Вчера', unread: 2, isActive: true, avatar: 'АС', status: 'online' },
  { id: 4, name: 'Елена Козлова', room: 'Корпус 3, № 301', lastMessage: 'Можно перенести приём?', lastMessageTime: '12.05', unread: 0, isActive: true, avatar: 'ЕК', status: 'offline' },
  { id: 5, name: 'Дмитрий Волков', room: 'Корпус 2, № 220', lastMessage: 'Добрый день, доктор!', lastMessageTime: '11.05', unread: 0, isActive: false, avatar: 'ДВ', status: 'offline' },
]

const chatMessages: Message[] = [
  {
    id: 1,
    senderId: 'patient',
    senderName: 'Анна Иванова',
    text: 'Добрый день! Пересылаю Вам привезённые результаты анализов.',
    time: '08:19',
    attachment: { type: 'pdf', name: 'Результаты анализов из поликлиники.pdf', size: '1,29 МБ' },
    isRead: true,
  },
  {
    id: 2,
    senderId: 'patient',
    senderName: 'Анна Иванова',
    text: 'На всякий случай высылаю Вам свою фотографию для медицинской карты.',
    time: '08:20',
    attachment: { type: 'image', name: 'Фото для карты.jpg', size: '2,1 МБ' },
    isRead: true,
  },
  {
    id: 3,
    senderId: 'patient',
    senderName: 'Анна Иванова',
    text: 'Могу я перенести запись на приём к Вам на послезавтра на 13:00?',
    time: '08:21',
    isRead: true,
  },
  {
    id: 4,
    senderId: 'doctor',
    senderName: 'Др. Смирнова',
    text: 'Да, конечно. Записала вас на послезавтра, 13:00. Кабинет 204.',
    time: '08:22',
    isRead: true,
  },
  {
    id: 5,
    senderId: 'patient',
    senderName: 'Анна Иванова',
    text: 'Спасибо!',
    time: '08:23',
    isRead: true,
  },
  {
    id: 6,
    senderId: 'doctor',
    senderName: 'Др. Смирнова',
    text: 'Обязательно приходите за 15 минут до приёма. Нужна будет амбулаторная карта.',
    time: '08:24',
    isRead: false,
  },
]

export function MessengerPage() {
  const [selectedPatient, setSelectedPatient] = useState(patients[0])
  const [messages, setMessages] = useState<Message[]>(chatMessages)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!newMessage.trim()) return
    const msg: Message = {
      id: messages.length + 1,
      senderId: 'doctor',
      senderName: 'Др. Смирнова',
      text: newMessage,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    }
    setMessages([...messages, msg])
    setNewMessage('')
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Курортный комплекс</span>
        <ChevronRight className="w-3 h-3" />
        <span>Рабочее место</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#c9a96e] font-medium">Сообщения</span>
      </div>

      {/* Messenger Layout */}
      <div className="bg-white dark:bg-[#151e2e] rounded-xl border border-gray-200 dark:border-[#253041] overflow-hidden flex" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Patient list sidebar */}
        <div className="w-72 border-r border-gray-200 dark:border-[#253041] flex flex-col shrink-0">
          {/* Patient list header */}
          <div className="p-4 border-b border-gray-200 dark:border-[#253041]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-3">
              Мои пациенты
            </h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск пациентов..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 dark:bg-[#0b1120] border border-gray-200 dark:border-[#253041] rounded-lg text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#c9a96e]/50 focus:border-[#c9a96e]"
              />
            </div>
          </div>

          {/* Active dialogues label */}
          <div className="px-4 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Активные диалоги
            </span>
          </div>

          {/* Patient list */}
          <div className="flex-1 overflow-y-auto">
            {patients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                  selectedPatient.id === patient.id
                    ? 'bg-[#c9a96e]/10 dark:bg-[#c9a96e]/15 border-l-2 border-[#c9a96e]'
                    : 'hover:bg-gray-50 dark:hover:bg-[#1e293b]/50 border-l-2 border-transparent'
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedPatient.id === patient.id
                      ? 'bg-[#c9a96e] text-white'
                      : 'bg-[#c9a96e]/15 text-[#c9a96e]'
                  }`}>
                    {patient.avatar}
                  </div>
                  {patient.status === 'online' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#151e2e]" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium truncate ${
                      selectedPatient.id === patient.id
                        ? 'text-[#c9a96e]'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {patient.name}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0 ml-2">
                      {patient.lastMessageTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      {patient.lastMessage}
                    </span>
                    {patient.unread > 0 && (
                      <span className="w-4.5 h-4.5 rounded-full bg-[#c9a96e] text-white text-[10px] font-bold flex items-center justify-center shrink-0 ml-1 px-1">
                        {patient.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-[#253041]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#c9a96e] flex items-center justify-center text-xs font-bold text-white">
                {selectedPatient.avatar}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {selectedPatient.name}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                  <span>{selectedPatient.room}</span>
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                  <span className="text-[#c9a96e]">Консультирую</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">
                <Video className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === 'doctor' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.senderId === 'doctor' ? 'order-2' : 'order-1'}`}>
                  {/* Sender info */}
                  <div className={`flex items-center gap-1.5 mb-1 ${msg.senderId === 'doctor' ? 'justify-end' : ''}`}>
                    <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">{msg.time}</span>
                    {msg.senderId === 'doctor' && (
                      msg.isRead ? (
                        <CheckCheck className="w-3 h-3 text-[#c9a96e]" />
                      ) : (
                        <Check className="w-3 h-3 text-gray-400" />
                      )
                    )}
                  </div>

                  {/* Message bubble */}
                  <div className={`rounded-xl px-4 py-2.5 ${
                    msg.senderId === 'doctor'
                      ? 'bg-[#c9a96e] text-white rounded-br-sm'
                      : 'bg-gray-100 dark:bg-[#1e293b] text-gray-900 dark:text-gray-100 rounded-bl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>

                    {/* Attachment */}
                    {msg.attachment && (
                      <div className={`mt-2 p-2 rounded-lg ${
                        msg.senderId === 'doctor'
                          ? 'bg-white/10'
                          : 'bg-white dark:bg-[#0b1120]'
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded flex items-center justify-center ${
                            msg.attachment.type === 'pdf'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          }`}>
                            {msg.attachment.type === 'pdf' ? (
                              <FileText className="w-4 h-4" />
                            ) : (
                              <ImageIcon className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium truncate ${
                              msg.senderId === 'doctor' ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                            }`}>
                              {msg.attachment.name}
                            </p>
                            <p className={`text-[10px] ${
                              msg.senderId === 'doctor' ? 'text-white/60' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {msg.attachment.size}
                            </p>
                          </div>
                          <button className="p-1.5 rounded-md text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="px-5 py-3 border-t border-gray-200 dark:border-[#253041]">
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-colors shrink-0">
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Напишите сообщение..."
                className="flex-1 px-4 py-2.5 text-sm bg-gray-50 dark:bg-[#0b1120] border border-gray-200 dark:border-[#253041] rounded-lg text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#c9a96e]/50 focus:border-[#c9a96e]"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="px-4 py-2.5 bg-[#c9a96e] text-white rounded-lg text-sm font-medium hover:bg-[#b89558] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 pl-10">
              Нажмите Enter для отправки
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
